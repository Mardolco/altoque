"use client";

// Hoja "Esto le enviaremos a ...": ubicación exacta, foto y resumen de la IA.
// "Enviar solicitud" crea el pedido dentro de la app (lib/servicio.ts) y sigue
// al chat. Nada sale de AlToque: no hay WhatsApp ni llamadas reales.

import type { ReactNode } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  FileTextIcon,
  ImageIcon,
  MapPinIcon,
  SendIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { USUARIO } from "@/lib/mock/usuario";
import { crearServicio } from "@/lib/servicio";
import type { Proveedor } from "@/lib/tipos";
import { GPS } from "./seleccion";
import { useDiagnostico } from "./useDiagnostico";

type Props = {
  proveedor: Proveedor | null;
  resumen: string;
  foto: string | null;
  referencia: string;
  extra?: string; // dato adicional del caso, por ejemplo el tipo de acceso
  onClose: () => void;
  onConfirmar: () => void;
};

export function HojaEnvio({ proveedor, resumen, foto, referencia, extra, onClose, onConfirmar }: Props) {
  const { diagnostico } = useDiagnostico();

  if (!proveedor) return null;
  const nombre = proveedor.nombre;
  const ref = referencia.trim();
  const lugar = `${GPS.texto}${ref ? `, ${ref}` : ""}`;

  function enviar() {
    if (!proveedor) return;
    crearServicio({
      proveedor,
      conductor: { nombre: USUARIO.nombre, ubicacion: GPS.texto, referencia: ref },
      diagnostico,
      resumen: `${resumen}${extra ? ` ${extra}` : ""}`,
      foto,
    });
    onConfirmar();
  }

  return (
    <BottomSheet open onClose={onClose} title={`Enviar mi caso a ${proveedor.nombre}`}>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-[24px] leading-[30px] font-black">
          Esto le enviaremos a {nombre}
        </h2>
        <p className="text-[16px] leading-6 text-ink-muted">
          Así no tienes que explicar todo de nuevo.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        <Dato icono={<MapPinIcon size={20} />} titulo="Tu ubicación exacta">
          {lugar}
        </Dato>
        <Dato icono={<ImageIcon size={20} />} titulo="Foto del problema">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={foto}
              alt="Foto que tomaste del problema"
              className="mt-1 h-20 w-28 rounded-xl object-cover"
            />
          ) : (
            "Sin foto"
          )}
        </Dato>
        <Dato icono={<FileTextIcon size={20} />} titulo="Resumen de la IA">
          {resumen}
          {extra ? ` ${extra}` : ""}
        </Dato>
      </ul>

      <p className="flex items-start gap-2.5 rounded-2xl bg-ok-tint px-3.5 py-3 text-[15px] leading-[22px] text-ok-ink">
        <ShieldCheckIcon size={20} className="mt-0.5 shrink-0" />
        <span>El chat y el pago se hacen dentro de AlToque, así tu dinero queda protegido.</span>
      </p>

      <div className="flex flex-col gap-1">
        <PrimaryButton onClick={enviar} icon={<SendIcon size={22} />}>
          Enviar solicitud a {nombre}
        </PrimaryButton>
        <TextButton onClick={onClose}>Volver</TextButton>
      </div>
    </BottomSheet>
  );
}

function Dato({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-surface px-3.5 py-3">
      <span className="mt-0.5 shrink-0 text-primary">{icono}</span>
      <span className="flex min-w-0 flex-col text-[15px] leading-[21px]">
        <b className="font-extrabold">{titulo}</b>
        <span className="text-ink-muted">{children}</span>
      </span>
    </li>
  );
}
