// 08 · Mecánicos cercanos (design/pantallas/Mecanicos.dc.html)
// Pantalla provisional. La reemplaza el Nivel 2.

import type { Metadata } from "next";
import { EnConstruccion } from "@/components/ui/EnConstruccion";
import { MECANICO_DEMO } from "@/lib/mock/mecanicos";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Mecánicos cercanos" };

export default function Page() {
  return (
    <EnConstruccion
      titulo="Mecánicos cercanos"
      subtitulo="Para tu llanta pinchada"
      nivel={2}
      diseno="Mecanicos"
      nota="El último botón abre el caso borde «Sin mecánicos cerca». En el diseño no hay un enlace que lleve ahí."
      volver={{ href: RUTAS.diagnostico, label: "Volver al diagnóstico" }}
      acciones={[
        {
          label: `${MECANICO_DEMO.nombre}, ver perfil`,
          href: RUTAS.perfilMecanico(MECANICO_DEMO.id),
        },
        { label: "¿Prefieres una grúa? Ver grúas cercanas", href: RUTAS.gruas },
        { label: "Caso borde: sin mecánicos cerca", href: RUTAS.sinMecanicos },
      ]}
    />
  );
}
