"use client";

// 05 · Diagnóstico (design/pantallas/Diagnostico.dc.html)
//
// Muestra el diagnóstico del flujo: semáforo, qué hacer, el camino
// recomendado y los otros caminos. Si se abre sin haber pasado por el
// triaje, usa el ejemplo del diseño.

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { InfoIcon } from "@/components/ui/icons";
import { CAMINOS, PathOption } from "@/components/ui/PathOption";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { LEVEL_DE_SEMAFORO, SeverityCard } from "@/components/ui/SeverityCard";
import { TopBar } from "@/components/ui/TopBar";
import { useFlujo } from "@/lib/flujo";
import { DIAGNOSTICO_DEMO } from "@/lib/mock/triaje";
import { RUTA_DE_NIVEL, RUTAS } from "@/lib/rutas";
import type { Nivel } from "@/lib/tipos";

const NIVELES: Nivel[] = [1, 2, 3];

// Texto de cada camino cuando no es el recomendado.
const OTRO_CAMINO: Record<Nivel, string> = {
  1: "Necesitas gata y llave de ruedas",
  2: "Un mecánico verificado va a donde estás",
  3: "Lleva tu auto a un taller",
};

const ACCION: Record<Nivel, string> = {
  1: "Ver la guía paso a paso",
  2: "Ver mecánicos cercanos",
  3: "Ver grúas cercanas",
};

export function PantallaDiagnostico() {
  const router = useRouter();
  const flujo = useFlujo();

  // Si la IA no está segura, le toca a la otra pantalla.
  const inseguro = flujo.cargado && flujo.diagnostico?.seguro === false;
  useEffect(() => {
    if (inseguro) router.replace(RUTAS.iaNoSegura);
  }, [inseguro, router]);

  const volver = (
    <TopBar
      title="Tu diagnóstico"
      titleAs="span"
      backHref={flujo.preguntas.length > 0 ? RUTAS.preguntas : RUTAS.falla}
      backLabel={flujo.preguntas.length > 0 ? "Volver a las preguntas" : "Volver"}
    />
  );
  if (!flujo.cargado || inseguro) return volver;

  const diagnostico = flujo.diagnostico ?? DIAGNOSTICO_DEMO.diagnostico;
  const notas = flujo.notas ?? DIAGNOSTICO_DEMO.notas;
  const { Icono } = CAMINOS[diagnostico.nivel];

  // La guía del Nivel 1 solo existe para la llanta.
  const otros = NIVELES.filter(
    (nivel) => nivel !== diagnostico.nivel && (nivel !== 1 || diagnostico.falla === "llanta"),
  );

  return (
    <>
      {volver}

      <main className="flex flex-1 flex-col gap-3.5 px-5 pt-1 pb-3">
        <SeverityCard
          level={LEVEL_DE_SEMAFORO[diagnostico.semaforo]}
          fault={diagnostico.titulo}
          detail={notas.detalle}
        />

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

        <PathOption level={diagnostico.nivel} recommended reason={notas.motivo} />

        <section className="shrink-0">
          <h2 className="mb-2 font-display text-[17px] leading-[22px] font-extrabold">
            O elige otro camino
          </h2>
          <div className="flex flex-col gap-2">
            {otros.map((nivel) => (
              <PathOption
                key={nivel}
                level={nivel}
                reason={OTRO_CAMINO[nivel]}
                href={RUTA_DE_NIVEL[nivel]}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomBar surface="white" className="gap-2 pt-2.5!">
        <p className="flex items-center justify-center gap-1.5 text-caption font-normal text-ink-muted">
          <InfoIcon size={16} className="shrink-0" />
          La IA te orienta, no reemplaza a un mecánico.
        </p>
        <PrimaryButton href={RUTA_DE_NIVEL[diagnostico.nivel]} icon={<Icono size={22} />}>
          {ACCION[diagnostico.nivel]}
        </PrimaryButton>
      </BottomBar>
    </>
  );
}
