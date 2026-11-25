import { obtenerEjesInfo, obtenerMensajesBanderas } from "./contenido.js";

export const EJES = Object.keys(obtenerEjesInfo("es"));

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function obtenerIdiomaActual(lang) {
  if (lang === "en" || lang === "es") return lang;
  const docLang = (document?.documentElement?.lang || "es").toLowerCase();
  return docLang.startsWith("en") ? "en" : "es";
}

// Número con coma decimal en ES (−0,42 / +0,42 / 0,00) o punto decimal en EN (−0.42 / +0.42 / 0.00)
export function fmt(n, lang) {
  const l = obtenerIdiomaActual(lang);
  const sep = l === "en" ? "." : ",";
  if (Math.abs(n) < 0.005) return `0${sep}00`;
  const t = Math.abs(n).toFixed(2).replace(".", sep);
  return (n > 0 ? "+" : "−") + t;
}

const pct = (v) => (((v + 1) / 2) * 100).toFixed(1);
const clamp = (v, min = -1, max = 1) => Math.max(min, Math.min(max, v));

function intensidadPct(score) {
  return Math.round(Math.min(1, Math.abs(score)) * 100);
}

const EJEMPLOS_RESUMEN_POR_IDIOMA = {
  es: {
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
  },
  en: {
    coord_economica: {
      neg: "letting firms and consumers set prices and projects freely with fewer hurdles",
      pos: "having public authorities guide or regulate key sectors and economic activity",
      neutro: "combining private initiative and regulation depending on the sector",
    },
    redistribucion: {
      neg: "lower taxes, smaller public spending, and more weight on savings and voluntary aid",
      pos: "broad public services, social support, and redistribution through taxation",
      neutro: "finding a middle ground between tax burden and social protection",
    },
    orden_social: {
      neg: "personal freedom, diverse lifestyles, and less moral or cultural intervention",
      pos: "shared norms, social cohesion, and continuity of customs and institutions",
      neutro: "balancing personal autonomy with common rules for living together",
    },
    poder_jurisprudencia: {
      neg: "strict checks on power, legal safeguards, and decentralized decision-making",
      pos: "an executive with firm decision-making capacity, order, and institutional authority",
      neutro: "keeping clear checks and balances without hampering effective governance",
    },
  },
};

const OTRO_LADO_EJE_POR_IDIOMA = {
  es: {
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
  },
  en: {
    coord_economica: {
      neg: "Supporters of greater public direction or regulation often argue that free markets can produce monopolies, externalities, or instability without clear rules and oversight.",
      pos: "Supporters of greater private initiative and free markets often argue that competition and decentralized prices coordinate information and foster innovation better than a public agency.",
    },
    redistribucion: {
      neg: "Supporters of stronger redistribution and public services often argue that a shared safety net expands real opportunity and addresses needs that markets or charity alone do not meet.",
      pos: "Those who prefer lower taxes and more individual or voluntary responsibility often argue that high taxes reduce incentives to start ventures and work, and that people decide best how to use their income.",
    },
    orden_social: {
      neg: "Those who value cohesion and shared norms more often argue that a healthy society needs common bonds, cultural continuity, and limits that sustain mutual trust.",
      pos: "Those who prioritize personal autonomy and plurality often argue that each person should define their own way of life so long as they do not harm others, avoiding a single imposed moral or cultural model.",
    },
    poder_jurisprudencia: {
      neg: "Supporters of stronger executive capacity and institutional authority often argue that a government with clear room to act can respond quickly to crises, maintain security, and implement policy.",
      pos: "Those who prefer strict checks and limits on power often argue that concentrating authority invites abuse and that safeguards protect citizens even as governments change.",
    },
  },
};

const TEXTOS_VISTA = {
  es: {
    levels: { slight: "ligera", moderate: "moderada", marked: "marcada" },
    nearCenter: "Cerca del centro",
    leanPrefix: (nivel, hacia) => `Inclinación ${nivel} hacia ${hacia}`,
    towardPrefix: (s) => `hacia ${s}`,
    neutral: "neutra",
    insufficientSummary: (nombre) => `<li><strong>${esc(nombre)}:</strong> sin respuestas suficientes en este eje.</li>`,
    summaryLine: (nombre, intensidad, titulo, ejemplo) =>
      `<li><strong>${esc(nombre)} (${intensidad}%):</strong> ${esc(titulo)} — por ejemplo, defenderías ${esc(ejemplo)}.</li>`,
    shareIntro: (lineas) => `Mi perfil en Test Político:\n${lineas.join("\n")}\n\n`,
    shareFallback: "He completado Test Político.\n\n",
    shareOutro: (url) => `¿Coincidimos o nos movemos en ejes distintos? Haz el test aquí y compara tu perfil:\n${url}`,
    noAxisData: (nombre) =>
      `<p class="muted">No hay respuestas suficientes en este eje para estimar tu posición.</p>`,
    centerLabel: "Centro",
    axisAria: (nombre, titulo, intensidad, scoreStr) =>
      `${nombre}: ${titulo}, intensidad ${intensidad}%, posición ${scoreStr}`,
    axisNumbers: (intensidad, scoreStr, loStr, hiStr) =>
      `Intensidad <strong>${intensidad}%</strong> · Índice <strong>${scoreStr}</strong> (margen probable de ${loStr} a ${hiStr})`,
    centerPossible: "Con tus respuestas no se puede descartar una postura cercana al centro.",
    highTension:
      "Respuestas variadas: según el tema concreto, tus respuestas en este eje apuntan hacia ambos lados y el promedio puede suavizarlo.",
    otherSideSummary: "El otro lado",
    moreDetailsSummary: "Ver más detalles",
    answeredCount: (n, cob) =>
      `Preguntas respondidas en este eje: <strong>${n}</strong> (${cob}% del peso del eje).`,
    sigmaLabel: (sigmaStr) =>
      `Variación interna (σ): <strong>${sigmaStr}</strong>. Muestra cuánto cambian tus respuestas según el tema dentro de este eje.`,
    sigmaNotCalc: "no calculable",
    topContributors: "Respuestas que más influyeron:",
    noContrasts:
      "Tus respuestas mantienen una coherencia bastante alineada entre ejes o se sitúan en zonas intermedias sin contrastes bruscos.",
    contrasts: {
      econRedistNegPos: {
        titulo: "Mercado y redistribución",
        texto:
          "Prefieres coordinación de mercado en lo económico, pero apoyas más redistribución o apoyo público. Es un cruce habitual: confiar en la eficiencia del mercado para producir y, a la vez, querer una red de protección común.",
      },
      econRedistPosNeg: {
        titulo: "Regulación y contención fiscal",
        texto:
          "Te inclinas por mayor guía o regulación pública en ciertos ámbitos económicos, pero prefieres menor carga fiscal o redistribución. Un matiz interesante entre intervención selectiva y prudencia en los impuestos.",
      },
      socPowerNegPos: {
        titulo: "Autonomía personal y autoridad estatal",
        texto:
          "Valoras la libertad y diversidad en la vida social, pero ves con buenos ojos una autoridad ejecutiva firme o mayor capacidad de decisión del Estado.",
      },
      socPowerPosNeg: {
        titulo: "Cohesión social y límites al poder",
        texto:
          "Aprecias las normas compartidas y la continuidad social, pero prefieres límites firmes y contrapesos frente al poder de los gobernantes.",
      },
      econSocNegPos: {
        titulo: "Libertad económica y cohesión social",
        texto:
          "Combinas iniciativa de mercado en lo económico con preferencia por normas comunes o cohesión en lo social, un rasgo clásico de corrientes conservadoras liberales.",
      },
      econSocPosNeg: {
        titulo: "Dirección pública y autonomía individual",
        texto:
          "Unes mayor papel público en la economía con defensa de la autonomía personal en la vida cotidiana.",
      },
    },
    unansweredNote: (n) =>
      `Dejaste sin responder ${n} ${n === 1 ? "pregunta" : "preguntas"}.`,
    flagsSummary: (n) => `Una nota sobre tus respuestas (${n})`,
    flagsFootnote:
      "Esto puede responder a matices legítimos; simplemente conviene interpretar el resultado con calma.",
    axisTopicsPrefix: "Temas que mide:",
    nolan: {
      econPos: "Dirección y redistribución",
      econNeg: "Mercado y menos impuestos",
      socPos: "Cohesión y autoridad",
      socNeg: "Autonomía y límites",
      dimEcon: "Economía",
      dimSoc: "Sociedad",
      marginPrefix: "margen",
      marginInferior: "inferior",
      marginIzquierdo: "izquierdo",
      emptyReading: "Completa el test para ver tu orientación política resumida en el diagrama.",
      emptyAria: "Diagrama de orientación política entre economía y sociedad. Sin datos suficientes.",
      balancedEcon: "en un punto equilibrado",
      towardEcon: (polo) => `hacia «${polo}»`,
      balancedSoc: "en un punto intermedio",
      towardSoc: (polo) => `hacia «${polo}»`,
      centerReached: " El margen probable alcanza la zona central en al menos una dimensión.",
      reading: (econTxt, socTxt, centerTxt) =>
        `En economía tu posición cae ${econTxt}; en sociedad, ${socTxt}.${centerTxt}`,
      dashedNote:
        "Una línea discontinua indica que, en esa dimensión, tus respuestas varían mucho según el tema o que los dos ejes que la componen apuntan a lados distintos: la media puede resumirlo mal. Los puntos de los márgenes muestran cada eje por separado.",
      singleAxisNote:
        "Alguna dimensión se ha calculado con un solo eje porque faltan respuestas en el otro.",
      aria: (eStr, eLo, eHi, sStr, sLo, sHi, izq, der, socPos, socNeg) =>
        `Diagrama de orientación política. Economía ${eStr} (margen de ${eLo} a ${eHi}); ` +
        `Sociedad ${sStr} (margen de ${sLo} a ${sHi}). ` +
        `En economía, positivo es ${izq} y negativo ${der}; en sociedad, positivo es ${socPos} y negativo ${socNeg}.`,
    },
    af: {
      nearOrInside: "dentro o muy cerca de",
      versus: "frente a",
      tagNear: "Cerca o dentro",
      tagDiff: "Diferencia",
      rangeLabel: "rango",
      closeGroup: "Mayor cercanía",
      farGroup: "Diferencias o matices",
      cautionsGroup: "Notas del cálculo",
      toggleMore: "Ver más detalles",
      defaultTag: "Equilibrio entre ejes",
      indexEyebrow: (n) => `Vista rápida · ${n} corrientes`,
      indexTitle: "Ir directamente a una corriente",
      emptyCatalog: "No hay corrientes cargadas por el momento.",
      subtabsAria: (nombre) => `Secciones de ${nombre}`,
      tabEssence: "Esencia y economía",
      tabAuthors: "Autores y origen",
      tabCuriosities: "Curiosidades y enlaces",
      defendLabel: "Qué defienden:",
      econPolLabel: "Enfoque económico y político:",
      philEthicsLabel: "Filosofía y ética:",
      originLabel: "Origen:",
      curiositiesLabel: "Datos curiosos:",
      axesAssocLabel: "Dimensiones asociadas:",
      linksGroup: "Lecturas externas",
    },
  },

  en: {
    levels: { slight: "slight", moderate: "moderate", marked: "strong" },
    nearCenter: "Near the center",
    leanPrefix: (nivel, hacia) => `A ${nivel} lean toward ${hacia}`,
    towardPrefix: (s) => `toward ${s}`,
    neutral: "neutral",
    insufficientSummary: (nombre) => `<li><strong>${esc(nombre)}:</strong> not enough answers on this axis.</li>`,
    summaryLine: (nombre, intensidad, titulo, ejemplo) =>
      `<li><strong>${esc(nombre)} (${intensidad}%):</strong> ${esc(titulo)} — for example, favoring ${esc(ejemplo)}.</li>`,
    shareIntro: (lineas) => `My Political Profile:\n${lineas.join("\n")}\n\n`,
    shareFallback: "I completed the Political Profile test.\n\n",
    shareOutro: (url) => `Do we align or lean on different axes? Take the test here and compare your profile:\n${url}`,
    noAxisData: () =>
      `<p class="muted">Not enough answers on this axis to estimate your position.</p>`,
    centerLabel: "Center",
    axisAria: (nombre, titulo, intensidad, scoreStr) =>
      `${nombre}: ${titulo}, intensity ${intensidad}%, index ${scoreStr}`,
    axisNumbers: (intensidad, scoreStr, loStr, hiStr) =>
      `Intensity <strong>${intensidad}%</strong> · Index <strong>${scoreStr}</strong> (probable range ${loStr} to ${hiStr})`,
    centerPossible: "Your answers cannot rule out a position near the center.",
    highTension:
      "Mixed responses: depending on the topic, your answers on this axis point in different directions and the average may smooth that out.",
    otherSideSummary: "The other side",
    moreDetailsSummary: "See more details",
    answeredCount: (n, cob) =>
      `Questions answered on this axis: <strong>${n}</strong> (${cob}% of the axis weight).`,
    sigmaLabel: (sigmaStr) =>
      `Internal spread (σ): <strong>${sigmaStr}</strong>. Shows how much your answers vary across topics within this axis.`,
    sigmaNotCalc: "not available",
    topContributors: "Answers with the largest impact:",
    noContrasts:
      "Your responses stay fairly consistent across axes or sit in middle ground without sharp contrasts.",
    contrasts: {
      econRedistNegPos: {
        titulo: "Markets and redistribution",
        texto:
          "You prefer market coordination economically, yet support more redistribution or public aid. That is a common pairing: trusting markets to produce while wanting a shared safety net.",
      },
      econRedistPosNeg: {
        titulo: "Regulation and fiscal restraint",
        texto:
          "You lean toward more public guidance or regulation in some economic areas, while preferring lower taxes or redistribution. A notable balance between targeted oversight and tax restraint.",
      },
      socPowerNegPos: {
        titulo: "Personal autonomy and state authority",
        texto:
          "You value freedom and diversity in social life, while favoring firm executive authority or stronger state capacity to act.",
      },
      socPowerPosNeg: {
        titulo: "Social cohesion and limits on power",
        texto:
          "You appreciate shared norms and social continuity, while preferring firm limits and checks on those in power.",
      },
      econSocNegPos: {
        titulo: "Economic freedom and social cohesion",
        texto:
          "You combine market initiative economically with a preference for shared norms or social cohesion, a classic trait of liberal conservatism.",
      },
      econSocPosNeg: {
        titulo: "Public direction and individual autonomy",
        texto:
          "You pair a larger public role in the economy with support for personal autonomy in everyday life.",
      },
    },
    unansweredNote: (n) =>
      `You left ${n} ${n === 1 ? "question" : "questions"} unanswered.`,
    flagsSummary: (n) => `A note on your answers (${n})`,
    flagsFootnote:
      "This may reflect legitimate nuances; it is simply worth reading the result with care.",
    axisTopicsPrefix: "Topics covered:",
    nolan: {
      econPos: "Direction & redistribution",
      econNeg: "Markets & lower taxes",
      socPos: "Cohesion & authority",
      socNeg: "Autonomy & limits",
      dimEcon: "Economy",
      dimSoc: "Society",
      marginPrefix: "margin",
      marginInferior: "bottom",
      marginIzquierdo: "left",
      emptyReading: "Complete the test to see your summarized political orientation on the chart.",
      emptyAria: "Political orientation diagram across economy and society. Not enough data.",
      balancedEcon: "at a balanced point",
      towardEcon: (polo) => `toward “${polo}”`,
      balancedSoc: "at an intermediate point",
      towardSoc: (polo) => `toward “${polo}”`,
      centerReached: " The probable range reaches the center zone on at least one dimension.",
      reading: (econTxt, socTxt, centerTxt) =>
        `On the economy your position sits ${econTxt}; on society, ${socTxt}.${centerTxt}`,
      dashedNote:
        "A dashed line indicates that on that dimension your answers vary widely by topic or the two underlying axes pull in different directions: the average may oversimplify it. The margin dots show each axis separately.",
      singleAxisNote:
        "A dimension was calculated from a single axis because answers on the other were missing.",
      aria: (eStr, eLo, eHi, sStr, sLo, sHi, izq, der, socPos, socNeg) =>
        `Political orientation diagram. Economy ${eStr} (range ${eLo} to ${eHi}); ` +
        `Society ${sStr} (range ${sLo} to ${sHi}). ` +
        `On economy, positive is ${izq} and negative is ${der}; on society, positive is ${socPos} and negative is ${socNeg}.`,
    },
    af: {
      nearOrInside: "within or very close to",
      versus: "versus",
      tagNear: "Close or within",
      tagDiff: "Difference",
      rangeLabel: "range",
      closeGroup: "Closer alignment",
      farGroup: "Differences or nuances",
      cautionsGroup: "Calculation notes",
      toggleMore: "See more details",
      defaultTag: "Balance across axes",
      indexEyebrow: (n) => `Quick view · ${n} currents`,
      indexTitle: "Jump straight to a current",
      emptyCatalog: "No currents loaded at the moment.",
      subtabsAria: (nombre) => `Sections for ${nombre}`,
      tabEssence: "Essence & economy",
      tabAuthors: "Authors & origins",
      tabCuriosities: "Trivia & links",
      defendLabel: "What they stand for:",
      econPolLabel: "Economic & political approach:",
      philEthicsLabel: "Philosophy & ethics:",
      originLabel: "Origins:",
      curiositiesLabel: "Notable facts:",
      axesAssocLabel: "Associated dimensions:",
      linksGroup: "External reading",
    },
  },
};

export function lectura(eje, d, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const info = obtenerEjesInfo(l)[eje];
  const a = Math.abs(d.score);
  const nivel = a < 0.15 ? null : a < 0.4 ? tv.levels.slight : a < 0.7 ? tv.levels.moderate : tv.levels.marked;
  const hacia = d.score > 0 ? info.hacia.pos : info.hacia.neg;
  return {
    nivel,
    intensidad: intensidadPct(d.score),
    titulo: nivel ? tv.leanPrefix(nivel, hacia) : tv.nearCenter,
    centroPosible: d.ic95[0] <= 0 && d.ic95[1] >= 0,
  };
}

function direccionContribucion(eje, posicion, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const info = obtenerEjesInfo(l)[eje];
  if (posicion > 0.05) return tv.towardPrefix(info.posCorto.toLowerCase());
  if (posicion < -0.05) return tv.towardPrefix(info.negCorto.toLowerCase());
  return tv.neutral;
}

export function resumenHTML(perfil, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const ejesInfo = obtenerEjesInfo(l);
  const ejemplos = EJEMPLOS_RESUMEN_POR_IDIOMA[l];

  return EJES.map((eje) => {
    const d = perfil.ejes[eje];
    const info = ejesInfo[eje];
    const ej = ejemplos[eje];
    if (!d || d.estado !== "ok") {
      return tv.insufficientSummary(info.nombre);
    }
    const L = lectura(eje, d, l);
    const ejemplo = Math.abs(d.score) < 0.15 ? ej.neutro : d.score > 0 ? ej.pos : ej.neg;
    return tv.summaryLine(info.nombre, L.intensidad, L.titulo, ejemplo);
  }).join("");
}

export function textoCompartir(perfil, url = window.location.href, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const ejesInfo = obtenerEjesInfo(l);

  const partes = EJES.map((eje) => {
    const d = perfil?.ejes?.[eje];
    const info = ejesInfo[eje];
    if (!d || d.estado !== "ok" || !info) return null;
    const L = lectura(eje, d, l);
    return `• ${info.nombre}: ${L.titulo} (${L.intensidad}%)`;
  }).filter(Boolean);

  const resumen = partes.length ? tv.shareIntro(partes) : tv.shareFallback;
  return `${resumen}${tv.shareOutro(url)}`;
}

export function tarjetaEje(eje, d, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const info = obtenerEjesInfo(l)[eje];
  const otroLadoMap = OTRO_LADO_EJE_POR_IDIOMA[l];

  if (!d || d.estado !== "ok") {
    return `<article class="axis-card eje-${esc(eje)}"><h3>${esc(info.nombre)}</h3>
      ${tv.noAxisData(info.nombre)}</article>`;
  }
  const L = lectura(eje, d, l);
  const pos = pct(d.score);
  const lo = pct(d.ic95[0]);
  const hi = pct(d.ic95[1]);
  const ancho = Math.max(0.8, hi - lo).toFixed(1);
  const ladoTexto =
    Math.abs(d.score) < 0.15
      ? tv.centerLabel
      : d.score > 0
        ? `${info.posCorto} (${L.intensidad}%)`
        : `${info.negCorto} (${L.intensidad}%)`;
  const aria = tv.axisAria(info.nombre, L.titulo, L.intensidad, fmt(d.score, l));

  const otroLado =
    Math.abs(d.score) >= 0.15
      ? d.score > 0
        ? otroLadoMap[eje]?.pos
        : otroLadoMap[eje]?.neg
      : null;

  const contribs = (d.contribuciones || [])
    .map(
      (c) =>
        `<li>${esc(c.enunciado)} <span class="tag">${esc(direccionContribucion(eje, c.posicion, l))}</span></li>`
    )
    .join("");

  const coberturaPct = Math.min(100, Math.round(d.cobertura * 100));
  const decSep = l === "en" ? "." : ",";
  const sigmaTexto = d.sigma === null ? tv.sigmaNotCalc : d.sigma.toFixed(2).replace(".", decSep);

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
    <p class="axis-numbers">${tv.axisNumbers(L.intensidad, fmt(d.score, l), fmt(d.ic95[0], l), fmt(d.ic95[1], l))}</p>
    ${L.centroPosible && L.nivel ? `<p class="muted small">${esc(tv.centerPossible)}</p>` : ""}
    ${d.tension_alta ? `<p class="chip-note">${esc(tv.highTension)}</p>` : ""}
    ${
      otroLado
        ? `<details class="detail otro-lado">
            <summary>${esc(tv.otherSideSummary)}</summary>
            <p class="small otro-lado-texto">${esc(otroLado)}</p>
          </details>`
        : ""
    }
    <details class="detail">
      <summary>${esc(tv.moreDetailsSummary)}</summary>
      <ul class="detail-list">
        <li>${tv.answeredCount(d.n_respondidas, coberturaPct)}</li>
        <li>${tv.sigmaLabel(sigmaTexto)}</li>
      </ul>
      ${contribs ? `<p class="small"><strong>${esc(tv.topContributors)}</strong></p><ul class="contrib">${contribs}</ul>` : ""}
    </details>
  </article>`;
}

export function contrastesHTML(perfil, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const cMap = tv.contrasts;
  const ejes = perfil?.ejes || {};
  const ok = (k) => ejes[k]?.estado === "ok";
  const s = (k) => ejes[k]?.score ?? 0;

  const hallazgos = [];

  if (ok("coord_economica") && ok("redistribucion")) {
    if (s("coord_economica") < -0.25 && s("redistribucion") > 0.25) {
      hallazgos.push(cMap.econRedistNegPos);
    } else if (s("coord_economica") > 0.25 && s("redistribucion") < -0.25) {
      hallazgos.push(cMap.econRedistPosNeg);
    }
  }

  if (ok("orden_social") && ok("poder_jurisprudencia")) {
    if (s("orden_social") < -0.25 && s("poder_jurisprudencia") > 0.25) {
      hallazgos.push(cMap.socPowerNegPos);
    } else if (s("orden_social") > 0.25 && s("poder_jurisprudencia") < -0.25) {
      hallazgos.push(cMap.socPowerPosNeg);
    }
  }

  if (ok("coord_economica") && ok("orden_social")) {
    if (s("coord_economica") < -0.25 && s("orden_social") > 0.25) {
      hallazgos.push(cMap.econSocNegPos);
    } else if (s("coord_economica") > 0.25 && s("orden_social") < -0.25) {
      hallazgos.push(cMap.econSocPosNeg);
    }
  }

  if (!hallazgos.length) {
    return `<p class="muted">${esc(tv.noContrasts)}</p>`;
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

export function notaBanderas(perfil, sinResponder = 0, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const msgs = obtenerMensajesBanderas(l);
  const banderas = perfil.indicadores_calidad?.banderas || [];
  const items = banderas.map((b) => msgs[b] || b);
  if (sinResponder > 0) {
    items.push(tv.unansweredNote(sinResponder));
  }
  if (!items.length) return "";
  return `<details class="note">
    <summary>${esc(tv.flagsSummary(items.length))}</summary>
    <ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <p class="muted small">${esc(tv.flagsFootnote)}</p>
  </details>`;
}

export function ejeInfoHTML(eje, lang) {
  const l = obtenerIdiomaActual(lang);
  const tv = TEXTOS_VISTA[l];
  const info = obtenerEjesInfo(l)[eje];
  return `<article class="card axis-info eje-${esc(eje)}">
    <h3>${esc(info.nombre)}</h3>
    <p>${esc(info.descripcion)}</p>
    <div class="spectrum">
      <div class="spectrum-poles"><span>${esc(info.neg)}</span><span>${esc(info.pos)}</span></div>
      <div class="spectrum-track"><span class="tick center" style="left:50%"></span></div>
    </div>
    <p class="muted small">${esc(tv.axisTopicsPrefix)} ${info.ejemplos.map(esc).join(" · ")}.</p>
  </article>`;
}

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
  coord_economica: { horizontal: true, pos: VB - 8, ladoKey: "marginInferior" },
  redistribucion: { horizontal: true, pos: VB - 17, ladoKey: "marginInferior" },
  orden_social: { horizontal: false, pos: 8, ladoKey: "marginIzquierdo" },
  poder_jurisprudencia: { horizontal: false, pos: 17, ladoKey: "marginIzquierdo" },
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

export function diagramaNolanSVG(perfil, lang) {
  const l = obtenerIdiomaActual(lang);
  const tn = TEXTOS_VISTA[l].nolan;
  const ejesInfo = obtenerEjesInfo(l);
  const ejes = perfil?.ejes || {};
  const econ = ejeCompuesto(ejes.coord_economica, ejes.redistribucion);
  const soc = ejeCompuesto(ejes.orden_social, ejes.poder_jurisprudencia);

  const POLO_ECON_POS = tn.econPos;
  const POLO_ECON_NEG = tn.econNeg;
  const POLO_SOC_POS = tn.socPos;
  const POLO_SOC_NEG = tn.socNeg;
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

  let lecturaCorta = tn.emptyReading;
  const notas = [];
  let aria = tn.emptyAria;

  if (econ && soc) {
    const px = gx(econ.score);
    const py = gy(soc.score);

    g += barraIC(gx(econ.ic95[0]), py, gx(econ.ic95[1]), py, true, econ.tension || econ.discrepan);
    g += barraIC(px, gy(soc.ic95[0]), px, gy(soc.ic95[1]), false, soc.tension || soc.discrepan);
    g += `<circle class="dg-pt" cx="${f1(px)}" cy="${f1(py)}" r="${R_PUNTO}"/>`;

    const ladoEcon =
      Math.abs(econ.score) < 0.15 ? tn.balancedEcon : tn.towardEcon(econ.score < 0 ? POLO_ECON_NEG : POLO_ECON_POS);
    const ladoSoc =
      Math.abs(soc.score) < 0.15 ? tn.balancedSoc : tn.towardSoc(soc.score < 0 ? POLO_SOC_NEG : POLO_SOC_POS);
    const cruzaCentro =
      (econ.ic95[0] <= 0 && econ.ic95[1] >= 0) || (soc.ic95[0] <= 0 && soc.ic95[1] >= 0);

    lecturaCorta = tn.reading(ladoEcon, ladoSoc, cruzaCentro ? tn.centerReached : "");

    if (econ.tension || econ.discrepan || soc.tension || soc.discrepan) {
      notas.push(tn.dashedNote);
    }
    if (econ.unico || soc.unico) {
      notas.push(tn.singleAxisNote);
    }

    aria = tn.aria(
      fmt(econ.score, l),
      fmt(econ.ic95[0], l),
      fmt(econ.ic95[1], l),
      fmt(soc.score, l),
      fmt(soc.ic95[0], l),
      fmt(soc.ic95[1], l),
      izq,
      der,
      POLO_SOC_POS,
      POLO_SOC_NEG
    );
  }

  const leyenda = EJES.filter((e) => MARGEN_EJE[e] && ejes[e]?.estado === "ok")
    .map(
      (e) =>
        `<li class="eje-${esc(e)}"><span class="dg-dot" aria-hidden="true"></span>${esc(ejesInfo[e].nombre)} <span class="nolan-lado">· ${tn.marginPrefix} ${tn[MARGEN_EJE[e].ladoKey]}</span></li>`
    )
    .join("");

  const polo = (clase, flecha, eje, texto, flechaAntes = true) =>
    `<p class="nolan-pole ${clase}"><span class="nolan-eje">${flechaAntes ? `<span aria-hidden="true">${flecha}</span> ` : ""}${esc(eje)}${flechaAntes ? "" : ` <span aria-hidden="true">${flecha}</span>`}</span>${esc(texto)}</p>`;

  return `<figure class="nolan">
    <div class="nolan-grid">
      ${polo("nolan-top", "↑", tn.dimSoc, POLO_SOC_POS)}
      ${polo("nolan-left", "←", tn.dimEcon, izq)}
      <svg class="nolan-svg" viewBox="0 0 ${VB} ${VB}" role="img" aria-label="${esc(aria)}">${g}</svg>
      ${polo("nolan-right", "→", tn.dimEcon, der, false)}
      ${polo("nolan-bottom", "↓", tn.dimSoc, POLO_SOC_NEG)}
    </div>
    ${leyenda ? `<ul class="nolan-leyenda" aria-label="${esc(tn.dimEcon)} / ${esc(tn.dimSoc)}">${leyenda}</ul>` : ""}
    <p class="nolan-lectura">${esc(lecturaCorta)}</p>
    ${notas.map((txt) => `<p class="nolan-nota">${esc(txt)}</p>`).join("")}
  </figure>`;
}

function formatearFilaEje(linea, lang) {
  const l = obtenerIdiomaActual(lang);
  const taf = TEXTOS_VISTA[l].af;
  const match = linea.match(/^(.+?)\s+\(([^)]+)\)$/);
  if (!match) return `<span class="af-line-text">${esc(linea)}</span>`;
  const nombre = esc(match[1]);
  const detalle = match[2];
  const partes = detalle.split(/\s+(?:dentro o muy cerca de|frente a|within or very close to|versus)\s+/i);
  if (partes.length !== 2) {
    return `<span class="af-eje-name">${nombre}</span> <span class="af-num">${esc(detalle)}</span>`;
  }
  const esCerca = /dentro o muy cerca de|within or very close to/i.test(detalle);
  const estadoTag = esCerca ? taf.tagNear : taf.tagDiff;
  const estadoClase = esCerca ? "af-estado ok" : "af-estado diff";
  return `
    <span class="af-eje-name">${nombre}</span>
    <span class="af-nums">
      <strong class="af-num">${esc(partes[0])}</strong>
      <span class="af-sep">·</span>
      <span class="af-range">${esc(taf.rangeLabel)} ${esc(partes[1])}</span>
    </span>
    <span class="${estadoClase}">${esc(estadoTag)}</span>
  `;
}

export function tarjetaAfinidadResultado(c, lang) {
  const l = obtenerIdiomaActual(lang);
  const taf = TEXTOS_VISTA[l].af;
  const cercaItems = (c.cerca || []).map(
    (item) => `<li class="af-eje-row">${formatearFilaEje(item, l)}</li>`
  );
  const lejosItems = (c.lejos || []).map(
    (item) => `<li class="af-eje-row">${formatearFilaEje(item, l)}</li>`
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
                <p class="af-grupo-titulo">${esc(taf.closeGroup)}</p>
                <ul class="af-eje-lista">${cercaItems.join("")}</ul>
              </div>`
            : ""
        }
        ${
          lejosItems.length
            ? `<div class="af-grupo">
                <p class="af-grupo-titulo">${esc(taf.farGroup)}</p>
                <ul class="af-eje-lista">${lejosItems.join("")}</ul>
              </div>`
            : ""
        }
        ${
          cautelas
            ? `<div class="af-grupo">
                <p class="af-grupo-titulo">${esc(taf.cautionsGroup)}</p>
                <ul class="af-cautelas">${cautelas}</ul>
              </div>`
            : ""
        }
      </div>
    </div>
  </article>`;
}

export function afGridHTML(candidatas, lang) {
  const l = obtenerIdiomaActual(lang);
  const taf = TEXTOS_VISTA[l].af;
  return `<div class="af-bloque">
    <div class="af-toolbar">
      <button type="button" class="btn small af-toggle-todos" aria-expanded="false">${esc(taf.toggleMore)}</button>
    </div>
    <div class="af-grid">${candidatas.map((c) => tarjetaAfinidadResultado(c, l)).join("")}</div>
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

function familiasOrdenadas(bancoTendencias, lang) {
  const l = obtenerIdiomaActual(lang);
  return [...(Array.isArray(bancoTendencias?.familias) ? bancoTendencias.familias : [])].sort(
    (a, b) => a.nombre.localeCompare(b.nombre, l, { sensitivity: "base" })
  );
}

const ETIQUETAS_CORRIENTE_POR_IDIOMA = {
  es: {
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
  },
  en: {
    anarcocapitalismo: "No state · voluntary agreement",
    autoritarismo_estatista: "Central command · state control",
    comunismo_planificacion: "Planning · collective ownership",
    comunitarismo_humanismo: "Community bonds · social support",
    conservadurismo_liberal: "Market & tradition · fiscal prudence",
    conservadurismo_tradicional: "Continuity & norms · social order",
    socialdemocracia: "Mixed economy · public welfare",
    liberalismo_igualitario: "Civil liberties · equal opportunity",
    libertarismo_minarquista: "Minimal state · individual autonomy",
    perfil_moderado: "Middle ground · gradual approach",
    republicanismo_civico: "Checks on power · civic virtue",
    socialismo_democratico: "Economic democracy · public sector",
    socialismo_libertario: "Self-management · anti-hierarchy",
    liberalismo_clasico: "Open market · rule of law",
  },
};

function etiquetaOrientacionCorriente(f, lang) {
  const l = obtenerIdiomaActual(lang);
  const mapaEtiquetas = ETIQUETAS_CORRIENTE_POR_IDIOMA[l];
  if (f?.id && mapaEtiquetas[f.id]) {
    return mapaEtiquetas[f.id];
  }

  const r = f?.rangos || {};
  const partes = [];
  if (Array.isArray(r.coord_economica)) {
    const mid = (r.coord_economica[0] + r.coord_economica[1]) / 2;
    if (mid <= -0.35) partes.push(l === "en" ? "market initiative" : "iniciativa de mercado");
    else if (mid >= 0.35) partes.push(l === "en" ? "public guidance or regulation" : "regulación o guía pública");
  }
  if (Array.isArray(r.redistribucion)) {
    const mid = (r.redistribucion[0] + r.redistribucion[1]) / 2;
    if (mid <= -0.35) partes.push(l === "en" ? "lower tax burden" : "menor carga fiscal");
    else if (mid >= 0.35) partes.push(l === "en" ? "greater redistribution" : "mayor redistribución");
  }
  if (!partes.length && Array.isArray(r.orden_social)) {
    const mid = (r.orden_social[0] + r.orden_social[1]) / 2;
    if (mid <= -0.35) partes.push(l === "en" ? "personal autonomy" : "autonomía personal");
    else if (mid >= 0.35) partes.push(l === "en" ? "shared norms" : "normas compartidas");
  }
  if (!partes.length && Array.isArray(r.poder_jurisprudencia)) {
    const mid = (r.poder_jurisprudencia[0] + r.poder_jurisprudencia[1]) / 2;
    if (mid <= -0.35) partes.push(l === "en" ? "checks on power" : "contrapesos al poder");
    else if (mid >= 0.35) partes.push(l === "en" ? "institutional authority" : "autoridad institucional");
  }

  return partes.length ? partes.slice(0, 2).join(" · ") : TEXTOS_VISTA[l].af.defaultTag;
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

export function indiceAfinidadesHTML(bancoTendencias, lang) {
  const l = obtenerIdiomaActual(lang);
  const taf = TEXTOS_VISTA[l].af;
  const familias = familiasOrdenadas(bancoTendencias, l);
  if (!familias.length) return "";

  return `<nav class="card af-indice-card" aria-label="${esc(taf.indexTitle)}">
    <div class="af-indice-head">
      <p class="eyebrow">${esc(taf.indexEyebrow(familias.length))}</p>
      <h3 class="af-indice-titulo">${esc(taf.indexTitle)}</h3>
    </div>
    <ul class="af-indice-lista">
      ${familias
        .map((f) => {
          const eje = ejePredominanteCorriente(f);
          const rasgo = etiquetaOrientacionCorriente(f, l);
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

export function catalogoAfinidadesHTML(bancoTendencias, lang) {
  const l = obtenerIdiomaActual(lang);
  const taf = TEXTOS_VISTA[l].af;
  const ejesInfo = obtenerEjesInfo(l);
  const familias = familiasOrdenadas(bancoTendencias, l);

  if (!familias.length) {
    return `<div class="card"><p class="muted">${esc(taf.emptyCatalog)}</p></div>`;
  }

  return `<div class="af-catalogo-grid">${familias
    .map((f, idx) => {
      const ejesDefinidos = Object.entries(f.rangos || {})
        .filter(([, r]) => Array.isArray(r) && r.length === 2)
        .map(([eje]) => ejesInfo[eje]?.nombre)
        .filter(Boolean);

      const det = f.detalles || {};
      const autores = Array.isArray(det.autores) ? det.autores : [];
      const enlaces = Array.isArray(det.enlaces) ? det.enlaces : [];
      const baseId = `af-${esc(f.id || idx)}`;

      return `<article id="${baseId}" class="card af-cat-card" data-af-id="${esc(f.id || idx)}">
        <h3 class="af-cat-title">${esc(f.nombre)}</h3>
        <p class="af-cat-summary">${esc(f.nota_corriente || "")}</p>
        <details class="detail af-detail">
          <summary>${esc(taf.toggleMore)}</summary>
          <div class="af-more-box">
            ${det.cita ? `<blockquote class="af-cita">${esc(det.cita)}</blockquote>` : ""}

            <div class="af-subtabs" role="tablist" aria-label="${esc(taf.subtabsAria(f.nombre))}">
              <button type="button" role="tab" class="af-subtab is-active" aria-selected="true" data-subtab="esencia">${esc(taf.tabEssence)}</button>
              <button type="button" role="tab" class="af-subtab" aria-selected="false" data-subtab="autores">${esc(taf.tabAuthors)}</button>
              <button type="button" role="tab" class="af-subtab" aria-selected="false" data-subtab="curiosidades">${esc(taf.tabCuriosities)}</button>
            </div>

            <div class="af-subpanel" data-subpanel="esencia">
              ${det.defienden ? `<p class="af-more-item"><strong>${esc(taf.defendLabel)}</strong> ${esc(det.defienden)}</p>` : ""}
              ${det.economia_politica ? `<p class="af-more-item"><strong>${esc(taf.econPolLabel)}</strong> ${esc(det.economia_politica)}</p>` : ""}
              ${det.filosofia_etica ? `<p class="af-more-item"><strong>${esc(taf.philEthicsLabel)}</strong> ${esc(det.filosofia_etica)}</p>` : ""}
            </div>

            <div class="af-subpanel" data-subpanel="autores" hidden>
              ${det.origen ? `<p class="af-more-item"><strong>${esc(taf.originLabel)}</strong> ${esc(det.origen)}</p>` : ""}
              ${
                autores.length
                  ? `<ul class="af-autores-lista">${autores.map(autorCardHTML).join("")}</ul>`
                  : ""
              }
            </div>

            <div class="af-subpanel" data-subpanel="curiosidades" hidden>
              ${det.curiosidades ? `<p class="af-more-item"><strong>${esc(taf.curiositiesLabel)}</strong> ${esc(det.curiosities)}</p>` : ""}
              ${
                ejesDefinidos.length
                  ? `<p class="muted small af-ejes-line"><strong>${esc(taf.axesAssocLabel)}</strong> ${ejesDefinidos.map(esc).join(" · ")}.</p>`
                  : ""
              }
              ${
                enlaces.length
                  ? `<div class="af-enlaces-box">
                      <p class="af-grupo-titulo">${esc(taf.linksGroup)}</p>
                      <ul class="af-enlaces-lista">
                        ${enlaces
                          .filter((lItem) => lItem?.url && lItem?.titulo)
                          .map(
                            (lItem) =>
                              `<li><a href="${esc(lItem.url)}" target="_blank" rel="noopener noreferrer">${esc(lItem.titulo)} <span aria-hidden="true">↗</span></a></li>`
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