"use client";

// Botón de emergencia. Es el único botón rojo de la app y pide confirmación
// en una hoja inferior antes de llamar.
//
// "Llamar al 105" usa tel:105 y marca de verdad. No lo pulses en las pruebas.

import { useState } from "react";
import { cx } from "@/lib/formato";
import { BottomSheet } from "./BottomSheet";
import { PhoneIcon } from "./icons";
import { SecondaryButton } from "./SecondaryButton";

export function EmergencyButton({ className }: { className?: string }) {
  const [abierta, setAbierta] = useState(false);
  const cerrar = () => setAbierta(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        aria-label="Emergencia: llamar a la Policía al 105"
        className={cx(
          "flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 border-stop bg-white pr-4 pl-3.5 text-[15px] font-bold text-stop",
          className,
        )}
      >
        <PhoneIcon size={20} />
        <span>Policía 105</span>
      </button>

      <BottomSheet open={abierta} onClose={cerrar} title="Llamar a la Policía">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-stop-tint text-stop-ink">
            <PhoneIcon size={30} strokeWidth={2} />
          </span>
          <h2 className="mt-1 font-display text-[24px] leading-[30px] font-black">
            ¿Llamar a la Policía?
          </h2>
          <p className="text-[16px] leading-6 text-ink-muted">
            Marcaremos el 105. Úsalo si estás en peligro o no te sientes a salvo.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <a
            href="tel:105"
            className="flex min-h-14 items-center justify-center gap-2.5 rounded-btn bg-stop px-5 font-display text-[19px] leading-6 font-black text-white no-underline"
          >
            <PhoneIcon size={22} />
            <span>Llamar al 105</span>
          </a>
          <SecondaryButton onClick={cerrar}>Cancelar</SecondaryButton>
        </div>
      </BottomSheet>
    </>
  );
}
