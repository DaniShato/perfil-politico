import fs from "node:fs";
import { calcularPerfil } from "../web/scoring.js";

const banco = JSON.parse(fs.readFileSync("data/questions.json", "utf-8"));
const golden = JSON.parse(fs.readFileSync("tests/golden_vectors.json", "utf-8"));
const vectors = Array.isArray(golden) ? golden : golden.vectors || golden.casos || [];

let mismatches = 0;

for (const v of vectors) {
  const resp = v.respuestas || v.answers || {};
  const opts = {
    dominiosPrioritarios: v.dominios_prioritarios || null,
    ordenMostrado: v.orden_mostrado || null,
    soloNucleo: Boolean(v.solo_nucleo),
  };
  const actual = calcularPerfil(banco, resp, opts);
  const esperado = v.esperado || v.expected || v.resultado;
  if (esperado && esperado.ejes) {
    for (const eje of Object.keys(esperado.ejes)) {
      const sExp = esperado.ejes[eje].score;
      const sAct = actual.ejes[eje].score;
      if (sExp !== null && sAct !== null && Math.abs(sExp - sAct) > 1e-4) {
        mismatches++;
        console.log(`Fallo en ${v.nombre || v.id || "?"} [${eje}]: esperado=${sExp}, actual=${sAct}`);
      }
    }
  }
}

console.log(`Vectores revisados: ${vectors.length} | Fallos: ${mismatches}`);
