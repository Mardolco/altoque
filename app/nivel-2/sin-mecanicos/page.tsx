// E3 · Sin mecánicos cerca (design/pantallas/SinMecanicos.dc.html)
// Se llega desde la lista ("Ninguno me sirve") o sola si ningún mecánico está libre.

import type { Metadata } from "next";
import { PantallaSinMecanicos } from "./PantallaSinMecanicos";

export const metadata: Metadata = { title: "Sin mecánicos cerca" };

export default function Page() {
  return <PantallaSinMecanicos />;
}
