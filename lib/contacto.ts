// Enlaces para contactar a un proveedor. El chat con el proveedor es interno
// (lib/servicio.ts): AlToque no deriva a WhatsApp para no saltarse la comisión.

/** Enlace tel: para llamar, o undefined si el proveedor no tiene teléfono. */
export function enlaceLlamada(telefono: string | null): string | undefined {
  return telefono ? `tel:${telefono.replace(/[^\d+]/g, "")}` : undefined;
}
