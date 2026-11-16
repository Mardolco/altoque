// Aviso de seguridad. Un consejo por aviso, en frases de una línea.
// - tone="info": celeste, con el ícono en un círculo ámbar ("Mientras tanto").
// - tone="warning": ámbar claro ("Antes de bajar", "Qué NO hacer").

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { HazardIcon, TriangleAlertIcon } from "./icons";

type Props = {
  tone?: "info" | "warning";
  eyebrow?: string; // "Mientras tanto", solo en info
  title?: string;
  icon?: ReactNode; // cambia el ícono por defecto
  className?: string;
  children?: ReactNode;
};

export function SafetyNotice({ tone = "info", eyebrow, title, icon, className, children }: Props) {
  if (tone === "info") {
    return (
      <div className={cx("flex items-start gap-3.5 rounded-card bg-surface p-4", className)}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-caution text-ink">
          {icon ?? <HazardIcon size={24} />}
        </span>
        <div className="flex flex-col gap-0.5">
          {eyebrow && <span className="text-[14px] leading-[19px] font-bold">{eyebrow}</span>}
          {title && (
            <span className="font-display text-[19px] leading-6 font-black">{title}</span>
          )}
          {children && <span className="text-[15px] leading-[21px]">{children}</span>}
        </div>
      </div>
    );
  }

  // Sin título, el ícono va al lado del texto.
  if (!title) {
    return (
      <div
        className={cx(
          "flex items-start gap-3 rounded-2xl border border-caution bg-caution-tint px-4 py-3.5",
          className,
        )}
      >
        <span className="mt-px shrink-0 text-caution-ink">
          {icon ?? <TriangleAlertIcon size={22} />}
        </span>
        <span className="text-[15px] leading-[22px]">{children}</span>
      </div>
    );
  }

  return (
    <div
      className={cx(
        "flex flex-col gap-1.5 rounded-2xl border border-caution bg-caution-tint px-3.5 py-3",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-[14px] leading-5 font-extrabold text-caution-ink">
        {icon ?? <TriangleAlertIcon size={18} strokeWidth={2.4} />}
        {title}
      </span>
      {children && <span className="text-[14px] leading-5">{children}</span>}
    </div>
  );
}
