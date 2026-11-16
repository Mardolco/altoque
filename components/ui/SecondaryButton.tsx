// Botón secundario: borde azul de 2 px sobre blanco. Para la segunda opción
// de la pantalla. Mismo alto y radio que el primario.

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { Pressable, type PressableProps } from "./Pressable";

type Props = PressableProps & {
  size?: "md" | "sm"; // 56 y 48 px de alto
  icon?: ReactNode;
  iconEnd?: ReactNode;
};

const TAMANOS = {
  md: "min-h-14 gap-2.5 rounded-btn px-5 text-[18px]",
  sm: "min-h-12 gap-2 rounded-[14px] px-3 text-[16px]",
};

export function SecondaryButton({
  size = "md",
  icon,
  iconEnd,
  className,
  children,
  ...resto
}: Props) {
  return (
    <Pressable
      className={cx(
        "flex w-full items-center justify-center border-2 border-primary bg-white text-center font-display leading-6 font-extrabold text-primary no-underline transition-colors active:bg-canvas",
        "disabled:border-line disabled:text-line-strong",
        TAMANOS[size],
        className,
      )}
      {...resto}
    >
      {icon}
      <span>{children}</span>
      {iconEnd}
    </Pressable>
  );
}
