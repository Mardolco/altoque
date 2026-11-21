import type { Metadata } from "next";
import { PantallaPago } from "./PantallaPago";

export const metadata: Metadata = { title: "Pagar" };

export default function Page() {
  return <PantallaPago />;
}
