import type { GuiaNivel1 } from "./tipos";

export const GUIA_LLANTA: GuiaNivel1 = {
  falla: "llanta",
  titulo: "Cambia la llanta",
  diagnostico: "Parece una llanta pinchada",
  confianza: 85,
  seguridad: [
    "Prende las luces de emergencia.",
    "Estaciona en suelo plano y firme, lejos de la pista y de las curvas.",
    "Apaga el motor, pon el freno de mano y baja del auto por el lado de la berma.",
    "Pon el triángulo de seguridad a unos 30 metros detrás del auto.",
    "Que los pasajeros esperen lejos del auto, fuera de la pista.",
  ],
  necesitas: [
    "Llanta de repuesto",
    "Gata",
    "Llave de ruedas",
    "Triángulo de seguridad",
    "Calzas o piedras grandes",
  ],
  pasos: [
    {
      titulo: "Frena y calza el auto",
      herramientas: ["Repuesto, gata y llave de ruedas", "Calzas o dos piedras grandes"],
      indicaciones: [
        "Pon el freno de mano y deja el auto en primera, o en P si es automático.",
        "Pon calzas o piedras junto a la llanta opuesta a la pinchada.",
        "Saca de la maletera el repuesto, la gata y la llave de ruedas.",
      ],
      noHacer: [
        "No cambies la llanta en una curva ni en una pendiente.",
        "No te pares del lado de los autos.",
      ],
      alerta: "Si el suelo está inclinado o blando, no sigas. Pide un mecánico.",
      ilustracion: "llanta-calzar",
      validacion: "Se ve bien. El auto está quieto y las calzas están en su lugar. Puedes seguir.",
    },
    {
      titulo: "Afloja las tuercas sin levantar el auto",
      herramientas: ["Llave de ruedas"],
      indicaciones: [
        "Si hay tapa, sácala con el lado plano de la llave.",
        "Encaja la llave en una tuerca y gira a la izquierda, solo media vuelta.",
        "Repite con todas. No las saques todavía.",
      ],
      noHacer: ["No levantes el auto antes de aflojar.", "No saltes sobre la llave."],
      ilustracion: "llanta-aflojar",
      validacion:
        "Muy bien. Las tuercas están flojas y la llanta sigue en el suelo. Ya puedes poner la gata.",
    },
    {
      titulo: "Pon la gata en el punto indicado",
      herramientas: ["Gata", "Manual del auto, si lo tienes"],
      indicaciones: [
        "Busca la muesca o flecha en el borde de abajo del auto, cerca de la llanta pinchada.",
        "Pon la gata justo ahí, sobre suelo firme.",
        "Gira la manivela hasta que la gata toque el auto, sin subirlo todavía.",
      ],
      noHacer: [
        "No apoyes la gata en plástico ni en el parachoques.",
        "No uses la gata en suelo blando.",
      ],
      alerta:
        "Una gata mal puesta puede resbalar. Si dudas del punto, pregúntale a la IA o pide un mecánico.",
      ilustracion: "llanta-gata",
      validacion:
        "La gata se ve bien apoyada en el punto del auto y el suelo parece firme. Puedes subir el auto.",
    },
    {
      titulo: "Levanta el auto y saca la llanta",
      herramientas: ["Gata", "Llave de ruedas"],
      indicaciones: [
        "Sube el auto hasta que la llanta quede a unos 5 cm del suelo.",
        "Saca las tuercas y guárdalas juntas, en un bolsillo o en la tapa.",
        "Retira la llanta pinchada y déjala acostada a un lado.",
      ],
      noHacer: ["No te metas debajo del auto.", "No metas manos ni pies bajo el auto levantado."],
      alerta: "Nadie debe estar dentro del auto mientras está levantado.",
      ilustracion: "llanta-levantar",
      validacion:
        "El auto está firme y la llanta ya salió. Deja la pinchada a un lado y sigue con el repuesto.",
    },
    {
      titulo: "Pon la llanta de repuesto",
      herramientas: ["Llanta de repuesto"],
      indicaciones: [
        "Alinea los huecos del repuesto con los pernos de la rueda.",
        "Empuja hasta que apoye bien.",
        "Pon las tuercas y ajústalas a mano.",
      ],
      noHacer: [
        "No pongas aceite ni grasa en los pernos.",
        "No ajustes fuerte con el auto en el aire.",
      ],
      ilustracion: "llanta-repuesto",
      validacion:
        "El repuesto está bien puesto y las tuercas están en su lugar. Ya puedes bajar el auto.",
    },
    {
      titulo: "Baja el auto y ajusta en cruz",
      herramientas: ["Gata", "Llave de ruedas"],
      indicaciones: [
        "Baja la gata hasta que la llanta toque el suelo.",
        "Ajusta fuerte las tuercas en cruz, siguiendo los números.",
        "Guarda todo y recoge el triángulo y las calzas.",
      ],
      noHacer: [
        "No ajustes en círculo, la llanta puede quedar chueca.",
        "No dejes herramientas en la pista.",
      ],
      ilustracion: "llanta-cruz",
      validacion: "Se ve parejo y bien ajustado. Solo falta revisar la presión del repuesto.",
    },
    {
      titulo: "Revisa la presión y ve a una llantería",
      herramientas: ["Un grifo cercano con aire"],
      indicaciones: [
        "Maneja despacio hasta un grifo y revisa la presión del repuesto.",
        "Después de unos 5 km, vuelve a ajustar las tuercas.",
        "Lleva la llanta pinchada a una llantería esta semana.",
      ],
      noHacer: [
        "No pases de 80 km/h con un repuesto delgado.",
        "No dejes el repuesto como llanta definitiva.",
      ],
      alerta: "El repuesto es solo para llegar al taller.",
      ilustracion: "llanta-presion",
      validacion: "Todo se ve en orden. Recuerda ir pronto a una llantería.",
    },
  ],
  prevencion: [
    "Lleva la llanta pinchada a una llantería esta semana. Casi siempre se puede reparar.",
    "Revisa la presión de tus llantas una vez al mes, con las llantas frías.",
    "Confirma que el repuesto, la gata y la llave estén siempre en la maletera.",
    "Mira el dibujo de tus llantas: si está muy liso, cámbialas pronto.",
  ],
  chat: {
    porPaso: [
      [
        {
          pregunta: "¿Dónde pongo el triángulo?",
          claves: ["triangulo"],
          texto:
            "Ponlo en tu mismo carril, a unos 30 metros detrás del auto, para que los demás te vean a tiempo.",
        },
        {
          pregunta: "¿Qué necesito?",
          claves: ["que necesito", "herramienta"],
          texto:
            "Llanta de repuesto, gata, llave de ruedas y el triángulo. Todo suele estar en la maletera.",
        },
      ],
      [
        {
          pregunta: "¿Qué son las calzas?",
          claves: ["calza", "piedra", "tope"],
          texto:
            "Son cuñas que evitan que el auto ruede. Si no tienes, usa dos piedras grandes o un ladrillo junto a la llanta opuesta a la pinchada.",
        },
        {
          pregunta: "No encuentro la gata",
          claves: [
            "no encuentro",
            "donde esta la gata",
            "donde esta el repuesto",
            "gata",
          ],
          texto:
            "Suele estar en la maletera, debajo de la alfombra del piso, junto al repuesto. A veces va en un costado, detrás de una tapa.",
        },
      ],
      [
        {
          pregunta: "¿Y si no aflojan las tuercas?",
          claves: [
            "no aflojan",
            "no se mueven",
            "no giran",
            "muy duras",
            "muy duro",
            "atascad",
            "trabad",
            "no puedo aflojar",
          ],
          texto:
            "Es normal, suelen venir muy ajustadas. Pon la llave en horizontal y empuja hacia abajo con el pie, apoyándote en el auto. No saltes encima. Si no se mueven, pide un mecánico.",
          derivar: "mecanico",
        },
        {
          pregunta: "¿Hacia dónde es la izquierda?",
          claves: ["izquierda", "hacia donde", "sentido"],
          texto: "Mirando la llanta de frente, gira al revés de las agujas del reloj.",
        },
        {
          claves: ["tapa", "taza", "embellecedor"],
          texto:
            "Algunas ruedas tienen una tapa de plástico. Sácala haciendo palanca con el lado plano de la llave.",
        },
        {
          claves: ["antirrobo", "tuerca especial"],
          texto:
            "Algunos autos tienen una tuerca antirrobo con llave propia. Suele estar en la guantera o en la maletera.",
        },
      ],
      [
        {
          pregunta: "¿Dónde pongo la gata?",
          claves: [
            "donde pongo",
            "punto de apoyo",
            "muesca",
            "flecha",
            "donde va la gata",
          ],
          texto:
            "Busca una muesca o flecha en el borde de abajo del auto, cerca de la llanta pinchada. Ese es el punto de apoyo. Si no la ves, mira el manual del auto.",
        },
        {
          claves: ["suelo blando", "tierra", "arena", "pasto", "inclinad", "pendiente"],
          texto:
            "No uses la gata ahí, el auto puede resbalar. Busca suelo firme y plano, o pide un mecánico.",
          derivar: "mecanico",
        },
      ],
      [
        {
          pregunta: "¿Hasta dónde subo el auto?",
          claves: ["hasta donde", "cuanto subo", "que tanto", "altura"],
          texto:
            "Lo justo para que la llanta pinchada quede a unos 5 cm del suelo. El repuesto está inflado y necesita más espacio: sube un poco más si no entra.",
        },
        {
          claves: ["se mueve", "tambalea", "inestable", "resbala", "se cae"],
          texto:
            "Baja la gata con calma y no te acerques al auto por abajo. Revisa el suelo y el punto de apoyo. Si no se ve seguro, pide un mecánico.",
          derivar: "mecanico",
        },
        {
          claves: ["no sale", "pegada"],
          texto:
            "A veces la llanta se pega al eje. Jálala hacia ti con las dos manos y muévela de lado a lado. Si no sale, baja el auto y pide un mecánico.",
          derivar: "mecanico",
        },
      ],
      [
        {
          pregunta: "El repuesto no entra",
          claves: ["no entra", "no encaja", "no llega", "no calza"],
          texto:
            "Alinea los huecos del repuesto con los pernos de la rueda. Si no llega a la altura, sube la gata una o dos vueltas más.",
        },
        {
          claves: ["perdi", "se cayo", "falta una", "falta tuerca"],
          texto:
            "Cada llanta debe llevar todas sus tuercas. No salgas manejando con una de menos. Un mecánico puede conseguirte la que falta.",
          derivar: "mecanico",
        },
      ],
      [
        {
          pregunta: "¿Qué tan fuerte ajusto?",
          claves: ["que tan fuerte", "cuanto ajusto", "muy fuerte", "apretar"],
          texto: "Lo más fuerte que puedas con la llave, sin saltar encima. Siempre en cruz.",
        },
        {
          claves: ["cruz", "estrella", "orden"],
          texto:
            "Ajusta una tuerca, luego la de enfrente, y así siguiendo la estrella. Así la llanta queda pareja.",
        },
      ],
      [
        {
          pregunta: "¿Cuánta presión le pongo?",
          claves: ["cuanta presion", "psi", "presion"],
          texto:
            "Suele ser entre 32 y 35 PSI. Si tu repuesto es delgado, la presión viene escrita en su costado.",
        },
        {
          pregunta: "¿Hasta dónde puedo manejar?",
          claves: ["cuanto puedo manejar", "cuantos km", "cuantos kilometros", "hasta donde puedo"],
          texto:
            "El repuesto es para llegar a la llantería, a menos de 80 km/h y por poco tiempo.",
        },
        {
          claves: ["taller", "llanteria", "reparar", "arreglar"],
          texto:
            "Llévala a una llantería esta semana. Casi siempre un parche o un tapón la deja como nueva. Que revisen también el aro.",
        },
      ],
    ],
    generales: [],
  },
};
