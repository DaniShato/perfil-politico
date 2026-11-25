export const LANG_STORAGE_KEY = "perfil_politico_lang";

export const DICCIONARIO = {
  es: {
    pageTitle: "Perfil Político · Más allá de las etiquetas",
    brandAria: "Perfil Político — Ir a la página principal",
    footerCopyright: "© 2026 Perfil Político · Más allá de las etiquetas",
    footerBrandAria: "Volver al inicio del test",
    tabs: {
      test: "Test",
      resultados: "Resultados",
      afinidades: "Afinidades",
      metodologia: "Metodología",
      ejes: "Ejes y polos",
    },
    home: {
      eyebrow: "Perfil Político · Más allá de las etiquetas",
      heroTitle: "Descubre tu brújula ideológica sin atajos",
      heroLead:
        "Enfrenta 48 situaciones reales y distintas para ubicar tu postura política y económica en cuatro dimensiones y descubrir qué corrientes filosóficas e ideológicas encajan más contigo.",
      startBtn: "Comenzar el test",
      continueBtn: "Continuar el test",
      retakeBtn: "Hacer el test de nuevo",
      discardBtn: "Descartar y empezar de nuevo",
      discardConfirm: "Se perderán las respuestas dadas hasta ahora. ¿Empezar de nuevo?",
      assurancePrefix: "Gratis · Sin registro ·",
      assuranceQuestionsSuffix: "preguntas",
      assuranceLocal: "Todo se calcula localmente en tu navegador.",
      axesEyebrow: "Qué medimos",
      axesTitle: "Cuatro dimensiones para entender tu postura",
      axesList: [
        {
          title: "Coordinación económica",
          desc: "Iniciativa privada y mercados libres, y dirección y regulación pública.",
        },
        {
          title: "Redistribución",
          desc: "Baja carga fiscal y ayuda voluntaria, e impuestos y provisión pública.",
        },
        {
          title: "Orden social",
          desc: "Autonomía individual y pluralidad, y cohesión y normas comunes.",
        },
        {
          title: "Autoridad del Estado",
          desc: "Garantías y límites al poder, y capacidad ejecutiva y autoridad.",
        },
      ],
      stepsEyebrow: "Cómo funciona",
      stepsTitle: "Tres pasos sencillos",
      stepsList: [
        {
          num: "Paso 01",
          title: "Responde a tu ritmo",
          desc: "Afirmaciones y dilemas sobre economía, impuestos, vida social y poder. Puedes saltar las preguntas que no quieras responder.",
        },
        {
          num: "Paso 02",
          title: "Mira tu perfil por eje",
          desc: "Verás tu posición en cada dimensión con su margen de incertidumbre, sin reducirlo a un único número ni a un solo bando.",
        },
        {
          num: "Paso 03",
          title: "Explora corrientes afines",
          desc: "Comparamos tu perfil con tradiciones políticas, económicas y filosóficas, explicando dónde hay cercanía y dónde hay matices.",
        },
      ],
      currentsEyebrow: "Corrientes y tradiciones",
      currentsTitle: "Un mapa amplio de familias de pensamiento",
      currentsAllBtn: "Ver todas las corrientes",
      currentsIntro:
        "En lugar de centrarse en partidos de un país o una elección concreta, el test contrasta tus respuestas con marcos ideológicos y filosóficos de alcance general:",
      currentPills: [
        "Anarcocapitalismo / voluntarismo de mercado",
        "Autoritarismo estatista",
        "Comunitarismo / humanismo cristiano",
        "Comunismo / Socialismo de planificación",
        "Conservadurismo liberal",
        "Conservadurismo tradicional / social",
        "Corriente socialdemócrata",
        "Liberalismo igualitario / socioliberalismo",
        "Libertarismo minarquista",
        "Perfil moderado / pragmatismo gradualista",
        "Republicanismo cívico",
        "Socialismo democrático / reformista",
        "Socialismo libertario / anarquismo social",
        "Tradición liberal clásica",
      ],
      aboutUniversalEyebrow: "Enfoque universal",
      aboutUniversalTitle: "Pensado para cualquier lugar, sin sesgo electoral",
      aboutUniversalDesc:
        "No mide promesas de campaña ni sistemas de partidos locales. Plantea cuestiones de principio y convivencia para que puedas reflexionar sobre tus propias ideas.",
      aboutPrivacyEyebrow: "Privacidad",
      aboutPrivacyTitle: "Todo ocurre en tu navegador",
      aboutPrivacyDesc:
        "No pedimos cuenta, nombre ni correo. Las respuestas se procesan localmente y desaparecen al cerrar o recargar la página.",
      bottomStartBtn: "Empezar el test",
      bottomMethodLink: "Leer la metodología",
    },
    question: {
      counter: (idx, total) => `Pregunta ${idx} de ${total}`,
      fallbackBlock: "Bloque temático",
      optionLabel: (num) => `Opción ${num}`,
      prevBtn: "Anterior",
      skipBtn: "Prefiero no responder",
      nextBtn: "Siguiente",
      finishBtn: "Ver resultados",
      keysHint: "Atajos de teclado: teclas 1–5 para responder, ← → para moverte.",
    },
    agreement: [
      { v: -1, t: "Totalmente en desacuerdo" },
      { v: -0.5, t: "Algo en desacuerdo" },
      { v: 0, t: "Ni de acuerdo ni en desacuerdo" },
      { v: 0.5, t: "Algo de acuerdo" },
      { v: 1, t: "Totalmente de acuerdo" },
    ],
    preference: [
      { v: 1, t: "Claramente la opción 1" },
      { v: 2, t: "Más bien la opción 1" },
      { v: 3, t: "Me parecen igual de bien" },
      { v: 4, t: "Más bien la opción 2" },
      { v: 5, t: "Claramente la opción 2" },
    ],
    domains: {
      economia_mercados: "Economía y mercados",
      abastecimiento_precios: "Precios y suministros",
      ayuda_y_solidaridad: "Ayuda y solidaridad",
      impuestos_transferencias: "Impuestos y transferencias",
      cultura_costumbres: "Cultura y costumbres",
      familia_vida_privada: "Familia y vida privada",
      normas_y_convivencia: "Normas y convivencia",
      estado_y_fronteras: "Estado y fronteras",
      justicia_garantias: "Justicia y garantías",
    },
    results: {
      emptyTitle: "Todavía no hay resultados",
      emptyDesc: "Completa el test para ver tu posición en cada eje.",
      goTestBtn: "Ir al test",
      profileTitle: "Tu perfil",
      statusComplete: (n) => `Resultado completo · ${n} preguntas`,
      shareBtn: "Compartir resultados",
      summaryTitle: "En pocas palabras...",
      summaryFootnote:
        "Es una lectura orientativa de tus respuestas, no una etiqueta. Las posiciones se leen sobre un espectro continuo.",
      axesDetailTitle: "Cada eje en detalle",
      contrastsTitle: "Tus contrastes",
      nolanTitle: "Diagrama de orientación política",
      nolanFootnote:
        "Resume los cuatro ejes en dos dimensiones compuestas: Economía (promedio de coordinación económica y redistribución) y Sociedad (promedio de orden social y autoridad del Estado). Todo punto posible cae dentro del cuadrado. La cruz es el margen probable en cada dimensión, y los puntos de colores de los márgenes muestran cada eje por separado.",
      affinitiesTitle: "Afinidades orientativas",
      repeatBtn: "Repetir el test",
      noClearFit:
        'Tus respuestas muestran un perfil equilibrado o repartido sin una corriente cercana destacada. Puedes revisar todas las corrientes en la pestaña <a href="#afinidades">Afinidades</a>.',
      affinitiesFootnote:
        'Selección orientativa mostrada en orden alfabético. Consulta todas las corrientes en la pestaña <a href="#afinidades">Afinidades</a>.',
    },
    affinitiesPage: {
      title: "Afinidades y corrientes",
      lead: "Aquí puedes explorar las corrientes políticas, económicas y filosóficas incluidas en la página y qué rasgo general describe cada una. Sirven como orientación comparativa y no encasillan por sí solas: dentro de cada corriente existen posturas diversas.",
      notMeasured:
        "Este test no mide tecnología, ecología, religión, política exterior ni identidad territorial o nacional.",
      showDetails: "Ver más detalles",
      hideDetails: "Ocultar detalles",
    },
    methodology: {
      title: "Metodología",
      lead: "Una guía sencilla para entender qué mide este test, cómo se leen las escalas y qué significan los márgenes o avisos que aparecen en tus resultados.",
      localNote:
        "Todo el cálculo se ejecuta localmente en tu navegador, sin etiquetas cerradas ni envío de respuestas a servidores externos.",
      sampleKicker: "Ejemplo de lectura",
      sampleAxisName: "Coordinación económica",
      sampleReading: "Inclinación moderada hacia acuerdos voluntarios",
      sampleBadge: "36 %",
      sampleNeg: "Mercado y acuerdos voluntarios",
      samplePos: "Dirección y gestión públicas",
      sampleNumbersPrefix: "Intensidad",
      sampleIndexLabel: "Índice",
      sampleMargin: "(margen probable de −0,64 a −0,08)",
      sampleFootnote:
        "El punto marca tu posición media; la franja sombreada indica el margen probable según tus respuestas.",
      whatMeasuresTitle: "Qué mide (y qué no pretende medir)",
      whatMeasuresP1:
        "El test sitúa tus respuestas en cuatro ejes continuos —<strong>Coordinación económica</strong>, <strong>Redistribución</strong>, <strong>Orden social</strong> y <strong>Poder y jurisprudencia</strong>— para ofrecerte un mapa orientativo y compararlo con corrientes políticas y filosóficas.",
      whatMeasuresP2:
        "No es un diagnóstico clínico ni una recomendación de voto. Resume tendencias generales entre dos polos, sabiendo que en casos concretos todos podemos matizar nuestra postura.",
      techSummary: "Ver detalles técnicos y fórmulas",
      techIntro:
        "Cada pregunta $i$ aporta una posición $x_i \\in [-1, 1]$ y un peso $w_i$ en cada eje aplicable. La puntuación final $s$ del eje se obtiene como media ponderada:",
      techCoverage:
        "<strong>Cobertura mínima:</strong> se requieren al menos $3$ respuestas en el eje y cubrir al menos el $60\\,%$ de su peso total para mostrar puntuación.",
      techMargin:
        "<strong>Margen probable ($\\text{IC } 95\\,%$):</strong> se estima mediante $s \\pm 1{,}96 \\cdot \\text{SE}$, acotado en $[-1, 1]$, combinando dispersión por ítem y por faceta temática.",
      techSpread:
        "<strong>Variación interna ($\\sigma$):</strong> desviación típica ponderada de tus respuestas respecto a $s$ (calculada desde $4$ respuestas); si $\\sigma \\ge 0{,}65$ se señala tensión interna.",
      questionnaireTitle: "Cómo se plantea el cuestionario",
      questionnaireItems: [
        {
          badge: "Formatos",
          title: "Tres formas de responder",
          desc: "Escalas de acuerdo en cinco pasos, comparaciones entre dos posturas con grados intermedios y elecciones entre tres planteamientos distintos.",
        },
        {
          badge: "Orden",
          title: "Preguntas mezcladas y opciones barajadas",
          desc: "Los temas se intercalan y el orden de las opciones cambia en cada partida para reducir el efecto de posición en pantalla.",
        },
        {
          badge: "Matices",
          title: "Sin etiquetas de entrada",
          desc: "Se evitan etiquetas comodín como «izquierda» o «derecha» en los enunciados para centrarse en qué se prioriza en cada situación.",
        },
        {
          badge: "Privacidad",
          title: "Todo ocurre en tu navegador",
          desc: "Tus respuestas no se envían a ningún servidor ni se guardan fuera. Al cerrar o recargar la pestaña se borran (con aviso si estás a mitad del test).",
        },
      ],
      simEyebrow: "Pruébalo aquí mismo",
      simTitle: "Simulador rápido de un eje",
      simLead:
        "<strong>Selección múltiple:</strong> puedes activar o combinar uno, dos o los tres botones a la vez para ver cómo se desplaza el punto en la barra.",
      simBtns: [
        "Respuesta 1: algo hacia Polo A",
        "Respuesta 2: algo hacia Polo B",
        "Respuesta 3: claramente Polo B",
      ],
      simPoleA: "Polo A",
      simPoleB: "Polo B",
      simCalcSummary: "Ver cálculo numérico de este ejemplo",
      flagsPanelTitle: "Avisos de lectura y contrastes",
      flagsPanelDesc:
        "A veces aparecen notas si respondes casi siempre en el mismo sentido, eliges repetidamente la primera opción, das respuestas muy planas o muestras discrepancias entre preguntas inversas. Son pistas para leer el resultado con calma.",
      versionsPanelTitle: "Versiones del test",
      versionsPanelDesc:
        "El cuestionario y el motor de cálculo pueden actualizarse para mejorar claridad o cobertura.",
      versionsBankLabel: "Banco",
      versionsEngineLabel: "Motor",
      versionsQuestionsLabel: "Preguntas",
    },
    axesPage: {
      title: "Ejes y polos",
      lead: "Cada eje es un espectro con dos polos. Estar en un polo no es «bueno» ni «malo», y el centro tampoco es una respuesta correcta. Los ejes son independientes: puedes estar en cualquier punto de uno sin que eso determine los demás.",
      centerEyebrow: "Lectura de la escala",
      centerTitle: "Qué significa el centro y qué significan los polos",
      centerDesc:
        "Situarse cerca de un polo refleja una prioridad constante cuando entra en juego ese criterio. Situarse cerca del centro o en un punto intermedio no equivale a no tener opinión: suele indicar que sopesas los costes de cada opción, que buscas equilibrio o que la respuesta cambia según el caso concreto.",
      crossEyebrow: "Cruce de dimensiones",
      crossTitle: "Por qué los cuatro ejes van por separado",
      crossDesc:
        "En la práctica política rara vez todo va en bloque. Alguien puede preferir mercados abiertos y baja carga fiscal, pero defender normas sociales compartidas o una autoridad firme del Estado; o bien combinar redistribución pública con amplia autonomía personal. Medir cada eje por separado evita meter perfiles distintos en el mismo cajón.",
    },
    share: {
      incomplete: "Completa el test para poder compartir tus resultados.",
      sharedStatus: "Compartido",
      sharedBtn: "¡Compartido!",
      cancelled: "Compartir cancelado.",
      copiedStatus: "Texto copiado. ¡Pégalo donde quieras!",
      copiedBtn: "¡Copiado!",
      manualPrompt: "No se pudo copiar automáticamente. Copia este texto (Ctrl/Cmd + C):",
      manualStatus: "Copia el texto manualmente desde el cuadro que se ha abierto.",
      errorStatus: "No se pudo compartir. Inténtalo de nuevo.",
      title: "Test Político · Mi perfil",
    },
    simulator: {
      balanced: "Punto intermedio o equilibrado entre ambos polos.",
      strongA: "Tendencia clara hacia el Polo A.",
      slightA: "Ligera inclinación hacia el Polo A.",
      strongB: "Tendencia clara hacia el Polo B.",
      slightB: "Tendencia moderada hacia el Polo B.",
      emptyCalc: "Sin respuestas activas seleccionadas: el punto se queda en el centro (0,00).",
      calcPrefix: "Valores activos:",
      calcMid: "· Promedio simple:",
      calcSuffix: "(en una escala de −1 a +1).",
    },
    errors: {
      scoringLoad: (msg) => `No se pudo cargar el motor de cálculo (${msg}).`,
      questionsLoad: "No se pudieron cargar las preguntas.",
      initGeneric: "Ha ocurrido un error al iniciar la aplicación. Revisa la consola del navegador.",
    },
  },

  en: {
    pageTitle: "Political Profile · Beyond Labels",
    brandAria: "Political Profile — Go to homepage",
    footerCopyright: "© 2026 Political Profile · Beyond Labels",
    footerBrandAria: "Back to the start of the test",
    tabs: {
      test: "Test",
      resultados: "Results",
      afinidades: "Affinities",
      metodologia: "Methodology",
      ejes: "Axes & Poles",
    },
    home: {
      eyebrow: "Political Profile · Beyond Labels",
      heroTitle: "Discover your ideological compass without shortcuts",
      heroLead:
        "Face 48 distinct real-world situations to place your political and economic stance across four dimensions and explore which philosophical and ideological traditions fit you best.",
      startBtn: "Start the test",
      continueBtn: "Continue the test",
      retakeBtn: "Take the test again",
      discardBtn: "Discard and start over",
      discardConfirm: "Your current answers will be lost. Start over?",
      assurancePrefix: "Free · No sign-up ·",
      assuranceQuestionsSuffix: "questions",
      assuranceLocal: "Everything runs locally in your browser.",
      axesEyebrow: "What we measure",
      axesTitle: "Four dimensions to understand your stance",
      axesList: [
        {
          title: "Economic coordination",
          desc: "Private initiative and free markets, and public direction and regulation.",
        },
        {
          title: "Redistribution",
          desc: "Lower tax burden and voluntary aid, and taxes and public provision.",
        },
        {
          title: "Social order",
          desc: "Individual autonomy and plurality, and cohesion and shared norms.",
        },
        {
          title: "State authority",
          desc: "Safeguards and limits on power, and executive capacity and authority.",
        },
      ],
      stepsEyebrow: "How it works",
      stepsTitle: "Three simple steps",
      stepsList: [
        {
          num: "Step 01",
          title: "Answer at your own pace",
          desc: "Statements and dilemmas on economy, taxes, social life, and power. You can skip any question you prefer not to answer.",
        },
        {
          num: "Step 02",
          title: "See your profile by axis",
          desc: "You will see your position on each dimension along with its uncertainty margin, without reducing it to one number or one side.",
        },
        {
          num: "Step 03",
          title: "Explore matching currents",
          desc: "We compare your profile against political, economic, and philosophical traditions, explaining where alignment and nuances lie.",
        },
      ],
      currentsEyebrow: "Traditions & currents",
      currentsTitle: "A broad map of schools of thought",
      currentsAllBtn: "View all currents",
      currentsIntro:
        "Rather than focusing on parties in one country or a specific election, the test contrasts your answers with broad ideological and philosophical frameworks:",
      currentPills: [
        "Anarcho-capitalism / market voluntarism",
        "Statist authoritarianism",
        "Communitarianism / Christian humanism",
        "Communism / Planned socialism",
        "Liberal conservatism",
        "Traditional / social conservatism",
        "Social democratic current",
        "Egalitarian liberalism / social liberalism",
        "Minarchist libertarianism",
        "Moderate profile / gradualist pragmatism",
        "Civic republicanism",
        "Democratic / reformist socialism",
        "Libertarian socialism / social anarchism",
        "Classical liberal tradition",
      ],
      aboutUniversalEyebrow: "Universal approach",
      aboutUniversalTitle: "Designed for anywhere, without electoral bias",
      aboutUniversalDesc:
        "It does not measure campaign promises or local party systems. It raises questions of principle and coexistence so you can reflect on your own ideas.",
      aboutPrivacyEyebrow: "Privacy",
      aboutPrivacyTitle: "Everything happens in your browser",
      aboutPrivacyDesc:
        "We do not ask for an account, name, or email. Answers are processed locally and disappear when you close or reload the page.",
      bottomStartBtn: "Start the test",
      bottomMethodLink: "Read the methodology",
    },
    question: {
      counter: (idx, total) => `Question ${idx} of ${total}`,
      fallbackBlock: "Topic block",
      optionLabel: (num) => `Option ${num}`,
      prevBtn: "Previous",
      skipBtn: "Prefer not to answer",
      nextBtn: "Next",
      finishBtn: "See results",
      keysHint: "Keyboard shortcuts: keys 1–5 to answer, ← → to navigate.",
    },
    agreement: [
      { v: -1, t: "Strongly disagree" },
      { v: -0.5, t: "Somewhat disagree" },
      { v: 0, t: "Neither agree nor disagree" },
      { v: 0.5, t: "Somewhat agree" },
      { v: 1, t: "Strongly agree" },
    ],
    preference: [
      { v: 1, t: "Clearly option 1" },
      { v: 2, t: "Rather option 1" },
      { v: 3, t: "They seem equally good to me" },
      { v: 4, t: "Rather option 2" },
      { v: 5, t: "Clearly option 2" },
    ],
    domains: {
      economia_mercados: "Economy & markets",
      abastecimiento_precios: "Prices & supply",
      ayuda_y_solidaridad: "Aid & solidarity",
      impuestos_transferencias: "Taxes & transfers",
      cultura_costumbres: "Culture & customs",
      familia_vida_privada: "Family & private life",
      normas_y_convivencia: "Rules & civic life",
      estado_y_fronteras: "State & borders",
      justicia_garantias: "Justice & safeguards",
    },
    results: {
      emptyTitle: "No results yet",
      emptyDesc: "Complete the test to see your position on each axis.",
      goTestBtn: "Go to test",
      profileTitle: "Your profile",
      statusComplete: (n) => `Complete result · ${n} questions`,
      shareBtn: "Share results",
      summaryTitle: "In short...",
      summaryFootnote:
        "This is an indicative reading of your answers, not a label. Positions are read along a continuous spectrum.",
      axesDetailTitle: "Each axis in detail",
      contrastsTitle: "Your contrasts",
      nolanTitle: "Political orientation diagram",
      nolanFootnote:
        "Summarizes the four axes into two composite dimensions: Economy (average of economic coordination and redistribution) and Society (average of social order and state authority). Every possible point lies inside the square. The cross shows the probable range on each dimension, and the colored margin dots show each axis individually.",
      affinitiesTitle: "Indicative affinities",
      repeatBtn: "Retake the test",
      noClearFit:
        'Your answers show a balanced or spread profile without a single standout tradition. You can browse all currents in the <a href="#afinidades">Affinities</a> tab.',
      affinitiesFootnote:
        'Indicative selection shown in alphabetical order. Browse all currents in the <a href="#afinidades">Affinities</a> tab.',
    },
    affinitiesPage: {
      title: "Affinities and currents",
      lead: "Here you can explore the political, economic, and philosophical traditions included on the site and the general trait each one describes. They serve as a comparative guide rather than a rigid box: diverse views exist within every tradition.",
      notMeasured:
        "This test does not measure technology, ecology, religion, foreign policy, or territorial or national identity.",
      showDetails: "See more details",
      hideDetails: "Hide details",
    },
    methodology: {
      title: "Methodology",
      lead: "A simple guide to what this test measures, how scales are read, and what the margins or notes in your results mean.",
      localNote:
        "All calculations run locally in your browser, with no closed labels and no answers sent to external servers.",
      sampleKicker: "Reading example",
      sampleAxisName: "Economic coordination",
      sampleReading: "Moderate lean toward voluntary agreements",
      sampleBadge: "36 %",
      sampleNeg: "Markets and voluntary agreements",
      samplePos: "Public direction and management",
      sampleNumbersPrefix: "Intensity",
      sampleIndexLabel: "Index",
      sampleMargin: "(probable range −0.64 to −0.08)",
      sampleFootnote:
        "The dot marks your mean position; the shaded band shows the probable range based on your answers.",
      whatMeasuresTitle: "What it measures (and what it does not aim to measure)",
      whatMeasuresP1:
        "The test places your answers along four continuous axes —<strong>Economic coordination</strong>, <strong>Redistribution</strong>, <strong>Social order</strong>, and <strong>Power and jurisprudence</strong>— to give you an indicative map and compare it with political and philosophical traditions.",
      whatMeasuresP2:
        "It is not a clinical diagnosis or a voting recommendation. It summarizes general tendencies between two poles, knowing that in specific cases we can all nuance our stance.",
      techSummary: "See technical details and formulas",
      techIntro:
        "Each question $i$ contributes a position $x_i \\in [-1, 1]$ and a weight $w_i$ on each applicable axis. The final axis score $s$ is computed as a weighted average:",
      techCoverage:
        "<strong>Minimum coverage:</strong> at least $3$ answers on the axis and at least $60\\%$ of its total weight are required to display a score.",
      techMargin:
        "<strong>Probable range ($95\\%$ CI):</strong> estimated via $s \\pm 1.96 \\cdot \\text{SE}$, bounded to $[-1, 1]$, combining item-level and topic-facet spread.",
      techSpread:
        "<strong>Internal spread ($\\sigma$):</strong> weighted standard deviation of your answers around $s$ (computed from $4$ answers); if $\\sigma \\ge 0.65$, internal tension is flagged.",
      questionnaireTitle: "How the questionnaire is structured",
      questionnaireItems: [
        {
          badge: "Formats",
          title: "Three ways to answer",
          desc: "Five-step agreement scales, comparisons between two positions with intermediate degrees, and choices among three distinct statements.",
        },
        {
          badge: "Order",
          title: "Mixed questions and shuffled options",
          desc: "Topics are interleaved and option order changes on each run to reduce screen-position bias.",
        },
        {
          badge: "Nuances",
          title: "No upfront labels",
          desc: "Catch-all labels like “left” or “right” are avoided in prompts so the focus stays on what is prioritized in each situation.",
        },
        {
          badge: "Privacy",
          title: "Everything runs in your browser",
          desc: "Your answers are never sent to a server or stored externally. Closing or reloading the tab clears them (with a warning mid-test).",
        },
      ],
      simEyebrow: "Try it right here",
      simTitle: "Quick single-axis simulator",
      simLead:
        "<strong>Multiple selection:</strong> you can toggle or combine one, two, or all three buttons at once to see how the marker moves along the track.",
      simBtns: [
        "Answer 1: somewhat toward Pole A",
        "Answer 2: somewhat toward Pole B",
        "Answer 3: clearly Pole B",
      ],
      simPoleA: "Pole A",
      simPoleB: "Pole B",
      simCalcSummary: "See numerical calculation for this example",
      flagsPanelTitle: "Reading notes and contrasts",
      flagsPanelDesc:
        "Notes sometimes appear if you answer almost always in the same direction, repeatedly pick the first option, give very flat answers, or show discrepancies across inverse questions. They are cues to read your result thoughtfully.",
      versionsPanelTitle: "Test versions",
      versionsPanelDesc:
        "The question bank and scoring engine may be updated to improve clarity or coverage.",
      versionsBankLabel: "Bank",
      versionsEngineLabel: "Engine",
      versionsQuestionsLabel: "Questions",
    },
    axesPage: {
      title: "Axes and poles",
      lead: "Each axis is a spectrum with two poles. Being at one pole is neither “good” nor “bad,” and the center is not a “right” answer either. Axes are independent: you can sit anywhere on one without determining the others.",
      centerEyebrow: "Reading the scale",
      centerTitle: "What the center and the poles mean",
      centerDesc:
        "Sitting near a pole reflects a steady priority whenever that criterion comes into play. Sitting near the center or at an intermediate point does not mean having no opinion: it often means weighing the costs of each option, seeking balance, or shifting depending on the specific case.",
      crossEyebrow: "Crossing dimensions",
      crossTitle: "Why the four axes are kept separate",
      crossDesc:
        "In political practice, views rarely move as a single block. Someone might prefer open markets and lower taxes while supporting shared social norms or firm state authority, or combine public redistribution with broad personal autonomy. Measuring each axis separately avoids lumping distinct profiles into one box.",
    },
    share: {
      incomplete: "Complete the test before sharing your results.",
      sharedStatus: "Shared",
      sharedBtn: "Shared!",
      cancelled: "Sharing cancelled.",
      copiedStatus: "Text copied. Paste it wherever you like!",
      copiedBtn: "Copied!",
      manualPrompt: "Could not copy automatically. Copy this text (Ctrl/Cmd + C):",
      manualStatus: "Copy the text manually from the dialog that opened.",
      errorStatus: "Could not share. Please try again.",
      title: "Political Profile · My profile",
    },
    simulator: {
      balanced: "Intermediate or balanced point between both poles.",
      strongA: "Clear tendency toward Pole A.",
      slightA: "Slight lean toward Pole A.",
      strongB: "Clear tendency toward Pole B.",
      slightB: "Moderate lean toward Pole B.",
      emptyCalc: "No active responses selected: the marker stays at the center (0.00).",
      calcPrefix: "Active values:",
      calcMid: "· Simple average:",
      calcSuffix: "(on a scale from −1 to +1).",
    },
    errors: {
      scoringLoad: (msg) => `Could not load the scoring engine (${msg}).`,
      questionsLoad: "Could not load the questions.",
      initGeneric: "An error occurred while starting the app. Check the browser console.",
    },
  },
};

export function obtenerIdiomaInicial() {
  try {
    const guardado = localStorage.getItem(LANG_STORAGE_KEY);
    if (guardado === "en" || guardado === "es") return guardado;
  } catch {
    // Ignora restricciones de almacenamiento
  }
  const navLang = (navigator.language || "es").toLowerCase();
  return navLang.startsWith("en") ? "en" : "es";
}

export function guardarIdioma(lang) {
  const normalizado = lang === "en" ? "en" : "es";
  try {
    localStorage.setItem(LANG_STORAGE_KEY, normalizado);
  } catch {
    // Ignora restricciones de almacenamiento
  }
  return normalizado;
}

export function t(lang) {
  return DICCIONARIO[lang === "en" ? "en" : "es"];
}