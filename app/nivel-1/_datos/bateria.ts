import type { GuiaNivel1 } from "./tipos";

export const GUIA_BATERIA: GuiaNivel1 = {
  falla: "bateria",
  titulo: "Pasa corriente a tu batería",
  diagnostico: "Parece una batería descargada",
  confianza: 80,
  seguridad: [
    "Prende las luces de emergencia.",
    "Pon el freno de mano y deja el auto en P o en primera.",
    "Apaga luces, radio y aire de los dos autos.",
    "No fumes ni acerques fuego a la batería. Protégete los ojos si puedes.",
    "Si la batería está hinchada, rota o con fuga, no la toques y pide ayuda.",
  ],
  necesitas: ["Cables pasacorriente", "Otro auto con batería buena", "Guantes, si tienes"],
  pasos: [
    {
      titulo: "Acerca el otro auto",
      herramientas: ["Cables pasacorriente", "Otro auto con batería buena"],
      indicaciones: [
        "Pon el otro auto de frente o de costado, con las baterías cerca.",
        "Que los autos no se toquen entre sí.",
        "Apaga los dos motores y pon el freno de mano.",
      ],
      noHacer: ["No dejes que los autos se toquen.", "No estires los cables: acerca más el auto."],
      ilustracion: "bateria-autos",
      validacion: "Se ve bien. Los autos están cerca y sin tocarse. Puedes abrir los capós.",
    },
    {
      titulo: "Abre los capós y ubica los bornes",
      herramientas: ["Un trapo seco, si tienes"],
      indicaciones: [
        "Abre los dos capós y busca las baterías.",
        "Ubica el borne positivo (+), casi siempre con tapa roja.",
        "Ubica el borne negativo (-) y límpialo con el trapo si tiene suciedad.",
      ],
      noHacer: [
        "No sigas si la batería está hinchada, rota o con fuga.",
        "No fumes ni acerques fuego.",
      ],
      alerta: "Si la batería está hinchada, con fuga o con olor fuerte, detente y pide ayuda.",
      ilustracion: "bateria-bornes",
      validacion: "Los bornes se ven limpios y la batería no está hinchada. Puedes conectar el cable rojo.",
    },
    {
      titulo: "Conecta el cable rojo",
      herramientas: ["Cable rojo"],
      indicaciones: [
        "Conecta una pinza roja al borne positivo (+) de tu batería descargada.",
        "Conecta la otra pinza roja al positivo (+) de la batería buena.",
        "Revisa que las pinzas agarren firme.",
      ],
      noHacer: [
        "No dejes que las pinzas se toquen entre sí.",
        "No conectes el rojo al borne negativo.",
      ],
      alerta: "Si las pinzas se tocan con los cables conectados, saltan chispas. Sujétalas por el plástico.",
      ilustracion: "bateria-rojo",
      validacion: "El cable rojo está bien conectado a los dos positivos. Ahora toca el cable negro.",
    },
    {
      titulo: "Conecta el cable negro",
      herramientas: ["Cable negro"],
      indicaciones: [
        "Conecta una pinza negra al negativo (-) de la batería buena.",
        "Conecta la otra pinza negra a un metal sin pintar del motor de tu auto, lejos de la batería.",
        "Revisa que ningún cable quede cerca de correas o del ventilador.",
      ],
      noHacer: [
        "No conectes la última pinza al negativo de la batería descargada.",
        "No dejes cables sueltos cerca de piezas que giran.",
      ],
      alerta: "La última conexión puede soltar una chispa pequeña. Por eso va lejos de la batería.",
      ilustracion: "bateria-negro",
      validacion: "Los cuatro cables están en su lugar y el negro final va a un metal sin pintar. Todo bien.",
    },
    {
      titulo: "Prende el auto que ayuda",
      herramientas: [],
      indicaciones: [
        "Prende el motor del auto con batería buena.",
        "Déjalo prendido de 3 a 5 minutos, acelerando suave.",
        "Mientras tanto, no toques los cables.",
      ],
      noHacer: ["No aceleres fuerte el auto que ayuda."],
      ilustracion: "bateria-espera",
      validacion: "Todo se ve conectado y firme. Espera unos minutos más antes de intentar.",
    },
    {
      titulo: "Prende tu auto",
      herramientas: [],
      indicaciones: [
        "Gira la llave o aprieta el botón de encendido de tu auto.",
        "Si no prende en 10 segundos, espera 2 minutos y prueba de nuevo.",
        "Si prende, déjalo prendido.",
      ],
      noHacer: ["No insistas más de 3 veces.", "No aceleres de golpe."],
      alerta: "Si no prende después de 3 intentos, la batería puede estar dañada. Pide un mecánico.",
      ilustracion: "bateria-arranque",
      validacion: "Se ve que el tablero se encendió. Si el motor prendió, deja los cables un minuto más.",
    },
    {
      titulo: "Retira los cables en orden inverso",
      herramientas: ["Guantes, si tienes"],
      indicaciones: [
        "Quita primero la pinza negra del metal de tu motor, luego la negra de la batería buena.",
        "Después quita la roja de la batería buena y al final la roja de la tuya.",
        "Cierra los capós y deja tu auto prendido.",
      ],
      noHacer: [
        "No apagues tu auto enseguida.",
        "No dejes que las pinzas se toquen al quitarlas.",
      ],
      ilustracion: "bateria-retirar",
      validacion: "Cables guardados y capós cerrados. Maneja unos 30 minutos para recargar la batería.",
    },
  ],
  prevencion: [
    "Maneja unos 30 minutos para que la batería se recargue. No apagues el auto antes.",
    "Haz revisar la batería en un taller esta semana. Si tiene más de 3 años, puede tocar cambiarla.",
    "Apaga luces, radio y aire antes de bajar del auto.",
    "Pide que revisen los bornes y el alternador, que es lo que recarga la batería.",
  ],
  chat: {
    porPaso: [
      [
        {
          pregunta: "¿Qué cables necesito?",
          claves: ["que cables", "cables necesito", "pasacorriente"],
          texto:
            "Cables pasacorriente: dos cables gruesos, uno rojo y uno negro, con pinzas en las puntas. Suelen venir en la maletera.",
        },
        {
          pregunta: "¿Es peligroso?",
          claves: ["peligro", "riesgo", "seguro es"],
          texto:
            "Si sigues el orden y no dejas que las pinzas se toquen, es seguro. Si la batería se ve hinchada o con fuga, no lo hagas.",
        },
      ],
      [
        {
          pregunta: "¿Puedo usar cualquier auto?",
          claves: ["cualquier auto", "otro auto", "que auto"],
          texto:
            "Sí, si su batería es de 12 voltios, como casi todos los autos. Si dudas, mira la etiqueta de la batería.",
        },
        {
          claves: ["no alcanza", "muy lejos", "cortos"],
          texto: "Acerca más el auto, sin que se toquen. No estires los cables.",
        },
      ],
      [
        {
          pregunta: "¿Cuál es el positivo?",
          claves: ["positivo", "negativo", "cual es", "signo", "borne"],
          texto:
            "El positivo lleva el signo + y casi siempre una tapa roja. El negativo lleva el signo - y suele ser negro.",
        },
        {
          pregunta: "La batería se ve hinchada",
          claves: ["hinchad", "derram", "acido", "rota"],
          texto:
            "No la toques ni pases corriente. Una batería hinchada puede ser peligrosa. Lo más seguro es pedir una grúa.",
          derivar: "grua",
        },
      ],
      [
        {
          pregunta: "¿Qué cable va primero?",
          claves: ["primero", "orden", "cual va"],
          texto:
            "Primero el rojo: al positivo de tu batería y luego al positivo de la buena. Después el negro.",
        },
        {
          pregunta: "¿Y si las pinzas se tocan?",
          claves: ["se tocan", "chispa", "juntan"],
          texto:
            "Sepáralas enseguida, agarrándolas por el plástico. Una chispa pequeña no suele dañar nada, pero no sigas si ves humo.",
        },
      ],
      [
        {
          pregunta: "¿Por qué el negro va al metal?",
          claves: ["por que", "metal", "motor", "negativo de mi bateria"],
          texto:
            "Así la última chispa salta lejos de la batería, donde puede haber gases. Busca un perno o soporte de metal sin pintar.",
        },
        {
          claves: ["no encuentro", "donde conecto"],
          texto:
            "Busca un perno grande o un soporte de metal sin pintar en el motor. Evita piezas de plástico o que se muevan.",
        },
      ],
      [
        {
          pregunta: "¿Cuánto espero?",
          claves: ["cuanto espero", "cuanto tiempo", "minutos"],
          texto:
            "De 3 a 5 minutos con el motor del otro auto prendido. Si tu batería está muy baja, hasta 10.",
        },
      ],
      [
        {
          pregunta: "No prende",
          claves: ["no prende", "no arranca", "no enciende", "clic", "click"],
          texto:
            "Espera 2 minutos con el otro auto prendido y prueba de nuevo. Si hace solo clic o no prende tras 3 intentos, la batería puede estar dañada. Pide un mecánico.",
          derivar: "mecanico",
        },
        {
          pregunta: "¿Cuánto manejo después?",
          claves: ["cuanto manejo", "cuanto conduzco", "despues"],
          texto:
            "Unos 30 minutos sin apagar el auto, mejor por avenida que en tráfico detenido, para que se recargue.",
        },
      ],
      [
        {
          pregunta: "¿Qué cable quito primero?",
          claves: ["que cable quito", "orden", "primero"],
          texto:
            "Al revés que al conectar: el negro del metal, luego el negro del otro auto, después el rojo del otro auto y al final el rojo del tuyo.",
        },
        {
          pregunta: "¿Puedo apagar el auto?",
          claves: ["apago", "apagar"],
          texto: "Mejor no por 30 minutos. Si se apaga, puede que no vuelva a prender.",
        },
      ],
    ],
    generales: [],
  },
};
