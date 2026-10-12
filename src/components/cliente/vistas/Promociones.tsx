"use client";

import { cambiarVista, vistaActual } from "@/src/lib/ui/nav";

export default function Promociones() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-20" id="vista-promociones">
        <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-gradient-to-b from-brand-blue/20 via-dark-900 to-dark-900">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="px-4 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Ofertas Vigentes
            </span>
            {" "}
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-6 mb-4">
              Promociones
              {" "}
              <span className="text-brand-yellow">
                Náutica
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl">
              Aprovecha nuestros descuentos y combos especiales. Vigencia y condiciones según cada promoción.
            </p>
          </div>
        </section>
        <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="grid-promociones">
            <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-green-500/50 transition-colors flex flex-col">
              <div className="h-40 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <i className="fa-solid fa-crown text-6xl text-white/90"></i>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block w-max px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-bold rounded-full uppercase mb-3">
                  Exclusivo
                </span>
                {" "}
                <h3 className="text-xl font-bold text-white mb-2">
                  Beneficio Exclusivo Socio Náutica
                </h3>
                <p className="text-slate-400 text-sm flex-grow">
                  Los socios acumulan puntos en cada compra y acceden a preventas exclusivas y una entrada gratis por cumpleaños.
                </p>
                {" "}
                <button className="mt-4 w-full bg-transparent border border-green-500/40 text-green-400 hover:bg-green-500/10 py-2.5 rounded-xl font-bold text-sm transition-colors" onClick={(event) => { cambiarVista(vistaActual(), 'vista-beneficios'); }}>
                  Ver Beneficios
                </button>
              </div>
            </div>
            <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-brand-blue/50 transition-colors flex flex-col">
              <div className="h-40 bg-gradient-to-br from-dark-700 to-dark-900 flex items-center justify-center border-b border-white/5">
                <i className="fa-solid fa-tag text-6xl text-brand-blue/80"></i>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block w-max px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/30 text-xs font-bold rounded-full uppercase mb-3">
                  Cupón
                </span>
                {" "}
                <h3 className="text-xl font-bold text-white mb-1 font-mono">
                  VERANO20
                </h3>
                <p className="text-slate-400 text-sm flex-grow">
                  Descuento de verano —
                  {" "}
                  <span className="text-brand-yellow font-bold">
                    -20%
                  </span>
                  {" "}
                  en tu compra.
                </p>
              </div>
            </div>
            <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-brand-blue/50 transition-colors flex flex-col">
              <div className="h-40 bg-gradient-to-br from-dark-700 to-dark-900 flex items-center justify-center border-b border-white/5">
                <i className="fa-solid fa-tag text-6xl text-brand-blue/80"></i>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block w-max px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/30 text-xs font-bold rounded-full uppercase mb-3">
                  Cupón
                </span>
                {" "}
                <h3 className="text-xl font-bold text-white mb-1 font-mono">
                  NAUTICA10
                </h3>
                <p className="text-slate-400 text-sm flex-grow">
                  Bienvenida Náutica —
                  {" "}
                  <span className="text-brand-yellow font-bold">
                    -10%
                  </span>
                  {" "}
                  en tu compra.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
