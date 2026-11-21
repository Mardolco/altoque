import type { Metadata } from "next";
import { PantallaRecibo } from "./PantallaRecibo";

export const metadata: Metadata = { title: "Recibo" };

export default function Page() {
  return <PantallaRecibo />;
}
