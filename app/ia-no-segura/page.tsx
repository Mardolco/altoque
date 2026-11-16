import type { Metadata } from "next";
import { PantallaIANoSegura } from "./PantallaIANoSegura";

export const metadata: Metadata = { title: "La IA no está segura" };

export default function Page() {
  return <PantallaIANoSegura />;
}
