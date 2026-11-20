// ---------------------------------------------------------------------------
// Contrato compartido. Es el mismo que está en CLAUDE.md: si cambia aquí,
// cambia allá y se avisa al equipo.
// ---------------------------------------------------------------------------

export type Falla = "llanta" | "bateria" | "luz_tablero" | "otra";
export type Nivel = 1 | 2 | 3;
export type Semaforo = "verde" | "ambar" | "rojo";

export type Diagnostico = {
  nivel: Nivel; // camino recomendado
  semaforo: Semaforo; // ¿puede seguir manejando?
  falla: Falla;
  titulo: string; // "Llanta pinchada"
  queHacer: string[]; // 2 o 3 viñetas
  resumen: string; // lo que recibe el mecánico o la grúa
  seguro: boolean; // false: la IA no está segura y se deriva al Nivel 2
};

// ---------------------------------------------------------------------------
// Triaje: lo que va y viene de /api/triaje y lo que guarda el flujo.
// ---------------------------------------------------------------------------

export type Respuesta = "Sí" | "No" | "No sé";

export type Pregunta = {
  id: string; // "repuesto"
  texto: string; // "¿Tienes llanta de repuesto?"
  ayuda: string; // explicación en una frase
  corto: string; // "Llanta de repuesto", para el resumen
  avisoSiNo?: string; // consejo que se muestra si la respuesta no es "Sí"
};

/** Textos de apoyo del diagnóstico que solo usan las pantallas de triaje. */
export type NotasDiagnostico = {
  detalle: string; // "Delantera derecha · según tu foto y respuestas"
  motivo: string; // por qué se recomienda ese nivel
  posibles: string[]; // si la IA no está segura: qué fallas podrían ser
};

export type SolicitudTriaje = {
  falla: Falla | null;
  foto: string | null; // data URL JPEG ya reducida con lib/imagen.ts
  descripcion: string;
  respuestas?: { id: string; respuesta: Respuesta }[]; // solo en la segunda llamada
};

export type RespuestaTriaje =
  | { tipo: "preguntas"; preguntas: Pregunta[] }
  | { tipo: "diagnostico"; diagnostico: Diagnostico; notas: NotasDiagnostico }
  | { tipo: "foto_error" };

/** Lo que useFlujo() guarda en sessionStorage. */
export type EstadoFlujo = {
  falla: Falla | null; // chip elegido en "Cuéntanos qué pasó"
  foto: string | null; // data URL JPEG ya reducida
  descripcion: string;
  preguntas: Pregunta[]; // las que pidió /api/triaje
  respuestas: Respuesta[]; // en el mismo orden que preguntas
  diagnostico: Diagnostico | null;
  notas: NotasDiagnostico | null;
};

// ---------------------------------------------------------------------------
// Proveedores de ejemplo (lib/mock).
// ---------------------------------------------------------------------------

export type RangoPrecio = { min: number; max: number }; // en soles, siempre "referencial"

export type Resena = {
  autor: string;
  iniciales: string;
  hace: string; // "Hace 2 días"
  estrellas: number; // de 1 a 5
  texto: string;
};

export type MedioDePago = "Yape" | "Plin" | "Tarjeta" | "Efectivo";

type ProveedorBase = {
  id: string;
  nombre: string;
  verificado: boolean;
  disponible: boolean;
  minutos: number | null; // cuánto tarda en llegar; null si está ocupado
  disponibleDesde: string | null; // "9:30 p. m." si está ocupado
  precio: RangoPrecio | null;
  motivo: string | null; // por qué es la mejor opción
  telefono: string | null; // para tel: y wa.me; null mientras no haya un número de demo
  pagos: MedioDePago[]; // cómo se le puede pagar
  respondio: string; // "Hace 1 min": respuesta simulada a la consulta por WhatsApp
};

export type Mecanico = ProveedorBase & {
  tipo: "mecanico";
  iniciales: string;
  taller: string; // "Mecánica Huamán"
  distrito: string;
  calificacion: number;
  resenas: number;
  atencion: "movil" | "taller" | "ambos"; // va hasta el auto, atiende en taller o ambos
  distanciaKm: number; // desde la ubicación del usuario
  especialidad: string; // "Llantas y frenos"
  fallas: Falla[]; // fallas que atiende, para ordenar por especialidad
  perfil: {
    especialidades: string[];
    verificaciones: string[];
    notaPrecio: string;
    resenas: Resena[];
  } | null;
};

export type Grua = ProveedorBase & {
  tipo: "grua";
  clase: string; // "Plataforma"
  descripcion: string; // "Grúa de plataforma"
  modalidad: "arrastre" | "plataforma"; // arrastre solo sirve si las ruedas giran libres
  alturaM: number; // alto de la grúa, para estacionamientos techados
  conductor: string; // quien maneja
  iniciales: string; // del avatar
  placa: string;
  calificacion: number;
  traslados: number; // traslados hechos
  kmIncluidos: number; // la tarifa cubre hasta estos km
};

export type Proveedor = Mecanico | Grua;
