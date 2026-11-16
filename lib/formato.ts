import type { RangoPrecio } from "./tipos";

/** Une clases de Tailwind y descarta las vacías. */
export function cx(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(" ");
}

/** "S/ 80 a S/ 150". Los precios van siempre en rango y con la etiqueta "referencial". */
export function precioEnRango(precio: RangoPrecio): string {
  return `S/ ${precio.min} a S/ ${precio.max}`;
}

/** "Carlos Huamán" -> "Carlos". */
export function primerNombre(nombre: string): string {
  return nombre.split(" ")[0];
}

/** "Llanta pinchada" -> "llanta pinchada", para usarlo dentro de una frase. */
export function enMinuscula(texto: string): string {
  return texto.charAt(0).toLocaleLowerCase("es") + texto.slice(1);
}
