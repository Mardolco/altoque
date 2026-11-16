// 11 · Grúas cercanas (design/pantallas/Gruas.dc.html)
// Pantalla provisional. La reemplaza el Nivel 3.

import type { Metadata } from "next";
import { EnConstruccion } from "@/components/ui/EnConstruccion";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Grúas cercanas" };

export default function Page() {
  return (
    <EnConstruccion
      titulo="Grúas cercanas"
      subtitulo="Para llevar tu auto a un taller"
      nivel={3}
      diseno="Gruas"
      volver={{ href: RUTAS.diagnostico, label: "Volver al diagnóstico" }}
      acciones={[
        { label: "Escribir por WhatsApp", href: RUTAS.esperandoGrua },
        { label: "Llamar", href: RUTAS.esperandoGrua },
      ]}
    />
  );
}
