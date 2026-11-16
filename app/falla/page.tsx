import type { Metadata } from "next";
import { PantallaFalla } from "./PantallaFalla";

export const metadata: Metadata = { title: "Cuéntanos qué pasó" };

export default function Page() {
  return <PantallaFalla />;
}
