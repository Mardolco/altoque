// 09 · Perfil del mecánico (design/pantallas/PerfilMecanico.dc.html)
// Pantalla provisional. La reemplaza el Nivel 2.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnConstruccion } from "@/components/ui/EnConstruccion";
import { MECANICOS, buscarMecanico } from "@/lib/mock/mecanicos";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Perfil del mecánico" };

// Solo existen los perfiles de lib/mock. En el diseño, solo Carlos Huamán.
export const dynamicParams = false;

export function generateStaticParams() {
  return MECANICOS.filter((mecanico) => mecanico.perfil).map((mecanico) => ({ id: mecanico.id }));
}

export default async function Page({ params }: PageProps<"/nivel-2/mecanicos/[id]">) {
  const { id } = await params;
  const mecanico = buscarMecanico(id);
  if (!mecanico) notFound();

  return (
    <EnConstruccion
      titulo="Perfil del mecánico"
      subtitulo={`${mecanico.nombre} · ${mecanico.taller}`}
      nivel={2}
      diseno="PerfilMecanico"
      volver={{ href: RUTAS.mecanicos, label: "Volver a mecánicos cercanos" }}
      acciones={[
        { label: "Escribir por WhatsApp", href: RUTAS.esperandoMecanico },
        { label: "Llamar", href: RUTAS.esperandoMecanico },
      ]}
    />
  );
}
