"use client";

// Consulta simulada de disponibilidad por WhatsApp: un par de segundos con
// esqueletos y luego avisa con onListo. No se envía nada de verdad.

import { useEffect, useEffectEvent } from "react";
import { MessageCircleIcon } from "@/components/ui/icons";
import { Esqueleto, TextoBrillante } from "@/components/ui/efectos";

export function Consultando({
  cuantos,
  quien,
  onListo,
}: {
  cuantos: number;
  quien: "mecánicos" | "grúas";
  onListo: () => void;
}) {
  const avisar = useEffectEvent(onListo);

  useEffect(() => {
    const espera = window.setTimeout(avisar, 2400);
    return () => window.clearTimeout(espera);
  }, []);

  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-card bg-surface p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary">
          <MessageCircleIcon size={24} />
        </span>
        <div className="flex flex-col">
          <TextoBrillante className="font-display text-[18px] leading-6 font-extrabold">
            Consultando disponibilidad por WhatsApp...
          </TextoBrillante>
          <span className="text-[14px] leading-5 text-ink-muted">
            Les preguntamos a los {quien} cercanos si pueden ir ahora.
          </span>
        </div>
      </div>
      {Array.from({ length: cuantos }, (_, i) => (
        <Esqueleto key={i} className="h-36 w-full rounded-card" />
      ))}
    </div>
  );
}
