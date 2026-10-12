"use client";

import { elegirSedeDesdeMapa, seleccionarSedeMapa } from "@/src/lib/ui/cliente";
import { cambiarVista } from "@/src/lib/ui/nav";

export default function Ubicacion() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-24" id="vista-ubicacion">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <button className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors" onClick={(event) => { cambiarVista('vista-ubicacion', 'vista-inicio'); }}>
            <i className="fa-solid fa-arrow-left"></i>
            {" "}
            Volver al Inicio
          </button>
          {" "}
          <div className="flex items-center gap-3 mb-8">
            <i className="fa-solid fa-location-dot text-3xl text-brand-yellow"></i>
            {" "}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Nuestras Sedes
              </h2>
              <div className="h-1 w-20 bg-brand-blue rounded-full mt-2"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-5">
              <div id="mapa-ubicacion"></div>
              <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4" id="ub-nombre">
                  Náutica Megaplaza
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
                  <p className="flex items-start gap-3">
                    <i className="fa-solid fa-map-pin text-brand-blue mt-1"></i>
                    <span id="ub-dir"></span>
                  </p>
                  <p className="flex items-start gap-3">
                    <i className="fa-solid fa-clock text-brand-blue mt-1"></i>
                    <span id="ub-horario"></span>
                  </p>
                  <p className="flex items-start gap-3">
                    <i className="fa-solid fa-phone text-brand-blue mt-1"></i>
                    <span id="ub-tel"></span>
                  </p>
                  <p className="flex items-start gap-3">
                    <i className="fa-solid fa-door-open text-brand-blue mt-1"></i>
                    <span id="ub-salas"></span>
                  </p>
                </div>
                {" "}
                <button className="mt-5 bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" onClick={(event) => { elegirSedeDesdeMapa(); }}>
                  <i className="fa-solid fa-ticket mr-2"></i>
                  Ver cartelera de esta sede
                </button>
              </div>
            </div>
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-5 shadow-xl h-max max-h-[640px] overflow-y-auto hide-scrollbar">
              <h3 className="text-lg font-bold text-white mb-3">
                Elige una sede
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2 first:mt-0">
                Chimbote
              </p>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s1" type="button" onClick={(event) => { seleccionarSedeMapa('s1', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Megaplaza
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. Principal 123, Megaplaza Chimbote
                  </p>
                </div>
              </button>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s2" type="button" onClick={(event) => { seleccionarSedeMapa('s2', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Costa Azul
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. Pardo 1450, Chimbote
                  </p>
                </div>
              </button>
              {" "}
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2 first:mt-0">
                Nuevo Chimbote
              </p>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s3" type="button" onClick={(event) => { seleccionarSedeMapa('s3', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Nuevo Chimbote
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. Universitaria 880, Nuevo Chimbote
                  </p>
                </div>
              </button>
              {" "}
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2 first:mt-0">
                Trujillo
              </p>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s4" type="button" onClick={(event) => { seleccionarSedeMapa('s4', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Trujillo Centro
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Jr. Pizarro 540, Trujillo
                  </p>
                </div>
              </button>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s5" type="button" onClick={(event) => { seleccionarSedeMapa('s5', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Mall Trujillo
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. Mansiche 2100, Trujillo
                  </p>
                </div>
              </button>
              {" "}
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2 first:mt-0">
                Lima Metropolitana
              </p>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s6" type="button" onClick={(event) => { seleccionarSedeMapa('s6', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Lima Norte
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. Alfredo Mendiola 3698, Los Olivos
                  </p>
                </div>
              </button>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s7" type="button" onClick={(event) => { seleccionarSedeMapa('s7', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica Miraflores
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. Larco 812, Miraflores
                  </p>
                </div>
              </button>
              <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" data-sede-btn="s8" type="button" onClick={(event) => { seleccionarSedeMapa('s8', event.currentTarget); }}>
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    Náutica San Miguel
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Av. La Marina 2355, San Miguel
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
