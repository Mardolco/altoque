"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { RUTAS } from "@/lib/rutas";
import { useServicio, type Servicio } from "@/lib/servicio";

const sinSuscripcion = () => () => {};

/** false en el servidor y en el primer render: localStorage aún no se leyó. */
export function useMontado(): boolean {
  return useSyncExternalStore(sinSuscripcion, () => true, () => false);
}

/**
 * Pedido actual para las pantallas de /servicio. Si no hay pedido, vuelve al
 * inicio. Devuelve null mientras carga o redirige.
 */
export function useServicioOInicio(): Servicio | null {
  const router = useRouter();
  const montado = useMontado();
  const servicio = useServicio();
  const falta = montado && servicio === null;

  useEffect(() => {
    if (falta) router.replace(RUTAS.inicio);
  }, [falta, router]);

  return montado ? servicio : null;
}

export function horaCorta(t: number): string {
  return new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(t));
}
