"use client";

// 12 · Cierre y 12b · Reporte para compartir (design/pantallas/Cierre.dc.html)
//
// Lo usan los tres niveles:
//   <Cierre camino="guia" />      Nivel 1
//   <Cierre camino="mecanico" />  Nivel 2
//   <Cierre camino="grua" />      Nivel 3
//
// Primero el formulario (calificar, confirmar la falla real y cuánto pagó) y
// luego el reporte para la familia. vista="reporte" abre directo el reporte.
// "Enviar a mi familia" y "Guardar imagen" son simulados, como en el diseño.

import { useState, type ReactNode } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import {
  CheckIcon,
  CircleCheckIcon,
  ClockIcon,
  DownloadIcon,
  FallaIcon,
  FileTextIcon,
  HouseIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { OptionChip } from "@/components/ui/OptionChip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { StarRating } from "@/components/ui/StarRating";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { FALLAS } from "@/lib/fallas";
import { useFlujo } from "@/lib/flujo";
import { enMinuscula, precioEnRango, primerNombre } from "@/lib/formato";
import { CIERRE_DEMO } from "@/lib/mock/cierre";
import { GRUA_DEMO } from "@/lib/mock/gruas";
import { MECANICO_DEMO } from "@/lib/mock/mecanicos";
import { DIAGNOSTICO_DEMO } from "@/lib/mock/triaje";
import { USUARIO } from "@/lib/mock/usuario";
import { soles } from "@/lib/mock/comision";
import { RUTAS } from "@/lib/rutas";
import { borrarServicio, useServicio } from "@/lib/servicio";
import type { Diagnostico, Falla, NotasDiagnostico, Proveedor } from "@/lib/tipos";
import { StarIcon } from "@/components/ui/icons";

export type Camino = "mecanico" | "guia" | "grua";

type Props = {
  camino: Camino;
  vista?: "form" | "reporte";
  /** Quien ayudó, si se eligió en la lista. Sin él se usa el de la demo. */
  proveedor?: Proveedor;
  /** Nivel 3: nombre del taller o la dirección a donde se llevó el auto. */
  destino?: string;
};

const CRITERIOS: Record<"mecanico" | "grua", string[]> = {
  mecanico: ["Puntualidad", "Trato", "Cumplió el precio acordado"],
  grua: ["Puntualidad", "Cuidado del vehículo", "Cumplió el precio acordado"],
};

const OTRA_COSA = "Otra cosa";
const LUGAR = `en la ${USUARIO.ubicacion}`;

/** Cierre del Nivel 1 según la falla que se resolvió con la guía. */
const TEXTOS_GUIA: Record<Falla, { sub: string; hecho: string; pendiente: string }> = {
  llanta: {
    sub: "Cambiaste la llanta con la guía. ¡Bien hecho!",
    hecho: "cambió la llanta por el repuesto",
    pendiente: "reparar la llanta pinchada en una llantería esta semana.",
  },
  bateria: {
    sub: "Arrancaste el auto con la guía. ¡Bien hecho!",
    hecho: "arrancó el auto pasando corriente desde otra batería",
    pendiente: "revisar la batería en un taller esta semana, por si ya terminó su vida útil.",
  },
  luz_tablero: {
    sub: "Revisaste la luz del tablero con la guía. ¡Bien hecho!",
    hecho: "revisó la luz del tablero",
    pendiente: "hacer revisar el auto en un taller si la luz vuelve a prender.",
  },
  otra: {
    sub: "Resolviste el problema con la guía. ¡Bien hecho!",
    hecho: "atendió la falla",
    pendiente: "hacer revisar el auto en un taller esta semana.",
  },
};

/** Textos que cambian según quién resolvió el problema. */
function textosDe(camino: Camino, falla: Falla, esLlanta: boolean, proveedor?: Proveedor, destino?: string) {
  if (camino === "guia") {
    const guia = TEXTOS_GUIA[falla];
    return {
      sub: guia.sub,
      preguntaCal: "¿Te sirvió la guía?",
      conCosto: false,
      montoInicial: CIERRE_DEMO.monto.guia,
      queSeHizo: `${USUARIO.nombre} ${guia.hecho} con la guía paso a paso.`,
      quien: USUARIO.nombre,
      quienDetalle: "Con la guía de AlToque",
      costoDetalle: "Sin costo",
      pendiente: guia.pendiente,
    };
  }

  if (camino === "grua") {
    const grua = proveedor?.tipo === "grua" ? proveedor : GRUA_DEMO;
    return {
      sub: `${grua.nombre} llevó tu auto${destino ? ` a ${destino}` : " al taller"}.`,
      preguntaCal: `¿Cómo te ayudó ${grua.nombre}?`,
      conCosto: true,
      montoInicial: CIERRE_DEMO.monto.grua,
      queSeHizo: `Una ${enMinuscula(grua.descripcion)} llevó el auto ${destino ? `a ${destino}` : "al taller"} para repararlo.`,
      quien: grua.nombre,
      quienDetalle: `${grua.descripcion} · Placa ${grua.placa} · Verificado`,
      costoDetalle: grua.precio ? `Precio referencial: ${precioEnRango(grua.precio)}` : "",
      pendiente: "recoger el auto cuando el taller avise.",
    };
  }

  const mecanico = proveedor?.tipo === "mecanico" ? proveedor : MECANICO_DEMO;
  const nombre = primerNombre(mecanico.nombre);
  return {
    sub: esLlanta
      ? `${nombre} puso tu llanta de repuesto. Ya puedes seguir tu camino.`
      : `${nombre} te ayudó donde estabas. Ya puedes seguir tu camino.`,
    preguntaCal: `¿Cómo te ayudó ${nombre}?`,
    conCosto: true,
    montoInicial: CIERRE_DEMO.monto.mecanico,
    queSeHizo: esLlanta
      ? `${mecanico.nombre} puso la llanta de repuesto en el mismo lugar.`
      : `${mecanico.nombre} atendió la falla en el mismo lugar.`,
    quien: mecanico.nombre,
    quienDetalle: `${mecanico.taller} · Verificado · ${mecanico.calificacion.toFixed(1)}`,
    costoDetalle: mecanico.precio ? `Precio referencial: ${precioEnRango(mecanico.precio)}` : "",
    pendiente: esLlanta
      ? "reparar la llanta pinchada en una llantería esta semana."
      : "llevar el auto a un taller para una revisión completa.",
  };
}

/** Opciones de "¿Cuál fue la falla real?". La primera es lo que dijo la IA. */
function fallasPosibles(diagnostico: Diagnostico, notas: NotasDiagnostico): string[] {
  if (!diagnostico.seguro) {
    const posibles =
      notas.posibles.length > 0
        ? notas.posibles
        : FALLAS.filter((falla) => falla.id !== "otra").map((falla) => falla.etiqueta);
    return [...posibles, OTRA_COSA];
  }
  if (diagnostico.falla === "llanta") {
    return ["Llanta pinchada", "Válvula dañada", "Aro dañado", OTRA_COSA];
  }
  return [diagnostico.titulo, OTRA_COSA];
}

/**
 * "Qué pasó" del reporte, según la falla real que confirmó el usuario. Solo
 * con foto se sabe cuál llanta fue (en la demo, la delantera derecha).
 */
function quePaso(
  fallaReal: string | null,
  falla: Falla,
  esLlanta: boolean,
  conFoto: boolean,
): string {
  if ((!fallaReal || fallaReal !== OTRA_COSA) && falla === "bateria") {
    return `La batería se descargó y el auto no arrancó ${LUGAR}.`;
  }
  if ((!fallaReal || fallaReal !== OTRA_COSA) && falla === "luz_tablero") {
    return `Se prendió una luz en el tablero ${LUGAR}.`;
  }
  if (esLlanta) {
    const llanta = conFoto ? "la llanta delantera derecha" : "una llanta";
    if (fallaReal === "Llanta pinchada") return `Se pinchó ${llanta} ${LUGAR}.`;
    if (fallaReal === "Válvula dañada") return `Se dañó la válvula de ${llanta} ${LUGAR}.`;
    if (fallaReal === "Aro dañado") {
      return conFoto
        ? `Se dañó el aro delantero derecho ${LUGAR}.`
        : `Se dañó el aro de una llanta ${LUGAR}.`;
    }
    return `Hubo una falla en ${llanta} ${LUGAR}.`;
  }
  if (!fallaReal || fallaReal === OTRA_COSA) return `Hubo una falla en el auto ${LUGAR}.`;
  return `Hubo una falla en el auto ${LUGAR}: ${enMinuscula(fallaReal)}.`;
}

function horaActual(): string {
  return new Intl.DateTimeFormat("es-PE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export function Cierre({ camino, vista: vistaInicial = "form", proveedor: elegido, destino }: Props) {
  const flujo = useFlujo();
  const servicio = useServicio();
  // Con un pedido pagado dentro de la app, el monto y el proveedor son los reales.
  const pagado = camino !== "guia" ? (servicio?.pago ?? null) : null;
  const proveedor = (camino !== "guia" ? servicio?.proveedor : undefined) ?? elegido;
  const [vista, setVista] = useState(vistaInicial);
  const [estrellas, setEstrellas] = useState(0);
  const [criterios, setCriterios] = useState([0, 0, 0]);
  const [fallaElegida, setFallaElegida] = useState<string | null>(null);
  const [montoEscrito, setMontoEscrito] = useState<string | null>(null);
  const [hora, setHora] = useState(CIERRE_DEMO.hora);
  const [enviado, setEnviado] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Sin triaje previo (se entró directo a la ruta) se usa el ejemplo del diseño.
  const diagnostico = flujo.diagnostico ?? DIAGNOSTICO_DEMO.diagnostico;
  const notas = flujo.notas ?? DIAGNOSTICO_DEMO.notas;
  const esLlanta = diagnostico.falla === "llanta";
  const conFoto = flujo.diagnostico ? Boolean(flujo.foto) : true;

  const textos = textosDe(camino, diagnostico.falla, esLlanta, proveedor, destino);
  const opciones = fallasPosibles(diagnostico, notas);
  const fallaReal = fallaElegida ?? (diagnostico.seguro ? opciones[0] : null);
  const monto = montoEscrito ?? textos.montoInicial;
  const montoLimpio = monto.replace(/[^0-9.,]/g, "") || "0";
  const montoMostrado = pagado ? soles(pagado.desglose.totalConductor) : `S/ ${montoLimpio}`;
  const detallePagado = pagado ? `Pagado con ${pagado.medio} en AlToque · Operación ${pagado.codigo}` : null;

  /** Al terminar, el pedido en curso ya no hace falta. */
  const terminar = () => borrarServicio();

  function generar() {
    setHora(horaActual());
    setVista("reporte");
  }

  // Al recargar, espera al flujo guardado para no mostrar primero el ejemplo.
  if (!flujo.cargado) {
    return <TopBar backHref={RUTAS.inicio} backLabel="Cerrar y volver al inicio" backIcon="close" />;
  }

  if (vista === "reporte") {
    return (
      <>
        <TopBar title="Reporte para compartir" onBack={() => setVista("form")} />

        <main className="flex flex-1 flex-col gap-3 px-5 pb-4">
          <p className="shrink-0 text-[16px] leading-[23px] text-ink-muted">
            Envíalo a tu familia para que sepan qué pasó y que estás bien.
          </p>

          <article className="flex shrink-0 flex-col overflow-hidden rounded-3xl border border-line-soft bg-white shadow-[0_2px_4px_rgb(11_35_64/0.04),0_10px_24px_rgb(11_35_64/0.08)]">
            <div className="flex items-center justify-between gap-2.5 border-b border-line-soft px-4 py-3.5">
              <span className="flex items-center gap-2">
                <Logo size={28} />
                <span className="flex flex-col">
                  <span className="font-display text-[16px] leading-5 font-black">
                    Reporte de auxilio
                  </span>
                  <span className="text-[12px] leading-4 text-ink-muted">AlToque</span>
                </span>
              </span>
              <span className="text-caption text-ink-muted">Hoy · {hora}</span>
            </div>

            <div className="flex items-center gap-2 bg-ok-tint px-4 py-2.5 text-[16px] leading-[21px] font-extrabold text-ok-ink">
              <CircleCheckIcon size={20} strokeWidth={2.4} className="shrink-0" />
              {USUARIO.nombre} está bien
            </div>

            <dl className="flex flex-col px-4 pt-1.5 pb-1">
              <Dato
                icono={<FallaIcon falla={diagnostico.falla} size={18} />}
                titulo="Qué pasó"
              >
                {quePaso(fallaReal, diagnostico.falla, esLlanta, conFoto)}
              </Dato>
              <Dato icono={<WrenchIcon size={18} />} titulo="Qué se hizo">
                {textos.queSeHizo}
              </Dato>
              <Dato icono={<ShieldCheckIcon size={18} />} titulo="Quién ayudó">
                <b className="font-extrabold">{textos.quien}</b>
                <br />
                <span className="text-ink-muted">{textos.quienDetalle}</span>
              </Dato>
              <Dato
                icono={<span className="text-[13px] font-extrabold">S/</span>}
                titulo="Cuánto costó"
                ultimo
              >
                <b className="font-extrabold">
                  {textos.conCosto ? montoMostrado : "S/ 0"}
                </b>
                <br />
                <span className="text-ink-muted">{detallePagado ?? textos.costoDetalle}</span>
              </Dato>
            </dl>

            <div className="mx-3 mt-1 mb-3 flex items-start gap-2.5 rounded-[14px] bg-surface px-3 py-2.5 text-[14px] leading-5">
              <ClockIcon size={18} className="mt-px shrink-0 text-primary" />
              <span>
                <b className="font-extrabold">Pendiente:</b> {textos.pendiente}
              </span>
            </div>
          </article>
        </main>

        <BottomBar surface="white" className="gap-2.5">
          {enviado ? (
            <div
              role="status"
              className="flex min-h-14 items-center justify-center gap-2.5 rounded-btn border-2 border-ok-ink bg-ok-tint px-5 font-display text-[18px] font-black text-ok-ink"
            >
              <CheckIcon size={22} strokeWidth={2.6} />
              Enviado a {USUARIO.contacto.nombre}
            </div>
          ) : (
            <PrimaryButton
              onClick={() => setEnviado(true)}
              icon={<MessageCircleIcon size={22} />}
              className="text-[18px]!"
            >
              Enviar a mi familia
            </PrimaryButton>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {guardado ? (
              <span
                role="status"
                className="flex min-h-12 items-center justify-center gap-2 text-[15px] font-bold text-ok-ink"
              >
                <CheckIcon size={18} strokeWidth={3} />
                Guardada
              </span>
            ) : (
              <SecondaryButton
                size="sm"
                onClick={() => setGuardado(true)}
                icon={<DownloadIcon size={18} />}
                className="px-1!"
              >
                Guardar imagen
              </SecondaryButton>
            )}
            <SecondaryButton
              size="sm"
              href={RUTAS.inicio}
              onClick={terminar}
              icon={<HouseIcon size={18} />}
              className="px-1!"
            >
              Ir al inicio
            </SecondaryButton>
          </div>
        </BottomBar>
      </>
    );
  }

  return (
    <>
      <TopBar backHref={RUTAS.inicio} onBack={terminar} backLabel="Cerrar y volver al inicio" backIcon="close" />

      <main className="flex flex-1 flex-col gap-3 px-5 pb-4">
        <div className="flex shrink-0 flex-col items-center gap-1.5 pb-1 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
            <CheckIcon size={30} strokeWidth={2.6} />
          </span>
          <h1 className="mt-0.5 font-display text-title">¡Listo! Problema resuelto</h1>
          <p className="text-[16px] leading-[23px] text-ink-muted">{textos.sub}</p>
        </div>

        <section className="flex shrink-0 flex-col items-center gap-1.5 rounded-card border border-line-soft bg-white px-4 py-3.5">
          <h2 className="text-center font-display text-[18px] leading-[23px] font-extrabold">
            {textos.preguntaCal}
          </h2>
          {camino === "guia" ? (
            <StarRating mode="input" value={estrellas} onChange={setEstrellas} />
          ) : (
            <div className="flex w-full flex-col gap-2">
              {CRITERIOS[camino].map((criterio, i) => (
                <Criterio
                  key={criterio}
                  nombre={criterio}
                  valor={criterios[i]}
                  onChange={(n) => setCriterios((c) => c.map((v, j) => (j === i ? n : v)))}
                />
              ))}
            </div>
          )}
        </section>

        <section className="flex shrink-0 flex-col gap-2.5 rounded-card border border-line-soft bg-white px-4 pt-3.5 pb-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display text-[18px] leading-[23px] font-extrabold">
              ¿Cuál fue la falla real?
            </h2>
            <span className="text-[14px] leading-[19px] text-ink-muted">
              {diagnostico.seguro
                ? `La IA dijo «${enMinuscula(diagnostico.titulo)}». Así aprende y acierta más.`
                : "La IA no estaba segura. Así aprende y acierta más."}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {opciones.map((opcion) => (
              <OptionChip
                key={opcion}
                label={opcion}
                selected={opcion === fallaReal}
                onToggle={() => setFallaElegida(opcion)}
                className="gap-1.5! pr-4! pl-3!"
              />
            ))}
          </div>
        </section>

        {textos.conCosto && !pagado && (
          <div className="flex shrink-0 flex-col gap-2">
            <label
              htmlFor="monto-pagado"
              className="font-display text-[17px] leading-[22px] font-extrabold"
            >
              ¿Cuánto pagaste?{" "}
              <span className="font-sans text-[14px] font-medium text-ink-muted">(opcional)</span>
            </label>
            <div className="flex h-14 items-center gap-2 rounded-2xl border-2 border-line-strong bg-white px-4 has-[:focus-visible]:border-primary">
              <span aria-hidden="true" className="text-[18px] font-extrabold">
                S/
              </span>
              <input
                id="monto-pagado"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={monto}
                onChange={(evento) => setMontoEscrito(evento.target.value)}
                className="h-12 min-w-0 flex-1 bg-transparent text-[18px] font-bold text-ink outline-offset-4"
              />
            </div>
          </div>
        )}
      </main>

      <BottomBar surface="white" className="gap-1">
        <PrimaryButton
          onClick={generar}
          icon={<FileTextIcon size={22} />}
          className="text-[18px]!"
        >
          Generar reporte para compartir
        </PrimaryButton>
        <TextButton href={RUTAS.inicio} onClick={terminar}>
          Volver al inicio
        </TextButton>
      </BottomBar>
    </>
  );
}

function Dato({
  icono,
  titulo,
  ultimo = false,
  children,
}: {
  icono: ReactNode;
  titulo: string;
  ultimo?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        ultimo
          ? "relative flex flex-col gap-px py-2.5 pl-11"
          : "relative flex flex-col gap-px border-b border-muted py-2.5 pl-11"
      }
    >
      <dt className="text-[12px] leading-4 font-bold text-ink-muted">
        <span
          aria-hidden="true"
          className="absolute top-2.5 left-0 flex size-8 items-center justify-center rounded-[10px] bg-surface text-primary"
        >
          {icono}
        </span>
        {titulo}
      </dt>
      <dd className="text-[15px] leading-[21px]">{children}</dd>
    </div>
  );
}

/** Una pregunta de calificación con cinco estrellas de 48 px. */
function Criterio({
  nombre,
  valor,
  onChange,
}: {
  nombre: string;
  valor: number;
  onChange: (estrellas: number) => void;
}) {
  return (
    <div role="group" aria-label={nombre} className="flex flex-col items-center gap-0.5">
      <span className="text-[15px] leading-5 font-bold">{nombre}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${nombre}: ${n === 1 ? "1 estrella" : `${n} estrellas`}`}
            aria-pressed={n <= valor}
            onClick={() => onChange(n)}
            className="flex size-12 items-center justify-center rounded-[14px] bg-transparent"
          >
            <StarIcon size={32} filled={n <= valor} />
          </button>
        ))}
      </div>
    </div>
  );
}
