"use client";

import { cambiarVista } from "@/src/lib/ui/nav";

export default function Detalle_doomsday() {
  return (
    <>
      <div data-peli="doomsday">
        <div className="relative w-full h-[50vh] min-h-[400px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://sm.ign.com/t/ign_latam/screenshot/default/avengers-doomsday_e91x.1200.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-black/30"></div>
          {" "}
          <button className="absolute top-24 left-6 md:left-12 z-50 text-white hover:text-brand-yellow bg-black/40 p-3 rounded-full backdrop-blur-md transition-colors" onClick={(event) => { cambiarVista('vista-detalle-pelicula', 'vista-inicio'); }}>
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-32 relative z-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
              <img alt="Avengers: Doomsday" className="w-full rounded-2xl shadow-2xl shadow-black/80 border-2 border-white/10" src="https://m.media-amazon.com/images/M/MV5BNGEwYWZkN2UtOTQ5Mi00MGQzLWEzNjYtMWMyNDBkMTkzMWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" />
            </div>
            <div className="flex-grow pt-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                  APT
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  Acción / Superhéroes
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  •
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  Por confirmar
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Avengers: Doomsday
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-3xl">
                En medio del colapso del multiverso, grupos de héroes de tres universos diferentes —los Vengadores, los 4 Fantásticos y los X-Men— convergen para enfrentarse a la amenaza existencial del Doctor Doom.
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-brand-blue pl-3">
                  Tráiler Oficial
                </h3>
                <div className="video-container max-w-3xl bg-black rounded-2xl border border-white/10">
                  <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0" data-src="https://www.youtube.com/embed/lAr_uspgHm8" frameBorder="0"></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 bg-dark-800 border border-dashed border-white/10 rounded-2xl p-10 text-center">
            <i className="fa-solid fa-clock text-3xl text-brand-yellow mb-3"></i>
            {" "}
            <h3 className="text-xl font-bold text-white mb-1">
              Próximamente
            </h3>
            <p className="text-slate-400 text-sm">
              Las funciones se publicarán cuando se acerque la fecha de estreno.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
