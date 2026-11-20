# Guía UX/UI para los niveles

Complementa `design/README.md`. Si algo choca, mandan los `.dc.html`.

## Efectos (`components/ui/efectos/`)

Sin dependencias: CSS y Tailwind, con animaciones definidas en `app/globals.css`. Todas se apagan con `prefers-reduced-motion`. Inspiradas en ideas de React Bits y Untitled UI (no se copió código ni se consultó su web desde el agente).

| Componente | Para qué | Uso |
| --- | --- | --- |
| `Aparecer` | Entrada suave (sube 12 px y se desvanece) al montar | `<Aparecer retraso={90}>...</Aparecer>`; escalona de a 70 a 90 ms; `como="section"` cambia la etiqueta |
| `FondoAurora` | Fondo azul difuminado y lento | Solo en la pantalla de inicio o pantallas hero; contenedor `relative overflow-hidden` y contenido con `relative` |
| `TextoBrillante` | Destello en un texto de espera | "Buscando mecánicos...", "Esto toma unos segundos..." |
| `Esqueleto` | Bloque de carga con destello | `<Esqueleto className="h-20 w-full" />` mientras se "buscan" mecánicos o grúas |
| `Contador` | Número que sube hasta su valor | `<Contador valor={92} sufijo=" %" />` para confianza o minutos |

Ya incluidos en componentes compartidos: pulso suave en `EmergencyButton`, fundido del fondo de `BottomSheet`, entrada de `SeverityCard` y retroceso al presionar `PrimaryButton`. No los repitas.

Importa con `import { Aparecer } from "@/components/ui/efectos"`.

## Sesión simulada

`RequiereSesion` (`components/flujo/RequiereSesion.tsx`) envuelve el contenido de las pantallas de los niveles 2 y 3. Sin sesión redirige a `/ingresar?volver=<ruta>`. Cuenta de prueba en `lib/mock/usuario.ts` (`CUENTA_DE_PRUEBA`). `useSesion()` y `cerrarSesion()` están en `lib/sesion.ts`.

## Espaciado y tipografía

- Margen lateral de pantalla `px-5` (20 px). Separación entre bloques 12 a 14 px (`gap-3`, `gap-3.5`), entre secciones 24 a 26 px.
- Títulos: `font-display text-title` (pantalla) y `text-heading` (sección). Texto: `text-[16px]` o `text-[17px]`, apoyo `text-ink-muted`. Detalles pequeños: `text-[14px]`.
- Un solo `h1` por pantalla. Acción principal en `BottomBar`.
- Radios: `rounded-btn` (botones y campos), `rounded-card` (tarjetas), `rounded-sheet` (hojas).
- Campos: `min-h-14`, borde de 2 px, `<label>` visible encima, error debajo con texto, no solo color.

## Haz y no hagas

Haz:
- Usa solo tokens (`bg-primary`, `text-ink-muted`...), nunca hexadecimales.
- Escalona la entrada con `Aparecer` en listas cortas (máximo 5 elementos).
- Usa `Esqueleto` o `TextoBrillante` para esperas de más de un segundo.
- Mantén objetivos táctiles de 48 px o más y texto en tuteo, frases cortas y calmadas.
- Ilustra con SVG en línea.

No hagas:
- No uses rojo fuera de "detente" y emergencias (el error de formulario es ámbar).
- No animes cosas que el usuario lee con urgencia (alertas de seguridad, pasos de la guía).
- No pongas más de un efecto continuo por pantalla (aurora, pulso o brillo).
- No uses guiones largos en los textos; usa comas.
- No agregues librerías de animación: con estos componentes alcanza.
