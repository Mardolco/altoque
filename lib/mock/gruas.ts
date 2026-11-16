// Grúas de ejemplo del diseño (Gruas, EsperandoGrua y SinMecanicos).
// Sin teléfono: no inventamos números reales.

import type { Grua } from "../tipos";

export const GRUAS: Grua[] = [
  {
    tipo: "grua",
    id: "gruas-lima-sur",
    nombre: "Grúas Lima Sur",
    clase: "Plataforma",
    descripcion: "Grúa de plataforma",
    verificado: true,
    disponible: true,
    minutos: 20,
    disponibleDesde: null,
    precio: { min: 180, max: 280 },
    motivo: "Plataforma: sube tu auto completo, sin arrastrarlo.",
    telefono: null,
  },
];

/** La grúa del guion de la demo. */
export const GRUA_DEMO = GRUAS[0];
