import json
import math
from pathlib import Path
from typing import Any

EJES = [
    "coord_economica",
    "redistribucion",
    "orden_social",
    "poder_jurisprudencia",
]

SCORING_VERSION = "1.3.1"


def cargar_banco(path: str | Path = "data/questions.json") -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    validar_banco(data)
    return data


def validar_banco(data: dict[str, Any]) -> None:
    items = data.get("items", [])
    if not items:
        raise ValueError("El banco no contiene ítems.")

    ids = [it["id"] for it in items]
    if len(ids) != len(set(ids)):
        raise ValueError("Existen IDs duplicados en el banco.")

    by_id = {it["id"]: it for it in items}
    balance_acuerdo = {eje: 0 for eje in EJES}

    for it in items:
        qid = it["id"]
        tipo_r = it["tipo_respuesta"]
        peso_ejes = it["peso_ejes"]

        if it["eje_primario"] not in EJES or it["eje_primario"] not in peso_ejes:
            raise ValueError(f"{qid}: eje_primario inválido o ausente en peso_ejes.")

        eje_max = max(peso_ejes.items(), key=lambda kv: kv[1])[0]
        if it["eje_primario"] != eje_max:
            raise ValueError(
                f"{qid}: eje_primario '{it['eje_primario']}' no tiene el mayor peso (mayor: '{eje_max}')."
            )

        for eje, lam in peso_ejes.items():
            if eje not in EJES or lam <= 0:
                raise ValueError(f"{qid}: peso inválido en eje {eje}.")

        if tipo_r == "acuerdo_5":
            if it.get("direccion") not in (-1, 1):
                raise ValueError(f"{qid}: acuerdo_5 requiere direccion -1 o 1.")
            balance_acuerdo[it["eje_primario"]] += it["direccion"]

            espejo_id = it.get("espejo")
            if espejo_id:
                if espejo_id not in by_id:
                    raise ValueError(f"{qid}: espejo {espejo_id} no existe.")
                esp = by_id[espejo_id]
                if esp.get("espejo") != qid:
                    raise ValueError(f"{qid} y {espejo_id} no son espejos recíprocos.")
                if esp.get("direccion") != -it["direccion"]:
                    raise ValueError(f"{qid} y {espejo_id} deben tener direcciones opuestas.")

        elif tipo_r in ("preferencia_5", "eleccion_3"):
            if "direccion" in it:
                raise ValueError(f"{qid}: {tipo_r} no debe tener campo direccion.")
            opciones = it.get("opciones", [])
            esperado_n = 2 if tipo_r == "preferencia_5" else 3
            if len(opciones) != esperado_n:
                raise ValueError(f"{qid}: esperaba {esperado_n} opciones, tiene {len(opciones)}.")

            for op in opciones:
                pos = op.get("posiciones", {})
                if set(pos.keys()) != set(peso_ejes.keys()):
                    raise ValueError(
                        f"{qid} ({op['id']}): claves de posiciones {set(pos.keys())} != peso_ejes {set(peso_ejes.keys())}."
                    )
                for val in pos.values():
                    if not (-1.0 <= val <= 1.0):
                        raise ValueError(f"{qid} ({op['id']}): posición {val} fuera de [-1, 1].")
        else:
            raise ValueError(f"{qid}: tipo_respuesta desconocido '{tipo_r}'.")

    for eje, suma_dir in balance_acuerdo.items():
        if suma_dir != 0:
            raise ValueError(f"Desbalance de aquiescencia en {eje}: suma de direcciones = {suma_dir}.")


def _posicion_item(item: dict[str, Any], respuesta: Any) -> dict[str, float] | None:
    if respuesta is None:
        return None

    tipo_r = item["tipo_respuesta"]
    ejes_item = list(item["peso_ejes"].keys())

    if tipo_r == "acuerdo_5":
        if not (-1.0 <= float(respuesta) <= 1.0):
            raise ValueError(f"{item['id']}: respuesta acuerdo_5 fuera de [-1, 1].")
        pos_val = item["direccion"] * float(respuesta)
        return {eje: pos_val for eje in ejes_item}

    if tipo_r == "preferencia_5":
        r = int(respuesta)
        if r not in (1, 2, 3, 4, 5):
            raise ValueError(f"{item['id']}: respuesta preferencia_5 debe ser 1..5.")
        pos_a = item["opciones"][0]["posiciones"]
        pos_b = item["opciones"][1]["posiciones"]
        res = {}
        for eje in ejes_item:
            if r == 1:
                res[eje] = pos_a[eje]
            elif r == 2:
                res[eje] = 0.5 * pos_a[eje]
            elif r == 3:
                res[eje] = 0.0
            elif r == 4:
                res[eje] = 0.5 * pos_b[eje]
            else:
                res[eje] = pos_b[eje]
        return res

    if tipo_r == "eleccion_3":
        op_map = {op["id"]: op["posiciones"] for op in item["opciones"]}
        if respuesta not in op_map:
            raise ValueError(f"{item['id']}: opción '{respuesta}' no válida.")
        return dict(op_map[respuesta])

    raise ValueError(f"Tipo desconocido: {tipo_r}")


def _magnitud_respuesta_normalizada(item: dict[str, Any], respuesta: Any) -> float | None:
    if respuesta is None:
        return None
    tipo_r = item["tipo_respuesta"]
    if tipo_r == "acuerdo_5":
        return abs(float(respuesta))
    if tipo_r == "preferencia_5":
        return abs(int(respuesta) - 3) / 2.0
    if tipo_r == "eleccion_3":
        pos = item["opciones"][[o["id"] for o in item["opciones"]].index(respuesta)]["posiciones"]
        vals = list(pos.values())
        return sum(abs(v) for v in vals) / len(vals)
    return None


def calcular_perfil(
    banco: dict[str, Any],
    respuestas: dict[str, Any],
    dominios_prioritarios: list[str] | None = None,
    orden_mostrado: dict[str, list[str]] | None = None,
    solo_nucleo: bool = False,
    min_items: int = 3,
    min_cobertura: float = 0.6,
    sigma_item_base: float = 0.50,
    sigma_faceta: float = 0.12,
) -> dict[str, Any]:
    dominios_set = set(dominios_prioritarios or [])
    items = [
        it for it in banco["items"]
        if (not solo_nucleo) or it.get("es_nucleo", False)
    ]

    peso_total_eje = {eje: 0.0 for eje in EJES}
    contribuciones: dict[str, list[dict[str, Any]]] = {eje: [] for eje in EJES}
    neutros_pref = {eje: 0 for eje in EJES}
    total_pref = {eje: 0 for eje in EJES}

    acuerdos_crudos = []
    pos_acuerdo_por_id: dict[str, float] = {}
    magnitudes_resp = []
    elecciones_primera_mostrada = 0
    total_con_orden = 0

    for it in items:
        qid = it["id"]
        mult = 1.5 if it.get("dominio") in dominios_set else 1.0

        for eje, lam in it["peso_ejes"].items():
            peso_total_eje[eje] += lam * mult

        resp = respuestas.get(qid)
        pos_ejes = _posicion_item(it, resp)
        mag = _magnitud_respuesta_normalizada(it, resp)
        if mag is not None:
            magnitudes_resp.append(mag)

        if it["tipo_respuesta"] == "acuerdo_5" and resp is not None:
            acuerdos_crudos.append(float(resp))
            pos_acuerdo_por_id[qid] = it["direccion"] * float(resp)

        if orden_mostrado and qid in orden_mostrado and resp is not None:
            orden = orden_mostrado[qid]
            if it["tipo_respuesta"] == "preferencia_5" and int(resp) != 3:
                total_con_orden += 1
                primera_id = orden[0]
                if (primera_id == "A" and int(resp) in (1, 2)) or (primera_id == "B" and int(resp) in (4, 5)):
                    elecciones_primera_mostrada += 1
            elif it["tipo_respuesta"] == "eleccion_3":
                total_con_orden += 1
                if str(resp) == orden[0]:
                    elecciones_primera_mostrada += 1

        if pos_ejes is None:
            continue

        for eje, lam in it["peso_ejes"].items():
            w = lam * mult
            x = pos_ejes[eje]
            contribuciones[eje].append({
                "id": qid,
                "enunciado": it["enunciado"],
                "faceta": it.get("faceta", "general"),
                "peso": w,
                "posicion": x,
                "aporte": w * x,
            })
            if it["tipo_respuesta"] == "preferencia_5":
                total_pref[eje] += 1
                if int(resp) == 3:
                    neutros_pref[eje] += 1

    resultados_ejes = {}
    for eje in EJES:
        lista = contribuciones[eje]
        n_resp = len(lista)
        sum_w = sum(c["peso"] for c in lista)
        cobertura = sum_w / peso_total_eje[eje] if peso_total_eje[eje] > 0 else 0.0

        if n_resp < min_items or cobertura < min_cobertura:
            resultados_ejes[eje] = {
                "score": None,
                "se": None,
                "ic95": None,
                "sigma": None,
                "n_respondidas": n_resp,
                "cobertura": round(cobertura, 3),
                "estado": "datos_insuficientes",
                "contribuciones": [],
            }
            continue

        s_eje = sum(c["aporte"] for c in lista) / sum_w

        # Varianza agrupada por faceta + varianza residual por ítem
        pesos_por_faceta: dict[str, float] = {}
        for c in lista:
            fac = c["faceta"]
            pesos_por_faceta[fac] = pesos_por_faceta.get(fac, 0.0) + c["peso"]

        var_clusters = sum((wf ** 2) * (sigma_faceta ** 2) for wf in pesos_por_faceta.values())
        var_items = sum((c["peso"] ** 2) * (sigma_item_base ** 2) for c in lista)
        se = math.sqrt(var_clusters + var_items) / sum_w

        ic_low = max(-1.0, s_eje - 1.96 * se)
        ic_high = min(1.0, s_eje + 1.96 * se)

        if n_resp >= 4:
            var = sum(c["peso"] * ((c["posicion"] - s_eje) ** 2) for c in lista) / sum_w
            sigma = math.sqrt(var)
        else:
            sigma = None

        pct_neutro_pref = (
            round(neutros_pref[eje] / total_pref[eje], 3) if total_pref[eje] > 0 else 0.0
        )

        top_contrib = sorted(
            [
                {
                    "id": c["id"],
                    "enunciado": c["enunciado"],
                    "posicion": round(c["posicion"], 3),
                    "impacto": round(c["aporte"] / sum_w, 4),
                }
                for c in lista
            ],
            key=lambda item_c: abs(item_c["impacto"]),
            reverse=True,
        )[:3]

        resultados_ejes[eje] = {
            "score": round(s_eje, 4),
            "se": round(se, 4),
            "ic95": [round(ic_low, 4), round(ic_high, 4)],
            "sigma": round(sigma, 4) if sigma is not None else None,
            "n_respondidas": n_resp,
            "cobertura": round(cobertura, 3),
            "pct_depende_pref": pct_neutro_pref,
            "tension_alta": bool(sigma is not None and sigma >= 0.65),
            "estado": "ok",
            "contribuciones": top_contrib,
        }

    pares_vistos = set()
    discrepancias_espejo = []
    for it in items:
        qid = it["id"]
        esp = it.get("espejo")
        if esp and (esp, qid) not in pares_vistos:
            pares_vistos.add((qid, esp))
            if qid in pos_acuerdo_por_id and esp in pos_acuerdo_por_id:
                disc = abs(pos_acuerdo_por_id[qid] - pos_acuerdo_por_id[esp]) / 2.0
                discrepancias_espejo.append({"par": f"{qid}-{esp}", "discrepancia": round(disc, 3)})

    aquiescencia = round(sum(acuerdos_crudos) / len(acuerdos_crudos), 3) if acuerdos_crudos else None
    sesgo_posicion = (
        round(elecciones_primera_mostrada / total_con_orden, 3)
        if total_con_orden > 0
        else None
    )
    magnitud_media = (sum(magnitudes_resp) / len(magnitudes_resp)) if magnitudes_resp else None

    banderas = []
    if aquiescencia is not None and abs(aquiescencia) >= 0.75:
        banderas.append("aquiescencia_extrema")
    if sesgo_posicion is not None and (sesgo_posicion >= 0.80 or sesgo_posicion <= 0.20):
        banderas.append("sesgo_orden_visual")
    if discrepancias_espejo:
        media_disc = sum(d["discrepancia"] for d in discrepancias_espejo) / len(discrepancias_espejo)
        if media_disc >= 0.65:
            banderas.append("inconsistencia_espejos")
    if magnitud_media is not None and magnitud_media <= 0.05 and len(magnitudes_resp) >= 12:
        banderas.append("respuesta_plana_o_neutra")

    return {
        "bank_version": banco["meta"]["bank_version"],
        "scoring_version": SCORING_VERSION,
        "modo": "nucleo_16" if solo_nucleo else "completo_48",
        "ejes": resultados_ejes,
        "indicadores_calidad": {
            "aquiescencia_media": aquiescencia,
            "sesgo_primera_mostrada": sesgo_posicion,
            "magnitud_media_respuesta": round(magnitud_media, 4) if magnitud_media is not None else None,
            "espejos": discrepancias_espejo,
            "banderas": banderas,
        },
    }