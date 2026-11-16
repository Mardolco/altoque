// Zona de la acción principal. Se queda fija abajo al hacer scroll y respeta
// la barra de gestos del teléfono. Va al final de la pantalla, después de
// un <main className="flex-1">.

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";

type Props = {
  surface?: "canvas" | "white"; // white: fondo blanco con línea arriba
  className?: string;
  children: ReactNode;
};

export function BottomBar({ surface = "canvas", className, children }: Props) {
  return (
    <div
      className={cx(
        "sticky bottom-0 z-10 flex shrink-0 flex-col px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]",
        surface === "white" ? "border-t border-line-soft bg-white" : "bg-canvas",
        className,
      )}
    >
      {children}
    </div>
  );
}
