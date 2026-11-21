"use client";

import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Aparecer } from "@/components/ui/efectos";
import { CircleCheckIcon, CircleHelpIcon, ClockIcon, MapPinIcon, OctagonAlertIcon } from "@/components/ui/icons";
import { precioEnRango } from "@/lib/formato";
import { soles } from "@/lib/mock/comision";
import { cambiarEstado, type Servicio } from "@/lib/servicio";
import type { Semaforo } from "@/lib/tipos";
import { Cabecera } from "./Cabecera";
import { PORCENTAJE, gananciaEstimada } from "./datos";

const TOTAL = 45; // segundos para responder (solo ambientación)

const SEMAFORO: Record<Semaforo, { texto: string; clases: string; Icono: typeof CircleHelpIcon }> = {
  rojo: { texto: "No debe manejar", clases: "bg-stop-tint text-stop-ink", Icono: OctagonAlertIcon },
  ambar: { texto: "Necesita revisión", clases: "bg-caution-tint text-caution-ink", Icono: CircleHelpIcon },
  verde: { texto: "Puede seguir con cuidado", clases: "bg-ok-tint text-ok-ink", Icono: CircleCheckIcon },
};

function Anillo({ restante }: { restante: number }) {
  const r = 22;
  const largo = 2 * Math.PI * r;
  return (
    <div role="timer" aria-label={`${restante} segundos para responder`} className="relative size-14 shrink-0">
      <svg viewBox="0 0 52 52" className="size-14 -rotate-90" aria-hidden="true">
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--color-line)" strokeWidth="4" />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={largo}
          strokeDashoffset={largo * (1 - restante / TOTAL)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[17px] font-black">
        {restante}
      </span>
    </div>
  );
}

export function Solicitud({ servicio }: { servicio: Servicio }) {
  const { proveedor, diagnostico } = servicio;
  const [restante, setRestante] = useState(TOTAL);

  useEffect(() => {
    const id = setInterval(() => setRestante((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const ganancia = gananciaEstimada(proveedor);
  const sem = diagnostico ? SEMAFORO[diagnostico.semaforo] : null;

  return (
    <>
      <Cabecera proveedor={proveedor} />
      <main className="flex flex-1 flex-col gap-3.5 px-5 py-5">
        <Aparecer>
          <section className="relative rounded-card bg-white p-5 shadow-card ring-2 ring-primary">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-ok-tint px-3 py-1 text-caption text-ok-ink">
                  <span className="relative flex size-2.5">
                    <span className="absolute inset-0 animate-radar rounded-full bg-ok" />
                    <span className="relative size-2.5 rounded-full bg-ok" />
                  </span>
                  Nueva solicitud
                </span>
                <h2 className="mt-2 font-display text-title">{diagnostico?.titulo ?? "Solicitud de ayuda"}</h2>
              </div>
              <Anillo restante={restante} />
            </div>

            {sem && (
              <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-small font-bold ${sem.clases}`}>
                <sem.Icono size={18} />
                {sem.texto}
              </span>
            )}

            <p className="mt-3 text-body">{servicio.resumen}</p>

            {servicio.foto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={servicio.foto} alt="Foto del problema que envió el conductor" className="mt-3 max-h-48 w-full rounded-2xl object-cover" />
            )}

            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-canvas p-3.5">
              <MapPinIcon size={22} className="mt-0.5 shrink-0 text-primary" />
              <div className="text-small">
                <p className="font-bold">{servicio.conductor.ubicacion}</p>
                <p className="text-ink-muted">Referencia: {servicio.conductor.referencia}</p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-small text-ink-muted">
              <ClockIcon size={18} />
              {proveedor.tipo === "mecanico" ? `${proveedor.distanciaKm} km de ti` : "Cerca de ti"}
              {proveedor.minutos !== null && ` · llegas en ${proveedor.minutos} min`}
            </p>
          </section>
        </Aparecer>

        <Aparecer retraso={80}>
          <section className="rounded-card bg-ink p-5 text-white">
            <p className="text-small text-white/70">Ganarías aprox.</p>
            {ganancia ? (
              <p className="font-display text-[28px] leading-9 font-black">
                {soles(ganancia.min)} a {soles(ganancia.max)}
              </p>
            ) : (
              <p className="font-display text-heading">Tú defines el precio al cotizar</p>
            )}
            <p className="mt-1 text-caption text-white/70">
              Referencial, neto de la comisión de AlToque ({PORCENTAJE})
              {proveedor.precio && `. Precio del servicio: ${precioEnRango(proveedor.precio)}`}
            </p>
          </section>
        </Aparecer>
      </main>

      <div className="sticky bottom-0 z-10 flex flex-col gap-2.5 border-t border-line bg-canvas px-5 pt-3 pb-4">
        {restante === 0 && (
          <p className="text-center text-small text-ink-muted">Sigue disponible. Responde cuando puedas.</p>
        )}
        <PrimaryButton onClick={() => cambiarEstado("aceptado")}>Aceptar</PrimaryButton>
        <SecondaryButton size="sm" onClick={() => cambiarEstado("rechazado")}>
          Rechazar
        </SecondaryButton>
      </div>
    </>
  );
}
