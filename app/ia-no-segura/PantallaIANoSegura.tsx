"use client";

// E1 · La IA no está segura (design/pantallas/IANoSegura.dc.html)
//
// Se llega aquí cuando el diagnóstico trae seguro: false. La IA lo dice y
// deriva a un mecánico. Si se abre sin un diagnóstico así, usa el ejemplo
// del diseño.

import { BottomBar } from "@/components/ui/BottomBar";
import { CameraIcon, InfoIcon, WrenchIcon } from "@/components/ui/icons";
import { PathOption } from "@/components/ui/PathOption";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { LEVEL_DE_SEMAFORO, SeverityCard } from "@/components/ui/SeverityCard";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { useFlujo } from "@/lib/flujo";
import { INSEGURO_DEMO } from "@/lib/mock/triaje";
import { RUTAS } from "@/lib/rutas";

export function PantallaIANoSegura() {
  const flujo = useFlujo();
  const conPreguntas = flujo.preguntas.length > 0;

  const volver = (
    <TopBar
      title="Tu diagnóstico"
      titleAs="span"
      backHref={conPreguntas ? RUTAS.preguntas : RUTAS.falla}
      backLabel={conPreguntas ? "Volver a las preguntas" : "Volver"}
    />
  );
  if (!flujo.cargado) return volver;

  const delFlujo =
    flujo.diagnostico && flujo.notas && !flujo.diagnostico.seguro
      ? { diagnostico: flujo.diagnostico, notas: flujo.notas }
      : null;
  const { diagnostico, notas } = delFlujo ?? INSEGURO_DEMO;
  const conFoto = delFlujo ? Boolean(flujo.foto) : true;

  return (
    <>
      {volver}

      <main className="flex flex-1 flex-col gap-3.5 px-5 pt-1 pb-3">
        <SeverityCard level={LEVEL_DE_SEMAFORO[diagnostico.semaforo]}>
          <h1 className="font-display text-[24px] leading-[30px] font-black">
            {conFoto
              ? "No puedo confirmarlo con la foto, mejor que lo vea un mecánico"
              : "No puedo confirmarlo, mejor que lo vea un mecánico"}
          </h1>
          <p className="text-[15px] leading-[21px] text-ink-muted">
            {notas.detalle}
            {notas.posibles.length > 0 && " Puede ser:"}
          </p>
          {notas.posibles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {notas.posibles.map((posible) => (
                <span
                  key={posible}
                  className="rounded-full border border-caution bg-caution-tint px-3 py-[5px] text-[14px] font-semibold"
                >
                  {posible}
                </span>
              ))}
            </div>
          )}
        </SeverityCard>

        <section className="shrink-0">
          <h2 className="mb-2 font-display text-heading">Qué hacer ahora</h2>
          <ol className="flex flex-col gap-2">
            {diagnostico.queHacer.map((paso, i) => (
              <li key={paso} className="flex items-start gap-3 text-[16px] leading-[22px]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface text-[13px] font-bold">
                  {i + 1}
                </span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>
        </section>

        <PathOption level={2} recommended reason={notas.motivo} />
      </main>

      <BottomBar surface="white" className="gap-1.5 pt-2.5!">
        <p className="mb-0.5 flex items-center justify-center gap-1.5 text-caption font-normal text-ink-muted">
          <InfoIcon size={16} className="shrink-0" />
          La IA te orienta, no reemplaza a un mecánico.
        </p>
        <PrimaryButton href={RUTAS.mecanicos} icon={<WrenchIcon size={22} />}>
          Ver mecánicos cercanos
        </PrimaryButton>
        <TextButton href={RUTAS.falla} icon={<CameraIcon size={20} />}>
          {conFoto ? "Tomar otra foto" : "Tomar una foto"}
        </TextButton>
      </BottomBar>
    </>
  );
}
