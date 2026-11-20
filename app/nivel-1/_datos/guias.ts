import type { Falla } from "@/lib/tipos";
import { GUIA_BATERIA } from "./bateria";
import { GUIA_LLANTA } from "./llanta";
import { GUIA_LUZ_TABLERO } from "./luz-tablero";
import type { GuiaNivel1 } from "./tipos";

/** Guía del Nivel 1 para una falla. "Otra" no tiene guía: va a un mecánico o grúa. */
export function guiaDe(falla: Falla): GuiaNivel1 | null {
  if (falla === "llanta") return GUIA_LLANTA;
  if (falla === "bateria") return GUIA_BATERIA;
  if (falla === "luz_tablero") return GUIA_LUZ_TABLERO;
  return null;
}

/** Consejos del cierre. Sin guía, unos generales. */
export const PREVENCION_GENERAL = [
  "Haz revisar el auto en un taller esta semana, aunque ya ande bien.",
  "Cada mes mira la presión de las llantas, el aceite y el agua del radiador.",
  "Guarda el manual del auto en la guantera.",
];
