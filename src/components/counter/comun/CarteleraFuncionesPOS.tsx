"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SkeletonBase } from "@/src/components/comun/skeletons";

export interface FuncionPOSItem {
  id_funcion: string;
  id_pelicula: string;
  id_sede: number;
  id_sala: string;
  id_formato: string;
  fecha: string;
  hora_inicio: string;
  hora_fin?: string;
  idioma_audio?: string;
  estado?: string;
  sala?: {
    id_sala: string;
    numero_sala: number;
    nombre_sala: string;
    filas?: number;
    columnas?: number;
  };
  pelicula?: {
    id_pelicula: string;
    titulo: string;
    url_poster: string;
    duracion_min: number;
    clasificacion: string;
    sinopsis?: string;
  };
  formato_proyeccion?: {
    id_formato: string;
    codigo: string;
    nombre: string;
  };
  ocupacion?: {
    ocupados: number;
    total: number;
    pct: number;
  };
}

interface CarteleraFuncionesPOSProps {
  funciones: FuncionPOSItem[];
  cargando: boolean;
  sedeNombre: string;
  filtroDia: "hoy" | "manana";
  onCambiarFiltroDia: (dia: "hoy" | "manana") => void;
  onSeleccionarFuncion: (fn: FuncionPOSItem) => void;
  funcionSeleccionadaId?: string | null;
}

function calcularOcupacion(fn: FuncionPOSItem): {
  ocupados: number;
  total: number;
  pct: number;
} {
  if (fn.ocupacion && typeof fn.ocupacion.total === "number" && fn.ocupacion.total > 0) {
    const ocupados = Math.max(0, Math.min(fn.ocupacion.ocupados || 0, fn.ocupacion.total));
    const total = fn.ocupacion.total;
    const pct = Math.round((ocupados / total) * 100);
    return { ocupados, total, pct };
  }

  const total =
    fn.sala && fn.sala.filas && fn.sala.columnas
      ? fn.sala.filas * fn.sala.columnas
      : 84;

  return { ocupados: 0, total, pct: 0 };
}

export default function CarteleraFuncionesPOS({
  funciones,
  cargando,
  sedeNombre,
  filtroDia,
  onCambiarFiltroDia,
  onSeleccionarFuncion,
  funcionSeleccionadaId,
}: CarteleraFuncionesPOSProps) {
  const [modoVista, setModoVista] = useState<"peli" | "hora">("peli");
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroFormato, setFiltroFormato] = useState<string>("Todos");
  const [horaActualStr, setHoraActualStr] = useState<string>("17:20");
  const [fechaActualStr, setFechaActualStr] = useState<string>("");

  useEffect(() => {
    const actualizarReloj = () => {
      const now = new Date();
      if (filtroDia === "manana") {
        now.setDate(now.getDate() + 1);
      }
      const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const diaTexto = diasSemana[now.getDay()];
      const diaNum = now.getDate();
      const mesTexto = meses[now.getMonth()];
      setFechaActualStr(`${diaTexto} ${diaNum} de ${mesTexto}`);

      const realNow = new Date();
      const hh = String(realNow.getHours()).padStart(2, "0");
      const mm = String(realNow.getMinutes()).padStart(2, "0");
      setHoraActualStr(`${hh}:${mm}`);
    };

    actualizarReloj();
    const interval = setInterval(actualizarReloj, 30000);
    return () => clearInterval(interval);
  }, [filtroDia]);

  // Verificar si una función ya inició
  const estaPasada = (horaInicio: string): boolean => {
    if (filtroDia === "manana") return false;
    const [h, m] = (horaInicio || "00:00").substring(0, 5).split(":").map(Number);
    const [ha, ma] = horaActualStr.split(":").map(Number);
    const minShow = h * 60 + m;
    const minAhora = ha * 60 + ma;
    // Si inició antes de la hora actual
    return minShow < minAhora;
  };

  // Filtrado de funciones
  const funcionesFiltradas = useMemo(() => {
    return funciones.filter((fn) => {
      // Búsqueda por título de película
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase();
        const titulo = fn.pelicula?.titulo?.toLowerCase() || "";
        if (!titulo.includes(query)) return false;
      }

      // Filtro de formato
      if (filtroFormato !== "Todos") {
        const nombreFmt = (fn.formato_proyeccion?.nombre || "").toLowerCase();
        const codigoFmt = (fn.formato_proyeccion?.codigo || "").toLowerCase();
        const idioma = (fn.idioma_audio || "").toLowerCase();
        const queryFmt = filtroFormato.toLowerCase();

        if (queryFmt === "2d doblada" && !((nombreFmt.includes("2d") || codigoFmt.includes("2d")) && idioma.includes("dob"))) {
          return false;
        }
        if (queryFmt === "2d subtitulada" && !((nombreFmt.includes("2d") || codigoFmt.includes("2d")) && idioma.includes("sub"))) {
          return false;
        }
        if (queryFmt === "sala xd" && !(nombreFmt.includes("xd") || codigoFmt.includes("xd"))) {
          return false;
        }
        if (queryFmt === "d-box" && !(nombreFmt.includes("dbox") || codigoFmt.includes("dbox") || nombreFmt.includes("d-box"))) {
          return false;
        }
        if (queryFmt === "imax" && !(nombreFmt.includes("imax") || codigoFmt.includes("imax"))) {
          return false;
        }
      }

      return true;
    });
  }, [funciones, busqueda, filtroFormato]);

  // Agrupación por película para modo "peli"
  const peliculasAgrupadas = useMemo(() => {
    const mapa = new Map<
      string,
      {
        pelicula: NonNullable<FuncionPOSItem["pelicula"]>;
        formatos: Map<string, FuncionPOSItem[]>;
      }
    >();

    funcionesFiltradas.forEach((fn) => {
      const idPeli = fn.pelicula?.id_pelicula || fn.id_pelicula;
      const tituloPeli = fn.pelicula?.titulo || "Película";

      if (!mapa.has(idPeli)) {
        mapa.set(idPeli, {
          pelicula: fn.pelicula || {
            id_pelicula: idPeli,
            titulo: tituloPeli,
            url_poster: "/img/posters/default.webp",
            duracion_min: 120,
            clasificacion: "APT",
          },
          formatos: new Map<string, FuncionPOSItem[]>(),
        });
      }

      const peliEntry = mapa.get(idPeli)!;
      const nombreFmt = (fn.formato_proyeccion?.nombre || "2D").toUpperCase();
      const idioma = (fn.idioma_audio || "DOBLADA").toUpperCase();
      let keyFormato = nombreFmt;
      if (nombreFmt === "2D") {
        keyFormato = `2D ${idioma}`;
      }

      if (!peliEntry.formatos.has(keyFormato)) {
        peliEntry.formatos.set(keyFormato, []);
      }
      peliEntry.formatos.get(keyFormato)!.push(fn);
    });

    // Ordenar showtimes cronológicamente dentro de cada formato
    mapa.forEach((peli) => {
      peli.formatos.forEach((items) => {
        items.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      });
    });

    return Array.from(mapa.values());
  }, [funcionesFiltradas]);

  // Lista plana ordenada por hora para modo "hora"
  const funcionesPorHora = useMemo(() => {
    return [...funcionesFiltradas].sort((a, b) =>
      a.hora_inicio.localeCompare(b.hora_inicio)
    );
  }, [funcionesFiltradas]);

  return (
    <div className="w-full">
      {/* ── Encabezado Principal y Selector de Modo ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Funciones de {filtroDia === "hoy" ? "hoy" : "mañana"}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            {fechaActualStr || "Sábado 10 de octubre"} · {sedeNombre} ·{" "}
            <span className="text-emerald-400 font-semibold font-mono">
              Hora actual {horaActualStr}
            </span>
          </p>
        </div>

        {/* Switch de Vistas: Por Película / Por Hora */}
        <div className="flex bg-[#0B1528] border border-slate-800 rounded-xl p-1 text-xs font-bold shadow-inner shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setModoVista("peli")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${modoVista === "peli"
              ? "bg-[#0284C7] text-white shadow-md shadow-cyan-900/40"
              : "text-slate-400 hover:text-white"
              }`}
          >
            <i className="fa-solid fa-film text-sm"></i>
            <span>Por película</span>
          </button>
          <button
            type="button"
            onClick={() => setModoVista("hora")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${modoVista === "hora"
              ? "bg-[#0284C7] text-white shadow-md shadow-cyan-900/40"
              : "text-slate-400 hover:text-white"
              }`}
          >
            <i className="fa-regular fa-clock text-sm"></i>
            <span>Por hora</span>
          </button>
        </div>
      </div>

      {/* ── Barra de Filtros: Día, Buscador, Formatos y Leyenda ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Filtro Día */}
        <div className="flex bg-[#0B1528] border border-slate-800 rounded-xl p-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => onCambiarFiltroDia("hoy")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filtroDia === "hoy"
              ? "bg-[#0284C7] text-white shadow-md shadow-cyan-900/40"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => onCambiarFiltroDia("manana")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filtroDia === "manana"
              ? "bg-[#0284C7] text-white shadow-md shadow-cyan-900/40"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Mañana
          </button>
        </div>

        {/* Buscador de Película */}
        <div className="relative flex-grow max-w-xs">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar película..."
            className="w-full bg-[#0B1528] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Chips de Formato */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {["Todos", "2D Doblada", "2D Subtitulada", "SALA XD", "D-BOX", "IMAX"].map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFiltroFormato(fmt)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${filtroFormato === fmt
                ? "bg-[#0284C7] text-white border-cyan-500 shadow-sm"
                : "bg-[#0B1528] text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Leyenda de Capacidad */}
        <div className="ml-auto hidden xl:flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Media
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            Casi llena
          </span>
        </div>
      </div>

      {/* ── Contenido de Funciones ── */}
      {cargando ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-4 md:p-5 flex gap-4 md:gap-5 min-h-[340px] md:min-h-[360px]"
            >
              <SkeletonBase className="w-28 md:w-36 aspect-[2/3] rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
                <div className="space-y-2">
                  <SkeletonBase className="h-6 w-3/4 rounded" />
                  <SkeletonBase className="h-4 w-1/2 rounded" />
                </div>
                <div className="space-y-3">
                  <SkeletonBase className="h-4 w-28 rounded" />
                  <div className="flex flex-wrap gap-2">
                    <SkeletonBase className="h-10 w-24 rounded-xl" />
                    <SkeletonBase className="h-10 w-24 rounded-xl" />
                    <SkeletonBase className="h-10 w-24 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : funcionesFiltradas.length === 0 ? (
        <div className="text-center py-20 bg-[#0B1528]/40 border border-slate-800/80 rounded-2xl p-8">
          <i className="fa-solid fa-film text-slate-600 text-4xl mb-3"></i>
          <h3 className="text-lg font-bold text-white mb-1">
            No hay funciones disponibles
          </h3>
          <p className="text-xs text-slate-400">
            No se encontraron proyecciones con los filtros seleccionados para {sedeNombre}.
          </p>
        </div>
      ) : modoVista === "peli" ? (
        /* ══════════════════════════════════════════════════════
           MODO 1: POR PELÍCULA (Grid 2 columnas, altura amplia,
           scroll vertical por formatos y horizontal por horas)
           ══════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {peliculasAgrupadas.map(({ pelicula, formatos }) => (
            <article
              key={pelicula.id_pelicula}
              className="bg-[#0B1528] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 md:p-5 flex gap-4 md:gap-5 transition-all shadow-xl min-h-[340px] md:min-h-[360px] relative"
            >
              {/* Poster de la película a la izquierda */}
              <img
                src={pelicula.url_poster || "/img/posters/default.webp"}
                alt={pelicula.titulo}
                className="w-28 md:w-36 aspect-[2/3] object-cover rounded-xl shadow-lg shrink-0 border border-slate-800 self-start"
              />

              {/* Contenido derecho de la película */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  {/* Fila superior: Título, duración y clasificación */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base md:text-lg leading-tight truncate">
                        {pelicula.titulo}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {pelicula.sinopsis || "Acción / Ciencia Ficción"} ·{" "}
                        {pelicula.duracion_min || 120}m
                      </p>
                    </div>
                    <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300 font-mono shrink-0">
                      {pelicula.clasificacion || "APT"}
                    </span>
                  </div>

                  {/* Contenedor de formatos amplio para que 2 formatos se vean completos sin cortarse */}
                  <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
                    {Array.from(formatos.entries()).map(([nombreFormato, showtimes]) => (
                      <div key={nombreFormato}>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                          {nombreFormato}
                        </p>

                        {/* Fila de horas con scroll horizontal */}
                        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar flex-nowrap">
                          {showtimes.map((fn) => {
                            const { ocupados, total, pct } = calcularOcupacion(fn);
                            const pasada = estaPasada(fn.hora_inicio);
                            const esSeleccionada = funcionSeleccionadaId === fn.id_funcion;
                            const numSala = fn.sala?.numero_sala || 1;

                            // Color coding
                            let borderClass = "border-slate-800 bg-[#070D18]";
                            let barColor = "bg-slate-600";
                            let textColor = "text-white";

                            if (pasada) {
                              borderClass = "border-slate-800/80 bg-slate-900/40 opacity-55";
                              barColor = "bg-slate-700";
                              textColor = "text-slate-500 line-through";
                            } else if (pct >= 80) {
                              borderClass = "border-red-500/80 bg-red-950/20 hover:bg-red-950/40 text-red-300";
                              barColor = "bg-red-500";
                            } else if (pct >= 50) {
                              borderClass = "border-amber-500/80 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300";
                              barColor = "bg-amber-500";
                            } else {
                              borderClass = "border-emerald-500/80 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300";
                              barColor = "bg-emerald-500";
                            }

                            if (esSeleccionada) {
                              borderClass = "border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400";
                            }

                            return (
                              <button
                                key={fn.id_funcion}
                                type="button"
                                disabled={pasada}
                                onClick={() => onSeleccionarFuncion(fn)}
                                title={`Sala ${numSala} · ${ocupados}/${total} (${pct}%)`}
                                className={`min-w-[85px] px-2.5 py-2 rounded-xl border flex flex-col items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed ${borderClass}`}
                              >
                                <span className={`text-sm font-bold font-mono tracking-tight ${textColor}`}>
                                  {fn.hora_inicio.substring(0, 5)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  S{numSala} · {ocupados}/{total}
                                </span>
                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                                  <div
                                    className={`h-full rounded-full transition-all ${barColor}`}
                                    style={{ width: `${ocupados > 0 ? Math.max(pct, 4) : 0}%` }}
                                  ></div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════
           MODO 2: POR HORA (Lista vertical cronológica con hora
           grande a la izquierda, barra y botón Vender / Ya inició)
           ══════════════════════════════════════════════════════ */
        <div className="space-y-2.5">
          {funcionesPorHora.map((fn) => {
            const { ocupados, total, pct } = calcularOcupacion(fn);
            const pasada = estaPasada(fn.hora_inicio);
            const numSala = fn.sala?.numero_sala || 1;
            const nombreFmt = fn.formato_proyeccion?.nombre || "2D";
            const titulo = fn.pelicula?.titulo || "Película";

            // Bar color
            let barColor = "bg-slate-700";
            if (!pasada) {
              if (pct >= 80) barColor = "bg-red-500";
              else if (pct >= 50) barColor = "bg-amber-500";
              else barColor = "bg-emerald-500";
            }

            return (
              <div
                key={fn.id_funcion}
                className={`flex items-center gap-4 bg-[#0B1528] border border-slate-800 rounded-xl px-4 py-3 transition-all ${pasada ? "opacity-50" : "hover:border-slate-700"
                  }`}
              >
                {/* Hora grande a la izquierda */}
                <span
                  className={`text-2xl font-bold font-mono w-20 shrink-0 ${pasada ? "text-slate-500 line-through decoration-slate-600" : "text-white"
                    }`}
                >
                  {fn.hora_inicio.substring(0, 5)}
                </span>

                {/* Poster pequeño */}
                <img
                  src={fn.pelicula?.url_poster || "/img/posters/default.webp"}
                  alt={titulo}
                  className="w-9 h-12 object-cover rounded shadow shrink-0 border border-slate-800"
                />

                {/* Info de película y sala */}
                <div className="min-w-0 flex-grow">
                  <p className="text-white font-bold text-sm truncate">{titulo}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {nombreFmt} · Sala {numSala}
                  </p>
                </div>

                {/* Barra de capacidad y números */}
                <div className="w-36 md:w-44 hidden sm:block shrink-0">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>
                      {ocupados}/{total}
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${ocupados > 0 ? Math.max(pct, 4) : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Botón de acción */}
                {pasada ? (
                  <button
                    disabled
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#070D18] text-slate-500 border border-slate-800 cursor-not-allowed shrink-0"
                  >
                    Ya inició
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSeleccionarFuncion(fn)}
                    className="px-5 py-2 rounded-xl text-xs md:text-sm font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white transition-all shadow-md shadow-cyan-900/30 cursor-pointer active:scale-95 shrink-0"
                  >
                    Vender
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
