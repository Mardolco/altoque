// Texto con un destello que lo recorre (estado "analizando", "buscando").
// Hereda el color del texto; sin movimiento queda como texto normal.

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";

export function TextoBrillante({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cx(
        "animate-brillo bg-[linear-gradient(110deg,var(--color-ink-muted)_35%,var(--color-primary)_50%,var(--color-ink-muted)_65%)] bg-[length:200%_100%] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
