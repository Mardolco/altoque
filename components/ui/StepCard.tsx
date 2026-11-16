// Tarjeta de paso de la guía: ilustración, título, hasta 3 indicaciones y,
// debajo, el aviso "Qué NO hacer".

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { BanIcon, CheckIcon, XIcon } from "./icons";

type Props = {
  step?: number; // con total, muestra "Paso 2 de 6" dentro de la tarjeta
  total?: number;
  title: string;
  illustration: ReactNode; // SVG del paso, con role="img" y aria-label
  items: string[]; // máximo 3
  dont?: string[]; // "Qué NO hacer"
  className?: string;
};

export function StepCard({ step, total, title, illustration, items, dont, className }: Props) {
  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <article className="flex shrink-0 flex-col gap-3.5 rounded-3xl border border-line-soft bg-white px-3 pt-3 pb-4 shadow-card">
        <div className="flex h-[132px] items-center justify-center overflow-hidden rounded-[18px] bg-surface">
          {illustration}
        </div>
        <div className="flex flex-col gap-2.5 px-1.5">
          {step !== undefined && total !== undefined && (
            <span className="text-[13px] leading-[18px] font-bold text-primary">
              Paso {step} de {total}
            </span>
          )}
          <h1 className="font-display text-[23px] leading-[29px] font-black">{title}</h1>
          <ol className="flex flex-col gap-2">
            {items.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[16px] leading-[22px]">
                <CheckIcon size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </article>

      {dont && dont.length > 0 && (
        <section
          aria-label="Qué no hacer"
          className="flex shrink-0 flex-col gap-2 rounded-[18px] border border-caution bg-caution-tint px-4 py-3.5"
        >
          <span className="flex items-center gap-2 text-[15px] leading-5 font-extrabold text-caution-ink">
            <BanIcon size={20} strokeWidth={2.4} />
            Qué NO hacer
          </span>
          <ul className="flex flex-col gap-1.5">
            {dont.map((texto) => (
              <li key={texto} className="flex items-start gap-2.5 text-[15px] leading-[21px]">
                <XIcon size={16} strokeWidth={3} className="mt-[3px] shrink-0 text-caution-ink" />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
