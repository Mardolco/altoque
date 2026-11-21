"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Aparecer } from "@/components/ui/efectos";
import { MapPinIcon } from "@/components/ui/icons";
import { soles } from "@/lib/mock/comision";
import { cambiarEstado, type Servicio } from "@/lib/servicio";
import { Cabecera } from "./Cabecera";
import { EntradaChat, Mensajes } from "./Chat";
import { Cotizar } from "./Cotizar";

const ETIQUETA: Record<string, string> = {
  aceptado: "Aceptaste el pedido",
  en_camino: "Vas en camino",
  llego: "Llegaste al lugar",
  cotizado: "Cotización enviada",
};

export function Trabajo({ servicio }: { servicio: Servicio }) {
  const [componiendo, setComponiendo] = useState(false);
  const { estado, proveedor, conductor } = servicio;

  if (componiendo && estado === "llego") {
    return <Cotizar servicio={servicio} onVolver={() => setComponiendo(false)} />;
  }

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

            <div className="mt-3">
              {estado === "aceptado" && (
                <PrimaryButton size="sm" onClick={() => cambiarEstado("en_camino")}>
                  Voy en camino
                </PrimaryButton>
              )}
              {estado === "en_camino" && (
                <PrimaryButton size="sm" onClick={() => cambiarEstado("llego")}>
                  Llegué
                </PrimaryButton>
              )}
              {estado === "llego" && (
                <PrimaryButton size="sm" onClick={() => setComponiendo(true)}>
                  Enviar cotización
                </PrimaryButton>
              )}
              {estado === "cotizado" && servicio.cotizacion && (
                <p className="rounded-2xl bg-caution-tint px-3.5 py-3 text-small font-semibold text-caution-ink">
                  Cotizaste {soles(servicio.cotizacion.precio)}. Esperando que el conductor pague.
                </p>
              )}
            </div>
          </section>
        </Aparecer>

        <Mensajes mensajes={servicio.mensajes} nombreConductor={conductor.nombre} />
      </main>
      <EntradaChat />
    </>
  );
}
