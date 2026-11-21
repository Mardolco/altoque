"use client";

// Pastilla flotante para cambiar de rol en un solo celular: del conductor
// (/servicio) al mecánico o la grúa (/proveedor) y de vuelta. Solo aparece
// cuando hay un pedido en curso y se oculta dentro de un iframe (/demo ya
// muestra los dos teléfonos).

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CarFrontIcon, WrenchIcon } from "@/components/ui/icons";
import { RUTAS } from "@/lib/rutas";
import { useServicio } from "@/lib/servicio";

const sinSuscripcion = () => () => {};
const dentroDeMarco = () => window.self !== window.top;

export function CambiarVista({ className }: { className?: string }) {
  const servicio = useServicio();
  const pathname = usePathname();
  const enMarco = useSyncExternalStore(sinSuscripcion, dentroDeMarco, () => true);

  if (!servicio || enMarco) return null;

  const comoProveedor = !pathname.startsWith(RUTAS.proveedor);
  const nombre = servicio.proveedor.tipo === "grua" ? "grúa" : "mecánico";

  return (
    <div
      className={
        className ??
        "pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto flex w-full max-w-[430px] justify-end px-4"
      }
    >
      <PrimaryButton
        size="sm"
        href={comoProveedor ? RUTAS.proveedor : RUTAS.servicio}
        icon={comoProveedor ? <WrenchIcon size={20} /> : <CarFrontIcon size={20} />}
        className="pointer-events-auto w-auto rounded-full bg-ink px-5 text-[15px] shadow-float hover:bg-ink active:bg-ink"
      >
        {comoProveedor ? `Ver como ${nombre}` : "Ver como conductor"}
      </PrimaryButton>
    </div>
  );
}
