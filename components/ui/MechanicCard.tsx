"use client";

// Tarjeta de proveedor. Sirve para mecánicos y para grúas (provider.tipo).
// - Disponible: datos, precio en rango con la etiqueta "referencial" y, si
//   lleva href, toda la tarjeta es un enlace con "Ver perfil".
// - best: borde azul y, arriba, el motivo por el que es la mejor opción.
// - Ocupado (provider.disponible es false): atenuada, con la hora en que se
//   libera y el botón "Avísame".

import Link from "next/link";
import { useState } from "react";
import type { Proveedor } from "@/lib/tipos";
import { cx, precioEnRango } from "@/lib/formato";
import {
  BatteryIcon,
  BellIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  InfoIcon,
  TruckIcon,
  WrenchIcon,
} from "./icons";
import { StarRating } from "./StarRating";
import { VerifiedBadge } from "./VerifiedBadge";

type Props = {
  provider: Proveedor;
  best?: boolean;
  reason?: string; // por defecto, provider.motivo
  href?: string; // perfil del proveedor
  notify?: boolean; // en ocupado, muestra "Avísame" (por defecto, sí)
  className?: string;
};

export function MechanicCard({ provider, best = false, reason, href, notify = true, className }: Props) {
  if (!provider.disponible) {
    return <Ocupado provider={provider} notify={notify} className={className} />;
  }

  const esGrua = provider.tipo === "grua";
  const motivo = reason ?? provider.motivo;
  const marco = cx(
    "flex shrink-0 flex-col overflow-hidden rounded-card bg-white text-ink no-underline shadow-card",
    best ? "border-2 border-primary" : "border border-line-soft",
    className,
  );

  const contenido = (
    <>
      {best && motivo && (
        <span
          className={cx(
            "flex gap-1.5 bg-surface px-3.5 text-[13px] leading-[18px] font-bold",
            esGrua ? "items-start py-1.5" : "items-center py-[5px]",
          )}
        >
          {esGrua ? (
            <InfoIcon size={14} strokeWidth={2.6} className="mt-0.5 shrink-0 text-primary" />
          ) : (
            <CheckIcon size={14} strokeWidth={3} className="shrink-0 text-primary" />
          )}
          <span>{motivo}</span>
        </span>
      )}

      <span className="flex flex-col gap-2 pt-2.5 pr-3 pb-3 pl-3.5">
        <span className="flex items-center gap-3">
          <Avatar provider={provider} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="font-display text-[18px] leading-[23px] font-black">
                {provider.nombre}
              </span>
              {provider.verificado && <VerifiedBadge />}
            </span>
            <span className="text-[14px] leading-[19px] text-ink-muted">
              {esGrua ? provider.descripcion : `${provider.taller} · ${provider.distrito}`}
            </span>
          </span>
        </span>

        <span className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-x-2.5 gap-y-1.5 text-[14px] leading-5">
          {esGrua ? (
            <span className="flex items-center gap-[5px]">
              <TruckIcon size={16} className="shrink-0 text-ink-muted" />
              <span>
                Tipo: <b className="font-extrabold">{provider.clase}</b>
              </span>
            </span>
          ) : (
            <StarRating mode="display" value={provider.calificacion} count={provider.resenas} />
          )}
          {provider.minutos !== null && (
            <span className="flex items-center gap-[5px]">
              <ClockIcon size={16} className="shrink-0 text-ink-muted" />
              <span>
                Llega en <b className="font-extrabold">{provider.minutos} min</b>
              </span>
            </span>
          )}
          {!esGrua && (
            <span className="flex items-center gap-[5px]">
              {provider.fallas.includes("bateria") ? (
                <BatteryIcon size={16} className="shrink-0 text-ink-muted" />
              ) : (
                <WrenchIcon size={16} className="shrink-0 text-ink-muted" />
              )}
              {provider.especialidad}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-bold text-ok-ink">
            <span className="size-2 shrink-0 rounded-full bg-ok" />
            Disponible ahora
          </span>
        </span>

        {provider.precio && (
          <span className="flex items-center justify-between gap-2 border-t border-line-soft pt-2">
            <span className="flex items-center gap-2">
              <span className="text-[16px] font-extrabold">{precioEnRango(provider.precio)}</span>
              <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[12px] font-semibold text-ink-muted">
                referencial
              </span>
            </span>
            {href && (
              <span className="flex items-center gap-0.5 text-[14px] font-bold text-primary">
                Ver perfil
                <ChevronRightIcon size={18} strokeWidth={2.4} />
              </span>
            )}
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${provider.nombre}${best ? ", tu mejor opción" : ""}. Ver perfil`}
        className={marco}
      >
        {contenido}
      </Link>
    );
  }
  return (
    <article
      aria-label={`${provider.nombre}${best ? ", tu mejor opción" : ""}`}
      className={marco}
    >
      {contenido}
    </article>
  );
}

function Avatar({ provider, atenuado = false }: { provider: Proveedor; atenuado?: boolean }) {
  return (
    <span
      className={cx(
        "flex size-12 shrink-0 items-center justify-center rounded-full font-display text-[18px] font-black",
        atenuado ? "bg-line text-ink-muted" : "bg-surface text-primary",
      )}
    >
      {provider.tipo === "grua" ? <TruckIcon size={26} strokeWidth={2} /> : provider.iniciales}
    </span>
  );
}

function Ocupado({
  provider,
  notify,
  className,
}: {
  provider: Proveedor;
  notify: boolean;
  className?: string;
}) {
  const [avisado, setAvisado] = useState(false);
  const desde = provider.disponibleDesde;

  return (
    <article
      aria-label={`${provider.nombre}, ${desde ? `ocupado hasta las ${desde}` : "no disponible ahora"}`}
      className={cx(
        "flex shrink-0 flex-col gap-2 rounded-card border border-dashed border-line-dash bg-muted py-3 pr-3 pl-3.5",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar provider={provider} atenuado />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-display text-[18px] leading-[23px] font-black text-ink-muted">
              {provider.nombre}
            </span>
            {provider.verificado && <VerifiedBadge tone="muted" />}
          </div>
          <span className="text-[14px] leading-[19px] text-ink-muted">
            {provider.tipo === "grua"
              ? provider.descripcion
              : `${provider.taller} · ${provider.especialidad} · ${provider.calificacion.toFixed(1)} (${provider.resenas} reseñas)`}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2.5">
        <span className="flex items-center gap-1.5 text-[14px] leading-[19px] font-bold text-ink-muted">
          <ClockIcon size={18} className="shrink-0" />
          {desde ? `Disponible desde ${desde}` : "No disponible ahora"}
        </span>
        {notify &&
          (avisado ? (
            <span
              role="status"
              className="flex min-h-12 items-center gap-1.5 text-[14px] font-bold text-ok-ink"
            >
              <CheckIcon size={16} strokeWidth={3} />
              Te avisaremos
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAvisado(true)}
              className="flex min-h-12 shrink-0 items-center gap-1.5 rounded-[14px] border-2 border-primary bg-white px-3.5 text-[14px] font-bold text-primary"
            >
              <BellIcon size={16} />
              Avísame
            </button>
          ))}
      </div>
    </article>
  );
}
