import type { Falla } from "./tipos";

/** Las cuatro fallas del triaje, con los textos de Inicio y de los chips. */
export const FALLAS: { id: Falla; etiqueta: string; detalle: string }[] = [
  { id: "llanta", etiqueta: "Llanta", detalle: "Pinchada o baja" },
  { id: "bateria", etiqueta: "Batería", detalle: "El auto no prende" },
  { id: "luz_tablero", etiqueta: "Luz en el tablero", detalle: "Se prendió un aviso" },
  { id: "otra", etiqueta: "Otro", detalle: "Ruido, humo u otra cosa" },
];
