// 12d · Cierre del Nivel 3 (design/pantallas/CierreGrua.dc.html)

import type { Metadata } from "next";
import { Cierre } from "@/components/flujo/Cierre";

export const metadata: Metadata = { title: "Cierre" };

export default function Page() {
  return <Cierre camino="grua" />;
}
