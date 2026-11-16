"use client";

// Estado del flujo: falla elegida, foto, descripción, preguntas, respuestas y
// diagnóstico. Vive en un contexto de React y se guarda en sessionStorage para
// no perderlo si se recarga la página durante la demo.
//
// Cada pantalla lo lee con useFlujo(). No vuelvas a pedirle esos datos al usuario.

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type {
  Diagnostico,
  EstadoFlujo,
  Falla,
  NotasDiagnostico,
  Pregunta,
  Respuesta,
} from "./tipos";

const CLAVE = "altoque.flujo.v1";

const ESTADO_INICIAL: EstadoFlujo = {
  falla: null,
  foto: null,
  descripcion: "",
  preguntas: [],
  respuestas: [],
  diagnostico: null,
  notas: null,
};

// --- Almacén: una copia en memoria que se refleja en sessionStorage ---------

let memoria: EstadoFlujo | null = null; // null: todavía no se leyó sessionStorage
const oyentes = new Set<() => void>();

/** Estado actual. Úsalo en manejadores y efectos; en el render usa useFlujo(). */
export function leerFlujo(): EstadoFlujo {
  if (memoria !== null) return memoria;

  let leido = ESTADO_INICIAL;
  try {
    const crudo = window.sessionStorage.getItem(CLAVE);
    if (crudo) leido = { ...ESTADO_INICIAL, ...JSON.parse(crudo) };
  } catch {
    // Sin sessionStorage (modo privado estricto) el flujo sigue en memoria.
  }
  memoria = leido;
  return leido;
}

function escribir(siguiente: EstadoFlujo) {
  memoria = siguiente;
  try {
    window.sessionStorage.setItem(CLAVE, JSON.stringify(siguiente));
  } catch {
    // Si la foto no entra en sessionStorage, se guarda el resto: al recargar
    // se pierde solo la foto.
    try {
      window.sessionStorage.setItem(CLAVE, JSON.stringify({ ...siguiente, foto: null }));
    } catch {
      // Nada que hacer: el flujo sigue en memoria.
    }
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}

// --- Acciones ---------------------------------------------------------------

const acciones = {
  /** Borra todo y arranca un reporte nuevo, con la falla ya elegida si se pasa. */
  empezar(falla: Falla | null = null) {
    escribir({ ...ESTADO_INICIAL, falla });
  },

  /** Cambia lo que cuenta el usuario. El análisis anterior deja de valer. */
  editar(cambios: Partial<Pick<EstadoFlujo, "falla" | "foto" | "descripcion">>) {
    escribir({
      ...leerFlujo(),
      ...cambios,
      preguntas: [],
      respuestas: [],
      diagnostico: null,
      notas: null,
    });
  },

  /** Guarda las preguntas que pidió /api/triaje y empieza a responder de cero. */
  guardarPreguntas(preguntas: Pregunta[]) {
    escribir({ ...leerFlujo(), preguntas, respuestas: [], diagnostico: null, notas: null });
  },

  /** Guarda las respuestas (mismo orden que las preguntas). */
  guardarRespuestas(respuestas: Respuesta[]) {
    escribir({ ...leerFlujo(), respuestas, diagnostico: null, notas: null });
  },

  guardarDiagnostico(diagnostico: Diagnostico, notas: NotasDiagnostico) {
    escribir({ ...leerFlujo(), diagnostico, notas });
  },
};

// --- Contexto ---------------------------------------------------------------

export type Flujo = EstadoFlujo &
  typeof acciones & {
    /**
     * false mientras el navegador todavía no leyó sessionStorage (primer
     * render tras recargar). Espera a que sea true antes de decidir algo con
     * el estado, por ejemplo redirigir porque "no hay diagnóstico".
     */
    cargado: boolean;
  };

const FlujoContext = createContext<Flujo | null>(null);

const leerEnServidor = () => ESTADO_INICIAL;
const siempreCargado = () => true;
const nuncaCargado = () => false;

export function FlujoProvider({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(suscribir, leerFlujo, leerEnServidor);
  const cargado = useSyncExternalStore(suscribir, siempreCargado, nuncaCargado);
  const valor = useMemo<Flujo>(() => ({ ...estado, ...acciones, cargado }), [estado, cargado]);

  return <FlujoContext value={valor}>{children}</FlujoContext>;
}

export function useFlujo(): Flujo {
  const flujo = useContext(FlujoContext);
  if (!flujo) throw new Error("useFlujo() necesita <FlujoProvider>, que está en app/layout.tsx.");
  return flujo;
}
