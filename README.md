# Test Político Multidimensional con Matices

Proyecto de cuestionario ideológico diseñado para capturar matices reales sin recurrir a etiquetas partidistas, falsas dicotomías ni sesgos colectivistas.

## Estructura del proyecto
- `docs/01-ejes-y-reglas.md` — Definición formal de los 4 ejes, criterios metodológicos y reglas de redacción.
- `docs/02-auditoria-claude.md` — Registro de auditorías externas, críticas y mejoras aplicadas.
- `data/questions.json` — Banco de ítems estructurado (principios y propuestas/trade-offs, pesos, pares espejo y notas de matiz).
- `data/synthetic_profiles.json` — Perfiles ideológicos de prueba para validar el motor matemático.
- `model/scoring.py` — Cálculo de puntuación ponderada por eje, dispersión intra-eje y consistencia.
- `model/simulate.py` — Simulaciones de estrés y análisis de correlación entre ejes.
- `web/` — Aplicación web del cuestionario y visualización de resultados.