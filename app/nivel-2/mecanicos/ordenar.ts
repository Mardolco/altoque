// Filtra y ordena los mecánicos para el caso del usuario.
//
// Filtro: si el auto se mueve, talleres cercanos; si no, mecánicos móviles
// que van hasta él. Orden: disponibles primero y, entre ellos, una mezcla de
// especialidad que coincide con la falla, calificación y minutos de espera.

import { MECANICOS } from "@/lib/mock/mecanicos";
import type { Falla, Mecanico } from "@/lib/tipos";

export const MAXIMO_MECANICOS = 5;

function puntaje(mecanico: Mecanico, falla: Falla): number {
  if (!mecanico.disponible) return 0;
  const especialidad = mecanico.fallas.includes(falla) ? 30 : 0;
  return 1000 + especialidad + mecanico.calificacion * 8 - (mecanico.minutos ?? 60) * 1.2;
}

export function mecanicosPara(falla: Falla, movible: boolean): Mecanico[] {
  return MECANICOS.filter((m) =>
    movible ? m.atencion !== "movil" : m.atencion !== "taller",
  )
    .sort((a, b) => puntaje(b, falla) - puntaje(a, falla))
    .slice(0, MAXIMO_MECANICOS);
}
