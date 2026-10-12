"use client";

import { accTodoDetalle, alCambiarCiudadDetalle, aplicarFiltroDetalle, elegirFechaDetalle, seleccionarFuncion } from "@/src/lib/ui/cliente";
import { toggleAcc } from "@/src/lib/ui/common";
import { cambiarVista } from "@/src/lib/ui/nav";

export default function Detalle_spiderman() {
  return (
    <>
      <div data-peli="spiderman">
        <div className="relative w-full h-[50vh] min-h-[400px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images7.alphacoders.com/141/thumb-1920-1411911.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-black/30"></div>
          {" "}
          <button className="absolute top-24 left-6 md:left-12 z-50 text-white hover:text-brand-yellow bg-black/40 p-3 rounded-full backdrop-blur-md transition-colors" onClick={(event) => { cambiarVista('vista-detalle-pelicula', 'vista-inicio'); }}>
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-32 relative z-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
              <img alt="Spider-Man: Un Nuevo Día" className="w-full rounded-2xl shadow-2xl shadow-black/80 border-2 border-white/10" src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" />
            </div>
            <div className="flex-grow pt-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                  APT
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  Acción / Aventura
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  •
                </span>
                <span className="text-slate-300 font-semibold text-sm">
                  2h 25m
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Spider-Man: Un Nuevo Día
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-3xl">
                Peter Parker se enfrenta a su mayor desafío cuando las barreras entre multiversos colisionan inesperadamente. Viejos enemigos de realidades alternativas llegan a Nueva York, y Peter deberá aliarse con versiones de sí mismo para restaurar el equilibrio antes de que su mundo sea destruido por completo.
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-brand-blue pl-3">
                  Tráiler Oficial
                </h3>
                <div className="video-container max-w-3xl bg-black rounded-2xl border border-white/10">
                  <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0" data-src="https://www.youtube.com/embed/QXibcL7-XbU" frameBorder="0"></iframe>
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
                    <option data-ciudad="Trujillo" value="s4">
                      Náutica Trujillo Centro
                    </option>
                    <option data-ciudad="Trujillo" value="s5">
                      Náutica Mall Trujillo
                    </option>
                    <option data-ciudad="Lima Metropolitana" value="s6">
                      Náutica Lima Norte
                    </option>
                    <option data-ciudad="Lima Metropolitana" value="s7">
                      Náutica Miraflores
                    </option>
                    <option data-ciudad="Lima Metropolitana" value="s8">
                      Náutica San Miguel
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
                  <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d2'); }}>
                    <b>
                      Lun
                    </b>
                    <span>
                      12 Oct
                    </span>
                  </button>
                  <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d3'); }}>
                    <b>
                      Mar
                    </b>
                    <span>
                      13 Oct
                    </span>
                  </button>
                  <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaDetalle(event.currentTarget,'d4'); }}>
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
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      14:15
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
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d0','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','2D Doblada','13:15',1); }}>
                            <span>
                              13:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','2D Doblada','16:15',1); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d1','2D Doblada','19:15',1); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d2','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d2','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d2','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d3','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d3','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d3','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d3','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d3','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d5','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d5','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d5','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s1','d6','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
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
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 17:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d4" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 17:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      13:30
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
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d0','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d1','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d2','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d2','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d2','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d2','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d2','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d4" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d4','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d4','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d5','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s2','d6','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
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
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        6 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d4" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        6 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
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
                        Próxima 13:00
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      13:00
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
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d0','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d1','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d3','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d3','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d3','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d4" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d4','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d4','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d4','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d4','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d4','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d4','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','2D Subtitulada','17:00',2); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d5','2D Subtitulada','20:00',2); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d6','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d6','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s3','d6','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Trujillo" data-sede="s4">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Trujillo Centro
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Trujillo · Jr. Pizarro 540, Trujillo
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d4" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      14:15
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
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d0','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d0','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d0','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d0','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d0','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d2','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d2','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d2','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d3','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d3','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d3','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d3','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d3','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d4" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','2D Doblada','13:15',1); }}>
                            <span>
                              13:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','2D Doblada','16:15',1); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d4','2D Doblada','19:15',1); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d5','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d5','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d5','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d6','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d6','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d6','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d6','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s4','d6','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
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
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 17:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d4" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 17:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
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
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d1','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d1','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d2','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d2','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d2','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d2','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d2','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d3','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d4" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d4','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d4','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d5','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s5','d6','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Lima Metropolitana" data-sede="s6">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica Lima Norte
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Lima Metropolitana · Av. Alfredo Mendiola 3698, Los Olivos
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        6 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d4" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        6 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:00
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      13:00
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
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d0','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d0','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d0','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d1','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d1','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d1','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d1','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d1','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d1','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','2D Subtitulada','17:00',2); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d2','2D Subtitulada','20:00',2); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d3','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d3','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d3','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d4" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d4','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d4','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d4','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d4','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d4','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d4','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','2D Doblada','13:00',1); }}>
                            <span>
                              13:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','2D Doblada','16:00',1); }}>
                            <span>
                              16:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','2D Doblada','19:00',1); }}>
                            <span>
                              19:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','SALA XD','14:00',3); }}>
                            <span>
                              14:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','SALA XD','17:00',3); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','SALA XD','20:00',3); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','2D Subtitulada','17:00',2); }}>
                            <span>
                              17:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s6','d5','2D Subtitulada','20:00',2); }}>
                            <span>
                              20:00
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
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
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        3 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d4" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:15
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 14:15
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      14:15
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
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d0','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','2D Doblada','13:15',1); }}>
                            <span>
                              13:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','2D Doblada','16:15',1); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d1','2D Doblada','19:15',1); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d2','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d2','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d2','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d3','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d3','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d3','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d3','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d3','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d4" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','2D Doblada','13:15',1); }}>
                            <span>
                              13:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','2D Doblada','16:15',1); }}>
                            <span>
                              16:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d4','2D Doblada','19:15',1); }}>
                            <span>
                              19:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','SALA XD','14:15',3); }}>
                            <span>
                              14:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','SALA XD','17:15',3); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','SALA XD','20:15',3); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','2D Subtitulada','17:15',2); }}>
                            <span>
                              17:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s7','d6','2D Subtitulada','20:15',2); }}>
                            <span>
                              20:15
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="acc bg-dark-800 border border-white/5 rounded-2xl overflow-hidden" data-ciudad="Lima Metropolitana" data-sede="s8">
                <button aria-expanded="false" className="acc-head p-4 md:p-5 flex items-center gap-4" type="button" onClick={(event) => { toggleAcc(event.currentTarget); }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-blue"></i>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      Náutica San Miguel
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      Lima Metropolitana · Av. La Marina 2355, San Miguel
                    </p>
                    {" "}
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d0" style={{ display: "flex" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d1" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        2 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 17:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d2" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d3" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d5" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        5 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                    <span className="head-info flex-wrap items-center gap-1.5 mt-2" data-fecha="d6" style={{ display: "none" }}>
                      <span className="mini-formato">
                        2D Subtitulada
                      </span>
                      <span className="mini-formato">
                        2D Doblada
                      </span>
                      <span className="mini-formato">
                        SALA XD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        8 funciones
                      </span>
                      <span className="sm:hidden text-[11px] text-brand-yellow font-bold ml-auto">
                        Próxima 13:30
                      </span>
                    </span>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      Próxima
                    </p>
                    <p className="text-brand-yellow font-bold text-lg js-proxima">
                      13:30
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
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d0','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d1" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d1','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d1','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d2" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d2','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d2','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d2','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d2','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d2','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d3" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d3','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d5" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d5','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d5','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d5','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d5','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d5','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-1 pb-5" data-fecha="d6" style={{ display: "none" }}>
                        <div className="formato-divisor">
                          2D Subtitulada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','2D Subtitulada','17:30',2); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','2D Subtitulada','20:30',2); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 2
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          2D Doblada
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','2D Doblada','13:30',1); }}>
                            <span>
                              13:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','2D Doblada','16:30',1); }}>
                            <span>
                              16:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','2D Doblada','19:30',1); }}>
                            <span>
                              19:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 1
                            </span>
                          </button>
                        </div>
                        <div className="formato-divisor">
                          SALA XD
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','SALA XD','14:30',3); }}>
                            <span>
                              14:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','SALA XD','17:30',3); }}>
                            <span>
                              17:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
                            </span>
                          </button>
                          <button className="time-btn bg-dark-900 border border-slate-600 hover:border-brand-blue hover:bg-brand-blue/10 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none flex flex-col items-center leading-tight" onClick={(event) => { seleccionarFuncion(event.currentTarget,'s8','d6','SALA XD','20:30',3); }}>
                            <span>
                              20:30
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Sala 3
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
