"use client";

// 03 · Analizando (design/pantallas/Analizando.dc.html)
//
// Llama a /api/triaje con lo que contó el usuario. En el diseño la pantalla
// avanza por tiempo; aquí los dos primeros pasos avanzan por tiempo y el
// último termina cuando responde la API. Recién ahí aparece "Continuar".

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CircleIcon,
  FallaIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import { TextoBrillante } from "@/components/ui/efectos";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { cx } from "@/lib/formato";
import { leerFlujo, useFlujo } from "@/lib/flujo";
import { RUTAS, rutaDeDiagnostico } from "@/lib/rutas";
import type { RespuestaTriaje } from "@/lib/tipos";
import { pedirTriaje } from "@/lib/triaje";

type Resultado = { ok: true; respuesta: RespuestaTriaje } | { ok: false };

const MS_POR_PASO = 1200;

export function PantallaAnalizando() {
  const router = useRouter();
  const { cargado, falla, foto, descripcion, editar, guardarPreguntas, guardarDiagnostico } =
    useFlujo();
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [intento, setIntento] = useState(0);
  const [pasosPorTiempo, setPasosPorTiempo] = useState(0);

  useEffect(() => {
    if (!cargado) return;
    const control = new AbortController();

    // Primera llamada: sin respuestas, aunque el flujo guarde unas anteriores.
    const actual = leerFlujo();
    const entrada = { falla: actual.falla, foto: actual.foto, descripcion: actual.descripcion };

    pedirTriaje(entrada, control.signal)
      .then((respuesta) => {
        if (control.signal.aborted) return;
        if (respuesta.tipo === "foto_error") {
          // La foto no sirve: se descarta y el usuario sigue con su descripción.
          editar({ foto: null });
          router.replace(RUTAS.fotoError);
          return;
        }
        setResultado({ ok: true, respuesta });
      })
      .catch(() => {
        if (!control.signal.aborted) setResultado({ ok: false });
      });

    return () => control.abort();
  }, [cargado, intento, editar, router]);

  useEffect(() => {
    const reloj = window.setInterval(
      () => setPasosPorTiempo((pasos) => Math.min(pasos + 1, 2)),
      MS_POR_PASO,
    );
    return () => window.clearInterval(reloj);
  }, []);

  const respuesta = resultado?.ok ? resultado.respuesta : null;
  const fallo = resultado?.ok === false;
  const fase = respuesta ? 3 : pasosPorTiempo;

  const pasos = [
    foto ? "Revisando tu foto" : descripcion.trim() ? "Leyendo tu descripción" : "Revisando tu caso",
    "Comparando con casos parecidos",
    respuesta?.tipo === "diagnostico" ? "Preparando tu diagnóstico" : "Preparando unas preguntas",
  ];

  function continuar() {
    if (respuesta?.tipo === "preguntas") guardarPreguntas(respuesta.preguntas);
    if (respuesta?.tipo === "diagnostico") {
      guardarDiagnostico(respuesta.diagnostico, respuesta.notas);
    }
  }

  function reintentar() {
    setResultado(null);
    setIntento((n) => n + 1);
  }

  const destino =
    respuesta?.tipo === "diagnostico" ? rutaDeDiagnostico(respuesta.diagnostico) : RUTAS.preguntas;

  return (
    <>
      <TopBar backHref={RUTAS.inicio} backLabel="Cancelar y volver al inicio" backIcon="close" />

      <main className="flex flex-1 flex-col items-center gap-[18px] px-5 pb-4">
        <div className="relative mt-1 size-[148px] shrink-0">
          <div className="absolute inset-0 animate-halo rounded-full bg-surface" />
          <svg
            width="148"
            height="148"
            viewBox="0 0 148 148"
            aria-hidden="true"
            className={cx("absolute inset-0", !fallo && "animate-[spin_1.6s_linear_infinite]")}
          >
            <circle cx="74" cy="74" r="69" fill="none" stroke="var(--color-surface)" strokeWidth="6" />
            <path
              d="M74 5a69 69 0 0 1 69 69"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          {foto ? (
            <div
              role="img"
              aria-label="Tu foto de la falla"
              className="absolute top-3.5 left-3.5 size-[120px] rounded-full bg-ink bg-cover bg-center"
              style={{ backgroundImage: `url(${foto})` }}
            />
          ) : (
            <div className="absolute top-3.5 left-3.5 flex size-[120px] items-center justify-center rounded-full bg-ink text-white">
              <FallaIcon falla={falla} size={52} strokeWidth={1.8} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="font-display text-title">Estamos revisando tu caso</h1>
          <p className="text-[17px] leading-[25px] text-ink-muted">
            Respira. En unos segundos te decimos qué hacer.
          </p>
        </div>

        <div
          aria-live="polite"
          className="flex flex-col gap-0.5 self-stretch rounded-card border border-line-soft bg-white px-[18px] py-2.5"
        >
          {pasos.map((texto, i) => (
            <div key={i} className="flex min-h-11 items-center gap-3">
              {fase > i ? (
                <CircleCheckIcon size={24} className="shrink-0 text-ok-ink" />
              ) : fase === i && !fallo ? (
                <SpinnerIcon size={24} className="shrink-0 animate-[spin_0.9s_linear_infinite]" />
              ) : (
                <CircleIcon size={24} strokeWidth={2} className="shrink-0 text-line-strong" />
              )}
              <span
                className={cx(
                  "text-[16px] leading-[22px]",
                  fase === i ? "font-bold" : "font-medium",
                  fase < i && "text-ink-muted",
                )}
              >
                {texto}
              </span>
            </div>
          ))}
        </div>

        {fallo ? (
          <div role="alert" className="self-stretch">
            <SafetyNotice tone="warning" title="No pudimos conectarnos">
              Revisa tu señal e inténtalo otra vez. Tu foto y tu descripción siguen guardadas.
            </SafetyNotice>
          </div>
        ) : (
          <SafetyNotice
            eyebrow="Mientras tanto"
            title="Enciende las luces de emergencia"
            className="self-stretch"
          >
            Es el botón con un triángulo rojo en el tablero.
          </SafetyNotice>
        )}
      </main>

      <BottomBar>
        {respuesta ? (
          <PrimaryButton
            href={destino}
            onClick={continuar}
            iconEnd={<ArrowRightIcon size={22} strokeWidth={2.4} />}
          >
            Continuar
          </PrimaryButton>
        ) : fallo ? (
          <div className="flex flex-col gap-1">
            <PrimaryButton onClick={reintentar}>Intentar de nuevo</PrimaryButton>
            <TextButton href={RUTAS.falla}>Volver a contar qué pasó</TextButton>
          </div>
        ) : (
          <p className="flex min-h-14 items-center justify-center text-[15px]">
            <TextoBrillante>Esto toma unos segundos…</TextoBrillante>
          </p>
        )}
      </BottomBar>
    </>
  );
}
