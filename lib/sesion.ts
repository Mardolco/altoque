"use client";

// Sesión simulada del prototipo: sin servidor, solo localStorage.
// Es una puerta de demostración, no seguridad real.
//
// useSesion() es seguro en SSR: en el servidor y en la primera pintura del
// cliente devuelve { cargada: false, sesion: null }.

import { useSyncExternalStore } from "react";
import { CUENTA_DE_PRUEBA } from "./mock/usuario";

export type Sesion = { email: string; nombre: string };

const CLAVE = "altoque.sesion.v1";
const oyentes = new Set<() => void>();
let ultimoCrudo: string | null | undefined;
let ultimaSesion: Sesion | null = null;

function leerCrudo(): string | null {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function avisar() {
  oyentes.forEach((oyente) => oyente());
}

/** Sesión actual (null si no hay). Para manejadores y efectos. */
export function leerSesion(): Sesion | null {
  if (typeof window === "undefined") return null;
  const crudo = leerCrudo();
  if (crudo === ultimoCrudo) return ultimaSesion; // misma referencia mientras no cambie
  ultimoCrudo = crudo;
  try {
    const dato = crudo ? JSON.parse(crudo) : null;
    ultimaSesion = dato && typeof dato.email === "string" ? (dato as Sesion) : null;
  } catch {
    ultimaSesion = null;
  }
  return ultimaSesion;
}

// Respaldo en memoria por si localStorage no está disponible (modo privado).
let enMemoria: Sesion | null = null;

/** Valida contra la cuenta de prueba. Devuelve false si los datos no coinciden. */
export function iniciarSesion(email: string, clave: string): boolean {
  const ok =
    email.trim().toLowerCase() === CUENTA_DE_PRUEBA.email && clave === CUENTA_DE_PRUEBA.clave;
  if (!ok) return false;
  const sesion: Sesion = { email: CUENTA_DE_PRUEBA.email, nombre: CUENTA_DE_PRUEBA.nombre };
  enMemoria = sesion;
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    // Sin almacenamiento: la sesión dura hasta recargar.
  }
  avisar();
  return true;
}

export function cerrarSesion() {
  enMemoria = null;
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar.
  }
  avisar();
}

function instantanea(): Sesion | null {
  return leerSesion() ?? enMemoria;
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  window.addEventListener("storage", oyente); // otra pestaña inicia o cierra sesión
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

export function useSesion(): { cargada: boolean; sesion: Sesion | null } {
  const cargada = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const sesion = useSyncExternalStore(suscribir, instantanea, () => null);
  return { cargada, sesion };
}
