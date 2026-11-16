// 06 · Guía paso a paso (design/pantallas/Guia.dc.html)
// Pantalla provisional. La reemplaza el Nivel 1. El chat con la IA
// (ChatIA.dc.html) no es una ruta: es una hoja dentro de la guía.

import type { Metadata } from "next";
import { EnConstruccion } from "@/components/ui/EnConstruccion";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Guía paso a paso" };

export default function Page() {
  return (
    <EnConstruccion
      titulo="Cambia la llanta"
      subtitulo="Nivel 1 · Resuélvelo tú"
      nivel={1}
      diseno="Guia"
      nota="El chat «Pregúntale a la IA» se abre como hoja dentro de esta guía."
      volver={{ href: RUTAS.diagnostico, label: "Volver al diagnóstico" }}
      acciones={[
        { label: "Listo, terminé", href: RUTAS.cierreGuia },
        { label: "No puedo, quiero un mecánico", href: RUTAS.mecanicos },
      ]}
    />
  );
}
