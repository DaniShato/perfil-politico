// Textos del test. El orden de las claves define el orden de los ejes en pantalla.
export const EJES_INFO = {
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
};

export const MENSAJES_BANDERAS = {
  aquiescencia_extrema:
    "Casi todas tus respuestas a las afirmaciones iban en el mismo sentido (de acuerdo o en desacuerdo), con independencia de su contenido.",
  sesgo_orden_visual: "Has elegido con mucha frecuencia la opción que aparecía en primer lugar.",
  inconsistencia_espejos: "Algunas afirmaciones casi opuestas recibieron respuestas que no encajan entre sí.",
  respuesta_plana_o_neutra: "La mayoría de tus respuestas fueron neutras o muy intermedias.",
};
