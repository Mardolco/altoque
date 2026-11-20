"use client";

// 12 · Cierre del Nivel 2. Usa el componente compartido Cierre.

import { Cierre } from "@/components/flujo/Cierre";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { buscarMecanico } from "@/lib/mock/mecanicos";
import { useSeleccion } from "../_compartido/seleccion";

export function PantallaCierre() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const { mecanicoId } = useSeleccion();
  const mecanico = mecanicoId ? buscarMecanico(mecanicoId) : null;
  return <Cierre camino="mecanico" proveedor={mecanico ?? undefined} />;
}
