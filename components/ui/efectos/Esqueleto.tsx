// Bloque de carga con destello, para "analizando" o listas que cargan.
// Dale el tamaño con className, por ejemplo "h-4 w-32" o "h-24 w-full".

import { cx } from "@/lib/formato";

export function Esqueleto({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "block animate-brillo rounded-xl bg-[linear-gradient(110deg,var(--color-muted)_35%,var(--color-line-soft)_50%,var(--color-muted)_65%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
