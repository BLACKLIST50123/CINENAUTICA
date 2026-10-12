"use client";

import { abrirModalCancelarFuncion, cambiarEstadoSalaAdmin, cambiarPestanaSala, cambiarSalaMantenimiento, clickMatrizEstructura, confirmarCambioFuncion, filtrarCatSede, generarMatriz, guardarCambiosSala, modoCambioFuncion, restablecerCambiosSala, toggleDatepickerHorarios, verPersonalAdmin, verSocioAdmin } from "@/src/lib/ui/admin";
import { abrirFichaPersonal, abrirModal, abrirModalFuncion, abrirModalFuncionDesdeGrid, abrirModalPersonal, alCambiarDatosFuncion, alCambiarPeliculaFuncion, cambiarTab, cerrarFichaPersonal, cerrarModal, cerrarModalFuncion, cerrarModalPersonal, datepickerCambiarMes, demo, filtrarListaSociosAdmin, generarContrasenaPersonalAdmin, guardarCuponSede, guardarFuncionAdmin, guardarPersonalAdmin, guardarPrecioSede, guardarTarifaEspecial, renderizarAdminPersonal, segmento, toggleMenuUsuario, validarCumpleanosAdmin } from "@/src/lib/ui/common";

export default function AdminSedeView() {
  return (
    <>
      <div className="bg-dark-900 text-white min-h-screen pt-16 antialiased">
        <header className="staff-header fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/img/logo/logocinenautica.png" alt="Logo" className="h-10 w-auto object-contain" />
            {" "}
            <span className="hidden sm:block text-xl font-bold tracking-tighter text-white">
              CINE
              <span className="text-brand-blue">
                NÁUTICA
              </span>
            </span>
            {" "}
            <span className="rol-badge rol-admin">
              Admin de sede
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs">
              <i className="fa-solid fa-location-dot text-brand-yellow"></i>
              <span className="font-bold text-white">
                Náutica Megaplaza
              </span>
            </div>
            {" "}
            <button className="relative text-slate-400 hover:text-white w-9 h-9 rounded-full hover:bg-white/5 transition-colors" title="Notificaciones" onClick={(event) => { demo(); }}>
              <i className="fa-regular fa-bell"></i>
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-brand-red"></span>
            </button>
            {" "}
            <div className="relative">
              <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-colors" onClick={(event) => { toggleMenuUsuario(); }}>
                <span className="w-9 h-9 rounded-full bg-dark-800 border-2 border-brand-blue flex items-center justify-center">
                  <i className="fa-solid fa-user text-brand-yellow text-sm"></i>
                </span>
                {" "}
                <span className="hidden md:block text-left leading-tight">
                  <span className="block text-sm font-bold text-white">
                    Rosa Medina
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Admin de sede
                  </span>
                </span>
                {" "}
                <i className="fa-solid fa-chevron-down text-[9px] text-slate-500 hidden md:block"></i>
              </button>
              {" "}
              <div id="menu-usuario-dd" className="hidden absolute right-0 top-12 w-56 bg-dark-800 border border-white/10 rounded-xl shadow-2xl p-2 fade-in">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-dark-700 hover:text-white" onClick={(event) => { demo(); }}>
                  <i className="fa-regular fa-user w-5"></i>
                  {" "}
                  Mi perfil
                </button>
                {" "}
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-dark-700 hover:text-white" onClick={(event) => { demo(); }}>
                  <i className="fa-solid fa-key w-5"></i>
                  {" "}
                  Cambiar contraseña
                </button>
                {" "}
                <a href="/acceso" className="block px-3 py-2 rounded-lg text-sm text-brand-red hover:bg-dark-700">
                  <i className="fa-solid fa-right-from-bracket w-5"></i>
                  {" "}
                  Cerrar sesión
                </a>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div id="sede-panel" className="max-w-[1500px] mx-auto px-4 md:px-8 py-6">
            <div className="ctx-bar p-4 md:p-5 flex flex-wrap items-center gap-4 mb-6 fade-in">
              <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-store text-white text-xl"></i>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold" id="ctx-ruta">
                  Áncash › Chimbote
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight" id="ctx-nombre">
                  Náutica Megaplaza
                </h2>
              </div>
              <div className="ml-auto flex flex-wrap gap-2 text-xs">
                <span className="chip-filtro">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span id="ctx-estado">
                    Operativa
                  </span>
                </span>
                {" "}
                <span className="chip-filtro">
                  <i className="fa-solid fa-door-open"></i>
                  <span id="ctx-salas">
                    8 salas
                  </span>
                </span>
                {" "}
                <span className="chip-filtro">
                  <i className="fa-solid fa-film"></i>
                  <span id="ctx-funciones">
                    34 funciones hoy
                  </span>
                </span>
                {" "}
                <span className="chip-filtro">
                  <i className="fa-solid fa-chair"></i>
                  <span id="ctx-ocup">
                    71% ocupación
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-3 shadow-xl flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:sticky lg:top-24">
                  <button data-tab="sede:dashboard" data-label="Dashboard" className="side-tab activo" onClick={(event) => { cambiarTab('sede','dashboard'); }}>
                    <i className="fa-solid fa-chart-line"></i>
                    {" "}
                    Dashboard
                  </button>
                  <button data-tab="sede:cartelera" data-label="Cartelera" className="side-tab" onClick={(event) => { cambiarTab('sede','cartelera'); }}>
                    <i className="fa-solid fa-clapperboard"></i>
                    {" "}
                    Cartelera
                  </button>
                  <button data-tab="sede:horarios" data-label="Horarios" className="side-tab" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                    <i className="fa-solid fa-clock"></i>
                    {" "}
                    Horarios
                  </button>
                  <button data-tab="sede:dulceria" data-label="Dulcería" className="side-tab" onClick={(event) => { cambiarTab('sede','dulceria'); }}>
                    <i className="fa-solid fa-bowl-food"></i>
                    {" "}
                    Dulcería
                  </button>
                  <button data-tab="sede:salas" data-label="Salas" className="side-tab" onClick={(event) => { cambiarTab('sede','salas'); }}>
                    <i className="fa-solid fa-chair"></i>
                    {" "}
                    Salas
                  </button>
                  <button data-tab="sede:tarifas" data-label="Tarifas" className="side-tab" onClick={(event) => { cambiarTab('sede','tarifas'); }}>
                    <i className="fa-solid fa-sack-dollar"></i>
                    {" "}
                    Tarifas
                  </button>
                  <button data-tab="sede:descuentos" data-label="Descuentos" className="side-tab" onClick={(event) => { cambiarTab('sede','descuentos'); }}>
                    <i className="fa-solid fa-tags"></i>
                    {" "}
                    Descuentos
                  </button>
                  <button data-tab="sede:socios" data-label="Socios" className="side-tab" onClick={(event) => { cambiarTab('sede','socios'); }}>
                    <i className="fa-solid fa-id-card"></i>
                    {" "}
                    Socios
                  </button>
                  <button data-tab="sede:personal" data-label="Personal" className="side-tab" onClick={(event) => { cambiarTab('sede','personal'); }}>
                    <i className="fa-solid fa-users-gear"></i>
                    {" "}
                    Personal
                  </button>
                </div>
              </aside>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-6 text-sm text-slate-400">
                  <i className="fa-solid fa-store text-brand-blue"></i>
                  <span>
                    Sede
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  <span className="text-white font-bold" data-breadcrumb="sede">
                    Dashboard
                  </span>
                </div>
                <div data-panel="sede:dashboard" className="">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Dashboard de la sede
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Indicadores de esta sede en el periodo elegido.
                      </p>
                    </div>
                    <div className="flex bg-dark-800 border border-white/5 rounded-xl p-1" data-seg="periodo-sede">
                      <button className="seg-btn activo" onClick={(event) => { segmento(event.currentTarget); }}>
                        Hoy
                      </button>
                      <button className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                        7 días
                      </button>
                      <button className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                        30 días
                      </button>
                      <button className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                        Año
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-yellow text-xl">
                        <i className="fa-solid fa-sack-dollar"></i>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">
                          Ingresos Netos
                        </p>
                        <p className="text-xl font-bold text-white" id="dash-kpi-ingresos">
                          S/ 18,420.50
                        </p>
                      </div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xl">
                        <i className="fa-solid fa-ticket"></i>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">
                          Entradas
                        </p>
                        <p className="text-xl font-bold text-white" id="dash-kpi-entradas">
                          684
                        </p>
                      </div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-xl">
                        <i className="fa-solid fa-bowl-food"></i>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">
                          Dulcería
                        </p>
                        <p className="text-xl font-bold text-white" id="dash-kpi-dulces">
                          1,203 ítems
                        </p>
                      </div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl">
                        <i className="fa-solid fa-users"></i>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">
                          Socios
                        </p>
                        <p className="text-xl font-bold text-white" id="dash-kpi-socios">
                          312
                        </p>
                      </div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-brand-red text-xl">
                        <i className="fa-solid fa-rotate-left"></i>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">
                          Reembolsos
                        </p>
                        <p className="text-xl font-bold text-white" id="dash-kpi-reembolsos">
                          4
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4">
                          División de Ingresos Netos
                        </h3>
                        <div className="flex items-center gap-6">
                          <div className="flex-grow">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300">
                                Taquilla (
                                <span id="dash-pct-taquilla">
                                  62%
                                </span>
                                )
                              </span>
                              {" "}
                              <span className="font-bold text-white" id="dash-monto-taquilla">
                                S/ 11,420.71
                              </span>
                            </div>
                            <div className="w-full bg-dark-900 rounded-full h-3 mb-4">
                              <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" id="dash-bar-taquilla" style={{ width: "62%" }}></div>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300">
                                Dulcería (
                                <span id="dash-pct-dulceria">
                                  38%
                                </span>
                                )
                              </span>
                              {" "}
                              <span className="font-bold text-white" id="dash-monto-dulceria">
                                S/ 6,999.79
                              </span>
                            </div>
                            <div className="w-full bg-dark-900 rounded-full h-3">
                              <div className="bg-brand-blue h-3 rounded-full transition-all duration-1000" id="dash-bar-dulceria" style={{ width: "38%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Top 3 Películas Más Vistas
                        </h3>
                        <div className="space-y-3" id="dash-top-peliculas">
                          <div className="flex items-center gap-3 bg-dark-900 rounded-xl p-3">
                            <span className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-sm">
                              1
                            </span>
                            {" "}
                            <img alt="" className="w-9 h-12 object-cover rounded" src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" />
                            {" "}
                            <div className="flex-grow min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Spider-Man: Un Nuevo Día
                              </p>
                              <p className="text-slate-500 text-xs">
                                248 entradas
                              </p>
                            </div>
                            <div className="w-24 bg-dark-800 rounded-full h-2">
                              <div className="bg-brand-yellow h-2 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-dark-900 rounded-xl p-3">
                            <span className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-sm">
                              2
                            </span>
                            {" "}
                            <img alt="" className="w-9 h-12 object-cover rounded" src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" />
                            {" "}
                            <div className="flex-grow min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Avengers: Endgame Encore
                              </p>
                              <p className="text-slate-500 text-xs">
                                171 entradas
                              </p>
                            </div>
                            <div className="w-24 bg-dark-800 rounded-full h-2">
                              <div className="bg-brand-yellow h-2 rounded-full" style={{ width: "69%" }}></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-dark-900 rounded-xl p-3">
                            <span className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-sm">
                              3
                            </span>
                            {" "}
                            <img alt="" className="w-9 h-12 object-cover rounded" src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" />
                            {" "}
                            <div className="flex-grow min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                La Noche del Demonio
                              </p>
                              <p className="text-slate-500 text-xs">
                                109 entradas
                              </p>
                            </div>
                            <div className="w-24 bg-dark-800 rounded-full h-2">
                              <div className="bg-brand-yellow h-2 rounded-full" style={{ width: "44%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-4">
                        Últimas 5 Transacciones
                      </h3>
                      <div className="flex-grow space-y-3 overflow-y-auto pr-1 hide-scrollbar" id="dash-ultimas-transacciones">
                        <div className="flex items-center justify-between bg-dark-900 rounded-xl p-3">
                          <div>
                            <p className="text-white text-sm font-semibold">
                              Spider-Man: Un Nuevo Día
                            </p>
                            <p className="text-slate-500 text-xs font-mono">
                              CR-482913 · 09/10/2026
                            </p>
                          </div>
                          <span className="text-brand-yellow font-bold text-sm">
                            S/ 76.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 rounded-xl p-3">
                          <div>
                            <p className="text-white text-sm font-semibold">
                              Avengers: Endgame Encore
                            </p>
                            <p className="text-slate-500 text-xs font-mono">
                              CR-377120 · 02/10/2026
                            </p>
                          </div>
                          <span className="text-brand-yellow font-bold text-sm">
                            S/ 87.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 rounded-xl p-3">
                          <div>
                            <p className="text-white text-sm font-semibold">
                              Coyote vs. Acme
                            </p>
                            <p className="text-slate-500 text-xs font-mono">
                              CR-215504 · 18/09/2026
                            </p>
                          </div>
                          <span className="text-brand-yellow font-bold text-sm">
                            S/ 12.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 rounded-xl p-3">
                          <div>
                            <p className="text-white text-sm font-semibold">
                              Dulcería directa
                            </p>
                            <p className="text-slate-500 text-xs font-mono">
                              CR-190377 · 28/09/2026
                            </p>
                          </div>
                          <span className="text-brand-yellow font-bold text-sm">
                            S/ 25.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 rounded-xl p-3">
                          <div>
                            <p className="text-white text-sm font-semibold">
                              Resident Evil: Noche Cero
                            </p>
                            <p className="text-slate-500 text-xs font-mono">
                              CR-174422 · 27/09/2026
                            </p>
                          </div>
                          <span className="text-brand-yellow font-bold text-sm">
                            S/ 54.00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:cartelera" className="hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Cartelera de la sede
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Recibes el catálogo de la administración global. Elige qué películas proyectas y cuáles destacas en el banner.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    <div className="xl:col-span-3 bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-4 gap-3">
                        <h3 className="text-lg font-bold text-white whitespace-nowrap">
                          Películas y Estrenos
                        </h3>
                        {" "}
                        <span className="text-xs font-bold text-slate-400 bg-dark-900 border border-white/10 rounded-full px-3 py-1">
                          10 títulos
                        </span>
                      </div>
                      <div className="relative mb-4">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                        <input type="text" placeholder="Buscar por título o género..." className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue" />
                      </div>
                      <div className="space-y-2 max-h-[40rem] overflow-y-auto hide-scrollbar">
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Avengers: Endgame Encore
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Acción / Ciencia Ficción • 3h 06m
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  CARTELERA
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Programar funciones" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                              <i className="fa-solid fa-calendar-days text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Resident Evil: Noche Cero
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Terror / Acción • 1h 30m
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  CARTELERA
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Programar funciones" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                              <i className="fa-solid fa-calendar-days text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Spider-Man: Un Nuevo Día
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Acción / Aventura • 2h 25m
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  CARTELERA
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Programar funciones" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                              <i className="fa-solid fa-calendar-days text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Coyote vs. Acme
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Animación / Comedia • 1h 44m
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  CARTELERA
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Programar funciones" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                              <i className="fa-solid fa-calendar-days text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                La Sombra del Exorcista
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Terror / Sobrenatural • 1h 27m
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  CARTELERA
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Programar funciones" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                              <i className="fa-solid fa-calendar-days text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                La Noche del Demonio
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Terror / Suspenso • 1h 46m
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  CARTELERA
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Programar funciones" onClick={(event) => { cambiarTab('sede','horarios'); }}>
                              <i className="fa-solid fa-calendar-days text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://m.media-amazon.com/images/M/MV5BNGEwYWZkN2UtOTQ5Mi00MGQzLWEzNjYtMWMyNDBkMTkzMWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Avengers: Doomsday
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Acción / Superhéroes
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  PRÓXIMO ESTRENO
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://metalcorrosivo.com/wp-content/uploads/2026/09/1790563661955.jpg" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Godzilla Minus One
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Ciencia Ficción / Kaiju
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  PRÓXIMO ESTRENO
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src="https://m.media-amazon.com/images/M/MV5BYjhlN2EyNGUtY2U4YS00ZTQ3LTg0NTgtNGIxZmVhMDlmMjIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Street Fighter
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Acción / Aventura
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  PRÓXIMO ESTRENO
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-uPV6Sz1kBFP1ECzxe3cyNSfC5lxngoH4H19DkQZ_9jJkiGKxPqeeHxM&s=10"} className="w-10 h-14 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">
                                Los Juegos del Hambre: Amanecer en la Cosecha
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                Acción / Ciencia Ficción
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-block bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  PRÓXIMO ESTRENO
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  <i className="fa-solid fa-lock mr-1"></i>
                                  Asignada por administración
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Ver ficha" onClick={(event) => { demo(); }}>
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-2 bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl h-max">
                      <h3 className="text-lg font-bold text-white">
                        Banner Principal
                      </h3>
                      <p className="text-slate-500 text-xs mt-1 mb-4">
                        Películas destacadas en el carrusel de la sede y su orden.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" defaultChecked className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Avengers: Endgame Encore
                            </p>
                          </label>
                          {" "}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" disabled className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-up text-xs"></i>
                            </button>
                            <button type="button" className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-down text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" defaultChecked className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Spider-Man: Un Nuevo Día
                            </p>
                          </label>
                          {" "}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-up text-xs"></i>
                            </button>
                            <button type="button" className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-down text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" defaultChecked className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://m.media-amazon.com/images/M/MV5BNGEwYWZkN2UtOTQ5Mi00MGQzLWEzNjYtMWMyNDBkMTkzMWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Avengers: Doomsday
                            </p>
                          </label>
                          {" "}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-up text-xs"></i>
                            </button>
                            <button type="button" className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-down text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" defaultChecked className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              La Noche del Demonio
                            </p>
                          </label>
                          {" "}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-up text-xs"></i>
                            </button>
                            <button type="button" disabled className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-yellow">
                              <i className="fa-solid fa-arrow-down text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Resident Evil: Noche Cero
                            </p>
                          </label>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Coyote vs. Acme
                            </p>
                          </label>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              La Sombra del Exorcista
                            </p>
                          </label>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://metalcorrosivo.com/wp-content/uploads/2026/09/1790563661955.jpg" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Godzilla Minus One
                            </p>
                          </label>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src="https://m.media-amazon.com/images/M/MV5BYjhlN2EyNGUtY2U4YS00ZTQ3LTg0NTgtNGIxZmVhMDlmMjIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Street Fighter
                            </p>
                          </label>
                        </div>
                        <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 gap-3">
                          <label className="flex items-center gap-3 min-w-0 cursor-pointer flex-grow">
                            <input type="checkbox" className="accent-brand-blue w-4 h-4 flex-shrink-0" />
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-uPV6Sz1kBFP1ECzxe3cyNSfC5lxngoH4H19DkQZ_9jJkiGKxPqeeHxM&s=10"} className="w-8 h-11 object-cover rounded flex-shrink-0" alt="" />
                            {" "}
                            <p className="text-white font-bold text-sm truncate">
                              Los Juegos del Hambre: Amanecer en la Cosecha
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:horarios" className="hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Horarios y Funciones
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Gestiona la programación diaria de las 8 salas.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="datepicker-container" id="datepicker-horarios">
                        <button className="datepicker-trigger" type="button" onClick={(event) => { toggleDatepickerHorarios(); }}>
                          <i className="fa-regular fa-calendar"></i>
                          {" "}
                          <span id="datepicker-label">
                            Vie, 9 Oct 2026
                          </span>
                          {" "}
                          <i className="fa-solid fa-chevron-down text-[10px] text-slate-500"></i>
                        </button>
                        {" "}
                        <div className="datepicker-dropdown" id="datepicker-dropdown">
                          <div className="dp-nav">
                            <button type="button" onClick={(event) => { datepickerCambiarMes(-1); }}>
                              <i className="fa-solid fa-chevron-left text-xs"></i>
                            </button>
                            {" "}
                            <span className="dp-mes-titulo" id="dp-mes-titulo">
                              Octubre 2026
                            </span>
                            {" "}
                            <button type="button" onClick={(event) => { datepickerCambiarMes(1); }}>
                              <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                          </div>
                          <div className="dp-dias-semana">
                            <span>
                              Do
                            </span>
                            <span>
                              Lu
                            </span>
                            <span>
                              Ma
                            </span>
                            <span>
                              Mi
                            </span>
                            <span>
                              Ju
                            </span>
                            <span>
                              Vi
                            </span>
                            <span>
                              Sá
                            </span>
                          </div>
                          <div className="dp-grid" id="dp-grid">
                            <button className="dp-dia dp-otro-mes" type="button"></button>
                            <button className="dp-dia dp-otro-mes" type="button"></button>
                            <button className="dp-dia dp-otro-mes" type="button"></button>
                            <button className="dp-dia dp-otro-mes" type="button"></button>
                            <button className="dp-dia" type="button">
                              1
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              2
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              3
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              4
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              5
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              6
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              7
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              8
                            </button>
                            <button className="dp-dia dp-hoy dp-seleccionado" type="button">
                              9
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              10
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              11
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              12
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              13
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              14
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              15
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              16
                            </button>
                            <button className="dp-dia dp-tiene-funciones" type="button">
                              17
                            </button>
                            <button className="dp-dia" type="button">
                              18
                            </button>
                            <button className="dp-dia" type="button">
                              19
                            </button>
                            <button className="dp-dia" type="button">
                              20
                            </button>
                            <button className="dp-dia" type="button">
                              21
                            </button>
                            <button className="dp-dia" type="button">
                              22
                            </button>
                            <button className="dp-dia" type="button">
                              23
                            </button>
                            <button className="dp-dia" type="button">
                              24
                            </button>
                            <button className="dp-dia" type="button">
                              25
                            </button>
                            <button className="dp-dia" type="button">
                              26
                            </button>
                            <button className="dp-dia" type="button">
                              27
                            </button>
                            <button className="dp-dia" type="button">
                              28
                            </button>
                            <button className="dp-dia" type="button">
                              29
                            </button>
                            <button className="dp-dia" type="button">
                              30
                            </button>
                            <button className="dp-dia" type="button">
                              31
                            </button>
                          </div>
                          <div className="dp-leyenda">
                            <div className="dp-leyenda-item">
                              <div className="dot" style={{ background: "var(--brand-yellow)" }}></div>
                              Con funciones
                            </div>
                            <div className="dp-leyenda-item">
                              <div className="dot" style={{ background: "var(--brand-blue)" }}></div>
                              Seleccionado
                            </div>
                          </div>
                        </div>
                      </div>
                      {" "}
                      <button className="bg-brand-blue hover:bg-brand-dark-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2" type="button" onClick={(event) => { abrirModalFuncion(); }}>
                        <i className="fa-solid fa-plus"></i>
                        {" "}
                        Añadir
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="grid-leyenda">
                      <div className="grid-leyenda-item">
                        <div className="swatch swatch-regular"></div>
                        Regular
                      </div>
                      <div className="grid-leyenda-item">
                        <div className="swatch swatch-estreno"></div>
                        Estreno
                      </div>
                      <div className="grid-leyenda-item">
                        <div className="swatch swatch-pre-estreno"></div>
                        Pre-Estreno
                      </div>
                      <div className="grid-leyenda-item">
                        <div className="swatch swatch-re-estreno"></div>
                        Re-Estreno
                      </div>
                      <div className="grid-leyenda-item">
                        <div className="swatch swatch-limpieza"></div>
                        Tiempo Limpieza (30m)
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold" id="grid-funciones-contador">
                      15 funciones programadas
                    </p>
                  </div>
                  <div className="grid-horarios-wrapper" id="grid-horarios-wrapper">
                    <div className="grid-horarios" id="grid-horarios">
                      <div className="grid-horarios-header">
                        <div className="grid-horarios-header-cell">
                          <i className="fa-regular fa-clock text-slate-600"></i>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 1
                          <span className="sala-formato-tag">
                            2D
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 2
                          <span className="sala-formato-tag">
                            2D · IMAX
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 3
                          <span className="sala-formato-tag">
                            2D · XD
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 4
                          <span className="sala-formato-tag">
                            2D · D-BOX
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 5
                          <span className="sala-formato-tag">
                            2D
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 6
                          <span className="sala-formato-tag">
                            D-BOX
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 7
                          <span className="sala-formato-tag">
                            2D
                          </span>
                        </div>
                        <div className="grid-horarios-header-cell">
                          Sala 8
                          <span className="sala-formato-tag">
                            2D · 3D
                          </span>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "2" }}>
                        10:00
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="1" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="2" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="3" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="4" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="5" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="6" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="7" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:00" data-sala="8" style={{ gridRow: "2" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 10:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "3" }}></div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="1" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="2" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="3" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="4" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="5" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="6" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="7" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="10:30" data-sala="8" style={{ gridRow: "3" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 10:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "4" }}>
                        11:00
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="1" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="2" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="3" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="4" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="5" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="6" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="7" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:00" data-sala="8" style={{ gridRow: "4" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 11:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "5" }}></div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="1" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="2" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="3" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="4" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="5" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="6" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="7" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="11:30" data-sala="8" style={{ gridRow: "5" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 11:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "6" }}>
                        12:00
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="1" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="2" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="3" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="4" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="5" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="6" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="7" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:00" data-sala="8" style={{ gridRow: "6" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 12:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "7" }}></div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="1" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="2" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="3" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="4" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="5" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="6" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="7" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="12:30" data-sala="8" style={{ gridRow: "7" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 12:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "8" }}>
                        13:00
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="1" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="2" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="3" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="4" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="5" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="6" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="7" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:00" data-sala="8" style={{ gridRow: "8" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 13:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "9" }}></div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="1" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="2" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="3" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="4" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="5" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="6" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="7" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="13:30" data-sala="8" style={{ gridRow: "9" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 13:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "10" }}>
                        14:00
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="1" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="2" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="3" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="4" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="5" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="6" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="7" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:00" data-sala="8" style={{ gridRow: "10" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 14:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "11" }}></div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="1" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="2" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="3" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="4" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="5" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="6" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="7" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="14:30" data-sala="8" style={{ gridRow: "11" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 14:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "12" }}>
                        15:00
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="1" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="2" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="3" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="4" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="5" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="6" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="7" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:00" data-sala="8" style={{ gridRow: "12" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 15:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "13" }}></div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="1" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="2" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="3" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="4" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="5" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="6" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="7" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="15:30" data-sala="8" style={{ gridRow: "13" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 15:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "14" }}>
                        16:00
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="1" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="2" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="3" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="4" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="5" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="6" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="7" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:00" data-sala="8" style={{ gridRow: "14" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 16:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "15" }}></div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="1" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="2" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="3" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="4" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="5" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="6" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="7" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="16:30" data-sala="8" style={{ gridRow: "15" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 16:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "16" }}>
                        17:00
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="1" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="2" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="3" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="4" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="5" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="6" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="7" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:00" data-sala="8" style={{ gridRow: "16" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 17:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "17" }}></div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="1" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="2" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="3" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="4" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="5" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="6" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="7" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="17:30" data-sala="8" style={{ gridRow: "17" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 17:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "18" }}>
                        18:00
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="1" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="2" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="3" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="4" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="5" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="6" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="7" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:00" data-sala="8" style={{ gridRow: "18" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 18:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "19" }}></div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="1" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="2" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="3" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="4" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="5" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="6" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="7" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="18:30" data-sala="8" style={{ gridRow: "19" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 18:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "20" }}>
                        19:00
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="1" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="2" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="3" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="4" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="5" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="6" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="7" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:00" data-sala="8" style={{ gridRow: "20" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 19:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "21" }}></div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="1" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="2" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="3" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="4" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="5" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="6" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="7" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="19:30" data-sala="8" style={{ gridRow: "21" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 19:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "22" }}>
                        20:00
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="1" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="2" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="3" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="4" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="5" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="6" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="7" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:00" data-sala="8" style={{ gridRow: "22" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 20:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "23" }}></div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="1" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="2" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="3" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="4" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="5" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="6" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="7" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="20:30" data-sala="8" style={{ gridRow: "23" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 20:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "24" }}>
                        21:00
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="1" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="2" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="3" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="4" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="5" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="6" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="7" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:00" data-sala="8" style={{ gridRow: "24" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 21:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "25" }}></div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="1" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="2" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="3" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="4" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="5" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="6" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="7" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="21:30" data-sala="8" style={{ gridRow: "25" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 21:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "26" }}>
                        22:00
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="1" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="2" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="3" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="4" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="5" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="6" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="7" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:00" data-sala="8" style={{ gridRow: "26" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 22:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "27" }}></div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="1" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="2" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="3" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="4" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="5" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="6" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="7" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="22:30" data-sala="8" style={{ gridRow: "27" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 22:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "28" }}>
                        23:00
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="1" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="2" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="3" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="4" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="5" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="6" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="7" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:00" data-sala="8" style={{ gridRow: "28" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 23:00" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-hora-label" style={{ gridRow: "29" }}></div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="1" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 1 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="2" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 2 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="3" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 3 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="4" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 4 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="5" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 5 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="6" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 6 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="7" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 7 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-fila-hora" data-hora="23:30" data-sala="8" style={{ gridRow: "29" }}>
                        <div className="grid-slot-vacio">
                          <button className="ghost-add-btn" title="Agregar función en Sala 8 a las 23:30" type="button" onClick={(event) => { abrirModalFuncionDesdeGrid(); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "2", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "360px", height: "350px", pointerEvents: "auto", animationDelay: "0.0s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              13:00 – 15:25
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Spider-Man: Un Nuevo Día
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "720px", height: "350px", pointerEvents: "auto", animationDelay: "0.04s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              16:00 – 18:25
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Spider-Man: Un Nuevo Día
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "1080px", height: "350px", pointerEvents: "auto", animationDelay: "0.08s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              19:00 – 21:25
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Spider-Man: Un Nuevo Día
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "3", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}>
                        <div className="grid-funcion-card tipo-re-estreno" style={{ top: "600px", height: "432px", pointerEvents: "auto", animationDelay: "0.0s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              15:00 – 18:06
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Avengers: Endgame Encore
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-re-estreno">
                                RE-ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                IMAX
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-re-estreno" style={{ top: "1080px", height: "432px", pointerEvents: "auto", animationDelay: "0.04s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              19:00 – 22:06
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Avengers: Endgame Encore
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-re-estreno">
                                RE-ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                IMAX
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "4", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "480px", height: "350px", pointerEvents: "auto", animationDelay: "0.0s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              14:00 – 16:25
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Spider-Man: Un Nuevo Día
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                XD
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "900px", height: "350px", pointerEvents: "auto", animationDelay: "0.04s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              17:30 – 19:55
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Spider-Man: Un Nuevo Día
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                XD
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-regular" style={{ top: "1320px", height: "240px", pointerEvents: "auto", animationDelay: "0.08s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              21:00 – 22:30
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Resident Evil: Noche Cero
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "5", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}>
                        <div className="grid-funcion-card tipo-regular" style={{ top: "540px", height: "268px", pointerEvents: "auto", animationDelay: "0.0s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              14:30 – 16:14
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Coyote vs. Acme
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-regular" style={{ top: "840px", height: "268px", pointerEvents: "auto", animationDelay: "0.04s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              17:00 – 18:44
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Coyote vs. Acme
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-pre-estreno" style={{ top: "1140px", height: "272px", pointerEvents: "auto", animationDelay: "0.08s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              19:30 – 21:16
                            </p>
                            <p className="grid-funcion-card-titulo">
                              La Noche del Demonio
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-pre-estreno">
                                PRE-ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "6", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "960px", height: "234px", pointerEvents: "auto", animationDelay: "0.0s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              18:00 – 19:27
                            </p>
                            <p className="grid-funcion-card-titulo">
                              La Sombra del Exorcista
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-estreno" style={{ top: "1260px", height: "234px", pointerEvents: "auto", animationDelay: "0.04s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              20:30 – 21:57
                            </p>
                            <p className="grid-funcion-card-titulo">
                              La Sombra del Exorcista
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag tag-estreno">
                                ESTRENO
                              </span>
                              <span className="grid-funcion-card-tag">
                                2D DOB
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "7", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}>
                        <div className="grid-funcion-card tipo-regular" style={{ top: "900px", height: "240px", pointerEvents: "auto", animationDelay: "0.0s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              17:30 – 19:00
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Resident Evil: Noche Cero
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag">
                                D-BOX
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                        <div className="grid-funcion-card tipo-regular" style={{ top: "1200px", height: "240px", pointerEvents: "auto", animationDelay: "0.04s" }} onClick={(event) => { abrirModalFuncion(); }}>
                          <div className="grid-funcion-card-acciones">
                            <button className="btn-editar" title="Editar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalFuncion(); }}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="btn-eliminar" title="Cancelar o reprogramar" type="button" onClick={(event) => { event.stopPropagation(); abrirModalCancelarFuncion(); }}>
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </button>
                          </div>
                          <div className="grid-funcion-card-body">
                            <p className="grid-funcion-card-hora">
                              20:00 – 21:30
                            </p>
                            <p className="grid-funcion-card-titulo">
                              Resident Evil: Noche Cero
                            </p>
                            <div className="grid-funcion-card-tags">
                              <span className="grid-funcion-card-tag">
                                D-BOX
                              </span>
                            </div>
                          </div>
                          <div className="grid-funcion-limpieza" style={{ height: "60px" }}>
                            <span className="grid-funcion-limpieza-label">
                              Limpieza
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid-sala-columna" style={{ gridColumn: "8", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}></div>
                      <div className="grid-sala-columna" style={{ gridColumn: "9", gridRow: "2 / 30", position: "relative", pointerEvents: "none" }}></div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:dulceria" className="hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Catálogo de Dulcería
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Productos definidos por la administración. Aquí ajustas el precio y el stock de tu sede.
                      </p>
                    </div>
                    {" "}
                    <span className="text-xs font-bold text-slate-400 bg-dark-800 border border-white/10 rounded-full px-3 py-1.5">
                      12 productos · 2 agotados · 2 con precio propio
                    </span>
                  </div>
                  <div className="bg-dark-800/60 border border-white/5 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="relative flex-1">
                      <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                      <input type="text" placeholder="Buscar producto..." className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-white/10" id="chips-cat-sede">
                      <button className="px-3 py-1.5 font-semibold whitespace-nowrap border-b-2 text-sm transition-colors text-brand-yellow border-brand-yellow" onClick={(event) => { filtrarCatSede(event.currentTarget,'all'); }}>
                        Todos
                      </button>
                      <button className="px-3 py-1.5 font-semibold whitespace-nowrap border-b-2 text-sm transition-colors text-slate-400 border-transparent hover:text-white" onClick={(event) => { filtrarCatSede(event.currentTarget,'combo'); }}>
                        Combos Populares
                      </button>
                      <button className="px-3 py-1.5 font-semibold whitespace-nowrap border-b-2 text-sm transition-colors text-slate-400 border-transparent hover:text-white" onClick={(event) => { filtrarCatSede(event.currentTarget,'cancha'); }}>
                        Cancha (Popcorn)
                      </button>
                      <button className="px-3 py-1.5 font-semibold whitespace-nowrap border-b-2 text-sm transition-colors text-slate-400 border-transparent hover:text-white" onClick={(event) => { filtrarCatSede(event.currentTarget,'bebida'); }}>
                        Bebidas
                      </button>
                      <button className="px-3 py-1.5 font-semibold whitespace-nowrap border-b-2 text-sm transition-colors text-slate-400 border-transparent hover:text-white" onClick={(event) => { filtrarCatSede(event.currentTarget,'snack'); }}>
                        Snacks &amp; Dulces
                      </button>
                    </div>
                  </div>
                  <div id="grid-dulceria-sede" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                    <div data-cat="combo" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-box-open"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Combo Mega Familiar
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Combos Populares
                          </p>
                          {" "}
                          <span className="inline-block mt-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                            Precio personalizado
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 67.00
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Original:
                            {" "}
                            <span className="line-through">
                              S/ 65.00
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="combo" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-heart"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Combo Dúo
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Combos Populares
                          </p>
                          {" "}
                          <span className="inline-block mt-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                            Precio personalizado
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 42.00
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Original:
                            {" "}
                            <span className="line-through">
                              S/ 40.00
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="combo" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Combo Personal
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Combos Populares
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 25.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="cancha" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-bowl-food"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Cancha Gigante
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Cancha (Popcorn)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 22.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="cancha" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col opacity-60">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-bowl-food"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Cancha Mediana
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Cancha (Popcorn)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 16.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Agotado
                            <input type="checkbox" className="toggle-stock" />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="bebida" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-glass-water"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Gaseosa Grande
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Bebidas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 12.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="bebida" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-glass-water"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Gaseosa Mediana
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Bebidas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 9.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="bebida" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-bottle-water"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Agua Mineral
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Bebidas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 6.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-cheese"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Nachos con Queso
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Snacks &amp; Dulces
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 15.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-hotdog"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Hot Dog Jumbo
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Snacks &amp; Dulces
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 12.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-candy-cane"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            M&amp;M's
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Snacks &amp; Dulces
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 8.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Stock
                            <input type="checkbox" className="toggle-stock" defaultChecked />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-4 shadow-xl hover:border-white/20 transition-colors flex flex-col opacity-60">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-2xl flex-shrink-0">
                          <i className="fa-solid fa-cookie"></i>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-white font-bold text-sm leading-tight">
                            Snickers
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Snacks &amp; Dulces
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white font-bold text-xl leading-none">
                            S/ 6.00
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Precio original
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                            Agotado
                            <input type="checkbox" className="toggle-stock" />
                          </label>
                          {" "}
                          <button className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 text-slate-400 hover:text-brand-yellow transition-colors" title="Editar precio" onClick={(event) => { abrirModal('modal-precio-dulce'); }}>
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:salas" className="hidden">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Mantenimiento de Salas
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">
                    Diseña la estructura de cada sala y luego administra el estado operativo de sus butacas.
                  </p>
                  <div className="w-full bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-brand-yellow mt-0.5"></i>
                    {" "}
                    <p className="text-brand-yellow text-xs leading-relaxed">
                      Puedes editar la distribución y el estado de
                      {" "}
                      <b>
                        cualquier butaca, incluidas las ya vendidas
                      </b>
                      {" "}
                      (se marcan solo como referencia, no bloquean la edición).
                      {" "}
                      <b>
                        Nada se guarda hasta que presiones "Guardar Cambios"
                      </b>
                      {" "}
                      — si cambias de sala o sales sin guardar, tus cambios en esta sala se pierden.
                    </p>
                  </div>
                  <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 md:p-10 shadow-xl flex flex-col items-center">
                    <div className="w-full max-w-xs mb-4">
                      <label className="block text-slate-400 text-xs font-bold uppercase mb-2 text-center">
                        Sala seleccionada
                      </label>
                      {" "}
                      <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-center font-bold focus:outline-none focus:border-brand-blue" id="admin-select-sala" onChange={(event) => { cambiarSalaMantenimiento(event.currentTarget.value); }}>
                        <option value="1">
                          Sala 1
                        </option>
                        <option value="2">
                          Sala 2
                        </option>
                        <option value="3">
                          Sala 3
                        </option>
                        <option value="4">
                          Sala 4
                        </option>
                        <option value="5">
                          Sala 5
                        </option>
                        <option value="6">
                          Sala 6
                        </option>
                        <option value="7">
                          Sala 7
                        </option>
                        <option value="8">
                          Sala 8
                        </option>
                      </select>
                      {" "}
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="text-xs text-slate-400 font-bold uppercase">
                          Estado Operativo:
                        </span>
                        {" "}
                        <select className="bg-dark-900 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-green-500 focus:outline-none focus:border-brand-blue" id="admin-sala-estado" onChange={(event) => { cambiarEstadoSalaAdmin(event.currentTarget.value); }}>
                          <option value="ACTIVA">
                            Activa
                          </option>
                          <option value="MANTENIMIENTO">
                            En mantenimiento
                          </option>
                          <option value="INACTIVA">
                            Inactiva
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4 bg-dark-900 border border-white/10 rounded-full px-4 py-1.5">
                      <i className="fa-solid fa-chair text-brand-yellow text-xs" id="admin-icono-contador-sala"></i>
                      {" "}
                      <span className="text-slate-300 text-xs font-semibold" id="admin-texto-contador-sala">
                        Butacas:
                        {" "}
                        <span className="contador-bloqueadas text-white font-bold" id="admin-contador-bloqueadas">
                          2 / 84
                        </span>
                      </span>
                    </div>
                    <div className="w-full max-w-xl mb-4">
                      <label className="block text-slate-500 text-xs mb-1.5 text-center">
                        Formatos de proyección que soporta esta sala
                      </label>
                      {" "}
                      <div className="flex flex-wrap justify-center gap-1.5" id="admin-sala-formatos">
                        <button className="chip-selector chip-selector-activo" type="button">
                          2D
                        </button>
                        <button className="chip-selector chip-selector-activo" type="button">
                          3D
                        </button>
                        <button className="chip-selector" type="button">
                          4DX
                        </button>
                        <button className="chip-selector chip-selector-activo" type="button">
                          XD
                        </button>
                        <button className="chip-selector" type="button">
                          VIP
                        </button>
                        <button className="chip-selector" type="button">
                          D-BOX
                        </button>
                        <button className="chip-selector" type="button">
                          IMAX
                        </button>
                      </div>
                    </div>
                    <div className="hidden w-full max-w-xl mb-4 bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-3 text-xs text-brand-blue" id="admin-sala-bloqueo-aviso"></div>
                    <div className="w-full max-w-xl flex border-b border-white/10 mb-6">
                      <button className="admin-pestana-sala flex-1 px-4 py-3 text-sm font-bold text-slate-500 border-b-2 border-transparent" id="admin-pestana-estructura" onClick={(event) => { cambiarPestanaSala('estructura'); }}>
                        <i className="fa-solid fa-table-cells-large mr-2"></i>
                        Dimensiones y Estructura
                      </button>
                      {" "}
                      <button className="admin-pestana-sala flex-1 px-4 py-3 text-sm font-bold text-brand-yellow border-b-2 border-brand-yellow" id="admin-pestana-estados" onClick={(event) => { cambiarPestanaSala('estados'); }}>
                        <i className="fa-solid fa-screwdriver-wrench mr-2"></i>
                        Estado de Butacas
                      </button>
                    </div>
                    <div className="hidden w-full max-w-xl mb-6 bg-dark-900 border border-white/10 rounded-xl p-4" id="admin-panel-estructura-sala">
                      <p className="text-white font-bold text-sm mb-1">
                        Define El Tamaño Y Distribución:
                      </p>
                      <p className="text-slate-500 text-xs mb-3">
                        Genera la matriz base y haz clic en una butaca verde para convertirla en pasadizo. Haz clic en el espacio vacío para restaurarla.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-slate-500 text-xs mb-1">
                            Filas
                          </label>
                          <input className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-yellow" id="admin-sala-filas" max="26" min="1" type="number" defaultValue="7" />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-xs mb-1">
                            Columnas
                          </label>
                          <input className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-yellow" id="admin-sala-columnas" max="30" min="1" type="number" defaultValue="12" />
                        </div>
                      </div>
                      {" "}
                      <button className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-sm transition-colors" type="button" onClick={(event) => { generarMatriz(); }}>
                        <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>
                        {" "}
                        Generar Cuadrícula Base
                      </button>
                    </div>
                    <div className="w-full max-w-xl mb-6 bg-dark-900 border border-white/10 rounded-xl p-4" id="admin-panel-estados-sala">
                      <p className="text-white font-bold text-sm mb-1">
                        Cambia Los Estados De Las Butacas Con Cada Click:
                      </p>
                      <p className="text-slate-500 text-xs">
                        Clic en una butaca visible para alternar: disponible → mantenimiento → accesible. Los pasadizos pertenecen a la estructura y no son editables aquí.
                      </p>
                    </div>
                    <div className="w-full max-w-[420px] mb-8 text-center">
                      <div className="w-full h-8 screen-curve"></div>
                      {" "}
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 block">
                        Pantalla
                      </span>
                    </div>
                    <div className="matriz-sala-admin" id="admin-grid-salas" style={({ "--columnas-sala": "14" } as React.CSSProperties)} onClick={(event) => { clickMatrizEstructura(event); }}>
                      <button className="butaca-matriz disponible" title="A1">
                        A1
                      </button>
                      <button className="butaca-matriz disponible" title="A2">
                        A2
                      </button>
                      <button className="butaca-matriz disponible" style={{ outline: "2px dotted rgba(255,255,255,.5)", outlineOffset: "2px" }} title="A3">
                        A3
                      </button>
                      <button className="butaca-matriz disponible" title="A4">
                        A4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="A5">
                        A5
                      </button>
                      <button className="butaca-matriz disponible" title="A6">
                        A6
                      </button>
                      <button className="butaca-matriz disponible" title="A7">
                        A7
                      </button>
                      <button className="butaca-matriz disponible" title="A8">
                        A8
                      </button>
                      <button className="butaca-matriz disponible" title="A9">
                        A9
                      </button>
                      <button className="butaca-matriz disponible" title="A10">
                        A10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="A11">
                        A11
                      </button>
                      <button className="butaca-matriz disponible" title="A12">
                        A12
                      </button>
                      <button className="butaca-matriz disponible" title="B1">
                        B1
                      </button>
                      <button className="butaca-matriz disponible" title="B2">
                        B2
                      </button>
                      <button className="butaca-matriz disponible" title="B3">
                        B3
                      </button>
                      <button className="butaca-matriz disponible" title="B4">
                        B4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="B5">
                        B5
                      </button>
                      <button className="butaca-matriz disponible" title="B6">
                        B6
                      </button>
                      <button className="butaca-matriz disponible" title="B7">
                        B7
                      </button>
                      <button className="butaca-matriz disponible" title="B8">
                        B8
                      </button>
                      <button className="butaca-matriz disponible" title="B9">
                        B9
                      </button>
                      <button className="butaca-matriz disponible" title="B10">
                        B10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="B11">
                        B11
                      </button>
                      <button className="butaca-matriz disponible" title="B12">
                        B12
                      </button>
                      <button className="butaca-matriz disponible" title="C1">
                        C1
                      </button>
                      <button className="butaca-matriz disponible" title="C2">
                        C2
                      </button>
                      <button className="butaca-matriz disponible" title="C3">
                        C3
                      </button>
                      <button className="butaca-matriz disponible" title="C4">
                        C4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="C5">
                        C5
                      </button>
                      <button className="butaca-matriz mantenimiento" title="C6">
                        C6
                      </button>
                      <button className="butaca-matriz mantenimiento" title="C7">
                        C7
                      </button>
                      <button className="butaca-matriz disponible" title="C8">
                        C8
                      </button>
                      <button className="butaca-matriz disponible" title="C9">
                        C9
                      </button>
                      <button className="butaca-matriz disponible" title="C10">
                        C10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="C11">
                        C11
                      </button>
                      <button className="butaca-matriz disponible" title="C12">
                        C12
                      </button>
                      <button className="butaca-matriz disponible" title="D1">
                        D1
                      </button>
                      <button className="butaca-matriz disponible" title="D2">
                        D2
                      </button>
                      <button className="butaca-matriz disponible" title="D3">
                        D3
                      </button>
                      <button className="butaca-matriz disponible" title="D4">
                        D4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" style={{ outline: "2px dotted rgba(255,255,255,.5)", outlineOffset: "2px" }} title="D5">
                        D5
                      </button>
                      <button className="butaca-matriz disponible" style={{ outline: "2px dotted rgba(255,255,255,.5)", outlineOffset: "2px" }} title="D6">
                        D6
                      </button>
                      <button className="butaca-matriz disponible" title="D7">
                        D7
                      </button>
                      <button className="butaca-matriz disponible" title="D8">
                        D8
                      </button>
                      <button className="butaca-matriz disponible" title="D9">
                        D9
                      </button>
                      <button className="butaca-matriz disponible" title="D10">
                        D10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="D11">
                        D11
                      </button>
                      <button className="butaca-matriz disponible" title="D12">
                        D12
                      </button>
                      <button className="butaca-matriz disponible" title="E1">
                        E1
                      </button>
                      <button className="butaca-matriz disponible" title="E2">
                        E2
                      </button>
                      <button className="butaca-matriz disponible" title="E3">
                        E3
                      </button>
                      <button className="butaca-matriz disponible" title="E4">
                        E4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="E5">
                        E5
                      </button>
                      <button className="butaca-matriz disponible" title="E6">
                        E6
                      </button>
                      <button className="butaca-matriz disponible" title="E7">
                        E7
                      </button>
                      <button className="butaca-matriz disponible" title="E8">
                        E8
                      </button>
                      <button className="butaca-matriz disponible" title="E9">
                        E9
                      </button>
                      <button className="butaca-matriz disponible" title="E10">
                        E10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="E11">
                        E11
                      </button>
                      <button className="butaca-matriz disponible" title="E12">
                        E12
                      </button>
                      <button className="butaca-matriz disponible" title="F1">
                        F1
                      </button>
                      <button className="butaca-matriz disponible" title="F2">
                        F2
                      </button>
                      <button className="butaca-matriz disponible" title="F3">
                        F3
                      </button>
                      <button className="butaca-matriz disponible" title="F4">
                        F4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="F5">
                        F5
                      </button>
                      <button className="butaca-matriz disponible" title="F6">
                        F6
                      </button>
                      <button className="butaca-matriz disponible" title="F7">
                        F7
                      </button>
                      <button className="butaca-matriz disponible" title="F8">
                        F8
                      </button>
                      <button className="butaca-matriz disponible" title="F9">
                        F9
                      </button>
                      <button className="butaca-matriz disponible" title="F10">
                        F10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="F11">
                        F11
                      </button>
                      <button className="butaca-matriz disponible" title="F12">
                        F12
                      </button>
                      <button className="butaca-matriz accesible" title="G1">
                        G1
                      </button>
                      <button className="butaca-matriz disponible" title="G2">
                        G2
                      </button>
                      <button className="butaca-matriz disponible" title="G3">
                        G3
                      </button>
                      <button className="butaca-matriz disponible" title="G4">
                        G4
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="G5">
                        G5
                      </button>
                      <button className="butaca-matriz disponible" title="G6">
                        G6
                      </button>
                      <button className="butaca-matriz disponible" title="G7">
                        G7
                      </button>
                      <button className="butaca-matriz disponible" title="G8">
                        G8
                      </button>
                      <button className="butaca-matriz disponible" title="G9">
                        G9
                      </button>
                      <button className="butaca-matriz disponible" title="G10">
                        G10
                      </button>
                      <button className="butaca-matriz pasadizo" title="Pasadizo"></button>
                      <button className="butaca-matriz disponible" title="G11">
                        G11
                      </button>
                      <button className="butaca-matriz accesible" title="G12">
                        G12
                      </button>
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-600 rounded-t-lg rounded-b-sm border-b-2 border-black/50"></div>
                        {" "}
                        <span className="text-slate-400">
                          Disponible
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-slate-600 rounded-t-lg rounded-b-sm border-b-2 border-brand-red"></div>
                        {" "}
                        <span className="text-slate-400">
                          Mantenimiento
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded-t-lg rounded-b-sm border-b-2 border-blue-800"></div>
                        {" "}
                        <span className="text-slate-400">
                          Accesible
                        </span>
                      </div>
                    </div>
                    <div className="w-full max-w-xl mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                      <button className="w-full sm:w-auto bg-dark-900 hover:bg-dark-700 border border-white/10 text-slate-300 hover:text-white py-3 px-6 rounded-xl font-bold transition-colors flex items-center justify-center gap-2" id="btn-restablecer-cambios-sala" type="button" onClick={(event) => { restablecerCambiosSala(); }}>
                        <i className="fa-solid fa-rotate-left"></i>
                        {" "}
                        Restablecer
                      </button>
                      {" "}
                      <button className="w-full flex-grow bg-brand-blue hover:bg-brand-dark-blue text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2" id="btn-guardar-cambios-sala" type="button" onClick={(event) => { guardarCambiosSala(); }}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {" "}
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:tarifas" className="hidden">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Tarifas de la sede
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Ajusta la tarifa base por día de tu sede. Los formatos y tipos de entrada los define la administración.
                  </p>
                  <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl max-w-3xl mb-8">
                    <h3 className="text-lg font-bold text-white mb-1">
                      <i className="fa-solid fa-calendar-day text-brand-yellow mr-2"></i>
                      Tarifas base por día
                    </h3>
                    <p className="text-slate-500 text-xs mb-5">
                      Resaltado en amarillo: tarifa distinta a la global. No se pueden eliminar.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-dark-900 rounded-xl px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-circle-dollar-to-slot text-brand-yellow text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold leading-tight">
                            Tarifa Económica
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            Solo los Martes
                          </p>
                        </div>
                        <div className="text-right mr-2 hidden sm:block">
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                            Global
                          </p>
                          <p className="text-slate-400 text-sm font-semibold">
                            S/ 12.00
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-slate-400 text-sm">
                            S/
                          </span>
                          <input type="number" min="0" step="0.5" defaultValue="11.0" className="w-20 bg-dark-800 border border-brand-yellow/50 rounded-lg px-2 py-1.5 text-white text-sm text-right focus:outline-none focus:border-brand-yellow" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-dark-900 rounded-xl px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-sack-dollar text-brand-yellow text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold leading-tight">
                            Tarifa Media
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            Lunes y Miércoles
                          </p>
                        </div>
                        <div className="text-right mr-2 hidden sm:block">
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                            Global
                          </p>
                          <p className="text-slate-400 text-sm font-semibold">
                            S/ 13.00
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-slate-400 text-sm">
                            S/
                          </span>
                          <input type="number" min="0" step="0.5" defaultValue="13.0" className="w-20 bg-dark-800 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm text-right focus:outline-none focus:border-brand-yellow" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-dark-900 rounded-xl px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-fire text-brand-yellow text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold leading-tight">
                            Tarifa Alta
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            Jue, Vie, Sáb, Dom y Pre-Estrenos
                          </p>
                        </div>
                        <div className="text-right mr-2 hidden sm:block">
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                            Global
                          </p>
                          <p className="text-slate-400 text-sm font-semibold">
                            S/ 18.00
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-slate-400 text-sm">
                            S/
                          </span>
                          <input type="number" min="0" step="0.5" defaultValue="19.0" className="w-20 bg-dark-800 border border-brand-yellow/50 rounded-lg px-2 py-1.5 text-white text-sm text-right focus:outline-none focus:border-brand-yellow" />
                        </div>
                      </div>
                    </div>
                    {" "}
                    <button className="mt-5 bg-brand-blue hover:bg-brand-dark-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" onClick={(event) => { demo(); }}>
                      <i className="fa-solid fa-floppy-disk mr-2"></i>
                      Guardar cambios
                    </button>
                  </div>
                  <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl max-w-3xl">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          <i className="fa-solid fa-calendar-star text-brand-red mr-2"></i>
                          Tarifas especiales
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">
                          Feriados, campañas o fechas puntuales. Tienen prioridad sobre la tarifa base del día.
                        </p>
                      </div>
                      {" "}
                      <button className="bg-brand-yellow hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-sm transition-colors whitespace-nowrap" onClick={(event) => { abrirModal('modal-tarifa-especial'); }}>
                        <i className="fa-solid fa-plus mr-1"></i>
                        {" "}
                        Agregar
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-dark-900 rounded-xl px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-calendar-star text-brand-red text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold leading-tight">
                            Feriado — Santa Rosa de Lima
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            30 Ago 2026 · todo el día
                          </p>
                        </div>
                        <span className="text-white font-bold">
                          S/ 18.00
                        </span>
                        {" "}
                        <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                          Activa
                          <input type="checkbox" className="toggle-stock" />
                        </label>
                        <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow" title="Editar" onClick={(event) => { demo(); }}>
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 bg-dark-900 rounded-xl px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-calendar-star text-brand-red text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold leading-tight">
                            Semana de Halloween
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            26 – 31 Oct 2026
                          </p>
                        </div>
                        <span className="text-white font-bold">
                          S/ 17.00
                        </span>
                        {" "}
                        <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                          Activa
                          <input type="checkbox" className="toggle-stock" defaultChecked />
                        </label>
                        <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow" title="Editar" onClick={(event) => { demo(); }}>
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 bg-dark-900 rounded-xl px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-calendar-star text-brand-red text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold leading-tight">
                            Día del Padre
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            21 Jun 2026
                          </p>
                        </div>
                        <span className="text-white font-bold">
                          S/ 16.00
                        </span>
                        {" "}
                        <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                          Activa
                          <input type="checkbox" className="toggle-stock" />
                        </label>
                        <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow" title="Editar" onClick={(event) => { demo(); }}>
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:descuentos" className="hidden">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Cupones y Promociones
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Crea cupones propios de tu sede. Los globales los define la administración y no se pueden editar.
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl h-max">
                      <h3 className="text-lg font-bold text-white mb-4">
                        Crear cupón de sede
                      </h3>
                      <form className="space-y-3" onSubmit={(event) => { guardarCuponSede(event); }}>
                        <input type="text" required maxLength={50} placeholder="Código (ej: CHIMBOTE15)" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow uppercase" />
                        <input type="number" required min="1" max="100" placeholder="Porcentaje de descuento" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                        <input type="text" placeholder="Descripción (opcional)" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                        {" "}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">
                              Vigente desde
                            </label>
                            <input type="date" required className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">
                              Hasta
                            </label>
                            <input type="date" required className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 mb-1 block">
                            Usos máximos
                          </label>
                          <input type="number" min="1" required placeholder="Ej: 100" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          <i className="fa-solid fa-circle-info text-brand-blue mr-1"></i>
                          Solo será válido en esta sede.
                        </p>
                        {" "}
                        <button type="submit" className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors">
                          Crear cupón
                        </button>
                      </form>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Cupones de la sede
                          {" "}
                          <span className="text-xs text-slate-500 font-normal">
                            (editables)
                          </span>
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3">
                            <div>
                              <p className="text-brand-yellow font-mono font-bold text-sm">
                                CHIMBOTE15
                              </p>
                              <p className="text-slate-500 text-xs">
                                Promo local — martes de cine
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-bold">
                                -15%
                              </span>
                              <label className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                Activo
                                <input type="checkbox" className="toggle-stock" defaultChecked />
                              </label>
                              <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow" onClick={(event) => { demo(); }}>
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-blue" onClick={(event) => { demo(); }}>
                                <i className="fa-solid fa-trash text-xs"></i>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3">
                            <div>
                              <p className="text-brand-yellow font-mono font-bold text-sm">
                                FAMILIA25
                              </p>
                              <p className="text-slate-500 text-xs">
                                Combo familiar fines de semana
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-bold">
                                -25%
                              </span>
                              <label className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                Activo
                                <input type="checkbox" className="toggle-stock" defaultChecked />
                              </label>
                              <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-yellow" onClick={(event) => { demo(); }}>
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              <button className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 text-slate-400 hover:text-brand-blue" onClick={(event) => { demo(); }}>
                                <i className="fa-solid fa-trash text-xs"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Cupones globales
                          {" "}
                          <span className="text-xs text-slate-500 font-normal">
                            (solo lectura)
                          </span>
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 opacity-90">
                            <div className="flex items-center gap-3">
                              <i className="fa-solid fa-lock text-slate-600 text-xs"></i>
                              {" "}
                              <div>
                                <p className="text-slate-300 font-mono font-bold text-sm">
                                  VERANO20
                                </p>
                                <p className="text-slate-500 text-xs">
                                  Descuento de verano
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                Global
                              </span>
                              <span className="text-white font-bold">
                                -20%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-dark-900 border border-white/5 rounded-xl p-3 opacity-90">
                            <div className="flex items-center gap-3">
                              <i className="fa-solid fa-lock text-slate-600 text-xs"></i>
                              {" "}
                              <div>
                                <p className="text-slate-300 font-mono font-bold text-sm">
                                  NAUTICA10
                                </p>
                                <p className="text-slate-500 text-xs">
                                  Bienvenida Náutica
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                Global
                              </span>
                              <span className="text-white font-bold">
                                -10%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:socios" className="hidden">
                  <div className="chip-filtro mb-4">
                    <i className="fa-solid fa-globe"></i>
                    {" "}
                    Socios globales: sus puntos valen en cualquier sede
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Socios
                  </h2>
                  <p className="text-slate-400 text-sm mb-6">
                    Filtra o busca para encontrar rápido a un socio; haz clic en su tarjeta para ver su carnet, nivel e historial completo de puntos. Los canjes y puntos se generan solo desde una venta real (web o "Nueva Venta" en counter); aquí no se editan a mano.
                  </p>
                  <div className="bg-dark-800/40 border border-white/5 rounded-2xl p-2 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 mb-2 px-2 pt-2">
                      <input className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" id="admin-socio-busqueda" placeholder="Buscar por nombre, correo, código o DNI..." type="text" onInput={(event) => { filtrarListaSociosAdmin(); }} />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2 px-2" id="admin-socios-filtros-nivel">
                      <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-brand-yellow text-black border-brand-yellow" type="button">
                        Todos (5)
                      </button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" type="button">
                        Bronce (2)
                      </button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" type="button">
                        Plata (2)
                      </button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" type="button">
                        Oro (1)
                      </button>
                    </div>
                    <p className="text-slate-500 text-xs mb-2 px-2" id="admin-socios-contador">
                      5 de 5 socio(s)
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" id="admin-socios-lista">
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verSocioAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ borderColor: "#C0C0C0", color: "#C0C0C0" }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Juan Pérez
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            juan.perez@correo.com ·
                            {" "}
                            <span className="font-mono">
                              CIN-482913
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "#C0C0C022", color: "#C0C0C0", border: "1px solid #C0C0C055" }}>
                            Plata
                          </span>
                          {" "}
                          <p className="text-brand-yellow font-bold text-sm mt-0.5">
                            540 pts
                          </p>
                        </div>
                      </button>
                      {" "}
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verSocioAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ borderColor: "#FFD700", color: "#FFD700" }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            María Torres
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            maria.torres@correo.com ·
                            {" "}
                            <span className="font-mono">
                              CIN-118832
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "#FFD70022", color: "#FFD700", border: "1px solid #FFD70055" }}>
                            Oro
                          </span>
                          {" "}
                          <p className="text-brand-yellow font-bold text-sm mt-0.5">
                            920 pts
                          </p>
                        </div>
                      </button>
                      {" "}
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verSocioAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ borderColor: "#CD7F32", color: "#CD7F32" }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Luis Rojas
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            luis.rojas@correo.com ·
                            {" "}
                            <span className="font-mono">
                              CIN-774105
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "#CD7F3222", color: "#CD7F32", border: "1px solid #CD7F3255" }}>
                            Bronce
                          </span>
                          {" "}
                          <p className="text-brand-yellow font-bold text-sm mt-0.5">
                            120 pts
                          </p>
                        </div>
                      </button>
                      {" "}
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verSocioAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ borderColor: "#C0C0C0", color: "#C0C0C0" }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Ana Quispe
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            ana.quispe@correo.com ·
                            {" "}
                            <span className="font-mono">
                              CIN-330917
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "#C0C0C022", color: "#C0C0C0", border: "1px solid #C0C0C055" }}>
                            Plata
                          </span>
                          {" "}
                          <p className="text-brand-yellow font-bold text-sm mt-0.5">
                            365 pts
                          </p>
                        </div>
                      </button>
                      {" "}
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verSocioAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ borderColor: "#CD7F32", color: "#CD7F32" }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Carlos Vega
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            carlos.vega@correo.com ·
                            {" "}
                            <span className="font-mono">
                              CIN-905561
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "#CD7F3222", color: "#CD7F32", border: "1px solid #CD7F3255" }}>
                            Bronce
                          </span>
                          {" "}
                          <p className="text-brand-yellow font-bold text-sm mt-0.5">
                            40 pts
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="hidden bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl flex-col gap-6" id="admin-socio-resultado">
                    <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-dark-900 border-2 border-brand-yellow flex items-center justify-center text-2xl">
                          <i className="fa-solid fa-user text-brand-yellow"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white" id="admin-socio-nombre">
                            Juan Pérez
                          </h3>
                          <p className="text-slate-400 text-sm" id="admin-socio-correo">
                            juan.perez@correo.com
                          </p>
                          <p className="text-slate-500 text-xs font-mono mt-1" id="admin-socio-codigo">
                            CIN-482913
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button className="text-slate-400 hover:text-white transition-colors mb-1" title="Cerrar detalle" onClick={(event) => { document.getElementById('admin-socio-resultado')!.classList.add('hidden'); }}>
                          <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                        {" "}
                        <div className="flex gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" id="admin-socio-nivel-badge" style={{ background: "#C0C0C022", color: "#C0C0C0", border: "1px solid #C0C0C055" }}>
                            Plata
                          </span>
                          {" "}
                          <p className="text-brand-yellow font-bold px-2" id="admin-socio-puntos">
                            540 pts
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-2">
                      <div className="space-y-4">
                        <h4 className="text-brand-yellow font-bold mb-3 border-b border-white/10 pb-2">
                          <i className="fa-solid fa-gift mr-2"></i>
                          {" "}
                          Beneficios Activos
                        </h4>
                        <div className="bg-dark-900 rounded-xl p-4 flex items-center justify-between gap-3 border border-white/5">
                          <span className="text-slate-300 text-sm flex items-center gap-2">
                            <i className="fa-solid fa-cake-candles text-brand-yellow"></i>
                            {" "}
                            <span id="admin-socio-cumple-texto">
                              Cumpleaños en Noviembre
                            </span>
                          </span>
                          {" "}
                          <button className="hidden bg-brand-yellow hover:bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap shadow-lg" id="admin-socio-btn-cumple" onClick={(event) => { validarCumpleanosAdmin(); }}>
                            Marcar usada
                          </button>
                        </div>
                        <div className="bg-dark-900 rounded-xl p-4 flex items-center gap-2 border border-white/5">
                          <i className="fa-solid fa-people-line text-green-400"></i>
                          {" "}
                          <span className="text-slate-300 text-sm" id="admin-socio-fila-texto">
                            Fila preferencial activa
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col h-full">
                        <h4 className="text-brand-yellow font-bold mb-3 border-b border-white/10 pb-2">
                          <i className="fa-solid fa-star mr-2"></i>
                          {" "}
                          Movimientos de Puntos
                        </h4>
                        <div className="space-y-2 overflow-y-auto custom-scrollbar max-h-[150px] pr-2" id="admin-socio-historial">
                          <div className="flex justify-between items-center bg-dark-900 rounded-lg px-3 py-2 text-sm">
                            <span className="text-slate-300">
                              Compra CR-482913
                              <span className="text-slate-500 text-xs block">
                                09/10/2026
                              </span>
                            </span>
                            <span className="text-green-400 font-bold">
                              +76
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-dark-900 rounded-lg px-3 py-2 text-sm">
                            <span className="text-slate-300">
                              Canje en compra
                              <span className="text-slate-500 text-xs block">
                                02/10/2026
                              </span>
                            </span>
                            <span className="text-brand-blue font-bold">
                              -50
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-dark-900 rounded-lg px-3 py-2 text-sm">
                            <span className="text-slate-300">
                              Compra CR-377120
                              <span className="text-slate-500 text-xs block">
                                02/10/2026
                              </span>
                            </span>
                            <span className="text-green-400 font-bold">
                              +87
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-6" id="admin-socio-compras-historial-container">
                      <h4 className="text-brand-yellow font-bold mb-3">
                        <i className="fa-solid fa-receipt mr-2"></i>
                        {" "}
                        Historial de compras
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      </div>
                    </div>
                  </div>
                </div>
                <div data-panel="sede:personal" className="hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      Personal
                    </h2>
                    {" "}
                    <button className="bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors self-start" type="button" onClick={(event) => { abrirModalPersonal(); }}>
                      <i className="fa-solid fa-plus mr-2"></i>
                      Nueva cuenta
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">
                    Gestiona las cuentas de
                    {" "}
                    <strong className="text-slate-300">
                      Admin de sede
                    </strong>
                    {" "}
                    y
                    {" "}
                    <strong className="text-slate-300">
                      Counter
                    </strong>
                    {" "}
                    de
                    {" "}
                    <strong className="text-slate-300">
                      Náutica Megaplaza
                    </strong>
                    . Solo ves y administras al personal de esta sede.
                  </p>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm mb-4 focus:outline-none focus:border-brand-yellow" id="admin-personal-busqueda" placeholder="Buscar por nombre, correo o DNI..." type="text" onInput={(event) => { renderizarAdminPersonal(); }} />
                  {" "}
                  <div className="flex flex-wrap gap-2 mb-4" id="admin-personal-filtros">
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-brand-yellow text-black border-brand-yellow" type="button">
                      Todos (5)
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" type="button">
                      Admin de sede (2)
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" type="button">
                      Counter (3)
                    </button>
                  </div>
                  <div className="bg-dark-800/40 border border-white/5 rounded-2xl p-2 mb-6">
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" id="admin-personal-lista">
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verPersonalAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user-tie text-slate-400"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Rosa Medina
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            rosa.medina@cinenautica.pe · DNI 40112233
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border text-brand-yellow bg-brand-yellow/10 border-brand-yellow/30">
                          Admin de sede
                        </span>
                      </button>
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verPersonalAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user-tie text-slate-400"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Jorge Valdivia
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            jorge.valdivia@cinenautica.pe · DNI 40998877
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border text-brand-yellow bg-brand-yellow/10 border-brand-yellow/30">
                          Admin de sede
                        </span>
                      </button>
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verPersonalAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user-tie text-slate-400"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Pedro Salazar
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            pedro.salazar@cinenautica.pe · DNI 41223344
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border text-green-400 bg-green-500/10 border-green-500/30">
                          Counter
                        </span>
                      </button>
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verPersonalAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user-tie text-slate-400"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Lucía Ramos
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            lucia.ramos@cinenautica.pe · DNI 42334455
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border text-green-400 bg-green-500/10 border-green-500/30">
                          Counter
                        </span>
                      </button>
                      <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { verPersonalAdmin(); }}>
                        <div className="w-9 h-9 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user-tie text-slate-400"></i>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            Mateo Ríos
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            mateo.rios@cinenautica.pe · DNI 43445566
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border text-green-400 bg-green-500/10 border-green-500/30">
                          Counter
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="hidden bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl flex-col gap-6" id="admin-personal-detalle-panel">
                    <div className="flex justify-between items-start border-b border-white/10 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-dark-900 border-2 border-brand-yellow flex items-center justify-center text-2xl">
                          <i className="fa-solid fa-user-tie text-brand-yellow"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Rosa Medina
                          </h3>
                          <p className="text-slate-400 text-sm">
                            rosa.medina@cinenautica.pe
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            DNI 40112233 · Admin de sede
                          </p>
                        </div>
                      </div>
                      {" "}
                      <button className="text-slate-400 hover:text-white" onClick={(event) => { document.getElementById('admin-personal-detalle-panel')!.classList.add('hidden'); }}>
                        <i className="fa-solid fa-xmark text-xl"></i>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" type="button" onClick={(event) => { abrirFichaPersonal(); }}>
                        <i className="fa-solid fa-id-badge mr-2"></i>
                        Ver ficha
                      </button>
                      {" "}
                      <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" type="button" onClick={(event) => { abrirModalPersonal(); }}>
                        <i className="fa-solid fa-pen mr-2"></i>
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-funcion">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar" id="funcion-contenido">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" type="button" onClick={(event) => { cerrarModalFuncion(); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <h3 className="text-2xl font-bold text-white mb-6" id="funcion-modal-titulo">
              Agregar función
            </h3>
            <form className="space-y-3" onSubmit={(event) => { guardarFuncionAdmin(event); }}>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Película
                </label>
                {" "}
                <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="funcion-pelicula" onChange={(event) => { alCambiarPeliculaFuncion(); }}>
                  <option>
                    Avengers: Endgame Encore
                  </option>
                  <option>
                    Resident Evil: Noche Cero
                  </option>
                  <option>
                    Spider-Man: Un Nuevo Día
                  </option>
                  <option>
                    Coyote vs. Acme
                  </option>
                  <option>
                    La Sombra del Exorcista
                  </option>
                  <option>
                    La Noche del Demonio
                  </option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">
                    Fecha
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="funcion-fecha" required type="date" onChange={(event) => { alCambiarDatosFuncion(); }} />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">
                    Hora
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="funcion-hora" required type="time" />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Formato
                </label>
                {" "}
                <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="funcion-formato" onChange={(event) => { alCambiarDatosFuncion(); }}>
                  <option>
                    2D
                  </option>
                  <option>
                    3D
                  </option>
                  <option>
                    4DX
                  </option>
                  <option>
                    XD
                  </option>
                  <option>
                    VIP
                  </option>
                  <option>
                    D-BOX
                  </option>
                  <option>
                    IMAX
                  </option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Idioma
                </label>
                {" "}
                <div className="flex gap-2" id="funcion-idioma-chips">
                  <button className="chip-selector chip-selector-activo" type="button">
                    Doblada
                  </button>
                  <button className="chip-selector" type="button">
                    Subtitulada
                  </button>
                  <button className="chip-selector" type="button">
                    Original
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Sala
                </label>
                {" "}
                <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="funcion-sala">
                  <option>
                    Sala 1
                  </option>
                  <option>
                    Sala 2
                  </option>
                  <option>
                    Sala 3
                  </option>
                  <option>
                    Sala 4
                  </option>
                  <option>
                    Sala 5
                  </option>
                  <option>
                    Sala 6
                  </option>
                  <option>
                    Sala 7
                  </option>
                  <option>
                    Sala 8
                  </option>
                </select>
                {" "}
                <p className="text-slate-500 text-[11px] mt-1" id="funcion-sala-ayuda"></p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="hidden bg-dark-900 hover:bg-brand-blue/20 border border-brand-blue/40 text-brand-blue px-4 rounded-xl font-bold text-sm transition-colors" id="funcion-btn-eliminar" type="button" onClick={(event) => { abrirModalCancelarFuncion(); }}>
                  Cancelar función
                </button>
                {" "}
                <button className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors" type="submit">
                  Guardar función
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-cancelar-funcion">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" type="button" onClick={(event) => { cerrarModal('modal-cancelar-funcion'); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <h3 className="text-2xl font-bold text-white mb-1">
              Cancelar o reprogramar
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Queda registrado el motivo y se avisa a quienes ya compraron entradas para esta función.
            </p>
            <form className="space-y-3" onSubmit={(event) => { confirmarCambioFuncion(event); }}>
              <div className="flex bg-dark-900 border border-white/5 rounded-xl p-1" data-seg="cambio-funcion">
                <button className="seg-btn activo flex-1 justify-center" type="button" onClick={(event) => { modoCambioFuncion(event.currentTarget,'cancelar'); }}>
                  Cancelar función
                </button>
                <button className="seg-btn flex-1 justify-center" type="button" onClick={(event) => { modoCambioFuncion(event.currentTarget,'reprogramar'); }}>
                  Reprogramar
                </button>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Motivo
                </label>
                {" "}
                <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="cambio-funcion-motivo" required>
                  <option>
                    Falla técnica
                  </option>
                  <option>
                    Mantenimiento de sala
                  </option>
                  <option>
                    Baja asistencia
                  </option>
                  <option>
                    Cambio de programación
                  </option>
                  <option>
                    Otro
                  </option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Detalle del motivo
                </label>
                {" "}
                <textarea className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-brand-yellow" id="cambio-funcion-detalle" placeholder="Explica qué ocurrió (obligatorio)" required rows={3} />
              </div>
              <div className="hidden space-y-3" id="cambio-funcion-reprogramar">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">
                      Nueva fecha
                    </label>
                    <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" type="date" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">
                      Nueva hora
                    </label>
                    <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" type="time" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">
                    Nueva sala
                  </label>
                  <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow">
                    <option>
                      Sala 1
                    </option>
                    <option>
                      Sala 2
                    </option>
                    <option>
                      Sala 3
                    </option>
                    <option>
                      Sala 4
                    </option>
                    <option>
                      Sala 5
                    </option>
                    <option>
                      Sala 6
                    </option>
                    <option>
                      Sala 7
                    </option>
                    <option>
                      Sala 8
                    </option>
                  </select>
                </div>
              </div>
              <p className="text-slate-500 text-xs">
                <i className="fa-solid fa-circle-info text-brand-blue mr-1"></i>
                Los compradores serán notificados y se les ofrecerá reubicación o reembolso.
              </p>
              <div className="flex gap-2 pt-2">
                <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white px-5 rounded-xl font-bold text-sm transition-colors" type="button" onClick={(event) => { cerrarModal('modal-cancelar-funcion'); }}>
                  Volver
                </button>
                {" "}
                <button className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors" id="cambio-funcion-confirmar" type="submit">
                  Confirmar cancelación
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-ficha-personal">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar" id="ficha-personal-contenido">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" type="button" onClick={(event) => { cerrarFichaPersonal(); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-user text-brand-yellow" id="ficha-personal-icono"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" id="ficha-personal-nombre">
                  Rosa Medina
                </h3>
                {" "}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border text-brand-yellow bg-brand-yellow/10 border-brand-yellow/30" id="ficha-personal-rol-badge">
                  Admin de sede
                </span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  Correo
                </span>
                <span className="text-white text-right" id="ficha-personal-correo">
                  rosa.medina@cinenautica.pe
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  DNI
                </span>
                <span className="text-white text-right" id="ficha-personal-dni">
                  40112233
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  Celular
                </span>
                <span className="text-white text-right" id="ficha-personal-telefono">
                  987654321
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  Contraseña
                </span>
                <button className="text-brand-blue hover:text-white text-xs font-bold" type="button" onClick={(event) => { demo(); }}>
                  <i className="fa-solid fa-key mr-1.5"></i>
                  Restablecer contraseña
                </button>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  Estado
                </span>
                <span className="text-right text-green-500 font-bold" id="ficha-personal-estado">
                  Activa
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  Fecha de ingreso
                </span>
                <span className="text-white text-right" id="ficha-personal-fecha-ingreso">
                  02/03/2026
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">
                  Cuenta creada por
                </span>
                <span className="text-white text-right" id="ficha-personal-creado-por">
                  Carlos Mendoza (Admin General)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">
                  Nota interna
                </span>
                {" "}
                <p className="text-slate-300 bg-dark-900 rounded-lg p-3 text-xs italic" id="ficha-personal-nota">
                  Turno mañana. Responsable de apertura y cierre de caja.
                </p>
              </div>
            </div>
            {" "}
            <button className="w-full mt-6 bg-brand-yellow hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-sm transition-colors" data-correo="rosa.medina@cinenautica.pe" id="ficha-personal-btn-editar" type="button" onClick={(event) => { cerrarFichaPersonal(); abrirModalPersonal(event.currentTarget.dataset.correo); }}>
              <i className="fa-solid fa-pen mr-2"></i>
              Editar cuenta
            </button>
          </div>
        </div>
        <div id="modal-precio-dulce" className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4">
          <div className="bg-dark-800 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full relative transform scale-95 transition-transform duration-200 max-h-[92vh] overflow-y-auto hide-scrollbar">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white z-10" onClick={(event) => { cerrarModal('modal-precio-dulce'); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-2 bg-dark-900 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5">
                <div className="w-28 h-28 rounded-2xl bg-dark-800 flex items-center justify-center text-brand-yellow text-5xl mb-4">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  Combo Dúo
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  1 Cancha Gigante + 2 Bebidas Grandes
                </p>
                {" "}
                <span className="mt-3 inline-block mini-formato">
                  <i className="fa-solid fa-lock text-[9px] mr-1"></i>
                  Combos Populares
                </span>
                {" "}
                <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                  <i className="fa-solid fa-circle-info text-brand-blue mr-1"></i>
                  Nombre, descripción, imagen y categoría los define la administración global.
                </p>
              </div>
              <form className="md:col-span-3 p-6 md:p-8 space-y-5" onSubmit={(event) => { guardarPrecioSede(event); }}>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Precio en esta sede
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Solo puedes ajustar el precio y la disponibilidad.
                  </p>
                </div>
                <div className="bg-dark-900 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Precio original
                    </p>
                    <p className="text-slate-300 font-bold text-xl line-through decoration-slate-600">
                      S/ 40.00
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Declarado por Admin General
                    </p>
                  </div>
                  {" "}
                  <i className="fa-solid fa-arrow-right text-slate-600"></i>
                  {" "}
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-brand-yellow font-bold">
                      Diferencia
                    </p>
                    <p className="text-green-400 font-bold text-xl">
                      + 5.0%
                    </p>
                    <p className="text-[11px] text-slate-500">
                      S/ 42.00 en esta sede
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">
                    Precio de venta (S/)
                  </label>
                  {" "}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      S/
                    </span>
                    <input type="number" step="0.10" min="0" defaultValue="42.00" className="w-full bg-dark-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-brand-yellow" />
                  </div>
                </div>
                {" "}
                <label className="flex items-center justify-between bg-dark-900 border border-white/10 rounded-xl p-4 cursor-pointer">
                  <span>
                    <span className="text-white font-semibold text-sm block">
                      Disponible en sede
                    </span>
                    <span className="text-slate-500 text-xs">
                      Si está agotado, no aparece en la dulcería del cliente.
                    </span>
                  </span>
                  <input type="checkbox" className="toggle-stock" defaultChecked />
                </label>
                {" "}
                <div className="flex gap-3 pt-1">
                  <button type="button" className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-slate-300 hover:text-white py-3 px-5 rounded-xl font-bold text-sm transition-colors" onClick={(event) => { demo(); }}>
                    <i className="fa-solid fa-rotate-left mr-2"></i>
                    Restablecer
                  </button>
                  {" "}
                  <button type="submit" className="flex-grow bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors">
                    Guardar precio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="modal-tarifa-especial" className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModal('modal-tarifa-especial'); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <h3 className="text-2xl font-bold text-white mb-1">
              Tarifa especial
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Para feriados, campañas o fechas puntuales en esta sede.
            </p>
            <form className="space-y-3" onSubmit={(event) => { guardarTarifaEspecial(event); }}>
              <input type="text" placeholder="Nombre (ej: Feriado — Santa Rosa de Lima)" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
              {" "}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">
                    Desde
                  </label>
                  <input type="date" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">
                    Hasta
                  </label>
                  <input type="date" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Tarifa base (S/)
                </label>
                <input type="number" step="0.5" placeholder="Ej: 18.00" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" />
              </div>
              {" "}
              <button type="submit" className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors mt-2">
                Agregar tarifa
              </button>
            </form>
          </div>
        </div>
        <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-personal">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar" id="personal-contenido">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" type="button" onClick={(event) => { cerrarModalPersonal(); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <h3 className="text-2xl font-bold text-white mb-6" id="personal-modal-titulo">
              Nueva cuenta
            </h3>
            <form autoComplete="off" className="space-y-3" onSubmit={(event) => { guardarPersonalAdmin(event); }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] text-slate-500 mb-1 block">
                    Nombre
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="personal-nombre" maxLength={60} placeholder="Ej: Carlos" required type="text" />
                </div>
                <div>
                  <label className="text-[14px] text-slate-500 mb-1 block">
                    Apellido
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="personal-apellido" maxLength={60} placeholder="Ej: Mendoza" required type="text" />
                </div>
              </div>
              <div>
                <label className="text-[14px] text-slate-500 mb-1 block">
                  Correo electrónico
                </label>
                {" "}
                <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="personal-correo" placeholder="ejemplo@cinenautica.pe" required type="email" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] text-slate-500 mb-1 block">
                    DNI
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="personal-dni" inputMode="numeric" maxLength={8} pattern={"[0-9]{8}"} placeholder="8 dígitos" type="text" />
                </div>
                <div>
                  <label className="text-[14px] text-slate-500 mb-1 block">
                    Celular
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow" id="personal-telefono" inputMode="numeric" maxLength={9} pattern={"9[0-9]{8}"} placeholder="9XXXXXXXX" type="text" />
                </div>
              </div>
              <div>
                <label className="text-[14px] text-slate-500 mb-1 block">
                  Nota interna
                  {" "}
                  <span className="text-slate-600">
                    (opcional)
                  </span>
                </label>
                {" "}
                <textarea className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-brand-yellow" id="personal-nota" placeholder="Turno mañana, local, supervisor a cargo..." rows={2} />
              </div>
              <div>
                <label className="text-[14px] text-slate-500 mb-1 block">
                  Sede asignada
                </label>
                {" "}
                <div className="w-full bg-dark-900/60 border border-dashed border-white/10 rounded-xl px-4 py-2.5 text-slate-300 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-lock text-slate-500 text-xs"></i>
                  <span className="js-sede-nombre">
                    Náutica Megaplaza
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[14px] text-slate-500 mb-1 block">
                  Rol
                </label>
                {" "}
                <select className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow disabled:opacity-60" id="personal-rol">
                  <option value="counter">
                    Counter (caja y ventas en sede)
                  </option>
                  <option value="admin_sede">
                    Admin de sede
                  </option>
                </select>
              </div>
              <div>
                <label className="text-[14px] text-slate-500 mb-1 block">
                  Contraseña
                </label>
                {" "}
                <div className="flex gap-2">
                  <input className="flex-1 min-w-0 bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-brand-yellow" id="personal-contrasena" minLength={6} placeholder="Mínimo 6 caracteres" type="text" />
                  {" "}
                  <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white px-4 rounded-xl transition-colors" title="Generar contraseña" type="button" onClick={(event) => { generarContrasenaPersonalAdmin(); }}>
                    <i className="fa-solid fa-dice"></i>
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-2" id="personal-ayuda-contrasena"></p>
              </div>
              <p className="text-slate-500 text-xs">
                <i className="fa-solid fa-circle-info mr-1"></i>
                Las cuentas de personal son herramientas de trabajo: no acumulan puntos ni tienen nivel o código de socio.
              </p>
              {" "}
              <button className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors mt-2" type="submit">
                Guardar
              </button>
            </form>
          </div>
        </div>
        <div id="contenedor-toasts"></div>
      </div>
    </>
  );
}
