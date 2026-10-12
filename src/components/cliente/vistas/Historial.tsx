"use client";

import { cambiarVista } from "@/src/lib/ui/nav";

export default function Historial() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-24" id="vista-historial">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <button className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors" onClick={(event) => { cambiarVista('vista-historial', 'vista-inicio'); }}>
            <i className="fa-solid fa-arrow-left"></i>
            {" "}
            Volver al Inicio
          </button>
          {" "}
          <div className="flex items-center gap-3 mb-10">
            <i className="fa-solid fa-receipt text-3xl text-brand-yellow"></i>
            {" "}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Mis Compras
              </h2>
              <div className="h-1 w-20 bg-brand-blue rounded-full mt-2"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20" id="grid-historial-compras">
            <div className="bg-dark-800 rounded-2xl border border-white/5 p-5 shadow-xl hover:border-brand-blue/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2 py-1 rounded border border-brand-blue/30">
                  CR-482913
                </span>
                <span className="text-slate-500 text-xs">
                  09/10/2026
                </span>
              </div>
              <h4 className="text-white font-bold text-lg mb-1">
                Spider-Man: Un Nuevo Día
              </h4>
              <p className="text-slate-400 text-sm mb-3">
                Sáb, 10 Oct • 19:00 • 2D Doblada
              </p>
              <p className="text-xs text-slate-400 mb-1">
                <i className="fa-solid fa-chair text-brand-yellow mr-1"></i>
                {" "}
                D5, D6
              </p>
              <p className="text-xs text-slate-400 mb-3">
                <i className="fa-solid fa-bowl-food text-brand-yellow mr-1"></i>
                {" "}
                1x Combo Dúo
              </p>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Total pagado
                </span>
                <span className="text-brand-yellow font-bold text-lg">
                  S/ 76.00
                </span>
              </div>
            </div>
            <div className="bg-dark-800 rounded-2xl border border-white/5 p-5 shadow-xl hover:border-brand-blue/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2 py-1 rounded border border-brand-blue/30">
                  CR-377120
                </span>
                <span className="text-slate-500 text-xs">
                  02/10/2026
                </span>
              </div>
              <h4 className="text-white font-bold text-lg mb-1">
                Avengers: Endgame Encore
              </h4>
              <p className="text-slate-400 text-sm mb-3">
                Sáb, 3 Oct • 20:00 • 2D Subtitulada
              </p>
              <p className="text-xs text-slate-400 mb-1">
                <i className="fa-solid fa-chair text-brand-yellow mr-1"></i>
                {" "}
                C7, C8, C9
              </p>
              <p className="text-xs text-slate-400 mb-3">
                <i className="fa-solid fa-bowl-food text-brand-yellow mr-1"></i>
                {" "}
                2x Gaseosa Grande, 1x Cancha Gigante
              </p>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Total pagado
                </span>
                <span className="text-brand-yellow font-bold text-lg">
                  S/ 87.00
                </span>
              </div>
            </div>
            <div className="bg-dark-800 rounded-2xl border border-white/5 p-5 shadow-xl hover:border-brand-blue/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2 py-1 rounded border border-brand-blue/30">
                  CR-215504
                </span>
                <span className="text-slate-500 text-xs">
                  18/09/2026
                </span>
              </div>
              <h4 className="text-white font-bold text-lg mb-1">
                Coyote vs. Acme
              </h4>
              <p className="text-slate-400 text-sm mb-3">
                Mié, 30 Set • 17:00 • 2D Doblada
              </p>
              <p className="text-xs text-slate-400 mb-1">
                <i className="fa-solid fa-chair text-brand-yellow mr-1"></i>
                {" "}
                F4
              </p>
              <div className="mb-3"></div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Total pagado
                </span>
                <span className="text-brand-yellow font-bold text-lg">
                  S/ 12.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
