// Barra superior. Se queda fija arriba al hacer scroll y deja libre la zona
// de la barra de estado del teléfono.
//
// Cada pantalla tiene un solo h1. Si el título de la pantalla está en el
// contenido (una pregunta, el nombre del mecánico), pasa titleAs="span".

import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { IconButton } from "./IconButton";
import { ChevronLeftIcon, XIcon } from "./icons";

type Props = {
  title?: string;
  subtitle?: string;
  titleAs?: "h1" | "span";
  backHref?: string; // enlace de volver...
  onBack?: () => void; // ...o acción de volver
  backLabel?: string; // lo que lee el lector de pantalla
  backIcon?: "back" | "close"; // flecha o X
  action?: ReactNode; // a la derecha, por ejemplo "Cancelar"
  surface?: "canvas" | "white";
  className?: string;
  children?: ReactNode; // segunda fila, debajo del título
};

export function TopBar({
  title,
  subtitle,
  titleAs: Titulo = "h1",
  backHref,
  onBack,
  backLabel = "Volver",
  backIcon = "back",
  action,
  surface = "canvas",
  className,
  children,
}: Props) {
  const conVolver = Boolean(backHref || onBack);

  return (
    <header
      className={cx(
        "sticky top-0 z-20 shrink-0 pt-[max(8px,env(safe-area-inset-top))] pr-3 pl-2",
        surface === "white" ? "bg-white" : "bg-canvas",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-1">
        {conVolver && (
          <IconButton label={backLabel} variant="ghost" href={backHref} onClick={onBack}>
            {backIcon === "close" ? <XIcon size={24} /> : <ChevronLeftIcon size={26} />}
          </IconButton>
        )}
        <div className={cx("flex min-w-0 flex-1 flex-col", !conVolver && "pl-3")}>
          {title && (
            <Titulo
              className={cx(
                "font-display text-[20px] font-extrabold",
                subtitle ? "leading-6" : "leading-[26px]",
              )}
            >
              {title}
            </Titulo>
          )}
          {subtitle && (
            <span className="text-[13px] leading-[17px] font-semibold text-ink-muted">
              {subtitle}
            </span>
          )}
        </div>
        {action}
      </div>
      {children}
    </header>
  );
}
