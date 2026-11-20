"use client";

// 06 · Guía paso a paso (design/pantallas/Guia.dc.html)
//
// Paso 0 es "Antes de empezar": diagnóstico con su seguridad en %, alerta de
// seguridad y lo que se necesita. Luego un paso por pantalla; se avanza con
// "Listo, ya lo hice". El chat con la IA es una hoja (ChatIA.dc.html).
// Los botones de mecánico y grúa se ven siempre.

import { useEffect, useRef, useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { Contador } from "@/components/ui/efectos";
import {
  ChevronLeftIcon,
  CheckIcon,
  HazardIcon,
  MessageCircleIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { StepCard } from "@/components/ui/StepCard";
import { TopBar } from "@/components/ui/TopBar";
import { useFlujo } from "@/lib/flujo";
import { RUTAS } from "@/lib/rutas";
import { guiaDe } from "../_datos/guias";
import type { GuiaNivel1 } from "../_datos/tipos";
import { ChatGuia } from "./ChatGuia";
import { Escalar } from "./Escalar";
import { Ilustracion } from "./Ilustraciones";

export function PantallaGuia() {
  const { cargado, diagnostico } = useFlujo();

  // Sin triaje previo (se entró directo a la ruta) se muestra la guía de la llanta.
  const guia = guiaDe(diagnostico?.falla ?? "llanta");

  if (!cargado) {
    return <TopBar backHref={RUTAS.diagnostico} backLabel="Volver al diagnóstico" />;
  }
  if (!guia) return <SinGuia />;
  return <Guia guia={guia} />;
}

function Guia({ guia }: { guia: GuiaNivel1 }) {
  const total = guia.pasos.length;
  const [paso, setPaso] = useState(0); // 0: antes de empezar
  const [chat, setChat] = useState(false);
  const contenido = useRef<HTMLElement>(null);

  useEffect(() => {
    contenido.current?.scrollTo({ top: 0 });
  }, [paso]);

  const actual = paso > 0 ? guia.pasos[paso - 1] : null;
  const esUltimo = paso === total;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <TopBar
        title={guia.titulo}
        titleAs="span"
        subtitle="Nivel 1 · Resuélvelo tú"
        backHref={RUTAS.diagnostico}
        backLabel="Volver al diagnóstico"
      />

      <div className="shrink-0 px-5 pt-1.5">
        <ProgressBar
          value={paso}
          total={total}
          label={paso === 0 ? "Antes de empezar" : `Paso ${paso} de ${total}`}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <main
          ref={contenido}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pt-3 pb-24"
        >
          {actual ? (
            <>
              {actual.alerta && (
                <SafetyNotice tone="warning" title="Ojo con esto">
                  {actual.alerta}
                </SafetyNotice>
              )}
              <StepCard
                title={actual.titulo}
                illustration={<Ilustracion id={actual.ilustracion} />}
                items={actual.indicaciones}
                dont={actual.noHacer}
              />
              {actual.herramientas.length > 0 && (
                <section
                  aria-label="Qué necesitas"
                  className="flex shrink-0 flex-col gap-1.5 rounded-card border border-line-soft bg-white px-4 py-3.5"
                >
                  <span className="flex items-center gap-2 text-[14px] leading-5 font-extrabold text-ink-muted">
                    <WrenchIcon size={18} className="text-primary" />
                    Qué necesitas
                  </span>
                  <ul className="flex flex-col gap-1">
                    {actual.herramientas.map((herramienta) => (
                      <li key={herramienta} className="text-[15px] leading-[21px]">
                        {herramienta}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <Inicio guia={guia} />
          )}
        </main>

        <button
          type="button"
          onClick={() => setChat(true)}
          className="absolute right-4 bottom-3 z-10 flex min-h-[52px] items-center gap-2 rounded-full border-2 border-primary bg-white pr-[18px] pl-3.5 font-display text-[16px] font-black text-primary shadow-float"
        >
          <MessageCircleIcon dots size={22} />
          <span>Pregúntale a la IA</span>
        </button>
      </div>

      <BottomBar surface="white" className="gap-2.5">
        {paso === 0 ? (
          <PrimaryButton
            onClick={() => setPaso(1)}
            iconEnd={<CheckIcon size={22} strokeWidth={2.6} />}
          >
            Estoy a salvo, empezar
          </PrimaryButton>
        ) : (
          <div className="grid grid-cols-[1fr_1.7fr] gap-2.5">
            <SecondaryButton
              onClick={() => setPaso(paso - 1)}
              aria-label={paso === 1 ? "Volver al inicio de la guía" : "Paso anterior"}
              icon={<ChevronLeftIcon size={20} strokeWidth={2.4} />}
            >
              Atrás
            </SecondaryButton>
            {esUltimo ? (
              <PrimaryButton
                href={RUTAS.cierreGuia}
                icon={<CheckIcon size={20} strokeWidth={2.6} />}
                className="text-[18px]! leading-5!"
              >
                Listo, terminé
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onClick={() => setPaso(paso + 1)}
                icon={<CheckIcon size={20} strokeWidth={2.6} />}
                className="text-[18px]! leading-5!"
              >
                Listo, ya lo hice
              </PrimaryButton>
            )}
          </div>
        )}
        <Escalar />
      </BottomBar>

      <ChatGuia abierto={chat} onCerrar={() => setChat(false)} guia={guia} paso={paso} />
    </div>
  );
}

/** Diagnóstico con su seguridad, alerta de seguridad y lo que se necesita. */
function Inicio({ guia }: { guia: GuiaNivel1 }) {
  return (
    <>
      <section className="flex shrink-0 flex-col gap-2.5 rounded-card border border-line-soft bg-white p-4 shadow-card">
        <h1 className="font-display text-[23px] leading-[29px] font-black">{guia.diagnostico}</h1>
        <p className="text-[16px] leading-[23px]">
          <Contador valor={guia.confianza} sufijo=" %" className="font-extrabold text-primary" />{" "}
          de seguridad. Te guiamos paso a paso y puedes pedir ayuda cuando quieras.
        </p>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-line">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${guia.confianza}%` }} />
        </div>
      </section>

      <section
        aria-label="Alerta de seguridad"
        className="flex shrink-0 items-start gap-3.5 rounded-card bg-surface p-4"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-caution text-ink">
          <HazardIcon size={24} />
        </span>
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] leading-[19px] font-bold">Antes de empezar</span>
            <h2 className="font-display text-[19px] leading-6 font-black">Primero, tu seguridad</h2>
          </div>
          <ul className="flex flex-col gap-1.5 text-[15px] leading-[21px]">
            {guia.seguridad.map((punto) => (
              <li key={punto} className="flex items-start gap-2">
                <CheckIcon size={16} strokeWidth={3} className="mt-[3px] shrink-0 text-primary" />
                <span>{punto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-label="Qué vas a necesitar"
        className="flex shrink-0 flex-col gap-1.5 rounded-card border border-line-soft bg-white px-4 py-3.5"
      >
        <span className="flex items-center gap-2 text-[14px] leading-5 font-extrabold text-ink-muted">
          <WrenchIcon size={18} className="text-primary" />
          Qué vas a necesitar
        </span>
        <ul className="flex flex-col gap-1">
          {guia.necesitas.map((cosa) => (
            <li key={cosa} className="text-[15px] leading-[21px]">
              {cosa}
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-start gap-2 text-[14px] leading-5 text-ink-muted">
        <TruckIcon size={18} className="mt-px shrink-0" />
        <span>
          Si no te sientes seguro o algo no se ve bien, usa los botones de abajo: un mecánico o una
          grúa te ayudan.
        </span>
      </p>
    </>
  );
}

/** Se pidió la guía para una falla sin pasos (por ejemplo "Otro"). */
function SinGuia() {
  return (
    <>
      <TopBar
        title="Esta falla necesita ayuda"
        titleAs="span"
        subtitle="Nivel 1 · Resuélvelo tú"
        backHref={RUTAS.diagnostico}
        backLabel="Volver al diagnóstico"
      />
      <main className="flex flex-1 flex-col gap-3.5 px-5 pt-2 pb-4">
        <h1 className="font-display text-title">No tenemos una guía segura para esto</h1>
        <p className="text-[16px] leading-[23px] text-ink-muted">
          Para no arriesgarte, lo mejor es que lo vea alguien de confianza. Ya tenemos tu resumen y
          tu foto, no tendrás que contarlo otra vez.
        </p>
      </main>
      <BottomBar surface="white" className="gap-2.5">
        <PrimaryButton href={RUTAS.mecanicos} icon={<WrenchIcon size={22} />}>
          Necesito un mecánico
        </PrimaryButton>
        <SecondaryButton href={RUTAS.gruas} icon={<TruckIcon size={22} />}>
          Necesito una grúa
        </SecondaryButton>
      </BottomBar>
    </>
  );
}
