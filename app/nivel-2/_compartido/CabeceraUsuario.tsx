"use client";

// "Hola, Valeria" y la salida de la sesión simulada, discretos, bajo la barra superior.

import { cerrarSesion, useSesion } from "@/lib/sesion";

export function CabeceraUsuario() {
  const { sesion } = useSesion();
  if (!sesion) return null;
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 px-5 pb-1 text-[14px] leading-5 text-ink-muted">
      <span>Hola, {sesion.nombre}</span>
      <button
        type="button"
        onClick={cerrarSesion}
        className="flex min-h-12 items-center px-1 text-[14px] font-bold text-primary"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
