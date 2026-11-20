// 06 · Guía paso a paso (design/pantallas/Guia.dc.html)
// El chat con la IA (ChatIA.dc.html) no es una ruta: es una hoja dentro de la guía.

import type { Metadata } from "next";
import { PantallaGuia } from "../_componentes/PantallaGuia";

export const metadata: Metadata = { title: "Guía paso a paso" };

export default function Page() {
  return <PantallaGuia />;
}
