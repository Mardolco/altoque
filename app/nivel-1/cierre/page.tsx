// 12c · Cierre del Nivel 1 (design/pantallas/CierreGuia.dc.html)
// Primero "¿Se solucionó?", luego consejos o ayuda, y al final el cierre compartido.

import type { Metadata } from "next";
import { PantallaCierreGuia } from "../_componentes/PantallaCierreGuia";

export const metadata: Metadata = { title: "Cierre" };

export default function Page() {
  return <PantallaCierreGuia />;
}
