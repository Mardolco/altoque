// Modelo de ingresos de AlToque (simulado). Ajusta estos números para el pitch.
//
// - El conductor paga el precio acordado con el proveedor más una tarifa de
//   servicio fija, que cubre la protección del pago dentro de la app.
// - El proveedor recibe el precio acordado menos la comisión de AlToque.

/** Porcentaje que AlToque retiene al proveedor (0.12 = 12 %). */
export const COMISION_PROVEEDOR = 0.12;

/** Tarifa fija que paga el conductor por pedir dentro de la app, en soles. */
export const TARIFA_SERVICIO_CONDUCTOR = 4;

export type Desglose = {
  precio: number; // lo que cobra el proveedor por el trabajo
  tarifaServicio: number; // la paga el conductor
  totalConductor: number; // precio + tarifa de servicio
  comision: number; // se descuenta al proveedor
  netoProveedor: number; // precio - comisión
  ingresoAlToque: number; // tarifa de servicio + comisión
};

const redondear = (n: number) => Math.round(n * 100) / 100;

export function desglosar(precio: number): Desglose {
  const comision = redondear(precio * COMISION_PROVEEDOR);
  return {
    precio,
    tarifaServicio: TARIFA_SERVICIO_CONDUCTOR,
    totalConductor: redondear(precio + TARIFA_SERVICIO_CONDUCTOR),
    comision,
    netoProveedor: redondear(precio - comision),
    ingresoAlToque: redondear(comision + TARIFA_SERVICIO_CONDUCTOR),
  };
}

/** "S/ 104.00" */
export function soles(n: number): string {
  return `S/ ${n.toFixed(2)}`;
}
