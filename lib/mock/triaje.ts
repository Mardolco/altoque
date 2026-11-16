// Triaje simulado. Es lo que responde /api/triaje mientras no haya una IA
// de verdad. Reglas:
//
// - Llanta: hace tres preguntas. Con repuesto y gata, Nivel 1 (resuélvelo
//   tú). Sin repuesto o sin gata, Nivel 2 (mecánico).
// - Batería y luz en el tablero: el diseño no trae preguntas ni guía, así
//   que van directo al Nivel 2.
// - "Otro", o nada elegido y sin foto: si la descripción no da pistas, la IA
//   no está segura (seguro: false) y deriva al Nivel 2.
//
// Contenido inventado que el equipo debe revisar: todos los textos que no
// salen del diseño (batería, luz en el tablero y las variantes de llanta).

import type {
  Diagnostico,
  Falla,
  NotasDiagnostico,
  Pregunta,
  Respuesta,
  RespuestaTriaje,
  SolicitudTriaje,
} from "../tipos";
import { USUARIO } from "./usuario";

type Resultado = { diagnostico: Diagnostico; notas: NotasDiagnostico };

export const PREGUNTAS_LLANTA: Pregunta[] = [
  {
    id: "lugar_seguro",
    texto: "¿Estás en un lugar seguro, fuera de la pista?",
    ayuda: "Por ejemplo, en la berma, una calle lateral o un estacionamiento.",
    corto: "Lugar seguro",
    avisoSiNo: "Si puedes, avanza despacio con las luces de emergencia hasta un lugar seguro.",
  },
  {
    id: "repuesto",
    texto: "¿Tienes llanta de repuesto?",
    ayuda: "Suele estar en la maletera, debajo de la alfombra del piso.",
    corto: "Llanta de repuesto",
  },
  {
    id: "gata",
    texto: "¿Tienes gata y llave de ruedas?",
    ayuda:
      "La gata sirve para levantar el auto. La llave de ruedas, para aflojar los pernos de la llanta.",
    corto: "Gata y llave de ruedas",
  },
];

export function triajeSimulado(solicitud: SolicitudTriaje): RespuestaTriaje {
  const conFoto = Boolean(solicitud.foto);
  const conTexto = solicitud.descripcion.trim().length > 0;

  if (solicitud.foto && !solicitud.foto.startsWith("data:image/")) {
    return { tipo: "foto_error" };
  }

  const falla = adivinarFalla(solicitud.falla, solicitud.descripcion, conFoto);

  if (falla === "llanta") {
    if (!solicitud.respuestas) return { tipo: "preguntas", preguntas: PREGUNTAS_LLANTA };
    const respuestas = new Map(solicitud.respuestas.map((r) => [r.id, r.respuesta]));
    return {
      tipo: "diagnostico",
      ...diagnosticoLlanta({
        repuesto: respuestas.get("repuesto") ?? "No sé",
        gata: respuestas.get("gata") ?? "No sé",
        conFoto,
        conTexto,
      }),
    };
  }

  const detalle = mayuscula(origen({ conFoto, conTexto, conRespuestas: false }));
  if (falla === "bateria") return { tipo: "diagnostico", ...diagnosticoBateria(detalle) };
  if (falla === "luz_tablero") return { tipo: "diagnostico", ...diagnosticoTablero(detalle) };
  return { tipo: "diagnostico", ...diagnosticoInseguro(conFoto, conTexto) };
}

/**
 * Si el usuario no eligió una parte, busca pistas en lo que escribió. Y si
 * solo mandó una foto, hace como que la IA reconoció la llanta del guion de
 * la demo: "con una foto o una frase basta".
 */
function adivinarFalla(falla: Falla | null, descripcion: string, conFoto: boolean): Falla {
  if (falla && falla !== "otra") return falla;
  const texto = descripcion.toLowerCase();
  if (/llanta|neum[aá]tico|pinch|ponch|desinfl/.test(texto)) return "llanta";
  if (/bater[ií]a|no prende|no arranca|no enciende/.test(texto)) return "bateria";
  if (/tablero|testigo|luz roja|luz amarilla|check engine/.test(texto)) return "luz_tablero";
  if (falla === null && conFoto) return "llanta";
  return "otra";
}

/** De dónde sale el diagnóstico: "según tu foto y respuestas". */
function origen(datos: { conFoto: boolean; conTexto: boolean; conRespuestas: boolean }): string {
  const fuente = datos.conFoto ? "tu foto" : datos.conTexto ? "tu descripción" : null;
  if (datos.conRespuestas) return fuente ? `según ${fuente} y respuestas` : "según tus respuestas";
  return fuente ? `según ${fuente}` : "según lo que nos contaste";
}

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// --- Llanta -----------------------------------------------------------------

export function diagnosticoLlanta(datos: {
  repuesto: Respuesta;
  gata: Respuesta;
  conFoto: boolean;
  conTexto: boolean;
}): Resultado {
  const { repuesto, gata, conFoto, conTexto } = datos;
  const tieneTodo = repuesto === "Sí" && gata === "Sí";

  // Con foto, la IA "ve" cuál llanta es. En la demo, la delantera derecha.
  const llanta = conFoto ? "Llanta delantera derecha pinchada" : "Llanta pinchada";
  const segun = origen({ conFoto, conTexto, conRespuestas: true });
  const detalle = conFoto ? `Delantera derecha · ${segun}` : mayuscula(segun);

  let tiene: string;
  let motivo: string;
  if (tieneTodo) {
    tiene = "tiene repuesto y gata";
    motivo =
      "Tienes repuesto, gata y llave de ruedas. Te guiamos paso a paso para cambiar la llanta.";
  } else if (repuesto === "Sí" && gata === "No") {
    tiene = "tiene repuesto pero no gata";
    motivo =
      "Sin gata no podrás levantar el auto. Un mecánico verificado llega con herramientas y pone tu repuesto.";
  } else if (repuesto === "No" && gata === "Sí") {
    tiene = "tiene gata pero no repuesto";
    motivo =
      "Sin llanta de repuesto no podrás cambiarla tú. Un mecánico verificado llega con lo necesario para ayudarte.";
  } else if (repuesto === "No" && gata === "No") {
    tiene = "no tiene repuesto ni gata";
    motivo =
      "Sin repuesto ni gata no podrás cambiarla tú. Un mecánico verificado llega con herramientas y te ayuda donde estás.";
  } else {
    tiene = "no sabe si tiene repuesto y gata";
    motivo =
      "Si no sabes si tienes repuesto y gata, es mejor que te ayude un mecánico verificado. Llega con herramientas.";
  }

  return {
    diagnostico: {
      nivel: tieneTodo ? 1 : 2,
      semaforo: "rojo",
      falla: "llanta",
      titulo: "Llanta pinchada",
      queHacer: [
        "Deja las luces de emergencia prendidas.",
        "No sigas manejando: dañarías el aro.",
        tieneTodo
          ? "Ten a la mano el repuesto, la gata y la llave de ruedas."
          : "Espera en el auto con los seguros puestos.",
      ],
      resumen: `${llanta}. Conductora en ${USUARIO.ubicacion}, ${tiene}.`,
      seguro: true,
    },
    notas: { detalle, motivo, posibles: [] },
  };
}

// --- Batería y luz en el tablero (el diseño no las cubre) ------------------

function diagnosticoBateria(detalle: string): Resultado {
  return {
    diagnostico: {
      nivel: 2,
      semaforo: "ambar",
      falla: "bateria",
      titulo: "Batería descargada",
      queHacer: [
        "Apaga las luces, la radio y el aire.",
        "No sigas intentando prender el auto.",
        "Espera en el auto con los seguros puestos.",
      ],
      resumen: `Batería descargada, el auto no prende. Conductora en ${USUARIO.ubicacion}.`,
      seguro: true,
    },
    notas: {
      detalle,
      motivo:
        "Un mecánico verificado puede pasarte corriente o cambiar la batería donde estás.",
      posibles: [],
    },
  };
}

function diagnosticoTablero(detalle: string): Resultado {
  return {
    diagnostico: {
      nivel: 2,
      semaforo: "ambar",
      falla: "luz_tablero",
      titulo: "Luz de aviso en el tablero",
      queHacer: [
        "Si la luz es roja, detente en un lugar seguro.",
        "No aceleres fuerte ni hagas un viaje largo.",
        "Fíjate si el auto pierde fuerza o suena distinto.",
      ],
      resumen: `Se prendió una luz de aviso en el tablero. Conductora en ${USUARIO.ubicacion}.`,
      seguro: true,
    },
    notas: {
      detalle,
      motivo: "Un mecánico verificado puede leer el aviso y decirte si es seguro seguir.",
      posibles: [],
    },
  };
}

// --- La IA no está segura ---------------------------------------------------

function diagnosticoInseguro(conFoto: boolean, conTexto: boolean): Resultado {
  let detalle: string;
  if (conFoto) detalle = "No logro reconocer la falla con lo que me enviaste.";
  else if (conTexto) detalle = "Con tu descripción no me alcanza para saber qué falla es.";
  else detalle = "Sin una foto ni una descripción no puedo saber qué falla es.";

  return {
    diagnostico: {
      nivel: 2,
      semaforo: "ambar",
      falla: "otra",
      titulo: "Falla por confirmar",
      queHacer: [
        "No sigas manejando hasta que lo revisen.",
        "Deja las luces de emergencia prendidas.",
      ],
      resumen: `Falla por confirmar: la IA no pudo identificarla. Conductora en ${USUARIO.ubicacion}.`,
      seguro: false,
    },
    notas: {
      detalle,
      motivo: "Un mecánico verificado puede revisarlo donde estás y decirte qué es.",
      posibles: [],
    },
  };
}

// --- Ejemplos del diseño ----------------------------------------------------
// Sirven de respaldo cuando una pantalla se abre sin haber pasado por el
// triaje, por ejemplo al desarrollar un nivel entrando directo a su ruta.

/** 05 Diagnóstico: Valeria respondió Sí, Sí y No (no tiene gata). */
export const DIAGNOSTICO_DEMO: Resultado = diagnosticoLlanta({
  repuesto: "Sí",
  gata: "No",
  conFoto: true,
  conTexto: false,
});

/** E1 La IA no está segura, con los textos del diseño. */
export const INSEGURO_DEMO: Resultado = {
  diagnostico: {
    nivel: 2,
    semaforo: "ambar",
    falla: "llanta",
    titulo: "Falla por confirmar",
    queHacer: [
      "No sigas manejando hasta que lo revisen.",
      "Deja las luces de emergencia prendidas.",
    ],
    resumen: `Puede ser llanta baja, llanta pinchada o aro dañado. Conductora en ${USUARIO.ubicacion}.`,
    seguro: false,
  },
  notas: {
    detalle: "La foto está oscura y tus respuestas encajan con más de una falla.",
    motivo: "Un mecánico verificado puede revisarlo donde estás y decirte qué es.",
    posibles: ["Llanta baja", "Llanta pinchada", "Aro dañado"],
  },
};
