"use client";

import { irAAsientos } from "@/src/lib/ui/nav";

export default function DetalleShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen transition-opacity duration-300 absolute top-0 left-0 z-40 pb-40 pt-0" id="vista-detalle-pelicula">
        <div id="contenido-detalle">
          {children}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-white/10 p-4 md:p-6 sticky-bar-bottom transform translate-y-full transition-transform duration-300 z-50 flex flex-col md:flex-row justify-between items-center gap-4" id="barra-confirmacion-horario">
          <div className="text-white text-center md:text-left">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-bold block">
              <i className="fa-solid fa-location-dot text-brand-yellow mr-1"></i>
              <span id="fh-sede">
                Náutica Megaplaza
              </span>
            </span>
            {" "}
            <span className="font-semibold text-lg">
              <span className="text-brand-yellow" id="fh-fecha"></span>
              {" "}
              •
              {" "}
              <span id="fh-formato"></span>
              {" "}
              •
              {" "}
              <span className="font-bold" id="fh-hora"></span>
            </span>
          </div>
          {" "}
          <button className="w-full md:w-auto bg-brand-blue hover:bg-brand-dark-blue text-white px-10 py-3.5 rounded-full font-bold shadow-lg transition-colors flex items-center justify-center gap-2 text-lg" onClick={(event) => { irAAsientos(); }}>
            Elegir Asientos
            {" "}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}
