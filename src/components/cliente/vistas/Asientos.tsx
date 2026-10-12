"use client";

import { clickAsiento } from "@/src/lib/ui/cliente";
import { cambiarVista, irADulceria } from "@/src/lib/ui/nav";

export default function Asientos() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-40 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-36 overflow-x-hidden" id="vista-asientos">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8" id="contenedor-principal-asientos">
          <div className="w-full lg:col-span-1">
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 shadow-xl lg:sticky lg:top-28">
              <button className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm" onClick={(event) => { cambiarVista('vista-asientos', 'vista-detalle-pelicula'); }}>
                <i className="fa-solid fa-arrow-left"></i>
                {" "}
                Cambiar función
              </button>
              {" "}
              <div id="info-pelicula-asientos">
                <div data-peli="endgame-bonus" style={{ display: "none" }}>
                  <img alt="Avengers: Endgame Encore" className="w-full rounded-xl mb-4 shadow-lg shadow-black/50" src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" />
                  {" "}
                  <h2 className="text-xl font-bold text-white mb-1">
                    Avengers: Endgame Encore
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      APT
                    </span>
                    {" "}
                    <span data-bind="formato">
                      2D Doblada
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 font-semibold">
                    Acción / Ciencia Ficción • 3h 06m
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 border-b border-white/10 pb-6 text-justify">
                    El reestreno del épico final de la Saga del Infinito. Incluye 4 minutos de material extra inédito y escenas especiales que funcionan como puente directo hacia Avengers: Doomsday.
                  </p>
                  <div className="space-y-3 mb-6 bg-dark-900 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="fecha">
                        Sáb, 26 Set
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="hora">
                        19:00
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="cine">
                        Cine Náutica — Sala 1
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-slate-400">
                      <i className="fa-solid fa-map-pin text-brand-blue w-4 mt-0.5"></i>
                      <span data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </span>
                    </div>
                  </div>
                </div>
                <div data-peli="re-noche-cero" style={{ display: "none" }}>
                  <img alt="Resident Evil: Noche Cero" className="w-full rounded-xl mb-4 shadow-lg shadow-black/50" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} />
                  {" "}
                  <h2 className="text-xl font-bold text-white mb-1">
                    Resident Evil: Noche Cero
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      +14
                    </span>
                    {" "}
                    <span data-bind="formato">
                      2D Doblada
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 font-semibold">
                    Terror / Acción • 1h 30m
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 border-b border-white/10 pb-6 text-justify">
                    Un mensajero médico se ve envuelto en una carrera por la supervivencia llena de acción y sin parar, mientras una noche fatídica y aterradora se derrumba a su alrededor en el caos.
                  </p>
                  <div className="space-y-3 mb-6 bg-dark-900 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="fecha">
                        Sáb, 26 Set
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="hora">
                        19:00
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="cine">
                        Cine Náutica — Sala 1
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-slate-400">
                      <i className="fa-solid fa-map-pin text-brand-blue w-4 mt-0.5"></i>
                      <span data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </span>
                    </div>
                  </div>
                </div>
                <div data-peli="spiderman" style={{  }}>
                  <img alt="Spider-Man: Un Nuevo Día" className="w-full rounded-xl mb-4 shadow-lg shadow-black/50" src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" />
                  {" "}
                  <h2 className="text-xl font-bold text-white mb-1">
                    Spider-Man: Un Nuevo Día
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      APT
                    </span>
                    {" "}
                    <span data-bind="formato">
                      2D Doblada
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 font-semibold">
                    Acción / Aventura • 2h 25m
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 border-b border-white/10 pb-6 text-justify">
                    Peter Parker se enfrenta a su mayor desafío cuando las barreras entre multiversos colisionan inesperadamente. Viejos enemigos de realidades alternativas llegan a Nueva York, y Peter deberá aliarse con versiones de sí mismo para restaurar el equilibrio antes de que su mundo sea destruido por completo.
                  </p>
                  <div className="space-y-3 mb-6 bg-dark-900 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="fecha">
                        Sáb, 26 Set
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="hora">
                        19:00
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="cine">
                        Cine Náutica — Sala 1
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-slate-400">
                      <i className="fa-solid fa-map-pin text-brand-blue w-4 mt-0.5"></i>
                      <span data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </span>
                    </div>
                  </div>
                </div>
                <div data-peli="coyote-acme" style={{ display: "none" }}>
                  <img alt="Coyote vs. Acme" className="w-full rounded-xl mb-4 shadow-lg shadow-black/50" src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" />
                  {" "}
                  <h2 className="text-xl font-bold text-white mb-1">
                    Coyote vs. Acme
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      APT
                    </span>
                    {" "}
                    <span data-bind="formato">
                      2D Doblada
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 font-semibold">
                    Animación / Comedia • 1h 44m
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 border-b border-white/10 pb-6 text-justify">
                    Después de décadas fallando en atrapar al Correcaminos, el Coyote decide hacer lo impensado: demandar a ACME, la compañía responsable de todos los productos defectuosos que arruinaron sus planes.
                  </p>
                  <div className="space-y-3 mb-6 bg-dark-900 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="fecha">
                        Sáb, 26 Set
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="hora">
                        19:00
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="cine">
                        Cine Náutica — Sala 1
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-slate-400">
                      <i className="fa-solid fa-map-pin text-brand-blue w-4 mt-0.5"></i>
                      <span data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </span>
                    </div>
                  </div>
                </div>
                <div data-peli="sombra-exorcista" style={{ display: "none" }}>
                  <img alt="La Sombra del Exorcista" className="w-full rounded-xl mb-4 shadow-lg shadow-black/50" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} />
                  {" "}
                  <h2 className="text-xl font-bold text-white mb-1">
                    La Sombra del Exorcista
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      +18
                    </span>
                    {" "}
                    <span data-bind="formato">
                      2D Doblada
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 font-semibold">
                    Terror / Sobrenatural • 1h 27m
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 border-b border-white/10 pb-6 text-justify">
                    Mientras un exorcista de élite realiza un exorcismo no autorizado a su padre, empieza a sospechar que la entidad con la que está luchando podría ser un ser sagrado, quizá incluso Dios, o no.
                  </p>
                  <div className="space-y-3 mb-6 bg-dark-900 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="fecha">
                        Sáb, 26 Set
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="hora">
                        19:00
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="cine">
                        Cine Náutica — Sala 1
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-slate-400">
                      <i className="fa-solid fa-map-pin text-brand-blue w-4 mt-0.5"></i>
                      <span data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </span>
                    </div>
                  </div>
                </div>
                <div data-peli="demonio" style={{ display: "none" }}>
                  <img alt="La Noche del Demonio" className="w-full rounded-xl mb-4 shadow-lg shadow-black/50" src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" />
                  {" "}
                  <h2 className="text-xl font-bold text-white mb-1">
                    La Noche del Demonio
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      +14
                    </span>
                    {" "}
                    <span data-bind="formato">
                      2D Doblada
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 font-semibold">
                    Terror / Suspenso • 1h 46m
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 border-b border-white/10 pb-6 text-justify">
                    Una familia se muda a una nueva casa buscando un nuevo comienzo, solo para descubrir que el lugar está plagado de entidades oscuras. A medida que las manifestaciones empeoran, descubren que el verdadero mal no reside en la casa, sino que ha poseído a su hijo menor.
                  </p>
                  <div className="space-y-3 mb-6 bg-dark-900 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="fecha">
                        Sáb, 26 Set
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="hora">
                        19:00
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                      {" "}
                      <span className="font-bold text-white" data-bind="cine">
                        Cine Náutica — Sala 1
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-slate-400">
                      <i className="fa-solid fa-map-pin text-brand-blue w-4 mt-0.5"></i>
                      <span data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:col-span-2">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Elige tus asientos
              </h2>
              <div className="bg-dark-800 border border-brand-yellow/30 text-brand-yellow font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <i className="fa-solid fa-ticket"></i>
                {" "}
                <span id="texto-tarifa-vigente">
                  S/ 18.00 c/u
                </span>
              </div>
            </div>
            <div className="bg-dark-800 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl flex flex-col items-center overflow-x-auto relative">
              <div className="w-full max-w-[500px] mb-12 text-center">
                <div className="w-full h-12 screen-curve"></div>
                {" "}
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 block">
                  Pantalla
                </span>
              </div>
              <div className="matriz-sala-cliente" id="grid-asientos" style={({ "--columnas-sala": "14" } as React.CSSProperties)}>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A1" title="A1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A1
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A2" title="A2" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A2
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="A3 — Ocupado">
                  A3
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="A4 — Ocupado">
                  A4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A5" title="A5" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A5
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A6" title="A6" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A6
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A7" title="A7" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A7
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A8" title="A8" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A8
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A9" title="A9" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A9
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A10" title="A10" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A11" title="A11" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="A12" title="A12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  A12
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B1" title="B1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B1
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B2" title="B2" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B2
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B3" title="B3" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B3
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B4" title="B4" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B5" title="B5" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B5
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B6" title="B6" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B6
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="B7 — Ocupado">
                  B7
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="B8 — Ocupado">
                  B8
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B9" title="B9" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B9
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B10" title="B10" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B11" title="B11" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="B12" title="B12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  B12
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C1" title="C1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C1
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C2" title="C2" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C2
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C3" title="C3" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C3
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C4" title="C4" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="C5 — Ocupado">
                  C5
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C6" title="C6" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C6
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C7" title="C7" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C7
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C8" title="C8" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C8
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C9" title="C9" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C9
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C10" title="C10" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C11" title="C11" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="C12" title="C12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  C12
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D1" title="D1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D1
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D2" title="D2" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D2
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D3" title="D3" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D3
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D4" title="D4" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 selected rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D5" title="D5" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D5
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 selected rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D6" title="D6" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D6
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D7" title="D7" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D7
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D8" title="D8" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D8
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="D9 — Ocupado">
                  D9
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D10" title="D10" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D11" title="D11" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="D12" title="D12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  D12
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E1" title="E1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E1
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E2" title="E2" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E2
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E3" title="E3" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E3
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E4" title="E4" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E5" title="E5" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E5
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E6" title="E6" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E6
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E7" title="E7" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E7
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E8" title="E8" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E8
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E9" title="E9" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E9
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="E10 — Ocupado">
                  E10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="E11 — Ocupado">
                  E11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="E12" title="E12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  E12
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F1" title="F1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F1
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="F2 — Ocupado">
                  F2
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F3" title="F3" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F3
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F4" title="F4" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F5" title="F5" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F5
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F6" title="F6" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F6
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F7" title="F7" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F7
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F8" title="F8" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F8
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F9" title="F9" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F9
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F10" title="F10" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F11" title="F11" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="F12" title="F12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  F12
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 asiento-cliente-accesible rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G1" title="G1" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  <i className="fa-solid fa-wheelchair text-xs md:text-sm m-auto"></i>
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G2" title="G2" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G2
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G3" title="G3" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G3
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G4" title="G4" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G4
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G5" title="G5" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G5
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="G6 — Ocupado">
                  G6
                </button>
                <button className="seat asiento-cliente-no-disponible w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" disabled title="G7 — Ocupado">
                  G7
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G8" title="G8" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G8
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G9" title="G9" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G9
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G10" title="G10" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G10
                </button>
                <span aria-hidden="true" className="asiento-pasadizo"></span>
                <button className="seat w-7 h-7 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G11" title="G11" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  G11
                </button>
                <button className="seat w-7 h-7 md:w-10 md:h-10 asiento-cliente-accesible rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold text-white/70" data-id="G12" title="G12" onClick={(event) => { clickAsiento(event.currentTarget); }}>
                  <i className="fa-solid fa-wheelchair text-xs md:text-sm m-auto"></i>
                </button>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-600 rounded-t-lg rounded-b-sm border-b-2 border-black/50"></div>
                  {" "}
                  <span className="text-slate-400">
                    Disponible
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-brand-red rounded-t-lg rounded-b-sm border-b-2 border-brand-dark-red shadow-[0_0_5px_red]"></div>
                  {" "}
                  <span className="text-slate-400">
                    Seleccionado
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-slate-700 rounded-t-lg rounded-b-sm border-b-2 border-black/50 opacity-50"></div>
                  {" "}
                  <span className="text-slate-400">
                    Ocupado
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:col-span-1">
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 lg:sticky lg:top-28 shadow-xl">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-4">
                Resumen de Compra
              </h3>
              <div className="mb-4">
                <h4 className="font-bold text-white text-lg" data-bind="titulo" id="resumen-titulo-pelicula">
                  Spider-Man: Un Nuevo Día
                </h4>
                <p className="text-slate-400 text-sm" data-bind="detalle" id="resumen-detalle-pelicula">
                  Sáb, 10 Oct • 19:00 • 2D Doblada
                </p>
                <p className="text-brand-yellow text-sm font-semibold mt-1" data-bind="cine" id="resumen-cine">
                  Cine Náutica — Sala 1
                </p>
              </div>
              <div className="border-t border-white/10 py-4 min-h-[100px]" id="resumen-contenedor-asientos">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>
                    <i className="fa-solid fa-chair text-brand-yellow mr-2"></i>
                    D5
                    {" "}
                    <span className="text-slate-500">
                      · General / Adulto
                    </span>
                  </span>
                  <span className="text-white font-semibold">
                    S/ 18.00
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>
                    <i className="fa-solid fa-chair text-brand-yellow mr-2"></i>
                    D6
                    {" "}
                    <span className="text-slate-500">
                      · General / Adulto
                    </span>
                  </span>
                  <span className="text-white font-semibold">
                    S/ 18.00
                  </span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
                <span className="text-slate-300">
                  Total Entradas:
                </span>
                {" "}
                <span className="text-2xl font-bold text-white" id="resumen-total">
                  S/ 36.00
                </span>
              </div>
              {" "}
              <button className="w-full bg-brand-blue disabled:bg-slate-700 disabled:text-slate-500 hover:bg-brand-dark-blue text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2" id="btn-ir-dulceria" onClick={(event) => { irADulceria(); }}>
                Continuar a Dulcería
                {" "}
                <i className="fa-solid fa-bowl-food"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
