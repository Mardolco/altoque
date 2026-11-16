// Respuesta rápida del chat. Van debajo del último mensaje.

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";

type Props = {
  onClick: () => void;
  className?: string;
  children: ReactNode;
};

export function QuickReply({ onClick, className, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "min-h-12 rounded-full border-2 border-primary bg-white px-4 text-[15px] font-semibold text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}
