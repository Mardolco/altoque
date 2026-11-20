// 09 · Perfil del mecánico (design/pantallas/PerfilMecanico.dc.html)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MECANICOS, buscarMecanico } from "@/lib/mock/mecanicos";
import { PantallaPerfil } from "./PantallaPerfil";

export const metadata: Metadata = { title: "Perfil del mecánico" };

// Solo existen los perfiles de lib/mock.
export const dynamicParams = false;

export function generateStaticParams() {
  return MECANICOS.map((mecanico) => ({ id: mecanico.id }));
}

export default async function Page({ params }: PageProps<"/nivel-2/mecanicos/[id]">) {
  const { id } = await params;
  const mecanico = buscarMecanico(id);
  if (!mecanico) notFound();

  return <PantallaPerfil mecanico={mecanico} />;
}
