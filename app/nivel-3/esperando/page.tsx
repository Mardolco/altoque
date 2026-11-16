// 11b · Grúa en camino (design/pantallas/EsperandoGrua.dc.html)

import type { Metadata } from "next";
import { Esperando } from "@/components/flujo/Esperando";

export const metadata: Metadata = { title: "Grúa en camino" };

export default function Page() {
  return <Esperando quien="grua" />;
}
