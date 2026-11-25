import { EJES_INFO, MENSAJES_BANDERAS } from "./contenido.js";

export const EJES = Object.keys(EJES_INFO);

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Número con coma decimal y signo explícito (−0,42 / +0,42 / 0,00)
export function fmt(n) {
  if (Math.abs(n) < 0.005) return "0,00";
  const t = Math.abs(n).toFixed(2).replace(".", ",");
  return (n > 0 ? "+" : "−") + t;
}

const pct = (v) => (((v + 1) / 2) * 100).toFixed(1);
const clamp = (v, min = -1, max = 1) => Math.max(min, Math.min(max, v));

// Intensidad en porcentaje (0% en el centro, 100% en el extremo del eje)
function intensidadPct(score) {
  return Math.round(Math.min(1, Math.abs(score)) * 100);
}

// Ejemplos concretos por eje y polo para enriquecer "En pocas palabras..."
const EJEMPLOS_RESUMEN = {
  coord_economica: {
    neg: "que empresas y consumidores fijen precios y proyectos con libertad y menos trabas",
    pos: "que las autoridades públicas guíen o regulen sectores clave y actividades económicas",
    neutro: "combinar iniciativa privada y regulación según el sector",
  },
  redistribucion: {
    neg: "impuestos más bajos, menor gasto público y mayor peso del ahorro y la ayuda voluntaria",
    pos: "servicios públicos amplios, apoyo social y redistribución mediante impuestos",
    neutro: "buscar un punto medio entre carga fiscal y protección social",
  },
  orden_social: {
    neg: "libertad personal, estilos de vida diversos y menor intervención moral o cultural",
    pos: "normas compartidas, cohesión social y continuidad de costumbres e instituciones",
    neutro: "equilibrar la autonomía personal con normas comunes de convivencia",
  },
  poder_jurisprudencia: {
    neg: "controles estrictos al poder, garantías legales y descentralización de decisiones",
    pos: "un Ejecutivo con capacidad de decisión firme, orden y autoridad institucional",
    neutro: "mantener contrapesos claros sin restar eficacia para gobernar",
  },
};

// Argumento sólido del polo opuesto por eje ("El otro lado")
const OTRO_LADO_EJE = {
  coord_economica: {
    neg: "Quienes defienden mayor dirección o regulación pública suelen argumentar que los mercados libres pueden generar monopolios, externalidades o inestabilidad si no existen reglas claras y supervisión.",
    pos: "Quienes defienden más iniciativa privada y mercados libres suelen argumentar que la competencia y los precios descentralizados coordinan mejor la información y fomentan la innovación que una oficina pública.",
  },
  redistribucion: {
    neg: "Quienes apoyan mayor redistribución y servicios públicos suelen argumentar que una red de protección común amplía oportunidades reales y reduce carencias que el mercado o la caridad no cubren por sí solos.",
    pos: "Quienes prefieren menor carga fiscal y más responsabilidad individual o voluntaria suelen argumentar que los impuestos altos reducen el incentivo a emprender y trabajar, y que las personas deciden mejor cómo usar su renta.",
  },
  orden_social: {
    neg: "Quienes valoran más la cohesión y las normas compartidas suelen argumentar que una sociedad sana necesita vínculos comunes, continuidad cultural y límites que sostengan la confianza mutua.",
    pos: "Quienes priorizan la autonomía personal y la pluralidad suelen argumentar que cada persona debe definir su proyecto de vida mientras no dañe a terceros, evitando imponer un único modelo moral o cultural.",
  },
  poder_jurisprudencia: {
    neg: "Quienes defienden mayor capacidad ejecutiva y autoridad institucional suelen argumentar que un gobierno con margen de acción claro puede responder con rapidez a crisis, garantizar seguridad y ejecutar políticas.",
    pos: "Quienes prefieren controles estrictos y límites al poder suelen argumentar que concentrar autoridad facilita abusos y que los contrapesos protegen a los ciudadanos incluso cuando cambian los gobiernos.",
  },
};

// Lectura cualitativa de la posición
export function lectura(eje, d) {
  const info = EJES_INFO[eje];
  const a = Math.abs(d.score);
  const nivel = a < 0.15 ? null : a < 0.4 ? "ligera" : a < 0.7 ? "moderada" : "marcada";
  const hacia = d.score > 0 ? info.hacia.pos : info.hacia.neg;
  return {
    nivel,
    intensidad: intensidadPct(d.score),
    titulo: nivel ? `Inclinación ${nivel} hacia ${hacia}` : "Cerca del centro",
    centroPosible: d.ic95[0] <= 0 && d.ic95[1] >= 0,
  };
}

function direccionContribucion(eje, posicion) {
  const info = EJES_INFO[eje];
  if (posicion > 0.05) return `hacia ${info.posCorto.toLowerCase()}`;
  if (posicion < -0.05) return `hacia ${info.negCorto.toLowerCase()}`;
  return "neutra";
}

export function resumenHTML(perfil) {
  return EJES.map((eje) => {
    const d = perfil.ejes[eje];
    const info = EJES_INFO[eje];
    const ej = EJEMPLOS_RESUMEN[eje];
    if (!d || d.estado !== "ok") {
      return `<li><strong>${esc(info.nombre)}:</strong> sin respuestas suficientes en este eje.</li>`;
    }
    const L = lectura(eje, d);
    const ejemplo =
      Math.abs(d.score) < 0.15
        ? ej.neutro
        : d.score > 0
          ? ej.pos
          : ej.neg;
    return `<li><strong>${esc(info.nombre)} (${L.intensidad}%):</strong> ${esc(L.titulo)} — por ejemplo, defenderías ${esc(ejemplo)}.</li>`;
  }).join("");
}

export function textoCompartir(perfil, url = window.location.href) {
  const partes = EJES.map((eje) => {
    const d = perfil?.ejes?.[eje];
    const info = EJES_INFO[eje];
    if (!d || d.estado !== "ok" || !info) return null;
    const L = lectura(eje, d);
    return `• ${info.nombre}: ${L.titulo} (${L.intensidad}%)`;
  }).filter(Boolean);

  const resumen = partes.length
    ? `Mi perfil en Test Político:\n${partes.join("\n")}\n\n`
    : "He completado Test Político.\n\n";

  return `${resumen}¿Coincidimos o nos movemos en ejes distintos? Haz el test aquí y compara tu perfil:\n${url}`;
}

export function tarjetaEje(eje, d) {
  const info = EJES_INFO[eje];
  if (!d || d.estado !== "ok") {
    return `<article class="axis-card eje-${esc(eje)}"><h3>${esc(info.nombre)}</h3>
      <p class="muted">No hay respuestas suficientes en este eje para estimar tu posición.</p></article>`;
  }
  const L = lectura(eje, d);
  const pos = pct(d.score);
  const lo = pct(d.ic95[0]);
  const hi = pct(d.ic95[1]);
  const ancho = Math.max(0.8, hi - lo).toFixed(1);
  const ladoTexto =
    Math.abs(d.score) < 0.15
      ? "Centro"
      : d.score > 0
        ? `${info.posCorto} (${L.intensidad}%)`
        : `${info.negCorto} (${L.intensidad}%)`;
  const aria = `${info.nombre}: ${L.titulo}, intensidad ${L.intensidad}%, posición ${fmt(d.score)}`;

  const otroLado =
    Math.abs(d.score) >= 0.15
      ? d.score > 0
        ? OTRO_LADO_EJE[eje]?.pos
        : OTRO_LADO_EJE[eje]?.neg
      : null;

  const contribs = (d.contribuciones || [])
    .map(
      (c) =>
        `<li>${esc(c.enunciado)} <span class="tag">${esc(direccionContribucion(eje, c.posicion))}</span></li>`
    )
    .join("");

  const coberturaPct = Math.min(100, Math.round(d.cobertura * 100));

  return `<article class="axis-card eje-${esc(eje)}">
    <div class="axis-top">
      <div>
        <h3>${esc(info.nombre)}</h3>
        <p class="reading">${esc(L.titulo)}</p>
      </div>
      <span class="axis-badge">${esc(ladoTexto)}</span>
    </div>
    <p class="axis-desc">${esc(info.descripcion)}</p>
    <div class="spectrum" role="img" aria-label="${esc(aria)}">
      <div class="spectrum-poles"><span>${esc(info.neg)}</span><span>${esc(info.pos)}</span></div>
      <div class="spectrum-track">
        <span class="tick" style="left:25%"></span><span class="tick center" style="left:50%"></span><span class="tick" style="left:75%"></span>
        <div class="spectrum-ic" style="left:${lo}%;width:${ancho}%"></div>
        <div class="spectrum-marker" style="left:${pos}%"></div>
      </div>
    </div>
    <p class="axis-numbers">Intensidad <strong>${L.intensidad}%</strong> · Índice <strong>${fmt(d.score)}</strong> (margen probable de ${fmt(d.ic95[0])} a ${fmt(d.ic95[1])})</p>
    ${L.centroPosible && L.nivel ? `<p class="muted small">Con tus respuestas no se puede descartar una postura cercana al centro.</p>` : ""}
    ${d.tension_alta ? `<p class="chip-note">Respuestas variadas: según el tema concreto, tus respuestas en este eje apuntan hacia ambos lados y el promedio puede suavizarlo.</p>` : ""}
    ${
      otroLado
        ? `<details class="detail otro-lado">
            <summary>El otro lado</summary>
            <p class="small otro-lado-texto">${esc(otroLado)}</p>
          </details>`
        : ""
    }
    <details class="detail">
      <summary>Ver más detalles</summary>
      <ul class="detail-list">
        <li>Preguntas respondidas en este eje: <strong>${d.n_respondidas}</strong> (${coberturaPct}% del peso del eje).</li>
        <li>Variación interna (σ): <strong>${d.sigma === null ? "no calculable" : d.sigma.toFixed(2).replace(".", ",")}</strong>. Muestra cuánto cambian tus respuestas según el tema dentro de este eje.</li>
      </ul>
      ${contribs ? `<p class="small"><strong>Respuestas que más influyeron:</strong></p><ul class="contrib">${contribs}</ul>` : ""}
    </details>
  </article>`;
}

// Detecta combinaciones interesantes entre ejes para "Tus contrastes"
export function contrastesHTML(perfil) {
  const ejes = perfil?.ejes || {};
  const ok = (k) => ejes[k]?.estado === "ok";
  const s = (k) => ejes[k]?.score ?? 0;

  const hallazgos = [];

  if (ok("coord_economica") && ok("redistribucion")) {
    if (s("coord_economica") < -0.25 && s("redistribucion") > 0.25) {
      hallazgos.push({
        titulo: "Mercado y redistribución",
        texto: "Prefieres coordinación de mercado en lo económico, pero apoyas más redistribución o apoyo público. Es un cruce habitual: confiar en la eficiencia del mercado para producir y, a la vez, querer una red de protección común.",
      });
    } else if (s("coord_economica") > 0.25 && s("redistribucion") < -0.25) {
      hallazgos.push({
        titulo: "Regulación y contención fiscal",
        texto: "Te inclinas por mayor guía o regulación pública en ciertos ámbitos económicos, pero prefieres menor carga fiscal o redistribución. Un matiz interesante entre intervención selectiva y prudencia en los impuestos.",
      });
    }
  }

  if (ok("orden_social") && ok("poder_jurisprudencia")) {
    if (s("orden_social") < -0.25 && s("poder_jurisprudencia") > 0.25) {
      hallazgos.push({
        titulo: "Autonomía personal y autoridad estatal",
        texto: "Valoras la libertad y diversidad en la vida social, pero ves con buenos ojos una autoridad ejecutiva firme o mayor capacidad de decisión del Estado.",
      });
    } else if (s("orden_social") > 0.25 && s("poder_jurisprudencia") < -0.25) {
      hallazgos.push({
        titulo: "Cohesión social y límites al poder",
        texto: "Aprecias las normas compartidas y la continuidad social, pero prefieres límites firmes y contrapesos frente al poder de los gobernantes.",
      });
    }
  }

  if (ok("coord_economica") && ok("orden_social")) {
    if (s("coord_economica") < -0.25 && s("orden_social") > 0.25) {
      hallazgos.push({
        titulo: "Libertad económica y cohesión social",
        texto: "Combinas iniciativa de mercado en lo económico con preferencia por normas comunes o cohesión en lo social, un rasgo clásico de corrientes conservadoras liberales.",
      });
    } else if (s("coord_economica") > 0.25 && s("orden_social") < -0.25) {
      hallazgos.push({
        titulo: "Dirección pública y autonomía individual",
        texto: "Unes mayor papel público en la economía con defensa de la autonomía personal en la vida cotidiana.",
      });
    }
  }

  if (!hallazgos.length) {
    return `<p class="muted">Tus respuestas mantienen una coherencia bastante alineada entre ejes o se sitúan en zonas intermedias sin contrastes bruscos.</p>`;
  }

  return `<div class="contrastes-grid">${hallazgos
    .slice(0, 3)
    .map(
      (h) => `<article class="contraste-item">
        <h4>${esc(h.titulo)}</h4>
        <p>${esc(h.texto)}</p>
      </article>`
    )
    .join("")}</div>`;
}

export function notaBanderas(perfil, sinResponder = 0) {
  const banderas = perfil.indicadores_calidad?.banderas || [];
  const items = banderas.map((b) => MENSAJES_BANDERAS[b] || b);
  if (sinResponder > 0) {
    items.push(`Dejaste sin responder ${sinResponder} ${sinResponder === 1 ? "pregunta" : "preguntas"}.`);
  }
  if (!items.length) return "";
  return `<details class="note">
    <summary>Una nota sobre tus respuestas (${items.length})</summary>
    <ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <p class="muted small">Esto puede responder a matices legítimos; simplemente conviene interpretar el resultado con calma.</p>
  </details>`;
}

// Tarjeta informativa de la pestaña "Ejes y polos" (sin marcador)
export function ejeInfoHTML(eje) {
  const info = EJES_INFO[eje];
  return `<article class="card axis-info eje-${esc(eje)}">
    <h3>${esc(info.nombre)}</h3>
    <p>${esc(info.descripcion)}</p>
    <div class="spectrum">
      <div class="spectrum-poles"><span>${esc(info.neg)}</span><span>${esc(info.pos)}</span></div>
      <div class="spectrum-track"><span class="tick center" style="left:50%"></span></div>
    </div>
    <p class="muted small">Temas que mide: ${info.ejemplos.map(esc).join(" · ")}.</p>
  </article>`;
}

// Dimensión compuesta a partir de dos ejes: media, intervalo combinado y avisos.
const UMBRAL_DISCREPANCIA = 0.6;

function ejeCompuesto(d1, d2) {
  const validos = [d1, d2].filter((d) => d && d.estado === "ok");
  if (!validos.length) return null;
  const score = validos.reduce((acc, d) => acc + d.score, 0) / validos.length;
  const ses = validos.map((d) => {
    const lo = Array.isArray(d.ic95) ? d.ic95[0] : d.score - 0.15;
    const hi = Array.isArray(d.ic95) ? d.ic95[1] : d.score + 0.15;
    return Math.max(0.02, (hi - lo) / 3.92);
  });
  const seComp = ses.length === 2 ? Math.sqrt(ses[0] * ses[0] + ses[1] * ses[1]) / 2 : ses[0];
  const delta = 1.96 * seComp;
  return {
    score: clamp(score),
    ic95: [clamp(score - delta), clamp(score + delta)],
    tension: validos.some((d) => d.tension_alta),
    discrepan: validos.length === 2 && Math.abs(validos[0].score - validos[1].score) > UMBRAL_DISCREPANCIA,
    unico: validos.length === 1,
  };
}

const ECON_POSITIVO_A_LA_IZQUIERDA = true;
const VB = 400;
const M = 24;
const C = VB / 2;
const S = C - M;
const R_PUNTO = 8;
const CAP = 6;

const gx = (v) => C + (ECON_POSITIVO_A_LA_IZQUIERDA ? -1 : 1) * clamp(v) * S;
const gy = (v) => C - clamp(v) * S;
const f1 = (n) => n.toFixed(1);

const MARGEN_EJE = {
  coord_economica: { horizontal: true, pos: VB - 8, lado: "inferior" },
  redistribucion: { horizontal: true, pos: VB - 17, lado: "inferior" },
  orden_social: { horizontal: false, pos: 8, lado: "izquierdo" },
  poder_jurisprudencia: { horizontal: false, pos: 17, lado: "izquierdo" },
};

function barraIC(x1, y1, x2, y2, horizontal, discontinua) {
  const trazo = `M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}`;
  const tope = (x, y) =>
    horizontal ? `M${f1(x)} ${f1(y - CAP)}V${f1(y + CAP)}` : `M${f1(x - CAP)} ${f1(y)}H${f1(x + CAP)}`;
  const topes = tope(x1, y1) + tope(x2, y2);
  return `<g class="dg-ic">
    <path class="dg-ic-halo" d="${trazo}${topes}"/>
    <path class="dg-ic-cap" d="${topes}"/>
    <path class="dg-ic-core${discontinua ? " disc" : ""}" d="${trazo}"/>
  </g>`;
}

export function diagramaNolanSVG(perfil) {
  const ejes = perfil?.ejes || {};
  const econ = ejeCompuesto(ejes.coord_economica, ejes.redistribucion);
  const soc = ejeCompuesto(ejes.orden_social, ejes.poder_jurisprudencia);

  const POLO_ECON_POS = "Dirección y redistribución";
  const POLO_ECON_NEG = "Mercado y menos impuestos";
  const POLO_SOC_POS = "Cohesión y autoridad";
  const POLO_SOC_NEG = "Autonomía y límites";
  const izq = ECON_POSITIVO_A_LA_IZQUIERDA ? POLO_ECON_POS : POLO_ECON_NEG;
  const der = ECON_POSITIVO_A_LA_IZQUIERDA ? POLO_ECON_NEG : POLO_ECON_POS;

  const x0 = M, x1 = VB - M, y0 = M, y1 = VB - M;
  let g = "";

  g += `<rect class="dg-frame" x="1" y="1" width="${VB - 2}" height="${VB - 2}" rx="6"/>`;
  g += `<rect class="dg-q dg-q-tl" x="${x0}" y="${y0}" width="${S}" height="${S}"/>`;
  g += `<rect class="dg-q dg-q-tr" x="${C}" y="${y0}" width="${S}" height="${S}"/>`;
  g += `<rect class="dg-q dg-q-bl" x="${x0}" y="${C}" width="${S}" height="${S}"/>`;
  g += `<rect class="dg-q dg-q-br" x="${C}" y="${C}" width="${S}" height="${S}"/>`;
  g += `<rect class="dg-plot" x="${x0}" y="${y0}" width="${2 * S}" height="${2 * S}"/>`;
  for (const t of [C - S / 2, C + S / 2]) {
    g += `<line class="dg-grid" x1="${t}" y1="${y0}" x2="${t}" y2="${y1}"/>`;
    g += `<line class="dg-grid" x1="${x0}" y1="${t}" x2="${x1}" y2="${t}"/>`;
  }
  g += `<line class="dg-axis" x1="${x0}" y1="${C}" x2="${x1}" y2="${C}"/>`;
  g += `<line class="dg-axis" x1="${C}" y1="${y0}" x2="${C}" y2="${y1}"/>`;

  for (const eje of EJES) {
    const d = ejes[eje];
    const m = MARGEN_EJE[eje];
    if (!m || !d || d.estado !== "ok") continue;
    const cx = m.horizontal ? gx(d.score) : m.pos;
    const cy = m.horizontal ? m.pos : gy(d.score);
    g += `<circle class="dg-rug eje-${esc(eje)}" cx="${f1(cx)}" cy="${f1(cy)}" r="3.4"/>`;
  }

  let lecturaCorta = "Completa el test para ver tu orientación política resumida en el diagrama.";
  const notas = [];
  let aria = "Diagrama de orientación política entre economía y sociedad. Sin datos suficientes.";

  if (econ && soc) {
    const px = gx(econ.score);
    const py = gy(soc.score);

    g += barraIC(gx(econ.ic95[0]), py, gx(econ.ic95[1]), py, true, econ.tension || econ.discrepan);
    g += barraIC(px, gy(soc.ic95[0]), px, gy(soc.ic95[1]), false, soc.tension || soc.discrepan);
    g += `<circle class="dg-pt" cx="${f1(px)}" cy="${f1(py)}" r="${R_PUNTO}"/>`;

    const ladoEcon =
      Math.abs(econ.score) < 0.15 ? "en un punto equilibrado" : `hacia «${econ.score < 0 ? POLO_ECON_NEG : POLO_ECON_POS}»`;
    const ladoSoc =
      Math.abs(soc.score) < 0.15 ? "en un punto intermedio" : `hacia «${soc.score < 0 ? POLO_SOC_NEG : POLO_SOC_POS}»`;
    const cruzaCentro =
      (econ.ic95[0] <= 0 && econ.ic95[1] >= 0) || (soc.ic95[0] <= 0 && soc.ic95[1] >= 0);

    lecturaCorta = `En economía tu posición cae ${ladoEcon}; en sociedad, ${ladoSoc}.${cruzaCentro ? " El margen probable alcanza la zona central en al menos una dimensión." : ""}`;

    if (econ.tension || econ.discrepan || soc.tension || soc.discrepan) {
      notas.push(
        "Una línea discontinua indica que, en esa dimensión, tus respuestas varían mucho según el tema o que los dos ejes que la componen apuntan a lados distintos: la media puede resumirlo mal. Los puntos de los márgenes muestran cada eje por separado."
      );
    }
    if (econ.unico || soc.unico) {
      notas.push("Alguna dimensión se ha calculado con un solo eje porque faltan respuestas en el otro.");
    }

    aria = `Diagrama de orientación política. Economía ${fmt(econ.score)} (margen de ${fmt(econ.ic95[0])} a ${fmt(econ.ic95[1])}); ` +
      `Sociedad ${fmt(soc.score)} (margen de ${fmt(soc.ic95[0])} a ${fmt(soc.ic95[1])}). ` +
      `En economía, positivo es ${POLO_ECON_POS} y negativo ${POLO_ECON_NEG}; en sociedad, positivo es ${POLO_SOC_POS} y negativo ${POLO_SOC_NEG}.`;
  }

  const leyenda = EJES.filter((e) => MARGEN_EJE[e] && ejes[e]?.estado === "ok")
    .map(
      (e) =>
        `<li class="eje-${esc(e)}"><span class="dg-dot" aria-hidden="true"></span>${esc(EJES_INFO[e].nombre)} <span class="nolan-lado">· margen ${MARGEN_EJE[e].lado}</span></li>`
    )
    .join("");

  const polo = (clase, flecha, eje, texto, flechaAntes = true) =>
    `<p class="nolan-pole ${clase}"><span class="nolan-eje">${flechaAntes ? `<span aria-hidden="true">${flecha}</span> ` : ""}${eje}${flechaAntes ? "" : ` <span aria-hidden="true">${flecha}</span>`}</span>${esc(texto)}</p>`;

  return `<figure class="nolan">
    <div class="nolan-grid">
      ${polo("nolan-top", "↑", "Sociedad", POLO_SOC_POS)}
      ${polo("nolan-left", "←", "Economía", izq)}
      <svg class="nolan-svg" viewBox="0 0 ${VB} ${VB}" role="img" aria-label="${esc(aria)}">${g}</svg>
      ${polo("nolan-right", "→", "Economía", der, false)}
      ${polo("nolan-bottom", "↓", "Sociedad", POLO_SOC_NEG)}
    </div>
    ${leyenda ? `<ul class="nolan-leyenda" aria-label="Cada eje por separado">${leyenda}</ul>` : ""}
    <p class="nolan-lectura">${esc(lecturaCorta)}</p>
    ${notas.map((t) => `<p class="nolan-nota">${esc(t)}</p>`).join("")}
  </figure>`;
}

function formatearFilaEje(linea) {
  const match = linea.match(/^(.+?)\s+\(([^)]+)\)$/);
  if (!match) return `<span class="af-line-text">${esc(linea)}</span>`;
  const nombre = esc(match[1]);
  const detalle = match[2];
  const partes = detalle.split(/\s+(?:dentro o muy cerca de|frente a)\s+/);
  if (partes.length !== 2) {
    return `<span class="af-eje-name">${nombre}</span> <span class="af-num">${esc(detalle)}</span>`;
  }
  const esCerca = detalle.includes("dentro o muy cerca de");
  const estadoTag = esCerca ? "Cerca o dentro" : "Diferencia";
  const estadoClase = esCerca ? "af-estado ok" : "af-estado diff";
  return `
    <span class="af-eje-name">${nombre}</span>
    <span class="af-nums">
      <strong class="af-num">${esc(partes[0])}</strong>
      <span class="af-sep">·</span>
      <span class="af-range">rango ${esc(partes[1])}</span>
    </span>
    <span class="${estadoClase}">${esc(estadoTag)}</span>
  `;
}

export function tarjetaAfinidadResultado(c) {
  const cercaItems = (c.cerca || []).map(
    (item) => `<li class="af-eje-row">${formatearFilaEje(item)}</li>`
  );
  const lejosItems = (c.lejos || []).map(
    (item) => `<li class="af-eje-row">${formatearFilaEje(item)}</li>`
  );

  const cautelas = (c.avisosEje || [])
    .map((w) => `<li>${esc(w)}</li>`)
    .join("");

  return `<article class="af-card">
    <h4>${esc(c.nombre)}</h4>
    <p class="af-desc">${esc(c.notaCorriente)}</p>
    <div class="af-detalle-panel" hidden>
      <div class="af-detalle-body">
        ${
          cercaItems.length
            ? `<div class="af-grupo">
                <p class="af-grupo-titulo">Mayor cercanía</p>
                <ul class="af-eje-lista">${cercaItems.join("")}</ul>
              </div>`
            : ""
        }
        ${
          lejosItems.length
            ? `<div class="af-grupo">
                <p class="af-grupo-titulo">Diferencias o matices</p>
                <ul class="af-eje-lista">${lejosItems.join("")}</ul>
              </div>`
            : ""
        }
        ${
          cautelas
            ? `<div class="af-grupo">
                <p class="af-grupo-titulo">Notas del cálculo</p>
                <ul class="af-cautelas">${cautelas}</ul>
              </div>`
            : ""
        }
      </div>
    </div>
  </article>`;
}

export function afGridHTML(candidatas) {
  return `<div class="af-bloque">
    <div class="af-toolbar">
      <button type="button" class="btn small af-toggle-todos" aria-expanded="false">Ver más detalles</button>
    </div>
    <div class="af-grid">${candidatas.map(tarjetaAfinidadResultado).join("")}</div>
  </div>`;
}

function inicialesAutor(nombre = "") {
  const partes = String(nombre).trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function resolverRutaAsset(src = "") {
  const limpio = String(src || "").trim().replace(/\\/g, "/");
  if (!limpio) return "";
  const base = /^(https?:\/\/|\/|\.\.\/)/.test(limpio)
    ? limpio
    : limpio.startsWith("assets/")
      ? `../${limpio}`
      : limpio;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}v=23112026_3`;
}

function autorCardHTML(autor) {
  const nombre = autor?.nombre || "";
  const epoca = autor?.epoca || "";
  const aporte = autor?.aporte || "";
  const imgSrc = resolverRutaAsset(autor?.ilustracion || "");
  const ini = inicialesAutor(nombre);

  const img = imgSrc
    ? `<img class="af-autor-img" src="${esc(imgSrc)}" alt="" decoding="async">`
    : "";

  return `<li class="af-autor-card">
    <div class="af-autor-avatar" aria-hidden="true">
      <span class="af-autor-ini">${esc(ini)}</span>${img}
    </div>
    <div class="af-autor-info">
      <div class="af-autor-head">
        <strong class="af-autor-nombre">${esc(nombre)}</strong>
        ${epoca ? `<span class="af-autor-epoca">${esc(epoca)}</span>` : ""}
      </div>
      ${aporte ? `<p class="af-autor-aporte">${esc(aporte)}</p>` : ""}
    </div>
  </li>`;
}

(function () {
  const esRetrato = (el) => el instanceof HTMLImageElement && el.classList.contains("af-autor-img");

  document.addEventListener("load", (e) => {
    const el = e.target;
    if (!esRetrato(el)) return;
    if (el.naturalWidth > 0) el.classList.add("is-ok");
    else el.remove();
  }, true);

  document.addEventListener("error", (e) => {
    const el = e.target;
    if (!esRetrato(el)) return;
    console.warn("Retrato no cargado:", el.src);
    el.remove();
  }, true);
})();

function familiasOrdenadas(bancoTendencias) {
  return [...(Array.isArray(bancoTendencias?.familias) ? bancoTendencias.familias : [])].sort(
    (a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
}

// Etiqueta breve y matizada por corriente para evitar repeticiones genéricas
const ETIQUETAS_CORRIENTE_POR_ID = {
  anarcocapitalismo: "Sin Estado · acuerdo voluntario",
  autoritarismo_estatista: "Mando central · control estatal",
  comunismo_planificacion: "Planificación · propiedad colectiva",
  comunitarismo_humanismo: "Comunidad y vínculos · apoyo social",
  conservadurismo_liberal: "Mercado y tradición · prudencia fiscal",
  conservadurismo_tradicional: "Continuidad y normas · orden social",
  socialdemocracia: "Economía mixta · bienestar público",
  liberalismo_igualitario: "Libertades civiles · igualdad de oportunidades",
  libertarismo_minarquista: "Estado mínimo · autonomía individual",
  perfil_moderado: "Matiz intermedio · enfoque gradual",
  republicanismo_civico: "Controles al poder · virtud cívica",
  socialismo_democratico: "Democracia económica · sector público",
  socialismo_libertario: "Autogestión · rechazo a jerarquías",
  liberalismo_clasico: "Mercado abierto · imperio de la ley",
};

function etiquetaOrientacionCorriente(f) {
  if (f?.id && ETIQUETAS_CORRIENTE_POR_ID[f.id]) {
    return ETIQUETAS_CORRIENTE_POR_ID[f.id];
  }

  const r = f?.rangos || {};
  const partes = [];
  if (Array.isArray(r.coord_economica)) {
    const mid = (r.coord_economica[0] + r.coord_economica[1]) / 2;
    if (mid <= -0.35) partes.push("iniciativa de mercado");
    else if (mid >= 0.35) partes.push("regulación o guía pública");
  }
  if (Array.isArray(r.redistribucion)) {
    const mid = (r.redistribucion[0] + r.redistribucion[1]) / 2;
    if (mid <= -0.35) partes.push("menor carga fiscal");
    else if (mid >= 0.35) partes.push("mayor redistribución");
  }
  if (!partes.length && Array.isArray(r.orden_social)) {
    const mid = (r.orden_social[0] + r.orden_social[1]) / 2;
    if (mid <= -0.35) partes.push("autonomía personal");
    else if (mid >= 0.35) partes.push("normas compartidas");
  }
  if (!partes.length && Array.isArray(r.poder_jurisprudencia)) {
    const mid = (r.poder_jurisprudencia[0] + r.poder_jurisprudencia[1]) / 2;
    if (mid <= -0.35) partes.push("contrapesos al poder");
    else if (mid >= 0.35) partes.push("autoridad institucional");
  }

  return partes.length ? partes.slice(0, 2).join(" · ") : "Equilibrio entre ejes";
}

function ejePredominanteCorriente(f) {
  const r = f?.rangos || {};
  let mejorEje = "coord_economica";
  let maxDist = -1;
  for (const [eje, rango] of Object.entries(r)) {
    if (!Array.isArray(rango) || rango.length !== 2) continue;
    const dist = Math.abs((rango[0] + rango[1]) / 2);
    if (dist > maxDist) {
      maxDist = dist;
      mejorEje = eje;
    }
  }
  return mejorEje;
}

// Índice rápido superior para ver todas las corrientes de golpe y saltar sin scroll pesado
export function indiceAfinidadesHTML(bancoTendencias) {
  const familias = familiasOrdenadas(bancoTendencias);
  if (!familias.length) return "";

  return `<nav class="card af-indice-card" aria-label="Índice rápido de corrientes">
    <div class="af-indice-head">
      <p class="eyebrow">Vista rápida · ${familias.length} corrientes</p>
      <h3 class="af-indice-titulo">Ir directamente a una corriente</h3>
    </div>
    <ul class="af-indice-lista">
      ${familias
        .map((f) => {
          const eje = ejePredominanteCorriente(f);
          const rasgo = etiquetaOrientacionCorriente(f);
          return `<li class="af-indice-item">
            <a class="af-indice-link eje-${esc(eje)}" href="#af-${esc(f.id)}" data-af-jump="${esc(f.id)}">
              <span class="af-indice-icono" aria-hidden="true"></span>
              <div class="af-indice-texto">
                <span class="af-indice-etiqueta">${esc(rasgo)}</span>
                <span class="af-indice-nombre">${esc(f.nombre)}</span>
              </div>
            </a>
          </li>`;
        })
        .join("")}
    </ul>
  </nav>`;
}

// Vista completa de todas las corrientes en la pestaña "Afinidades" con pestañas internas por ficha
export function catalogoAfinidadesHTML(bancoTendencias) {
  const familias = familiasOrdenadas(bancoTendencias);

  if (!familias.length) {
    return `<div class="card"><p class="muted">No hay corrientes cargadas por el momento.</p></div>`;
  }

  return `<div class="af-catalogo-grid">${familias
    .map((f, idx) => {
      const ejesDefinidos = Object.entries(f.rangos || {})
        .filter(([, r]) => Array.isArray(r) && r.length === 2)
        .map(([eje]) => EJES_INFO[eje]?.nombre)
        .filter(Boolean);

      const det = f.detalles || {};
      const autores = Array.isArray(det.autores) ? det.autores : [];
      const enlaces = Array.isArray(det.enlaces) ? det.enlaces : [];
      const baseId = `af-${esc(f.id || idx)}`;

      return `<article id="${baseId}" class="card af-cat-card" data-af-id="${esc(f.id || idx)}">
        <h3 class="af-cat-title">${esc(f.nombre)}</h3>
        <p class="af-cat-summary">${esc(f.nota_corriente || "")}</p>
        <details class="detail af-detail">
          <summary>Ver más detalles</summary>
          <div class="af-more-box">
            ${det.cita ? `<blockquote class="af-cita">${esc(det.cita)}</blockquote>` : ""}

            <div class="af-subtabs" role="tablist" aria-label="Secciones de ${esc(f.nombre)}">
              <button type="button" role="tab" class="af-subtab is-active" aria-selected="true" data-subtab="esencia">Esencia y economía</button>
              <button type="button" role="tab" class="af-subtab" aria-selected="false" data-subtab="autores">Autores y origen</button>
              <button type="button" role="tab" class="af-subtab" aria-selected="false" data-subtab="curiosidades">Curiosidades y enlaces</button>
            </div>

            <div class="af-subpanel" data-subpanel="esencia">
              ${det.defienden ? `<p class="af-more-item"><strong>Qué defienden:</strong> ${esc(det.defienden)}</p>` : ""}
              ${det.economia_politica ? `<p class="af-more-item"><strong>Enfoque económico y político:</strong> ${esc(det.economia_politica)}</p>` : ""}
              ${det.filosofia_etica ? `<p class="af-more-item"><strong>Filosofía y ética:</strong> ${esc(det.filosofia_etica)}</p>` : ""}
            </div>

            <div class="af-subpanel" data-subpanel="autores" hidden>
              ${det.origen ? `<p class="af-more-item"><strong>Origen:</strong> ${esc(det.origen)}</p>` : ""}
              ${
                autores.length
                  ? `<ul class="af-autores-lista">${autores.map(autorCardHTML).join("")}</ul>`
                  : ""
              }
            </div>

            <div class="af-subpanel" data-subpanel="curiosidades" hidden>
              ${det.curiosidades ? `<p class="af-more-item"><strong>Datos curiosos:</strong> ${esc(det.curiosidades)}</p>` : ""}
              ${
                ejesDefinidos.length
                  ? `<p class="muted small af-ejes-line"><strong>Dimensiones asociadas:</strong> ${ejesDefinidos.map(esc).join(" · ")}.</p>`
                  : ""
              }
              ${
                enlaces.length
                  ? `<div class="af-enlaces-box">
                      <p class="af-grupo-titulo">Lecturas externas</p>
                      <ul class="af-enlaces-lista">
                        ${enlaces
                          .filter((l) => l?.url && l?.titulo)
                          .map(
                            (l) =>
                              `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.titulo)} <span aria-hidden="true">↗</span></a></li>`
                          )
                          .join("")}
                      </ul>
                    </div>`
                  : ""
              }
            </div>
          </div>
        </details>
      </article>`;
    })
    .join("")}</div>`;
}