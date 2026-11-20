"use client";

// E3 · Sin mecánicos cerca (design/pantallas/SinMecanicos.dc.html)

import Link from "next/link";
import { useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import {
  ChevronRightIcon,
  ClockIcon,
  PhoneIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Aparecer } from "@/components/ui/efectos";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { enMinuscula, precioEnRango } from "@/lib/formato";
import { GRUA_DEMO } from "@/lib/mock/gruas";
import { MECANICOS } from "@/lib/mock/mecanicos";
import { RUTAS } from "@/lib/rutas";
import { CabeceraUsuario } from "../_compartido/CabeceraUsuario";
import { useDiagnostico } from "../_compartido/useDiagnostico";

export function PantallaSinMecanicos() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const { diagnostico } = useDiagnostico();
  const [llamada, setLlamada] = useState(false);
  const ocupados = MECANICOS.filter((m) => !m.disponible);
  const grua = GRUA_DEMO;

  return (
    <>
      <TopBar
        title="Mecánicos cercanos"
        subtitle={`Para tu ${enMinuscula(diagnostico.titulo)}`}
        backHref={RUTAS.mecanicos}
        backLabel="Volver a mecánicos cercanos"
      />
      <CabeceraUsuario />

      <main className="flex flex-1 flex-col gap-4 px-5 pb-4">
        <Aparecer className="flex items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-ink-muted">
            <WrenchIcon size={26} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[22px] leading-7 font-black">
              No hay mecánicos disponibles cerca ahora
            </h2>
            <p className="text-[16px] leading-[23px] text-ink-muted">
              Los de tu zona están ocupados. Para que no esperes, te proponemos una grúa.
            </p>
          </div>
        </Aparecer>

        {ocupados.map((m) => (
          <Aparecer
            key={m.id}
            retraso={80}
            como="article"
            className="flex flex-col gap-2 rounded-card border border-dashed border-line-dash bg-muted p-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-line font-display text-[18px] font-black text-ink-muted">
                {m.iniciales}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="font-display text-[18px] leading-[23px] font-black text-ink-muted">
                  {m.nombre}
                </span>
                <span className="text-[14px] leading-[19px] text-ink-muted">
                  {m.taller} · {m.especialidad} · {m.calificacion.toFixed(1)} estrellas
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[14px] leading-[19px] font-bold text-ink-muted">
              <ClockIcon size={18} className="shrink-0" />
              Disponible desde {m.disponibleDesde}
            </span>
          </Aparecer>
        ))}

        <Aparecer retraso={160} como="section" className="flex flex-col gap-2">
          <h2 className="font-display text-heading">Te recomendamos</h2>
          <Link
            href={RUTAS.gruas}
            className="flex flex-col gap-2 rounded-card border-2 border-primary bg-white p-3.5 text-ink no-underline shadow-card"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                <TruckIcon size={26} strokeWidth={2} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-display text-[18px] leading-[23px] font-black">
                    {grua.nombre}
                  </span>
                  {grua.verificado && <VerifiedBadge />}
                </span>
                <span className="text-[14px] leading-[19px] text-ink-muted">
                  {grua.clase} · Llega en {grua.minutos} min
                </span>
              </span>
              <ChevronRightIcon size={20} strokeWidth={2.4} className="shrink-0 text-primary" />
            </span>
            {grua.precio && (
              <span className="flex items-center gap-2 border-t border-line-soft pt-2">
                <span className="text-[16px] font-extrabold">{precioEnRango(grua.precio)}</span>
                <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[12px] font-semibold text-ink-muted">
                  referencial
                </span>
              </span>
            )}
          </Link>
        </Aparecer>

        {llamada && (
          <p role="status" className="rounded-2xl bg-ok-tint px-4 py-3 text-[15px] leading-[22px] text-ok-ink">
            Llamada simulada. En la demo no marcamos números reales.
          </p>
        )}
      </main>

      <BottomBar surface="white" className="gap-1">
        <PrimaryButton href={RUTAS.gruas} icon={<TruckIcon size={22} />}>
          Ver grúas cercanas
        </PrimaryButton>
        <TextButton onClick={() => setLlamada(true)} icon={<PhoneIcon size={18} />}>
          Llamar a un mecánico
        </TextButton>
        <TextButton href={RUTAS.mecanicos}>Volver a intentar</TextButton>
      </BottomBar>
    </>
  );
}
