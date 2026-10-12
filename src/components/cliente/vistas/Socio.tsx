"use client";

import { abrirCarnetSocio, abrirModalRegistro, copiarCodigoSocio } from "@/src/lib/ui/common";

export default function Socio() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-20" id="vista-beneficios">
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden bg-gradient-to-b from-brand-dark-blue/30 via-dark-900 to-dark-900">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')" }}></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="px-4 py-1.5 bg-brand-yellow text-black text-xs font-bold rounded-full uppercase tracking-wider">
              Programa de Lealtad
            </span>
            {" "}
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-6 mb-4">
              Socio
              {" "}
              <span className="text-brand-blue">
                Náutica
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl">
              Vive el cine como nunca antes. Acumula beneficios cada vez que nos visitas.
            </p>
          </div>
        </section>
        <section className="hidden max-w-[1200px] mx-auto px-6 md:px-12 -mt-12 relative z-10" id="panel-socio-beneficios">
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3" id="beneficios-nivel-badge" style={{ background: "#C0C0C022", color: "#C0C0C0", border: "1px solid #C0C0C055" }}>
                Plata
              </span>
              {" "}
              <p className="text-5xl font-bold text-white" id="beneficios-puntos-actuales">
                540
              </p>
              <p className="text-slate-400 text-xs uppercase font-bold mt-1">
                Puntos disponibles
              </p>
              <p className="text-slate-500 text-xs mt-3 font-mono flex items-center gap-2">
                <span id="beneficios-codigo-socio">
                  CIN-482913
                </span>
                {" "}
                <button className="text-slate-500 hover:text-brand-yellow transition-colors" title="Copiar código de socio" type="button" onClick={(event) => { copiarCodigoSocio(); }}>
                  <i className="fa-regular fa-copy"></i>
                </button>
              </p>
              {" "}
              {" "}
              <button className="mt-4 bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" type="button" onClick={(event) => { abrirCarnetSocio(); }}>
                <i className="fa-solid fa-id-card mr-2"></i>
                Mostrar mi carnet
              </button>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span id="beneficios-progreso-texto">
                    Plata
                  </span>
                  {" "}
                  <span id="beneficios-progreso-siguiente">
                    260 pts para Oro
                  </span>
                </div>
                <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-yellow rounded-full transition-all" id="beneficios-progreso-barra" style={{ width: "48%" }}></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-dark-900 rounded-xl p-3 flex items-center gap-2">
                  <i className="fa-solid fa-cake-candles text-brand-yellow"></i>
                  {" "}
                  <span className="text-slate-300" id="beneficios-estado-cumpleanos">
                    Tu cumpleaños es en Noviembre
                  </span>
                </div>
                <div className="bg-dark-900 rounded-xl p-3 flex items-center gap-2">
                  <i className="fa-solid fa-people-line text-green-400"></i>
                  {" "}
                  <span className="text-slate-300" id="beneficios-estado-fila">
                    Fila preferencial activa
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-xs">
                Muestra tu código de socio en counter para canjear puntos o reclamar tu beneficio de cumpleaños.
              </p>
            </div>
          </div>
        </section>
        <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="beneficio-card bg-dark-800 border border-white/5 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-6">
              <i className="fa-solid fa-star text-3xl text-brand-blue"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Acumula Puntos
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gana puntos por cada entrada y producto de dulcería que compres, y canjéalos por descuentos en tu próxima compra.
            </p>
          </div>
          <div className="beneficio-card bg-dark-800 border border-white/5 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-6">
              <i className="fa-solid fa-cake-candles text-3xl text-brand-yellow"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Entrada Gratis por Cumpleaños
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Durante el mes de tu cumpleaños, reclama en counter una entrada 2D totalmente gratis.
            </p>
          </div>
          <div className="beneficio-card bg-dark-800 border border-white/5 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
              <i className="fa-solid fa-people-line text-3xl text-green-400"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Fila Preferencial
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Desde el nivel Plata, accede a una fila exclusiva de atención rápida en boletería y dulcería.
            </p>
          </div>
        </section>
        <section className="hidden max-w-[1200px] mx-auto px-6 md:px-12 pb-16" id="panel-historial-beneficios">
          <h3 className="text-2xl font-bold text-white mb-6">
            Historial de Compras
          </h3>
          <div className="space-y-4" id="contenedor-historial-beneficios">
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-white font-bold">
                  Spider-Man: Un Nuevo Día
                </p>
                <p className="text-slate-400 text-sm">
                  Sáb, 10 Oct • 19:00 • 2D Doblada
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  CR-482913 · 09/10/2026
                </p>
              </div>
              <div className="text-right">
                <p className="text-brand-yellow font-bold text-lg">
                  S/ 76.00
                </p>
                <p className="text-green-400 text-xs font-semibold">
                  +76 pts
                </p>
              </div>
            </div>
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-white font-bold">
                  Avengers: Endgame Encore
                </p>
                <p className="text-slate-400 text-sm">
                  Sáb, 3 Oct • 20:00 • 2D Subtitulada
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  CR-377120 · 02/10/2026
                </p>
              </div>
              <div className="text-right">
                <p className="text-brand-yellow font-bold text-lg">
                  S/ 87.00
                </p>
                <p className="text-green-400 text-xs font-semibold">
                  +87 pts
                </p>
              </div>
            </div>
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-white font-bold">
                  Coyote vs. Acme
                </p>
                <p className="text-slate-400 text-sm">
                  Mié, 30 Set • 17:00 • 2D Doblada
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  CR-215504 · 18/09/2026
                </p>
              </div>
              <div className="text-right">
                <p className="text-brand-yellow font-bold text-lg">
                  S/ 12.00
                </p>
                <p className="text-green-400 text-xs font-semibold">
                  +12 pts
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="text-center pb-24 px-6" id="beneficios-cta-invitado">
          <button className="bg-brand-blue hover:bg-brand-dark-blue text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105" onClick={(event) => { abrirModalRegistro(); }}>
            Únete a Socio Náutica
          </button>
        </section>
      </div>
    </>
  );
}
