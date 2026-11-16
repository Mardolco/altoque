// Enlaces para contactar a un proveedor.

/**
 * Abre WhatsApp con el mensaje ya escrito. Sin teléfono, WhatsApp deja elegir
 * el contacto.
 */
export function enlaceWhatsApp(telefono: string | null, mensaje: string): string {
  const numero = telefono ? telefono.replace(/\D/g, "") : "";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Enlace tel: para llamar, o undefined si el proveedor no tiene teléfono. */
export function enlaceLlamada(telefono: string | null): string | undefined {
  return telefono ? `tel:${telefono.replace(/[^\d+]/g, "")}` : undefined;
}
