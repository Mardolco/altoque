// Botón redondo de 48 px que solo tiene ícono. El label es obligatorio: es
// lo que lee el lector de pantalla.

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { Pressable, type PressableProps } from "./Pressable";

type Props = Omit<PressableProps, "aria-label"> & {
  label: string;
  variant?: "outline" | "ghost"; // con borde sobre blanco, o transparente (TopBar)
  children: ReactNode; // el ícono
};

export function IconButton({ label, variant = "outline", className, children, ...resto }: Props) {
  return (
    <Pressable
      aria-label={label}
      className={cx(
        "flex size-12 shrink-0 items-center justify-center rounded-full text-ink no-underline",
        variant === "outline" ? "border border-line bg-white" : "bg-transparent",
        className,
      )}
      {...resto}
    >
      {children}
    </Pressable>
  );
}
