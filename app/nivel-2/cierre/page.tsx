// 12 · Cierre del Nivel 2 (design/pantallas/Cierre.dc.html)
// El reporte (12b, Reporte.dc.html) es el segundo paso de esta misma pantalla.

import type { Metadata } from "next";
import { PantallaCierre } from "./PantallaCierre";

export const metadata: Metadata = { title: "Cierre" };

export default function Page() {
  return <PantallaCierre />;
}
