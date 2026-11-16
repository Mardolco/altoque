import type { Metadata } from "next";
import { PantallaFotoError } from "./PantallaFotoError";

export const metadata: Metadata = { title: "La foto no se pudo analizar" };

export default function Page() {
  return <PantallaFotoError />;
}
