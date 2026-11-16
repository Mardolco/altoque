// Burbuja de chat. La IA va en celeste con el logo; el usuario, en azul.

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { Logo } from "./Logo";

type Props = {
  from: "ia" | "user";
  text: string;
  action?: ReactNode; // botón dentro de la burbuja de la IA
  className?: string;
};

export function ChatBubble({ from, text, action, className }: Props) {
  if (from === "user") {
    return (
      <div
        className={cx(
          "max-w-[80%] self-end rounded-[18px_18px_6px_18px] bg-primary px-3.5 py-3 text-[16px] leading-[23px] text-white",
          className,
        )}
      >
        {text}
      </div>
    );
  }

  return (
    <div className={cx("flex max-w-[92%] items-end gap-2", className)}>
      <Logo size={30} />
      <div className="flex flex-col gap-2.5 rounded-[18px_18px_18px_6px] bg-surface px-3.5 py-3 text-[16px] leading-[23px]">
        <span>{text}</span>
        {action}
      </div>
    </div>
  );
}
