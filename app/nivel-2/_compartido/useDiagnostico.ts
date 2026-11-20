"use client";

import { useFlujo } from "@/lib/flujo";
import { DIAGNOSTICO_DEMO } from "@/lib/mock/triaje";

/** Diagnóstico del flujo; sin triaje previo (ruta abierta directo) usa el ejemplo del diseño. */
export function useDiagnostico() {
  const flujo = useFlujo();
  const real = flujo.diagnostico !== null;
  return {
    cargado: flujo.cargado,
    diagnostico: flujo.diagnostico ?? DIAGNOSTICO_DEMO.diagnostico,
    foto: real ? flujo.foto : null,
  };
}
