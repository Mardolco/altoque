"use client";

// Las pantallas viejas de "esperando" ya no son el seguimiento: si hay un
// pedido en curso mandan a /servicio. Devuelve true mientras redirige.

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RUTAS } from "./rutas";
import { useServicio } from "./servicio";

export function useRedirigirAServicio(): boolean {
  const router = useRouter();
  const servicio = useServicio();
  const hay = servicio !== null;

  useEffect(() => {
    if (hay) router.replace(RUTAS.servicio);
  }, [hay, router]);

  return hay;
}
