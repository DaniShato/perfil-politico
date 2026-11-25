import { obtenerEjesInfo } from "./contenido.js";
import {
  EJES,
  esc,
  resumenHTML,
  tarjetaEje,
  contrastesHTML,
  ejeInfoHTML,
  diagramaNolanSVG,
  afGridHTML,
  indiceAfinidadesHTML,
  catalogoAfinidadesHTML,
  notaBanderas,
  textoCompartir,
} from "./vista.js";
import { calcularAfinidades } from "./afinidades.js";
import { obtenerIdiomaInicial, guardarIdioma, t } from "./i18n.js";

const $ = (id) => document.getElementById(id);
const PESTANAS = ["test", "resultados", "afinidades", "metodologia", "ejes"];

const LOGOS_CORRIENTES_ARCHIVOS = {
  anarcocapitalismo: "anarcocapitalismo.webp",
  voluntarismo_de_mercado: "anarcocapitalismo.webp",
  autoritarismo_estatista: "autoritarismo-estatista.webp",
  comunismo: "comunismo.webp",
  socialismo_de_planificacion: "comunismo.webp",
  comunitarismo: "comunitarismo.webp",
  humanismo_cristiano: "comunitarismo.webp",
  conservadurismo_liberal: "conservadurismo-liberal.webp",
  conservadurismo_tradicional: "conservadurismo-tradicional.webp",
  conservadurismo_social: "conservadurismo-tradicional.webp",
  socialdemocracia: "corriente-socialdemocrata.webp",
  corriente_socialdemocrata: "corriente-socialdemocrata.webp",
  liberalismo_igualitario: "liberalismo-igualitario.webp",
  socioliberalismo: "liberalismo-igualitario.webp",
  libertarismo_minarquista: "libertarismo-minarquista.webp",
  moderado: "pragmatismo-gradualista.webp",
  perfil_moderado: "pragmatismo-gradualista.webp",
  pragmatismo_gradualista: "pragmatismo-gradualista.webp",
  republicanismo_civico: "republicanismo-civico.webp",
  socialismo_democratico: "socialismo-democratico.webp",
  socialismo_reformista: "socialismo-democratico.webp",
  socialismo_libertario: "socialismo-libertario.webp",
  anarquismo_social: "socialismo-libertario.webp",
  liberalismo_clasico: "tradicion-liberal-clasica.webp",
  tradicion_liberal_clasica: "tradicion-liberal-clasica.webp",
};

const S = {
  lang: obtenerIdiomaInicial(),
  bancos: { es: null, en: null },
  tendenciasMap: { es: null, en: null },
  banco: null,
  tendencias: null,
  calcular: null,
  preguntas: [],
  indice: 0,
  respuestas: {},
  orden: {},
  enCurso: false,
  perfil: null,
  sinResponder: 0,
};

let temporizadorCompartir = null;

function normalizarClaveLogo(txt) {
  return String(txt || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolverArchivoLogoCorriente(idOClave, nombreTexto = "") {
  const k1 = normalizarClaveLogo(idOClave);
  if (k1 && LOGOS_CORRIENTES_ARCHIVOS[k1]) return LOGOS_CORRIENTES_ARCHIVOS[k1];

  const segmentos = String(nombreTexto || "")
    .split(/[\/|·]/)
    .map((s) => normalizarClaveLogo(s))
    .filter(Boolean);

  const candidatos = [k1, ...segmentos, normalizarClaveLogo(nombreTexto)].filter(Boolean);

  for (const cand of candidatos) {
    if (LOGOS_CORRIENTES_ARCHIVOS[cand]) return LOGOS_CORRIENTES_ARCHIVOS[cand];
  }

  for (const cand of candidatos) {
    for (const [clave, archivo] of Object.entries(LOGOS_CORRIENTES_ARCHIVOS)) {
      if (cand.includes(clave) || clave.includes(cand)) return archivo;
    }
  }
  return null;
}

function crearImagenLogoCorriente(archivo, claseExtra = "") {
  const img = document.createElement("img");
  if (claseExtra) img.className = claseExtra;
  img.alt = "";
  img.decoding = "async";

  const rutas = [
    `../assets/corrientes/${archivo}?v=2`,
    `./assets/corrientes/${archivo}?v=2`,
    `assets/corrientes/${archivo}?v=2`,
  ];
  let idxRuta = 0;
  img.src = rutas[idxRuta];

  img.addEventListener("error", () => {
    idxRuta += 1;
    if (idxRuta < rutas.length) {
      img.src = rutas[idxRuta];
    } else {
      img.remove();
    }
  });

  return img;
}

function aplicarLogosCorrientesEnIndice(contenedor) {
  if (!contenedor) return;
  contenedor.querySelectorAll(".af-indice-link").forEach((enlace) => {
    const slot = enlace.querySelector(".af-indice-icono");
    if (!slot) return;
    const idSalto = enlace.dataset.afJump || enlace.getAttribute("href")?.replace(/^#af-/, "") || "";
    const nombre = enlace.querySelector(".af-indice-nombre")?.textContent || "";
    const archivo = resolverArchivoLogoCorriente(idSalto, nombre);
    if (!archivo) return;

    const img = crearImagenLogoCorriente(archivo);
    slot.innerHTML = "";
    slot.appendChild(img);
  });
}

function aplicarLogosEnTarjetasAfinidades(contenedor) {
  if (!contenedor) return;
  contenedor.querySelectorAll(".af-card").forEach((card) => {
    if (card.querySelector(".af-card-logo")) return;
    const tituloEl = card.querySelector("h4");
    if (!tituloEl) return;

    const idAttr =
      card.dataset.corrienteId ||
      card.dataset.id ||
      card.id?.replace(/^af-res-/, "") ||
      "";
    const nombreTexto = tituloEl.textContent.trim();
    const archivo = resolverArchivoLogoCorriente(idAttr, nombreTexto);
    if (!archivo) return;

    const img = crearImagenLogoCorriente(archivo, "af-card-logo");
    const head = document.createElement("div");
    head.className = "af-card-head";
    tituloEl.replaceWith(head);
    head.append(img, tituloEl);
  });
}

function aplicarLogosEnCatalogoAfinidades(contenedor) {
  if (!contenedor) return;
  const tarjetas = contenedor.querySelectorAll(".af-cat-card, article.card, .card");
  tarjetas.forEach((card) => {
    if (card.querySelector(".af-cat-logo")) return;

    const idAttr =
      card.dataset.corrienteId ||
      card.dataset.id ||
      card.id?.replace(/^af-/, "") ||
      "";
    const tituloEl = card.querySelector(".af-cat-title, h3, h4");
    if (!tituloEl) return;

    const nombreTexto = tituloEl.textContent.trim();
    const archivo = resolverArchivoLogoCorriente(idAttr, nombreTexto);
    if (!archivo) return;

    const img = crearImagenLogoCorriente(archivo, "af-cat-logo");
    const head = document.createElement("div");
    head.className = "af-cat-head";
    tituloEl.replaceWith(head);
    head.append(img, tituloEl);
  });
}

function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function intercalar(items) {
  const ejesInfo = obtenerEjesInfo(S.lang);
  const listaEjes = Array.isArray(EJES) && EJES.length ? EJES : Object.keys(ejesInfo);
  const porEje = Object.fromEntries(
    listaEjes.map((e) => [e, barajar(items.filter((i) => i.eje_primario === e))])
  );
  const out = [];
  let quedan = true;
  while (quedan) {
    quedan = false;
    for (const e of barajar(listaEjes)) {
      const fila = porEje[e];
      const it = fila && fila.shift();
      if (it) {
        out.push(it);
        quedan = true;
      }
    }
  }
  return out.length ? out : barajar(items);
}

function prepararOrdenes(items) {
  const mapa = {};
  for (const it of items) {
    if (it.tipo_respuesta === "preferencia_5") {
      mapa[it.id] = barajar(["A", "B"]);
    } else if (it.tipo_respuesta === "eleccion_3" && Array.isArray(it.opciones)) {
      mapa[it.id] = barajar(it.opciones.map((o) => o.id));
    }
  }
  return mapa;
}

function etiquetaBloque(it) {
  const tr = t(S.lang);
  const ejesInfo = obtenerEjesInfo(S.lang);
  if (it && it.dominio && tr.domains[it.dominio]) return tr.domains[it.dominio];
  if (it && it.eje_primario && ejesInfo[it.eje_primario]) return ejesInfo[it.eje_primario].corto;
  return tr.question.fallbackBlock;
}

function renderizarMatematica(contenedor) {
  if (!contenedor || typeof window.renderMathInElement !== "function") return;
  window.renderMathInElement(contenedor, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
  });
}

function aplicarTextosInterfaz() {
  const tr = t(S.lang);
  const ejesInfo = obtenerEjesInfo(S.lang);
  document.documentElement.lang = S.lang;
  document.title = tr.pageTitle;

  const brandLink = $("brand-home-link");
  if (brandLink) brandLink.setAttribute("aria-label", tr.brandAria);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const activa = btn.dataset.lang === S.lang;
    btn.classList.toggle("is-active", activa);
    btn.setAttribute("aria-pressed", activa ? "true" : "false");
  });

  document.querySelectorAll('[data-tab]').forEach((el) => {
    const tab = el.dataset.tab;
    if (tr.tabs[tab]) el.textContent = tr.tabs[tab];
  });

  document.querySelectorAll('.footer-nav a[href^="#"]').forEach((el) => {
    const tab = el.getAttribute("href").slice(1);
    if (tr.tabs[tab]) el.textContent = tr.tabs[tab];
  });

  const footerCopy = document.querySelector(".footer-copy");
  if (footerCopy) footerCopy.textContent = tr.footerCopyright;
  const footerMark = document.querySelector(".footer-mark");
  if (footerMark) footerMark.setAttribute("aria-label", tr.footerBrandAria);

  const intro = $("vista-intro");
  if (intro) {
    const heroCopy = intro.querySelector(".hero-copy");
    if (heroCopy) {
      const eyebrow = heroCopy.querySelector(".eyebrow");
      const h2 = heroCopy.querySelector("h2");
      const lead = heroCopy.querySelector(".lead");
      const assurance = heroCopy.querySelector(".assurance");
      if (eyebrow) eyebrow.textContent = tr.home.eyebrow;
      if (h2) h2.textContent = tr.home.heroTitle;
      if (lead) lead.textContent = tr.home.heroLead;
      if (assurance) {
        const num = S.banco ? S.banco.items.length : 48;
        assurance.innerHTML = `${esc(tr.home.assurancePrefix)} <span id="num-preguntas">${num}</span> ${esc(tr.home.assuranceQuestionsSuffix)}<br />${esc(tr.home.assuranceLocal)}`;
      }
    }

    const sections = intro.querySelectorAll(".home-section");
    if (sections[0]) {
      const eb = sections[0].querySelector(".eyebrow");
      const sh = sections[0].querySelector(".home-subhead");
      if (eb) eb.textContent = tr.home.axesEyebrow;
      if (sh) sh.textContent = tr.home.axesTitle;
      const axisCards = sections[0].querySelectorAll(".intro-axis-item");
      tr.home.axesList.forEach((ax, i) => {
        const card = axisCards[i];
        if (!card) return;
        const h3 = card.querySelector("h3");
        const p = card.querySelector("p");
        if (h3) h3.textContent = ax.title;
        if (p) p.textContent = ax.desc;
      });
    }

    if (sections[1]) {
      const eb = sections[1].querySelector(".eyebrow");
      const sh = sections[1].querySelector(".home-subhead");
      if (eb) eb.textContent = tr.home.stepsEyebrow;
      if (sh) sh.textContent = tr.home.stepsTitle;
      const stepCards = sections[1].querySelectorAll(".home-step");
      tr.home.stepsList.forEach((st, i) => {
        const card = stepCards[i];
        if (!card) return;
        const num = card.querySelector(".home-step-num");
        const h4 = card.querySelector("h4");
        const p = card.querySelector("p");
        if (num) num.textContent = st.num;
        if (h4) h4.textContent = st.title;
        if (p) p.textContent = st.desc;
      });
    }

    if (sections[2]) {
      const eb = sections[2].querySelector(".eyebrow");
      const sh = sections[2].querySelector(".home-subhead");
      const linkBtn = sections[2].querySelector(".home-link-btn");
      const desc = sections[2].querySelector("p.muted");
      if (eb) eb.textContent = tr.home.currentsEyebrow;
      if (sh) sh.textContent = tr.home.currentsTitle;
      if (linkBtn) linkBtn.textContent = tr.home.currentsAllBtn;
      if (desc) desc.textContent = tr.home.currentsIntro;
      const pills = sections[2].querySelectorAll(".current-pill");
      tr.home.currentPills.forEach((txt, i) => {
        if (pills[i]) pills[i].textContent = txt;
      });
    }

    if (sections[3]) {
      const cols = sections[3].querySelectorAll(".home-about-col");
      if (cols[0]) {
        const eb = cols[0].querySelector(".eyebrow");
        const h4 = cols[0].querySelector("h4");
        const p = cols[0].querySelector("p.muted.small");
        if (eb) eb.textContent = tr.home.aboutUniversalEyebrow;
        if (h4) h4.textContent = tr.home.aboutUniversalTitle;
        if (p) p.textContent = tr.home.aboutUniversalDesc;
      }
      if (cols[1]) {
        const eb = cols[1].querySelector(".eyebrow");
        const h4 = cols[1].querySelector("h4");
        const p = cols[1].querySelector("p.muted.small");
        if (eb) eb.textContent = tr.home.aboutPrivacyEyebrow;
        if (h4) h4.textContent = tr.home.aboutPrivacyTitle;
        if (p) p.textContent = tr.home.aboutPrivacyDesc;
      }
    }

    const bottomCta = intro.querySelector(".home-cta-bottom");
    if (bottomCta) {
      const links = bottomCta.querySelectorAll("a");
      if (links[0]) links[0].textContent = tr.home.bottomStartBtn;
      if (links[1]) links[1].textContent = tr.home.bottomMethodLink;
    }
  }

  if ($("btn-reiniciar-intro")) $("btn-reiniciar-intro").textContent = tr.home.discardBtn;
  if ($("btn-saltar")) $("btn-saltar").textContent = tr.question.skipBtn;
  if ($("btn-anterior")) $("btn-anterior").textContent = tr.question.prevBtn;
  const hint = document.querySelector(".keys-hint");
  if (hint) hint.textContent = tr.question.keysHint;

  if ($("res-vacio")) {
    const h2 = $("res-vacio").querySelector("h2");
    const p = $("res-vacio").querySelector("p");
    if (h2) h2.textContent = tr.results.emptyTitle;
    if (p) p.textContent = tr.results.emptyDesc;
    if ($("btn-ir-test")) $("btn-ir-test").textContent = tr.results.goTestBtn;
  }

  if ($("res-contenido")) {
    const h2 = $("res-contenido").querySelector(".res-head h2");
    if (h2) h2.textContent = tr.results.profileTitle;
    document.querySelectorAll("#res-contenido .btn-compartir").forEach((b) => {
      if (!b.dataset.etiqueta) b.textContent = tr.results.shareBtn;
    });
    const resumenCard = $("res-contenido").querySelector(".resumen-card");
    if (resumenCard) {
      const h3 = resumenCard.querySelector("h3");
      const foot = resumenCard.querySelector("p.muted.small");
      if (h3) h3.textContent = tr.results.summaryTitle;
      if (foot) foot.textContent = tr.results.summaryFootnote;
    }
    const sectionTitles = $("res-contenido").querySelectorAll("h3.section-title");
    if (sectionTitles[0]) sectionTitles[0].textContent = tr.results.axesDetailTitle;

    const cards = $("res-contenido").querySelectorAll(":scope > .card");
    cards.forEach((card) => {
      const h3 = card.querySelector("h3");
      if (!h3) return;
      if (card.querySelector("#res-contrastes")) h3.textContent = tr.results.contrastsTitle;
      if (card.querySelector("#diagrama-nolan-svg")) {
        h3.textContent = tr.results.nolanTitle;
        const p = card.querySelector("p.muted.small");
        if (p) p.textContent = tr.results.nolanFootnote;
      }
      if (card.querySelector("#afinidades-resumen")) h3.textContent = tr.results.affinitiesTitle;
    });

    if ($("btn-repetir")) $("btn-repetir").textContent = tr.results.repeatBtn;
  }

  const panelAf = $("panel-afinidades");
  if (panelAf) {
    const h2 = panelAf.querySelector(".af-page-title");
    const ps = panelAf.querySelectorAll(".af-hero-clean p");
    if (h2) h2.textContent = tr.affinitiesPage.title;
    if (ps[0]) ps[0].textContent = tr.affinitiesPage.lead;
    if (ps[1]) ps[1].textContent = tr.affinitiesPage.notMeasured;
  }

  const panelMet = $("panel-metodologia");
  if (panelMet) {
    const m = tr.methodology;
    const h2 = panelMet.querySelector(".af-page-title");
    const heroPs = panelMet.querySelectorAll(".af-hero-clean p");
    if (h2) h2.textContent = m.title;
    if (heroPs[0]) heroPs[0].textContent = m.lead;
    if (heroPs[1]) heroPs[1].textContent = m.localNote;

    const sample = panelMet.querySelector(".met-sample-axis");
    if (sample) {
      const kicker = sample.querySelector(".met-kicker");
      const h4 = sample.querySelector("h4");
      const reading = sample.querySelector(".reading");
      const badge = sample.querySelector(".axis-badge");
      const poles = sample.querySelectorAll(".spectrum-poles span");
      const nums = sample.querySelector(".axis-numbers");
      const foot = sample.querySelector("p.small.muted");
      if (kicker) kicker.textContent = m.sampleKicker;
      if (h4) h4.textContent = m.sampleAxisName;
      if (reading) reading.textContent = m.sampleReading;
      if (badge) badge.textContent = m.sampleBadge;
      if (poles[0]) poles[0].textContent = m.sampleNeg;
      if (poles[1]) poles[1].textContent = m.samplePos;
      if (nums) {
        nums.innerHTML = `${esc(m.sampleNumbersPrefix)} <strong>36 %</strong> · ${esc(m.sampleIndexLabel)} <strong>${S.lang === "en" ? "−0.36" : "−0,36"}</strong> <span class="muted">${esc(m.sampleMargin)}</span>`;
      }
      if (foot) foot.textContent = m.sampleFootnote;
    }

    const openCol = panelMet.querySelector(".met-open-col");
    if (openCol) {
      const h3 = openCol.querySelector("h3");
      const ps = openCol.querySelectorAll(":scope > p");
      const sum = openCol.querySelector(".met-tech-details > summary");
      const lis = openCol.querySelectorAll(".detail-list li");
      const techIntroP = openCol.querySelector(".met-tech-body > p.small");
      if (h3) h3.textContent = m.whatMeasuresTitle;
      if (ps[0]) ps[0].innerHTML = m.whatMeasuresP1;
      if (ps[1]) ps[1].textContent = m.whatMeasuresP2;
      if (sum) sum.textContent = m.techSummary;
      if (techIntroP) techIntroP.innerHTML = m.techIntro;
      if (lis[0]) lis[0].innerHTML = m.techCoverage;
      if (lis[1]) lis[1].innerHTML = m.techMargin;
      if (lis[2]) lis[2].innerHTML = m.techSpread;
      renderizarMatematica(openCol);
    }

    const band = panelMet.querySelector(".met-band");
    if (band) {
      const h3 = band.querySelector("h3");
      if (h3) h3.textContent = m.questionnaireTitle;
      const items = band.querySelectorAll(".met-lg-item");
      m.questionnaireItems.forEach((qi, i) => {
        const el = items[i];
        if (!el) return;
        const b = el.querySelector(".met-lg-badge");
        const st = el.querySelector("strong");
        const p = el.querySelector("p");
        if (b) b.textContent = qi.badge;
        if (st) st.textContent = qi.title;
        if (p) p.textContent = qi.desc;
      });
    }

    const simCard = panelMet.querySelector(".met-sim-card");
    if (simCard) {
      const eb = simCard.querySelector(".eyebrow");
      const h3 = simCard.querySelector("h3");
      const lead = simCard.querySelector("p.small.muted");
      const simBtns = simCard.querySelectorAll(".met-sim-btn");
      const poles = simCard.querySelectorAll(".met-sim-stage .spectrum-poles span");
      const calcSum = simCard.querySelector(".met-tech-details > summary");
      if (eb) eb.textContent = m.simEyebrow;
      if (h3) h3.textContent = m.simTitle;
      if (lead) lead.innerHTML = m.simLead;
      m.simBtns.forEach((txt, i) => {
        if (simBtns[i]) simBtns[i].textContent = txt;
      });
      if (poles[0]) poles[0].textContent = m.simPoleA;
      if (poles[1]) poles[1].textContent = m.simPoleB;
      if (calcSum) calcSum.textContent = m.simCalcSummary;
      renderizarMatematica(simCard);
    }

    const bottomCols = panelMet.querySelectorAll(".met-bottom-cols .met-soft-panel");
    if (bottomCols[0]) {
      const h4 = bottomCols[0].querySelector("h4");
      const p = bottomCols[0].querySelector("p.small");
      if (h4) h4.textContent = m.flagsPanelTitle;
      if (p) p.textContent = m.flagsPanelDesc;
    }
    if (bottomCols[1]) {
      const h4 = bottomCols[1].querySelector("h4");
      const ps = bottomCols[1].querySelectorAll("p.small");
      if (h4) h4.textContent = m.versionsPanelTitle;
      if (ps[0]) ps[0].textContent = m.versionsPanelDesc;
      if (ps[1]) {
        const bVal = $("ver-banco")?.textContent || "—";
        const mVal = $("ver-motor")?.textContent || "—";
        const qVal = S.banco ? String(S.banco.items.length) : $("met-num-preguntas")?.textContent || "48";
        ps[1].innerHTML = `${esc(m.versionsBankLabel)} <strong id="ver-banco">${esc(bVal)}</strong> · ${esc(m.versionsEngineLabel)} <strong id="ver-motor">${esc(m.versionsEngineLabel === "Engine" ? mVal : mVal)}</strong> · ${esc(m.versionsQuestionsLabel)} <strong id="met-num-preguntas">${esc(qVal)}</strong>`;
      }
    }
  }

  const panelEjes = $("panel-ejes");
  if (panelEjes) {
    const ap = tr.axesPage;
    const h2 = panelEjes.querySelector(".af-page-title");
    const lead = panelEjes.querySelector(".af-hero-clean p");
    if (h2) h2.textContent = ap.title;
    if (lead) lead.textContent = ap.lead;

    const ejesInfoEl = $("ejes-info");
    if (ejesInfoEl) ejesInfoEl.innerHTML = EJES.map((e) => ejeInfoHTML(e, S.lang)).join("");

    const extraCards = panelEjes.querySelectorAll(".ejes-extra-card");
    if (extraCards[0]) {
      const eb = extraCards[0].querySelector(".eyebrow");
      const h3 = extraCards[0].querySelector("h3");
      const p = extraCards[0].querySelector("p.small");
      if (eb) eb.textContent = ap.centerEyebrow;
      if (h3) h3.textContent = ap.centerTitle;
      if (p) p.textContent = ap.centerDesc;
    }
    if (extraCards[1]) {
      const eb = extraCards[1].querySelector(".eyebrow");
      const h3 = extraCards[1].querySelector("h3");
      const p = extraCards[1].querySelector("p.small");
      if (eb) eb.textContent = ap.crossEyebrow;
      if (h3) h3.textContent = ap.crossTitle;
      if (p) p.textContent = ap.crossDesc;
    }
  }

  actualizarIntro();
  actualizarSimuladorMetodologia(null);
}

async function cargarBancoPorIdioma(lang) {
  if (S.bancos[lang]) return S.bancos[lang];
  const sufijo = lang === "en" ? ".en.json" : ".json";
  const rutas = [
    `../data/questions${sufijo}`,
    `./data/questions${sufijo}`,
    `/data/questions${sufijo}`,
  ];
  let datos = await cargarJSONConFallback(rutas);
  if (!datos && lang !== "es") {
    datos = await cargarBancoPorIdioma("es");
  }
  if (datos) S.bancos[lang] = datos;
  return datos;
}

async function cargarTendenciasPorIdioma(lang) {
  if (S.tendenciasMap[lang]) return S.tendenciasMap[lang];
  const sufijo = lang === "en" ? ".en.json" : ".json";
  const rutas = [
    `../data/tendencias${sufijo}`,
    `./data/tendencias${sufijo}`,
    `/data/tendencias${sufijo}`,
  ];
  let datos = await cargarJSONConFallback(rutas);
  if (!datos && lang !== "es") {
    datos = await cargarTendenciasPorIdioma("es");
  }
  if (datos) S.tendenciasMap[lang] = datos;
  return datos;
}

async function cambiarIdioma(nuevoLang) {
  const normalizado = guardarIdioma(nuevoLang);
  if (normalizado === S.lang && S.banco) return;
  S.lang = normalizado;

  const [banco, tendencias] = await Promise.all([
    cargarBancoPorIdioma(S.lang),
    cargarTendenciasPorIdioma(S.lang),
  ]);

  if (banco) S.banco = banco;
  if (tendencias) S.tendencias = tendencias;

  if (S.banco && S.preguntas.length) {
    const mapaItems = new Map((S.banco.items || []).map((item) => [item.id, item]));
    S.preguntas = S.preguntas.map((q) => mapaItems.get(q.id) || q);
  }

  if (S.banco && S.calcular && Object.keys(S.respuestas).length > 0) {
    S.perfil = S.calcular(S.banco, S.respuestas, { ordenMostrado: S.orden, soloNucleo: false });
  }

  aplicarTextosInterfaz();

  const pestanaActual = PESTANAS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "test";
  if (!$("vista-pregunta")?.hidden && pestanaActual === "test") {
    renderPregunta();
  }
  if (pestanaActual === "resultados") {
    renderResultados();
  }
  if (pestanaActual === "afinidades") {
    renderCatalogoAfinidades();
  }
}

function mostrarVista(nombre) {
  const intro = $("vista-intro");
  const preg = $("vista-pregunta");
  if (intro) intro.hidden = nombre !== "intro";
  if (preg) preg.hidden = nombre !== "pregunta";
}

function subirArriba(suave = false) {
  const prefiereReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: 0,
    behavior: suave && !prefiereReducido ? "smooth" : "instant",
  });
}

function mostrarPestana({ suave = false } = {}) {
  let n = location.hash.slice(1);
  if (!PESTANAS.includes(n)) n = "test";
  document.querySelectorAll("[data-panel]").forEach((p) => {
    p.hidden = p.dataset.panel !== n;
  });
  document.querySelectorAll("[data-tab]").forEach((a) => {
    if (a.dataset.tab === n) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (n === "resultados") renderResultados();
  if (n === "afinidades") renderCatalogoAfinidades();
  if (n === "metodologia") renderizarMatematica($("panel-metodologia"));
  if (n === "test") actualizarIntro();
  subirArriba(suave);
}

function irA(nombre, { suave = false } = {}) {
  if (location.hash.slice(1) === nombre) {
    mostrarPestana({ suave });
  } else {
    location.hash = nombre;
  }
}

function configurarNavegacionFooterYCabecera() {
  document.querySelectorAll(".site-footer a[href^='#'], .tabs a[href^='#']").forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      const destino = enlace.getAttribute("href").slice(1);
      if (!PESTANAS.includes(destino)) return;
      e.preventDefault();
      irA(destino, { suave: enlace.closest(".site-footer") !== null });
    });
  });
}

function actualizarIntro() {
  const tr = t(S.lang);
  const btn = $("btn-empezar");
  if (!btn) return;
  btn.disabled = !S.banco;
  btn.textContent = S.enCurso ? tr.home.continueBtn : S.perfil ? tr.home.retakeBtn : tr.home.startBtn;
  const btnReiniciar = $("btn-reiniciar-intro");
  if (btnReiniciar) btnReiniciar.hidden = !S.enCurso;
}

function empezar() {
  if (!S.banco || !S.calcular) return;
  if (S.enCurso && S.preguntas.length > 0) {
    mostrarVista("pregunta");
    renderPregunta();
    return;
  }
  reiniciarEstado();
  S.enCurso = true;
  mostrarVista("pregunta");
  renderPregunta();
}

function reiniciarEstado() {
  const items = Array.isArray(S.banco?.items) ? S.banco.items : [];
  S.preguntas = intercalar(items);
  S.orden = prepararOrdenes(S.preguntas);
  S.indice = 0;
  S.respuestas = {};
  S.enCurso = false;
  S.perfil = null;
  S.sinResponder = 0;
  document.querySelectorAll(".estado-compartir").forEach((el) => {
    el.textContent = "";
  });
  const tabRes = document.querySelector('[data-tab="resultados"]');
  if (tabRes) tabRes.classList.remove("lista");
}

function descartarTest() {
  const tr = t(S.lang);
  if (!window.confirm(tr.home.discardConfirm)) return;
  reiniciarEstado();
  mostrarVista("intro");
  actualizarIntro();
}

function boton(it, texto, valor, n, clase) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = clase ? `opt ${clase}` : "opt";
  b.dataset.valor = String(valor);
  b.setAttribute("aria-pressed", "false");

  const k = document.createElement("span");
  k.className = "key";
  k.textContent = String(n);

  const tSpan = document.createElement("span");
  tSpan.textContent = texto;

  b.append(k, tSpan);
  b.addEventListener("click", () => seleccionar(it.id, valor));
  return b;
}

function renderPregunta() {
  const it = S.preguntas[S.indice];
  if (!it) return;
  const tr = t(S.lang);
  const total = S.preguntas.length;

  $("p-contador").textContent = tr.question.counter(S.indice + 1, total);
  $("p-parte").textContent = etiquetaBloque(it);
  $("p-barra").style.width = `${((S.indice + 1) / total) * 100}%`;
  $("p-enunciado").textContent = it.enunciado;
  $("p-matiz").textContent = it.nota_matiz || "";
  $("p-matiz").hidden = !it.nota_matiz;

  const cont = $("p-opciones");
  cont.innerHTML = "";

  if (it.tipo_respuesta === "acuerdo_5") {
    cont.className = "opciones likert";
    tr.agreement.forEach((o, i) => cont.appendChild(boton(it, o.t, o.v, i + 1, "")));
  } else if (it.tipo_respuesta === "preferencia_5") {
    cont.className = "opciones";
    const orden = S.orden[it.id] || ["A", "B"];
    const mapa = Object.fromEntries((it.opciones || []).map((o) => [o.id, o]));
    const duo = document.createElement("div");
    duo.className = "duo";
    orden.forEach((id, i) => {
      const card = document.createElement("div");
      card.className = "duo-card";
      const h = document.createElement("strong");
      h.textContent = tr.question.optionLabel(i + 1);
      const p = document.createElement("p");
      p.textContent = mapa[id]?.texto || "";
      card.append(h, p);
      duo.appendChild(card);
    });
    cont.appendChild(duo);

    const escala = document.createElement("div");
    escala.className = "escala";
    tr.preference.forEach((o, i) => {
      const real = orden[0] === "A" ? o.v : 6 - o.v;
      escala.appendChild(boton(it, o.t, real, i + 1, "compacta"));
    });
    cont.appendChild(escala);
  } else {
    cont.className = "opciones lista";
    const mapa = Object.fromEntries((it.opciones || []).map((o) => [o.id, o]));
    const orden = S.orden[it.id] || (it.opciones || []).map((o) => o.id);
    orden.forEach((id, i) => cont.appendChild(boton(it, mapa[id]?.texto || "", id, i + 1, "")));
  }

  marcarSeleccion();
  actualizarNavTest();
}

function marcarSeleccion() {
  const it = S.preguntas[S.indice];
  if (!it) return;
  const actual = S.respuestas[it.id];
  $("p-opciones")
    .querySelectorAll(".opt")
    .forEach((b) => {
      const sel = actual !== undefined && b.dataset.valor === String(actual);
      b.classList.toggle("selected", sel);
      b.setAttribute("aria-pressed", sel ? "true" : "false");
    });
}

function actualizarNavTest() {
  const it = S.preguntas[S.indice];
  if (!it) return;
  const tr = t(S.lang);
  const ultima = S.indice === S.preguntas.length - 1;
  $("btn-anterior").disabled = S.indice === 0;
  $("btn-siguiente").disabled = S.respuestas[it.id] === undefined;
  $("btn-siguiente").textContent = ultima ? tr.question.finishBtn : tr.question.nextBtn;
}

function seleccionar(id, valor) {
  S.respuestas[id] = valor;
  marcarSeleccion();
  actualizarNavTest();
}

function siguiente() {
  const ultima = S.indice === S.preguntas.length - 1;
  if (ultima) return finalizar();
  S.indice += 1;
  renderPregunta();
}

function anterior() {
  if (S.indice > 0) {
    S.indice -= 1;
    renderPregunta();
  }
}

function saltar() {
  const it = S.preguntas[S.indice];
  if (it) delete S.respuestas[it.id];
  const ultima = S.indice === S.preguntas.length - 1;
  if (ultima) return finalizar();
  siguiente();
}

function finalizar() {
  S.perfil = S.calcular(S.banco, S.respuestas, { ordenMostrado: S.orden, soloNucleo: false });
  S.sinResponder = S.preguntas.filter((q) => S.respuestas[q.id] === undefined).length;
  S.enCurso = false;
  mostrarVista("intro");
  const tabRes = document.querySelector('[data-tab="resultados"]');
  if (tabRes) tabRes.classList.add("lista");
  irA("resultados");
}

function renderResultados() {
  const p = S.perfil;
  $("res-vacio").hidden = !!p;
  $("res-contenido").hidden = !p;
  if (!p) return;
  const tr = t(S.lang);
  const n = S.preguntas.length;
  $("res-estado").textContent = tr.results.statusComplete(n);
  $("res-resumen-lista").innerHTML = resumenHTML(p, S.lang);
  $("res-ejes").innerHTML = EJES.map((e) => tarjetaEje(e, p.ejes[e], S.lang)).join("");
  if ($("res-contrastes")) $("res-contrastes").innerHTML = contrastesHTML(p, S.lang);
  $("res-nota").innerHTML = notaBanderas(p, S.sinResponder, S.lang);
  renderDiagrama();
  renderAfinidadesResultado();
}

function renderDiagrama() {
  if (!S.perfil || !$("diagrama-nolan-svg")) return;
  $("diagrama-nolan-svg").innerHTML = diagramaNolanSVG(S.perfil, S.lang);
}

function renderAfinidadesResultado() {
  const cont = $("afinidades-resumen");
  if (!cont || !S.perfil) return;
  const tr = t(S.lang);
  const res = calcularAfinidades(S.perfil, S.tendencias);
  if (res.sinEncajeClaro || !res.candidatas.length) {
    cont.innerHTML = `<p class="muted">${tr.results.noClearFit}</p>`;
    return;
  }
  const ordenAlfabetico = [...res.candidatas].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, S.lang, { sensitivity: "base" })
  );
  cont.innerHTML = `${afGridHTML(ordenAlfabetico, S.lang)}
    <p class="muted small af-cierre">${tr.results.affinitiesFootnote}</p>`;
  aplicarLogosEnTarjetasAfinidades(cont);
}

function renderCatalogoAfinidades() {
  const ind = $("afinidades-indice");
  const cont = $("afinidades-catalogo");
  if (ind) {
    ind.innerHTML = indiceAfinidadesHTML(S.tendencias, S.lang);
    aplicarLogosCorrientesEnIndice(ind);
  }
  if (cont) {
    cont.innerHTML = catalogoAfinidadesHTML(S.tendencias, S.lang);
    aplicarLogosEnCatalogoAfinidades(cont);
  }
}

function activarSubpestana(card, nombreSubtab) {
  if (!card) return;
  card.querySelectorAll(".af-subtab").forEach((btn) => {
    const activa = btn.dataset.subtab === nombreSubtab;
    btn.classList.toggle("is-active", activa);
    btn.setAttribute("aria-selected", activa ? "true" : "false");
  });
  card.querySelectorAll(".af-subpanel").forEach((panel) => {
    panel.hidden = panel.dataset.subpanel !== nombreSubtab;
  });
}

function saltarACorriente(idCorriente) {
  const target = document.getElementById(`af-${idCorriente}`);
  if (!target) return;
  const details = target.querySelector("details.af-detail");
  if (details) details.open = true;
  const prefiereReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: prefiereReducido ? "auto" : "smooth", block: "start" });
}

function actualizarSimuladorMetodologia(botonPulsado) {
  const botones = [...document.querySelectorAll(".met-sim-btn")];
  if (!botones.length) return;
  if (botonPulsado) {
    botonPulsado.classList.toggle("is-active");
  }
  botones.forEach((b) => {
    b.setAttribute("aria-pressed", b.classList.contains("is-active") ? "true" : "false");
  });
  const activos = botones.filter((b) => b.classList.contains("is-active"));
  const valores = activos.map((b) => Number(b.dataset.simVal)).filter((v) => !Number.isNaN(v));
  const media = valores.length ? valores.reduce((acc, v) => acc + v, 0) / valores.length : 0;
  const pct = ((media + 1) / 2) * 100;

  const dot = $("met-sim-dot");
  if (dot) dot.style.left = `${pct}%`;

  const tr = t(S.lang).simulator;
  let lectura = tr.balanced;
  if (media <= -0.35) lectura = tr.strongA;
  else if (media < -0.1) lectura = tr.slightA;
  else if (media >= 0.35) lectura = tr.strongB;
  else if (media > 0.1) lectura = tr.slightB;

  const elLectura = $("met-sim-reading");
  if (elLectura) elLectura.textContent = lectura;

  const elCalc = $("met-sim-calc");
  if (elCalc) {
    if (!valores.length) {
      elCalc.textContent = tr.emptyCalc;
    } else {
      const decSep = S.lang === "en" ? "." : ",";
      const partes = valores
        .map((v) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)).replace(".", decSep))
        .join(", ");
      const mediaTxt = (media > 0 ? `+${media.toFixed(2)}` : media.toFixed(2)).replace(".", decSep);
      elCalc.textContent = `${tr.calcPrefix} ${partes} ${tr.calcMid} ${mediaTxt} ${tr.calcSuffix}`;
    }
  }
}

function marcarEstadoCompartir(msg, etiquetaBoton = "", boton = null) {
  document.querySelectorAll(".estado-compartir").forEach((el) => {
    el.textContent = msg;
  });
  if (boton && etiquetaBoton) {
    if (!boton.dataset.etiqueta) boton.dataset.etiqueta = boton.textContent;
    boton.textContent = etiquetaBoton;
  }
  clearTimeout(temporizadorCompartir);
  temporizadorCompartir = setTimeout(() => {
    document.querySelectorAll(".estado-compartir").forEach((el) => {
      el.textContent = "";
    });
    document.querySelectorAll(".btn-compartir").forEach((b) => {
      if (b.dataset.etiqueta) {
        b.textContent = b.dataset.etiqueta;
        delete b.dataset.etiqueta;
      }
    });
  }, 3500);
}

async function copiarAlPortapapeles(texto) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (err) {
      console.warn("clipboard.writeText falló, se prueba el método alternativo:", err);
    }
  }
  const aux = document.createElement("textarea");
  aux.value = texto;
  aux.setAttribute("readonly", "");
  aux.style.position = "fixed";
  aux.style.top = "0";
  aux.style.left = "0";
  aux.style.opacity = "0";
  document.body.appendChild(aux);
  try {
    aux.focus();
    aux.select();
    aux.setSelectionRange(0, texto.length);
    return document.execCommand("copy");
  } catch (err) {
    console.warn("execCommand('copy') falló:", err);
    return false;
  } finally {
    document.body.removeChild(aux);
  }
}

let compartiendo = false;

async function compartirResultado(boton = null) {
  if (compartiendo) return;
  const tr = t(S.lang).share;
  if (!S.perfil) {
    marcarEstadoCompartir(tr.incomplete);
    return;
  }
  compartiendo = true;
  try {
    const url = `${window.location.href.split("#")[0]}#test`;
    const texto = textoCompartir(S.perfil, url, S.lang);
    const datos = { title: tr.title, text: texto };

    const esTactil = Boolean(window.matchMedia?.("(pointer: coarse)").matches);
    const puedeCompartir =
      esTactil && typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(datos));

    if (puedeCompartir) {
      try {
        await navigator.share(datos);
        marcarEstadoCompartir(tr.sharedStatus, tr.sharedBtn, boton);
        return;
      } catch (err) {
        if (err?.name === "AbortError") {
          marcarEstadoCompartir(tr.cancelled);
          return;
        }
        console.warn("navigator.share falló, se copia al portapapeles:", err);
      }
    }

    if (await copiarAlPortapapeles(texto)) {
      marcarEstadoCompartir(tr.copiedStatus, tr.copiedBtn, boton);
    } else {
      window.prompt(tr.manualPrompt, texto);
      marcarEstadoCompartir(tr.manualStatus);
    }
  } catch (err) {
    console.error("Error al compartir:", err);
    marcarEstadoCompartir(tr.errorStatus);
  } finally {
    compartiendo = false;
  }
}

async function cargarJSONConFallback(rutas) {
  for (const ruta of rutas) {
    try {
      const res = await fetch(ruta);
      if (!res.ok) continue;
      return await res.json();
    } catch {
      // Intenta la siguiente ruta
    }
  }
  return null;
}

function atajosTeclado(e) {
  if ($("vista-pregunta").hidden || $("panel-test").hidden) return;
  if (e.target.matches("select, input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
  const botones = [...$("p-opciones").querySelectorAll(".opt")];
  const mapaTeclas = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4 };
  const idx = mapaTeclas[e.key] ?? mapaTeclas[e.code];
  if (idx !== undefined && botones[idx]) {
    e.preventDefault();
    botones[idx].click();
    return;
  }
  if ((e.key === "ArrowRight" || e.key === "Enter") && !$("btn-siguiente").disabled && e.target.tagName !== "BUTTON") {
    e.preventDefault();
    siguiente();
  } else if (e.key === "ArrowLeft" && !$("btn-anterior").disabled) {
    e.preventDefault();
    anterior();
  }
}

async function inicializar() {
  document.addEventListener("click", (e) => {
    const elTarget = e.target instanceof Element ? e.target : null;
    if (!elTarget) return;

    const langBtn = elTarget.closest(".lang-btn");
    if (langBtn) {
      e.preventDefault();
      cambiarIdioma(langBtn.dataset.lang);
      return;
    }

    const b = elTarget.closest(".btn-compartir");
    if (b) {
      e.preventDefault();
      compartirResultado(b);
      return;
    }

    const simBtn = elTarget.closest(".met-sim-btn");
    if (simBtn) {
      e.preventDefault();
      actualizarSimuladorMetodologia(simBtn);
      return;
    }

    const toggle = elTarget.closest(".af-toggle-todos");
    if (toggle) {
      e.preventDefault();
      const bloque = toggle.closest(".af-bloque");
      if (!bloque) return;
      const paneles = [...bloque.querySelectorAll(".af-detalle-panel")];
      const abrir = paneles.some((p) => p.hidden);
      paneles.forEach((p) => {
        p.hidden = !abrir;
      });
      const trAf = t(S.lang).affinitiesPage;
      toggle.setAttribute("aria-expanded", abrir ? "true" : "false");
      toggle.textContent = abrir ? trAf.hideDetails : trAf.showDetails;
      return;
    }

    const jump = elTarget.closest("[data-af-jump]");
    if (jump) {
      e.preventDefault();
      saltarACorriente(jump.dataset.afJump);
      return;
    }

    const subtab = elTarget.closest(".af-subtab");
    if (subtab) {
      e.preventDefault();
      activarSubpestana(subtab.closest(".af-cat-card"), subtab.dataset.subtab);
    }
  });

  const ejesInfo = $("ejes-info");
  if (ejesInfo) ejesInfo.innerHTML = EJES.map((e) => ejeInfoHTML(e, S.lang)).join("");
  configurarNavegacionFooterYCabecera();

  $("btn-empezar")?.addEventListener("click", empezar);
  $("btn-reiniciar-intro")?.addEventListener("click", descartarTest);
  $("btn-anterior")?.addEventListener("click", anterior);
  $("btn-siguiente")?.addEventListener("click", siguiente);
  $("btn-saltar")?.addEventListener("click", saltar);
  $("btn-repetir")?.addEventListener("click", () => {
    reiniciarEstado();
    mostrarVista("intro");
    irA("test");
  });
  $("btn-ir-test")?.addEventListener("click", () => irA("test"));

  document.addEventListener("keydown", atajosTeclado);
  window.addEventListener("hashchange", () => mostrarPestana({ suave: false }));
  window.addEventListener("beforeunload", (e) => {
    if (S.enCurso && Object.keys(S.respuestas).length > 0) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  aplicarTextosInterfaz();
  mostrarPestana({ suave: false });
  actualizarSimuladorMetodologia(null);

  const trErr = t(S.lang).errors;
  let scoringMod;
  try {
    scoringMod = await import("./scoring.js");
    S.calcular = scoringMod.calcularPerfil;
  } catch (err) {
    return avisar(trErr.scoringLoad(err.message));
  }

  S.banco = await cargarBancoPorIdioma(S.lang);
  if (!S.banco) return avisar(trErr.questionsLoad);

  S.tendencias = await cargarTendenciasPorIdioma(S.lang);
  renderCatalogoAfinidades();

  reiniciarEstado();
  $("ver-banco").textContent = S.banco.meta?.bank_version || "—";
  $("ver-motor").textContent = scoringMod.SCORING_VERSION || "—";
  $("num-preguntas").textContent = String(S.banco.items.length);
  if ($("met-num-preguntas")) $("met-num-preguntas").textContent = String(S.banco.items.length);
  actualizarIntro();
}

function avisar(msg) {
  const el = $("aviso-carga");
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
}

inicializar().catch((err) => {
  console.error("Error al inicializar la aplicación:", err);
  avisar(t(S.lang).errors.initGeneric);
});