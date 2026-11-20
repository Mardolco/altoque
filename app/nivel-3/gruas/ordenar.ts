// Compatibilidad y orden de las grúas para el caso del usuario.
//
// Compatibilidad: con las ruedas trabadas o dañadas no sirve una grúa de
// arrastre (hace falta plataforma o cama baja), y en un estacionamiento
// techado la grúa tiene que caber bajo la altura máxima.
// Orden: disponibles y compatibles primero y, entre ellas, una mezcla de
// minutos de espera, calificación y plataforma (cuida más el auto).

import { GRUAS } from "@/lib/mock/gruas";
import type { Grua } from "@/lib/tipos";
import type { Seleccion } from "../../nivel-2/_compartido/seleccion";

type Caso = Pick<Seleccion, "acceso" | "altura" | "ruedas">;

export const MAXIMO_GRUAS = 5;

/** Motivo por el que una grúa no sirve, o null si es compatible. */
export function incompatibilidad(grua: Grua, caso: Caso): string | null {
  if (caso.ruedas === "trabadas" && grua.modalidad === "arrastre") {
    return "No sirve con ruedas trabadas: necesita plataforma";
  }
  if (caso.acceso === "techado") {
    const limite = caso.altura === "alta" ? 2.4 : 1.9;
    if (grua.alturaM > limite) return "No entra a estacionamientos bajos";
  }
  return null;
}

function puntaje(grua: Grua, caso: Caso): number {
  if (!grua.disponible) return 0;
  const base = incompatibilidad(grua, caso) ? 500 : 1000;
  const plataforma = grua.modalidad === "plataforma" ? 15 : 0;
  return base + plataforma + grua.calificacion * 5 - (grua.minutos ?? 60) * 3;
}

export function gruasPara(caso: Caso): Grua[] {
  return [...GRUAS].sort((a, b) => puntaje(b, caso) - puntaje(a, caso)).slice(0, MAXIMO_GRUAS);
}

/** Por qué se recomienda esta grúa. */
export function motivoDe(grua: Grua, caso: Caso): string {
  if (caso.acceso === "techado") return "Cabe en tu estacionamiento y llega pronto";
  if (caso.ruedas === "trabadas") return "Plataforma: sube tu auto completo, sin arrastrarlo";
  return grua.motivo ?? "Llega pronto y es compatible con tu caso";
}

/** Resumen del caso para enviarlo a la grúa. */
export function casoEnTexto(caso: Caso): string {
  const lugar =
    caso.acceso === "techado"
      ? `El auto está en un estacionamiento techado (altura máxima ${caso.altura === "alta" ? "2 m o más" : "menos de 2 m"}).`
      : "El auto está en vía abierta.";
  const ruedas =
    caso.ruedas === "trabadas" ? "Las ruedas están trabadas o dañadas." : "Las ruedas giran libres.";
  return `${lugar} ${ruedas}`;
}
