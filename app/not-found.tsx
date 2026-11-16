import type { Metadata } from "next";
import { BottomBar } from "@/components/ui/BottomBar";
import { CircleHelpIcon, HouseIcon } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "No encontramos esa pantalla" };

export default function NotFound() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-surface text-primary">
          <CircleHelpIcon size={30} strokeWidth={2} />
        </span>
        <h1 className="font-display text-title">No encontramos esa pantalla</h1>
        <p className="text-[16px] leading-[23px] text-ink-muted">
          Vuelve al inicio y cuéntanos qué pasó con tu auto.
        </p>
      </main>
      <BottomBar>
        <PrimaryButton href={RUTAS.inicio} icon={<HouseIcon size={22} />}>
          Ir al inicio
        </PrimaryButton>
      </BottomBar>
    </>
  );
}
