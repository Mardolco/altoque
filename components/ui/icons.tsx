// Íconos del diseño: de línea, 24 px y puntas redondeadas. Son los SVG en
// línea de design/pantallas (la lista completa está en Fundamentos.dc.html).
// Todos son decorativos (aria-hidden): el texto va al lado o en aria-label.

import type { ReactNode, SVGProps } from "react";
import type { Falla } from "@/lib/tipos";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
};

function Trazo({
  size = 24,
  strokeWidth = 2.2,
  children,
  ...resto
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...resto}
    >
      {children}
    </svg>
  );
}

// --- Navegación y acciones --------------------------------------------------

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Trazo>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M9 18l6-6-6-6" />
    </Trazo>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Trazo>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Trazo>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M20 6L9 17l-5-5" />
    </Trazo>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M3.5 10.5L12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1v-9.5z" />
    </Trazo>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M12 3.5v11.5M7 10l5 5 5-5M4 20.5h16" />
    </Trazo>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M21 3L10 14" />
      <path d="M21 3l-6.5 18-4.5-7-7-4.5L21 3z" />
    </Trazo>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </Trazo>
  );
}

// --- Contacto y ubicación ---------------------------------------------------

export function PhoneIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M6.5 3.5h3l1.6 4.2-2 1.3a12 12 0 0 0 5.9 5.9l1.3-2 4.2 1.6v3a2 2 0 0 1-2.1 2A17 17 0 0 1 4.5 5.6a2 2 0 0 1 2-2.1z" />
    </Trazo>
  );
}

/** Chat y WhatsApp. Con dots, los tres puntos de "Pregúntale a la IA". */
export function MessageCircleIcon({ dots = false, ...props }: IconProps & { dots?: boolean }) {
  return (
    <Trazo {...props}>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5z" />
      {dots && <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />}
    </Trazo>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M12 21s-7-6.1-7-11.2a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </Trazo>
  );
}

/** Compartir mi ubicación. */
export function NavigationIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M3 11l18-8-8 18-2-8-8-2z" />
    </Trazo>
  );
}

/** Familia. */
export function UsersIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </Trazo>
  );
}

// --- Foto y análisis --------------------------------------------------------

export function CameraIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M4 7.5h3l1.8-2.5h6.4L17 7.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </Trazo>
  );
}

/** Subir foto. */
export function ImageIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="9.5" r="1.8" />
      <path d="M21 15.5l-4.5-4.5L6 20" />
    </Trazo>
  );
}

/** La foto no se pudo analizar. */
export function ImageOffIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 3l18 18" />
    </Trazo>
  );
}

/** Analizar. */
export function ScanLineIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M7.5 12h9" />
    </Trazo>
  );
}

/** Reporte. */
export function FileTextIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Trazo>
  );
}

// --- Fallas -----------------------------------------------------------------

export function CarFrontIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M5 11l1.7-4.4A2 2 0 0 1 8.6 5.3h6.8a2 2 0 0 1 1.9 1.3L19 11" />
      <rect x="3" y="11" width="18" height="6" rx="2" />
      <path d="M6 17v2M18 17v2M7 14h1M16 14h1" />
    </Trazo>
  );
}

/** Llanta. */
export function TireIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
    </Trazo>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M7 7V4.5h3V7M14 7V4.5h3V7M6.5 13.5h3.5M14 13.5h3.5M15.75 11.75v3.5" />
    </Trazo>
  );
}

/** Luz en el tablero. */
export function DashboardIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v3.5M12 15h.01" />
      <path d="M5.5 6.5a8 8 0 0 0 0 11M18.5 6.5a8 8 0 0 1 0 11" />
    </Trazo>
  );
}

/** Otro, "No sé" y el semáforo ámbar. */
export function CircleHelpIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.5" />
      <path d="M12 16.8h.01" />
    </Trazo>
  );
}

/** El ícono de cada falla del triaje. Sin falla elegida, el auto. */
export function FallaIcon({ falla, ...props }: IconProps & { falla: Falla | null }) {
  if (falla === "llanta") return <TireIcon {...props} />;
  if (falla === "bateria") return <BatteryIcon {...props} />;
  if (falla === "luz_tablero") return <DashboardIcon {...props} />;
  if (falla === "otra") return <CircleHelpIcon {...props} />;
  return <CarFrontIcon {...props} />;
}

// --- Caminos y proveedores --------------------------------------------------

/** Pasos: Nivel 1, Resuélvelo tú. */
export function ListChecksIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M11 6.5h9M11 12.5h9M11 18.5h9" />
    </Trazo>
  );
}

/** Mecánico: Nivel 2. */
export function WrenchIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M14.5 6.5a4 4 0 0 0-5 5.2l-5.6 5.6a1.9 1.9 0 0 0 2.7 2.7l5.6-5.6a4 4 0 0 0 5.2-5l-2.6 2.6-2.5-.4-.4-2.5 2.6-2.6z" />
    </Trazo>
  );
}

/** Grúa: Nivel 3. */
export function TruckIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M2.5 16.5V7.5h10v9" />
      <path d="M12.5 10.5h4.2l3.3 3.6v2.4h-2" />
      <path d="M9 16.5h6" />
      <circle cx="6.5" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </Trazo>
  );
}

/** Verificado. */
export function ShieldCheckIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M12 3l7 3v5.2c0 4.4-3 8.3-7 9.8-4-1.5-7-5.4-7-9.8V6l7-3z" />
      <path d="M9 12l2.2 2.2L15.2 10" />
    </Trazo>
  );
}

/** Tiempo. */
export function ClockIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </Trazo>
  );
}

/** Estrella de calificación. Llena es ámbar; vacía, blanca con borde. */
export function StarIcon({ size = 18, filled = true, ...resto }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...resto}>
      <path
        d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8L12 3.2z"
        fill={filled ? "var(--color-caution)" : "#FFFFFF"}
        stroke={filled ? "var(--color-star-edge)" : "var(--color-line-strong)"}
        strokeWidth={filled ? 1.2 : 1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// --- Avisos y estados -------------------------------------------------------

export function InfoIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </Trazo>
  );
}

/** Luces de emergencia. */
export function HazardIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M12 3.5L2.5 20h19L12 3.5z" />
      <path d="M12 10l-3.8 6.5h7.6L12 10z" />
    </Trazo>
  );
}

/** Advertencia. */
export function TriangleAlertIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M12 3.5L2.5 20h19L12 3.5z" />
      <path d="M12 10v4M12 17v.01" />
    </Trazo>
  );
}

/** Detente: semáforo rojo. */
export function OctagonAlertIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <path d="M8.3 2.5h7.4l5.8 5.8v7.4l-5.8 5.8H8.3l-5.8-5.8V8.3l5.8-5.8z" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </Trazo>
  );
}

/** Listo: semáforo verde. */
export function CircleCheckIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3l2.7 2.7L16 9.5" />
    </Trazo>
  );
}

/** Círculo vacío: paso pendiente. */
export function CircleIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
    </Trazo>
  );
}

/** Qué NO hacer. */
export function BanIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.7 5.7l12.6 12.6" />
    </Trazo>
  );
}

/** Seguros puestos. */
export function LockIcon(props: IconProps) {
  return (
    <Trazo {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Trazo>
  );
}

/** Rueda de carga. Gira sola; cambia la velocidad con className. */
export function SpinnerIcon({ size = 24, className, ...resto }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "animate-spin"}
      {...resto}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-surface)" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
