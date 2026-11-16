// Botón de respuesta de las preguntas de la IA: Sí, No o No sé.

import type { Respuesta } from "@/lib/tipos";
import { cx } from "@/lib/formato";
import { CheckIcon, CircleHelpIcon, XIcon } from "./icons";

type Props = {
  respuesta: Respuesta;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export function AnswerButton({ respuesta, onClick, disabled, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-btn border-2 border-line-strong bg-white font-display text-[20px] leading-6 font-black text-ink active:border-primary active:bg-surface",
        className,
      )}
    >
      {respuesta === "Sí" && <CheckIcon size={22} strokeWidth={2.6} className="text-primary" />}
      {respuesta === "No" && <XIcon size={22} strokeWidth={2.6} className="text-primary" />}
      {respuesta === "No sé" && (
        <CircleHelpIcon size={22} strokeWidth={2.4} className="text-primary" />
      )}
      <span>{respuesta}</span>
    </button>
  );
}
