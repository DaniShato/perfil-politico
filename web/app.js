import { EJES_INFO } from "./contenido.js";
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

const $ = (id) => document.getElementById(id);
const PESTANAS = ["test", "resultados", "afinidades", "metodologia", "ejes"];

const DOMINIOS_LABEL = {
  economia_mercados: "Economía y mercados",
  abastecimiento_precios: "Precios y suministros",
  ayuda_y_solidaridad: "Ayuda y solidaridad",
  impuestos_transferencias: "Impuestos y transferencias",
  cultura_costumbres: "Cultura y costumbres",
  familia_vida_privada: "Familia y vida privada",
  normas_y_convivencia: "Normas y convivencia",
  estado_y_fronteras: "Estado y fronteras",
  justicia_garantias: "Justicia y garantías",
};

const ACUERDO = [
  { v: -1, t: "Totalmente en desacuerdo" },
  { v: -0.5, t: "Algo en desacuerdo" },
  { v: 0, t: "Ni de acuerdo ni en desacuerdo" },
  { v: 0.5, t: "Algo de acuerdo" },
  { v: 1, t: "Totalmente de acuerdo" },
];

const PREFERENCIA = [
  { v: 1, t: "Claramente la opción 1" },
  { v: 2, t: "Más bien la opción 1" },
  { v: 3, t: "Me parecen igual de bien" },
  { v: 4, t: "Más bien la opción 2" },
  { v: 5, t: "Claramente la opción 2" },
];

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
  const listaEjes = Array.isArray(EJES) && EJES.length ? EJES : Object.keys(EJES_INFO);
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
  if (it && it.dominio && DOMINIOS_LABEL[it.dominio]) return DOMINIOS_LABEL[it.dominio];
  if (it && it.eje_primario && EJES_INFO[it.eje_primario]) return EJES_INFO[it.eje_primario].corto;
  return "Bloque temático";
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
  const btn = $("btn-empezar");
  if (!btn) return;
  btn.disabled = !S.banco;
  btn.textContent = S.enCurso ? "Continuar el test" : S.perfil ? "Hacer el test de nuevo" : "Comenzar el test";
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
  if (!window.confirm("Se perderán las respuestas dadas hasta ahora. ¿Empezar de nuevo?")) return;
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

  const t = document.createElement("span");
  t.textContent = texto;

  b.append(k, t);
  b.addEventListener("click", () => seleccionar(it.id, valor));
  return b;
}

function renderPregunta() {
  const it = S.preguntas[S.indice];
  if (!it) return;
  const total = S.preguntas.length;

  $("p-contador").textContent = `Pregunta ${S.indice + 1} de ${total}`;
  $("p-parte").textContent = etiquetaBloque(it);
  $("p-barra").style.width = `${((S.indice + 1) / total) * 100}%`;
  $("p-enunciado").textContent = it.enunciado;
  $("p-matiz").textContent = it.nota_matiz || "";
  $("p-matiz").hidden = !it.nota_matiz;

  const cont = $("p-opciones");
  cont.innerHTML = "";

  if (it.tipo_respuesta === "acuerdo_5") {
    cont.className = "opciones likert";
    ACUERDO.forEach((o, i) => cont.appendChild(boton(it, o.t, o.v, i + 1, "")));
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
      h.textContent = `Opción ${i + 1}`;
      const p = document.createElement("p");
      p.textContent = mapa[id]?.texto || "";
      card.append(h, p);
      duo.appendChild(card);
    });
    cont.appendChild(duo);

    const escala = document.createElement("div");
    escala.className = "escala";
    PREFERENCIA.forEach((o, i) => {
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
  const ultima = S.indice === S.preguntas.length - 1;
  $("btn-anterior").disabled = S.indice === 0;
  $("btn-siguiente").disabled = S.respuestas[it.id] === undefined;
  $("btn-siguiente").textContent = ultima ? "Ver resultados" : "Siguiente";
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
  const n = S.preguntas.length;
  $("res-estado").textContent = `Resultado completo · ${n} preguntas`;
  $("res-resumen-lista").innerHTML = resumenHTML(p);
  $("res-ejes").innerHTML = EJES.map((e) => tarjetaEje(e, p.ejes[e])).join("");
  if ($("res-contrastes")) $("res-contrastes").innerHTML = contrastesHTML(p);
  $("res-nota").innerHTML = notaBanderas(p, S.sinResponder);
  renderDiagrama();
  renderAfinidadesResultado();
}

function renderDiagrama() {
  if (!S.perfil || !$("diagrama-nolan-svg")) return;
  $("diagrama-nolan-svg").innerHTML = diagramaNolanSVG(S.perfil);
}

function renderAfinidadesResultado() {
  const cont = $("afinidades-resumen");
  if (!cont || !S.perfil) return;
  const res = calcularAfinidades(S.perfil, S.tendencias);
  if (res.sinEncajeClaro || !res.candidatas.length) {
    cont.innerHTML = `<p class="muted">Tus respuestas muestran un perfil equilibrado o repartido sin una corriente cercana destacada. Puedes revisar todas las corrientes en la pestaña <a href="#afinidades">Afinidades</a>.</p>`;
    return;
  }
  const ordenAlfabetico = [...res.candidatas].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
  cont.innerHTML = `${afGridHTML(ordenAlfabetico)}
    <p class="muted small af-cierre">Selección orientativa mostrada en orden alfabético. Consulta todas las corrientes en la pestaña <a href="#afinidades">Afinidades</a>.</p>`;
  aplicarLogosEnTarjetasAfinidades(cont);
}

function renderCatalogoAfinidades() {
  const ind = $("afinidades-indice");
  const cont = $("afinidades-catalogo");
  if (ind) {
    ind.innerHTML = indiceAfinidadesHTML(S.tendencias);
    aplicarLogosCorrientesEnIndice(ind);
  }
  if (cont) {
    cont.innerHTML = catalogoAfinidadesHTML(S.tendencias);
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

  let lectura = "Punto intermedio o equilibrado entre ambos polos.";
  if (media <= -0.35) lectura = "Tendencia clara hacia el Polo A.";
  else if (media < -0.1) lectura = "Ligera inclinación hacia el Polo A.";
  else if (media >= 0.35) lectura = "Tendencia clara hacia el Polo B.";
  else if (media > 0.1) lectura = "Tendencia moderada hacia el Polo B.";

  const elLectura = $("met-sim-reading");
  if (elLectura) elLectura.textContent = lectura;

  const elCalc = $("met-sim-calc");
  if (elCalc) {
    if (!valores.length) {
      elCalc.textContent = "Sin respuestas activas seleccionadas: el punto se queda en el centro (0,00).";
    } else {
      const partes = valores.map((v) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1))).join(", ");
      const mediaTxt = media > 0 ? `+${media.toFixed(2)}` : media.toFixed(2);
      elCalc.textContent = `Valores activos: ${partes} · Promedio simple: ${mediaTxt} (en una escala de −1 a +1).`;
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
  if (!S.perfil) {
    marcarEstadoCompartir("Completa el test para poder compartir tus resultados.");
    return;
  }
  compartiendo = true;
  try {
    const url = `${window.location.href.split("#")[0]}#test`;
    const texto = textoCompartir(S.perfil, url);
    const datos = { title: "Test Político · Mi perfil", text: texto };

    const esTactil = Boolean(window.matchMedia?.("(pointer: coarse)").matches);
    const puedeCompartir =
      esTactil && typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(datos));

    if (puedeCompartir) {
      try {
        await navigator.share(datos);
        marcarEstadoCompartir("Compartido", "¡Compartido!", boton);
        return;
      } catch (err) {
        if (err?.name === "AbortError") {
          marcarEstadoCompartir("Compartir cancelado.");
          return;
        }
        console.warn("navigator.share falló, se copia al portapapeles:", err);
      }
    }

    if (await copiarAlPortapapeles(texto)) {
      marcarEstadoCompartir("Texto copiado. ¡Pégalo donde quieras!", "¡Copiado!", boton);
    } else {
      window.prompt("No se pudo copiar automáticamente. Copia este texto (Ctrl/Cmd + C):", texto);
      marcarEstadoCompartir("Copia el texto manualmente desde el cuadro que se ha abierto.");
    }
  } catch (err) {
    console.error("Error al compartir:", err);
    marcarEstadoCompartir("No se pudo compartir. Inténtalo de nuevo.");
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
      toggle.setAttribute("aria-expanded", abrir ? "true" : "false");
      toggle.textContent = abrir ? "Ocultar detalles" : "Ver más detalles";
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
  if (ejesInfo) ejesInfo.innerHTML = EJES.map((e) => ejeInfoHTML(e)).join("");
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

  mostrarPestana({ suave: false });
  actualizarSimuladorMetodologia(null);

  let scoringMod;
  try {
    scoringMod = await import("./scoring.js");
    S.calcular = scoringMod.calcularPerfil;
  } catch (err) {
    return avisar(`No se pudo cargar el motor de cálculo (${err.message}).`);
  }

  S.banco = await cargarJSONConFallback(["../data/questions.json", "./data/questions.json", "/data/questions.json"]);
  if (!S.banco) return avisar("No se pudieron cargar las preguntas.");

  S.tendencias = await cargarJSONConFallback(["../data/tendencias.json", "./data/tendencias.json", "/data/tendencias.json"]);
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
  avisar("Ha ocurrido un error al iniciar la aplicación. Revisa la consola del navegador.");
});