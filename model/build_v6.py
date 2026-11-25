"""Genera data/questions.json (bank v6): 48 ítems, sin 'aunque', con validación equivalente a scoring.validar_banco
y chequeos E_first / E_last / E_rand por eje. Uso: python model/build_v6.py"""
import json
import random
import re
from pathlib import Path

CE, RD, OS, PJ = "coord_economica", "redistribucion", "orden_social", "poder_jurisprudencia"
EJES = [CE, RD, OS, PJ]
PROHIBIDO = re.compile(r"\b(aunque|pese a|a pesar|si bien|aun cuando)\b", re.I)

specs = []


def A5(id, eje, faceta, dominio, direccion, espejo, enun, nucleo=False, nota="", interna=""):
    specs.append(dict(kind="A5", id=id, eje=eje, faceta=faceta, dominio=dominio, direccion=direccion,
                      espejo=espejo, enun=enun, nucleo=nucleo, nota=nota, interna=interna))


def P(id, eje, faceta, dominio, enun, pos, neg, nucleo=False, cross=None, nota="", interna=""):
    """preferencia_5. 'pos' = texto de la opción con posición +1 en el eje; 'neg' = la de -1.
    cross = {otro_eje: valor_en_opcion_pos} (la opción neg recibe el opuesto)."""
    specs.append(dict(kind="P", id=id, eje=eje, faceta=faceta, dominio=dominio, enun=enun, pos=pos, neg=neg,
                      nucleo=nucleo, cross=cross or {}, nota=nota, interna=interna))


def E3(id, eje, faceta, dominio, enun, opts, pesos=None, nucleo=False, nota="", interna=""):
    specs.append(dict(kind="E3", id=id, eje=eje, faceta=faceta, dominio=dominio, enun=enun, opts=opts,
                      pesos=pesos or {eje: 1.0}, nucleo=nucleo, nota=nota, interna=interna))


# ───────────────────────── COORDINACIÓN ECONÓMICA ─────────────────────────
A5("Q01", CE, "precios_y_asignacion", "economia_mercados", -1, None,
   "Es mejor que los precios los acuerden compradores y vendedores a que los fije una autoridad.", True,
   interna="Q01 ya no tiene espejo: Q03 pasa a medir comercio exterior.")
A5("Q03", CE, "precios_y_asignacion", "economia_mercados", 1, None,
   "El Estado debería poner impuestos a los productos que vienen de otros países para favorecer a las empresas del propio país.",
   nota="Estos impuestos se llaman aranceles.",
   interna="Sustituye al espejo de Q01. Mide intervención en el comercio exterior.")
P("Q04", CE, "reglas_y_direccion", "economia_mercados",
  "En la economía en general, ¿cómo prefieres que se decida qué se produce y a qué precio?",
  "Que lo decida la administración pública con un plan.",
  "Que lo decidan libremente las empresas y las personas, pactando entre sí.", True)
P("Q06", CE, "provision_y_gestion", "ayuda_y_solidaridad",
  "Cuando el Estado ayuda a familias con pocos recursos, ¿qué prefieres?",
  "Darles servicios o productos concretos, como comida, vivienda o material escolar.",
  "Darles dinero para que cada familia decida en qué gastarlo.", True)
E3("Q02", CE, "precios_y_asignacion", "abastecimiento_precios",
   "Si el precio de un producto básico, como el pan o la leche, se dispara por una crisis de suministro, ¿qué prefieres?",
   [("Que una autoridad fije un precio máximo y reparta el producto por cupos.", {CE: 1.0}),
    ("Que una autoridad fije un precio máximo, pero sin cupos de reparto.", {CE: 0.5}),
    ("Que el precio se ajuste libremente según la oferta y la demanda.", {CE: -1.0})],
   interna="Reformulado: el escenario es una subida de precio, no una escasez. Opción B intermedia (tope sin reparto).")
E3("Q05", CE, "provision_y_gestion", "abastecimiento_precios",
   "Para repartir un recurso limitado que usa mucha gente, como las plazas de aparcamiento de un barrio, ¿qué criterio prefieres?",
   [("Que se asignen con criterios que fije una autoridad, por ejemplo permisos para residentes.", {CE: 1.0}),
    ("Que se asignen a quien pague más.", {CE: -1.0}),
    ("Que se asignen por orden de llegada, sin permisos ni pagos.", {CE: -0.5})],
   interna="Las opciones son mecanismos excluyentes (autoridad / precio / orden de llegada), no agentes que puedan combinarse.")
P("Q25", CE, "precios_y_asignacion", "economia_mercados",
  "Sobre los sueldos, ¿qué prefieres?",
  "Que una autoridad fije un sueldo mínimo obligatorio.",
  "Que cada empresa y cada trabajador pacten libremente el sueldo.", True)
P("Q26", CE, "reglas_y_direccion", "economia_mercados",
  "Si una empresa llega a dominar casi todo un mercado, ¿qué debería poder hacer el Estado?",
  "Limitarla o dividirla para que haya más empresas que compitan.",
  "Intervenir solo si la empresa engaña a sus clientes o amenaza a sus competidores.")
P("Q27", CE, "reglas_y_direccion", "economia_mercados",
  "Para poder ofrecer servicios profesionales o abrir un negocio, ¿qué prefieres?",
  "Exigir antes un título, una licencia o pertenecer a un colegio profesional, como el de abogados o el de médicos.",
  "Poder empezar sin permisos previos y que el cliente elija a quien quiera.")
P("Q28", CE, "reglas_y_direccion", "economia_mercados",
  "Para construir una carretera que atraviesa terrenos privados, ¿qué prefieres?",
  "Que la administración pueda adquirir los terrenos necesarios, pagando un precio justo, incluso si el propietario no quiere vender.",
  "Que solo se construya con los terrenos de quienes acepten venderlos.")
A5("Q29", CE, "provision_y_gestion", "economia_mercados", 1, None,
   "Servicios básicos como el agua, la electricidad o el transporte público deberían ser propiedad del Estado.",
   interna="Ya no es espejo de Q30. Mide propiedad estatal de infraestructuras.")
A5("Q30", CE, "provision_y_gestion", "economia_mercados", -1, None,
   "Es mejor que las familias reciban dinero público para elegir entre colegios y centros de salud, públicos o privados, a que el Estado gestione solo sus propios centros.",
   interna="Ya no es espejo de Q29. Mide elección con financiación pública en educación y sanidad.")
# ───────────────────────── REDISTRIBUCIÓN ─────────────────────────
A5("Q07", RD, "impuestos_y_progresividad", "impuestos_transferencias", 1, "Q09",
   "Quien gana más debería pagar un porcentaje mayor de impuestos sobre sus ingresos.", True)
A5("Q09", RD, "impuestos_y_progresividad", "impuestos_transferencias", -1, "Q07",
   "Todas las personas deberían pagar el mismo porcentaje de impuestos sobre sus ingresos, ganen lo que ganen.")
P("Q08", RD, "impuestos_y_progresividad", "impuestos_transferencias",
  "Sobre el nivel de impuestos y de ayudas económicas del Estado, ¿qué prefieres?",
  "Impuestos más altos y más ayudas económicas del Estado.",
  "Impuestos más bajos y menos ayudas económicas del Estado.", True)
P("Q10", RD, "obligatoriedad_y_riqueza", "ayuda_y_solidaridad",
  "Para ayudar a personas con dificultades económicas, ¿qué prefieres?",
  "Que se financie con aportaciones obligatorias de todos, mediante impuestos o cotizaciones.",
  "Que se base en ayuda voluntaria: familias, donaciones, asociaciones, iglesias o mutualidades.", True)
P("Q11", RD, "diseno_de_ayudas", "ayuda_y_solidaridad",
  "Al diseñar las ayudas públicas, ¿qué prefieres?",
  "Ayudas para toda la población, como una renta básica universal que recibe todo el mundo por igual.",
  "Ayudas solo para quienes tienen menos recursos.",
  interna="Focalización por ingresos frente a universalidad. Prioridad por nacionalidad queda fuera: mide pertenencia.")
P("Q12", RD, "obligatoriedad_y_riqueza", "impuestos_transferencias",
  "Sobre las herencias de grandes patrimonios, ¿qué prefieres?",
  "Que paguen impuestos elevados.",
  "Que paguen pocos impuestos o ninguno.")
E3("Q31", RD, "impuestos_y_progresividad", "impuestos_transferencias",
   "Para recaudar la mayor parte de los impuestos, ¿qué prefieres?",
   [("Que paguen más quienes tienen ingresos o patrimonio altos.", {RD: 1.0}),
    ("Que todos paguen según lo que compran, con impuestos sobre el consumo como el IVA.", {RD: -0.5}),
    ("Que no haya impuestos obligatorios y los servicios públicos se financien con pagos voluntarios o por uso.", {RD: -1.0})],
   interna="Añadida la opción sin impuestos obligatorios. Suma -0.5 (E_rand de redistribución ≈ -0.014).")
A5("Q32", RD, "diseno_de_ayudas", "ayuda_y_solidaridad", -1, None,
   "Quien reciba una ayuda económica debería comprometerse a formarse o a buscar empleo.",
   interna="Ya no es espejo de Q33. Mide condicionalidad.")
A5("Q33", RD, "diseno_de_ayudas", "ayuda_y_solidaridad", 1, None,
   "El Estado debería garantizar un ingreso mínimo para vivir a quien no pueda trabajar o no encuentre empleo.",
   interna="Sustituye al espejo de Q32. Mide garantía de ingreso, no condicionalidad.")
P("Q34", RD, "obligatoriedad_y_riqueza", "impuestos_transferencias",
  "Para financiar las pensiones de jubilación, ¿qué prefieres?",
  "Que las cotizaciones de los trabajadores actuales paguen las pensiones actuales.",
  "Que cada persona ahorre en una cuenta propia para su futura pensión.")
P("Q35", RD, "obligatoriedad_y_riqueza", "impuestos_transferencias",
  "Para financiar una obra que beneficia a toda una zona, como una defensa contra inundaciones, ¿qué prefieres?",
  "Una aportación obligatoria de todos los vecinos beneficiados.",
  "Aportaciones voluntarias de quien quiera colaborar.")
P("Q36", RD, "diseno_de_ayudas", "ayuda_y_solidaridad",
  "Sobre la atención médica, ¿qué prefieres?",
  "Un sistema público financiado con impuestos que atienda a todos.",
  "Que cada persona contrate su seguro médico o pague su atención.", True,
  interna="Sustituye al seguro de enfermedad o paro: ahora es sanidad explícita.")

# ───────────────────────── ORDEN SOCIAL ─────────────────────────
A5("Q13", OS, "costumbres_y_cohesion", "cultura_costumbres", 1, "Q15",
   "Es mejor conservar las costumbres tradicionales de una comunidad, como sus fiestas y su forma de vivir.", True)
A5("Q15", OS, "costumbres_y_cohesion", "cultura_costumbres", -1, "Q13",
   "Es mejor que cada persona elija su propio estilo de vida, siga o no las costumbres tradicionales.")
P("Q14", OS, "costumbres_y_cohesion", "cultura_costumbres",
  "Si una persona vive con hábitos distintos a los de su entorno sin incumplir ninguna ley, ¿qué prefieres?",
  "Que se espere que se ajuste a las costumbres de su entorno.",
  "Que se respete su forma de vivir.", True)
P("Q17", OS, "vida_privada_y_normas_legales", "familia_vida_privada",
  "Sobre cómo se organiza una familia, por ejemplo quién trabaja fuera de casa, quién cuida de los hijos y cómo se reparten las tareas, ¿qué prefieres?",
  "Que las leyes y ayudas públicas favorezcan un modelo de familia concreto, por ejemplo matrimonio con hijos y reparto tradicional de tareas.",
  "Que cada hogar decida cómo organizarse y cómo repartir las tareas.", True)
P("Q18", OS, "referentes_comunes", "cultura_costumbres",
  "En la escuela y en los actos públicos, ¿qué prefieres?",
  "Que se transmita una cultura y una historia comunes a todos.",
  "Que cada familia o centro pueda elegir enfoques culturales distintos.", True)
P("Q40", OS, "vida_privada_y_normas_legales", "familia_vida_privada",
  "Sobre el alcohol, el tabaco y otras sustancias nocivas para la salud, ¿qué prefieres?",
  "Que la ley restrinja su venta o su consumo.",
  "Que cada adulto decida por sí mismo.")
P("Q41", OS, "referentes_comunes", "cultura_costumbres",
  "Cuando llegan a una comunidad personas con otras costumbres, ¿qué prefieres?",
  "Que adopten las costumbres y normas culturales del lugar.",
  "Que mantengan sus costumbres si cumplen la ley.",
  interna="Ítem sensible: calibrar en piloto.")
P("Q42", OS, "vida_privada_y_normas_legales", "familia_vida_privada",
  "Sobre la eutanasia, ¿qué prefieres?",
  "Que la ley la prohíba.",
  "Que la ley la permita.",
  nota="Eutanasia: que un médico ayude a poner fin a la vida de una persona adulta con una enfermedad incurable y un sufrimiento grave, si ella lo pide.",
  interna="Eutanasia. También carga en poder (coerción estatal); se asigna a un solo eje por simplicidad.")
P("Q43", OS, "vida_privada_y_normas_legales", "familia_vida_privada",
  "Sobre el aborto en las primeras semanas del embarazo, ¿qué prefieres?",
  "Que la ley lo prohíba en general.",
  "Que la ley permita a la mujer decidir libremente.",
  interna="NUEVO (aborto). Mismo criterio que Q42.")
P("Q37", OS, "costumbres_y_cohesion", "normas_y_convivencia",
  "Ante opiniones que mucha gente considera ofensivas, ¿qué prefieres?",
  "Que la ley pueda prohibir ciertas opiniones ofensivas, como los insultos a grupos de personas.",
  "Que la ley proteja cualquier opinión mientras no incite directamente a la violencia.",
  interna="NUEVO (libertad de expresión). Alternativa: ponerlo en poder_jurisprudencia.")
P("Q38", OS, "referentes_comunes", "estado_y_fronteras",
  "Sobre quién puede entrar a vivir en un país, ¿qué prefieres?",
  "Que cada país limite y controle quién puede entrar.",
  "Que las personas puedan viajar y establecerse en otro país con pocas o ninguna restricción.",
  interna="NUEVO (fronteras). Carga también algo en coord (movilidad laboral); se deja en un eje.")
P("Q39", OS, "referentes_comunes", "cultura_costumbres",
  "Sobre la religión y el Estado, ¿qué prefieres?",
  "Que el Estado apoye la tradición religiosa del país en la vida pública, por ejemplo en fiestas, símbolos o escuelas.",
  "Que el Estado sea neutral y no dé trato especial a ninguna religión.",
  interna="NUEVO (religión y Estado). Sustituye al par Q38/Q39 de horarios.")

# ───────────────────────── PODER Y JURISPRUDENCIA ─────────────────────────
A5("Q19", PJ, "garantias_y_proceso", "justicia_garantias", -1, "Q21",
   "Es mejor proteger siempre las garantías de quien es investigado o juzgado: juicio justo, derecho a defensa, presunción de inocencia y límites a las detenciones y los registros.", True)
A5("Q21", PJ, "garantias_y_proceso", "justicia_garantias", 1, "Q19",
   "En los delitos graves es mejor reducir garantías, como los trámites del juicio o los límites a detenciones y registros, para actuar más rápido.")
E3("Q22", PJ, "castigo_ley_y_norma_social", "justicia_garantias",
   "Ante un delito grave, ¿qué prefieres priorizar?",
   [("Penas de cárcel más largas.", {PJ: 1.0}),
    ("Más recursos para que quien delinque se reinserte en la sociedad.", {PJ: -1.0}),
    ("Que quien delinque repare el daño y compense a la víctima.", {PJ: 0.0})],
   nucleo=True,
   interna="Antes preferencia_5 (pena vs reinserción). Ahora eleccion_3 con restitución a la víctima en posición 0.")
P("Q23", PJ, "investigacion_y_excepcionalidad", "justicia_garantias",
  "Ante una emergencia grave, ¿qué prefieres sobre las medidas excepcionales del Gobierno?",
  "Que pueda aplicarlas de inmediato y que se revisen después.",
  "Que un juez o el Parlamento las apruebe antes de aplicarlas.", True)
P("Q24", PJ, "investigacion_y_excepcionalidad", "justicia_garantias",
  "Sobre el acceso a mensajes, llamadas y datos personales en las investigaciones, ¿qué prefieres?",
  "Ampliarlo para poder investigar con más facilidad.",
  "Limitarlo a casos concretos y con control de un juez.", True)
P("Q44", PJ, "garantias_y_proceso", "justicia_garantias",
  "Sobre la prisión antes del juicio en delitos graves, ¿qué prefieres?",
  "Que se aplique siempre que se considere peligroso al acusado.",
  "Que solo se aplique si hay riesgo claro de fuga o de destruir pruebas.")
P("Q48", PJ, "garantias_y_proceso", "justicia_garantias",
  "Cuando aplicar una ley al pie de la letra da un resultado muy injusto en un caso concreto, ¿qué prefieres?",
  "Que el juez pueda adaptar la ley para evitar la injusticia.",
  "Que el juez aplique la ley tal como está escrita.")
P("Q16", PJ, "investigacion_y_excepcionalidad", "justicia_garantias",
  "Sobre el anonimato en internet, ¿qué prefieres?",
  "Que las plataformas deban identificar a sus usuarios, para poder perseguir los delitos cometidos en la red.",
  "Que cualquier persona pueda usar internet de forma anónima, para proteger su privacidad.",
  interna="NUEVO (privacidad en internet). Sustituye a la primera mitad del antiguo Q16, fusionado en Q20.")
E3("Q20", PJ, "castigo_ley_y_norma_social", "normas_y_convivencia",
   "Si una norma de convivencia es importante para parte de la población, ¿qué prefieres?",
   [("Que sea una ley obligatoria para todos.", {PJ: 1.0, OS: 0.8}),
    ("Que cada grupo o comunidad tenga sus propias normas, que obligan solo a quienes se unen a él y pueden marcharse.", {PJ: -0.5, OS: 0.8}),
    ("Que no haya norma y cada persona haga lo suyo.", {PJ: -1.0, OS: -1.0})],
   pesos={PJ: 1.0, OS: 0.4},
   interna="Fusión de Q16 y Q20. Suma de poder -0.5 (E_rand de poder ≈ -0.014).")
P("Q45", PJ, "castigo_ley_y_norma_social", "estado_y_fronteras",
  "Sobre las regiones que quieren separarse de un país, ¿qué prefieres?",
  "Que no puedan separarse, ni siquiera si lo vota su población.",
  "Que puedan separarse y formar un país propio si lo vota la mayoría de sus habitantes.",
  interna="NUEVO (secesión). Extremo bajo = autonomía local.")
A5("Q46", PJ, "investigacion_y_excepcionalidad", "estado_y_fronteras", -1, None,
   "Las leyes de un Estado solo deberían obligar a quienes las hayan aceptado voluntariamente.",
   interna="Convertido a acuerdo_5 (dirección -1) para compensar la dirección +1 de Q47 y mantener el balance de aquiescencia.")
A5("Q47", PJ, "castigo_ley_y_norma_social", "estado_y_fronteras", 1, None,
   "El servicio militar debería ser obligatorio para los jóvenes.",
   interna="Reformulado como afirmación neutra con escala de acuerdo.")
# ───────────────────────── CONSTRUCCIÓN ─────────────────────────
def construir(estado):
    out = []
    for s in specs:
        it = {"id": s["id"],
              "tipo": "principio" if s["kind"] == "A5" else "propuesta_tradeoff",
              "tipo_respuesta": {"A5": "acuerdo_5", "P": "preferencia_5", "E3": "eleccion_3"}[s["kind"]],
              "eje_primario": s["eje"]}
        if s["kind"] == "A5":
            it["peso_ejes"] = {s["eje"]: 1.0}
        elif s["kind"] == "P":
            it["peso_ejes"] = {s["eje"]: 1.0, **{e: abs(v) for e, v in s["cross"].items()}}
        else:
            it["peso_ejes"] = dict(s["pesos"])
        it["faceta"], it["dominio"] = s["faceta"], s["dominio"]
        if s["kind"] == "A5":
            it["direccion"] = s["direccion"]
            if s["espejo"]:
                it["espejo"] = s["espejo"]
        it["es_nucleo"] = s["nucleo"]
        it["enunciado"] = s["enun"]
        if s["kind"] == "P":
            pos_p = {s["eje"]: 1.0, **s["cross"]}
            pos_n = {s["eje"]: -1.0, **{e: -v for e, v in s["cross"].items()}}
            a_pos = not estado["flip"][s["id"]]
            ops = [(s["pos"], pos_p), (s["neg"], pos_n)]
            if not a_pos:
                ops.reverse()
            it["opciones"] = [{"id": "AB"[i], "texto": t, "posiciones": p} for i, (t, p) in enumerate(ops)]
        elif s["kind"] == "E3":
            orden = estado["perm"][s["id"]]
            it["opciones"] = [{"id": "ABC"[i], "texto": s["opts"][k][0], "posiciones": dict(s["opts"][k][1])}
                              for i, k in enumerate(orden)]
        if s["nota"]:
            it["nota_matiz"] = s["nota"]          # se muestra al usuario en la interfaz
        if s["interna"]:
            it["nota_interna"] = s["interna"]     # no se muestra
        out.append(it)
    return out


def esperanzas(items, eje):
    w = f = l = den = num = 0.0
    for it in items:
        if eje not in it["peso_ejes"]:
            continue
        lam = it["peso_ejes"][eje]
        den += lam
        t = it["tipo_respuesta"]
        if t == "acuerdo_5":
            continue
        ops = it["opciones"]
        w += lam
        f += lam * ops[0]["posiciones"][eje]
        l += lam * ops[-1]["posiciones"][eje]
        if t == "preferencia_5":
            num += lam * 0.3 * (ops[0]["posiciones"][eje] + ops[1]["posiciones"][eje])
        else:
            num += lam * sum(o["posiciones"][eje] for o in ops) / 3
    return f / w, l / w, num / den


def coste(estado):
    items = construir(estado)
    j = 0.0
    for e in EJES:
        ef, el, _ = esperanzas(items, e)
        j += ef ** 2 + el ** 2
    return j


def optimizar(semilla=7, iters=40000):
    rng = random.Random(semilla)
    estado = {"flip": {s["id"]: rng.random() < 0.5 for s in specs if s["kind"] == "P"},
              "perm": {s["id"]: tuple(rng.sample(range(3), 3)) for s in specs if s["kind"] == "E3"}}
    mejor = coste(estado)
    claves = list(estado["flip"]) + list(estado["perm"])
    for _ in range(iters):
        k = rng.choice(claves)
        if k in estado["flip"]:
            estado["flip"][k] = not estado["flip"][k]
            nuevo = coste(estado)
            if nuevo <= mejor:
                mejor = nuevo
            else:
                estado["flip"][k] = not estado["flip"][k]
        else:
            ant = estado["perm"][k]
            estado["perm"][k] = tuple(rng.sample(range(3), 3))
            nuevo = coste(estado)
            if nuevo <= mejor:
                mejor = nuevo
            else:
                estado["perm"][k] = ant
    return estado


def validar(items):
    ids = [i["id"] for i in items]
    assert len(ids) == len(set(ids)), "IDs duplicados"
    by = {i["id"]: i for i in items}
    bal = {e: 0 for e in EJES}
    for it in items:
        q, pe = it["id"], it["peso_ejes"]
        assert it["eje_primario"] in pe and it["eje_primario"] == max(pe, key=pe.get), f"{q}: eje_primario"
        assert all(e in EJES and v > 0 for e, v in pe.items()), f"{q}: pesos"
        if it["tipo_respuesta"] == "acuerdo_5":
            assert it["direccion"] in (-1, 1)
            bal[it["eje_primario"]] += it["direccion"]
            if it.get("espejo"):
                esp = by[it["espejo"]]
                assert esp.get("espejo") == q and esp["direccion"] == -it["direccion"], f"{q}: espejo"
        else:
            n = 2 if it["tipo_respuesta"] == "preferencia_5" else 3
            assert len(it["opciones"]) == n and "direccion" not in it, f"{q}: opciones"
            for o in it["opciones"]:
                assert set(o["posiciones"]) == set(pe), f"{q}: claves posiciones"
                assert all(-1 <= v <= 1 for v in o["posiciones"].values())
        textos = [it["enunciado"], it.get("nota_matiz", "")] + [o["texto"] for o in it.get("opciones", [])]
        for t in textos:
            assert not PROHIBIDO.search(t), f"{q}: texto con 'aunque' o similar -> {t}"
            assert "morir" not in t.lower(), f"{q}: palabra 'morir' -> {t}"
    assert all(v == 0 for v in bal.values()), f"Aquiescencia desbalanceada: {bal}"
    assert len(items) == 48


def main():
    estado = optimizar()
    items = construir(estado)
    validar(items)
    banco = {"meta": {"schema_version": "1.1.0", "bank_version": "v6", "total_items": len(items),
                      "nucleo_items": sum(1 for i in items if i["es_nucleo"])}, "items": items}
    Path("data").mkdir(exist_ok=True)
    Path("data/questions.json").write_text(json.dumps(banco, ensure_ascii=False, indent=2), encoding="utf-8")

    print("=== BALANCE ===")
    for e in EJES:
        ef, el, er = esperanzas(items, e)
        ok = abs(ef) <= 0.15 and abs(el) <= 0.15 and abs(er) <= 0.02
        print(f"  {e:<22} E_first={ef:+.3f} E_last={el:+.3f} E_rand={er:+.4f} {'OK' if ok else 'REVISAR'}")
    print("=== CONTEOS ===")
    for e in EJES:
        its = [i for i in items if i["eje_primario"] == e]
        fac = {}
        for i in its:
            fac[i["faceta"]] = fac.get(i["faceta"], 0) + 1
        tipos = {t: sum(1 for i in its if i["tipo_respuesta"] == t) for t in ("acuerdo_5", "preferencia_5", "eleccion_3")}
        print(f"  {e:<22} total={len(its)} nucleo={sum(i['es_nucleo'] for i in its)} facetas={fac} tipos={tipos}")
    print("  dominios:", sorted({i["dominio"] for i in items}))
    print("  nucleo_items:", banco["meta"]["nucleo_items"], "| sin 'aunque': OK")


if __name__ == "__main__":
    main()
