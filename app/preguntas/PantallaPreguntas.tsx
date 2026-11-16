"use client";

// 04 · Preguntas de la IA (design/pantallas/Preguntas.dc.html)
//
// Las preguntas vienen de /api/triaje (las guardó Analizando). La pregunta
// actual es la primera sin responder, así que al recargar no se pierde el
// avance. Al terminar, "Ver diagnóstico" vuelve a llamar a /api/triaje, esta
// vez con las respuestas.

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { AnswerButton } from "@/components/ui/AnswerButton";
import { BottomBar } from "@/components/ui/BottomBar";
import { ArrowRightIcon, CheckIcon, InfoIcon, SpinnerIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { cx } from "@/lib/formato";
import { leerFlujo, useFlujo } from "@/lib/flujo";
import { RUTAS, rutaDeDiagnostico } from "@/lib/rutas";
import type { Respuesta } from "@/lib/tipos";
import { pedirTriaje } from "@/lib/triaje";

const OPCIONES: Respuesta[] = ["Sí", "No", "No sé"];

export function PantallaPreguntas() {
  const router = useRouter();
  const { cargado, preguntas, respuestas, diagnostico, guardarRespuestas, guardarDiagnostico } =
    useFlujo();
  const [pidiendo, pedir] = useTransition();
  const [fallo, setFallo] = useState(false);

  const total = preguntas.length;
  const indice = Math.min(respuestas.length, total);
  const terminado = total > 0 && indice >= total;
  const actual = preguntas[Math.min(indice, total - 1)];

  // Sin preguntas no hay nada que mostrar: se entró directo a esta ruta.
  const sinPreguntas = cargado && total === 0;
  useEffect(() => {
    if (sinPreguntas) router.replace(RUTAS.falla);
  }, [sinPreguntas, router]);

  if (!cargado || !actual) return null;

  function responder(respuesta: Respuesta) {
    setFallo(false);
    guardarRespuestas([...respuestas.slice(0, indice), respuesta]);
  }

  function verDiagnostico() {
    if (diagnostico) {
      router.push(rutaDeDiagnostico(diagnostico));
      return;
    }
    setFallo(false);
    pedir(async () => {
      try {
        const respuesta = await pedirTriaje(leerFlujo());
        if (respuesta.tipo !== "diagnostico") throw new Error("Se esperaba un diagnóstico.");
        guardarDiagnostico(respuesta.diagnostico, respuesta.notas);
        pedir(() => router.push(rutaDeDiagnostico(respuesta.diagnostico)));
      } catch {
        setFallo(true);
      }
    });
  }

  const avisos = preguntas.flatMap((pregunta, i) =>
    pregunta.avisoSiNo && respuestas[i] && respuestas[i] !== "Sí" ? [pregunta.avisoSiNo] : [],
  );

  return (
    <>
      {indice === 0 ? (
        <TopBar
          title="Unas preguntas rápidas"
          titleAs="span"
          backHref={RUTAS.falla}
          backLabel="Volver"
        />
      ) : (
        <TopBar
          title="Unas preguntas rápidas"
          titleAs="span"
          onBack={() => guardarRespuestas(respuestas.slice(0, indice - 1))}
          backLabel="Pregunta anterior"
        />
      )}

      <main className="flex flex-1 flex-col gap-[18px] px-5 pt-1 pb-3">
        <ProgressBar
          tone="muted"
          value={Math.min(indice + 1, total)}
          total={total}
          label={terminado ? "Listo, respondiste todo" : `Pregunta ${indice + 1} de ${total}`}
        />

        {terminado ? (
          <div className="mt-1.5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-display text-[29px] leading-[35px] font-black">
                ¡Gracias! Ya tenemos tu diagnóstico
              </h1>
              <p className="text-[17px] leading-[25px] text-ink-muted">
                Con tus respuestas elegimos el camino más seguro para ti.
              </p>
            </div>
            <div className="flex flex-col overflow-hidden rounded-card border border-line-soft bg-white">
              {preguntas.map((pregunta, i) => (
                <div
                  key={pregunta.id}
                  className={cx(
                    "flex min-h-14 items-center justify-between gap-3 px-4",
                    i > 0 && "border-t border-line-soft",
                  )}
                >
                  <span className="text-[16px] leading-[22px]">{pregunta.corto}</span>
                  <span className="shrink-0 rounded-full bg-surface px-3.5 py-[5px] text-[15px] font-bold">
                    {respuestas[i] ?? "Sin respuesta"}
                  </span>
                </div>
              ))}
            </div>
            {avisos.map((aviso) => (
              <SafetyNotice key={aviso} tone="warning">
                {aviso}
              </SafetyNotice>
            ))}
            {fallo && (
              <div role="alert">
                <SafetyNotice tone="warning" title="No pudimos conectarnos">
                  Revisa tu señal y toca «Ver diagnóstico» otra vez.
                </SafetyNotice>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-1.5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="text-[15px] font-semibold text-ink-muted">
                La IA de AlToque pregunta
              </span>
            </div>
            <h1 className="font-display text-[29px] leading-[35px] font-black">{actual.texto}</h1>
            <p className="flex items-start gap-2.5 rounded-2xl border border-line-soft bg-white px-4 py-3.5 text-[16px] leading-[23px]">
              <InfoIcon size={22} className="mt-px shrink-0 text-primary" />
              <span>{actual.ayuda}</span>
            </p>
            {indice > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-semibold text-ink-muted">Ya respondiste</span>
                <div className="flex flex-wrap gap-2">
                  {respuestas.slice(0, indice).map((respuesta, i) => (
                    <span
                      key={preguntas[i].id}
                      className="flex items-center gap-1.5 rounded-full bg-surface py-[7px] pr-3 pl-2.5 text-[14px] font-semibold"
                    >
                      <CheckIcon size={16} strokeWidth={3} className="shrink-0 text-primary" />
                      {preguntas[i].corto}: {respuesta}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomBar>
        {terminado ? (
          <div className="flex flex-col gap-1.5">
            <PrimaryButton
              onClick={verDiagnostico}
              disabled={pidiendo}
              icon={pidiendo ? <SpinnerIcon size={22} /> : undefined}
              iconEnd={pidiendo ? undefined : <ArrowRightIcon size={22} strokeWidth={2.4} />}
            >
              {pidiendo ? "Preparando tu diagnóstico…" : "Ver diagnóstico"}
            </PrimaryButton>
            <TextButton onClick={() => guardarRespuestas([])} disabled={pidiendo}>
              Cambiar respuestas
            </TextButton>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {OPCIONES.map((opcion) => (
              <AnswerButton key={opcion} respuesta={opcion} onClick={() => responder(opcion)} />
            ))}
          </div>
        )}
      </BottomBar>
    </>
  );
}
