import type { Metadata, Viewport } from "next";
import { Inter, Nunito } from "next/font/google";
import { FlujoProvider } from "@/lib/flujo";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "AlToque", template: "AlToque · %s" },
  description:
    "Te decimos qué tiene tu auto y qué hacer. Si no puedes resolverlo tú, te conectamos con alguien de confianza.",
  applicationName: "AlToque",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F5F7FA",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${nunito.variable} ${inter.variable}`}>
      <body className="bg-canvas font-sans text-ink antialiased min-[431px]:bg-muted">
        <FlujoProvider>
          {/* Contenedor móvil: ancho completo hasta 430 px y centrado en pantallas grandes. */}
          <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-canvas min-[431px]:shadow-float">
            {children}
          </div>
        </FlujoProvider>
      </body>
    </html>
  );
}
