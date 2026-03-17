import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taller de Cerámica — Clases y Talleres",
  description:
    "Descubrí el arte de la cerámica. Clases individuales y grupales en un espacio cálido y creativo. Reservá tu turno online.",
  keywords: ["cerámica", "taller", "clases", "cursos", "alfarería"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
