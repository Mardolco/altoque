"use client";

// 11 · Grúas cercanas (design/pantallas/Gruas.dc.html)
//
// Tres pasos en la misma pantalla:
//   datos     alerta de seguridad, ubicación, dónde está el auto y las ruedas
//   consulta  "Consultando disponibilidad por WhatsApp..." (simulado)
//   lista     hasta 5 grúas, ordenadas, para comparar y elegir

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { CarFrontIcon, NavigationIcon, TruckIcon, MapPinIcon } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { Aparecer } from "@/components/ui/efectos";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { RUTAS } from "@/lib/rutas";
import type { Grua } from "@/lib/tipos";
import { AlertaEmergencia } from "../../nivel-2/_compartido/AlertaEmergencia";
import { CabeceraUsuario } from "../../nivel-2/_compartido/CabeceraUsuario";
import { Consultando } from "../../nivel-2/_compartido/Consultando";
import { HojaEnvio } from "../../nivel-2/_compartido/HojaEnvio";
import { OpcionGrande } from "../../nivel-2/_compartido/OpcionGrande";
import { fijarSeleccion, GPS, useSeleccion } from "../../nivel-2/_compartido/seleccion";
import { useDiagnostico } from "../../nivel-2/_compartido/useDiagnostico";
import { casoEnTexto, gruasPara, incompatibilidad, motivoDe } from "./ordenar";
import { TarjetaGrua } from "./TarjetaGrua";

type Paso = "datos" | "consulta" | "lista";

export function PantallaGruas() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const router = useRouter();
  const sel = useSeleccion();
  const { diagnostico, foto, cargado } = useDiagnostico();
  const [paso, setPaso] = useState<Paso>("datos");
  const [elegida, setElegida] = useState<Grua | null>(null);

  if (!cargado) return <main className="flex-1" aria-busy="true" />;

  const techado = sel.acceso === "techado";
  const listo =
    sel.acceso !== null && sel.ruedas !== null && (!techado || sel.altura !== null);
  const lista = gruasPara(sel);
  const mejor = lista.find((g) => g.disponible && !incompatibilidad(g, sel))?.id;

  if (paso === "datos") {
    return (
      <>
        <TopBar
          title="Grúas cercanas"
          subtitle="Para llevar tu auto a un taller"
          backHref={RUTAS.diagnostico}
          backLabel="Volver al diagnóstico"
        />
        <CabeceraUsuario />
        <main className="flex flex-1 flex-col gap-4 px-5 pb-4">
          <AlertaEmergencia titulo="Primero, tu seguridad">
            No intentes encender el motor. Enciende las luces de emergencia, coloca los triángulos a
            30 metros y sal del vehículo si estás en una vía rápida.
          </AlertaEmergencia>

          <Aparecer retraso={80} como="section" className="flex flex-col gap-2.5">
            <h2 className="font-display text-heading">Dónde estás</h2>
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

          <Aparecer retraso={140} como="fieldset" className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-display text-heading">¿Dónde está el auto?</legend>
            <OpcionGrande
              nombre="acceso"
              valor="abierta"
              elegida={sel.acceso === "abierta"}
              onElegir={() => fijarSeleccion({ acceso: "abierta", altura: null })}
              titulo="En la calle o una vía abierta"
              detalle="Cualquier grúa puede llegar."
              icono={<MapPinIcon size={22} />}
            />
            <OpcionGrande
              nombre="acceso"
              valor="techado"
              elegida={techado}
              onElegir={() => fijarSeleccion({ acceso: "techado" })}
              titulo="En un sótano o estacionamiento techado"
              detalle="Necesitamos una grúa que quepa."
              icono={<CarFrontIcon size={22} />}
            />
          </Aparecer>

          {techado && (
            <Aparecer como="fieldset" className="flex flex-col gap-2.5">
              <legend className="mb-2.5 font-display text-heading">
                ¿Qué altura máxima tiene la entrada?
              </legend>
              <OpcionGrande
                nombre="altura"
                valor="baja"
                elegida={sel.altura === "baja"}
                onElegir={() => fijarSeleccion({ altura: "baja" })}
                titulo="Menos de 2 metros o no sé"
                detalle="Buscamos una grúa baja."
              />
              <OpcionGrande
                nombre="altura"
                valor="alta"
                elegida={sel.altura === "alta"}
                onElegir={() => fijarSeleccion({ altura: "alta" })}
                titulo="2 metros o más"
              />
            </Aparecer>
          )}

          <Aparecer retraso={200} como="fieldset" className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-display text-heading">¿Las ruedas giran?</legend>
            <OpcionGrande
              nombre="ruedas"
              valor="libres"
              elegida={sel.ruedas === "libres"}
              onElegir={() => fijarSeleccion({ ruedas: "libres" })}
              titulo="Sí, giran libres"
              detalle="Sirve una grúa de arrastre o de plataforma."
            />
            <OpcionGrande
              nombre="ruedas"
              valor="trabadas"
              elegida={sel.ruedas === "trabadas"}
              onElegir={() => fijarSeleccion({ ruedas: "trabadas" })}
              titulo="No, están trabadas o dañadas"
              detalle="Hace falta una plataforma o cama baja."
              icono={<TruckIcon size={22} />}
            />
          </Aparecer>
        </main>

        <BottomBar surface="white" className="gap-1">
          <PrimaryButton disabled={!listo} onClick={() => setPaso("consulta")}>
            Ver grúas
          </PrimaryButton>
          <TextButton href={RUTAS.mecanicos}>Prefiero un mecánico</TextButton>
        </BottomBar>
      </>
    );
  }

  if (paso === "consulta") {
    return (
      <>
        <TopBar
          title="Grúas cercanas"
          subtitle="Para llevar tu auto a un taller"
          onBack={() => setPaso("datos")}
        />
        <main className="flex flex-1 flex-col gap-3 px-5 pb-6">
          <Consultando cuantos={3} quien="grúas" onListo={() => setPaso("lista")} />
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Grúas cercanas"
        subtitle="Para llevar tu auto a un taller"
        onBack={() => setPaso("datos")}
        backLabel="Cambiar los datos del auto"
      />
      <CabeceraUsuario />
      <main className="flex flex-1 flex-col gap-3 px-5 pb-6">
        <p className="rounded-2xl bg-surface px-3.5 py-2.5 text-[14px] leading-5">
          <b className="font-extrabold">{GPS.texto}</b>. {casoEnTexto(sel)}
        </p>
        <p className="text-[15px] leading-[22px] text-ink-muted">
          Ordenadas por cercanía, compatibilidad y puntaje. Las tarifas son referenciales.
        </p>

        <ul className="flex flex-col gap-3">
          {lista.map((grua, i) => (
            <li key={grua.id}>
              <Aparecer retraso={i * 70}>
                <TarjetaGrua
                  grua={grua}
                  recomendada={grua.id === mejor}
                  motivo={motivoDe(grua, sel)}
                  incompatible={incompatibilidad(grua, sel)}
                  onElegir={() => setElegida(grua)}
                />
              </Aparecer>
            </li>
          ))}
        </ul>

        <Link
          href={RUTAS.mecanicos}
          className="flex min-h-12 items-center justify-center text-[16px] font-extrabold text-primary no-underline"
        >
          Prefiero un mecánico
        </Link>
      </main>

      {elegida && (
        <HojaEnvio
          proveedor={elegida}
          resumen={diagnostico.resumen}
          foto={foto}
          referencia={sel.referencia}
          extra={casoEnTexto(sel)}
          onClose={() => setElegida(null)}
          onConfirmar={() => {
            fijarSeleccion({ gruaId: elegida.id, destino: null });
            router.push(RUTAS.esperandoGrua);
          }}
        />
      )}
    </>
  );
}
