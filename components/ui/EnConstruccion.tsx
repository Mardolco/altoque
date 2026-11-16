// Pantalla provisional de los niveles. Muestra el título, "En construcción"
// y los botones hacia las siguientes pantallas según los enlaces del diseño,
// para que la demo se pueda recorrer completa. Cada dueño de nivel la
// reemplaza por la pantalla real.

import { BottomBar } from "./BottomBar";
import { WrenchIcon } from "./icons";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TopBar } from "./TopBar";

type Props = {
  titulo: string;
  subtitulo?: string;
  nivel: 1 | 2 | 3;
  diseno: string; // archivo de design/pantallas que hay que traducir
  nota?: string;
  volver: { href: string; label: string };
  acciones: { label: string; href: string }[]; // la primera es la principal
};

export function EnConstruccion({ titulo, subtitulo, nivel, diseno, nota, volver, acciones }: Props) {
  return (
    <>
      <TopBar title={titulo} subtitle={subtitulo} backHref={volver.href} backLabel={volver.label} />

      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-surface text-primary">
          <WrenchIcon size={30} strokeWidth={2} />
        </span>
        <h2 className="font-display text-title">En construcción</h2>
        <p className="text-[16px] leading-[23px] text-ink-muted">
          Esta pantalla la arma el equipo del Nivel {nivel}. Mientras tanto, puedes seguir el
          recorrido con los botones de abajo.
        </p>
        {nota && <p className="text-[15px] leading-[21px] text-ink-muted">{nota}</p>}
        <p className="rounded-full border border-line bg-white px-3 py-1.5 text-caption text-ink-muted">
          Diseño: design/pantallas/{diseno}.dc.html
        </p>
      </main>

      <BottomBar surface="white" className="gap-2.5">
        {acciones.map((accion, i) =>
          i === 0 ? (
            <PrimaryButton key={accion.label} href={accion.href}>
              {accion.label}
            </PrimaryButton>
          ) : (
            <SecondaryButton key={accion.label} href={accion.href}>
              {accion.label}
            </SecondaryButton>
          ),
        )}
      </BottomBar>
    </>
  );
}
