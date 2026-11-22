// Tarifa inicial que cotiza el proveedor antes de salir (simulada).
//
// Una sola regla para el piloto automático del conductor y para el
// formulario de cotización del proveedor: depende de la falla y de la
// distancia. Cada taller puede cambiar las líneas antes de enviarlas.

import type { Falla, Proveedor } from "../tipos";

export type LineaTarifa = { concepto: string; monto: number };

const MOVILIDAD_POR_KM = 3;
const MANIOBRA_CARGA = 20;

const redondear5 = (n: number) => Math.round(n / 5) * 5;

/** Líneas de la tarifa de visita, según la falla, la distancia y el tipo de grúa. */
export function tarifaInicial(
  proveedor: Proveedor,
  falla: Falla | undefined,
  opciones: { ruedasTrabadas?: boolean } = {},
): LineaTarifa[] {
  if (proveedor.tipo === "grua") {
    const lineas: LineaTarifa[] = [
      { concepto: `Traslado hasta ${proveedor.kmIncluidos} km`, monto: proveedor.precio?.min ?? 120 },
    ];
    if (opciones.ruedasTrabadas || proveedor.modalidad === "plataforma") {
      lineas.push({ concepto: "Maniobra de carga", monto: MANIOBRA_CARGA });
    }
    return lineas;
  }

  const km = proveedor.distanciaKm;
  const movilidad = Math.max(5, redondear5(km * MOVILIDAD_POR_KM));
  const base =
    falla === "llanta"
      ? { concepto: "Visita y cambio de llanta", monto: 60 }
      : falla === "bateria"
        ? { concepto: "Visita y pase de corriente", monto: 50 }
        : { concepto: "Visita y diagnóstico", monto: 60 };
  return [base, { concepto: `Movilidad (${km} km)`, monto: movilidad }];
}

/** Líneas de ejemplo para un adicional cotizado ya en el lugar. */
export function adicionalInicial(falla: Falla | undefined): LineaTarifa[] {
  if (falla === "bateria") return [{ concepto: "Batería nueva", monto: 280 }];
  if (falla === "llanta") return [{ concepto: "Parche o válvula", monto: 25 }];
  return [{ concepto: "Repuesto: válvula", monto: 25 }];
}
