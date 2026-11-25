# Ejes y reglas de diseño del test político

## 1. Enfoque general
- El test mide posiciones ideológicas en 4 dimensiones separadas; no asigna afiliación a partidos políticos ni etiquetas cerradas como identidad definitiva.
- La independencia entre ejes es un objetivo de diseño; su correlación real se medirá empíricamente en el piloto.
- Cada ítem se clasifica de forma explícita como `principio` o `propuesta_tradeoff`.
- Un mismo ítem puede cargar sobre uno o varios ejes mediante pesos explícitos y transparentes (`cargas`), con una carga primaria mínima de `0.7` y al menos un `60 %` de ítems puros por eje.
- Cada eje puede dividirse en 2 o 3 facetas internas (con cálculo de dispersión `sigma` por faceta) para capturar matices sin multiplicar el número de ejes principales.

## 2. Ejes del modelo y polos neutros (A / B)
1. **Coordinación económica (`coord_economica`)**:
   - Polo `A`: coordinación descentralizada mediante precios, contratos y asociaciones voluntarias (incluidas iniciativas colectivas o cooperativas no coactivas).
   - Polo `B`: coordinación centralizada mediante planificación, directrices o controles estatales.
2. **Redistribución y bienestar (`redistribucion`)**:
   - Polo `A`: menor redistribución obligatoria de recursos y mayor peso de la iniciativa individual o voluntaria.
   - Polo `B`: mayor redistribución obligatoria de recursos y provisión o corrección colectiva.
3. **Orden social y cultural (`orden_social`)**:
   - Polo `A`: mayor margen para la autonomía individual y la pluralidad de formas de vida y normas locales/privadas.
   - Polo `B`: mayor peso de la cohesión comunitaria, normas compartidas y continuidad cultural o institucional.
4. **Poder y jurisprudencia (`poder_jurisprudencia`)**:
   - Polo `A`: mayor énfasis en límites estrictos al poder coactivo, garantías procesales y control institucional.
   - Polo `B`: mayor énfasis en eficacia ejecutiva, capacidad de actuación coercitiva y orden normativo.

## 3. Reglas de redacción de ítems
- **Minimizar la necesidad de matizar**: formular ítems acotados y específicos sobre un mecanismo, regla o trade-off concreto, evitando afirmaciones absolutas o categóricas que obliguen a corregir mil supuestos.
- **Neutralidad de mecanismo**: evitar sujetos colectivos presupuestos ("mi país debe...", "la sociedad tiene que...") y términos cargados de etiqueta. Describir quién decide, bajo qué regla o mecanismo y qué coste o consecuencia implica.
- **Separar preferencia privada de imposición**: no mezclar lo que una persona, familia o grupo hace voluntariamente con lo que se impone como regla obligatoria a terceros.
- **Una sola idea por ítem**: enunciados directos y afirmativos, sin dobles negaciones ni preguntas de doble cañón.
- **Costes explícitos en trade-offs**: en `propuesta_tradeoff`, enfrentar costes o prioridades reales en conflicto.
- **Pares espejo**: incluir formulaciones en sentido opuesto para medir consistencia interna (`sigma`) sin penalizar perfiles híbridos.

## 4. Escala, dominios y ponderación
- Escala de 5 grados en el enunciado más una opción explícita de **No me posiciono** (`null`), excluida del cálculo del eje.
- Selección final opcional de hasta 3 **dominios temáticos transversales** (por ejemplo: economía/impuestos, trabajo/empresa, familia/vida privada, justicia/seguridad, entorno/recursos) con multiplicador visible (`1.5x`) sobre los ítems de esos dominios.
- En la interfaz, los polos `A` y `B` se presentan con etiquetas descriptivas neutras y posición visual aleatorizada para reducir sesgos de orden o inercia.

## 5. Visualización del resultado
- Mostrar un perfil por eje con posición (`-100` a `+100`), dispersión intra-eje y por faceta (`sigma`), y contraste entre `principio` y `propuesta_tradeoff`.
- Incluir desglose de respuestas, transparencia sobre pesos y una nota metodológica sobre los límites del test.