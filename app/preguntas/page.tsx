import type { Metadata } from "next";
import { PantallaPreguntas } from "./PantallaPreguntas";

export const metadata: Metadata = { title: "Preguntas de la IA" };

export default function Page() {
  return <PantallaPreguntas />;
}
