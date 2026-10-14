import { Suspense } from "react";
import Navbar from "@/src/components/cliente/Navbar";
import Footer from "@/src/components/cliente/Footer";
import ModalesGlobales from "@/src/components/cliente/ModalesGlobales";
import BadgeTemporizador from "@/src/components/cliente/BadgeTemporizador";
import StepperCompra from "@/src/components/cliente/StepperCompra";
import UiRuntime from "@/src/components/UiRuntime";

/* Layout compartido por todas las vistas del cliente (carpeta con paréntesis = NO aparece en la URL).
   Navbar, footer y modales viven aquí UNA sola vez; solo cambia {children} al navegar. */
export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <BadgeTemporizador />
      </Suspense>
      <Suspense fallback={null}>
        <StepperCompra />
      </Suspense>
      <div className="relative w-full" id="contenedor-vistas">
        {children}
      </div>
      <ModalesGlobales />
      <Footer />
      <UiRuntime area="cliente" />
    </>
  );
}
