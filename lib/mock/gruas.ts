// Grúas de ejemplo. Grúas Lima Sur es la del guion de la demo (Gruas,
// EsperandoGrua y SinMecanicos del diseño); las otras cuatro son inventadas.
//
// Contenido inventado que el equipo debe revisar: placas, conductores,
// tarifas, distancias y los talleres sugeridos. Sin teléfono: no inventamos
// números reales. La lista se ordena en la pantalla, no aquí.

import type { Falla, Grua, MedioDePago } from "../tipos";

const TODOS: MedioDePago[] = ["Yape", "Plin", "Tarjeta", "Efectivo"];

export const GRUAS: Grua[] = [
  {
    tipo: "grua",
    id: "gruas-lima-sur",
    nombre: "Grúas Lima Sur",
    clase: "Plataforma",
    descripcion: "Grúa de plataforma",
    modalidad: "plataforma",
    alturaM: 2.4,
    conductor: "Raúl Mendoza",
    iniciales: "RM",
    placa: "BQX-482",
    calificacion: 4.9,
    traslados: 120,
    kmIncluidos: 10,
    verificado: true,
    disponible: true,
    minutos: 12,
    disponibleDesde: null,
    precio: { min: 180, max: 280 },
    motivo: "Plataforma: sube tu auto completo, sin arrastrarlo.",
    telefono: null,
    pagos: TODOS,
    respondio: "Respondió hace 1 min",
  },
  {
    tipo: "grua",
    id: "auxilio-rapido-lima",
    nombre: "Auxilio Rápido Lima",
    clase: "Arrastre",
    descripcion: "Grúa de arrastre",
    modalidad: "arrastre",
    alturaM: 2.6,
    conductor: "Hugo Paredes",
    iniciales: "HP",
    placa: "AXD-731",
    calificacion: 4.8,
    traslados: 96,
    kmIncluidos: 10,
    verificado: true,
    disponible: true,
    minutos: 9,
    disponibleDesde: null,
    precio: { min: 120, max: 160 },
    motivo: null,
    telefono: null,
    pagos: ["Yape", "Plin", "Efectivo"],
    respondio: "Respondió hace 2 min",
  },
  {
    tipo: "grua",
    id: "gruas-san-borja",
    nombre: "Grúas San Borja",
    clase: "Cama baja",
    descripcion: "Grúa de cama baja compacta",
    modalidad: "plataforma",
    alturaM: 1.8,
    conductor: "Elías Ramos",
    iniciales: "ER",
    placa: "CHT-615",
    calificacion: 4.7,
    traslados: 78,
    kmIncluidos: 10,
    verificado: true,
    disponible: true,
    minutos: 16,
    disponibleDesde: null,
    precio: { min: 160, max: 240 },
    motivo: null,
    telefono: null,
    pagos: TODOS,
    respondio: "Respondió hace 1 min",
  },
  {
    // Ocupada: no tiene precio y su tarjeta muestra la hora en que se libera.
    tipo: "grua",
    id: "remolques-miraflores",
    nombre: "Remolques Miraflores",
    clase: "Arrastre",
    descripcion: "Grúa de arrastre",
    modalidad: "arrastre",
    alturaM: 2.5,
    conductor: "Walter Chávez",
    iniciales: "WC",
    placa: "BLM-209",
    calificacion: 4.6,
    traslados: 55,
    kmIncluidos: 10,
    verificado: true,
    disponible: false,
    minutos: null,
    disponibleDesde: "9:40 p. m.",
    precio: null,
    motivo: null,
    telefono: null,
    pagos: ["Yape", "Efectivo"],
    respondio: "Respondió hace 3 min: ocupada",
  },
  {
    tipo: "grua",
    id: "gruas-express-surco",
    nombre: "Grúas Express Surco",
    clase: "Plataforma",
    descripcion: "Grúa de plataforma",
    modalidad: "plataforma",
    alturaM: 2.3,
    conductor: "Martín Gil",
    iniciales: "MG",
    placa: "DFK-884",
    calificacion: 4.5,
    traslados: 40,
    kmIncluidos: 10,
    verificado: true,
    disponible: true,
    minutos: 22,
    disponibleDesde: null,
    precio: { min: 170, max: 260 },
    motivo: null,
    telefono: null,
    pagos: ["Yape", "Plin", "Tarjeta"],
    respondio: "Respondió hace 5 min",
  },
];

export function buscarGrua(id: string): Grua | null {
  return GRUAS.find((grua) => grua.id === id) ?? null;
}

/** La grúa del guion de la demo. */
export const GRUA_DEMO = GRUAS[0];

// Talleres sugeridos como destino del traslado. Inventados.
export type TallerSugerido = {
  id: string;
  nombre: string;
  direccion: string;
  distrito: string;
  atiende: Falla[]; // fallas que resuelve
  distanciaKm: number; // desde la ubicación de la demo
};

export const TALLERES_SUGERIDOS: TallerSugerido[] = [
  {
    id: "mecanica-huaman",
    nombre: "Mecánica Huamán",
    direccion: "Av. Angamos Este 1420",
    distrito: "Surquillo",
    atiende: ["llanta", "otra"],
    distanciaKm: 2.1,
  },
  {
    id: "electricidad-el-rapido",
    nombre: "Taller El Rápido",
    direccion: "Av. San Luis 2310",
    distrito: "San Borja",
    atiende: ["bateria", "luz_tablero"],
    distanciaKm: 3.4,
  },
  {
    id: "diagnostico-salazar",
    nombre: "Taller Salazar",
    direccion: "Calle Los Sauces 245",
    distrito: "San Isidro",
    atiende: ["luz_tablero", "otra", "bateria"],
    distanciaKm: 4.6,
  },
  {
    id: "frenos-y-motores-lima",
    nombre: "Frenos y Motores Lima",
    direccion: "Av. Aviación 3050",
    distrito: "San Borja",
    atiende: ["llanta", "otra", "luz_tablero"],
    distanciaKm: 5.2,
  },
];
