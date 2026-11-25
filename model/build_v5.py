import json
from pathlib import Path
from scoring import validar_banco


def build_v5(out_path: str | Path = "data/questions.json") -> None:
    items = [
        # --- EJE 1: coord_economica (12 ítems: 4 núcleo + 8 profundización) ---
        {
            "id": "Q01", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "precios_y_asignacion", "dominio": "economia_mercados",
            "direccion": -1, "espejo": "Q03", "es_nucleo": True,
            "enunciado": "Es preferible que los precios se acuerden entre compradores y vendedores a que los fije una autoridad, aunque algunos precios resulten altos.",
            "nota_matiz": "Evalúa cómo se forma el precio en un intercambio, no el nivel de impuestos ni las ayudas directas."
        },
        {
            "id": "Q03", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "precios_y_asignacion", "dominio": "economia_mercados",
            "direccion": 1, "espejo": "Q01", "es_nucleo": False,
            "enunciado": "Es preferible que una autoridad fije los precios a que los acuerden compradores y vendedores, aunque se pierda flexibilidad.",
            "nota_matiz": "Espejo directo de Q01 sobre fijación de precios por autoridad frente a acuerdo entre partes."
        },
        {
            "id": "Q04", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "reglas_y_direccion", "dominio": "economia_mercados", "es_nucleo": True,
            "enunciado": "En los sectores clave de la producción y el comercio, ¿qué prefieres como forma habitual de coordinarlos?",
            "opciones": [
                {"id": "A", "texto": "Que las empresas y personas pacten libremente condiciones y precios, aunque algunos mercados funcionen mal.", "posiciones": {"coord_economica": -1.0}},
                {"id": "B", "texto": "Que la administración dirija qué y cuánto producir, aunque se equivoque o sea menos flexible.", "posiciones": {"coord_economica": 1.0}}
            ],
            "nota_matiz": "Contrasta coordinación por contratos y precios frente a dirección administrativa."
        },
        {
            "id": "Q06", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "provision_y_gestion", "dominio": "ayuda_y_solidaridad", "es_nucleo": True,
            "enunciado": "Cuando se entrega ayuda económica a familias con pocos recursos, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Dar dinero para que cada familia decida cómo gastarlo, aunque algunas lo destinen a otros fines.", "posiciones": {"coord_economica": -1.0}},
                {"id": "B", "texto": "Entregar prestaciones o servicios concretos ya definidos, aunque limite la elección de cada familia.", "posiciones": {"coord_economica": 1.0}}
            ],
            "nota_matiz": "Mide elección de gasto por el beneficiario frente a provisión predefinida."
        },
        {
            "id": "Q02", "tipo": "propuesta_tradeoff", "tipo_respuesta": "eleccion_3",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0, "redistribucion": 0.5},
            "faceta": "precios_y_asignacion", "dominio": "abastecimiento_precios", "es_nucleo": False,
            "enunciado": "Si falta un producto básico y hay escasez, ¿qué opción encaja mejor con tu postura?",
            "opciones": [
                {"id": "A", "texto": "Que una autoridad fije un precio máximo y reparta por cupos, aunque haya colas o escasez.", "posiciones": {"coord_economica": 1.0, "redistribucion": 0.3}},
                {"id": "B", "texto": "Que el precio suba según la demanda, aunque algunas personas no puedan pagarlo.", "posiciones": {"coord_economica": -0.65, "redistribucion": -0.5}},
                {"id": "C", "texto": "Que el precio suba y se dé ayuda económica a quien no pueda pagarlo, aunque suban los impuestos y tarde en llegar.", "posiciones": {"coord_economica": -1.0, "redistribucion": 0.8}}
            ],
            "nota_matiz": "Compara precio máximo con cupos, ajuste por precio y precio libre con ayuda directa."
        },
        {
            "id": "Q05", "tipo": "propuesta_tradeoff", "tipo_respuesta": "eleccion_3",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "provision_y_gestion", "dominio": "abastecimiento_precios", "es_nucleo": False,
            "enunciado": "Para gestionar un recurso compartido como el agua de riego de un valle, ¿qué opción prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que lo gestione una administración pública con cuotas fijadas, aunque sea más rígida o lenta.", "posiciones": {"coord_economica": 1.0}},
                {"id": "B", "texto": "Que opere bajo derechos privados negociables, aunque excluya a quien no pueda comprar derechos de uso.", "posiciones": {"coord_economica": -0.65}},
                {"id": "C", "texto": "Que la comunidad de usuarios lo gestione con reglas pactadas, aunque exija acuerdos constantes entre vecinos.", "posiciones": {"coord_economica": 0.6}}
            ],
            "nota_matiz": "Compara gestión pública, derechos privados negociables y gestión comunitaria pactada."
        },
        {
            "id": "Q25", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "precios_y_asignacion", "dominio": "economia_mercados", "es_nucleo": False,
            "enunciado": "Sobre la fijación de los salarios en el empleo, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que una autoridad fije un salario mínimo, aunque se pierdan empleos o crezca la economía informal.", "posiciones": {"coord_economica": 1.0}},
                {"id": "B", "texto": "Que se pacten libremente entre empleadores y trabajadores, aunque algunos salarios sean bajos.", "posiciones": {"coord_economica": -1.0}}
            ],
            "nota_matiz": "Enfrenta salario mínimo fijado por autoridad frente a pacto salarial libre."
        },
        {
            "id": "Q26", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "reglas_y_direccion", "dominio": "economia_mercados", "es_nucleo": False,
            "enunciado": "Ante una empresa con gran cuota de mercado, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Actuar solo ante fraude o coacción, aunque queden menos competidores en el sector.", "posiciones": {"coord_economica": -1.0}},
                {"id": "B", "texto": "Que una autoridad pueda limitarla o dividirla, aunque se frene su crecimiento o inversión.", "posiciones": {"coord_economica": 1.0}}
            ],
            "nota_matiz": "Compara regla general contra fraude/coacción frente a intervención estructural sobre tamaño de mercado."
        },
        {
            "id": "Q27", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "reglas_y_direccion", "dominio": "economia_mercados", "es_nucleo": False,
            "enunciado": "Para ofrecer servicios profesionales o abrir un negocio, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Exigir licencias o colegiación obligatorias, aunque se limite la entrada de nuevos competidores.", "posiciones": {"coord_economica": 1.0}},
                {"id": "B", "texto": "Que cualquiera pueda ofrecerlos y el cliente elija, aunque aumente el riesgo de mala praxis.", "posiciones": {"coord_economica": -1.0}}
            ],
            "nota_matiz": "Contrasta habilitación/licencia obligatoria frente a libre acceso con elección del cliente."
        },
        {
            "id": "Q28", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "reglas_y_direccion", "dominio": "economia_mercados", "es_nucleo": False,
            "enunciado": "Para construir una infraestructura o vía de paso que atraviesa terrenos privados, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Negociar acuerdos directos con cada titular, aunque se encarezca o retrase el proyecto.", "posiciones": {"coord_economica": -1.0}},
                {"id": "B", "texto": "Imponer la cesión forzosa con compensación fijada por autoridad, aunque el titular no acepte.", "posiciones": {"coord_economica": 0.55}}
            ],
            "nota_matiz": "Enfrenta acuerdo voluntario frente a imposición forzosa con tasación administrativa."
        },
        {
            "id": "Q29", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "provision_y_gestion", "dominio": "economia_mercados",
            "direccion": 1, "espejo": "Q30", "es_nucleo": False,
            "enunciado": "Es preferible que los servicios básicos como el agua o el transporte los gestione directamente el Estado, aunque sea menos flexible.",
            "nota_matiz": "Mide preferencia por gestión directa pública frente a gestión privada regulada."
        },
        {
            "id": "Q30", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "coord_economica", "peso_ejes": {"coord_economica": 1.0},
            "faceta": "provision_y_gestion", "dominio": "economia_mercados",
            "direccion": -1, "espejo": "Q29", "es_nucleo": False,
            "enunciado": "Es preferible que los servicios básicos los gestionen empresas privadas bajo regulación, aunque se priorice el beneficio.",
            "nota_matiz": "Espejo directo de Q29."
        },

        # --- EJE 2: redistribucion (12 ítems: 4 núcleo + 8 profundización) ---
        {
            "id": "Q07", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "impuestos_y_progresividad", "dominio": "impuestos_transferencias",
            "direccion": 1, "espejo": "Q09", "es_nucleo": True,
            "enunciado": "Quien obtiene ingresos más altos debería pagar un porcentaje mayor de impuestos sobre su renta.",
            "nota_matiz": "Mide la progresividad del impuesto sobre la renta."
        },
        {
            "id": "Q09", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "impuestos_y_progresividad", "dominio": "impuestos_transferencias",
            "direccion": -1, "espejo": "Q07", "es_nucleo": False,
            "enunciado": "Todas las personas deberían pagar el mismo porcentaje de impuestos sobre sus ingresos, ganen lo que ganen.",
            "nota_matiz": "Espejo directo de Q07."
        },
        {
            "id": "Q08", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "diseno_de_ayudas", "dominio": "impuestos_transferencias", "es_nucleo": True,
            "enunciado": "Respecto al nivel de impuestos y ayudas económicas directas, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Impuestos más bajos para que cada persona disponga de mayor renta neta, aunque haya menos ayudas económicas.", "posiciones": {"redistribucion": -1.0}},
                {"id": "B", "texto": "Impuestos más altos para financiar más ayudas económicas, aunque reduzca la renta disponible.", "posiciones": {"redistribucion": 1.0}}
            ],
            "nota_matiz": "Compara menor carga fiscal con mayor financiación de ayudas directas."
        },
        {
            "id": "Q10", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "obligatoriedad_y_riqueza", "dominio": "ayuda_y_solidaridad", "es_nucleo": True,
            "enunciado": "Para apoyar a personas con dificultades económicas, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Financiarlo mediante aportaciones obligatorias, aunque se exija contribuir a todos.", "posiciones": {"redistribucion": 1.0}},
                {"id": "B", "texto": "Confiar en donaciones, familias y redes voluntarias, aunque la cobertura sea desigual o insuficiente.", "posiciones": {"redistribucion": -1.0}}
            ],
            "nota_matiz": "Separa financiación obligatoria frente a apoyo voluntario con costes en ambos lados."
        },
        {
            "id": "Q11", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "diseno_de_ayudas", "dominio": "ayuda_y_solidaridad", "es_nucleo": False,
            "enunciado": "Al diseñar ayudas financiadas con fondos públicos, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Focalizarlas solo en quienes tienen menos recursos, aunque queden fuera personas con ingresos algo mayores.", "posiciones": {"redistribucion": -1.0}},
                {"id": "B", "texto": "Hacerlas más amplias o universales, aunque suponga mayor gasto total y menor concentración en los más pobres.", "posiciones": {"redistribucion": 1.0}}
            ],
            "nota_matiz": "Compara focalización estricta frente a cobertura amplia."
        },
        {
            "id": "Q12", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "obligatoriedad_y_riqueza", "dominio": "impuestos_transferencias", "es_nucleo": False,
            "enunciado": "Sobre la transmisión de grandes patrimonios por herencia, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Aplicar impuestos elevados a las grandes herencias para redistribuir riqueza, aunque desincentive ahorrar o legar.", "posiciones": {"redistribucion": 1.0}},
                {"id": "B", "texto": "Mantener impuestos muy bajos o nulos sobre las herencias, aunque se concentre más la riqueza entre generaciones.", "posiciones": {"redistribucion": -1.0}}
            ],
            "nota_matiz": "Enfrenta redistribución intergeneracional mediante impuesto sucesorio frente a libre transmisión patrimonial."
        },
        {
            "id": "Q31", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "impuestos_y_progresividad", "dominio": "impuestos_transferencias", "es_nucleo": False,
            "enunciado": "Si hay que recaudar fondos públicos, ¿qué forma prefieres como base principal?",
            "opciones": [
                {"id": "A", "texto": "Gravar sobre todo las rentas más altas, aunque desincentive trabajar o invertir más.", "posiciones": {"redistribucion": 1.0}},
                {"id": "B", "texto": "Gravar sobre todo el consumo general, aunque pese más sobre quienes tienen menos ingresos.", "posiciones": {"redistribucion": -1.0}}
            ],
            "nota_matiz": "Contrasta imposición sobre rentas altas frente a imposición sobre el consumo."
        },
        {
            "id": "Q32", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "diseno_de_ayudas", "dominio": "ayuda_y_solidaridad",
            "direccion": -1, "espejo": "Q33", "es_nucleo": False,
            "enunciado": "Es preferible que las ayudas exijan contrapartidas como buscar empleo o formarse, aunque algunas personas necesitadas queden fuera.",
            "nota_matiz": "Mide preferencia por ayudas condicionadas a contrapartidas."
        },
        {
            "id": "Q33", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "diseno_de_ayudas", "dominio": "ayuda_y_solidaridad",
            "direccion": 1, "espejo": "Q32", "es_nucleo": False,
            "enunciado": "Es preferible que las ayudas se concedan sin exigir contrapartidas, aunque algunas personas las reciban sin esforzarse.",
            "nota_matiz": "Espejo directo de Q32."
        },
        {
            "id": "Q34", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "obligatoriedad_y_riqueza", "dominio": "impuestos_transferencias", "es_nucleo": False,
            "enunciado": "Para financiar las pensiones de jubilación, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Un sistema de reparto donde las cotizaciones actuales pagan las pensiones actuales, aunque dependa de la demografía.", "posiciones": {"redistribucion": 1.0}},
                {"id": "B", "texto": "Cuentas de ahorro individual de cada persona, aunque quien ahorre poco reciba poco.", "posiciones": {"redistribucion": -1.0}}
            ],
            "nota_matiz": "Compara reparto intergeneracional frente a capitalización/ahorro individual."
        },
        {
            "id": "Q35", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "obligatoriedad_y_riqueza", "dominio": "impuestos_transferencias", "es_nucleo": False,
            "enunciado": "Para financiar una defensa común contra inundaciones que beneficia a toda una zona, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Aportaciones voluntarias de vecinos y empresas, aunque se financie por debajo de lo necesario.", "posiciones": {"redistribucion": -1.0}},
                {"id": "B", "texto": "Una contribución obligatoria para todos los afectados, aunque deba pagarla quien no quiera.", "posiciones": {"redistribucion": 1.0}}
            ],
            "nota_matiz": "Evalúa provisión de un bien compartido con coste explícito en ambos extremos."
        },
        {
            "id": "Q36", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "redistribucion", "peso_ejes": {"redistribucion": 1.0},
            "faceta": "diseno_de_ayudas", "dominio": "ayuda_y_solidaridad", "es_nucleo": False,
            "enunciado": "Frente al riesgo de enfermedad grave o pérdida de empleo, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Seguros privados o mutuas voluntarias, aunque algunas personas queden sin cobertura.", "posiciones": {"redistribucion": -1.0}},
                {"id": "B", "texto": "Un seguro público obligatorio, aunque se pague por riesgos que uno no corra.", "posiciones": {"redistribucion": 1.0}}
            ],
            "nota_matiz": "Compara aseguramiento voluntario frente a aseguramiento obligatorio."
        },

        # --- EJE 3: orden_social (12 ítems: 4 núcleo + 8 profundización) ---
        {
            "id": "Q13", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "costumbres_y_cohesion", "dominio": "cultura_costumbres",
            "direccion": 1, "espejo": "Q15", "es_nucleo": True,
            "enunciado": "Es preferible conservar las costumbres compartidas de una comunidad, aunque algunas personas prefieran dejarlas de lado.",
            "nota_matiz": "Mide preferencia por conservar costumbres compartidas frente a la opción de abandonarlas."
        },
        {
            "id": "Q15", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "costumbres_y_cohesion", "dominio": "cultura_costumbres",
            "direccion": -1, "espejo": "Q13", "es_nucleo": False,
            "enunciado": "Es preferible que cada persona elija sus propias costumbres, aunque se debilite la cohesión de la comunidad.",
            "nota_matiz": "Espejo directo de Q13."
        },
        {
            "id": "Q14", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "costumbres_y_cohesion", "dominio": "cultura_costumbres", "es_nucleo": True,
            "enunciado": "Si una persona celebra fiestas o sigue hábitos distintos a los habituales de su entorno sin infringir ninguna ley, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Respetar su autonomía para vivir así, aunque se debilite la uniformidad de costumbres del entorno.", "posiciones": {"orden_social": -1.0}},
                {"id": "B", "texto": "Priorizar el ajuste a las costumbres compartidas del entorno, aunque limite esa variación individual.", "posiciones": {"orden_social": 1.0}}
            ],
            "nota_matiz": "Enfrenta autonomía individual frente a ajuste a costumbres compartidas dentro del marco legal."
        },
        {
            "id": "Q17", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "vida_privada_y_normas_legales", "dominio": "familia_vida_privada", "es_nucleo": True,
            "enunciado": "Sobre cómo organizar la vida familiar o el reparto de tareas en el hogar, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que las leyes o políticas públicas favorezcan un modelo familiar concreto, aunque limite otras opciones.", "posiciones": {"orden_social": 1.0}},
                {"id": "B", "texto": "Que cada hogar decida libremente su organización interna, aunque existan modelos muy distintos.", "posiciones": {"orden_social": -1.0}}
            ],
            "nota_matiz": "Compara favorecimiento institucional de un modelo familiar frente a libre organización privada."
        },
        {
            "id": "Q18", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "referentes_comunes", "dominio": "cultura_costumbres", "es_nucleo": False,
            "enunciado": "En el espacio público y la enseñanza común, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Dar amplio margen a enfoques culturales diversos según cada familia o centro, aunque debilite referentes comunes.", "posiciones": {"orden_social": -1.0}},
                {"id": "B", "texto": "Priorizar el aprendizaje y uso de un marco cultural e histórico común, aunque deje menos espacio a la diversidad.", "posiciones": {"orden_social": 1.0}}
            ],
            "nota_matiz": "Enfrenta pluralidad de enfoques frente a transmisión de referentes culturales comunes."
        },
        {
            "id": "Q37", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "costumbres_y_cohesion", "dominio": "cultura_costumbres", "es_nucleo": False,
            "enunciado": "Sobre las fiestas y celebraciones tradicionales de un lugar, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Sostenerlas con fondos públicos, aunque no todos los habitantes participen o se identifiquen.", "posiciones": {"orden_social": 1.0}},
                {"id": "B", "texto": "Que se mantengan solo si las sostienen quienes participan, aunque algunas desaparezcan.", "posiciones": {"orden_social": -1.0}}
            ],
            "nota_matiz": "Compara sostenimiento público de tradiciones frente a mantenimiento voluntario por participantes."
        },
        {
            "id": "Q38", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "vida_privada_y_normas_legales", "dominio": "normas_y_convivencia",
            "par_contenido_simetrico": "Q39", "es_nucleo": False,
            "enunciado": "Sobre los días de descanso y cierre comercial en un entorno, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que cada comercio decida cuándo abrir, aunque se debilite un descanso compartido.", "posiciones": {"orden_social": -1.0}},
                {"id": "B", "texto": "Que una ley fije días comunes de cierre, aunque limite la libertad de cada negocio.", "posiciones": {"orden_social": 1.0}}
            ],
            "nota_matiz": "Forma parte del par de contenido simétrico Q38/Q39 sobre imposición legal de normas."
        },
        {
            "id": "Q39", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "vida_privada_y_normas_legales", "dominio": "normas_y_convivencia",
            "par_contenido_simetrico": "Q38", "es_nucleo": False,
            "enunciado": "Sobre la adaptación de horarios o festivos por motivos culturales o religiosos distintos, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que se pacte en cada relación laboral o acuerdo privado, aunque algunas personas no logren adaptarlo.", "posiciones": {"orden_social": -1.0}},
                {"id": "B", "texto": "Que una ley obligue a adaptar horarios y festivos, aunque complique la organización.", "posiciones": {"orden_social": 1.0}}
            ],
            "nota_matiz": "Forma parte del par de contenido simétrico Q38/Q39."
        },
        {
            "id": "Q40", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "vida_privada_y_normas_legales", "dominio": "familia_vida_privada", "es_nucleo": False,
            "enunciado": "Frente a hábitos de riesgo para la salud como el alcohol o el tabaco, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Restringir su consumo o venta por ley, aunque limite la decisión personal.", "posiciones": {"orden_social": 1.0}},
                {"id": "B", "texto": "Que cada adulto decida, aunque asuma riesgos y costes para su salud.", "posiciones": {"orden_social": -1.0}}
            ],
            "nota_matiz": "Enfrenta restricción legal frente a decisión personal."
        },
        {
            "id": "Q41", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "referentes_comunes", "dominio": "cultura_costumbres", "es_nucleo": False,
            "enunciado": "Cuando llegan personas con costumbres culturales distintas a una comunidad, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que adopten las costumbres y normas culturales del lugar, aunque pierdan parte de las suyas.", "posiciones": {"orden_social": 1.0}},
                {"id": "B", "texto": "Que mantengan sus costumbres si cumplen la ley, aunque haya menos costumbres compartidas.", "posiciones": {"orden_social": -1.0}}
            ],
            "nota_matiz": "Ítem sensible a calibrar en piloto sobre asimilación cultural frente a pluralidad dentro de la ley."
        },
        {
            "id": "Q42", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "referentes_comunes", "dominio": "cultura_costumbres",
            "direccion": 1, "espejo": "Q43", "es_nucleo": False,
            "enunciado": "Es preferible que los ciudadanos compartan valores y referentes comunes, aunque se reduzca la diversidad.",
            "nota_matiz": "Mide preferencia por valores/referentes compartidos."
        },
        {
            "id": "Q43", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "orden_social", "peso_ejes": {"orden_social": 1.0},
            "faceta": "referentes_comunes", "dominio": "cultura_costumbres",
            "direccion": -1, "espejo": "Q42", "es_nucleo": False,
            "enunciado": "Es preferible que convivan valores y referentes muy distintos sin que ninguno predomine, aunque se debilite lo común.",
            "nota_matiz": "Espejo directo de Q42."
        },

        # --- EJE 4: poder_jurisprudencia (12 ítems: 4 núcleo + 8 profundización) ---
        {
            "id": "Q19", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "garantias_y_proceso", "dominio": "justicia_garantias",
            "direccion": -1, "espejo": "Q21", "es_nucleo": True,
            "enunciado": "Es preferible proteger las garantías de una persona investigada o juzgada, aunque eso haga más lento perseguir los delitos.",
            "nota_matiz": "Mide el peso dado a las garantías procesales frente a la rapidez de la persecución penal."
        },
        {
            "id": "Q21", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "garantias_y_proceso", "dominio": "justicia_garantias",
            "direccion": 1, "espejo": "Q19", "es_nucleo": False,
            "enunciado": "Es preferible reducir algunas garantías del proceso para perseguir antes un delito grave, aunque aumente el riesgo de errores.",
            "nota_matiz": "Espejo directo de Q19."
        },
        {
            "id": "Q22", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "castigo_ley_y_norma_social", "dominio": "justicia_garantias", "es_nucleo": True,
            "enunciado": "Al diseñar el sistema de sanciones penales, ¿qué prefieres priorizar?",
            "opciones": [
                {"id": "A", "texto": "Más recursos para la reinserción, aunque las penas sean más cortas.", "posiciones": {"poder_jurisprudencia": -1.0}},
                {"id": "B", "texto": "Penas más largas para delitos graves, aunque haya menos recursos para la reinserción.", "posiciones": {"poder_jurisprudencia": 1.0}}
            ],
            "nota_matiz": "Enfrenta recursos de reinserción frente a duración de las penas."
        },
        {
            "id": "Q23", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "investigacion_y_excepcionalidad", "dominio": "justicia_garantias", "es_nucleo": True,
            "enunciado": "Ante una situación urgente, ¿qué prefieres sobre las medidas excepcionales del Gobierno?",
            "opciones": [
                {"id": "A", "texto": "Permitir actuar de inmediato y revisar después, aunque se corrija tarde si hubo exceso.", "posiciones": {"poder_jurisprudencia": 1.0}},
                {"id": "B", "texto": "Exigir revisión previa de un juez o del Parlamento, aunque retrase la respuesta ante la urgencia.", "posiciones": {"poder_jurisprudencia": -1.0}}
            ],
            "nota_matiz": "Compara actuación inmediata con revisión posterior frente a revisión previa."
        },
        {
            "id": "Q16", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0, "orden_social": 0.4},
            "faceta": "castigo_ley_y_norma_social", "dominio": "normas_y_convivencia", "es_nucleo": False,
            "enunciado": "Frente a las reglas internas de una comunidad local o asociación, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que una regla común prevalezca sobre las normas internas de cada grupo, aunque reduzca su autonomía.", "posiciones": {"poder_jurisprudencia": 1.0, "orden_social": -0.4}},
                {"id": "B", "texto": "Que la comunidad aplique sus reglas propias a quien decida unirse y pueda marcharse, aunque haya normas dispares.", "posiciones": {"poder_jurisprudencia": -1.0, "orden_social": 0.4}}
            ],
            "nota_matiz": "Cruza regla común frente a autonomía de reglas internas con salida libre."
        },
        {
            "id": "Q20", "tipo": "propuesta_tradeoff", "tipo_respuesta": "eleccion_3",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0, "orden_social": 0.4},
            "faceta": "castigo_ley_y_norma_social", "dominio": "normas_y_convivencia", "es_nucleo": False,
            "enunciado": "Si una norma de convivencia es importante para parte de la población, ¿qué prefieres para quienes viven en ese entorno?",
            "opciones": [
                {"id": "A", "texto": "Que sea una regla legal obligatoria, aunque limite la libertad de quienes no la comparten.", "posiciones": {"poder_jurisprudencia": 0.8, "orden_social": 0.8}},
                {"id": "B", "texto": "Que sea una costumbre sostenida por la presión social, aunque quien la incumpla no tenga consecuencias legales.", "posiciones": {"poder_jurisprudencia": -0.5, "orden_social": 0.7}},
                {"id": "C", "texto": "Que no haya norma y cada persona haga lo suyo, aunque se pierdan reglas compartidas.", "posiciones": {"poder_jurisprudencia": -1.0, "orden_social": -1.0}}
            ],
            "nota_matiz": "Separa regla legal obligatoria, presión social sin sanción legal y ausencia de norma."
        },
        {
            "id": "Q24", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "investigacion_y_excepcionalidad", "dominio": "justicia_garantias", "es_nucleo": False,
            "enunciado": "Respecto al acceso a comunicaciones y datos en investigaciones, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Limitarlo con controles estrictos, aunque cueste más detectar ciertas redes delictivas.", "posiciones": {"poder_jurisprudencia": -1.0}},
                {"id": "B", "texto": "Ampliarlo, aunque se reduzca la privacidad de personas inocentes.", "posiciones": {"poder_jurisprudencia": 1.0}}
            ],
            "nota_matiz": "Enfrenta límites estrictos frente a mayor alcance de rastreo."
        },
        {
            "id": "Q44", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "garantias_y_proceso", "dominio": "justicia_garantias", "es_nucleo": False,
            "enunciado": "Sobre la prisión preventiva antes del juicio en delitos graves, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Aplicarla si hay riesgo para la seguridad colectiva, aunque se encarcele a quien resulte inocente.", "posiciones": {"poder_jurisprudencia": 1.0}},
                {"id": "B", "texto": "Limitarla casi solo a riesgo claro de fuga o destrucción de pruebas, aunque haya más riesgo de reincidencia.", "posiciones": {"poder_jurisprudencia": -1.0}}
            ],
            "nota_matiz": "Contrasta medida preventiva amplia frente a restricción estricta antes de sentencia."
        },
        {
            "id": "Q45", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "garantias_y_proceso", "dominio": "justicia_garantias", "es_nucleo": False,
            "enunciado": "Si una prueba clave se obtiene saltándose normas del procedimiento, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Rechazarla para proteger las reglas del proceso, aunque algún culpable quede libre.", "posiciones": {"poder_jurisprudencia": -1.0}},
                {"id": "B", "texto": "Admitirla si es fiable, aunque se incentive saltarse reglas de procedimiento.", "posiciones": {"poder_jurisprudencia": 1.0}}
            ],
            "nota_matiz": "Enfrenta exclusión probatoria por regla procesal frente a admisión por utilidad probatoria."
        },
        {
            "id": "Q46", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "investigacion_y_excepcionalidad", "dominio": "justicia_garantias",
            "direccion": 1, "espejo": "Q47", "es_nucleo": False,
            "enunciado": "Es preferible que la policía pueda practicar registros o detenciones sin autorización judicial previa en delitos graves, aunque aumente el riesgo de abusos.",
            "nota_matiz": "Mide preferencia por actuación policial directa sin autorización judicial previa."
        },
        {
            "id": "Q47", "tipo": "principio", "tipo_respuesta": "acuerdo_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "investigacion_y_excepcionalidad", "dominio": "justicia_garantias",
            "direccion": -1, "espejo": "Q46", "es_nucleo": False,
            "enunciado": "Es preferible exigir autorización judicial previa para medidas que afecten a derechos fundamentales, aunque algunos delitos graves tarden más en resolverse.",
            "nota_matiz": "Espejo directo de Q46."
        },
        {
            "id": "Q48", "tipo": "propuesta_tradeoff", "tipo_respuesta": "preferencia_5",
            "eje_primario": "poder_jurisprudencia", "peso_ejes": {"poder_jurisprudencia": 1.0},
            "faceta": "castigo_ley_y_norma_social", "dominio": "justicia_garantias", "es_nucleo": False,
            "enunciado": "Cuando aplicar una norma escrita produce un resultado manifiestamente injusto en un caso concreto, ¿qué prefieres?",
            "opciones": [
                {"id": "A", "texto": "Que el juez se atenga estrictamente al texto legal, aunque el resultado del caso sea injusto.", "posiciones": {"poder_jurisprudencia": -1.0}},
                {"id": "B", "texto": "Que el juez pueda apartarse o modular la aplicación para evitar la injusticia, aunque haya menos previsibilidad.", "posiciones": {"poder_jurisprudencia": 1.0}}
            ],
            "nota_matiz": "Contrasta literalidad/previsibilidad normativa frente a corrección judicial del caso concreto."
        }
    ]

    payload = {
        "meta": {
            "schema_version": "1.1.0",
            "bank_version": "v5",
            "total_items": len(items),
            "nucleo_items": sum(1 for x in items if x.get("es_nucleo"))
        },
        "items": items
    }
    validar_banco(payload)
    Path(out_path).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generado {out_path} con {len(items)} ítems validados.")


if __name__ == "__main__":
    build_v5()