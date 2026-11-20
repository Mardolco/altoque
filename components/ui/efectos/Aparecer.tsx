// Entrada suave: sube 12 px y se desvanece. Para tarjetas y bloques al
// montar una pantalla. Usa retraso (ms) para escalonar: 0, 60, 120...
// Respeta prefers-reduced-motion (globals.css apaga las animaciones).

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "@/lib/formato";

type Props = {
  retraso?: number; // ms
  como?: ElementType; // etiqueta: div por defecto
  className?: string;
  children: ReactNode;
};

export function Aparecer({ retraso = 0, como: Etiqueta = "div", className, children }: Props) {
  const estilo: CSSProperties | undefined = retraso ? { animationDelay: `${retraso}ms` } : undefined;
  return (
    <Etiqueta className={cx("animate-aparecer", className)} style={estilo}>
      {children}
    </Etiqueta>
  );
}
