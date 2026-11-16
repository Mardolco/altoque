// Mecánicos de ejemplo del diseño (Mecanicos, PerfilMecanico y SinMecanicos).
// Ya vienen ordenados por "Mejor opción para ti".
//
// Contenido inventado que el equipo debe revisar: los datos de verificación
// (DNI, antecedentes y RUC) y las reseñas. Ninguno tiene teléfono: no
// inventamos números reales. Para la demo, pon aquí uno del equipo.

import type { Mecanico } from "../tipos";

export const MECANICOS: Mecanico[] = [
  {
    tipo: "mecanico",
    id: "carlos-huaman",
    nombre: "Carlos Huamán",
    iniciales: "CH",
    taller: "Mecánica Huamán",
    distrito: "Surquillo",
    verificado: true,
    calificacion: 4.8,
    resenas: 126,
    especialidad: "Llantas y frenos",
    fallas: ["llanta"],
    disponible: true,
    minutos: 8,
    disponibleDesde: null,
    precio: { min: 80, max: 150 },
    motivo: "Especialista en llantas y el más cercano",
    telefono: null,
    perfil: {
      especialidades: ["Llantas", "Frenos"],
      verificaciones: [
        "DNI validado",
        "Antecedentes policiales revisados",
        "Taller con RUC activo",
      ],
      notaPrecio: "El precio final lo acuerdas con Carlos antes de empezar.",
      resenas: [
        {
          autor: "Mariana R.",
          iniciales: "MR",
          hace: "Hace 2 días",
          estrellas: 5,
          texto: "Llegó rápido y me explicó todo antes de empezar. Cobró lo que dijo.",
        },
        {
          autor: "Luis P.",
          iniciales: "LP",
          hace: "Hace 1 semana",
          estrellas: 4,
          texto:
            "Me cambió la llanta en plena Javier Prado. Tardó un poco más de lo que dijo, pero fue muy amable.",
        },
      ],
    },
  },
  {
    // Sin perfil: en el diseño su tarjeta no lleva a ninguna parte.
    tipo: "mecanico",
    id: "taller-el-rapido",
    nombre: "Taller El Rápido",
    iniciales: "ER",
    taller: "Taller",
    distrito: "San Borja",
    verificado: true,
    calificacion: 4.6,
    resenas: 89,
    especialidad: "Batería y electricidad",
    fallas: ["bateria", "luz_tablero"],
    disponible: true,
    minutos: 12,
    disponibleDesde: null,
    precio: { min: 60, max: 120 },
    motivo: null,
    telefono: null,
    perfil: null,
  },
  {
    // Ocupado: no tiene precio y su tarjeta muestra la hora en que se libera.
    tipo: "mecanico",
    id: "jorge-quispe",
    nombre: "Jorge Quispe",
    iniciales: "JQ",
    taller: "Mecánico móvil",
    distrito: "San Isidro", // por dónde está su pin en el mapa del diseño
    verificado: true,
    calificacion: 4.9,
    resenas: 41,
    especialidad: "Llantas",
    fallas: ["llanta"],
    disponible: false,
    minutos: null,
    disponibleDesde: "9:30 p. m.",
    precio: null,
    motivo: null,
    telefono: null,
    perfil: null,
  },
];

export function buscarMecanico(id: string): Mecanico | null {
  return MECANICOS.find((mecanico) => mecanico.id === id) ?? null;
}

/** El mecánico del guion de la demo, el único con perfil. */
export const MECANICO_DEMO = MECANICOS[0];
