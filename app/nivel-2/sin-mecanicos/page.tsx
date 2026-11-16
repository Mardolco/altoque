// E3 · Sin mecánicos cerca (design/pantallas/SinMecanicos.dc.html)
// Pantalla provisional. La reemplaza el Nivel 2.

import type { Metadata } from "next";
import { EnConstruccion } from "@/components/ui/EnConstruccion";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Sin mecánicos cerca" };

export default function Page() {
  return (
    <EnConstruccion
      titulo="Mecánicos cercanos"
      subtitulo="Sin mecánicos cerca"
      nivel={2}
      diseno="SinMecanicos"
      volver={{ href: RUTAS.diagnostico, label: "Volver al diagnóstico" }}
      acciones={[{ label: "Pedir una grúa", href: RUTAS.gruas }]}
    />
  );
}
