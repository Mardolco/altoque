"use client";

// 10 · Esperando ayuda y 11b · Grúa en camino (design/pantallas/Esperando.dc.html)
//
// Lo usan dos niveles:
//   <Esperando quien="mecanico" />  Nivel 2
//   <Esperando quien="grua" />      Nivel 3
//
// El mapa, los minutos y el avance son de ejemplo. "Compartir con mi
// familia" es simulado, como en el diseño: no abre WhatsApp.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ChatBubble } from "@/components/ui/ChatBubble";
import {
  CheckIcon,
  HazardIcon,
  LockIcon,
  MessageCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { enlaceLlamada } from "@/lib/contacto";
import { useFlujo } from "@/lib/flujo";
import { primerNombre } from "@/lib/formato";
import { GRUA_DEMO } from "@/lib/mock/gruas";
import { MECANICO_DEMO } from "@/lib/mock/mecanicos";
import { DIAGNOSTICO_DEMO } from "@/lib/mock/triaje";
import { USUARIO } from "@/lib/mock/usuario";
import { RUTAS } from "@/lib/rutas";
import type { Falla, Proveedor } from "@/lib/tipos";

type Props = {
  quien: "mecanico" | "grua";
  /** Quien se eligió en la lista. Sin él se usa el de la demo. */
  proveedor?: Proveedor;
  /** Bloque extra bajo la tarjeta (en el Nivel 3, el destino y el chat). */
  extra?: ReactNode;
};

// Avance simulado: confirmado, en camino, llegó.
const PASOS = ["Confirmado", "En camino", "Llegó"] as const;
const AVANCE = ["15%", "55%", "100%"] as const;
const ESPERA_EN_CAMINO = 3000;
const ESPERA_LLEGADA = 15000;

const LETRA = "var(--font-inter), system-ui, sans-serif";

// Cómo se le cuenta a la familia lo que pasó.
const LO_QUE_PASO: Record<Falla, string> = {
  llanta: "se pinchó una llanta",
  bateria: "el auto se quedó sin batería",
  luz_tablero: "se prendió una luz de aviso en el auto",
  otra: "el auto tuvo una falla",
};

function textosDe(quien: Props["quien"], falla: Falla, proveedor: Proveedor) {
  const { contacto, ubicacion } = USUARIO;
  const saludo = `${contacto.nombre}, ${LO_QUE_PASO[falla]} en la ${ubicacion}, pero estoy bien.`;

  if (proveedor.tipo === "grua") {
    return {
      titulo: `${proveedor.nombre} está en camino`,
      detalle: `${proveedor.clase} · Placa ${proveedor.placa}`,
      mapa: `Mapa: la grúa viene hacia tu ubicación en ${ubicacion}`,
      confirma: `Verifica que la placa sea ${proveedor.placa} y ten a la mano las llaves y los documentos.`,
      mensaje: `${saludo} Una grúa verificada llega en ${proveedor.minutos ?? 20} min para llevar el auto al taller. Aquí puedes ver mi ubicación en vivo.`,
      cierre: RUTAS.cierreGrua,
    };
  }

  const nombre = primerNombre(proveedor.nombre);
  return {
    titulo: `${nombre} está en camino`,
    detalle: proveedor.taller,
    mapa: `Mapa: ${nombre} viene desde ${proveedor.distrito} hacia tu ubicación en ${ubicacion}`,
    confirma: `Cuando llegue, confirma que sea ${proveedor.nombre}, de ${proveedor.taller}.`,
    mensaje: `${saludo} ${nombre}, un mecánico verificado, llega en ${proveedor.minutos ?? 10} min. Aquí puedes ver mi ubicación en vivo.`,
    cierre: RUTAS.cierreMecanico,
  };
}

/** Consejos de seguridad mientras esperas, según la falla y quién viene. */
export function consejosDe(quien: Props["quien"], falla: Falla): string[] {
  const base = [
    "Espera dentro del auto con los seguros puestos.",
    "Deja prendidas las luces de emergencia.",
  ];
  if (quien === "grua") {
    return [
      "No intentes encender el motor.",
      "Si estás en una vía rápida, espera fuera del auto, detrás de la baranda.",
      ...base.slice(1),
    ];
  }
  if (falla === "llanta") return [...base, "No te pares al lado de la pista para mirar la llanta."];
  if (falla === "bateria") return [...base, "Apaga la radio y las luces interiores para no gastar más batería."];
  return [...base, "No abras el capó si ves humo o sientes olor a quemado."];
}

export function Esperando({ quien, proveedor: elegido, extra }: Props) {
  const flujo = useFlujo();
  const [hoja, setHoja] = useState(false);
  const [compartido, setCompartido] = useState(false);
  const [paso, setPaso] = useState(0);
  const [llamada, setLlamada] = useState(false);

  // Avance simulado: tras unos segundos sale, y luego llega.
  useEffect(() => {
    const salida = window.setTimeout(() => setPaso((p) => Math.max(p, 1)), ESPERA_EN_CAMINO);
    const llegada = window.setTimeout(() => setPaso(2), ESPERA_LLEGADA);
    return () => {
      window.clearTimeout(salida);
      window.clearTimeout(llegada);
    };
  }, []);

  // Sin triaje previo (se entró directo a la ruta) se usa el ejemplo del diseño.
  const diagnostico = flujo.diagnostico ?? DIAGNOSTICO_DEMO.diagnostico;
  const proveedor: Proveedor = elegido ?? (quien === "grua" ? GRUA_DEMO : MECANICO_DEMO);
  const textos = textosDe(quien, diagnostico.falla, proveedor);
  const { contacto } = USUARIO;
  const esGrua = proveedor.tipo === "grua";
  const eta = `${proveedor.minutos ?? 10} min`;
  const llego = paso === 2;

  const cerrarHoja = () => setHoja(false);

  return (
    <>
      <TopBar
        title="Ayuda en camino"
        surface="white"
        action={
          <Link
            href={RUTAS.diagnostico}
            className="flex min-h-12 items-center px-2.5 text-[15px] font-bold text-primary no-underline"
          >
            Cancelar
          </Link>
        }
      />

      <svg viewBox="0 0 390 200" role="img" aria-label={textos.mapa} className="block h-auto w-full shrink-0">
        <rect width="390" height="200" fill="#E2EBF4" />
        <g fill="#EEF3F8">
          <rect x="-10" y="-10" width="112" height="64" rx="6" />
          <rect x="118" y="-10" width="104" height="64" rx="6" />
          <rect x="238" y="-10" width="162" height="64" rx="6" />
          <rect x="-10" y="86" width="112" height="36" rx="6" />
          <rect x="118" y="86" width="104" height="36" rx="6" />
          <rect x="238" y="86" width="162" height="36" rx="6" />
          <rect x="-10" y="138" width="112" height="72" rx="6" />
          <rect x="238" y="138" width="162" height="72" rx="6" />
        </g>
        <rect x="118" y="138" width="104" height="72" rx="6" fill="#D5EBDD" />
        <path d="M0 130H390M110 0V200M230 0V200" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M0 70H390" stroke="#FFFFFF" strokeWidth="26" />
        <text x="288" y="74" fontFamily={LETRA} fontSize="11" fontWeight="700" fill="var(--color-ink-muted)">
          {USUARIO.ubicacion}
        </text>
        <path
          d="M110 172V130H230V70H262"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 9"
        />
        <circle cx="262" cy="70" r="20" fill="var(--color-primary)" opacity="0.16" />
        <circle cx="262" cy="70" r="9" fill="var(--color-primary)" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="110" cy="172" r="19" fill="#FFFFFF" stroke="var(--color-primary)" strokeWidth="3" />
        <g
          transform="translate(99 161) scale(0.92)"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {esGrua ? (
            <>
              <path d="M2.5 16.5V7.5h10v9" />
              <path d="M12.5 10.5h4.2l3.3 3.6v2.4h-2" />
              <path d="M9 16.5h6" />
              <circle cx="6.5" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </>
          ) : (
            <path d="M14.5 6.5a4 4 0 0 0-5 5.2l-5.6 5.6a1.9 1.9 0 0 0 2.7 2.7l5.6-5.6a4 4 0 0 0 5.2-5l-2.6 2.6-2.5-.4-.4-2.5 2.6-2.6z" />
          )}
        </g>
        <rect x="136" y="158" width="68" height="28" rx="14" fill="var(--color-ink)" />
        <text x="170" y="177" textAnchor="middle" fontFamily={LETRA} fontSize="13" fontWeight="800" fill="#FFFFFF">
          {eta}
        </text>
      </svg>

      <main className="relative -mt-7 flex flex-1 flex-col gap-4 px-4 pb-4">
        <section className="flex shrink-0 flex-col gap-3 rounded-[22px] border border-line-soft bg-white p-4 shadow-[0_8px_24px_rgb(11_35_64/0.12)]">
          <div className="flex items-center gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface font-display text-[20px] font-black text-primary">
              {proveedor.tipo === "grua" ? (
                <TruckIcon size={28} strokeWidth={2} />
              ) : (
                proveedor.iniciales
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <h2 aria-live="polite" className="font-display text-[21px] leading-[26px] font-black">
                {[`Pedido confirmado`, textos.titulo, `Ya llegó, ${primerNombre(proveedor.nombre)}`][paso]}
              </h2>
              <span className="text-[15px] leading-5">
                <b className="font-extrabold">{llego ? "Ya está contigo" : `Llega en ${eta}`}</b>
                <span className="text-ink-muted"> · {textos.detalle}</span>
              </span>
              {proveedor.verificado && <VerifiedBadge className="self-start" />}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-2 rounded-full bg-primary transition-[width] duration-700"
                style={{ width: AVANCE[paso] }}
              />
            </div>
            <ol aria-label="Estado de la ayuda" className="grid grid-cols-3 gap-1 text-center">
              {PASOS.map((nombre, i) => (
                <li
                  key={nombre}
                  aria-current={i === paso ? "step" : undefined}
                  className={`flex flex-col items-center gap-0.5 text-[13px] leading-[18px] ${
                    i <= paso ? "font-extrabold text-ink" : "text-ink-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-5 items-center justify-center rounded-full ${
                      i <= paso ? "bg-primary text-white" : "bg-line"
                    }`}
                  >
                    {i <= paso && <CheckIcon size={12} strokeWidth={3.4} />}
                  </span>
                  {nombre}
                </li>
              ))}
            </ol>
          </div>
          {/* Sin teléfono en lib/mock, "Llamar" simula la llamada. */}
          <SecondaryButton
            size="sm"
            href={enlaceLlamada(proveedor.telefono)}
            onClick={proveedor.telefono ? undefined : () => setLlamada(true)}
            icon={<PhoneIcon size={18} />}
          >
            Llamar
          </SecondaryButton>
          {llamada && (
            <p role="status" className="rounded-2xl bg-ok-tint px-3.5 py-2.5 text-[14px] leading-5 text-ok-ink">
              Llamada simulada. En la demo no marcamos números reales.
            </p>
          )}
        </section>

        {extra}

        <section className="flex shrink-0 flex-col gap-2.5 px-1">
          <h2 className="font-display text-[17px] leading-[22px] font-extrabold">
            Mientras esperas
          </h2>
          <ul className="flex flex-col gap-2">
            {consejosDe(quien, diagnostico.falla).map((consejo, i) => (
              <Consejo key={consejo} icono={i === 0 ? <LockIcon size={18} /> : <HazardIcon size={18} />}>
                {consejo}
              </Consejo>
            ))}
            <Consejo icono={<ShieldCheckIcon size={18} />}>{textos.confirma}</Consejo>
          </ul>
        </section>
      </main>

      <BottomBar surface="white" className="gap-1">
        {compartido ? (
          <button
            type="button"
            onClick={() => setHoja(true)}
            className="flex min-h-14 items-center justify-center gap-2.5 rounded-btn border-2 border-ok-ink bg-ok-tint px-5 font-display text-[18px] leading-6 font-black text-ok-ink"
          >
            <CheckIcon size={22} strokeWidth={2.6} />
            <span>{mayuscula(contacto.trato)} ya sabe dónde estás</span>
          </button>
        ) : (
          <PrimaryButton onClick={() => setHoja(true)} icon={<UsersIcon size={22} />}>
            Compartir con mi familia
          </PrimaryButton>
        )}
        {llego ? (
          <SecondaryButton href={textos.cierre} className="mt-2">
            Ya me ayudaron
          </SecondaryButton>
        ) : (
          <>
            <TextButton href={textos.cierre}>Ya me ayudaron</TextButton>
            <TextButton onClick={() => setPaso(2)} className="text-[15px]! text-ink-muted!">
              Simular que ya llegó (demo)
            </TextButton>
          </>
        )}
      </BottomBar>

      <BottomSheet
        open={hoja}
        onClose={cerrarHoja}
        title="Compartir con mi familia"
        className="gap-4!"
      >
        {compartido ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2.5 pt-1.5 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
                <CheckIcon size={32} strokeWidth={2.4} />
              </span>
              <h2 className="mt-1 font-display text-[23px] leading-[29px] font-black">
                Listo, {contacto.trato} ya sabe que estás bien
              </h2>
              <p className="text-[16px] leading-6 text-ink-muted">
                Verá tu ubicación en vivo hasta que termines.
              </p>
            </div>
            <PrimaryButton onClick={cerrarHoja} className="shadow-none!">
              Entendido
            </PrimaryButton>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-[24px] leading-[30px] font-black">
                Avísale a tu familia
              </h2>
              <p className="text-[16px] leading-6 text-ink-muted">
                Le enviaremos este mensaje con tu ubicación en vivo.
              </p>
            </div>
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-primary bg-surface px-3.5 py-2">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-[17px] font-black text-primary">
                {contacto.inicial}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-[16px] font-bold">{contacto.nombre}</span>
                <span className="text-[14px]">{contacto.descripcion}</span>
              </span>
              <CheckIcon size={22} strokeWidth={2.6} className="text-primary" />
            </div>
            <ChatBubble
              from="user"
              text={textos.mensaje}
              className="max-w-[88%]! text-[15px]! leading-[22px]!"
            />
            <PrimaryButton
              onClick={() => setCompartido(true)}
              icon={<MessageCircleIcon size={22} />}
              className="shadow-none!"
            >
              Enviar por WhatsApp
            </PrimaryButton>
          </>
        )}
      </BottomSheet>
    </>
  );
}

function Consejo({ icono, children }: { icono: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-[15px] leading-[21px]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
        {icono}
      </span>
      <span>{children}</span>
    </li>
  );
}

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
