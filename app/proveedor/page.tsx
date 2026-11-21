"use client";

// App de socios: la vista del mecánico o la grúa. Toma el rol del proveedor
// que eligió el conductor; sin pedido, es Carlos Huamán esperando solicitudes.

import { useEffect } from "react";
import { MECANICO_DEMO } from "@/lib/mock/mecanicos";
import { marcarProveedorPresente, useServicio } from "@/lib/servicio";
import { Cobrado } from "./Cobrado";
import { Inactivo } from "./Inactivo";
import { Solicitud } from "./Solicitud";
import { Trabajo } from "./Trabajo";

export default function PaginaProveedor() {
  const servicio = useServicio();

  useEffect(() => {
    marcarProveedorPresente();
    const id = setInterval(marcarProveedorPresente, 2000);
    return () => clearInterval(id);
  }, []);

  let vista;
  if (!servicio) vista = <Inactivo proveedor={MECANICO_DEMO} />;
  else if (servicio.estado === "solicitado") vista = <Solicitud key={servicio.id} servicio={servicio} />;
  else if (servicio.estado === "rechazado") vista = <Inactivo proveedor={servicio.proveedor} rechazado />;
  else if (servicio.estado === "pagado" || servicio.estado === "finalizado") vista = <Cobrado servicio={servicio} />;
  else vista = <Trabajo key={servicio.id} servicio={servicio} />;

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-canvas">
      {vista}
    </div>
  );
}
