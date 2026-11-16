// 12c · Cierre del Nivel 1 (design/pantallas/CierreGuia.dc.html)

import type { Metadata } from "next";
import { Cierre } from "@/components/flujo/Cierre";

export const metadata: Metadata = { title: "Cierre" };

export default function Page() {
  return <Cierre camino="guia" />;
}
