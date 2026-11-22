"use client";

import { StarRating } from "@/components/ui/StarRating";
import { Aparecer } from "@/components/ui/efectos";
import { CircleCheckIcon } from "@/components/ui/icons";
import { desglosar, soles } from "@/lib/mock/comision";
import { actualizarServicio, totalesPagados, type Servicio } from "@/lib/servicio";
import { Cabecera } from "./Cabecera";
import { HOY_ANTES, PORCENTAJE } from "./datos";

export function Cobrado({ servicio }: { servicio: Servicio }) {
  const { proveedor } = servicio;
  // Incluye el adicional si el conductor lo pagó.
  const d = totalesPagados(servicio) ?? desglosar(servicio.cotizacion?.precio ?? 0);
  const antes = desglosar(HOY_ANTES.bruto);

  return (
    <>
      <Cabecera proveedor={proveedor} />
      <main className="flex flex-1 flex-col gap-3.5 px-5 py-5">
        <Aparecer>
          <section className="rounded-card bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
                <CircleCheckIcon size={28} />
              </span>
              <h2 className="font-display text-title">Pago recibido en AlToque</h2>
            </div>
            <dl className="mt-4 flex flex-col gap-2 text-body">
              <div className="flex justify-between">
                <dt>Precio cobrado</dt>
                <dd className="font-bold">{soles(d.precio)}</dd>
              </div>
              <div className="flex justify-between text-ink-muted">
                <dt>Comisión AlToque ({PORCENTAJE})</dt>
                <dd>- {soles(d.comision)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-display text-heading">
                <dt>Neto que recibes</dt>
                <dd className="text-ok-ink">{soles(d.netoProveedor)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-small text-ink-muted">
              Se deposita en tu cuenta en breve.{servicio.adicional?.aprobado && " Incluye el adicional."}
            </p>
          </section>
        </Aparecer>

        <>
            <Aparecer retraso={80}>
              <section className="rounded-card bg-white p-5 shadow-card">
                <h2 className="text-center font-display text-heading">Califica al conductor</h2>
                <StarRating
                  mode="input"
                  className="mt-2"
                  value={servicio.calificacionProveedor ?? 0}
                  onChange={(n) => actualizarServicio((s) => ({ ...s, calificacionProveedor: n }))}
                />
                {servicio.calificacionProveedor !== null && (
                  <p className="mt-2 text-center text-small font-semibold text-ok-ink">Gracias por calificar.</p>
                )}
              </section>
            </Aparecer>
            <Aparecer retraso={160}>
              <section className="rounded-card bg-ink p-5 text-white">
                <h2 className="font-display text-heading">Hoy</h2>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-small">
                  <div>
                    <dt className="text-white/70">Servicios</dt>
                    <dd className="font-display text-heading">{HOY_ANTES.servicios + 1}</dd>
                  </div>
                  <div>
                    <dt className="text-white/70">Ganado neto</dt>
                    <dd className="font-display text-heading">{soles(antes.netoProveedor + d.netoProveedor)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/70">Comisión pagada</dt>
                    <dd className="font-display text-heading">{soles(antes.comision + d.comision)}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-caption text-white/70">Incluye este trabajo: {soles(d.netoProveedor)} netos.</p>
              </section>
            </Aparecer>
        </>
      </main>
    </>
  );
}
