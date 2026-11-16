// Tarjeta de camino. Un solo camino recomendado (recommended); los otros dos
// quedan a un toque como filas con enlace.

import Link from "next/link";
import type { ComponentType } from "react";
import type { Nivel } from "@/lib/tipos";
import { cx } from "@/lib/formato";
import {
  CheckIcon,
  ChevronRightIcon,
  ListChecksIcon,
  TruckIcon,
  WrenchIcon,
  type IconProps,
} from "./icons";

/** Nombre e ícono de cada nivel. */
export const CAMINOS: Record<Nivel, { titulo: string; Icono: ComponentType<IconProps> }> = {
  1: { titulo: "Resuélvelo tú", Icono: ListChecksIcon },
  2: { titulo: "Llama a un mecánico", Icono: WrenchIcon },
  3: { titulo: "Pide una grúa", Icono: TruckIcon },
};

type Props = {
  level: Nivel;
  recommended?: boolean;
  reason: string; // por qué ese camino, en una frase
  href?: string; // solo para los caminos no recomendados
  className?: string;
};

export function PathOption({ level, recommended = false, reason, href, className }: Props) {
  const { titulo, Icono } = CAMINOS[level];

  if (recommended) {
    return (
      <section
        aria-label="Camino recomendado"
        className={cx(
          "flex shrink-0 flex-col gap-2 rounded-card border-2 border-primary bg-surface px-4 pt-3.5 pb-4",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary py-1 pr-2.5 pl-2 text-[13px] leading-[18px] font-bold text-white">
            <CheckIcon size={14} strokeWidth={3} />
            Recomendado para ti
          </span>
          <span className="text-[14px] font-bold">Nivel {level}</span>
        </div>
        <h2 className="flex items-center gap-2 font-display text-[21px] leading-[26px] font-black">
          <Icono size={24} className="shrink-0 text-primary" />
          {titulo}
        </h2>
        <p className="text-[15px] leading-[21px]">{reason}</p>
      </section>
    );
  }

  const fila = cx(
    "flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-white py-2 pr-2.5 pl-3 text-ink no-underline",
    className,
  );
  const contenido = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
        <Icono size={22} />
      </span>
      <span className="flex flex-1 flex-col gap-px">
        <span className="font-display text-[17px] leading-[22px] font-extrabold">
          Nivel {level} · {titulo}
        </span>
        <span className="text-[14px] leading-[19px] text-ink-muted">{reason}</span>
      </span>
      {href && <ChevronRightIcon size={22} className="shrink-0 text-ink-muted" />}
    </>
  );

  return href ? (
    <Link href={href} className={fila}>
      {contenido}
    </Link>
  ) : (
    <div className={fila}>{contenido}</div>
  );
}
