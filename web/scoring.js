export const SCORING_VERSION = "1.3.1";
export const EJES = [
  "coord_economica",
  "redistribucion",
  "orden_social",
  "poder_jurisprudencia",
];

const round = (x, d) => {
  const f = 10 ** d;
  return Math.round(x * f) / f;
};

function posicionItem(item, respuesta) {
  if (respuesta === null || respuesta === undefined) return null;
  const tipo = item.tipo_respuesta;
  const ejesItem = Object.keys(item.peso_ejes);

  if (tipo === "acuerdo_5") {
    const r = Number(respuesta);
    if (!(r >= -1 && r <= 1)) {
      throw new Error(`${item.id}: respuesta acuerdo_5 fuera de [-1, 1].`);
    }
    const out = {};
    for (const e of ejesItem) out[e] = item.direccion * r;
    return out;
  }

  if (tipo === "preferencia_5") {
    const r = Math.trunc(Number(respuesta));
    if (![1, 2, 3, 4, 5].includes(r)) {
      throw new Error(`${item.id}: respuesta preferencia_5 debe ser 1..5.`);
    }
    const pa = item.opciones[0].posiciones;
    const pb = item.opciones[1].posiciones;
    const out = {};
    for (const e of ejesItem) {
      out[e] =
        r === 1
          ? pa[e]
          : r === 2
          ? 0.5 * pa[e]
          : r === 3
          ? 0.0
          : r === 4
          ? 0.5 * pb[e]
          : pb[e];
    }
    return out;
  }

  if (tipo === "eleccion_3") {
    const op = item.opciones.find((o) => o.id === respuesta);
    if (!op) throw new Error(`${item.id}: opción '${respuesta}' no válida.`);
    return { ...op.posiciones };
  }

  throw new Error(`Tipo desconocido: ${tipo}`);
}

function magnitudRespuesta(item, respuesta) {
  if (respuesta === null || respuesta === undefined) return null;
  const tipo = item.tipo_respuesta;
  if (tipo === "acuerdo_5") return Math.abs(Number(respuesta));
  if (tipo === "preferencia_5") return Math.abs(Math.trunc(Number(respuesta)) - 3) / 2;
  if (tipo === "eleccion_3") {
    const vals = Object.values(
      item.opciones.find((o) => o.id === respuesta).posiciones
    );
    return vals.reduce((s, v) => s + Math.abs(v), 0) / vals.length;
  }
  return null;
}

export function calcularPerfil(banco, respuestas, opts = {}) {
  const {
    dominiosPrioritarios = null,
    ordenMostrado = null,
    soloNucleo = false,
    minItems = 3,
    minCobertura = 0.6,
    sigmaItemBase = 0.5,
    sigmaFaceta = 0.12,
  } = opts;

  const dominios = new Set(dominiosPrioritarios || []);
  const items = banco.items.filter((it) => !soloNucleo || it.es_nucleo);

  const pesoTotal = Object.fromEntries(EJES.map((e) => [e, 0]));
  const contrib = Object.fromEntries(EJES.map((e) => [e, []]));
  const neutrosPref = Object.fromEntries(EJES.map((e) => [e, 0]));
  const totalPref = Object.fromEntries(EJES.map((e) => [e, 0]));

  const acuerdos = [];
  const posAcuerdo = {};
  const magnitudes = [];
  let primeras = 0;
  let totalConOrden = 0;

  for (const it of items) {
    const qid = it.id;
    const mult = dominios.has(it.dominio) ? 1.5 : 1.0;
    for (const [e, lam] of Object.entries(it.peso_ejes)) {
      pesoTotal[e] += lam * mult;
    }

    const resp = respuestas[qid] ?? null;
    const pos = posicionItem(it, resp);
    const mag = magnitudRespuesta(it, resp);
    if (mag !== null) magnitudes.push(mag);

    if (it.tipo_respuesta === "acuerdo_5" && resp !== null) {
      acuerdos.push(Number(resp));
      posAcuerdo[qid] = it.direccion * Number(resp);
    }

    if (ordenMostrado && ordenMostrado[qid] && resp !== null) {
      const orden = ordenMostrado[qid];
      if (it.tipo_respuesta === "preferencia_5" && Number(resp) !== 3) {
        totalConOrden++;
        const r = Number(resp);
        if (
          (orden[0] === "A" && (r === 1 || r === 2)) ||
          (orden[0] === "B" && (r === 4 || r === 5))
        ) {
          primeras++;
        }
      } else if (it.tipo_respuesta === "eleccion_3") {
        totalConOrden++;
        if (String(resp) === orden[0]) primeras++;
      }
    }

    if (pos === null) continue;

    for (const [e, lam] of Object.entries(it.peso_ejes)) {
      const w = lam * mult;
      const x = pos[e];
      contrib[e].push({
        id: qid,
        enunciado: it.enunciado,
        faceta: it.faceta ?? "general",
        peso: w,
        posicion: x,
        aporte: w * x,
      });
      if (it.tipo_respuesta === "preferencia_5") {
        totalPref[e]++;
        if (Number(resp) === 3) neutrosPref[e]++;
      }
    }
  }

  const ejes = {};
  for (const e of EJES) {
    const lista = contrib[e];
    const n = lista.length;
    const sumW = lista.reduce((s, c) => s + c.peso, 0);
    const cobertura = pesoTotal[e] > 0 ? sumW / pesoTotal[e] : 0;

    if (n < minItems || cobertura < minCobertura) {
      ejes[e] = {
        score: null,
        se: null,
        ic95: null,
        sigma: null,
        n_respondidas: n,
        cobertura: round(cobertura, 3),
        estado: "datos_insuficientes",
        contribuciones: [],
      };
      continue;
    }

    const s = lista.reduce((a, c) => a + c.aporte, 0) / sumW;

    const wFaceta = {};
    for (const c of lista) wFaceta[c.faceta] = (wFaceta[c.faceta] || 0) + c.peso;
    const varClusters = Object.values(wFaceta).reduce(
      (a, wf) => a + wf ** 2 * sigmaFaceta ** 2,
      0
    );
    const varItems = lista.reduce(
      (a, c) => a + c.peso ** 2 * sigmaItemBase ** 2,
      0
    );
    const se = Math.sqrt(varClusters + varItems) / sumW;

    const icLow = Math.max(-1, s - 1.96 * se);
    const icHigh = Math.min(1, s + 1.96 * se);

    let sigma = null;
    if (n >= 4) {
      sigma = Math.sqrt(
        lista.reduce((a, c) => a + c.peso * (c.posicion - s) ** 2, 0) / sumW
      );
    }

    const top = lista
      .map((c) => ({
        id: c.id,
        enunciado: c.enunciado,
        posicion: round(c.posicion, 3),
        impacto: round(c.aporte / sumW, 4),
      }))
      .sort((a, b) => Math.abs(b.impacto) - Math.abs(a.impacto))
      .slice(0, 3);

    ejes[e] = {
      score: round(s, 4),
      se: round(se, 4),
      ic95: [round(icLow, 4), round(icHigh, 4)],
      sigma: sigma !== null ? round(sigma, 4) : null,
      n_respondidas: n,
      cobertura: round(cobertura, 3),
      pct_depende_pref:
        totalPref[e] > 0 ? round(neutrosPref[e] / totalPref[e], 3) : 0.0,
      tension_alta: sigma !== null && sigma >= 0.65,
      estado: "ok",
      contribuciones: top,
    };
  }

  const vistos = new Set();
  const espejos = [];
  for (const it of items) {
    const esp = it.espejo;
    if (esp && !vistos.has(`${esp}|${it.id}`)) {
      vistos.add(`${it.id}|${esp}`);
      if (it.id in posAcuerdo && esp in posAcuerdo) {
        espejos.push({
          par: `${it.id}-${esp}`,
          discrepancia: round(
            Math.abs(posAcuerdo[it.id] - posAcuerdo[esp]) / 2,
            3
          ),
        });
      }
    }
  }

  const aquiescencia = acuerdos.length
    ? round(acuerdos.reduce((a, b) => a + b, 0) / acuerdos.length, 3)
    : null;
  const sesgoPos =
    totalConOrden > 0 ? round(primeras / totalConOrden, 3) : null;
  const magMedia = magnitudes.length
    ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length
    : null;

  const banderas = [];
  if (aquiescencia !== null && Math.abs(aquiescencia) >= 0.75) {
    banderas.push("aquiescencia_extrema");
  }
  if (sesgoPos !== null && (sesgoPos >= 0.8 || sesgoPos <= 0.2)) {
    banderas.push("sesgo_orden_visual");
  }
  if (
    espejos.length &&
    espejos.reduce((a, d) => a + d.discrepancia, 0) / espejos.length >= 0.65
  ) {
    banderas.push("inconsistencia_espejos");
  }
  if (magMedia !== null && magMedia <= 0.05 && magnitudes.length >= 12) {
    banderas.push("respuesta_plana_o_neutra");
  }

  return {
    bank_version: banco.meta.bank_version,
    scoring_version: SCORING_VERSION,
    modo: soloNucleo ? "nucleo_16" : "completo_48",
    ejes,
    indicadores_calidad: {
      aquiescencia_media: aquiescencia,
      sesgo_primera_mostrada: sesgoPos,
      magnitud_media_respuesta: magMedia !== null ? round(magMedia, 4) : null,
      espejos,
      banderas,
    },
  };
}