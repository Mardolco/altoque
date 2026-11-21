// Pedido en curso del conductor: estado, chat dentro de la app y pago.

import type { Metadata } from "next";
import { PantallaServicio } from "./PantallaServicio";

export const metadata: Metadata = { title: "Tu pedido" };

export default function Page() {
  return <PantallaServicio />;
}
