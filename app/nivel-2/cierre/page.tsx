// 12 · Cierre del Nivel 2 (design/pantallas/Cierre.dc.html)
// El reporte (12b, Reporte.dc.html) es el segundo paso de esta misma pantalla.

import type { Metadata } from "next";
import { Cierre } from "@/components/flujo/Cierre";

export const metadata: Metadata = { title: "Cierre" };

export default function Page() {
  return <Cierre camino="mecanico" />;
}
