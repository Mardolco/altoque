import type { Metadata } from "next";
import { PantallaDiagnostico } from "./PantallaDiagnostico";

export const metadata: Metadata = { title: "Diagnóstico" };

export default function Page() {
  return <PantallaDiagnostico />;
}
