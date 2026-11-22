// Mecánicos de ejemplo. Carlos Huamán es el del guion de la demo (Mecanicos,
// PerfilMecanico y SinMecanicos del diseño); los otros cuatro son inventados.
//
// Contenido inventado que el equipo debe revisar: los datos de verificación
// (DNI, antecedentes y RUC), las reseñas, las distancias y los tiempos.
// Ninguno tiene teléfono: no inventamos números reales. Para la demo, pon
// aquí uno del equipo. La lista se ordena en la pantalla, no aquí.

import type { Mecanico, MedioDePago } from "../tipos";

const TODOS: MedioDePago[] = ["Yape", "Plin", "Tarjeta"];

const VERIFICACIONES = [
  "DNI validado",
  "Antecedentes policiales revisados",
  "Taller con RUC activo",
];

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
    atencion: "ambos",
    distanciaKm: 2.1,
    especialidad: "Llantas y frenos",
    fallas: ["llanta"],
    disponible: true,
    minutos: 8,
    disponibleDesde: null,
    precio: { min: 80, max: 150 },
    motivo: "Especialista en llantas y el más cercano",
    telefono: null,
    pagos: TODOS,
    respondio: "Respondió hace 1 min",
    perfil: {
      especialidades: ["Llantas", "Frenos"],
      verificaciones: VERIFICACIONES,
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
    tipo: "mecanico",
    id: "taller-el-rapido",
    nombre: "Taller El Rápido",
    iniciales: "ER",
    taller: "Electricidad automotriz",
    distrito: "San Borja",
    verificado: true,
    calificacion: 4.6,
    resenas: 89,
    atencion: "taller",
    distanciaKm: 3.4,
    especialidad: "Batería y electricidad",
    fallas: ["bateria", "luz_tablero"],
    disponible: true,
    minutos: 12,
    disponibleDesde: null,
    precio: { min: 60, max: 120 },
    motivo: null,
    telefono: null,
    pagos: ["Yape", "Plin", "Tarjeta"],
    respondio: "Respondió hace 2 min",
    perfil: {
      especialidades: ["Baterías", "Electricidad", "Luces del tablero"],
      verificaciones: VERIFICACIONES,
      notaPrecio: "Te dan el precio final en el taller antes de empezar.",
      resenas: [
        {
          autor: "Andrea V.",
          iniciales: "AV",
          hace: "Hace 3 días",
          estrellas: 5,
          texto: "Revisaron mi batería en 15 minutos y me dijeron la verdad: solo estaba floja.",
        },
        {
          autor: "Diego S.",
          iniciales: "DS",
          hace: "Hace 2 semanas",
          estrellas: 4,
          texto: "Buen trato y precio justo. El taller estaba un poco lleno, pero me atendieron.",
        },
      ],
    },
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
    atencion: "movil",
    distanciaKm: 1.6,
    especialidad: "Llantas",
    fallas: ["llanta"],
    disponible: false,
    minutos: null,
    disponibleDesde: "9:30 p. m.",
    precio: null,
    motivo: null,
    telefono: null,
    pagos: ["Yape", "Plin", "Tarjeta"],
    respondio: "Respondió hace 3 min: ocupado",
    perfil: {
      especialidades: ["Llantas", "Auxilio vial"],
      verificaciones: ["DNI validado", "Antecedentes policiales revisados"],
      notaPrecio: "Ahora está ocupado. Puedes pedirle que te avise cuando se libere.",
      resenas: [
        {
          autor: "Karla T.",
          iniciales: "KT",
          hace: "Hace 4 días",
          estrellas: 5,
          texto: "Vino hasta mi casa y cambió la llanta en 20 minutos. Muy puntual.",
        },
      ],
    },
  },
  {
    tipo: "mecanico",
    id: "daniel-rios",
    nombre: "Daniel Ríos",
    iniciales: "DR",
    taller: "Auxilio vial móvil",
    distrito: "Miraflores",
    verificado: true,
    calificacion: 4.7,
    resenas: 64,
    atencion: "movil",
    distanciaKm: 3.8,
    especialidad: "Llantas y batería",
    fallas: ["llanta", "bateria"],
    disponible: true,
    minutos: 14,
    disponibleDesde: null,
    precio: { min: 70, max: 130 },
    motivo: null,
    telefono: null,
    pagos: ["Yape", "Plin", "Tarjeta"],
    respondio: "Respondió hace 1 min",
    perfil: {
      especialidades: ["Llantas", "Pase de corriente", "Cambio de batería"],
      verificaciones: ["DNI validado", "Antecedentes policiales revisados"],
      notaPrecio: "El precio final lo acuerdas con Daniel antes de empezar.",
      resenas: [
        {
          autor: "Rosa M.",
          iniciales: "RM",
          hace: "Hace 5 días",
          estrellas: 5,
          texto: "Me pasó corriente a las 10 de la noche en mi cochera. Un gran apoyo.",
        },
        {
          autor: "Pedro L.",
          iniciales: "PL",
          hace: "Hace 3 semanas",
          estrellas: 4,
          texto: "Llegó cuando dijo y cobró lo acordado. Le faltó explicar un poco más.",
        },
      ],
    },
  },
  {
    tipo: "mecanico",
    id: "taller-salazar",
    nombre: "Taller Salazar",
    iniciales: "TS",
    taller: "Diagnóstico automotriz",
    distrito: "San Isidro",
    verificado: true,
    calificacion: 4.5,
    resenas: 52,
    atencion: "taller",
    distanciaKm: 4.6,
    especialidad: "Diagnóstico y luces del tablero",
    fallas: ["luz_tablero", "otra"],
    disponible: true,
    minutos: 18,
    disponibleDesde: null,
    precio: { min: 90, max: 180 },
    motivo: null,
    telefono: null,
    pagos: TODOS,
    respondio: "Respondió hace 4 min",
    perfil: {
      especialidades: ["Escáner y diagnóstico", "Luces del tablero", "Frenos"],
      verificaciones: VERIFICACIONES,
      notaPrecio: "El diagnóstico se cobra aparte y te lo descuentan si haces la reparación ahí.",
      resenas: [
        {
          autor: "Jimena C.",
          iniciales: "JC",
          hace: "Hace 1 semana",
          estrellas: 5,
          texto: "Me explicaron qué significaba cada luz y me mostraron el reporte del escáner.",
        },
        {
          autor: "Óscar B.",
          iniciales: "OB",
          hace: "Hace 1 mes",
          estrellas: 4,
          texto: "Muy profesionales. Tardaron más de lo esperado, pero el trabajo quedó bien.",
        },
      ],
    },
  },
];

export function buscarMecanico(id: string): Mecanico | null {
  return MECANICOS.find((mecanico) => mecanico.id === id) ?? null;
}

/** El mecánico del guion de la demo. */
export const MECANICO_DEMO = MECANICOS[0];
