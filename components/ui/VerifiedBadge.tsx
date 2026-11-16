// Insignia de verificado. Solo para proveedores que pasaron la verificación
// (DNI, antecedentes y RUC).

import { cx } from "@/lib/formato";
import { ShieldCheckIcon } from "./icons";

type Props = {
  size?: "sm" | "md";
  tone?: "default" | "muted"; // muted: en tarjetas atenuadas (mecánico ocupado)
  className?: string;
};

export function VerifiedBadge({ size = "sm", tone = "default", className }: Props) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center rounded-full font-bold",
        size === "sm"
          ? "gap-1 py-0.5 pr-2 pl-1.5 text-[12px] leading-4"
          : "gap-[5px] py-[3px] pr-2.5 pl-[7px] text-[13px] leading-[18px]",
        tone === "default" ? "bg-surface text-primary" : "bg-line text-ink",
        className,
      )}
    >
      <ShieldCheckIcon size={size === "sm" ? 14 : 16} strokeWidth={2.4} />
      Verificado
    </span>
  );
}
