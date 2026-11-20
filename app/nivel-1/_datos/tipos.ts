// Tipos de los guiones del Nivel 1. Todo el contenido es simulado: la IA son
// guiones con palabras clave, sin llamadas a ningún modelo.

export type FallaConGuia = "llanta" | "bateria" | "luz_tablero";

export type IdIlustracion =
  | "llanta-calzar"
  | "llanta-aflojar"
  | "llanta-gata"
  | "llanta-levantar"
  | "llanta-repuesto"
  | "llanta-cruz"
  | "llanta-presion"
  | "bateria-autos"
  | "bateria-bornes"
  | "bateria-rojo"
  | "bateria-negro"
  | "bateria-espera"
  | "bateria-arranque"
  | "bateria-retirar"
  | "tablero-colores"
  | "tablero-revisar"
  | "tablero-reiniciar"
  | "tablero-taller";

export type Paso = {
  titulo: string;
  herramientas: string[]; // "Qué necesitas"; vacío si no hace falta nada
  indicaciones: string[]; // hasta 3
  noHacer: string[];
  alerta?: string; // advertencia de seguridad de este paso
  ilustracion: IdIlustracion;
  validacion: string; // lo que "ve" la IA cuando el usuario manda una foto de este paso
};

export type Derivacion = "mecanico" | "grua";

/** Una respuesta del chat. `pregunta` la vuelve una respuesta rápida. */
export type ReglaChat = {
  pregunta?: string;
  claves: string[]; // en minúsculas y sin tildes
  texto: string;
  derivar?: Derivacion;
};

export type GuiaNivel1 = {
  falla: FallaConGuia;
  titulo: string; // "Cambia la llanta"
  diagnostico: string; // "Parece una llanta pinchada"
  confianza: number; // 0 a 100
  seguridad: string[]; // alerta antes de empezar
  necesitas: string[];
  pasos: Paso[];
  prevencion: string[]; // consejos del cierre
  chat: {
    // Índice 0: antes de empezar. Índice n: paso n.
    porPaso: ReglaChat[][];
    generales: ReglaChat[];
  };
};
