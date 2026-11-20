// Los dos botones que siempre se ven en el Nivel 1: salir a un mecánico (Nivel 2)
// o a una grúa (Nivel 3).

import { TruckIcon, WrenchIcon } from "@/components/ui/icons";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { RUTAS } from "@/lib/rutas";

export function Escalar() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <SecondaryButton
        size="sm"
        href={RUTAS.mecanicos}
        icon={<WrenchIcon size={18} />}
        className="px-2! text-[15px]! leading-5!"
      >
        Necesito un mecánico
      </SecondaryButton>
      <SecondaryButton
        size="sm"
        href={RUTAS.gruas}
        icon={<TruckIcon size={18} />}
        className="px-2! text-[15px]! leading-5!"
      >
        Necesito una grúa
      </SecondaryButton>
    </div>
  );
}
