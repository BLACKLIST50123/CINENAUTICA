"use client";

// Modales Globales del cliente.
// Los modales de auth (login, registro, perfil, carnet) ahora son componentes
// React reales importados desde ModalesAuth.tsx, que usan useSesion() con Supabase.
// El resto de modales (trailer, legal, sede, promo, dulcería) permanece igual por ahora.

import { useEffect, useState } from "react";
import { abrirModalLegal, alCambiarCiudadDulceria, cerrarModalTrailer, validarSedeDulceria } from "@/src/lib/ui/cliente";
import { cerrarModal, cerrarModalLegal, cerrarModalPromoBanner } from "@/src/lib/ui/common";
import { abrirDetallePelicula, confirmarSedeDulceria, elegirSedeNav } from "@/src/lib/ui/nav";
import { ModalLogin, ModalRegistro, ModalPerfil, ModalCarnetSocio } from "./ModalesAuth";
import { SedeDao } from "@/src/daos/SedeDao";
import type { SedeDTO } from "@/src/dtos/cartelera";

export default function ModalesGlobales() {
  const [sedes, setSedes] = useState<SedeDTO[]>([]);

  useEffect(() => {
    SedeDao.obtenerSedes()
      .then(setSedes)
      .catch((err) => console.error("Error al cargar sedes para modales:", err));
  }, []);

  // Agrupar sedes por región y ciudad
  const sedesPorGrupo = sedes.reduce((acc, s) => {
    const grupo = `${s.region.nombre} · ${s.ciudad.nombre}`;
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(s);
    return acc;
  }, {} as Record<string, SedeDTO[]>);

  // Ciudades únicas para el selector de dulcería
  const ciudadesUnicas = Array.from(
    new Set(sedes.map((s) => s.ciudad.nombre))
  ).sort();

  return (
    <>
      {/* ── Modales de Auth (lógica real con Supabase) ── */}
      <ModalLogin />
      <ModalRegistro />
      <ModalPerfil />
      <ModalCarnetSocio />
      <div className="hidden fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-trailer">
        <div className="max-w-3xl w-full relative transform scale-95 transition-transform duration-200" id="trailer-contenido">
          <button className="absolute -top-10 right-0 text-white/70 hover:text-white" onClick={(event) => { cerrarModalTrailer(); }}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
          {" "}
          <h3 className="text-white font-bold text-lg mb-3" id="trailer-titulo"></h3>
          <div className="video-container bg-black rounded-2xl border border-white/10 overflow-hidden">
            <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0" frameBorder="0" id="trailer-iframe"></iframe>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-legal">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200 max-h-[85vh] overflow-y-auto hide-scrollbar" id="legal-contenido">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModalLegal(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <div className="w-14 h-14 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-4" id="legal-icono">
            <i className="fa-solid fa-file-lines text-2xl text-brand-blue"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4" id="legal-titulo">
            Información
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed space-y-3" id="legal-texto"></div>
          {" "}
          <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-3 rounded-xl font-bold transition-colors mt-6" onClick={(event) => { cerrarModalLegal(); }}>
            Entendido
          </button>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center opacity-0 transition-opacity duration-300 p-4" id="modal-promo-banner">
        <div className="relative w-[98vw] max-w-[1400px] aspect-[16/9] md:aspect-[21/9] bg-dark-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(10,126,177,0.3)] transform scale-95 transition-transform duration-300 flex border border-white/10 group" id="promo-banner-contenido">
          <button className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-brand-red text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors border border-white/20 shadow-lg" onClick={(event) => { cerrarModalPromoBanner(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          {" "}
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" id="promo-banner-bg" style={{ backgroundImage: "url('https://i0.wp.com/www.lacosacine.com/wp-content/uploads/2026/04/La-Noche-del-Demonio-Banner-1.jpg?resize=1200%2C720&ssl=1')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent md:hidden"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-between p-8 md:p-16">
            <div className="flex flex-col justify-center h-full w-full md:w-1/2">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-block px-4 py-1.5 bg-brand-yellow text-black font-bold text-xs md:text-sm tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(220,158,63,0.5)] animate-pulse" id="promo-banner-etiqueta-exclusiva">
                  ¡Promoción Exclusiva!
                </span>
                {" "}
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-xs md:text-sm rounded uppercase" id="promo-banner-tipo-lanzamiento">
                  Pre-Estreno
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-2 drop-shadow-2xl uppercase tracking-tighter" id="promo-banner-titulo">
                La Noche del Demonio
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="text-brand-blue text-lg md:text-xl font-bold tracking-widest uppercase drop-shadow-lg" id="promo-banner-genero">
                  TERROR / SUSPENSO | 1h 46m
                </p>
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block"></span>
                {" "}
                <div className="hidden md:flex gap-2">
                  <span className="px-2 py-0.5 border border-white/20 text-white/80 text-xs font-bold rounded uppercase" id="promo-banner-formato">
                    D-BOX
                  </span>
                  {" "}
                  <span className="px-2 py-0.5 border border-brand-red/50 text-brand-red text-xs font-bold rounded uppercase" id="promo-banner-clasificacion">
                    +14
                  </span>
                </div>
              </div>
              <p className="text-brand-yellow text-lg md:text-2xl font-black italic uppercase tracking-wider mb-8 drop-shadow-md" id="promo-banner-fomo">
                "¡Mírala hoy, solo en cines!"
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button className="bg-brand-blue hover:bg-brand-dark-blue text-white px-8 py-4 rounded-xl font-bold text-lg md:text-xl transition-all shadow-[0_0_20px_rgba(10,126,177,0.4)] hover:shadow-[0_0_30px_rgba(10,126,177,0.6)] transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-max" id="promo-banner-btn-comprar" onClick={(event) => { cerrarModalPromoBanner(); abrirDetallePelicula('demonio','cartelera'); }}>
                  <i className="fa-solid fa-ticket-simple"></i>
                  {" "}
                  Comprar Entradas
                </button>
                {" "}
                <button className="text-white/60 hover:text-white font-semibold text-sm underline transition-colors px-4 py-2 text-center" onClick={(event) => { cerrarModalPromoBanner(); }}>
                  Quizás más tarde
                </button>
              </div>
              <div className="mt-6 flex items-start sm:items-center gap-2 text-xs text-white/50">
                <i className="fa-solid fa-star text-brand-yellow mt-0.5 sm:mt-0"></i>
                {" "}
                <span id="promo-banner-texto-socios">
                  Socios CineNáutica acumulan
                  {" "}
                  <strong className="text-white/90">
                    doble puntaje
                  </strong>
                  {" "}
                  con esta función.
                </span>
              </div>
            </div>
            <div className="hidden md:flex flex-col justify-center items-end h-full w-1/2 pl-8">
              <div className="w-full max-w-md lg:max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50">
                  <i className="fa-solid fa-circle-notch fa-spin text-white text-3xl"></i>
                </div>
                <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="relative z-10 w-full h-full" frameBorder="0" id="promo-banner-trailer"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-sede">
        <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200 max-h-[88vh] flex flex-col">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModal('modal-sede'); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <div className="w-14 h-14 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-4">
            <i className="fa-solid fa-location-dot text-2xl text-brand-yellow"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            ¿En qué sede quieres ver cine?
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            Te mostraremos la cartelera y las funciones de esa sede.
          </p>
          <div className="overflow-y-auto hide-scrollbar pr-1 -mr-1 flex-grow">
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={() => { elegirSedeNav(''); }}>
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                <i className="fa-solid fa-globe text-slate-400 text-sm"></i>
              </div>
              <span className="text-white font-semibold text-sm">
                Ver todas las sedes
              </span>
            </button>

            {Object.entries(sedesPorGrupo).map(([grupo, sedesDelGrupo]) => (
              <div key={grupo} className="mt-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                  {grupo}
                </p>
                {sedesDelGrupo.map((sede) => (
                  <button
                    key={sede.id_sede}
                    className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2"
                    type="button"
                    onClick={() => { elegirSedeNav(String(sede.id_sede)); }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-white font-semibold text-sm truncate">
                        {sede.nombre}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {sede.direccion}
                      </p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-dulceria-sede">
        <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => { cerrarModal('modal-dulceria-sede'); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <div className="w-14 h-14 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-4">
            <i className="fa-solid fa-bowl-food text-2xl text-brand-yellow"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            ¿Dónde recojo mi pedido?
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Elige ciudad y sede para abrir la dulcería de ese cine.
          </p>
          <div className="space-y-5">
            <div className="filtro-campo">
              <label>Ciudad</label>
              <i className="fa-solid fa-city"></i>
              <select className="filtro-select" id="dulceria-ciudad" onChange={() => { alCambiarCiudadDulceria(); }}>
                <option value="">Selecciona una ciudad</option>
                {ciudadesUnicas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="filtro-campo">
              <label>Sede</label>
              <i className="fa-solid fa-location-dot"></i>
              <select className="filtro-select" disabled id="dulceria-sede" onChange={() => { validarSedeDulceria(); }}>
                <option value="">Selecciona una sede</option>
                {sedes.map((s) => (
                  <option key={s.id_sede} data-ciudad={s.ciudad.nombre} value={String(s.id_sede)}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="w-full mt-6 bg-brand-yellow hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:hover:bg-slate-700 text-black py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2" disabled id="btn-confirmar-sede-dulceria" type="button" onClick={() => { confirmarSedeDulceria(); }}>
            Continuar a Dulcería
            <i className="fa-solid fa-bowl-food"></i>
          </button>
        </div>
      </div>
      <div id="overlay-carga-vista">
        <div className="spinner-Cine Náutica"></div>
      </div>
      <div id="contenedor-toasts"></div>
    </>
  );
}
