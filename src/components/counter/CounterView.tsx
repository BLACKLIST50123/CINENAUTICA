"use client";

import { abrirModal, cambiarCantidad, cerrarModal, demo, segmento, toggleMenuUsuario } from "@/src/lib/ui/common";
import { billete, calcVuelto, cambiarComprobanteCounter, cancelarVenta, clickAsientoC, filtrarCatC, filtrarFmtC, iniciarSoloDulceria, iniciarVenta, irCounter, metodoC, nuevaVenta, siguienteCounter, vincularSocio, vistaCounter } from "@/src/lib/ui/counter";

export default function CounterView() {
  return (
    <>
      <div className="bg-dark-900 text-white min-h-screen pt-16 antialiased">
        <header className="staff-header fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/img/logo/logocinenautica.png" className="h-10" alt="Logo" />
            <span className="hidden md:block text-lg font-bold tracking-tighter">
              CINE
              <span className="text-brand-blue">
                NÁUTICA
              </span>
            </span>
            <span className="rol-badge rol-counter">
              Counter
            </span>
            {" "}
            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs">
              <i className="fa-solid fa-location-dot text-brand-yellow"></i>
              <span className="font-bold">
                Náutica Megaplaza
              </span>
              <span className="text-slate-500"></span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden md:flex items-center gap-2 text-sm text-slate-300 font-semibold mr-2">
              <i className="fa-regular fa-clock text-brand-blue"></i>
              <span id="reloj">
                17:20
              </span>
              {" "}
              <span className="text-slate-500 text-xs">
                · Sáb 10 Oct
              </span>
            </span>
            {" "}
            <button id="chip-cliente" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-2 pr-4 py-1.5 transition-colors" onClick={(event) => { abrirModal('modal-socio'); }}>
              <span className="w-7 h-7 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center">
                <i className="fa-solid fa-user text-slate-400 text-xs"></i>
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[9px] uppercase text-slate-500 font-bold tracking-wider">
                  Cliente
                </span>
                <span id="chip-cliente-txt" className="block text-xs font-bold text-white">
                  Invitado · vincular socio
                </span>
              </span>
            </button>
            {" "}
            <button className="hidden sm:flex items-center gap-2 bg-brand-yellow/10 hover:bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow rounded-xl px-3.5 py-2 text-xs font-bold transition-colors" onClick={(event) => { iniciarSoloDulceria(); }}>
              <i className="fa-solid fa-bowl-food"></i>
              {" "}
              Solo dulcería
            </button>
            {" "}
            <button className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors" onClick={(event) => { abrirModal('modal-orden'); }}>
              <i className="fa-solid fa-magnifying-glass"></i>
              {" "}
              Buscar orden
            </button>
            {" "}
            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-dark-800 border-2 border-green-500/60 flex items-center justify-center" onClick={(event) => { toggleMenuUsuario(); }}>
                <i className="fa-solid fa-user text-green-300 text-sm"></i>
              </button>
              {" "}
              <div id="menu-usuario-dd" className="hidden absolute right-0 top-12 w-60 bg-dark-800 border border-white/10 rounded-xl shadow-2xl p-2 fade-in">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-white font-bold text-sm">
                    Pedro Salazar
                  </p>
                </div>
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
        <div className="lg:grid lg:grid-cols-[1fr_380px]">
          <main className="min-w-0">
            <div id="cv-inicio" className="p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Funciones de hoy
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Sábado 10 de octubre · Náutica Megaplaza ·
                    {" "}
                    <span className="text-green-400 font-semibold">
                      Hora actual 17:20
                    </span>
                  </p>
                </div>
                <div className="flex bg-dark-800 border border-white/5 rounded-xl p-1" data-seg="vista">
                  <button className="seg-btn activo" onClick={(event) => { segmento(event.currentTarget); vistaCounter('peli'); }}>
                    <i className="fa-solid fa-film"></i>
                    {" "}
                    Por película
                  </button>
                  <button className="seg-btn" onClick={(event) => { segmento(event.currentTarget); vistaCounter('hora'); }}>
                    <i className="fa-regular fa-clock"></i>
                    {" "}
                    Por hora
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex bg-dark-800 border border-white/5 rounded-xl p-1" data-seg="dia">
                  <button className="seg-btn activo" onClick={(event) => { segmento(event.currentTarget); }}>
                    Hoy
                  </button>
                  <button className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                    Mañana
                  </button>
                </div>
                <div className="relative flex-grow max-w-xs">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                  <input type="text" placeholder="Buscar película..." className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue" />
                </div>
                <div className="flex flex-wrap gap-2" id="fmt-chips">
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-brand-blue text-white border-brand-blue" onClick={(event) => { filtrarFmtC(event.currentTarget,'Todos'); }}>
                    Todos
                  </button>
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue" onClick={(event) => { filtrarFmtC(event.currentTarget,'2D Doblada'); }}>
                    2D Doblada
                  </button>
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue" onClick={(event) => { filtrarFmtC(event.currentTarget,'2D Subtitulada'); }}>
                    2D Subtitulada
                  </button>
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue" onClick={(event) => { filtrarFmtC(event.currentTarget,'SALA XD'); }}>
                    SALA XD
                  </button>
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue" onClick={(event) => { filtrarFmtC(event.currentTarget,'D-BOX'); }}>
                    D-BOX
                  </button>
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue" onClick={(event) => { filtrarFmtC(event.currentTarget,'IMAX'); }}>
                    IMAX
                  </button>
                </div>
                <div className="ml-auto hidden xl:flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <i className="w-2.5 h-2.5 rounded-full bg-green-500"></i>
                    Libre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="w-2.5 h-2.5 rounded-full bg-brand-yellow"></i>
                    Media
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="w-2.5 h-2.5 rounded-full bg-brand-red"></i>
                    Casi llena
                  </span>
                </div>
              </div>
              <div id="cv-peli" className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                <article data-fmt="IMAX 2D Subtitulada" className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors">
                  <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-20 md:w-24 aspect-[2/3] object-cover rounded-xl flex-shrink-0 shadow-lg" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">
                          Avengers: Endgame Encore
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Acción / Ciencia Ficción · 3h 06m
                        </p>
                      </div>
                      <span className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0">
                        APT
                      </span>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        IMAX
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 2 · 58/84" onClick={(event) => { iniciarVenta('endgame-bonus','15:15','IMAX',2); }}>
                          15:15
                          <small>
                            S2 · 58/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "70%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 2 · 47/84" onClick={(event) => { iniciarVenta('endgame-bonus','19:15','IMAX',2); }}>
                          19:15
                          <small>
                            S2 · 47/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "56%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Subtitulada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 1 · 28/84" onClick={(event) => { iniciarVenta('endgame-bonus','16:15','2D Subtitulada',1); }}>
                          16:15
                          <small>
                            S1 · 28/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "34%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 1 · 16/84" onClick={(event) => { iniciarVenta('endgame-bonus','20:15','2D Subtitulada',1); }}>
                          20:15
                          <small>
                            S1 · 16/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "20%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                <article data-fmt="D-BOX 2D Doblada" className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors">
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-20 md:w-24 aspect-[2/3] object-cover rounded-xl flex-shrink-0 shadow-lg" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">
                          Resident Evil: Noche Cero
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Terror / Acción · 1h 30m
                        </p>
                      </div>
                      <span className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0">
                        +14
                      </span>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        D-BOX
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button className="pos-hora casi" title="Sala 6 · 73/84" onClick={(event) => { iniciarVenta('re-noche-cero','17:45','D-BOX',6); }}>
                          17:45
                          <small>
                            S6 · 73/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "87%", background: "var(--brand-red)" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora casi" title="Sala 6 · 77/84" onClick={(event) => { iniciarVenta('re-noche-cero','20:15','D-BOX',6); }}>
                          20:15
                          <small>
                            S6 · 77/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "92%", background: "var(--brand-red)" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora casi" title="Sala 6 · 75/84" onClick={(event) => { iniciarVenta('re-noche-cero','22:45','D-BOX',6); }}>
                          22:45
                          <small>
                            S6 · 75/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "90%", background: "var(--brand-red)" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Doblada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 3 · 24/84" onClick={(event) => { iniciarVenta('re-noche-cero','16:15','2D Doblada',3); }}>
                          16:15
                          <small>
                            S3 · 24/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "29%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 3 · 22/84" onClick={(event) => { iniciarVenta('re-noche-cero','18:45','2D Doblada',3); }}>
                          18:45
                          <small>
                            S3 · 22/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "27%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 3 · 26/84" onClick={(event) => { iniciarVenta('re-noche-cero','21:15','2D Doblada',3); }}>
                          21:15
                          <small>
                            S3 · 26/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "32%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                <article data-fmt="SALA XD 2D Subtitulada" className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors">
                  <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-20 md:w-24 aspect-[2/3] object-cover rounded-xl flex-shrink-0 shadow-lg" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">
                          Spider-Man: Un Nuevo Día
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Acción / Aventura · 2h 25m
                        </p>
                      </div>
                      <span className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0">
                        APT
                      </span>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        SALA XD
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 3 · 40/84" onClick={(event) => { iniciarVenta('spiderman','14:15','SALA XD',3); }}>
                          14:15
                          <small>
                            S3 · 40/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "48%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button disabled className="pos-hora pasada" title="Sala 3 · 14/84" onClick={(event) => { iniciarVenta('spiderman','17:15','SALA XD',3); }}>
                          17:15
                          <small>
                            S3 · 14/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "17%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora medio" title="Sala 3 · 57/84" onClick={(event) => { iniciarVenta('spiderman','20:15','SALA XD',3); }}>
                          20:15
                          <small>
                            S3 · 57/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "68%", background: "var(--brand-yellow)" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Subtitulada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 2 · 38/84" onClick={(event) => { iniciarVenta('spiderman','17:15','2D Subtitulada',2); }}>
                          17:15
                          <small>
                            S2 · 38/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "46%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 2 · 12/84" onClick={(event) => { iniciarVenta('spiderman','20:15','2D Subtitulada',2); }}>
                          20:15
                          <small>
                            S2 · 12/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "15%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                <article data-fmt="D-BOX 2D Doblada" className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors">
                  <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-20 md:w-24 aspect-[2/3] object-cover rounded-xl flex-shrink-0 shadow-lg" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">
                          Coyote vs. Acme
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Animación / Comedia · 1h 44m
                        </p>
                      </div>
                      <span className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0">
                        APT
                      </span>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        D-BOX
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 6 · 26/84" onClick={(event) => { iniciarVenta('coyote-acme','15:15','D-BOX',6); }}>
                          15:15
                          <small>
                            S6 · 26/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "31%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 6 · 24/84" onClick={(event) => { iniciarVenta('coyote-acme','17:45','D-BOX',6); }}>
                          17:45
                          <small>
                            S6 · 24/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "29%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Doblada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 4 · 30/84" onClick={(event) => { iniciarVenta('coyote-acme','14:45','2D Doblada',4); }}>
                          14:45
                          <small>
                            S4 · 30/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "36%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button disabled className="pos-hora pasada" title="Sala 4 · 34/84" onClick={(event) => { iniciarVenta('coyote-acme','17:15','2D Doblada',4); }}>
                          17:15
                          <small>
                            S4 · 34/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "41%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 4 · 32/84" onClick={(event) => { iniciarVenta('coyote-acme','19:45','2D Doblada',4); }}>
                          19:45
                          <small>
                            S4 · 32/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "39%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                <article data-fmt="2D Subtitulada 2D Doblada" className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors">
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-20 md:w-24 aspect-[2/3] object-cover rounded-xl flex-shrink-0 shadow-lg" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">
                          La Sombra del Exorcista
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Terror / Sobrenatural · 1h 27m
                        </p>
                      </div>
                      <span className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0">
                        +18
                      </span>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Subtitulada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button className="pos-hora ok" title="Sala 2 · 18/84" onClick={(event) => { iniciarVenta('sombra-exorcista','19:15','2D Subtitulada',2); }}>
                          19:15
                          <small>
                            S2 · 18/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "22%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 2 · 16/84" onClick={(event) => { iniciarVenta('sombra-exorcista','21:45','2D Subtitulada',2); }}>
                          21:45
                          <small>
                            S2 · 16/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "20%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Doblada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button className="pos-hora medio" title="Sala 5 · 68/84" onClick={(event) => { iniciarVenta('sombra-exorcista','18:15','2D Doblada',5); }}>
                          18:15
                          <small>
                            S5 · 68/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "82%", background: "var(--brand-yellow)" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora medio" title="Sala 5 · 67/84" onClick={(event) => { iniciarVenta('sombra-exorcista','20:45','2D Doblada',5); }}>
                          20:45
                          <small>
                            S5 · 67/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "80%", background: "var(--brand-yellow)" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                <article data-fmt="D-BOX 2D Doblada" className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-colors">
                  <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-20 md:w-24 aspect-[2/3] object-cover rounded-xl flex-shrink-0 shadow-lg" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">
                          La Noche del Demonio
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Terror / Suspenso · 1h 46m
                        </p>
                      </div>
                      <span className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0">
                        +14
                      </span>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        D-BOX
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button className="pos-hora medio" title="Sala 5 · 58/84" onClick={(event) => { iniciarVenta('demonio','19:15','D-BOX',5); }}>
                          19:15
                          <small>
                            S5 · 58/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "70%", background: "var(--brand-yellow)" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora medio" title="Sala 5 · 57/84" onClick={(event) => { iniciarVenta('demonio','21:45','D-BOX',5); }}>
                          21:45
                          <small>
                            S5 · 57/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "68%", background: "var(--brand-yellow)" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 last:mb-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        2D Doblada
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button disabled className="pos-hora pasada" title="Sala 4 · 40/84" onClick={(event) => { iniciarVenta('demonio','16:15','2D Doblada',4); }}>
                          16:15
                          <small>
                            S4 · 40/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "48%", background: "#475569" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 4 · 38/84" onClick={(event) => { iniciarVenta('demonio','18:45','2D Doblada',4); }}>
                          18:45
                          <small>
                            S4 · 38/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "46%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                        <button className="pos-hora ok" title="Sala 4 · 42/84" onClick={(event) => { iniciarVenta('demonio','21:15','2D Doblada',4); }}>
                          21:15
                          <small>
                            S4 · 42/84
                          </small>
                          <span className="ocup-bar">
                            <i style={{ width: "51%", background: "#22c55e" }}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <div id="cv-hora" className="hidden space-y-2">
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    14:15
                  </span>
                  <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Spider-Man: Un Nuevo Día
                    </p>
                    <p className="text-slate-500 text-xs">
                      SALA XD · Sala 3
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        40/84
                      </span>
                      <span>
                        48%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "48%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    14:45
                  </span>
                  <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Coyote vs. Acme
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 4
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        30/84
                      </span>
                      <span>
                        36%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "36%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    15:15
                  </span>
                  <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Coyote vs. Acme
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 6
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        26/84
                      </span>
                      <span>
                        31%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "31%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    15:15
                  </span>
                  <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Avengers: Endgame Encore
                    </p>
                    <p className="text-slate-500 text-xs">
                      IMAX · Sala 2
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        58/84
                      </span>
                      <span>
                        70%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "70%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    16:15
                  </span>
                  <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Noche del Demonio
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 4
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        40/84
                      </span>
                      <span>
                        48%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "48%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    16:15
                  </span>
                  <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Avengers: Endgame Encore
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Subtitulada · Sala 1
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        28/84
                      </span>
                      <span>
                        34%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "34%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    16:15
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Resident Evil: Noche Cero
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 3
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        24/84
                      </span>
                      <span>
                        29%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "29%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    17:15
                  </span>
                  <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Coyote vs. Acme
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 4
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        34/84
                      </span>
                      <span>
                        41%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "41%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    17:15
                  </span>
                  <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Spider-Man: Un Nuevo Día
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Subtitulada · Sala 2
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        38/84
                      </span>
                      <span>
                        46%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "46%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 opacity-50 transition-colors">
                  <span className="text-2xl font-bold text-white w-16 line-through decoration-slate-600">
                    17:15
                  </span>
                  <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Spider-Man: Un Nuevo Día
                    </p>
                    <p className="text-slate-500 text-xs">
                      SALA XD · Sala 3
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        14/84
                      </span>
                      <span>
                        17%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "17%", background: "#475569" }}></i>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-slate-600 border border-white/5">
                    Ya inició
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    17:45
                  </span>
                  <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Coyote vs. Acme
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 6
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        24/84
                      </span>
                      <span>
                        29%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "29%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('coyote-acme','17:45','D-BOX',6); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    17:45
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Resident Evil: Noche Cero
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 6
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        73/84
                      </span>
                      <span>
                        87%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "87%", background: "var(--brand-red)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('re-noche-cero','17:45','D-BOX',6); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    18:15
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Sombra del Exorcista
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 5
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        68/84
                      </span>
                      <span>
                        82%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "82%", background: "var(--brand-yellow)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('sombra-exorcista','18:15','2D Doblada',5); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    18:45
                  </span>
                  <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Noche del Demonio
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 4
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        38/84
                      </span>
                      <span>
                        46%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "46%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('demonio','18:45','2D Doblada',4); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    18:45
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Resident Evil: Noche Cero
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 3
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        22/84
                      </span>
                      <span>
                        27%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "27%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('re-noche-cero','18:45','2D Doblada',3); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    19:15
                  </span>
                  <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Noche del Demonio
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 5
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        58/84
                      </span>
                      <span>
                        70%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "70%", background: "var(--brand-yellow)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('demonio','19:15','D-BOX',5); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    19:15
                  </span>
                  <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Avengers: Endgame Encore
                    </p>
                    <p className="text-slate-500 text-xs">
                      IMAX · Sala 2
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        47/84
                      </span>
                      <span>
                        56%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "56%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('endgame-bonus','19:15','IMAX',2); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    19:15
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Sombra del Exorcista
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Subtitulada · Sala 2
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        18/84
                      </span>
                      <span>
                        22%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "22%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('sombra-exorcista','19:15','2D Subtitulada',2); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    19:45
                  </span>
                  <img src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Coyote vs. Acme
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 4
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        32/84
                      </span>
                      <span>
                        39%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "39%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('coyote-acme','19:45','2D Doblada',4); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    20:15
                  </span>
                  <img src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Avengers: Endgame Encore
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Subtitulada · Sala 1
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        16/84
                      </span>
                      <span>
                        20%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "20%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('endgame-bonus','20:15','2D Subtitulada',1); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    20:15
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Resident Evil: Noche Cero
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 6
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        77/84
                      </span>
                      <span>
                        92%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "92%", background: "var(--brand-red)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('re-noche-cero','20:15','D-BOX',6); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    20:15
                  </span>
                  <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Spider-Man: Un Nuevo Día
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Subtitulada · Sala 2
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        12/84
                      </span>
                      <span>
                        15%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "15%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('spiderman','20:15','2D Subtitulada',2); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    20:15
                  </span>
                  <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Spider-Man: Un Nuevo Día
                    </p>
                    <p className="text-slate-500 text-xs">
                      SALA XD · Sala 3
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        57/84
                      </span>
                      <span>
                        68%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "68%", background: "var(--brand-yellow)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('spiderman','20:15','SALA XD',3); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    20:45
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Sombra del Exorcista
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 5
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        67/84
                      </span>
                      <span>
                        80%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "80%", background: "var(--brand-yellow)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('sombra-exorcista','20:45','2D Doblada',5); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    21:15
                  </span>
                  <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Noche del Demonio
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 4
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        42/84
                      </span>
                      <span>
                        51%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "51%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('demonio','21:15','2D Doblada',4); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    21:15
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Resident Evil: Noche Cero
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Doblada · Sala 3
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        26/84
                      </span>
                      <span>
                        32%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "32%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('re-noche-cero','21:15','2D Doblada',3); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    21:45
                  </span>
                  <img src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Noche del Demonio
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 5
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        57/84
                      </span>
                      <span>
                        68%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "68%", background: "var(--brand-yellow)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('demonio','21:45','D-BOX',5); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    21:45
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      La Sombra del Exorcista
                    </p>
                    <p className="text-slate-500 text-xs">
                      2D Subtitulada · Sala 2
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        16/84
                      </span>
                      <span>
                        20%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "20%", background: "#22c55e" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('sombra-exorcista','21:45','2D Subtitulada',2); }}>
                    Vender
                  </button>
                </div>
                <div className="flex items-center gap-4 bg-dark-800 border border-white/5 rounded-xl px-4 py-3 hover:border-white/15 transition-colors">
                  <span className="text-2xl font-bold text-white w-16">
                    22:45
                  </span>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} className="w-9 h-12 object-cover rounded" alt="" />
                  {" "}
                  <div className="min-w-0 flex-grow">
                    <p className="text-white font-bold text-sm truncate">
                      Resident Evil: Noche Cero
                    </p>
                    <p className="text-slate-500 text-xs">
                      D-BOX · Sala 6
                    </p>
                  </div>
                  <div className="w-40 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>
                        75/84
                      </span>
                      <span>
                        90%
                      </span>
                    </div>
                    <div className="ocup-bar !mt-0">
                      <i style={{ width: "90%", background: "var(--brand-red)" }}></i>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-blue hover:bg-brand-dark-blue text-white transition-colors" onClick={(event) => { iniciarVenta('re-noche-cero','22:45','D-BOX',6); }}>
                    Vender
                  </button>
                </div>
              </div>
            </div>
            <div id="cv-asientos" className="hidden p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <button className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2" onClick={(event) => { cancelarVenta(); }}>
                  <i className="fa-solid fa-arrow-left"></i>
                  {" "}
                  Funciones
                </button>
                {" "}
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold truncate" data-c="titulo">
                    Spider-Man: Un Nuevo Día
                  </h2>
                  <p className="text-slate-400 text-sm">
                    <span data-c="hora">
                      19:00
                    </span>
                    {" "}
                    ·
                    {" "}
                    <span data-c="formato">
                      2D Doblada
                    </span>
                    {" "}
                    · Sala
                    {" "}
                    <span data-c="sala">
                      1
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 mb-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                  Tipo de entrada para los próximos asientos
                </p>
                <div className="flex flex-wrap gap-2" data-seg="tipo">
                  <button type="button" className="seg-btn activo" onClick={(event) => { segmento(event.currentTarget); }}>
                    General
                    <span className="text-[11px] opacity-70 font-semibold">
                      S/ 18.00
                    </span>
                  </button>
                  <button type="button" className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                    Niño
                    <span className="text-[11px] opacity-70 font-semibold">
                      S/ 12.60
                    </span>
                  </button>
                  <button type="button" className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                    Adulto mayor
                    <span className="text-[11px] opacity-70 font-semibold">
                      S/ 14.40
                    </span>
                  </button>
                  <button type="button" className="seg-btn" onClick={(event) => { segmento(event.currentTarget); }}>
                    CONADIS
                    <span className="text-[11px] opacity-70 font-semibold">
                      S/ 14.40
                    </span>
                  </button>
                </div>
              </div>
              <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 md:p-8 overflow-x-auto">
                <div className="min-w-[560px]">
                  <div className="w-full max-w-[500px] mx-auto mb-10 text-center">
                    <div className="w-full h-12 screen-curve"></div>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 block">
                      Pantalla
                    </span>
                  </div>
                  <div id="c-grid-asientos" className="matriz-sala-cliente" style={({ "--columnas-sala": "14" } as React.CSSProperties)}>
                    <button data-id="A1" title="A1" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A1
                    </button>
                    <button data-id="A2" title="A2" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A2
                    </button>
                    <button disabled title="A3 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      A3
                    </button>
                    <button disabled title="A4 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      A4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="A5" title="A5" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A5
                    </button>
                    <button data-id="A6" title="A6" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A6
                    </button>
                    <button data-id="A7" title="A7" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A7
                    </button>
                    <button data-id="A8" title="A8" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A8
                    </button>
                    <button data-id="A9" title="A9" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A9
                    </button>
                    <button data-id="A10" title="A10" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="A11" title="A11" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A11
                    </button>
                    <button data-id="A12" title="A12" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      A12
                    </button>
                    <button data-id="B1" title="B1" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B1
                    </button>
                    <button data-id="B2" title="B2" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B2
                    </button>
                    <button data-id="B3" title="B3" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B3
                    </button>
                    <button data-id="B4" title="B4" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="B5" title="B5" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B5
                    </button>
                    <button data-id="B6" title="B6" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B6
                    </button>
                    <button disabled title="B7 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      B7
                    </button>
                    <button disabled title="B8 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      B8
                    </button>
                    <button data-id="B9" title="B9" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B9
                    </button>
                    <button data-id="B10" title="B10" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="B11" title="B11" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B11
                    </button>
                    <button data-id="B12" title="B12" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      B12
                    </button>
                    <button data-id="C1" title="C1" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C1
                    </button>
                    <button data-id="C2" title="C2" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C2
                    </button>
                    <button data-id="C3" title="C3" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C3
                    </button>
                    <button data-id="C4" title="C4" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button disabled title="C5 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      C5
                    </button>
                    <button data-id="C6" title="C6" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C6
                    </button>
                    <button data-id="C7" title="C7" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C7
                    </button>
                    <button data-id="C8" title="C8" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C8
                    </button>
                    <button data-id="C9" title="C9" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C9
                    </button>
                    <button data-id="C10" title="C10" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="C11" title="C11" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C11
                    </button>
                    <button data-id="C12" title="C12" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      C12
                    </button>
                    <button data-id="D1" title="D1" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D1
                    </button>
                    <button data-id="D2" title="D2" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D2
                    </button>
                    <button data-id="D3" title="D3" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D3
                    </button>
                    <button data-id="D4" title="D4" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="D5" title="D5" className="seat w-8 h-8 md:w-10 md:h-10 selected rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D5
                    </button>
                    <button data-id="D6" title="D6" className="seat w-8 h-8 md:w-10 md:h-10 selected rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D6
                    </button>
                    <button data-id="D7" title="D7" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D7
                    </button>
                    <button data-id="D8" title="D8" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D8
                    </button>
                    <button disabled title="D9 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      D9
                    </button>
                    <button data-id="D10" title="D10" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="D11" title="D11" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D11
                    </button>
                    <button data-id="D12" title="D12" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      D12
                    </button>
                    <button data-id="E1" title="E1" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E1
                    </button>
                    <button data-id="E2" title="E2" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E2
                    </button>
                    <button data-id="E3" title="E3" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E3
                    </button>
                    <button data-id="E4" title="E4" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="E5" title="E5" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E5
                    </button>
                    <button data-id="E6" title="E6" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E6
                    </button>
                    <button data-id="E7" title="E7" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E7
                    </button>
                    <button data-id="E8" title="E8" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E8
                    </button>
                    <button data-id="E9" title="E9" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E9
                    </button>
                    <button disabled title="E10 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      E10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button disabled title="E11 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      E11
                    </button>
                    <button data-id="E12" title="E12" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      E12
                    </button>
                    <button data-id="F1" title="F1" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F1
                    </button>
                    <button disabled title="F2 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      F2
                    </button>
                    <button data-id="F3" title="F3" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F3
                    </button>
                    <button data-id="F4" title="F4" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="F5" title="F5" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F5
                    </button>
                    <button data-id="F6" title="F6" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F6
                    </button>
                    <button data-id="F7" title="F7" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F7
                    </button>
                    <button data-id="F8" title="F8" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F8
                    </button>
                    <button data-id="F9" title="F9" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F9
                    </button>
                    <button data-id="F10" title="F10" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="F11" title="F11" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F11
                    </button>
                    <button data-id="F12" title="F12" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      F12
                    </button>
                    <button data-id="G1" title="G1" className="seat w-8 h-8 md:w-10 md:h-10 asiento-cliente-accesible rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      <i className="fa-solid fa-wheelchair text-xs m-auto"></i>
                    </button>
                    <button data-id="G2" title="G2" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G2
                    </button>
                    <button data-id="G3" title="G3" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G3
                    </button>
                    <button data-id="G4" title="G4" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G4
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="G5" title="G5" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G5
                    </button>
                    <button disabled title="G6 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      G6
                    </button>
                    <button disabled title="G7 — Ocupado" className="seat asiento-cliente-no-disponible w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-not-allowed flex justify-center items-end pb-1 text-[9px] font-bold text-white/70">
                      G7
                    </button>
                    <button data-id="G8" title="G8" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G8
                    </button>
                    <button data-id="G9" title="G9" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G9
                    </button>
                    <button data-id="G10" title="G10" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G10
                    </button>
                    <span className="asiento-pasadizo" aria-hidden="true"></span>
                    <button data-id="G11" title="G11" className="seat w-8 h-8 md:w-10 md:h-10 bg-green-600 hover:bg-green-500 rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      G11
                    </button>
                    <button data-id="G12" title="G12" className="seat w-8 h-8 md:w-10 md:h-10 asiento-cliente-accesible rounded-t-lg rounded-b-sm border-b-4 border-black/50 cursor-pointer flex justify-center items-end pb-1 text-[9px] font-bold text-white/80" onClick={(event) => { clickAsientoC(event.currentTarget); }}>
                      <i className="fa-solid fa-wheelchair text-xs m-auto"></i>
                    </button>
                  </div>
                  <div className="flex justify-center gap-6 mt-8 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <i className="w-4 h-4 rounded bg-green-600"></i>
                      Libre
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="w-4 h-4 rounded bg-brand-red"></i>
                      Seleccionado
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="w-4 h-4 rounded bg-dark-700"></i>
                      Ocupado
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="w-4 h-4 rounded bg-blue-500"></i>
                      Accesible
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div id="cv-dulceria" className="hidden p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <button id="btn-volver-asientos-c" className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2" onClick={(event) => { irCounter('cv-asientos'); }}>
                  <i className="fa-solid fa-arrow-left"></i>
                  {" "}
                  Asientos
                </button>
                {" "}
                <h2 className="text-2xl font-bold">
                  Dulcería
                </h2>
                <div className="relative ml-auto w-full sm:w-64">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                  <input type="text" placeholder="Buscar producto..." className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5" id="cats-c">
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-brand-yellow text-black border-brand-yellow" onClick={(event) => { filtrarCatC(event.currentTarget,'all'); }}>
                  Todo
                </button>
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" onClick={(event) => { filtrarCatC(event.currentTarget,'combo'); }}>
                  Combos Populares
                </button>
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" onClick={(event) => { filtrarCatC(event.currentTarget,'cancha'); }}>
                  Cancha (Popcorn)
                </button>
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" onClick={(event) => { filtrarCatC(event.currentTarget,'bebida'); }}>
                  Bebidas
                </button>
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow" onClick={(event) => { filtrarCatC(event.currentTarget,'snack'); }}>
                  Snacks &amp; Dulces
                </button>
              </div>
              <div id="grid-prod-c" className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                <div data-cat="combo" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-box-open"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Combo Mega Familiar
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 65.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="combo" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-heart"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Combo Dúo
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 40.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      1
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="combo" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Combo Personal
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 25.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="cancha" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-bowl-food"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Cancha Gigante
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 22.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="cancha" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-bowl-food"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Cancha Mediana
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 16.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="bebida" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-glass-water"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Gaseosa Grande
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 12.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="bebida" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-glass-water"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Gaseosa Mediana
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 9.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="bebida" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-bottle-water"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Agua Mineral
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 6.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-cheese"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Nachos con Queso
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 15.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-hotdog"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Hot Dog Jumbo
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 12.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-candy-cane"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        M&amp;M's
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 8.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div data-cat="snack" className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-yellow text-xl flex-shrink-0">
                      <i className="fa-solid fa-cookie"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        Snickers
                      </p>
                      <p className="text-brand-yellow font-bold text-sm">
                        S/ 6.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-blue" onClick={(event) => { cambiarCantidad(event.currentTarget,-1); }}>
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-white font-bold">
                      0
                    </span>
                    <button className="w-8 h-8 rounded-full bg-dark-700 text-white hover:bg-brand-yellow hover:text-black" onClick={(event) => { cambiarCantidad(event.currentTarget,1); }}>
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="cv-pago" className="hidden p-4 md:p-6 fade-in max-w-3xl">
              <div className="flex items-center gap-4 mb-5">
                <button className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2" onClick={(event) => { irCounter('cv-dulceria'); }}>
                  <i className="fa-solid fa-arrow-left"></i>
                  {" "}
                  Dulcería
                </button>
                {" "}
                <h2 className="text-2xl font-bold">
                  Cobro
                </h2>
              </div>
              <div className="space-y-5">
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                    1 · Comprobante
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4" data-seg="comp">
                    <button className="seg-btn activo" type="button" onClick={(event) => { segmento(event.currentTarget); cambiarComprobanteCounter('boleta'); }}>
                      Boleta
                    </button>
                    <button className="seg-btn" type="button" onClick={(event) => { segmento(event.currentTarget); cambiarComprobanteCounter('factura'); }}>
                      Factura
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" id="counter-boleta-dni" placeholder="DNI (opcional)" type="text" />
                    <input className="hidden w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" id="counter-factura-ruc" placeholder="RUC" type="text" />
                    <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" id="counter-boleta-nombre" placeholder="Nombre del cliente (opcional)" type="text" />
                    <input className="hidden w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" id="counter-factura-razon" placeholder="Razón social" type="text" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    <i className="fa-solid fa-circle-info text-brand-blue mr-1"></i>
                    En boleta menor a S/ 700 el documento es opcional.
                  </p>
                </div>
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                    2 · Descuentos
                  </p>
                  <div className="flex gap-3 mb-3">
                    <input type="text" placeholder="Código de cupón" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow uppercase" />
                    <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white px-5 rounded-xl font-bold text-sm" onClick={(event) => { demo(); }}>
                      Aplicar
                    </button>
                  </div>
                  <div id="bloque-puntos" className="hidden items-center justify-between bg-dark-900 border border-brand-yellow/30 rounded-xl p-3">
                    <div>
                      <p className="text-white text-sm font-bold">
                        <i className="fa-solid fa-star text-brand-yellow mr-2"></i>
                        Canjear puntos
                      </p>
                      <p className="text-xs text-slate-500">
                        Juan Pérez tiene 540 pts disponibles
                      </p>
                    </div>
                    <button className="bg-brand-yellow text-black px-4 py-2 rounded-lg text-xs font-bold" onClick={(event) => { demo(); }}>
                      Canjear 200 pts
                    </button>
                  </div>
                  <p id="msg-sin-socio" className="text-xs text-slate-500">
                    Vincula un socio para canjear puntos o cumpleaños.
                  </p>
                </div>
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                    3 · Método de pago
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5" data-seg="metodo">
                    <button className="seg-btn activo justify-center" onClick={(event) => { segmento(event.currentTarget); metodoC('efectivo'); }}>
                      <i className="fa-solid fa-money-bill-wave"></i>
                      {" "}
                      Efectivo
                    </button>
                    <button className="seg-btn justify-center" onClick={(event) => { segmento(event.currentTarget); metodoC('tarjeta'); }}>
                      <i className="fa-solid fa-credit-card"></i>
                      {" "}
                      Tarjeta
                    </button>
                    {" "}
                    <button className="seg-btn justify-center" onClick={(event) => { segmento(event.currentTarget); metodoC('yape'); }}>
                      <i className="fa-solid fa-mobile-screen"></i>
                      {" "}
                      Yape / Plin
                    </button>
                    <button className="seg-btn justify-center" onClick={(event) => { segmento(event.currentTarget); metodoC('mixto'); }}>
                      <i className="fa-solid fa-shuffle"></i>
                      {" "}
                      Mixto
                    </button>
                  </div>
                  <div id="m-efectivo">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-500 mb-1 block">
                          Monto recibido
                        </label>
                        {" "}
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                            S/
                          </span>
                          <input id="monto-recibido" type="number" defaultValue="100" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11 text-2xl font-bold" onInput={(event) => { calcVuelto(); }} />
                        </div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 flex flex-col justify-center">
                        <p className="text-[10px] uppercase tracking-wider text-green-300 font-bold">
                          Vuelto
                        </p>
                        <p id="vuelto" className="text-3xl font-bold text-green-400">
                          S/ 24.00
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                      <button type="button" className="pos-key" onClick={(event) => { billete(10); }}>
                        S/ 10
                      </button>
                      <button type="button" className="pos-key" onClick={(event) => { billete(20); }}>
                        S/ 20
                      </button>
                      <button type="button" className="pos-key" onClick={(event) => { billete(50); }}>
                        S/ 50
                      </button>
                      <button type="button" className="pos-key" onClick={(event) => { billete(100); }}>
                        S/ 100
                      </button>
                      <button type="button" className="pos-key" onClick={(event) => { billete(200); }}>
                        S/ 200
                      </button>
                      <button type="button" className="pos-key !border-brand-yellow/50 text-brand-yellow" onClick={(event) => { billete(76); }}>
                        Exacto
                      </button>
                    </div>
                  </div>
                  <div id="m-tarjeta" className="hidden text-center py-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-3">
                      <i className="fa-solid fa-credit-card text-3xl text-brand-blue"></i>
                    </div>
                    <p className="text-white font-bold">
                      Pase o inserte la tarjeta en el POS
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      Monto a cobrar:
                      {" "}
                      <b id="counter-monto-cobro" className="text-brand-yellow">
                        S/ 76.00
                      </b>
                    </p>
                    <input type="text" placeholder="N° de referencia / operación" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow max-w-xs mx-auto" />
                  </div>
                  <div id="m-yape" className="hidden text-center py-4">
                    <div className="w-36 h-36 mx-auto bg-white rounded-2xl flex items-center justify-center mb-3">
                      <i className="fa-solid fa-qrcode text-7xl text-slate-800"></i>
                    </div>
                    <p className="text-white font-bold">
                      Escanear QR de la sede
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      Monto:
                      {" "}
                      <b id="counter-monto-yape" className="text-brand-yellow">
                        S/ 76.00
                      </b>
                    </p>
                    <input type="text" placeholder="Código de aprobación" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow max-w-xs mx-auto" />
                  </div>
                  <div id="m-mixto" className="hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-500 mb-1 block">
                          Efectivo
                        </label>
                        <input type="number" defaultValue="40" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 mb-1 block">
                          Tarjeta / Yape
                        </label>
                        <input type="number" defaultValue="36" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Pendiente por cobrar:
                      {" "}
                      <b className="text-green-400">
                        S/ 0.00
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div id="cv-ok" className="hidden p-4 md:p-8 fade-in">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500 flex items-center justify-center mb-5">
                    <i className="fa-solid fa-check text-4xl text-green-400"></i>
                  </div>
                  <h2 className="text-4xl font-bold mb-2">
                    ¡Venta registrada!
                  </h2>
                  <p className="text-slate-400 mb-8">
                    Comprobante B001-00481 · Efectivo · Vuelto S/ 24.00
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3" onClick={(event) => { demo(); }}>
                      <i className="fa-solid fa-print"></i>
                      {" "}
                      Imprimir tickets y comprobante
                    </button>
                    {" "}
                    <button className="w-full bg-dark-800 hover:bg-dark-700 border border-white/10 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3" onClick={(event) => { demo(); }}>
                      <i className="fa-solid fa-rotate-right"></i>
                      {" "}
                      Reimprimir
                    </button>
                    {" "}
                    <button className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3" onClick={(event) => { nuevaVenta(); }}>
                      <i className="fa-solid fa-plus"></i>
                      {" "}
                      Nueva venta
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="ticket-termico text-[11px] leading-relaxed">
                    <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
                      <p className="font-bold text-sm">
                        CINE NÁUTICA
                      </p>
                      <p>
                        Náutica Megaplaza
                      </p>
                      <p>
                        Av. Principal 123, Chimbote
                      </p>
                    </div>
                    <p className="font-bold text-sm text-center" data-c="titulo">
                      Spider-Man: Un Nuevo Día
                    </p>
                    <p className="text-center">
                      Sáb 10 Oct ·
                      {" "}
                      <span data-c="hora">
                        19:00
                      </span>
                      {" "}
                      · Sala
                      {" "}
                      <span data-c="sala">
                        1
                      </span>
                    </p>
                    <p className="text-center mb-2" data-c="formato">
                      2D Doblada
                    </p>
                    <div className="border-y border-dashed border-slate-400 py-2 my-2">
                      <p>
                        2x Entrada General ....... 36.00
                      </p>
                      <p>
                        1x Combo Dúo ............. 40.00
                      </p>
                    </div>
                    <p className="font-bold flex justify-between">
                      <span>
                        TOTAL
                      </span>
                      <span>
                        S/ 76.00
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>
                        Efectivo
                      </span>
                      <span>
                        100.00
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>
                        Vuelto
                      </span>
                      <span>
                        24.00
                      </span>
                    </p>
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-400 text-center">
                      <p className="font-bold">
                        Asientos: D5, D6
                      </p>
                      <p>
                        Cód. 482913
                      </p>
                      <div className="barcode mx-auto mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <aside id="panel-venta" className="bg-dark-800 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">
            <div id="panel-vacio" className="flex-grow flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-4">
                <i className="fa-solid fa-cash-register text-3xl text-brand-blue"></i>
              </div>
              <h3 className="text-xl font-bold mb-1">
                Nueva venta
              </h3>
              <p className="text-slate-500 text-sm max-w-[16rem]">
                Elige una hora a la izquierda para empezar, o usa “Solo dulcería”.
              </p>
            </div>
            <div id="panel-detalle" className="hidden flex-grow flex flex-col min-h-0">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 id="titulo-panel-venta" className="font-bold text-lg">
                    Venta en curso
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Orden CR-000482
                  </p>
                </div>
                <button className="text-xs text-slate-400 hover:text-brand-red border border-white/10 hover:border-brand-red/50 rounded-lg px-3 py-1.5 transition-colors" onClick={(event) => { cancelarVenta(); }}>
                  <i className="fa-solid fa-xmark mr-1"></i>
                  Cancelar
                </button>
              </div>
              <div className="flex-grow overflow-y-auto hide-scrollbar p-5 space-y-5">
                <div id="c-resumen-funcion">
                  <div className="flex gap-3 bg-dark-900 border border-white/5 rounded-xl p-3">
                    <img src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" className="w-12 h-16 object-cover rounded" alt="" />
                    {" "}
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight" data-c="titulo">
                        Spider-Man: Un Nuevo Día
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        <span data-c="hora">
                          19:00
                        </span>
                        {" "}
                        · Sala
                        {" "}
                        <span data-c="sala">
                          1
                        </span>
                      </p>
                      <p className="text-slate-500 text-xs" data-c="formato">
                        2D Doblada
                      </p>
                    </div>
                  </div>
                </div>
                <div id="c-resumen-entradas">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                    Entradas
                  </p>
                  <div id="c-lista-entradas">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>
                        <i className="fa-solid fa-chair text-brand-yellow mr-2"></i>
                        D5
                        {" "}
                        <span className="text-slate-500">
                          · General
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
                          · General
                        </span>
                      </span>
                      <span className="text-white font-semibold">
                        S/ 18.00
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                    Dulcería
                  </p>
                  <div id="c-lista-dulceria" className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>
                        1x Combo Dúo
                      </span>
                      <span className="text-white font-semibold">
                        S/ 40.00
                      </span>
                    </div>
                  </div>
                </div>
                <div id="panel-socio-linea" className="hidden bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-3 text-xs text-brand-yellow">
                  <i className="fa-solid fa-star mr-1"></i>
                  {" "}
                  Socio Plata: acumula
                  {" "}
                  <b>
                    76 pts
                  </b>
                  {" "}
                  con esta compra
                </div>
              </div>
              <div className="p-5 border-t border-white/5 bg-dark-900/60">
                <div id="c-subtotal-entradas" className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>
                    Entradas
                  </span>
                  <span id="c-total-entradas">
                    S/ 36.00
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-400 mb-3">
                  <span>
                    Dulcería
                  </span>
                  <span id="c-total-dulceria">
                    S/ 40.00
                  </span>
                </div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-300 font-semibold">
                    TOTAL
                  </span>
                  <span id="c-total-general" className="text-4xl font-bold text-brand-yellow">
                    S/ 76.00
                  </span>
                </div>
                {" "}
                <button id="cta" className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2" onClick={(event) => { siguienteCounter(); }}>
                  Continuar
                  {" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </aside>
        </div>
        <div id="modal-socio" className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModal('modal-socio'); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <h3 className="text-2xl font-bold mb-1">
              Vincular socio
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Busca por DNI, código o nombre.
            </p>
            <div className="flex gap-2 mb-4">
              <input type="text" defaultValue="CIN-482913" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow font-mono" />
              <button className="bg-brand-blue text-white px-5 rounded-xl font-bold" onClick={(event) => { demo(); }}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            <div className="bg-dark-900 border border-white/10 rounded-xl p-4 flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-dark-800 border-2 flex items-center justify-center" style={{ borderColor: "#C0C0C0" }}>
                <i className="fa-solid fa-user" style={{ color: "#C0C0C0" }}></i>
              </div>
              <div className="flex-grow">
                <p className="text-white font-bold">
                  Juan Pérez
                </p>
                <p className="text-slate-500 text-xs">
                  DNI 12345678 · CIN-482913
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "#C0C0C022", color: "#C0C0C0", border: "1px solid #C0C0C055" }}>
                  Plata
                </span>
                {" "}
                <p className="text-brand-yellow font-bold text-sm mt-1">
                  540 pts
                </p>
              </div>
            </div>
            {" "}
            <button className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold mb-5" onClick={(event) => { vincularSocio(); }}>
              Vincular a la venta
            </button>
            {" "}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                ¿No es socio? Registro rápido
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Nombre" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow !py-2.5 text-sm" />
                <input type="text" placeholder="Apellido" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow !py-2.5 text-sm" />
                <input type="text" inputMode="numeric" maxLength={8} pattern={"[0-9]{8}"} placeholder="DNI" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow !py-2.5 text-sm" />
                <input type="date" title="Fecha de nacimiento" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow !py-2.5 text-sm" />
                <input type="email" placeholder="Correo" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow !py-2.5 text-sm col-span-2" />
              </div>
              <button className="w-full mt-3 bg-dark-900 hover:bg-dark-700 border border-white/10 text-white py-2.5 rounded-xl font-bold text-sm" onClick={(event) => { demo(); }}>
                Registrar y vincular
              </button>
            </div>
          </div>
        </div>
        <div id="modal-orden" className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModal('modal-orden'); }}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            {" "}
            <h3 className="text-2xl font-bold mb-1">
              Buscar orden
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Reimprime, reubica asientos o gestiona un reembolso.
            </p>
            <div className="flex gap-2 mb-5">
              <input type="text" defaultValue="CR-482913" className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow font-mono" />
              <button className="bg-brand-blue text-white px-5 rounded-xl font-bold" onClick={(event) => { demo(); }}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            <div className="bg-dark-900 border border-white/10 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2 py-1 rounded border border-brand-blue/30">
                  CR-482913
                </span>
                <span className="text-green-400 text-xs font-bold">
                  <i className="fa-solid fa-circle-check mr-1"></i>
                  Pagada
                </span>
              </div>
              <p className="text-white font-bold">
                Spider-Man: Un Nuevo Día
              </p>
              <p className="text-slate-400 text-sm">
                Sáb 10 Oct · 19:00 · Sala 1 · 2D Doblada
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Asientos D5, D6 · 1x Combo Dúo ·
                {" "}
                <b className="text-brand-yellow">
                  S/ 76.00
                </b>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white py-3 rounded-xl font-bold text-xs" onClick={(event) => { demo(); }}>
                <i className="fa-solid fa-print block text-lg mb-1 text-brand-blue"></i>
                Reimprimir
              </button>
              <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white py-3 rounded-xl font-bold text-xs" onClick={(event) => { demo(); }}>
                <i className="fa-solid fa-arrows-up-down-left-right block text-lg mb-1 text-brand-yellow"></i>
                Reubicar
              </button>
              <button className="bg-dark-900 hover:bg-dark-700 border border-white/10 text-white py-3 rounded-xl font-bold text-xs" onClick={(event) => { demo(); }}>
                <i className="fa-solid fa-rotate-left block text-lg mb-1 text-brand-red"></i>
                Reembolsar
              </button>
            </div>
          </div>
        </div>
        <div id="contenedor-toasts"></div>
      </div>
    </>
  );
}
