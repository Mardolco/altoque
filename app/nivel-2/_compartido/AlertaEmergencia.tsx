// Alerta de seguridad en rojo. Solo para "detente" y emergencias.

import type { ReactNode } from "react";
import { OctagonAlertIcon } from "@/components/ui/icons";

export function AlertaEmergencia({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-card border-2 border-stop bg-stop-tint p-4"
    >
      <span className="mt-0.5 shrink-0 text-stop-ink">
        <OctagonAlertIcon size={28} />
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-display text-[19px] leading-6 font-black text-stop-ink">{titulo}</span>
        <span className="text-[16px] leading-[23px]">{children}</span>
      </div>
    </div>
  );
}
