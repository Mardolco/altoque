"use client";

// Pedido en curso entre el conductor y el proveedor (mecánico o grúa).
//
// Es la "base de datos" del prototipo: vive en localStorage y se sincroniza al
// instante entre pestañas y marcos del mismo navegador con BroadcastChannel
// (y el evento "storage" como respaldo). Así la vista del conductor y la del
// proveedor (/proveedor, o las dos juntas en /demo) ven el mismo pedido.
//
// No hay servidor: dos celulares distintos NO comparten este estado.

import { useSyncExternalStore } from "react";
import type { Diagnostico, MedioDePago, Proveedor } from "./tipos";
import { desglosar, type Desglose } from "./mock/comision";

// Orden del pedido (corrección 4 del equipo): el proveedor cotiza antes de
// salir, el conductor SOLO ACEPTA la tarifa y paga dentro de la app recién
// cuando recibió la ayuda. Así, si el proveedor no se presenta, no cobra; y
// AlToque sigue cobrando su comisión porque el pago pasa por la app.
//
// solicitado -> cotizado -> aceptado -> en_camino -> llego -> por_pagar -> pagado
//            \-> rechazado
export type EstadoServicio =
  | "solicitado" // el conductor envió el pedido, el proveedor revisa el caso
  | "rechazado" // el proveedor no puede ir
  | "cotizado" // el proveedor envió su tarifa (visita y atención inicial)
  | "aceptado" // el conductor aceptó la tarifa, sin pagar; el proveedor puede salir
  | "en_camino"
  | "llego"
  | "por_pagar" // el trabajo terminó; falta que el conductor pague en la app
  | "pagado"; // el conductor pagó: servicio cerrado, toca calificar

export type Autor = "conductor" | "proveedor" | "sistema";

export type Mensaje = {
  id: string;
  de: Autor;
  texto: string;
  en: number; // Date.now()
  foto?: string; // data URL reducida con lib/imagen.ts
};

export type Cotizacion = {
  detalle: { concepto: string; monto: number }[];
  precio: number; // suma del detalle
  nota: string; // "Incluye mano de obra"
  aprobado?: boolean; // solo para el adicional: el conductor lo aprobó (se paga al final)
};

export type Pago = {
  medio: MedioDePago;
  desglose: Desglose;
  en: number;
  codigo: string; // "ATQ-48213", número de operación simulado
};

export type Servicio = {
  id: string;
  creadoEn: number;
  estado: EstadoServicio;
  proveedor: Proveedor; // copia del proveedor elegido
  conductor: { nombre: string; ubicacion: string; referencia: string };
  diagnostico: Diagnostico | null;
  resumen: string; // resumen de la IA que recibe el proveedor
  foto: string | null;
  mensajes: Mensaje[];
  cotizacion: Cotizacion | null; // tarifa inicial, se acepta antes de que salga
  pago: Pago | null; // un solo pago al final: tarifa + adicional aprobado
  adicional: Cotizacion | null; // repuestos o trabajo extra, cotizado ya en el lugar
  calificacionProveedor: number | null; // estrellas que el proveedor da al conductor
  // Quién responde por el proveedor en la demo: una persona en AlToque Socios
  // ("manual") o el piloto automático del conductor ("auto"). null: aún no se
  // eligió, así que nadie responde solo y la solicitud espera en Socios.
  modoProveedor?: ModoProveedor | null;
  modoDesde?: number | null; // cuándo se eligió el modo, para los tiempos del piloto
};

export type ModoProveedor = "auto" | "manual";

const CLAVE = "altoque.servicio.v3"; // v3: se acepta antes de salir y se paga al final
const CANAL = "altoque.servicio";
const PRESENCIA = "altoque.presencia.proveedor";

let memoria: Servicio | null | undefined;
const oyentes = new Set<() => void>();
let canal: BroadcastChannel | null = null;

function avisar() {
  oyentes.forEach((o) => o());
}

function leerDisco(): Servicio | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Servicio) : null;
  } catch {
    return null;
  }
}

function conectar() {
  if (typeof window === "undefined" || canal || !("BroadcastChannel" in window)) return;
  canal = new BroadcastChannel(CANAL);
  canal.onmessage = () => {
    memoria = leerDisco();
    avisar();
  };
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE) {
      memoria = leerDisco();
      avisar();
    }
  });
}

function leer(): Servicio | null {
  if (memoria === undefined) memoria = leerDisco();
  return memoria;
}

function escribir(siguiente: Servicio | null) {
  memoria = siguiente;
  try {
    if (siguiente) window.localStorage.setItem(CLAVE, JSON.stringify(siguiente));
    else window.localStorage.removeItem(CLAVE);
  } catch {
    // Sin localStorage el pedido sigue en memoria de esta pestaña.
  }
  canal?.postMessage("cambio");
  avisar();
}

function suscribir(oyente: () => void) {
  conectar();
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

/** Pedido actual (o null), reactivo entre pestañas. */
export function useServicio(): Servicio | null {
  return useSyncExternalStore(suscribir, leer, () => null);
}

/** Pedido actual, para manejadores y efectos. */
export function leerServicio(): Servicio | null {
  return leer();
}

const nuevoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Aplica un cambio al pedido actual. No hace nada si no hay pedido. */
export function actualizarServicio(cambio: (s: Servicio) => Servicio) {
  const actual = leer();
  if (actual) escribir(cambio(actual));
}

// ---------------------------------------------------------------------------
// Acciones del flujo. Las dos vistas usan solo estas funciones.
// ---------------------------------------------------------------------------

export function crearServicio(datos: Pick<Servicio, "proveedor" | "conductor" | "diagnostico" | "resumen" | "foto">) {
  const servicio: Servicio = {
    ...datos,
    id: nuevoId(),
    creadoEn: Date.now(),
    estado: "solicitado",
    mensajes: [],
    cotizacion: null,
    pago: null,
    adicional: null,
    calificacionProveedor: null,
    modoProveedor: null,
    modoDesde: null,
  };
  servicio.mensajes.push(mensaje("sistema", `Enviamos tu caso a ${datos.proveedor.nombre}. El chat y el pago quedan protegidos dentro de AlToque.`));
  escribir(servicio);
  return servicio;
}

function mensaje(de: Autor, texto: string, foto?: string): Mensaje {
  return { id: nuevoId(), de, texto, en: Date.now(), foto };
}

export function enviarMensaje(de: Autor, texto: string, foto?: string) {
  actualizarServicio((s) => ({ ...s, mensajes: [...s.mensajes, mensaje(de, texto, foto)] }));
}

const AVISO_ESTADO: Partial<Record<EstadoServicio, (s: Servicio) => string>> = {
  rechazado: (s) => `${s.proveedor.nombre} no puede atenderte ahora. Elige otra opción.`,
  en_camino: (s) => `${s.proveedor.nombre} ya salió hacia tu ubicación.`,
  llego: (s) => `${s.proveedor.nombre} llegó a tu ubicación.`,
  por_pagar: (s) => `${s.proveedor.nombre} terminó el trabajo. Paga en la app para cerrar el servicio.`,
};

export function cambiarEstado(estado: EstadoServicio) {
  actualizarServicio((s) => {
    const aviso = AVISO_ESTADO[estado];
    return { ...s, estado, mensajes: aviso ? [...s.mensajes, mensaje("sistema", aviso(s))] : s.mensajes };
  });
}

export function enviarCotizacion(detalle: Cotizacion["detalle"], nota: string) {
  const precio = detalle.reduce((t, d) => t + d.monto, 0);
  actualizarServicio((s) => ({
    ...s,
    estado: "cotizado",
    cotizacion: { detalle, precio, nota },
    mensajes: [...s.mensajes, mensaje("sistema", `${s.proveedor.nombre} revisó tu caso y envió su tarifa: S/ ${precio.toFixed(2)}. Acéptala para que salga; pagas al final, cuando recibas la ayuda.`)],
  }));
}

/** El conductor acepta la tarifa SIN pagar. El proveedor ya puede salir. */
export function aceptarTarifa() {
  actualizarServicio((s) => {
    if (s.estado !== "cotizado" || !s.cotizacion) return s;
    return {
      ...s,
      estado: "aceptado",
      mensajes: [...s.mensajes, mensaje("sistema", `Aceptaste la tarifa de S/ ${s.cotizacion.precio.toFixed(2)}. No pagas nada todavía: pagas en la app cuando recibas la ayuda. Avisamos a ${s.proveedor.nombre} para que salga.`)],
    };
  });
}

/** El trabajo terminó (lo marca el proveedor o el conductor con "Ya me ayudaron"). Falta pagar. */
export function terminarTrabajo() {
  const s = leer();
  if (s && ["aceptado", "en_camino", "llego"].includes(s.estado)) cambiarEstado("por_pagar");
}

/** Ya en el lugar: el proveedor cotiza repuestos o trabajo extra. */
export function enviarAdicional(detalle: Cotizacion["detalle"], nota: string) {
  const precio = detalle.reduce((t, d) => t + d.monto, 0);
  actualizarServicio((s) => ({
    ...s,
    adicional: { detalle, precio, nota, aprobado: false },
    mensajes: [...s.mensajes, mensaje("sistema", `${s.proveedor.nombre} cotizó un adicional: S/ ${precio.toFixed(2)}. Si lo apruebas, se suma al pago final.`)],
  }));
}

/** El conductor aprueba el adicional. No paga ahora: se suma al pago final. */
export function aprobarAdicional() {
  actualizarServicio((s) => {
    if (!s.adicional) return s;
    return {
      ...s,
      adicional: { ...s.adicional, aprobado: true },
      mensajes: [...s.mensajes, mensaje("sistema", `Aprobaste el adicional de S/ ${s.adicional.precio.toFixed(2)}. Se suma al pago final.`)],
    };
  });
}

/** El conductor no acepta el adicional. */
export function rechazarAdicional() {
  actualizarServicio((s) => ({
    ...s,
    adicional: null,
    mensajes: [...s.mensajes, mensaje("sistema", "No aceptaste el adicional. Si no se puede reparar en el lugar, puedes pedir una grúa.")],
  }));
}

/** Lo que se paga al final: tarifa aceptada + adicional aprobado (la tarifa de servicio una sola vez). */
export function montoAPagar(s: Servicio): Desglose | null {
  if (!s.cotizacion) return null;
  const extra = s.adicional?.aprobado ? s.adicional.precio : 0;
  return desglosar(s.cotizacion.precio + extra);
}

/** El conductor paga al final, cuando ya recibió la ayuda. */
export function pagarServicio(medio: MedioDePago) {
  actualizarServicio((s) => {
    const desglose = montoAPagar(s);
    if (!desglose || s.pago) return s;
    const pago: Pago = { medio, desglose, en: Date.now(), codigo: `ATQ-${Math.floor(10000 + Math.random() * 90000)}` };
    return {
      ...s,
      estado: "pagado",
      pago,
      mensajes: [...s.mensajes, mensaje("sistema", `Pago confirmado con ${medio}: S/ ${desglose.totalConductor.toFixed(2)}. AlToque le entrega S/ ${desglose.netoProveedor.toFixed(2)} a ${s.proveedor.nombre}.`)],
    };
  });
}

/** Lo pagado, para recibos y el panel de /demo (null si aún no se pagó). */
export function totalesPagados(s: Servicio): Desglose | null {
  return s.pago?.desglose ?? null;
}

/** Elige quién responde por el proveedor. Una vez en "manual", el piloto no vuelve a actuar. */
export function elegirModoProveedor(modo: ModoProveedor) {
  actualizarServicio((s) => {
    if ((s.modoProveedor ?? null) === modo) return s;
    const aviso =
      modo === "manual"
        ? `${s.proveedor.nombre} responde desde AlToque Socios.`
        : `${s.proveedor.nombre} (simulado) responderá solo para la demo.`;
    return { ...s, modoProveedor: modo, modoDesde: Date.now(), mensajes: [...s.mensajes, mensaje("sistema", aviso)] };
  });
}

export function borrarServicio() {
  escribir(null);
}

// ---------------------------------------------------------------------------
// Presencia: ¿hay una vista de proveedor abierta? Si no, el conductor usa
// respuestas automáticas para que la demo funcione en un solo celular.
// ---------------------------------------------------------------------------

/** La vista del proveedor llama a esto cada pocos segundos mientras está abierta. */
export function marcarProveedorPresente() {
  try {
    window.localStorage.setItem(PRESENCIA, String(Date.now()));
  } catch {
    // ignorar
  }
}

/** true si una vista de proveedor dio señales en los últimos 6 segundos. */
export function proveedorPresente(): boolean {
  try {
    const t = Number(window.localStorage.getItem(PRESENCIA) ?? 0);
    return Date.now() - t < 6000;
  } catch {
    return false;
  }
}
