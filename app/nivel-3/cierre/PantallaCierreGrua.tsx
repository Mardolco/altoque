"use client";

// 12 · Cierre del Nivel 3. Usa el componente compartido Cierre.

import { Cierre } from "@/components/flujo/Cierre";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { buscarGrua } from "@/lib/mock/gruas";
import { useSeleccion } from "../../nivel-2/_compartido/seleccion";

export function PantallaCierreGrua() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const { gruaId, destino } = useSeleccion();
  const grua = gruaId ? buscarGrua(gruaId) : null;
  return <Cierre camino="grua" proveedor={grua ?? undefined} destino={destino?.nombre} />;
}
