// Reduce una foto en el navegador antes de enviarla al servidor.
// Vercel acepta como máximo 4.5 MB por solicitud a una función, y la foto de
// un celular pesa más que eso. Aquí queda en JPEG de 1280 px de lado mayor.

const LADO_MAYOR = 1280;
const CALIDADES = [0.7, 0.5, 0.35];
const PESO_MAXIMO = 3_000_000; // caracteres del data URL; deja margen bajo los 4.5 MB

/**
 * Devuelve la foto como data URL JPEG, lista para guardar en el flujo y
 * enviar a /api/triaje. Rechaza si el archivo no es una imagen que el
 * navegador pueda leer.
 */
export async function reducirImagen(archivo: File, ladoMayor = LADO_MAYOR): Promise<string> {
  const imagen = await cargarImagen(archivo);
  const escala = Math.min(1, ladoMayor / Math.max(imagen.naturalWidth, imagen.naturalHeight));
  const ancho = Math.max(1, Math.round(imagen.naturalWidth * escala));
  const alto = Math.max(1, Math.round(imagen.naturalHeight * escala));

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const contexto = lienzo.getContext("2d");
  if (!contexto) throw new Error("El navegador no pudo preparar la foto.");

  // Fondo blanco: JPEG no tiene transparencia y un PNG quedaría con fondo negro.
  contexto.fillStyle = "#FFFFFF";
  contexto.fillRect(0, 0, ancho, alto);
  contexto.drawImage(imagen, 0, 0, ancho, alto);

  let resultado = "";
  for (const calidad of CALIDADES) {
    resultado = lienzo.toDataURL("image/jpeg", calidad);
    if (resultado.length <= PESO_MAXIMO) break;
  }
  return resultado;
}

function cargarImagen(archivo: File): Promise<HTMLImageElement> {
  return new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(archivo);
    const imagen = new Image();
    imagen.onload = () => {
      URL.revokeObjectURL(url);
      if (imagen.naturalWidth > 0 && imagen.naturalHeight > 0) resolver(imagen);
      else rechazar(new Error("La foto está vacía."));
    };
    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      rechazar(new Error("No se pudo leer la foto."));
    };
    imagen.src = url;
  });
}
