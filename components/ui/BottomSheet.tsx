"use client";

// Hoja inferior: fondo oscurecido al 50 %, tirador y radio de 28 arriba.
// Se cierra tocando fuera o con Escape. Usos: emergencia, compartir
// ubicación y avisar a la familia.

import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import { cx } from "@/lib/formato";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string; // nombre de la hoja para el lector de pantalla
  className?: string;
  children: ReactNode;
};

const ENFOCABLES = 'a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]';

export function BottomSheet({ open, onClose, title, className, children }: Props) {
  const hoja = useRef<HTMLElement>(null);
  const cerrar = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;

    const antes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    hoja.current?.focus();

    function alTeclear(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        cerrar();
        return;
      }
      // El foco no sale de la hoja mientras está abierta.
      if (evento.key !== "Tab" || !hoja.current) return;
      const enfocables = hoja.current.querySelectorAll<HTMLElement>(ENFOCABLES);
      if (enfocables.length === 0) return;
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      const actual = document.activeElement;
      if (evento.shiftKey && (actual === primero || actual === hoja.current)) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && actual === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    const desborde = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.body.style.overflow = desborde;
      document.removeEventListener("keydown", alTeclear);
      antes?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink/50">
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onClose}
        className="flex-1 cursor-default"
      />
      <section
        ref={hoja}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cx(
          "mx-auto flex max-h-[92dvh] w-full max-w-[430px] animate-sheet flex-col gap-[18px] overflow-y-auto rounded-t-sheet bg-white px-5 pt-3 pb-[max(28px,env(safe-area-inset-bottom))] shadow-sheet outline-none",
          className,
        )}
      >
        <div className="h-[5px] w-11 shrink-0 self-center rounded-full bg-handle" />
        {children}
      </section>
    </div>
  );
}
