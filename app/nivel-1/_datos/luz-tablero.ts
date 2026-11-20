import type { GuiaNivel1, ReglaChat } from "./tipos";

// Significado de los símbolos más comunes. Sirven en cualquier paso.
const SIMBOLOS: ReglaChat[] = [
  {
    claves: ["aceite"],
    texto:
      "La luz roja de aceite es poca presión de aceite. No sigas manejando: el motor se puede dañar. Lo más seguro es pedir una grúa.",
    derivar: "grua",
  },
  {
    claves: ["temperatura", "calienta", "termometro"],
    texto:
      "Si es la luz de temperatura, el motor está muy caliente. Apágalo, no abras el radiador y pide una grúa.",
    derivar: "grua",
  },
  {
    claves: ["bateria"],
    texto:
      "La luz de batería avisa que el auto no está recargando bien. Puede apagarse pronto. Un mecánico puede revisarlo donde estás.",
    derivar: "mecanico",
  },
  {
    claves: ["check engine", "motor"],
    texto:
      "Es el aviso del motor. Si es amarilla y fija, puedes ir con calma a un taller. Si parpadea o el auto pierde fuerza, detente y pide ayuda.",
    derivar: "mecanico",
  },
  {
    claves: ["llanta", "presion"],
    texto:
      "Es el aviso de presión baja en las llantas. Ve despacio a un grifo e infla todas a la presión que indica la puerta del conductor.",
  },
  {
    claves: ["freno", "abs"],
    texto:
      "Si es roja, primero revisa que el freno de mano esté bajado. Si sigue roja, no manejes y pide una grúa. Si es ABS en amarillo, ve con calma a un taller.",
    derivar: "grua",
  },
];

export const GUIA_LUZ_TABLERO: GuiaNivel1 = {
  falla: "luz_tablero",
  titulo: "Entiende la luz del tablero",
  diagnostico: "Parece una luz informativa del tablero",
  confianza: 75,
  seguridad: [
    "Estaciona en un lugar seguro antes de mirar el tablero.",
    "Si la luz es roja, o hay humo u olor a quemado, apaga el motor y pide ayuda.",
    "No manejes con una luz roja prendida.",
    "Prende las luces de emergencia si te detuviste en la pista.",
  ],
  necesitas: ["El manual del auto, si lo tienes", "Tu celular para tomar una foto de la luz"],
  pasos: [
    {
      titulo: "Fíjate en el color y el dibujo",
      herramientas: ["Tu celular para tomar una foto"],
      indicaciones: [
        "Mira de qué color es la luz: roja, amarilla, o verde y azul.",
        "Fíjate si está fija o parpadea.",
        "Toma una foto del dibujo por si hace falta mostrarlo.",
      ],
      noHacer: ["No ignores una luz roja.", "No tapes la luz con cinta para que no moleste."],
      alerta: "Roja es detente. Amarilla, revisa pronto. Verde o azul, solo informa.",
      ilustracion: "tablero-colores",
      validacion: "La luz se ve nítida. Si no es roja, puedes seguir con la guía.",
    },
    {
      titulo: "Revisa lo más simple",
      herramientas: [],
      indicaciones: [
        "Cierra bien todas las puertas y la maletera.",
        "Ajusta la tapa del tanque de combustible hasta oír el clic.",
        "Mira si las llantas se ven bajas y si el freno de mano está suelto.",
      ],
      noHacer: [
        "No abras el radiador con el motor caliente.",
        "No desconectes la batería para apagar la luz.",
      ],
      ilustracion: "tablero-revisar",
      validacion: "Todo se ve en su sitio. Ahora apaga y prende el auto.",
    },
    {
      titulo: "Apaga y prende de nuevo",
      herramientas: [],
      indicaciones: [
        "Apaga el auto y espera un minuto.",
        "Prende otra vez y mira si la luz se apagó.",
        "Si sigue prendida, fíjate si hay ruidos raros o si el auto pierde fuerza.",
      ],
      noHacer: ["No sigas si la luz se pone roja o el auto pierde fuerza."],
      alerta: "Si la luz se vuelve roja o parpadea, detente y pide ayuda.",
      ilustracion: "tablero-reiniciar",
      validacion: "El tablero se ve normal. Si la luz sigue, anota cómo se comporta el auto.",
    },
    {
      titulo: "Maneja con calma hasta un taller",
      herramientas: [],
      indicaciones: [
        "Si la luz se apagó, pide una revisión esta semana de todas formas.",
        "Si sigue prendida y no es roja, maneja suave hasta un taller.",
        "Si tienes dudas, pide un mecánico que lea el aviso.",
      ],
      noHacer: [
        "No hagas viajes largos con la luz prendida.",
        "No aceleres fuerte ni cargues el auto de más.",
      ],
      ilustracion: "tablero-taller",
      validacion: "Todo bien. Lo importante ahora es que un taller lea el aviso.",
    },
  ],
  prevencion: [
    "Haz revisar el auto en un taller esta semana, aunque la luz se haya apagado.",
    "Recuerda los colores: rojo detente, amarillo revisa pronto, verde o azul solo informa.",
    "Revisa aceite, agua del radiador y presión de llantas una vez al mes.",
    "Guarda el manual en la guantera: explica el significado de cada dibujo.",
  ],
  chat: {
    porPaso: [
      [
        {
          pregunta: "¿Qué significa esta luz?",
          claves: ["que significa", "significa", "que luz", "que quiere decir"],
          texto:
            "Depende del color. Roja: detente. Amarilla: revisa pronto. Verde o azul: solo informa. Dime el dibujo (aceite, temperatura, batería, motor o llantas) y te explico.",
        },
      ],
      [
        {
          pregunta: "¿Qué significa esta luz?",
          claves: ["que significa", "significa", "que luz", "que quiere decir"],
          texto:
            "Depende del color. Roja: detente. Amarilla: revisa pronto. Verde o azul: solo informa. Dime el dibujo (aceite, temperatura, batería, motor o llantas) y te explico.",
        },
        {
          pregunta: "¿Qué hago si parpadea?",
          claves: ["parpadea", "titila", "intermitente"],
          texto:
            "Una luz que parpadea es más urgente que una fija. Detente en un lugar seguro y pide ayuda.",
          derivar: "mecanico",
        },
      ],
      [
        {
          pregunta: "¿Dónde está la tapa del tanque?",
          claves: ["tapa", "tanque", "combustible"],
          texto:
            "Está en un costado del auto, detrás de una tapita. Gírala hasta oír varios clics: una tapa floja puede prender la luz del motor.",
        },
      ],
      [
        {
          pregunta: "Se apagó, ¿ya está?",
          claves: ["se apago", "ya esta", "desaparecio"],
          texto:
            "Qué bueno. Aun así pide una revisión esta semana: algunas fallas se van y vuelven.",
        },
        {
          pregunta: "Sigue prendida",
          claves: ["sigue prendida", "no se apaga", "sigue igual"],
          texto:
            "Si no es roja, puedes ir con calma a un taller. Si es roja o el auto pierde fuerza, no sigas.",
          derivar: "mecanico",
        },
      ],
      [
        {
          pregunta: "¿Puedo seguir manejando?",
          claves: ["seguir manejando", "puedo manejar", "puedo conducir", "llegar"],
          texto:
            "Si la luz es amarilla y el auto anda normal, sí, con calma y hasta un taller. Si es roja, no.",
        },
      ],
    ],
    generales: SIMBOLOS,
  },
};
