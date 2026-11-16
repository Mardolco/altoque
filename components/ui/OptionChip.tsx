// Chip de opción. Seleccionado: celeste, borde azul y check.

import { cx } from "@/lib/formato";
import { CheckIcon } from "./icons";

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
};

export function OptionChip({ label, selected, onToggle, className }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cx(
        "flex min-h-12 items-center gap-2 rounded-full border-2 pr-[18px] pl-3.5 text-[15px] font-semibold text-ink",
        selected ? "border-primary bg-surface" : "border-line-strong bg-white",
        className,
      )}
    >
      {selected && <CheckIcon size={18} strokeWidth={3} className="shrink-0 text-primary" />}
      <span>{label}</span>
    </button>
  );
}
