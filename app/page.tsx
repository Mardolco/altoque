"use client";

// 01 · Inicio (design/pantallas/Main.dc.html)

import Link from "next/link";
import { useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmergencyButton } from "@/components/ui/EmergencyButton";
import {
  CarFrontIcon,
  CheckIcon,
  FallaIcon,
  MapPinIcon,
  MessageCircleIcon,
  NavigationIcon,
} from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { FALLAS } from "@/lib/fallas";
import { useFlujo } from "@/lib/flujo";
import { USUARIO } from "@/lib/mock/usuario";
import { RUTAS } from "@/lib/rutas";

export default function Inicio() {
  const { empezar } = useFlujo();
  const [hoja, setHoja] = useState<"cerrada" | "pendiente" | "enviada">("cerrada");
  const cerrar = () => setHoja("cerrada");
  const { contacto } = USUARIO;

  return (
    <>
      <main className="flex flex-1 flex-col px-5 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex h-[52px] items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="font-display text-[22px] font-black">AlToque</span>
          </div>
          <EmergencyButton />
        </div>

        <div className="mt-6 flex flex-col gap-1.5">
          <h1 className="font-display text-display">Hola, {USUARIO.nombre}</h1>
          <p className="text-[17px] leading-[25px] text-ink-muted">
            Estamos contigo. Cuéntanos qué pasó y te decimos qué hacer.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 self-start rounded-full border border-line bg-white py-2 pr-3.5 pl-2.5 text-[14px] font-semibold">
          <MapPinIcon size={18} className="text-primary" />
          <span>Estás en {USUARIO.ubicacion}</span>
        </div>

        <h2 className="mt-[26px] mb-3 font-display text-[19px] leading-6 font-extrabold">
          ¿Qué está fallando?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {FALLAS.map((falla) => (
            <Link
              key={falla.id}
              href={RUTAS.falla}
              onClick={() => empezar(falla.id)}
              className="flex min-h-[116px] flex-col justify-between gap-3 rounded-card border border-line-soft bg-white p-4 text-ink no-underline shadow-card"
            >
              <span className="flex size-11 items-center justify-center rounded-[14px] bg-surface text-primary">
                <FallaIcon falla={falla.id} size={26} strokeWidth={2} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-display text-[17px] leading-[22px] font-extrabold">
                  {falla.etiqueta}
                </span>
                <span className="text-[14px] leading-[19px] text-ink-muted">{falla.detalle}</span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <BottomBar className="gap-3">
        <PrimaryButton
          size="lg"
          href={RUTAS.falla}
          onClick={() => empezar()}
          icon={<CarFrontIcon size={26} />}
        >
          Tengo una falla
        </PrimaryButton>
        <SecondaryButton onClick={() => setHoja("pendiente")} icon={<NavigationIcon size={22} />}>
          Compartir mi ubicación
        </SecondaryButton>
      </BottomBar>

      <BottomSheet open={hoja !== "cerrada"} onClose={cerrar} title="Compartir mi ubicación">
        {hoja === "enviada" ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2.5 pt-1.5 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
                <CheckIcon size={32} strokeWidth={2.4} />
              </span>
              <h2 className="mt-1 font-display text-[23px] leading-[29px] font-black">
                Listo, {contacto.trato} ya puede ver dónde estás
              </h2>
              <p className="text-[16px] leading-6 text-ink-muted">
                Puedes dejar de compartir cuando quieras.
              </p>
            </div>
            <PrimaryButton onClick={cerrar}>Entendido</PrimaryButton>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-[24px] leading-[30px] font-black">
                Comparte tu ubicación
              </h2>
              <p className="text-[16px] leading-6 text-ink-muted">
                Tu familia verá dónde estás en tiempo real hasta que dejes de compartir.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                <MapPinIcon size={22} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[16px] font-bold">{USUARIO.ubicacion}</span>
                <span className="text-[14px] text-ink-muted">Tu ubicación actual</span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold text-ink-muted">Se enviará a</span>
              <div className="flex min-h-[60px] items-center gap-3 rounded-2xl border-2 border-primary bg-surface px-3.5 py-2">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-[17px] font-black text-primary">
                  {contacto.inicial}
                </span>
                <span className="flex flex-1 flex-col gap-px">
                  <span className="text-[16px] font-bold">{contacto.nombre}</span>
                  <span className="text-[14px]">{contacto.descripcion}</span>
                </span>
                <CheckIcon size={22} strokeWidth={2.6} className="text-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {/* En el prototipo el envío es simulado: no abre WhatsApp. */}
              <PrimaryButton
                onClick={() => setHoja("enviada")}
                icon={<MessageCircleIcon size={22} />}
                className="shadow-none!"
              >
                Enviar por WhatsApp
              </PrimaryButton>
              <TextButton onClick={cerrar}>Ahora no</TextButton>
            </div>
          </>
        )}
      </BottomSheet>
    </>
  );
}
