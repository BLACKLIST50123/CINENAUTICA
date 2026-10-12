"use client";

import { accTodoDetalle, alCambiarCiudadDetalle, aplicarFiltroDetalle, elegirFechaDetalle, seleccionarFuncion } from "@/src/lib/ui/cliente";
import { toggleAcc } from "@/src/lib/ui/common";
import { cambiarVista } from "@/src/lib/ui/nav";

export default function Detalle_demonio() {
  return (
    <>
      <div data-peli="demonio">
        <div className="relative w-full h-[50vh] min-h-[400px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://i0.wp.com/www.lacosacine.com/wp-content/uploads/2026/04/La-Noche-del-Demonio-Banner-1.jpg?resize=1200%2C720&ssl=1')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-black/30"></div>
          {" "}
          <button className="absolute top-24 left-6 md:left-12 z-50 text-white hover:text-brand-yellow bg-black/40 p-3 rounded-full backdrop-blur-md transition-colors" onClick={(event) => { cambiarVista('vista-detalle-pelicula', 'vista-inicio'); }}>
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-32 relative z-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
              <img alt="La Noche del Demonio" className="w-full rounded-2xl shadow-2xl shadow-black/80 border-2 border-white/10" src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" />
            </div>
            <div className="flex-grow pt-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                  +14
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  Terror / Suspenso
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  •
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  1h 46m
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                La Noche del Demonio
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-3xl">
                Una familia se muda a una nueva casa buscando un nuevo comienzo, solo para descubrir que el lugar está plagado de entidades oscuras. A medida que las manifestaciones empeoran, descubren que el verdadero mal no reside en la casa, sino que ha poseído a su hijo menor.
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-brand-blue pl-3">
                  Tráiler Oficial
                </h3>
                <div className="video-container max-w-3xl bg-black rounded-2xl border border-white/10">
                  <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0" data-src="https://www.youtube.com/embed/orvNgTGq6cg" frameBorder="0"></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Funciones disponibles
                </h2>
                <div className="h-1 w-20 bg-brand-blue rounded-full mt-2"></div>
              </div>
              {" "}
              <button className="text-xs text-slate-400 hover:text-white underline" onClick={(event) => { accTodoDetalle(event.currentTarget); }}>
                Expandir / contraer todo
              </button>
            </div>
            <div className="filtro-barra rounded-2xl p-4 md:p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="filtro-campo">
                  <label>
                    Ciudad
                  </label>
                  <i className="fa-solid fa-city"></i>
                  <select className="filtro-select js-det-ciudad" onChange={(event) => { alCambiarCiudadDetalle(event.currentTarget); }}>
                    <option value="">
                      Todas las ciudades
                    </option>
                    <option value="Chimbote">
                      Chimbote
                    </option>
                    <option value="Lima Metropolitana">
                      Lima Metropolitana
                    </option>
                    <option value="Nuevo Chimbote">
                      Nuevo Chimbote
                    </option>
                    <option value="Trujillo">
                      Trujillo
                    </option>
                  </select>
                </div>
                <div className="filtro-campo">
                  <label>
                    Sede
                  </label>
                  <i className="fa-solid fa-location-dot"></i>
                  <select className="filtro-select js-det-sede" onChange={(event) => { aplicarFiltroDetalle(event.currentTarget); }}>
                    <option value="">
                      Todas las sedes
                    </option>
                    <option data-ciudad="Chimbote" value="s1">
                      Náutica Megaplaza
                    </option>
                    <option data-ciudad="Chimbote" value="s2">
                      Náutica Costa Azul
                    </option>
                    <option data-ciudad="Nuevo Chimbote" value="s3">
                      Náutica Nuevo Chimbote
                    </option>
                    <option data-ciudad="Trujillo" value="s5">
                      Náutica Mall Trujillo
                    </option>
                    <option data-ciudad="Lima Metropolitana" value="s7">
                      Náutica Miraflores
                    </option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                  <i className="fa-regular fa-calendar mr-1 text-brand-blue"></i>
                  {" "}
                  Fecha
                </p>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 js-det-fechas">
                  <button className="chip-fecha activo" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d0'); }}>
                    <b>
                      Hoy
                    </b>
                    <span>
                      Sáb 10
                    </span>
                  </button>
                  <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d1'); }}>
                    <b>
                      Mañana
                    </b>
                    <span>
                      Dom 11
                    </span>
                  </button>
                  <button className="chip-fecha" data-sin="1" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d2'); }}>
                    <b>
                      Lun
                    </b>
                    <span>
                      12 Oct
                    </span>
                  </button>
                  <button className="chip-fecha" data-sin="1" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d3'); }}>
                    <b>
                      Mar
                    </b>
                    <span>
                      13 Oct
                    </span>
                  </button>
                  <button className="chip-fecha" data-sin="1" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d4'); }}>
                    <b>
                      Mié
                    </b>
                    <span>
                      14 Oct
                    </span>
                  </button>
                  <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d5'); }}>
                    <b>
                      Jue
                    </b>
                    <span>
                      15 Oct
                    </span>
                  </button>
                  <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d6'); }}>
                    <b>
                      Vie
                    </b>
                    <span>
                      16 Oct
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4 js-lista-sedes">
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Chimbote" data-sede="s1">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Megaplaza
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Chimbote · Av. Principal 123, Megaplaza Chimbote
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:15
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      16:15
                    </p>
                  </div>
                  {" "}
                  <i className="fa-solid fa-chevron-down acc-chevron text-slate-400 flex-shrink-0"></i>
                </button>
                {" "}
                <div className="acc-body">
                  <div className="acc-inner">
                    <div className="px-5 border-t border-white/5">
                      <div className="pt-1 pb-5" data-fecha="d0" style={{ display: "block" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','2D Doblada','16:15',4); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','2D Doblada','18:45',4); }}>
                            <span>
                              18:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','2D Doblada','21:15',4); }}>
                            <span>
                              21:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d5','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d5','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','2D Doblada','16:15',4); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','2D Doblada','18:45',4); }}>
                            <span>
                              18:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','2D Doblada','21:15',4); }}>
                            <span>
                              21:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Chimbote" data-sede="s2">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Costa Azul
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Chimbote · Av. Pardo 1450, Chimbote
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:30
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      —
                    </p>
                  </div>
                  {" "}
                  <i className="fa-solid fa-chevron-down acc-chevron text-slate-400 flex-shrink-0"></i>
                </button>
                {" "}
                <div className="acc-body">
                  <div className="acc-inner">
                    <div className="px-5 border-t border-white/5">
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','2D Doblada','16:30',4); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','2D Doblada','19:00',4); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','2D Doblada','21:30',4); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','D-BOX','19:30',5); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','D-BOX','22:00',5); }}>
                            <span>
                              22:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Doblada','16:30',4); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Doblada','19:00',4); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Doblada','21:30',4); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','D-BOX','19:30',5); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','D-BOX','22:00',5); }}>
                            <span>
                              22:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Doblada','16:30',4); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Doblada','19:00',4); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Doblada','21:30',4); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Nuevo Chimbote" data-sede="s3">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Nuevo Chimbote
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Nuevo Chimbote · Av. Universitaria 880, Nuevo Chimbote
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:00
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      16:00
                    </p>
                  </div>
                  {" "}
                  <i className="fa-solid fa-chevron-down acc-chevron text-slate-400 flex-shrink-0"></i>
                </button>
                {" "}
                <div className="acc-body">
                  <div className="acc-inner">
                    <div className="px-5 border-t border-white/5">
                      <div className="pt-1 pb-5" data-fecha="d0" style={{ display: "block" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','D-BOX','19:00',5); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','D-BOX','21:30',5); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','2D Doblada','16:00',4); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','2D Doblada','18:30',4); }}>
                            <span>
                              18:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','2D Doblada','21:00',4); }}>
                            <span>
                              21:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','D-BOX','19:00',5); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','D-BOX','21:30',5); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','D-BOX','19:00',5); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','D-BOX','21:30',5); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Trujillo" data-sede="s5">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Mall Trujillo
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Trujillo · Av. Mansiche 2100, Trujillo
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:30
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      16:30
                    </p>
                  </div>
                  {" "}
                  <i className="fa-solid fa-chevron-down acc-chevron text-slate-400 flex-shrink-0"></i>
                </button>
                {" "}
                <div className="acc-body">
                  <div className="acc-inner">
                    <div className="px-5 border-t border-white/5">
                      <div className="pt-1 pb-5" data-fecha="d0" style={{ display: "block" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d0','D-BOX','19:30',5); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d0','D-BOX','22:00',5); }}>
                            <span>
                              22:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d0','2D Doblada','16:30',4); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d0','2D Doblada','19:00',4); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d0','2D Doblada','21:30',4); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d1','D-BOX','19:30',5); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d1','D-BOX','22:00',5); }}>
                            <span>
                              22:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','D-BOX','19:30',5); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','D-BOX','22:00',5); }}>
                            <span>
                              22:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','D-BOX','19:30',5); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','D-BOX','22:00',5); }}>
                            <span>
                              22:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Doblada','16:30',4); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Doblada','19:00',4); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Doblada','21:30',4); }}>
                            <span>
                              21:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Lima Metropolitana" data-sede="s7">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Miraflores
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Lima Metropolitana · Av. Larco 812, Miraflores
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 19:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        D-BOX
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 16:15
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      16:15
                    </p>
                  </div>
                  {" "}
                  <i className="fa-solid fa-chevron-down acc-chevron text-slate-400 flex-shrink-0"></i>
                </button>
                {" "}
                <div className="acc-body">
                  <div className="acc-inner">
                    <div className="px-5 border-t border-white/5">
                      <div className="pt-1 pb-5" data-fecha="d0" style={{ display: "block" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','2D Doblada','16:15',4); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','2D Doblada','18:45',4); }}>
                            <span>
                              18:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','2D Doblada','21:15',4); }}>
                            <span>
                              21:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d5','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d5','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          D-BOX
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','D-BOX','19:15',5); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','D-BOX','21:45',5); }}>
                            <span>
                              21:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 5
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','2D Doblada','16:15',4); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','2D Doblada','18:45',4); }}>
                            <span>
                              18:45
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','2D Doblada','21:15',4); }}>
                            <span>
                              21:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 4
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="js-vacio hidden bg-dark-800 border border-dashed border-white/10 rounded-2xl p-10 text-center mt-4">
              <i className="fa-regular fa-calendar-xmark text-3xl text-slate-500 mb-3"></i>
              {" "}
              <h3 className="text-lg font-bold text-white mb-1">
                Sin funciones para este filtro
              </h3>
              <p className="text-slate-400 text-sm">
                Prueba con otra fecha u otra sede.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
