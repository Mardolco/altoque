// Triaje simulado. Es lo que responde /api/triaje mientras no haya una IA
// de verdad. Reglas:
//
// - Una descripción con humo, choque, frenos, fuga o sobrecalentamiento va
//   directo al Nivel 3 (grúa), sea cual sea la falla elegida.
// - Llanta: hace tres preguntas. Con repuesto y gata, Nivel 1 (resuélvelo
//   tú). Sin repuesto o sin gata, Nivel 2 (mecánico).
// - Batería: cuatro preguntas. Con cables, otro auto y sin humo, Nivel 1;
//   con humo o batería hinchada, Nivel 3; en los demás casos, Nivel 2.
// - Luz en el tablero: tres preguntas. Luz informativa (no roja, sin humo),
//   Nivel 1; roja de aceite o temperatura, o con humo, Nivel 3; otra luz
//   roja o dudas, Nivel 2.
// - "Otro": tres preguntas. Humo, fuga o frenos raros, Nivel 3. Si no hay
//   pistas, la IA no está segura (seguro: false) y deriva al Nivel 2.
//
// Contenido inventado que el equipo debe revisar: todos los textos que no
// salen del diseño (batería, luz en el tablero, fallas graves y las
// variantes de llanta).

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

const LUGAR_SEGURO: Pregunta = {
  id: "lugar_seguro",
  texto: "¿Estás en un lugar seguro, fuera de la pista?",
  ayuda: "Por ejemplo, en la berma, una calle lateral o un estacionamiento.",
  corto: "Lugar seguro",
  avisoSiNo: "Si puedes, avanza despacio con las luces de emergencia hasta un lugar seguro.",
};

export const PREGUNTAS_LLANTA: Pregunta[] = [
  LUGAR_SEGURO,
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

export const PREGUNTAS_BATERIA: Pregunta[] = [
  LUGAR_SEGURO,
  {
    id: "humo",
    texto: "¿Ves humo, hay olor a quemado o la batería está hinchada?",
    ayuda: "Mírala solo si es seguro. Una batería hinchada o con líquido es peligrosa.",
    corto: "Humo o batería hinchada",
  },
  {
    id: "cables",
    texto: "¿Tienes cables pasacorriente?",
    ayuda: "Son dos cables gruesos, uno rojo y uno negro, con pinzas. Suelen ir en la maletera.",
    corto: "Cables pasacorriente",
  },
  {
    id: "otro_auto",
    texto: "¿Hay otro auto con batería buena que pueda ayudarte?",
    ayuda: "Puede ser un amigo, un vecino o alguien que pase y quiera ayudarte.",
    corto: "Otro auto que ayude",
  },
];

export const PREGUNTAS_LUZ: Pregunta[] = [
  {
    id: "luz_roja",
    texto: "¿La luz que se prendió es roja?",
    ayuda: "Roja es la que pide detenerte. Amarilla, verde o azul son avisos más suaves.",
    corto: "Luz roja",
  },
  {
    id: "luz_aceite_temp",
    texto: "¿El dibujo es una lamparita de aceite o un termómetro?",
    ayuda: "La lamparita de aceite parece una pequeña lata con una gota. El termómetro tiene ondas.",
    corto: "Aceite o temperatura",
  },
  {
    id: "humo",
    texto: "¿Notas humo, olor a quemado o ruidos raros?",
    ayuda: "Por ejemplo, golpeteos, chillidos o que el auto pierda fuerza.",
    corto: "Humo u olor a quemado",
  },
];

export const PREGUNTAS_OTRA: Pregunta[] = [
  {
    id: "humo_fuga",
    texto: "¿Sale humo, hay olor a quemado o ves líquido debajo del auto?",
    ayuda: "Mira desde afuera y no te acerques al motor si hay humo.",
    corto: "Humo, olor o fuga",
  },
  {
    id: "frenos",
    texto: "¿El auto pierde fuerza o los frenos se sienten raros?",
    ayuda: "Por ejemplo, el pedal se hunde o el auto no frena como siempre.",
    corto: "Frenos o fuerza",
  },
  LUGAR_SEGURO,
];

export function triajeSimulado(solicitud: SolicitudTriaje): RespuestaTriaje {
  const conFoto = Boolean(solicitud.foto);
  const conTexto = solicitud.descripcion.trim().length > 0;

  if (solicitud.foto && !solicitud.foto.startsWith("data:image/")) {
    return { tipo: "foto_error" };
  }

  const falla = adivinarFalla(solicitud.falla, solicitud.descripcion, conFoto);

  // Una falla grave descrita con palabras no necesita preguntas: va a la grúa.
  const grave = gravedadDeTexto(solicitud.descripcion);
  if (grave) {
    const detalle = mayuscula(origen({ conFoto, conTexto, conRespuestas: false }));
    return { tipo: "diagnostico", ...diagnosticoGrave(grave.titulo, detalle, grave.causa) };
  }

  const respuestas = new Map<string, Respuesta>(
    (solicitud.respuestas ?? []).map((r) => [r.id, r.respuesta]),
  );
  const sinRespuestas = !solicitud.respuestas;
  const detalle = mayuscula(origen({ conFoto, conTexto, conRespuestas: true }));
  const resp = (id: string): Respuesta => respuestas.get(id) ?? "No sé";

  if (falla === "llanta") {
    if (sinRespuestas) return { tipo: "preguntas", preguntas: PREGUNTAS_LLANTA };
    return {
      tipo: "diagnostico",
      ...diagnosticoLlanta({ repuesto: resp("repuesto"), gata: resp("gata"), conFoto, conTexto }),
    };
  }

  if (falla === "bateria") {
    if (sinRespuestas) return { tipo: "preguntas", preguntas: PREGUNTAS_BATERIA };
    return {
      tipo: "diagnostico",
      ...diagnosticoBateria(detalle, {
        lugar: resp("lugar_seguro"),
        humo: resp("humo"),
        cables: resp("cables"),
        otroAuto: resp("otro_auto"),
      }),
    };
  }

  if (falla === "luz_tablero") {
    if (sinRespuestas) return { tipo: "preguntas", preguntas: PREGUNTAS_LUZ };
    return {
      tipo: "diagnostico",
      ...diagnosticoTablero(detalle, {
        roja: resp("luz_roja"),
        aceiteTemp: resp("luz_aceite_temp"),
        humo: resp("humo"),
      }),
    };
  }

  if (sinRespuestas) return { tipo: "preguntas", preguntas: PREGUNTAS_OTRA };
  if (resp("humo_fuga") === "Sí" || resp("frenos") === "Sí") {
    return {
      tipo: "diagnostico",
      ...diagnosticoGrave(
        "Falla grave en el auto",
        detalle,
        "Humo, fuga o frenos con problemas según las respuestas",
      ),
    };
  }
  return { tipo: "diagnostico", ...diagnosticoInseguro(conFoto, conTexto) };
}

/** Palabras que delatan una falla de riesgo: no se intenta arreglar, se pide grúa. */
function gravedadDeTexto(descripcion: string): { titulo: string; causa: string } | null {
  const texto = descripcion.toLowerCase();
  if (/humo|incendi|fuego|quemad|chispa/.test(texto)) {
    return { titulo: "Humo u olor a quemado", causa: "Humo, fuego u olor a quemado en el auto" };
  }
  if (/choqu|choc[oó]|accident|volc/.test(texto)) {
    return { titulo: "Auto golpeado", causa: "Choque o golpe fuerte al auto" };
  }
  if (/fren/.test(texto)) {
    return { titulo: "Problema con los frenos", causa: "Posible falla de frenos" };
  }
  if (/fuga|gotea|derram/.test(texto)) {
    return { titulo: "Fuga de líquido", causa: "Fuga de líquido bajo el auto" };
  }
  if (/sobrecalent|recalent|hirvi/.test(texto)) {
    return { titulo: "Motor muy caliente", causa: "Motor sobrecalentado" };
  }
  return null;
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

// --- Batería, luz en el tablero y fallas graves (el diseño no las cubre) ---

function diagnosticoBateria(
  detalle: string,
  r: { lugar: Respuesta; humo: Respuesta; cables: Respuesta; otroAuto: Respuesta },
): Resultado {
  if (r.humo === "Sí") {
    return diagnosticoGrave(
      "Batería con riesgo",
      detalle,
      "Batería con humo, olor a quemado o hinchada. No se debe tocar",
    );
  }

  const puedeSola = r.lugar === "Sí" && r.humo === "No" && r.cables === "Sí" && r.otroAuto === "Sí";
  let motivo: string;
  let extra: string;
  if (puedeSola) {
    motivo =
      "Tienes cables y otro auto que te ayude. Te guiamos paso a paso para pasarle corriente a tu batería.";
    extra = "Tiene cables y otro auto que la ayude.";
  } else if (r.lugar !== "Sí") {
    motivo =
      "Si no estás en un lugar seguro, mejor que te ayude un mecánico verificado. Llega con lo necesario.";
    extra = "No está en un lugar seguro.";
  } else if (r.cables !== "Sí") {
    motivo =
      "Sin cables pasacorriente no podrás hacerlo tú. Un mecánico verificado llega con cables y te pasa corriente.";
    extra = "No tiene cables pasacorriente.";
  } else {
    motivo =
      "Sin otro auto no se puede pasar corriente. Un mecánico verificado llega con una batería de apoyo.";
    extra = "No tiene otro auto que la ayude.";
  }

  return {
    diagnostico: {
      nivel: puedeSola ? 1 : 2,
      semaforo: "ambar",
      falla: "bateria",
      titulo: "Batería descargada",
      queHacer: [
        "Apaga las luces, la radio y el aire.",
        "No sigas intentando prender el auto.",
        puedeSola
          ? "Ten a la mano los cables y el otro auto."
          : "Espera en el auto con los seguros puestos.",
      ],
      resumen: `Batería descargada, el auto no prende. Conductora en ${USUARIO.ubicacion}. ${extra}`,
      seguro: true,
    },
    notas: { detalle, motivo, posibles: [] },
  };
}

function diagnosticoTablero(
  detalle: string,
  r: { roja: Respuesta; aceiteTemp: Respuesta; humo: Respuesta },
): Resultado {
  if (r.humo === "Sí") {
    return diagnosticoGrave(
      "Luz de aviso con humo",
      detalle,
      "Luz de aviso en el tablero con humo, olor a quemado o ruidos raros",
    );
  }

  if (r.roja === "Sí" && r.aceiteTemp === "Sí") {
    return {
      diagnostico: {
        nivel: 3,
        semaforo: "rojo",
        falla: "luz_tablero",
        titulo: "Luz roja de aceite o temperatura",
        queHacer: [
          "Detente en un lugar seguro y apaga el motor.",
          "No sigas manejando: el motor se puede dañar.",
          "No abras el radiador ni la tapa del aceite en caliente.",
        ],
        resumen: `Luz roja de aceite o temperatura en el tablero. Conductora en ${USUARIO.ubicacion}. No debe manejar.`,
        seguro: true,
      },
      notas: {
        detalle,
        motivo:
          "Seguir manejando con esta luz puede arruinar el motor. Una grúa lleva tu auto a un taller sin riesgo.",
        posibles: [],
      },
    };
  }

  if (r.roja === "Sí") {
    return {
      diagnostico: {
        nivel: 2,
        semaforo: "rojo",
        falla: "luz_tablero",
        titulo: "Luz roja en el tablero",
        queHacer: [
          "Detente en un lugar seguro y apaga el motor.",
          "No sigas manejando hasta saber qué es.",
          "Deja las luces de emergencia prendidas.",
        ],
        resumen: `Luz roja en el tablero. Conductora en ${USUARIO.ubicacion}. No debe manejar hasta revisarlo.`,
        seguro: true,
      },
      notas: {
        detalle,
        motivo: "Una luz roja pide revisión. Un mecánico verificado puede leer el aviso donde estás.",
        posibles: [],
      },
    };
  }

  if (r.roja === "No" && r.aceiteTemp === "No" && r.humo === "No") {
    return {
      diagnostico: {
        nivel: 1,
        semaforo: "ambar",
        falla: "luz_tablero",
        titulo: "Luz informativa en el tablero",
        queHacer: [
          "Estaciona en un lugar seguro para revisar.",
          "Fíjate en el color y el dibujo de la luz.",
          "Sigue la guía para revisar lo más simple.",
        ],
        resumen: `Luz de aviso en el tablero, no es roja y no hay humo. Conductora en ${USUARIO.ubicacion}.`,
        seguro: true,
      },
      notas: {
        detalle,
        motivo: "La luz no es roja y no hay humo. Te guiamos para revisar lo más simple.",
        posibles: [],
      },
    };
  }

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

/** Falla de riesgo: Nivel 3, sin guía. No se intenta arreglar ni se sigue manejando. */
function diagnosticoGrave(titulo: string, detalle: string, causa: string): Resultado {
  return {
    diagnostico: {
      nivel: 3,
      semaforo: "rojo",
      falla: "otra",
      titulo,
      queHacer: [
        "Si ves humo o fuego, apaga el motor y aléjate del auto.",
        "Prende las luces de emergencia y no sigas manejando.",
        "No intentes arreglarlo tú. Si hay riesgo, llama al 105.",
      ],
      resumen: `${causa}. Conductora en ${USUARIO.ubicacion}. No es seguro manejar.`,
      seguro: true,
    },
    notas: {
      detalle,
      motivo:
        "Con una falla así no es seguro arreglarlo ni manejar. Una grúa lleva tu auto a un taller sin riesgo.",
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
