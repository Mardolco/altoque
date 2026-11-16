// Barra de progreso. Siempre con texto: la barra sola no basta.
// - variant="steps": un segmento por paso ("Paso 2 de 6").
// - variant="continuous": una sola barra ("Llega en 8 min").

import { cx } from "@/lib/formato";

type Props = {
  variant?: "steps" | "continuous";
  value: number; // pasos completados, o avance sobre total
  total: number;
  label: string;
  tone?: "primary" | "muted" | "ink"; // estilo del texto
  className?: string;
};

const TONOS = {
  primary: "text-[15px] leading-5 font-bold text-primary",
  muted: "text-[14px] leading-[19px] font-semibold text-ink-muted",
  ink: "text-[15px] leading-5 font-bold text-ink",
};

export function ProgressBar({
  variant = "steps",
  value,
  total,
  label,
  tone = variant === "steps" ? "primary" : "ink",
  className,
}: Props) {
  const avance = Math.min(Math.max(value, 0), total);

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <span aria-live="polite" className={TONOS[tone]}>
        {label}
      </span>
      {variant === "steps" ? (
        <div
          aria-hidden="true"
          className="grid gap-[5px]"
          style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cx("h-2 rounded-full", i < avance ? "bg-primary" : "bg-line")}
            />
          ))}
        </div>
      ) : (
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${total > 0 ? (avance / total) * 100 : 0}%` }}
          />
        </div>
      )}
    </div>
  );
}
