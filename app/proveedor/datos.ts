// Datos y ayudas de la app de socios (simulados).

import { COMISION_PROVEEDOR, desglosar } from "@/lib/mock/comision";
import type { Falla, Proveedor } from "@/lib/tipos";

/** Lo que el socio ya ganó hoy antes de este trabajo (inventado). */
export const HOY_ANTES = { servicios: 3, bruto: 250 };

export const PORCENTAJE = `${Math.round(COMISION_PROVEEDOR * 100)} %`;

export function etiquetaTipo(p: Proveedor) {
  return p.tipo === "grua" ? "Grúa" : "Mecánico";
}

/** "Ganarías aprox." neto de comisión, a partir del rango referencial. */
export function gananciaEstimada(p: Proveedor): { min: number; max: number } | null {
  if (!p.precio) return null;
  return { min: desglosar(p.precio.min).netoProveedor, max: desglosar(p.precio.max).netoProveedor };
}

export type Linea = { id: number; concepto: string; monto: string };

/** Líneas de la cotización según la falla (o el traslado de la grúa). */
export function lineasIniciales(falla: Falla | undefined, p: Proveedor): Omit<Linea, "id">[] {
  if (p.tipo === "grua") {
    return [{ concepto: `Traslado hasta ${p.kmIncluidos} km`, monto: String(p.precio?.min ?? 120) }];
  }
  switch (falla) {
    case "llanta":
      return [
        { concepto: "Cambio de llanta", monto: "70" },
        { concepto: "Movilidad", monto: "20" },
      ];
    case "bateria":
      return [
        { concepto: "Pasar corriente", monto: "50" },
        { concepto: "Movilidad", monto: "20" },
      ];
    default:
      return [{ concepto: "Diagnóstico", monto: "60" }];
  }
}

export function aNumero(texto: string) {
  const n = Number(texto.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function hora(en: number) {
  return new Date(en).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}
