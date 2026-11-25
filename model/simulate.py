import json
from pathlib import Path
import numpy as np
from scoring import EJES, cargar_banco, calcular_perfil


def verificar_balance_orden(banco: dict) -> None:
    print("=== 0. BALANCE DE ORDEN CANÓNICO ===")
    items = banco["items"]
    for eje in EJES:
        w_sum = 0.0
        first_sum = 0.0
        last_sum = 0.0
        for it in items:
            if it["tipo_respuesta"] in ("preferencia_5", "eleccion_3") and eje in it["peso_ejes"]:
                lam = it["peso_ejes"][eje]
                w_sum += lam
                first_sum += lam * it["opciones"][0]["posiciones"][eje]
                last_sum += lam * it["opciones"][-1]["posiciones"][eje]
        e_first = first_sum / w_sum if w_sum > 0 else 0.0
        e_last = last_sum / w_sum if w_sum > 0 else 0.0
        ok = abs(e_first) <= 0.15 and abs(e_last) <= 0.15
        print(f"  {eje:<22} -> E_first={e_first:+.3f} | E_last={e_last:+.3f} | {'OK' if ok else 'DESBALANCEADO'}")


def verificar_esperanza_aleatoria_analitica(banco: dict) -> None:
    print("\n=== 0B. ESPERANZA ANALÍTICA BAJO RESPUESTA UNIFORME ALEATORIA ===")
    items = banco["items"]
    for eje in EJES:
        num = 0.0
        den = 0.0
        for it in items:
            if eje not in it["peso_ejes"]:
                continue
            lam = it["peso_ejes"][eje]
            den += lam
            tipo_r = it["tipo_respuesta"]
            if tipo_r == "acuerdo_5":
                # Media de [-1, -0.5, 0, 0.5, 1] es 0
                esp_x = 0.0
            elif tipo_r == "preferencia_5":
                pos_a = it["opciones"][0]["posiciones"][eje]
                pos_b = it["opciones"][1]["posiciones"][eje]
                # Respuestas 1..5 equiprobables -> posiciones [pos_a, 0.5*pos_a, 0, 0.5*pos_b, pos_b]
                esp_x = (1.5 * pos_a + 1.5 * pos_b) / 5.0
            else:
                esp_x = sum(op["posiciones"][eje] for op in it["opciones"]) / len(it["opciones"])
            num += lam * esp_x
        e_rand = num / den if den > 0 else 0.0
        estado = "OK" if abs(e_rand) <= 0.02 else "SESGADO"
        print(f"  {eje:<22} -> E_rand={e_rand:+.4f} | {estado}")


def prueba_invarianza_adversarial(banco: dict) -> None:
    print("\n=== 1. PRUEBA ADVERSARIAL DE ÁMBITOS PRIORITARIOS (1.5x) ===")
    ambitos = ["economia_mercados", "impuestos_transferencias"]
    resp = {}
    for it in banco["items"]:
        dentro = it.get("dominio") in ambitos
        if it["tipo_respuesta"] == "acuerdo_5":
            resp[it["id"]] = float(it["direccion"] * (1.0 if dentro else -1.0))
        elif it["tipo_respuesta"] == "preferencia_5":
            pos_a = it["opciones"][0]["posiciones"][it["eje_primario"]]
            resp[it["id"]] = (1 if (pos_a > 0) == dentro else 5)
        else:
            mejor = max(
                it["opciones"],
                key=lambda op: op["posiciones"][it["eje_primario"]] * (1.0 if dentro else -1.0),
            )
            resp[it["id"]] = mejor["id"]

    base = calcular_perfil(banco, resp, dominios_prioritarios=[])
    esc = calcular_perfil(banco, resp, dominios_prioritarios=ambitos)

    for eje in EJES:
        s0 = base["ejes"][eje]["score"]
        s1 = esc["ejes"][eje]["score"]
        delta = abs(s1 - s0)
        assert delta <= 0.25, f"Delta excesivo en {eje}: {delta}"
        print(f"  {eje:<22} -> base={s0:+.3f} | con_ambitos={s1:+.3f} | delta={delta:.4f}")


def _idx_ordinal(u: float) -> int:
    return int(np.digitize(u, [-0.75, -0.25, 0.25, 0.75]))


def _generar_respuestas(
    banco: dict,
    theta: dict[str, float],
    u_faceta: dict[tuple[str, str], float],
    b_item: dict[str, float],
    z_vec: np.ndarray,
    ruido_std: float,
    rng: np.random.Generator,
) -> dict:
    respuestas = {}
    for idx_i, it in enumerate(banco["items"]):
        qid = it["id"]
        tipo_r = it["tipo_respuesta"]
        eje_p = it["eje_primario"]
        fac = it.get("faceta", "general")
        sesgo_i = b_item[qid]
        eps = ruido_std * float(z_vec[idx_i])

        if tipo_r == "acuerdo_5":
            u_eff = np.clip(theta[eje_p] + u_faceta[(eje_p, fac)] + sesgo_i + eps, -1.0, 1.0)
            alineacion = np.clip(it["direccion"] * u_eff, -1.0, 1.0)
            respuestas[qid] = float((_idx_ordinal(alineacion) - 2) / 2.0)

        elif tipo_r == "preferencia_5":
            pos_a = it["opciones"][0]["posiciones"]
            pos_b = it["opciones"][1]["posiciones"]
            w_tot = sum(it["peso_ejes"].values())
            diff = sum(
                lam * np.clip(theta[e] + u_faceta.get((e, fac), 0.0) + sesgo_i, -1.0, 1.0) * (pos_b[e] - pos_a[e]) / 2.0
                for e, lam in it["peso_ejes"].items()
            )
            diff_ruido = np.clip((diff / w_tot) + eps, -1.0, 1.0)
            respuestas[qid] = _idx_ordinal(diff_ruido) + 1

        elif tipo_r == "eleccion_3":
            dists = [
                sum(
                    lam * ((np.clip(theta[e] + u_faceta.get((e, fac), 0.0), -1.0, 1.0) - op["posiciones"][e]) ** 2)
                    for e, lam in it["peso_ejes"].items()
                )
                for op in it["opciones"]
            ]
            beta = 3.0 if ruido_std == 0.0 else max(0.8, 3.0 / (1.0 + 2.0 * ruido_std))
            logits = -beta * np.array(dists)
            logits -= np.max(logits)
            probs = np.exp(logits) / np.sum(np.exp(logits))
            respuestas[qid] = it["opciones"][int(rng.choice(len(it["opciones"]), p=probs))]["id"]

    return respuestas


def comparar_nucleo_vs_completo(banco: dict, n_usuarios: int = 1000, seed: int = 42) -> None:
    print("\n=== 2. COMPARATIVA NÚCLEO (16) VS COMPLETO (48) Y COBERTURA IC 95% ===")
    std_fac, std_sesgo, std_ruido = 0.12, 0.10, 0.50
    print(f"Parámetros: N={n_usuarios}, seed={seed}, std_faceta={std_fac}, std_sesgo={std_sesgo}, std_ruido={std_ruido}")

    rng = np.random.default_rng(seed)
    latentes = rng.uniform(-1.0, 1.0, size=(n_usuarios, len(EJES)))
    facetas_unicas = sorted({(it["eje_primario"], it.get("faceta", "general")) for it in banco["items"]})
    b_item = {it["id"]: float(rng.normal(0.0, std_sesgo)) for it in banco["items"]}
    z_matriz = rng.normal(0.0, 1.0, size=(n_usuarios, len(banco["items"])))

    for modo_nucleo in (True, False):
        etiqueta = "NÚCLEO (16 ítems)" if modo_nucleo else "COMPLETO (48 ítems)"
        err_list = []
        cov_list = []
        r_est = []

        for u in range(n_usuarios):
            theta = dict(zip(EJES, latentes[u]))
            u_fac = {k: float(rng.normal(0.0, std_fac)) for k in facetas_unicas}
            resp = _generar_respuestas(banco, theta, u_fac, b_item, z_matriz[u], std_ruido, rng)
            est = calcular_perfil(banco, resp, solo_nucleo=modo_nucleo)

            vec_s = []
            vec_err = []
            vec_cov = []
            for i, eje in enumerate(EJES):
                info = est["ejes"][eje]
                s = info["score"]
                low, high = info["ic95"]
                vec_s.append(s)
                vec_err.append(abs(s - latentes[u, i]))
                vec_cov.append(1.0 if low <= latentes[u, i] <= high else 0.0)
            r_est.append(vec_s)
            err_list.append(vec_err)
            cov_list.append(vec_cov)

        mae = np.mean(err_list, axis=0)
        cov = np.mean(cov_list, axis=0)
        est_arr = np.array(r_est)
        print(f"\n{etiqueta}:")
        for i, eje in enumerate(EJES):
            corr = np.corrcoef(latentes[:, i], est_arr[:, i])[0, 1]
            print(f"  {eje:<22} -> MAE={mae[i]:.3f} | r={corr:.3f} | cobertura_IC95={cov[i]:.1%}")


def analizar_estilos_y_aleatorio(banco: dict, n_rep: int = 1000, seed: int = 99) -> None:
    print("\n=== 3. ESTILOS DE RESPUESTA Y 1.000 RÉPLICAS ALEATORIAS ===")
    rng = np.random.default_rng(seed)

    # Orden mostrado simulado (canónico y aleatorio)
    orden_canon = {
        it["id"]: [op["id"] for op in it["opciones"]]
        for it in banco["items"]
        if it["tipo_respuesta"] in ("preferencia_5", "eleccion_3")
    }

    estilos = {
        "agree_all_mas_primera": {
            it["id"]: (1.0 if it["tipo_respuesta"] == "acuerdo_5" else (1 if it["tipo_respuesta"] == "preferencia_5" else "A"))
            for it in banco["items"]
        },
        "agree_all_mas_ultima": {
            it["id"]: (1.0 if it["tipo_respuesta"] == "acuerdo_5" else (5 if it["tipo_respuesta"] == "preferencia_5" else "C"))
            for it in banco["items"]
        },
        "midpoint_liner": {
            it["id"]: (0.0 if it["tipo_respuesta"] == "acuerdo_5" else (3 if it["tipo_respuesta"] == "preferencia_5" else None))
            for it in banco["items"]
        },
    }

    for nombre, resp in estilos.items():
        res = calcular_perfil(banco, resp, orden_mostrado=orden_canon)
        scores = {e: res["ejes"][e]["score"] for e in EJES}
        print(f"  {nombre:<22} -> scores={scores} | banderas={res['indicadores_calidad']['banderas']}")

    # 1.000 réplicas aleatorias
    scores_rand = []
    for _ in range(n_rep):
        resp_r = {
            it["id"]: (
                float(rng.choice([-1.0, -0.5, 0.0, 0.5, 1.0])) if it["tipo_respuesta"] == "acuerdo_5"
                else (int(rng.integers(1, 6)) if it["tipo_respuesta"] == "preferencia_5" else str(rng.choice([o["id"] for o in it["opciones"]])))
            )
            for it in banco["items"]
        }
        res_r = calcular_perfil(banco, resp_r)
        scores_rand.append([res_r["ejes"][e]["score"] for e in EJES])

    arr_r = np.array(scores_rand)
    print(f"\n  Aleatorio ({n_rep} réplicas):")
    for i, eje in enumerate(EJES):
        print(f"    {eje:<22} -> media={np.mean(arr_r[:, i]):+.3f} | std={np.std(arr_r[:, i]):.3f}")


def exportar_golden_vectors(banco: dict, out_path: str = "tests/golden_vectors.json") -> None:
    Path("tests").mkdir(exist_ok=True)
    casos = []

    resp_mixto = {
        it["id"]: (
            0.5 if it["direccion"] == -1 else -0.5
        ) if it["tipo_respuesta"] == "acuerdo_5" else (
            2 if it["tipo_respuesta"] == "preferencia_5" else "B"
        )
        for it in banco["items"]
    }
    casos.append({
        "nombre": "perfil_mixto_completo",
        "solo_nucleo": False,
        "dominios_prioritarios": ["economia_mercados"],
        "respuestas": resp_mixto,
        "esperado": calcular_perfil(banco, resp_mixto, dominios_prioritarios=["economia_mercados"], solo_nucleo=False),
    })

    resp_nucleo = {
        it["id"]: (
            1.0 if it["tipo_respuesta"] == "acuerdo_5" else (1 if it["tipo_respuesta"] == "preferencia_5" else "A")
        )
        for it in banco["items"] if it.get("es_nucleo")
    }
    casos.append({
        "nombre": "solo_nucleo_16",
        "solo_nucleo": True,
        "dominios_prioritarios": [],
        "respuestas": resp_nucleo,
        "esperado": calcular_perfil(banco, resp_nucleo, solo_nucleo=True),
    })

    Path(out_path).write_text(json.dumps(casos, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n=== 4. EXPORTADO {out_path} PARA PARIDAD PYTHON <-> JS ===")


if __name__ == "__main__":
    banco = cargar_banco("data/questions.json")
    verificar_balance_orden(banco)
    verificar_esperanza_aleatoria_analitica(banco)
    prueba_invarianza_adversarial(banco)
    comparar_nucleo_vs_completo(banco)
    analizar_estilos_y_aleatorio(banco)
    exportar_golden_vectors(banco)