"use client";

// Tarjeta de un mecánico en la lista del Nivel 2. Muestra todo lo necesario
// para comparar: especialidad, calificación, distancia, tipo de atención,
// precio referencial y medios de pago.

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  StarIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { cx, precioEnRango } from "@/lib/formato";
import type { Mecanico } from "@/lib/tipos";

type Props = {
  mecanico: Mecanico;
  recomendado: boolean;
  hrefPerfil: string;
  onVerPerfil: () => void;
  onElegir: () => void;
};

const ATENCION: Record<Mecanico["atencion"], string> = {
  movil: "Va hasta tu auto",
  taller: "Te atiende en su taller",
  ambos: "Va hasta tu auto o en taller",
};

export function TarjetaMecanico({ mecanico, recomendado, hrefPerfil, onVerPerfil, onElegir }: Props) {
  const libre = mecanico.disponible;

  return (
    <article
      aria-label={`${mecanico.nombre}${recomendado ? ", recomendado" : ""}`}
      className={cx(
        "flex flex-col overflow-hidden rounded-card",
        libre ? "bg-white shadow-card" : "border border-dashed border-line-dash bg-muted",
        libre && (recomendado ? "border-2 border-primary" : "border border-line-soft"),
      )}
    >
      {recomendado && (
        <span className="flex items-center gap-1.5 bg-surface px-3.5 py-[5px] text-[13px] leading-[18px] font-bold">
          <CheckIcon size={14} strokeWidth={3} className="shrink-0 text-primary" />
          Recomendado: {mecanico.motivo ?? "la mejor combinación de cercanía y puntaje"}
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
            {mecanico.iniciales}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3
                className={cx(
                  "font-display text-[18px] leading-[23px] font-black",
                  !libre && "text-ink-muted",
                )}
              >
                {mecanico.nombre}
              </h3>
              {mecanico.verificado && <VerifiedBadge tone={libre ? "default" : "muted"} />}
            </div>
            <span className="text-[14px] leading-[19px] text-ink-muted">
              {mecanico.especialidad} · {mecanico.distrito}
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5 text-[14px] leading-5">
          <li className="flex items-center gap-2">
            <StarIcon size={16} />
            <span>
              <b className="font-extrabold">{mecanico.calificacion.toFixed(1)} estrellas</b>, {mecanico.resenas}{" "}
              servicios
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon size={16} className="shrink-0 text-ink-muted" />
            {libre ? (
              <span>
                <b className="font-extrabold">A {mecanico.minutos} min</b> · {mecanico.distanciaKm.toFixed(1)} km
              </span>
            ) : (
              <span className="font-bold text-ink-muted">
                Ocupado, disponible desde {mecanico.disponibleDesde}
              </span>
            )}
          </li>
          <li className="flex items-center gap-2">
            {mecanico.atencion === "taller" ? (
              <MapPinIcon size={16} className="shrink-0 text-ink-muted" />
            ) : (
              <WrenchIcon size={16} className="shrink-0 text-ink-muted" />
            )}
            <span>{ATENCION[mecanico.atencion]}</span>
          </li>
          <li className="flex items-center gap-2 text-ok-ink">
            <MessageCircleIcon size={16} className="shrink-0" />
            <span className="font-bold">{mecanico.respondio}</span>
          </li>
        </ul>

        {mecanico.precio && (
          <div className="flex flex-col gap-1 border-t border-line-soft pt-2">
            <span className="flex items-center gap-2">
              <span className="text-[16px] font-extrabold">{precioEnRango(mecanico.precio)}</span>
              <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[12px] font-semibold text-ink-muted">
                referencial
              </span>
            </span>
            <span className="text-[13px] leading-[18px] text-ink-muted">
              Paga con {mecanico.pagos.join(", ")}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {libre && (
            <PrimaryButton size="sm" onClick={onElegir}>
              Elegir este mecánico
            </PrimaryButton>
          )}
          <Link
            href={hrefPerfil}
            onClick={onVerPerfil}
            aria-label={`Ver perfil de ${mecanico.nombre}`}
            className="flex min-h-12 items-center justify-center font-display text-[16px] font-extrabold text-primary no-underline"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
