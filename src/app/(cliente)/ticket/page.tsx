import { Suspense } from "react";
import Ticket from "@/src/components/cliente/vistas/Ticket";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Tu Ticket y Comprobante - CineNáutica" };

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 flex items-center justify-center text-white">
            <div className="text-center">
              <i className="fa-solid fa-circle-notch fa-spin text-brand-yellow text-4xl mb-3"></i>
              <p className="text-slate-400 text-sm">Cargando ticket...</p>
            </div>
          </div>
        }
      >
        <Ticket />
      </Suspense>
      <MontarVista area="cliente" />
    </>
  );
}
