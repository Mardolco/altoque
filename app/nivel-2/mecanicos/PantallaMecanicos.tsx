"use client";

// 08 · Mecánicos cercanos (design/pantallas/Mecanicos.dc.html)
//
// Tres pasos en la misma pantalla:
//   datos     confirmar ubicación y si el auto se puede mover
//   consulta  "Consultando disponibilidad..." (simulado)
//   lista     hasta 5 mecánicos, ordenados, para comparar y elegir

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { CarFrontIcon, MapPinIcon, NavigationIcon, WrenchIcon } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { Aparecer } from "@/components/ui/efectos";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { enMinuscula } from "@/lib/formato";
import { RUTAS } from "@/lib/rutas";
import type { Diagnostico, Mecanico } from "@/lib/tipos";
import { AlertaEmergencia } from "../_compartido/AlertaEmergencia";
import { CabeceraUsuario } from "../_compartido/CabeceraUsuario";
import { Consultando } from "../_compartido/Consultando";
import { HojaEnvio } from "../_compartido/HojaEnvio";
import { OpcionGrande } from "../_compartido/OpcionGrande";
import { fijarSeleccion, GPS, leerSeleccion, useSeleccion } from "../_compartido/seleccion";
import { useDiagnostico } from "../_compartido/useDiagnostico";
import { mecanicosPara } from "./ordenar";
import { TarjetaMecanico } from "./TarjetaMecanico";

type Paso = "datos" | "consulta" | "lista";

export function PantallaMecanicos() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

/** Aviso de seguridad según el caso. */
function Alerta({ diagnostico }: { diagnostico: Diagnostico }) {
  if (diagnostico.semaforo === "rojo") {
    return (
      <AlertaEmergencia titulo="No sigas manejando">
        Estaciona en un lugar seguro, apaga el motor y enciende las luces de emergencia.
      </AlertaEmergencia>
    );
  }
  if (diagnostico.falla === "bateria") {
    return (
      <SafetyNotice tone="warning" title="Enciende las luces de emergencia">
        Espera dentro del auto con los seguros puestos hasta que llegue ayuda.
      </SafetyNotice>
    );
  }
  if (diagnostico.falla === "llanta") {
    return (
      <SafetyNotice tone="warning" title="Enciende las luces de emergencia">
        No sigas manejando con la llanta pinchada. Si puedes, aléjate de la pista.
      </SafetyNotice>
    );
  }
  return (
    <SafetyNotice tone="warning" title="Enciende las luces de emergencia">
      Si el auto se comporta raro, no sigas manejando y espera en un lugar seguro.
    </SafetyNotice>
  );
}

function Contenido() {
  const router = useRouter();
  const sel = useSeleccion();
  const { diagnostico, foto, cargado } = useDiagnostico();
  const [paso, setPaso] = useState<Paso>(() => (leerSeleccion().volverALista ? "lista" : "datos"));
  const [elegido, setElegido] = useState<Mecanico | null>(null);

  // Una vez consumida, la marca de "volver a la lista" se apaga.
  useEffect(() => {
    fijarSeleccion({ volverALista: false });
  }, []);

  const lista = sel.movible === null ? [] : mecanicosPara(diagnostico.falla, sel.movible);
  const mejor = lista.find((m) => m.disponible)?.id;

  const sinLibres = lista.length > 0 && !lista.some((m) => m.disponible);
  useEffect(() => {
    if (paso === "lista" && sinLibres) router.replace(RUTAS.sinMecanicos);
  }, [paso, sinLibres, router]);

  if (!cargado) return <main className="flex-1" aria-busy="true" />;

  const subtitulo = `Para tu ${enMinuscula(diagnostico.titulo)}`;

  if (paso === "datos") {
    const listo = sel.movible !== null;
    return (
      <>
        <TopBar
          title="Mecánicos cercanos"
          subtitle={subtitulo}
          backHref={RUTAS.diagnostico}
          backLabel="Volver al diagnóstico"
        />
        <CabeceraUsuario />
        <main className="flex flex-1 flex-col gap-4 px-5 pb-4">
          <Aparecer>
            <Alerta diagnostico={diagnostico} />
          </Aparecer>

          <Aparecer retraso={80} como="section" className="flex flex-col gap-2.5">
            <h2 className="font-display text-heading">1. Confirma dónde estás</h2>
            <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-white p-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                <NavigationIcon size={22} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[14px] leading-5 text-ink-muted">Ubicación por GPS</span>
                <span className="text-[16px] leading-[22px] font-bold">{GPS.texto}</span>
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="referencia" className="text-[15px] leading-5 font-bold">
                Una referencia para encontrarte (opcional)
              </label>
              <input
                id="referencia"
                type="text"
                autoComplete="off"
                placeholder="Frente al grifo, cerca del paradero"
                value={sel.referencia}
                onChange={(e) => fijarSeleccion({ referencia: e.target.value })}
                className="min-h-14 rounded-2xl border-2 border-line-strong bg-white px-4 text-[16px] outline-offset-4 placeholder:text-placeholder focus-visible:border-primary"
              />
            </div>
          </Aparecer>

          <Aparecer retraso={160} como="fieldset" className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-display text-heading">2. ¿El auto se puede mover?</legend>
            <OpcionGrande
              nombre="movible"
              valor="si"
              elegida={sel.movible === true}
              onElegir={() => fijarSeleccion({ movible: true })}
              titulo="Sí, se puede mover"
              detalle="Te mostramos talleres cercanos."
              icono={<CarFrontIcon size={22} />}
            />
            <OpcionGrande
              nombre="movible"
              valor="no"
              elegida={sel.movible === false}
              onElegir={() => fijarSeleccion({ movible: false })}
              titulo="No, no se mueve"
              detalle="Te mostramos mecánicos que van hasta ti."
              icono={<WrenchIcon size={22} />}
            />
          </Aparecer>
        </main>
        <BottomBar surface="white" className="gap-1">
          <PrimaryButton disabled={!listo} onClick={() => setPaso("consulta")}>
            Ver mecánicos
          </PrimaryButton>
          <TextButton href={RUTAS.gruas}>Prefiero una grúa</TextButton>
        </BottomBar>
      </>
    );
  }

  if (paso === "consulta") {
    return (
      <>
        <TopBar title="Mecánicos cercanos" subtitle={subtitulo} onBack={() => setPaso("datos")} />
        <main className="flex flex-1 flex-col gap-3 px-5 pb-6">
          <Consultando cuantos={3} quien="mecánicos" onListo={() => setPaso("lista")} />
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Mecánicos cercanos"
        subtitle={subtitulo}
        onBack={() => setPaso("datos")}
        backLabel="Cambiar ubicación o estado del auto"
      />
      <CabeceraUsuario />
      <main className="flex flex-1 flex-col gap-3 px-5 pb-6">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-3.5 py-2.5 text-[14px] leading-5">
          <MapPinIcon size={18} className="shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <b className="font-extrabold">{GPS.texto}</b>
            {sel.referencia.trim() ? `, ${sel.referencia.trim()}` : ""}
          </span>
          <button
            type="button"
            onClick={() => setPaso("datos")}
            className="min-h-12 shrink-0 px-1 text-[14px] font-bold text-primary"
          >
            Cambiar
          </button>
        </div>

        <p className="text-[15px] leading-[22px] text-ink-muted">
          {sel.movible
            ? "Talleres cercanos donde puedes llevar tu auto."
            : "Mecánicos que van hasta donde estás."}{" "}
          Ordenados por cercanía, puntaje y especialidad.
        </p>

        <ul className="flex flex-col gap-3">
          {lista.map((mecanico, i) => (
            <li key={mecanico.id}>
              <Aparecer retraso={i * 70}>
                <TarjetaMecanico
                  mecanico={mecanico}
                  recomendado={mecanico.id === mejor}
                  hrefPerfil={RUTAS.perfilMecanico(mecanico.id)}
                  onVerPerfil={() => fijarSeleccion({ volverALista: true })}
                  onElegir={() => setElegido(mecanico)}
                />
              </Aparecer>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-0.5 pt-1">
          <Link
            href={RUTAS.sinMecanicos}
            className="flex min-h-12 items-center text-[16px] font-extrabold text-primary no-underline"
          >
            Ninguno me sirve
          </Link>
          <Link
            href={RUTAS.gruas}
            className="flex min-h-12 items-center text-[16px] font-extrabold text-primary no-underline"
          >
            Prefiero una grúa
          </Link>
        </div>
      </main>

      {elegido && (
        <HojaEnvio
          proveedor={elegido}
          resumen={diagnostico.resumen}
          foto={foto}
          referencia={sel.referencia}
          extra={sel.movible ? "El auto se puede mover." : "El auto no se puede mover."}
          onClose={() => setElegido(null)}
          onConfirmar={() => {
            fijarSeleccion({ mecanicoId: elegido.id });
            router.push(RUTAS.servicio);
          }}
        />
      )}
    </>
  );
}
