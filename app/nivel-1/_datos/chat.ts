// Chat simulado del Nivel 1. Busca palabras clave en lo que escribe el
// usuario, primero las de riesgo, luego las del paso, las de la falla y las
// generales. Si nada coincide, ofrece un mecánico.

import type { Derivacion, GuiaNivel1, ReglaChat } from "./tipos";

export type RespuestaChat = { texto: string; derivar?: Derivacion };

/** Riesgo: la IA no sigue con la guía, recomienda grúa. */
const RIESGO: ReglaChat = {
  claves: [
    "humo",
    "fuego",
    "incendio",
    "quemado",
    "chispas",
    "explot",
    "fuga",
    "choque",
    "choqu",
    "no frena",
    "sin freno",
    "frenos no",
    "falla el freno",
    "sobrecalent",
  ],
  texto:
    "Detente. Si hay humo, fuego o frenos con problemas, no es seguro seguir. Aléjate del auto, no intentes arreglarlo y, si hay riesgo, llama al 105. Lo más seguro es pedir una grúa.",
  derivar: "grua",
};

const GENERALES: ReglaChat[] = [
  {
    claves: ["grua", "remolque", "remolcar"],
    texto:
      "Si el auto no se puede mover o no te sientes seguro, una grúa lo lleva a un taller. Puedes pedirla cuando quieras.",
    derivar: "grua",
  },
  {
    claves: ["mecanico", "no puedo", "no quiero", "no me animo", "miedo", "no se como", "prefiero", "ayuda"],
    texto:
      "Está bien pedir ayuda, no tienes que hacerlo por tu cuenta. Un mecánico verificado puede llegar hasta donde estás.",
    derivar: "mecanico",
  },
  {
    claves: ["cuanto cuesta", "precio", "cuanto cobra", "cuanto sale"],
    texto:
      "Los precios son referenciales y los ves antes de pedir ayuda. Si resuelves esto tú, no pagas nada.",
  },
  {
    claves: ["cuanto demora", "cuanto me demoro", "cuanto dura"],
    texto: "Con calma, esta guía toma entre 20 y 30 minutos. No tienes que apurarte.",
  },
  {
    claves: ["gracias", "entendi", "perfecto"],
    texto: "¡De nada! Sigue con la guía cuando quieras. Aquí estoy si te surge otra duda.",
  },
];

const FALLBACK: RespuestaChat = {
  texto:
    "No tengo claro cómo ayudarte con eso y no quiero que te arriesgues. Si quieres, un mecánico verificado puede verlo contigo.",
  derivar: "mecanico",
};

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function coincide(regla: ReglaChat, texto: string): boolean {
  if (regla.pregunta && normalizar(regla.pregunta) === texto) return true;
  return regla.claves.some((clave) => texto.includes(clave));
}

/** Respuestas rápidas del paso actual (índice 0: antes de empezar). */
export function sugerenciasDe(guia: GuiaNivel1, paso: number): string[] {
  const reglas = [...(guia.chat.porPaso[paso] ?? []), ...guia.chat.generales];
  return reglas.flatMap((r) => (r.pregunta ? [r.pregunta] : []));
}

export function responderChat(guia: GuiaNivel1, paso: number, mensaje: string): RespuestaChat {
  const texto = normalizar(mensaje);
  if (!texto) return FALLBACK;

  // Una pregunta de la guía manda sobre las palabras de riesgo: "freno de mano" no es una falla.
  const reglas = [...(guia.chat.porPaso[paso] ?? []), ...guia.chat.generales];
  const exacta = reglas.find((r) => r.pregunta && normalizar(r.pregunta) === texto);
  if (exacta) return { texto: exacta.texto, derivar: exacta.derivar };

  if (coincide(RIESGO, texto)) return { texto: RIESGO.texto, derivar: RIESGO.derivar };

  const regla = [...reglas, ...GENERALES].find((r) => coincide(r, texto));
  return regla ? { texto: regla.texto, derivar: regla.derivar } : FALLBACK;
}
