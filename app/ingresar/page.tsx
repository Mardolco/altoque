import type { Metadata } from "next";
import { Suspense } from "react";
import { PantallaIngresar } from "./PantallaIngresar";

export const metadata: Metadata = { title: "Ingresar" };

export default function Page() {
  // useSearchParams pide un Suspense en la página.
  return (
    <Suspense>
      <PantallaIngresar />
    </Suspense>
  );
}
