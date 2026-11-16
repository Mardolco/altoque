import type { Metadata } from "next";
import { PantallaAnalizando } from "./PantallaAnalizando";

export const metadata: Metadata = { title: "Analizando" };

export default function Page() {
  return <PantallaAnalizando />;
}
