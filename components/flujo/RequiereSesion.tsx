"use client";

// Guard de sesión simulada. Envuelve el contenido de las pantallas de los
// niveles 2 y 3: si no hay sesión, redirige a /ingresar?volver=<ruta actual>.
//
// Uso:
//   export default function Page() {
//     return <RequiereSesion><PantallaMecanicos /></RequiereSesion>;
//   }
//
// Mientras se comprueba la sesión (o se redirige) no pinta el contenido.

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { rutaDeIngreso } from "@/lib/rutas";
import { useSesion } from "@/lib/sesion";

export function RequiereSesion({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ruta = usePathname();
  const { cargada, sesion } = useSesion();

  useEffect(() => {
    if (cargada && !sesion) router.replace(rutaDeIngreso(ruta));
  }, [cargada, sesion, ruta, router]);

  if (!cargada || !sesion) return <main className="flex-1" aria-busy="true" />;
  return <>{children}</>;
}
