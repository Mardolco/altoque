// Calificación con estrellas.
// - mode="display": una estrella, el promedio y cuántas reseñas tiene.
// - mode="input": cinco estrellas para calificar. Cada una es un botón de
//   52 px con aria-label.

import { cx } from "@/lib/formato";
import { StarIcon } from "./icons";

type Props =
  | { mode: "display"; value: number; count?: number; className?: string }
  | { mode: "input"; value: number; onChange: (estrellas: number) => void; className?: string };

const LEYENDAS = [
  "Toca una estrella para calificar",
  "Mala",
  "Regular",
  "Buena",
  "Muy buena",
  "Excelente",
];

export function StarRating(props: Props) {
  if (props.mode === "display") {
    return (
      <span className={cx("flex items-center gap-[5px]", props.className)}>
        <StarIcon size={16} />
        <b className="font-extrabold">{props.value.toFixed(1)}</b>
        {props.count !== undefined && (
          <span className="text-ink-muted">· {props.count} reseñas</span>
        )}
      </span>
    );
  }

  const { value, onChange } = props;
  return (
    <div className={cx("flex flex-col items-center gap-1.5", props.className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={n === 1 ? "1 estrella" : `${n} estrellas`}
            aria-pressed={n <= value}
            onClick={() => onChange(n)}
            className="flex size-[52px] items-center justify-center rounded-[14px] bg-transparent"
          >
            <StarIcon size={38} filled={n <= value} />
          </button>
        ))}
      </div>
      <span aria-live="polite" className="text-[14px] leading-[19px] font-semibold text-ink-muted">
        {LEYENDAS[value] ?? LEYENDAS[0]}
      </span>
    </div>
  );
}
