import { Suspense } from "react";
import Pago from "@/src/components/cliente/vistas/Pago";
import MontarVista from "@/src/components/MontarVista";

export const metadata = { title: "Pago Seguro - CineNáutica" };

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 flex items-center justify-center text-white">
            <div className="text-center">
              <i className="fa-solid fa-circle-notch fa-spin text-brand-yellow text-4xl mb-3"></i>
              <p className="text-slate-400 text-sm">Cargando pasarela de pago...</p>
            </div>
          </div>
        }
      >
        <Pago />
      </Suspense>
      <MontarVista area="cliente" />
    </>
  );
}
