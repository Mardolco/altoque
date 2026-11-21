"use client";

// 11b · Grúa en camino (design/pantallas/EsperandoGrua.dc.html)
// Si hay un pedido en curso, el seguimiento vive en /servicio. Esta pantalla
// solo queda como respaldo si se abre la ruta directo, sin pedido.

import { Esperando } from "@/components/flujo/Esperando";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { buscarGrua, GRUA_DEMO } from "@/lib/mock/gruas";
import { useRedirigirAServicio } from "@/lib/useRedirigirAServicio";
import { useSeleccion } from "../../nivel-2/_compartido/seleccion";
import { useDiagnostico } from "../../nivel-2/_compartido/useDiagnostico";
import { DestinoTraslado } from "./DestinoTraslado";

export function PantallaEsperandoGrua() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const { gruaId } = useSeleccion();
  const { diagnostico } = useDiagnostico();
  const redirigiendo = useRedirigirAServicio();
  const grua = (gruaId ? buscarGrua(gruaId) : null) ?? GRUA_DEMO;

  if (redirigiendo) return <main className="flex-1" aria-busy="true" />;

  return (
    <Esperando
      quien="grua"
      proveedor={grua}
      extra={<DestinoTraslado falla={diagnostico.falla} operador={grua.conductor} />}
    />
  );
}
