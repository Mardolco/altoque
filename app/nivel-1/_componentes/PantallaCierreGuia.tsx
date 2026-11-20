"use client";

// 12c · Cierre del Nivel 1 (design/pantallas/CierreGuia.dc.html)
//
// 1. "¿Se solucionó el problema?"
// 2. Sí: consejos para que no se repita, y luego el cierre compartido
//    (calificar, confirmar la falla real y el reporte).
//    No: directo a un mecánico o una grúa, con el resumen y la foto que ya
//    están en el flujo (no se vuelve a pedir nada).

import { useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { Aparecer } from "@/components/ui/efectos";
import { CheckIcon, CircleCheckIcon, TruckIcon, WrenchIcon } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { Cierre } from "@/components/flujo/Cierre";
import { useFlujo } from "@/lib/flujo";
import { DIAGNOSTICO_DEMO } from "@/lib/mock/triaje";
import { RUTAS } from "@/lib/rutas";
import { guiaDe, PREVENCION_GENERAL } from "../_datos/guias";

type Etapa = "pregunta" | "consejos" | "cierre" | "ayuda";

export function PantallaCierreGuia() {
  const flujo = useFlujo();
  const [etapa, setEtapa] = useState<Etapa>("pregunta");

  const diagnostico = flujo.diagnostico ?? DIAGNOSTICO_DEMO.diagnostico;
  const guia = guiaDe(diagnostico.falla);

  if (!flujo.cargado) {
    return <TopBar backHref={RUTAS.guia} backLabel="Volver a la guía" />;
  }

  if (etapa === "cierre") return <Cierre camino="guia" />;

  if (etapa === "ayuda") {
    // Una falla de riesgo o sin guía va primero a la grúa; las demás, al mecánico.
    const primeroGrua = diagnostico.nivel === 3;
    const mecanico = (
      <Boton key="mecanico" grua={false} principal={!primeroGrua} />
    );
    const grua = <Boton key="grua" grua principal={primeroGrua} />;

    return (
      <>
        <TopBar
          title="Te ayudamos"
          titleAs="span"
          onBack={() => setEtapa("pregunta")}
          backLabel="Volver a la pregunta"
        />
        <main className="flex flex-1 flex-col gap-3.5 px-5 pt-1 pb-4">
          <h1 className="font-display text-title">No pasa nada, sigamos con ayuda</h1>
          <p className="text-[16px] leading-[23px] text-ink-muted">
            Ya tenemos tu resumen y tu foto. No tendrás que contarlo otra vez.
          </p>

          <section
            aria-label="Resumen de tu caso"
            className="flex items-start gap-3 rounded-card border border-line-soft bg-white p-3.5"
          >
            {flujo.foto && (
              // Data URL ya reducida: next/image no aporta nada.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={flujo.foto}
                alt="La foto que enviaste de tu auto"
                className="size-16 shrink-0 rounded-xl object-cover"
              />
            )}
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-display text-[18px] leading-[23px] font-extrabold">
                {diagnostico.titulo}
              </span>
              <span className="text-[14px] leading-5 text-ink-muted">{diagnostico.resumen}</span>
            </div>
          </section>
        </main>
        <BottomBar surface="white" className="gap-2.5">
          {primeroGrua ? [grua, mecanico] : [mecanico, grua]}
        </BottomBar>
      </>
    );
  }

  if (etapa === "consejos") {
    const consejos = guia?.prevencion ?? PREVENCION_GENERAL;
    return (
      <>
        <TopBar
          title="Para que no se repita"
          titleAs="span"
          onBack={() => setEtapa("pregunta")}
          backLabel="Volver a la pregunta"
        />
        <main className="flex flex-1 flex-col gap-3.5 px-5 pt-1 pb-4">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
              <CircleCheckIcon size={30} strokeWidth={2.4} />
            </span>
            <h1 className="mt-0.5 font-display text-title">¡Qué bien!</h1>
            <p className="text-[16px] leading-[23px] text-ink-muted">
              Estos consejos ayudan a que no te vuelva a pasar.
            </p>
          </div>
          <ul className="flex flex-col gap-2.5">
            {consejos.map((consejo, i) => (
              <Aparecer
                key={consejo}
                como="li"
                retraso={i * 80}
                className="flex items-start gap-3 rounded-card border border-line-soft bg-white px-4 py-3.5 text-[16px] leading-[22px]"
              >
                <CheckIcon size={20} strokeWidth={3} className="mt-px shrink-0 text-ok-ink" />
                <span>{consejo}</span>
              </Aparecer>
            ))}
          </ul>
        </main>
        <BottomBar surface="white">
          <PrimaryButton onClick={() => setEtapa("cierre")}>Continuar</PrimaryButton>
        </BottomBar>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Cierre"
        titleAs="span"
        backHref={RUTAS.guia}
        backLabel="Volver a la guía"
      />
      <main className="flex flex-1 flex-col gap-3.5 px-5 pt-1 pb-4">
        <h1 className="font-display text-title">¿Se solucionó el problema?</h1>
        <p className="text-[16px] leading-[23px] text-ink-muted">
          Cuéntanos cómo te fue con la guía. Si no pudiste, te conectamos con alguien de confianza.
        </p>
      </main>
      <BottomBar surface="white" className="gap-2.5">
        <PrimaryButton onClick={() => setEtapa("consejos")} icon={<CheckIcon size={22} strokeWidth={2.6} />}>
          Sí, se solucionó
        </PrimaryButton>
        <SecondaryButton onClick={() => setEtapa("ayuda")}>No, necesito ayuda</SecondaryButton>
        <TextButton href={RUTAS.guia}>Volver a la guía</TextButton>
      </BottomBar>
    </>
  );
}

function Boton({ grua, principal }: { grua: boolean; principal: boolean }) {
  const href = grua ? RUTAS.gruas : RUTAS.mecanicos;
  const icono = grua ? <TruckIcon size={22} /> : <WrenchIcon size={22} />;
  const texto = grua ? "Necesito una grúa" : "Necesito un mecánico";
  return principal ? (
    <PrimaryButton href={href} icon={icono}>
      {texto}
    </PrimaryButton>
  ) : (
    <SecondaryButton href={href} icon={icono}>
      {texto}
    </SecondaryButton>
  );
}
