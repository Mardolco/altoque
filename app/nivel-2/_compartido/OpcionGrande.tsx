// Opción de una pregunta con respuesta única: un radio de verdad dentro de una tarjeta.

import type { ReactNode } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { cx } from "@/lib/formato";

type Props = {
  nombre: string; // name del grupo de radios
  valor: string;
  elegida: boolean;
  onElegir: () => void;
  titulo: string;
  detalle?: string;
  icono?: ReactNode;
};

export function OpcionGrande({ nombre, valor, elegida, onElegir, titulo, detalle, icono }: Props) {
  return (
    <label
      className={cx(
        "relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
        elegida ? "border-primary bg-surface" : "border-line-strong bg-white",
      )}
    >
      <input
        type="radio"
        name={nombre}
        value={valor}
        checked={elegida}
        onChange={onElegir}
        className="sr-only"
      />
      {icono && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary">
          {icono}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-[17px] leading-[22px] font-extrabold">{titulo}</span>
        {detalle && <span className="text-[14px] leading-5 text-ink-muted">{detalle}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cx(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
          elegida ? "border-primary bg-primary text-white" : "border-line-strong bg-white",
        )}
      >
        {elegida && <CheckIcon size={14} strokeWidth={3.4} />}
      </span>
    </label>
  );
}
