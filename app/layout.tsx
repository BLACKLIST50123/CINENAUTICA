import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cine Náutica",
  description: "Cartelera, entradas y dulcería de Cine Náutica",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <head>
        {/* Fuente Inter + iconos Font Awesome (los mismos que usaba el proyecto nativo) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="antialiased overflow-x-hidden relative">{children}</body>
    </html>
  );
}
