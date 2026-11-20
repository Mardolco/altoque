// Tarjeta de semáforo: ¿puede seguir manejando?
// La franja siempre lleva ícono y texto, nunca solo color. El rojo es solo
// para "detente".
//
// - Con fault: muestra "Falla probable", la falla y el detalle.
// - Con children: el cuerpo es libre (lo usa "La IA no está segura").
// - Sin ninguno: solo la franja.

import type { ReactNode } from "react";
import type { Semaforo } from "@/lib/tipos";
import { cx } from "@/lib/formato";
import { CircleCheckIcon, CircleHelpIcon, OctagonAlertIcon } from "./icons";

export type SeverityLevel = "stop" | "caution" | "ok";

/** Del semáforo del diagnóstico al level de la tarjeta. */
export const LEVEL_DE_SEMAFORO: Record<Semaforo, SeverityLevel> = {
  rojo: "stop",
  ambar: "caution",
  verde: "ok",
};

const NIVELES = {
  stop: {
    label: "Detente en un lugar seguro",
    lectura: "rojo, detente",
    franja: "bg-stop text-white",
    Icono: OctagonAlertIcon,
  },
  caution: {
    label: "Necesita revisión",
    lectura: "ámbar, necesita revisión",
    franja: "bg-caution text-ink",
    Icono: CircleHelpIcon,
  },
  ok: {
    label: "Puedes seguir con cuidado",
    lectura: "verde, puedes seguir con cuidado",
    franja: "bg-ok text-white",
    Icono: CircleCheckIcon,
  },
};

type Props = {
  level: SeverityLevel;
  label?: string; // cambia el texto de la franja
  fault?: string; // "Llanta pinchada"
  detail?: string; // "Delantera derecha · según tu foto y respuestas"
  className?: string;
  children?: ReactNode;
};

export function SeverityCard({ level, label, fault, detail, className, children }: Props) {
  const { Icono, franja, lectura, label: porDefecto } = NIVELES[level];

  return (
    <section
      aria-label={`Gravedad: ${lectura}`}
      className={cx(
        "shrink-0 animate-aparecer overflow-hidden rounded-[22px] border border-line-soft bg-white shadow-card",
        className,
      )}
    >
      <div className={cx("flex items-center gap-2.5 px-4 py-3", franja)}>
        <Icono size={26} className="shrink-0" />
        <span className="font-display text-[20px] leading-[26px] font-black">
          {label ?? porDefecto}
        </span>
      </div>

      {fault ? (
        <div className="flex flex-col gap-0.5 px-4 pt-3 pb-3.5">
          <span className="text-[14px] leading-[19px] font-semibold text-ink-muted">
            Falla probable
          </span>
          <h1 className="font-display text-[28px] leading-[34px] font-black">{fault}</h1>
          {detail && <span className="text-[15px] leading-[21px] text-ink-muted">{detail}</span>}
        </div>
      ) : (
        children && <div className="flex flex-col gap-2 px-4 pt-3 pb-4">{children}</div>
      )}
    </section>
  );
}
