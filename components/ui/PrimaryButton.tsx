// Botón primario. Ancho completo y siempre abajo: una sola acción principal
// por pantalla. Con href es un enlace; con onClick, un botón.
//
// className se suma a las clases del componente. Para pisar una de ellas usa
// el sufijo "!" de Tailwind, por ejemplo className="text-[18px]!".

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { Pressable, type PressableProps } from "./Pressable";

type Props = PressableProps & {
  size?: "lg" | "md" | "sm"; // 64, 56 y 48 px de alto
  icon?: ReactNode; // a la izquierda del texto
  iconEnd?: ReactNode; // a la derecha del texto
};

const TAMANOS = {
  lg: "min-h-16 gap-3 rounded-[18px] px-5 text-[21px] shadow-[0_6px_16px_rgb(11_95_165/0.28)]",
  md: "min-h-14 gap-2.5 rounded-btn px-5 text-[19px] shadow-button",
  sm: "min-h-12 gap-2 rounded-[14px] px-4 text-[17px]",
};

export function PrimaryButton({
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
        "flex w-full items-center justify-center bg-primary text-center font-display leading-6 font-black text-white no-underline transition-[colors,transform] hover:bg-primary-dark active:scale-[0.98] active:bg-primary-dark",
        "disabled:bg-line disabled:text-ink-muted disabled:shadow-none",
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
