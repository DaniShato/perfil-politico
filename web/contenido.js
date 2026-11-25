// Textos del test en ES y EN. El orden de las claves de EJES_INFO_POR_IDIOMA.es define el orden de los ejes en pantalla.
export const EJES_INFO_POR_IDIOMA = {
  es: {
    coord_economica: {
      nombre: "Coordinación económica",
      corto: "Economía",
      neg: "Mercado y acuerdos voluntarios",
      pos: "Dirección y gestión públicas",
      negCorto: "Mercado",
      posCorto: "Dirección pública",
      hacia: {
        neg: "el mercado y los acuerdos voluntarios",
        pos: "la dirección y la gestión públicas",
      },
      descripcion:
        "Cómo debería decidirse qué se produce, a qué precio y quién gestiona los servicios: mediante acuerdos entre personas y empresas, o mediante planificación, reglas y gestión de las administraciones.",
      ejemplos: ["Fijación de precios y sueldos", "Licencias y regulación de empresas", "Servicios básicos: propiedad y elección"],
    },
    redistribucion: {
      nombre: "Redistribución",
      corto: "Redistribución",
      neg: "Menos impuestos y ayuda voluntaria",
      pos: "Más impuestos y provisión pública",
      negCorto: "Menos impuestos",
      posCorto: "Más redistribución",
      hacia: {
        neg: "menos impuestos y más ayuda voluntaria",
        pos: "más redistribución mediante impuestos y servicios públicos",
      },
      descripcion:
        "Cuánto debe repartir la sociedad entre sus miembros mediante impuestos, ayudas y servicios obligatorios, frente a dejarlo a los ingresos de cada persona y a la ayuda voluntaria.",
      ejemplos: ["Impuestos progresivos y herencias", "Pensiones y sanidad", "Diseño de las ayudas"],
    },
    orden_social: {
      nombre: "Orden social",
      corto: "Orden social",
      neg: "Autonomía individual y pluralidad",
      pos: "Cohesión y normas comunes",
      negCorto: "Autonomía",
      posCorto: "Cohesión",
      hacia: {
        neg: "la autonomía individual y la pluralidad",
        pos: "la cohesión y las normas comunes",
      },
      descripcion:
        "Hasta qué punto la sociedad debe sostener costumbres, valores y normas compartidas, frente a que cada persona viva según sus propias decisiones y convivan estilos de vida distintos.",
      ejemplos: ["Costumbres y modelos de familia", "Eutanasia, aborto y libertad de expresión", "Fronteras, religión y cultura común"],
    },
    poder_jurisprudencia: {
      nombre: "Poder y jurisprudencia",
      corto: "Poder",
      neg: "Garantías y límites al poder",
      pos: "Autoridad del Estado",
      negCorto: "Garantías",
      posCorto: "Autoridad",
      hacia: {
        neg: "las garantías y los límites al poder",
        pos: "la autoridad y la capacidad de actuar del Estado",
      },
      descripcion:
        "Cuánto poder debe tener el Estado para sancionar, investigar y exigir, frente a más garantías procesales, controles y autonomía de las personas y de las comunidades.",
      ejemplos: ["Garantías del proceso penal y penas", "Vigilancia y anonimato en internet", "Secesión, servicio militar y legitimidad de las leyes"],
    },
  },

  en: {
    coord_economica: {
      nombre: "Economic coordination",
      corto: "Economy",
      neg: "Markets and voluntary agreements",
      pos: "Public direction and management",
      negCorto: "Markets",
      posCorto: "Public direction",
      hacia: {
        neg: "markets and voluntary agreements",
        pos: "public direction and management",
      },
      descripcion:
        "How decisions should be made on what is produced, at what price, and who runs services: through agreements among individuals and firms, or through planning, rules, and public administration.",
      ejemplos: ["Pricing and wages", "Business licensing and regulation", "Essential services: ownership and choice"],
    },
    redistribucion: {
      nombre: "Redistribution",
      corto: "Redistribution",
      neg: "Lower taxes and voluntary aid",
      pos: "Higher taxes and public provision",
      negCorto: "Lower taxes",
      posCorto: "More redistribution",
      hacia: {
        neg: "lower taxes and more voluntary aid",
        pos: "more redistribution through taxes and public services",
      },
      descripcion:
        "How much society should redistribute among members via taxes, assistance, and mandatory services, versus leaving it to personal income and voluntary help.",
      ejemplos: ["Progressive taxes and inheritance", "Pensions and healthcare", "Design of welfare support"],
    },
    orden_social: {
      nombre: "Social order",
      corto: "Social order",
      neg: "Individual autonomy and plurality",
      pos: "Cohesion and shared norms",
      negCorto: "Autonomy",
      posCorto: "Cohesion",
      hacia: {
        neg: "individual autonomy and plurality",
        pos: "cohesion and shared norms",
      },
      descripcion:
        "To what extent society should uphold shared customs, values, and norms, versus letting each person live by their own choices with diverse lifestyles coexisting.",
      ejemplos: ["Customs and family models", "Euthanasia, abortion, and free speech", "Borders, religion, and common culture"],
    },
    poder_jurisprudencia: {
      nombre: "Power and jurisprudence",
      corto: "Power",
      neg: "Safeguards and limits on power",
      pos: "State authority",
      negCorto: "Safeguards",
      posCorto: "Authority",
      hacia: {
        neg: "safeguards and limits on power",
        pos: "state authority and executive capacity",
      },
      descripcion:
        "How much power the state should hold to sanction, investigate, and enforce, versus stronger procedural safeguards, checks, and autonomy for individuals and communities.",
      ejemplos: ["Criminal due process and penalties", "Surveillance and online anonymity", "Secession, conscription, and legitimacy of laws"],
    },
  },
};

export const MENSAJES_BANDERAS_POR_IDIOMA = {
  es: {
    aquiescencia_extrema:
      "Casi todas tus respuestas a las afirmaciones iban en el mismo sentido (de acuerdo o en desacuerdo), con independencia de su contenido.",
    sesgo_orden_visual: "Has elegido con mucha frecuencia la opción que aparecía en primer lugar.",
    inconsistencia_espejos: "Algunas afirmaciones casi opuestas recibieron respuestas que no encajan entre sí.",
    respuesta_plana_o_neutra: "La mayoría de tus respuestas fueron neutras o muy intermedias.",
  },
  en: {
    aquiescencia_extrema:
      "Almost all of your answers to statements leaned in the same direction (agree or disagree), regardless of content.",
    sesgo_orden_visual: "You very frequently chose the option that appeared first.",
    inconsistencia_espejos: "Some nearly opposite statements received answers that do not align with each other.",
    respuesta_plana_o_neutra: "Most of your answers were neutral or close to the middle.",
  },
};

export const EJES_INFO = EJES_INFO_POR_IDIOMA.es;
export const MENSAJES_BANDERAS = MENSAJES_BANDERAS_POR_IDIOMA.es;

export function obtenerEjesInfo(lang = "es") {
  return EJES_INFO_POR_IDIOMA[lang === "en" ? "en" : "es"];
}

export function obtenerMensajesBanderas(lang = "es") {
  return MENSAJES_BANDERAS_POR_IDIOMA[lang === "en" ? "en" : "es"];
}