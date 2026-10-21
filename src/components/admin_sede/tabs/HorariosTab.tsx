"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { FuncionAdminSedeDTO, SalaDetalleSedeDTO } from "@/src/dtos/adminSede";

interface HorariosTabProps {
  idSede: number;
  salas: SalaDetalleSedeDTO[];
  onAbrirCrearFuncion: (params?: { fecha?: string; hora?: string; idSala?: string }) => void;
  onAbrirCancelarFuncion: (funcion: FuncionAdminSedeDTO) => void;
  recargarTrigger: number;
}

function getFechaLocalHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Horarios desde 10:00 hasta 24:00 cada 30 minutos
// 10:00 es minuto 600. Cada 30 minutos = 60px de altura (1 minuto = 2px)
const HORA_BASE_MINUTOS = 10 * 60; // 600 minutos
const FRANJAS_HORARIAS = Array.from({ length: 29 }, (_, i) => {
  const totalMinutos = HORA_BASE_MINUTOS + i * 30;
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  const hh = String(horas === 24 ? "24" : horas % 24).padStart(2, "0");
  const mm = String(minutos).padStart(2, "0");
  return {
    label: `${hh}:${mm}`,
    minutos: totalMinutos,
  };
});

export default function HorariosTab({
  idSede,
  salas,
  onAbrirCrearFuncion,
  onAbrirCancelarFuncion,
  recargarTrigger,
}: HorariosTabProps) {
  const [fecha, setFecha] = useState<string>(getFechaLocalHoy());
  const [salaFiltro, setSalaFiltro] = useState<string>("");
  const [funciones, setFunciones] = useState<FuncionAdminSedeDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [alertaToast, setAlertaToast] = useState<string | null>(null);

  // Minuto actual en vivo (actualizado cada 30s)
  const [horaActualMinutos, setHoraActualMinutos] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setHoraActualMinutos(d.getHours() * 60 + d.getMinutes());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const mostrarToast = (mensaje: string) => {
    setAlertaToast(mensaje);
    setTimeout(() => {
      setAlertaToast(null);
    }, 3500);
  };

  const cargarFunciones = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerFuncionesSede(
      idSede,
      fecha,
      salaFiltro || undefined
    );
    setFunciones(data);
    setCargando(false);
  }, [idSede, fecha, salaFiltro, recargarTrigger]);

  useEffect(() => {
    cargarFunciones();
  }, [cargarFunciones]);

  // Fechas rápidas (Hoy, Mañana, Pasado Mañana)
  const dHoy = new Date();
  const fechasRapidas = [0, 1, 2].map((offset) => {
    const d = new Date(dHoy);
    d.setDate(dHoy.getDate() + offset);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric" });
    return { iso, label };
  });

  // Salas activas a mostrar en las columnas
  const salasAMostrar = useMemo(() => {
    if (salaFiltro) {
      return salas.filter((s) => s.id_sala === salaFiltro);
    }
    return salas;
  }, [salas, salaFiltro]);

  // Agrupar funciones por sala
  const funcionesPorSala = useMemo(() => {
    const map = new Map<string, FuncionAdminSedeDTO[]>();
    salas.forEach((s) => map.set(s.id_sala, []));
    funciones.forEach((fn) => {
      const list = map.get(fn.id_sala) || [];
      list.push(fn);
      map.set(fn.id_sala, list);
    });
    return map;
  }, [salas, funciones]);

  // Helper para convertir "HH:MM" a minutos desde 00:00
  const horaMinutos = (horaStr: string): number => {
    if (!horaStr) return HORA_BASE_MINUTOS;
    const [h, m] = horaStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Validación y acción al hacer clic en un slot vacío
  const handleSlotClick = (sala: SalaDetalleSedeDTO, franjaMinutos: number, franjaHoraStr: string) => {
    const hoyLocal = getFechaLocalHoy();
    if (fecha < hoyLocal) {
      mostrarToast("No se pueden programar funciones en fechas pasadas.");
      return;
    }

    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    if (fecha === hoyLocal && franjaMinutos < minutosAhora) {
      mostrarToast("No se pueden programar funciones en horarios pasados de hoy.");
      return;
    }

    const funcionesDeSala = funcionesPorSala.get(sala.id_sala) || [];
    // Verificar si cae dentro de otra función existente o su tiempo de limpieza (30m)
    const colisiona = funcionesDeSala.some((f) => {
      if (f.estado === "Cancelada" || f.estado === "CANCELADA") return false;
      const inicio = horaMinutos(f.hora_inicio);
      const finConLimpieza = horaMinutos(f.hora_fin) + 30;
      return franjaMinutos >= inicio && franjaMinutos < finConLimpieza;
    });

    if (colisiona) {
      mostrarToast("El espacio seleccionado colisiona con otra función o su tiempo de limpieza.");
      return;
    }

    // Verificar si hay espacio suficiente antes de la siguiente función programada
    const siguienteFuncion = funcionesDeSala
      .filter((f) => f.estado !== "Cancelada" && f.estado !== "CANCELADA" && horaMinutos(f.hora_inicio) > franjaMinutos)
      .sort((a, b) => horaMinutos(a.hora_inicio) - horaMinutos(b.hora_inicio))[0];

    if (siguienteFuncion) {
      const espacioDisponibleMinutos = horaMinutos(siguienteFuncion.hora_inicio) - franjaMinutos;
      if (espacioDisponibleMinutos < 90) { // Al menos 90 min de función
        mostrarToast("El espacio disponible antes de la siguiente función es insuficiente.");
        return;
      }
    }

    // Todo válido: abrir modal con datos precargados
    onAbrirCrearFuncion({
      fecha,
      hora: franjaHoraStr,
      idSala: sala.id_sala,
    });
  };

  // Cálculo de línea de tiempo actual
  const hoyIso = getFechaLocalHoy();
  const esHoy = fecha === hoyIso;
  const lineaTiempoTopPx = (horaActualMinutos - HORA_BASE_MINUTOS) * 2;
  const mostrarLineaTiempo = esHoy && lineaTiempoTopPx >= 0 && lineaTiempoTopPx <= (FRANJAS_HORARIAS.length - 1) * 60;

  return (
    <div className="space-y-6">
      {/* Toast flotante de validación */}
      {alertaToast && (
        <div className="fixed bottom-6 right-6 z-[120] bg-rose-600/95 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <i className="fa-solid fa-triangle-exclamation text-sm"></i>
          <span>{alertaToast}</span>
        </div>
      )}

      {/* Barra de Controles y Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0D1627] border border-white/15 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Botones rápidos de fecha */}
          <div className="flex bg-[#070d18] border border-white/10 rounded-xl p-1">
            {fechasRapidas.map((item) => (
              <button
                key={item.iso}
                type="button"
                onClick={() => setFecha(item.iso)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  fecha === item.iso
                    ? "bg-brand-blue text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Selector de Fecha Calendario */}
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-[#070d18] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow transition-colors font-medium"
          />

          {/* Filtro por Sala */}
          <select
            value={salaFiltro}
            onChange={(e) => setSalaFiltro(e.target.value)}
            className="bg-[#070d18] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow transition-colors"
          >
            <option value="">Todas las salas ({salas.length})</option>
            {salas.map((s) => (
              <option key={s.id_sala} value={s.id_sala}>
                {s.nombre_sala} ({s.capacidad_total} butacas)
              </option>
            ))}
          </select>
        </div>

        {/* Botón Principal: + Añadir Función (Precargando la fecha seleccionada) */}
        <button
          type="button"
          onClick={() => onAbrirCrearFuncion({ fecha })}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-md shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 self-start lg:self-auto"
        >
          <i className="fa-solid fa-plus text-[11px]"></i>
          <span>Añadir Función</span>
        </button>
      </div>

      {/* Leyenda Visual de Tipos de Función y Limpieza */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D1627] border border-white/10 rounded-xl px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            Leyenda:
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border-l-2 border-amber-400 inline-block"></span>
            <span>Estreno</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/30 border-l-2 border-rose-500 inline-block"></span>
            <span>Regular</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500/30 border-l-2 border-purple-400 inline-block"></span>
            <span>Pre-Estreno</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500/30 border-l-2 border-cyan-400 inline-block"></span>
            <span>Re-Estreno</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded inline-block bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.6),rgba(0,0,0,0.6)_3px,rgba(255,255,255,0.15)_3px,rgba(255,255,255,0.15)_6px)] border border-white/20"></span>
            <span>Limpieza (30m)</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Total funciones para {fecha}: <b className="text-white">{funciones.length}</b>
        </div>
      </div>

      {/* Cronograma Visual Tipo Horario */}
      {cargando ? (
        <div className="h-96 bg-[#0D1627] border border-white/10 rounded-2xl flex items-center justify-center animate-pulse">
          <div className="text-center">
            <i className="fa-solid fa-clock-rotate-left text-3xl text-brand-blue mb-2 animate-spin"></i>
            <p className="text-xs text-slate-400">Cargando cronograma interactivo de funciones...</p>
          </div>
        </div>
      ) : salasAMostrar.length === 0 ? (
        <div className="bg-[#0D1627] border border-white/10 rounded-2xl p-12 text-center shadow-xl">
          <p className="text-slate-400 text-sm">No hay salas disponibles para mostrar el cronograma.</p>
        </div>
      ) : (
        <div className="grid-horarios-wrapper border border-white/15 bg-[#070d18] rounded-2xl shadow-2xl overflow-x-auto relative">
          <div
            className="grid-horarios"
            style={{
              gridTemplateColumns: `70px repeat(${salasAMostrar.length}, minmax(180px, 1fr))`,
            }}
          >
            {/* Fila Header Sticky: Hora + Salas */}
            <div className="grid-horarios-header">
              <div className="grid-horarios-header-cell flex items-center justify-center text-slate-400 font-mono text-[11px]">
                <i className="fa-regular fa-clock"></i>
              </div>
              {salasAMostrar.map((sala) => (
                <div key={sala.id_sala} className="grid-horarios-header-cell">
                  <div className="flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-door-open text-brand-yellow text-[10px]"></i>
                    <span>{sala.nombre_sala}</span>
                  </div>
                  <span className="sala-formato-tag">
                    {sala.capacidad_total} butacas · {sala.estado}
                  </span>
                </div>
              ))}
            </div>

            {/* Columna de Horas (Sticky a la izquierda) */}
            <div className="relative border-r border-white/10 bg-[#0a0f1d]">
              {FRANJAS_HORARIAS.slice(0, -1).map((franja) => (
                <div key={franja.label} className="grid-hora-label border-b border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    {franja.label}
                  </span>
                </div>
              ))}

              {/* Badge flotante de la hora actual en el eje izquierdo */}
              {mostrarLineaTiempo && (
                <div
                  className="absolute right-1 z-30 pointer-events-none transform -translate-y-1/2 bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1"
                  style={{ top: `${lineaTiempoTopPx}px` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>
                    {String(Math.floor(horaActualMinutos / 60)).padStart(2, "0")}:{String(horaActualMinutos % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            {/* Columnas de Salas con sus Funciones */}
            {salasAMostrar.map((sala) => {
              const funcionesDeSala = funcionesPorSala.get(sala.id_sala) || [];

              return (
                <div
                  key={sala.id_sala}
                  className="grid-sala-columna relative bg-[#080e1c]/60"
                  style={{ height: `${(FRANJAS_HORARIAS.length - 1) * 60}px` }}
                >
                  {/* Línea horizontal en vivo de la hora actual en cada columna */}
                  {mostrarLineaTiempo && (
                    <div
                      className="absolute left-0 right-0 z-20 pointer-events-none"
                      style={{ top: `${lineaTiempoTopPx}px` }}
                    >
                      <div className="border-t-2 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] w-full"></div>
                    </div>
                  )}

                  {/* Líneas horizontales de 30 min de fondo */}
                  {FRANJAS_HORARIAS.slice(0, -1).map((franja) => (
                    <div
                      key={franja.label}
                      className="grid-fila-hora group cursor-pointer"
                      onClick={() => handleSlotClick(sala, franja.minutos, franja.label)}
                      title={`Clic para programar en ${sala.nombre_sala} a las ${franja.label}`}
                    >
                      {/* Botón fantasma "+" visible en hover de slot vacío */}
                      <div className="grid-slot-vacio opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="ghost-add-btn w-6 h-6 rounded-full bg-brand-yellow text-dark-950 text-xs font-bold flex items-center justify-center shadow-lg">
                          +
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Tarjetas de Funciones renderizadas en esta columna */}
                  {funcionesDeSala.map((fn) => {
                    const minInicio = horaMinutos(fn.hora_inicio);
                    const duracionMin = fn.pelicula_duracion_min || 110;

                    // Posicionamiento
                    const topPx = Math.max(0, (minInicio - HORA_BASE_MINUTOS) * 2);
                    const heightPx = Math.max(40, duracionMin * 2);

                    const estaCancelada = fn.estado === "Cancelada" || fn.estado === "CANCELADA";
                    const porcentaje =
                      fn.asientos_capacidad > 0
                        ? Math.min(100, Math.round((fn.asientos_ocupados / fn.asientos_capacidad) * 100))
                        : 0;

                    // Clase de tipo de función de acuerdo al tipo_lanzamiento de la base de datos
                    const tipoNorm = (fn.tipo_lanzamiento || "Regular").toLowerCase().replace("_", "-");
                    let claseTipo = "tipo-regular";
                    if (tipoNorm.includes("pre-estreno")) claseTipo = "tipo-pre-estreno";
                    else if (tipoNorm.includes("re-estreno")) claseTipo = "tipo-re-estreno";
                    else if (tipoNorm.includes("estreno")) claseTipo = "tipo-estreno";

                    return (
                      <React.Fragment key={fn.id_funcion}>
                        {/* Tarjeta de la Función */}
                        <div
                          className={`grid-funcion-card ${claseTipo} ${
                            estaCancelada ? "opacity-60 grayscale-[50%]" : ""
                          }`}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                          }}
                        >
                          <div className="grid-funcion-card-body flex flex-col justify-between">
                            <div>
                              <div className="grid-funcion-card-hora flex items-center justify-between">
                                <span>
                                  {fn.hora_inicio} - {fn.hora_fin}
                                </span>
                                {estaCancelada && (
                                  <span className="text-[9px] text-red-400 font-bold">CANCELADA</span>
                                )}
                              </div>

                              <div className="grid-funcion-card-titulo" title={fn.pelicula_titulo}>
                                {fn.pelicula_titulo}
                              </div>

                              <div className="grid-funcion-card-tags">
                                <span className="grid-funcion-card-tag">{fn.formato_nombre}</span>
                                <span className="grid-funcion-card-tag">{fn.idioma_audio}</span>
                              </div>
                            </div>

                            {/* Ocupación real */}
                            {!estaCancelada && (
                              <div className="mt-1 pt-1 border-t border-white/10">
                                <div className="flex items-center justify-between text-[9px] text-slate-300">
                                  <span>{fn.asientos_ocupados}/{fn.asientos_capacidad}</span>
                                  <span className="font-bold text-amber-400">{porcentaje}%</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-1 mt-0.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      porcentaje >= 85
                                        ? "bg-rose-500"
                                        : porcentaje >= 50
                                        ? "bg-amber-400"
                                        : "bg-brand-blue"
                                    }`}
                                    style={{ width: `${Math.max(4, porcentaje)}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Acciones flotantes al hacer hover */}
                          {!estaCancelada && (
                            <div className="grid-funcion-card-acciones">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAbrirCancelarFuncion(fn);
                                }}
                                className="btn-eliminar"
                                title="Cancelar o Reprogramar Función"
                              >
                                <i className="fa-solid fa-ban text-[9px]"></i>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bloque de Limpieza de 30 minutos (60px) pegado contiguo a la función */}
                        <div
                          className="grid-funcion-limpieza"
                          style={{
                            top: `${topPx + heightPx}px`,
                            height: "60px",
                          }}
                          title="Tiempo reservado para desinfección y limpieza de sala (30 minutos)"
                        >
                          <span className="grid-funcion-limpieza-label">
                            <i className="fa-solid fa-broom mr-1 text-[8px]"></i>
                            Limpieza 30m
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
