import { EJES_INFO } from "./contenido.js";
import { fmt } from "./vista.js";

const EJES_ORDEN = ["coord_economica", "redistribucion", "orden_social", "poder_jurisprudencia"];
const LAMBDA_CENTRO = 0.25;
const UMBRAL_SIN_ENCAJE = 0.30;

// Muestreo por rechazo de una normal N(media, sd) condicionada a [-1, 1]
function normalTruncada(media, sd) {
  const m = Math.max(-1, Math.min(1, media));
  if (!sd || sd <= 1e-6) return m;
  for (let i = 0; i < 64; i++) {
    let u1 = 0;
    let u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const x = media + z * sd;
    if (x >= -1 && x <= 1) return x;
  }
  return Math.max(-1, Math.min(1, media));
}

// Distancia de un punto al intervalo [lo, hi] (0 si está dentro)
function distanciaRango(valor, rango) {
  if (!Array.isArray(rango) || rango.length !== 2) return 0;
  const [lo, hi] = rango;
  if (valor < lo) return lo - valor;
  if (valor > hi) return valor - hi;
  return 0;
}

function rmsDistancia(scoresPorEje, rangos) {
  let sumaCuad = 0;
  let k = 0;
  for (const eje of EJES_ORDEN) {
    const r = rangos?.[eje];
    const v = scoresPorEje[eje];
    if (!Array.isArray(r) || typeof v !== "number" || Number.isNaN(v)) continue;
    const d = distanciaRango(v, r);
    sumaCuad += d * d;
    k += 1;
  }
  return k > 0 ? Math.sqrt(sumaCuad / k) : Infinity;
}

function rmsCentro(scoresPorEje, rangos) {
  let sumaCuad = 0;
  let k = 0;
  for (const eje of EJES_ORDEN) {
    const r = rangos?.[eje];
    const v = scoresPorEje[eje];
    if (!Array.isArray(r) || typeof v !== "number" || Number.isNaN(v)) continue;
    const centro = (r[0] + r[1]) / 2;
    const diff = v - centro;
    sumaCuad += diff * diff;
    k += 1;
  }
  return k > 0 ? Math.sqrt(sumaCuad / k) : Infinity;
}

function cumpleCondicionEntrada(familia, baseScores) {
  if (familia.id === "pragmatismo_moderado") {
    return EJES_ORDEN.every(
      (eje) => typeof baseScores[eje] === "number" && Math.abs(baseScores[eje]) <= 0.3
    );
  }
  return true;
}

function construirAvisosPorEje(perfil) {
  const porEje = {};
  for (const eje of EJES_ORDEN) {
    const d = perfil.ejes?.[eje];
    const info = EJES_INFO[eje];
    if (!d || d.estado !== "ok" || !info) continue;
    const avisos = [];
    if (d.ic95 && d.ic95[0] <= 0 && d.ic95[1] >= 0) {
      avisos.push(`En ${info.nombre} tu intervalo incluye el centro: no podemos afirmar hacia qué polo te inclinas.`);
    }
    if (d.tension_alta) {
      avisos.push(`Tus respuestas sobre ${info.nombre} varían mucho según el tema; una sola posición lo resume mal.`);
    }
    if ((d.cobertura ?? 1) < 0.5) {
      avisos.push(`Respondiste ${d.n_respondidas} preguntas en ${info.nombre} (cobertura parcial).`);
    }
    porEje[eje] = avisos;
  }
  return porEje;
}

function describirCoincidencias(rangos, perfil, avisosPorEje) {
  const cerca = [];
  const lejos = [];
  const avisosEje = [];

  for (const eje of EJES_ORDEN) {
    const r = rangos?.[eje];
    const d = perfil.ejes?.[eje];
    const info = EJES_INFO[eje];
    if (!Array.isArray(r) || !d || d.estado !== "ok") continue;

    const dist = distanciaRango(d.score, r);
    const rangoTxt = `${fmt(r[0])} a ${fmt(r[1])}`;
    if (dist <= 0.08) {
      cerca.push(`${info.nombre} (${fmt(d.score)} dentro o muy cerca de ${rangoTxt})`);
    } else if (dist >= 0.35) {
      lejos.push(`${info.nombre} (${fmt(d.score)} frente a ${rangoTxt})`);
    }

    if (avisosPorEje[eje]?.length) {
      avisosEje.push(...avisosPorEje[eje]);
    }
  }

  return { cerca, lejos, avisosEje: [...new Set(avisosEje)] };
}

export function calcularAfinidades(perfil, bancoTendencias, nSim = 800) {
  const familiasRaw = Array.isArray(bancoTendencias?.familias) ? bancoTendencias.familias : [];
  if (!perfil?.ejes || !familiasRaw.length) {
    return {
      candidatas: [],
      empatadas: false,
      sinEncajeClaro: true,
      avisosGenerales: [],
    };
  }

  const baseScores = {};
  const sdPorEje = {};
  for (const eje of EJES_ORDEN) {
    const d = perfil.ejes[eje];
    if (d && d.estado === "ok" && typeof d.score === "number") {
      baseScores[eje] = d.score;
      const ic = d.ic95;
      sdPorEje[eje] = Array.isArray(ic) && ic.length === 2 ? Math.max(0.02, (ic[1] - ic[0]) / 3.92) : 0.12;
    }
  }

  const familiasElegibles = familiasRaw.filter((f) => cumpleCondicionEntrada(f, baseScores));
  if (!familiasElegibles.length) {
    return {
      candidatas: [],
      empatadas: false,
      sinEncajeClaro: true,
      avisosGenerales: [],
    };
  }

  const avisosPorEje = construirAvisosPorEje(perfil);
  const conteoGanadora = Object.fromEntries(familiasElegibles.map((f) => [f.id, 0]));

  for (let s = 0; s < nSim; s++) {
    const muestra = {};
    for (const eje of EJES_ORDEN) {
      if (baseScores[eje] !== undefined) {
        muestra[eje] = normalTruncada(baseScores[eje], sdPorEje[eje]);
      }
    }
    let mejorId = null;
    let mejorClave = Infinity;
    for (const f of familiasElegibles) {
      const clave = rmsDistancia(muestra, f.rangos) + LAMBDA_CENTRO * rmsCentro(muestra, f.rangos);
      if (clave < mejorClave) {
        mejorClave = clave;
        mejorId = f.id;
      }
    }
    if (mejorId) conteoGanadora[mejorId] += 1;
  }

  const evaluadas = familiasElegibles.map((f) => {
    const dist = rmsDistancia(baseScores, f.rangos);
    const clave = dist + LAMBDA_CENTRO * rmsCentro(baseScores, f.rangos);
    const proporcion = conteoGanadora[f.id] / nSim;
    const estabilidad = proporcion >= 0.45 ? "estable" : proporcion >= 0.2 ? "moderada" : "inestable";
    const { cerca, lejos, avisosEje } = describirCoincidencias(f.rangos, perfil, avisosPorEje);
    const definidaEn =
      f.definida_en ?? EJES_ORDEN.filter((e) => Array.isArray(f.rangos?.[e])).length;
    return {
      id: f.id,
      nombre: f.nombre,
      definidaEn,
      parcial: Boolean(f.parcial ?? definidaEn < 4),
      distancia: dist,
      clave,
      estabilidad,
      notaCorriente: f.nota_corriente || "",
      cerca,
      lejos,
      avisosEje,
    };
  });

  evaluadas.sort((a, b) => a.clave - b.clave);

  const sinEncajeClaro = !evaluadas.length || evaluadas[0].distancia > UMBRAL_SIN_ENCAJE;
  const candidatas = sinEncajeClaro ? [] : evaluadas.slice(0, 3);
  const empatadas =
    candidatas.length >= 2 && Math.abs(candidatas[1].distancia - candidatas[0].distancia) < 0.07;

  const avisosGenerales = [];
  if (empatadas) {
    avisosGenerales.push("Varias corrientes quedan a distancia similar; el orden no es significativo.");
  }

  return {
    candidatas,
    empatadas,
    sinEncajeClaro,
    avisosGenerales,
  };
}