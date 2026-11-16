// Botón de texto: la salida discreta de la pantalla ("Ahora no", "No puedo,
// quiero un mecánico").

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { Pressable, type PressableProps } from "./Pressable";

type Props = PressableProps & {
  icon?: ReactNode;
};

export function TextButton({ icon, className, children, ...resto }: Props) {
  return (
    <Pressable
      className={cx(
        "flex min-h-12 items-center justify-center gap-2 bg-transparent text-center font-display text-[17px] leading-6 font-extrabold text-primary no-underline hover:text-primary-dark",
        className,
      )}
      {...resto}
    >
      {icon}
      <span>{children}</span>
    </Pressable>
  );
}
