"use client";

// Tarjeta de una grúa en la lista del Nivel 3: quién viene, cuánto cobra,
// cuánto tarda y si sirve para el caso.

import {
  CheckIcon,
  ClockIcon,
  MessageCircleIcon,
  StarIcon,
  TriangleAlertIcon,
  TruckIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { cx, precioEnRango } from "@/lib/formato";
import type { Grua } from "@/lib/tipos";

type Props = {
  grua: Grua;
  recomendada: boolean;
  motivo: string;
  incompatible: string | null; // por qué no sirve, o null
  onElegir: () => void;
};

export function TarjetaGrua({ grua, recomendada, motivo, incompatible, onElegir }: Props) {
  const libre = grua.disponible;
  const sirve = libre && !incompatible;

  return (
    <article
      aria-label={`${grua.nombre}${recomendada ? ", recomendada" : ""}`}
      className={cx(
        "flex flex-col overflow-hidden rounded-card",
        libre ? "bg-white shadow-card" : "border border-dashed border-line-dash bg-muted",
        libre && (recomendada ? "border-2 border-primary" : "border border-line-soft"),
        libre && incompatible && "opacity-80",
      )}
    >
      {recomendada && (
        <span className="flex items-start gap-1.5 bg-surface px-3.5 py-1.5 text-[13px] leading-[18px] font-bold">
          <CheckIcon size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-primary" />
          Recomendada: {motivo}
        </span>
      )}

      <div className="flex flex-col gap-2.5 px-3.5 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <span
            className={cx(
              "flex size-12 shrink-0 items-center justify-center rounded-full font-display text-[18px] font-black",
              libre ? "bg-surface text-primary" : "bg-line text-ink-muted",
            )}
          >
            {grua.iniciales}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3
                className={cx(
                  "font-display text-[18px] leading-[23px] font-black",
                  !libre && "text-ink-muted",
                )}
              >
                {grua.nombre}
              </h3>
              {grua.verificado && <VerifiedBadge tone={libre ? "default" : "muted"} />}
            </div>
            <span className="text-[14px] leading-[19px] text-ink-muted">
              {grua.conductor} · Placa {grua.placa}
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5 text-[14px] leading-5">
          <li className="flex items-center gap-2">
            <StarIcon size={16} />
            <span>
              <b className="font-extrabold">{grua.calificacion.toFixed(1)} estrellas</b>, {grua.traslados}{" "}
              traslados
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon size={16} className="shrink-0 text-ink-muted" />
            {libre ? (
              <b className="font-extrabold">A {grua.minutos} min de tu ubicación</b>
            ) : (
              <span className="font-bold text-ink-muted">
                Ocupada, disponible desde {grua.disponibleDesde}
              </span>
            )}
          </li>
          <li className="flex items-center gap-2">
            <TruckIcon size={16} className="shrink-0 text-ink-muted" />
            <span>
              Tipo: <b className="font-extrabold">{grua.clase}</b>
              <span className="text-ink-muted"> · Alto {grua.alturaM.toFixed(1)} m</span>
            </span>
          </li>
          {libre && (
            <li
              className={cx(
                "flex items-center gap-2 font-bold",
                incompatible ? "text-caution-ink" : "text-ok-ink",
              )}
            >
              {incompatible ? (
                <TriangleAlertIcon size={16} className="shrink-0" />
              ) : (
                <CheckIcon size={16} strokeWidth={3} className="shrink-0" />
              )}
              <span>{incompatible ?? "Compatible con tu caso"}</span>
            </li>
          )}
          <li className="flex items-center gap-2 text-ok-ink">
            <MessageCircleIcon size={16} className="shrink-0" />
            <span className="font-bold">{grua.respondio}</span>
          </li>
        </ul>

        {grua.precio && (
          <div className="flex flex-col gap-1 border-t border-line-soft pt-2">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[16px] font-extrabold">
                {precioEnRango(grua.precio)} hasta {grua.kmIncluidos} km
              </span>
              <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[12px] font-semibold text-ink-muted">
                referencial
              </span>
            </span>
            <span className="text-[13px] leading-[18px] text-ink-muted">
              Paga con {grua.pagos.join(", ")}
            </span>
          </div>
        )}

        {sirve && (
          <PrimaryButton size="sm" onClick={onElegir}>
            Elegir esta grúa
          </PrimaryButton>
        )}
      </div>
    </article>
  );
}
