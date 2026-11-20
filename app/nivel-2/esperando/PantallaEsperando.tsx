"use client";

// Seguimiento del mecánico elegido. Usa el componente compartido Esperando.

import { Esperando } from "@/components/flujo/Esperando";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { buscarMecanico } from "@/lib/mock/mecanicos";
import { useSeleccion } from "../_compartido/seleccion";

export function PantallaEsperando() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const { mecanicoId } = useSeleccion();
  const mecanico = mecanicoId ? buscarMecanico(mecanicoId) : null;
  return <Esperando quien="mecanico" proveedor={mecanico ?? undefined} />;
}
