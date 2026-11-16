// 10 · Esperando ayuda (design/pantallas/Esperando.dc.html)

import type { Metadata } from "next";
import { Esperando } from "@/components/flujo/Esperando";

export const metadata: Metadata = { title: "Esperando ayuda" };

export default function Page() {
  return <Esperando quien="mecanico" />;
}
