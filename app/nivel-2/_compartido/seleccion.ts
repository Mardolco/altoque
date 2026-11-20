"use client";

// Lo que el usuario elige en los niveles 2 y 3 (ubicación, filtros, proveedor
// y destino). Se guarda en sessionStorage, como el flujo, para no perderlo al
// recargar. Lo usan los dos niveles.

import { useSyncExternalStore } from "react";

export type Seleccion = {
  referencia: string; // "frente al grifo", escrito por el usuario
  movible: boolean | null; // Nivel 2: ¿el auto se puede mover?
  acceso: "abierta" | "techado" | null; // Nivel 3: vía abierta o estacionamiento techado
  altura: "baja" | "alta" | null; // Nivel 3: altura máxima del estacionamiento
  ruedas: "libres" | "trabadas" | null; // Nivel 3: ¿las ruedas giran?
  mecanicoId: string | null;
  gruaId: string | null;
  destino: { nombre: string; direccion: string } | null; // Nivel 3
  volverALista: boolean; // true: al volver de un perfil, abre la lista y no los datos
};

const INICIAL: Seleccion = {
  referencia: "",
  movible: null,
  acceso: null,
  altura: null,
  ruedas: null,
  mecanicoId: null,
  gruaId: null,
  destino: null,
  volverALista: false,
};

const CLAVE = "altoque.seleccion.v1";
let memoria: Seleccion | null = null;
const oyentes = new Set<() => void>();

function leer(): Seleccion {
  if (memoria) return memoria;
  let leido = INICIAL;
  try {
    const crudo = window.sessionStorage.getItem(CLAVE);
    if (crudo) leido = { ...INICIAL, ...JSON.parse(crudo) };
  } catch {
    // Sin sessionStorage la selección sigue en memoria.
  }
  memoria = leido;
  return leido;
}

/** Estado actual, para manejadores y efectos. En el render usa useSeleccion(). */
export function leerSeleccion(): Seleccion {
  return leer();
}

export function fijarSeleccion(cambios: Partial<Seleccion>) {
  const siguiente = { ...leer(), ...cambios };
  memoria = siguiente;
  try {
    window.sessionStorage.setItem(CLAVE, JSON.stringify(siguiente));
  } catch {
    // Nada que hacer: sigue en memoria.
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}

export function useSeleccion(): Seleccion {
  return useSyncExternalStore(suscribir, leer, () => INICIAL);
}

/** Ubicación simulada por GPS de la demo. */
export const GPS = {
  texto: "Av. Javier Prado Este, San Borja",
  mapa: "https://maps.google.com/?q=-12.0912,-77.0011",
};

/** Texto de ubicación que se envía al proveedor. */
export function ubicacionEnviada(referencia: string): string {
  const ref = referencia.trim();
  return `${GPS.texto}${ref ? `, ${ref}` : ""}. Mapa: ${GPS.mapa}`;
}
