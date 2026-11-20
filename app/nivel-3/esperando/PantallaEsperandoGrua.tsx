"use client";

// 11b · Grúa en camino (design/pantallas/EsperandoGrua.dc.html)
// Usa el componente compartido Esperando y le suma el destino y el chat.

import { Esperando } from "@/components/flujo/Esperando";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { buscarGrua, GRUA_DEMO } from "@/lib/mock/gruas";
import { useSeleccion } from "../../nivel-2/_compartido/seleccion";
import { useDiagnostico } from "../../nivel-2/_compartido/useDiagnostico";
import { ChatOperador } from "./ChatOperador";
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
  const grua = (gruaId ? buscarGrua(gruaId) : null) ?? GRUA_DEMO;

  return (
    <Esperando
      quien="grua"
      proveedor={grua}
      extra={
        <div className="flex flex-col gap-4">
          <DestinoTraslado falla={diagnostico.falla} operador={grua.conductor} />
          <ChatOperador grua={grua} />
        </div>
      }
    />
  );
}
