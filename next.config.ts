import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (cacheComponents y partialPrefetching) queda apagado a
  // propósito. Con esa opción Next.js no desmonta las pantallas al navegar,
  // las oculta y les conserva el estado. AlToque es un flujo de emergencia
  // lineal: cada visita a una pantalla debe empezar limpia y lo que se
  // comparte entre pantallas vive en useFlujo() (lib/flujo.tsx).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
