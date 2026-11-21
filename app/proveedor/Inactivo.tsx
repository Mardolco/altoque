"use client";

import { useState } from "react";
import { Aparecer } from "@/components/ui/efectos";
import { desglosar, soles } from "@/lib/mock/comision";
import { Cabecera } from "./Cabecera";
import { HOY_ANTES, PORCENTAJE } from "./datos";
import type { Proveedor } from "@/lib/tipos";

export function Inactivo({ proveedor, rechazado = false }: { proveedor: Proveedor; rechazado?: boolean }) {
  const [enLinea, setEnLinea] = useState(true);
  const d = desglosar(HOY_ANTES.bruto);

  return (
    <>
      <Cabecera proveedor={proveedor} enLinea={enLinea} />
      <main className="flex flex-1 flex-col gap-4 px-5 py-5">
        <Aparecer>
          <section className="rounded-card bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-heading">
                  {enLinea ? "Conectado, esperando solicitudes" : "Desconectado"}
                </h2>
                <p className="mt-1 text-small text-ink-muted">
                  {rechazado
                    ? "Rechazaste la última solicitud. Seguimos buscándote nuevos pedidos."
                    : enLinea
                      ? "Te avisamos apenas un conductor cerca te necesite."
                      : "No recibirás solicitudes hasta que te conectes."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enLinea}
                aria-label="Estar en línea"
                onClick={() => setEnLinea((v) => !v)}
                className={`relative h-12 w-[76px] shrink-0 rounded-full transition-colors ${enLinea ? "bg-ok" : "bg-line-strong"}`}
              >
                <span
                  className={`absolute top-1.5 size-9 rounded-full bg-white shadow-card transition-all ${enLinea ? "left-[34px]" : "left-1.5"}`}
                />
              </button>
            </div>
            {enLinea && (
              <div className="mt-4 flex items-center gap-2 text-small font-semibold text-ok-ink">
                <span className="relative flex size-3">
                  <span className="absolute inset-0 animate-radar rounded-full bg-ok" />
                  <span className="relative size-3 rounded-full bg-ok" />
                </span>
                Buscando conductores cerca de {proveedor.tipo === "mecanico" ? proveedor.distrito : "tu zona"}
              </div>
            )}
          </section>
        </Aparecer>

        <Aparecer retraso={80}>
          <section className="rounded-card bg-ink p-5 text-white shadow-card">
            <h2 className="font-display text-heading">Hoy</h2>
            <p className="mt-2 font-display text-[34px] leading-10 font-black">{soles(d.netoProveedor)}</p>
            <p className="text-small text-white/70">ganado neto en {HOY_ANTES.servicios} servicios</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3 text-small">
              <div>
                <dt className="text-white/70">Cobrado</dt>
                <dd className="font-bold">{soles(d.precio)}</dd>
              </div>
              <div>
                <dt className="text-white/70">Comisión AlToque</dt>
                <dd className="font-bold">{soles(d.comision)}</dd>
              </div>
            </dl>
          </section>
        </Aparecer>

        <Aparecer retraso={160}>
          <p className="rounded-card bg-surface px-4 py-3 text-small text-ink">
            Cobras dentro de AlToque. El conductor paga en la app y nosotros retenemos {PORCENTAJE} por el pago
            protegido.
          </p>
        </Aparecer>
      </main>
    </>
  );
}
