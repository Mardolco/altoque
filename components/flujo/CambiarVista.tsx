"use client";

// Chip para cambiar de rol en un solo celular: del conductor (/servicio) al
// mecánico o la grúa (/proveedor) y de vuelta. Es una pieza en línea: se
// coloca dentro de la barra superior (TopBar action o Cabecera de socios), así
// nunca tapa el chat ni las respuestas rápidas. Solo aparece cuando hay un
// pedido en curso y se oculta dentro de un iframe (/demo ya muestra los dos
// teléfonos). El área táctil mide 48 px; lo que se ve es más chico.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { CarFrontIcon, WrenchIcon } from "@/components/ui/icons";
import { cx } from "@/lib/formato";
import { RUTAS } from "@/lib/rutas";
import { useServicio } from "@/lib/servicio";

const sinSuscripcion = () => () => {};
const dentroDeMarco = () => window.self !== window.top;

export function CambiarVista({ tono = "claro" }: { tono?: "claro" | "oscuro" }) {
  const servicio = useServicio();
  const pathname = usePathname();
  const enMarco = useSyncExternalStore(sinSuscripcion, dentroDeMarco, () => true);

  if (!servicio || enMarco) return null;

  const comoProveedor = !pathname.startsWith(RUTAS.proveedor);
  const nombre = servicio.proveedor.tipo === "grua" ? "grúa" : "mecánico";
  const corto = comoProveedor ? (servicio.proveedor.tipo === "grua" ? "Grúa" : "Mecánico") : "Conductor";

  return (
    <Link
      href={comoProveedor ? RUTAS.proveedor : RUTAS.servicio}
      aria-label={comoProveedor ? `Ver como ${nombre}` : "Ver como conductor"}
      className="flex min-h-12 shrink-0 items-center no-underline"
    >
      <span
        className={cx(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] leading-[18px] font-bold",
          tono === "oscuro" ? "bg-white/15 text-white" : "bg-ink text-white",
        )}
      >
        {comoProveedor ? <WrenchIcon size={16} /> : <CarFrontIcon size={16} />}
        {corto}
      </span>
    </Link>
  );
}
