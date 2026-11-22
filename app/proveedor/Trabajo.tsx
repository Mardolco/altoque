"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Aparecer } from "@/components/ui/efectos";
import { MapPinIcon } from "@/components/ui/icons";
import { desglosar, soles } from "@/lib/mock/comision";
import { cambiarEstado, type Servicio } from "@/lib/servicio";
import { Cabecera } from "./Cabecera";
import { EntradaChat, Mensajes } from "./Chat";
import { Cotizar } from "./Cotizar";
import { PORCENTAJE } from "./datos";

const ETIQUETA: Record<string, string> = {
  cotizado: "Tarifa enviada",
  pagado: "Pago recibido",
  en_camino: "Vas en camino",
  llego: "Llegaste al lugar",
};

/** Texto del aviso que el sistema deja en el chat cuando el conductor rechaza el adicional. */
const AVISO_RECHAZO = "No aceptaste el adicional";

export function Trabajo({ servicio }: { servicio: Servicio }) {
  const [componiendo, setComponiendo] = useState(false);
  const { estado, proveedor, conductor, adicional, pagoAdicional } = servicio;

  if (componiendo && estado === "llego") {
    return <Cotizar servicio={servicio} adicional onVolver={() => setComponiendo(false)} />;
  }

  const rechazado = !adicional && servicio.mensajes.some((m) => m.texto.startsWith(AVISO_RECHAZO));
  const d = servicio.pago?.desglose ?? desglosar(servicio.cotizacion?.precio ?? 0);

  return (
    <>
      <Cabecera proveedor={proveedor} />
      <main className="flex flex-1 flex-col gap-3.5 px-4 py-4">
        <Aparecer>
          <section className="rounded-card bg-white p-4 shadow-card">
            <p className="text-caption text-primary">{ETIQUETA[estado]}</p>
            <h2 className="font-display text-heading">{servicio.diagnostico?.titulo ?? "Pedido de ayuda"}</h2>
            <p className="mt-1 flex items-start gap-2 text-small text-ink-muted">
              <MapPinIcon size={18} className="mt-0.5 shrink-0" />
              {conductor.ubicacion}. Referencia: {conductor.referencia}
            </p>

            {estado === "cotizado" && servicio.cotizacion && (
              <p className="mt-3 rounded-2xl bg-caution-tint px-3.5 py-3 text-small font-semibold text-caution-ink">
                Cotizaste {soles(servicio.cotizacion.precio)}. Esperando que el conductor acepte y pague.
              </p>
            )}

            {estado === "pagado" && (
              <div className="mt-3 flex flex-col gap-3">
                <p className="rounded-2xl bg-ok-tint px-3.5 py-3 text-small font-semibold text-ok-ink">
                  Pago recibido en AlToque: puedes salir.
                </p>
                <dl className="flex flex-col gap-2 text-body">
                  <div className="flex justify-between">
                    <dt>Precio</dt>
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
                <p className="text-small text-ink-muted">Se deposita al terminar el servicio.</p>
                <PrimaryButton size="sm" onClick={() => cambiarEstado("en_camino")}>
                  Voy en camino
                </PrimaryButton>
              </div>
            )}

            {estado === "en_camino" && (
              <div className="mt-3">
                <PrimaryButton size="sm" onClick={() => cambiarEstado("llego")}>
                  Llegué
                </PrimaryButton>
              </div>
            )}

            {estado === "llego" && (
              <div className="mt-3 flex flex-col gap-2.5">
                {adicional && !pagoAdicional && (
                  <p className="rounded-2xl bg-caution-tint px-3.5 py-3 text-small font-semibold text-caution-ink">
                    Adicional enviado: {soles(adicional.precio)}. Esperando que el conductor lo apruebe.
                  </p>
                )}
                {adicional && pagoAdicional && (
                  <p className="rounded-2xl bg-ok-tint px-3.5 py-3 text-small font-semibold text-ok-ink">
                    Adicional pagado: {soles(adicional.precio)}, neto {soles(pagoAdicional.desglose.netoProveedor)}.
                  </p>
                )}
                {rechazado && (
                  <p className="rounded-2xl bg-stop-tint px-3.5 py-3 text-small font-semibold text-stop-ink">
                    El conductor no aceptó el adicional.
                  </p>
                )}
                {!adicional && (
                  <SecondaryButton size="sm" onClick={() => setComponiendo(true)}>
                    Cotizar adicional
                  </SecondaryButton>
                )}
                <PrimaryButton size="sm" onClick={() => cambiarEstado("finalizado")}>
                  Marcar trabajo terminado
                </PrimaryButton>
              </div>
            )}
          </section>
        </Aparecer>

        <Mensajes mensajes={servicio.mensajes} nombreConductor={conductor.nombre} />
      </main>
      <EntradaChat />
    </>
  );
}
