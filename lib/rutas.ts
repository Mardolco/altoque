// Rutas de la app, según el mapa de pantallas de design/README.md.

import type { Diagnostico, Nivel } from "./tipos";

export const RUTAS = {
  inicio: "/",
  falla: "/falla",
  analizando: "/analizando",
  preguntas: "/preguntas",
  diagnostico: "/diagnostico",
  iaNoSegura: "/ia-no-segura",
  ingresar: "/ingresar",
  fotoError: "/foto-error",

  guia: "/nivel-1/guia",
  cierreGuia: "/nivel-1/cierre",

  mecanicos: "/nivel-2/mecanicos",
  perfilMecanico: (id: string) => `/nivel-2/mecanicos/${id}`,
  esperandoMecanico: "/nivel-2/esperando",
  sinMecanicos: "/nivel-2/sin-mecanicos",
  cierreMecanico: "/nivel-2/cierre",

  gruas: "/nivel-3/gruas",
  esperandoGrua: "/nivel-3/esperando",
  cierreGrua: "/nivel-3/cierre",
} as const;

/** Primera pantalla de cada nivel. */
export const RUTA_DE_NIVEL: Record<Nivel, string> = {
  1: RUTAS.guia,
  2: RUTAS.mecanicos,
  3: RUTAS.gruas,
};

/** Pantalla que muestra un diagnóstico: la normal o "La IA no está segura". */
export function rutaDeDiagnostico(diagnostico: Diagnostico): string {
  return diagnostico.seguro ? RUTAS.diagnostico : RUTAS.iaNoSegura;
}

/** Ruta de ingreso que vuelve a `destino` al terminar. */
export function rutaDeIngreso(destino: string): string {
  return `${RUTAS.ingresar}?volver=${encodeURIComponent(destino)}`;
}
