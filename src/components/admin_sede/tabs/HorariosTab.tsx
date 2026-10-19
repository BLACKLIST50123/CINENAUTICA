"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { FuncionAdminSedeDTO, SalaDetalleSedeDTO } from "@/src/dtos/adminSede";

interface HorariosTabProps {
  idSede: number;
  salas: SalaDetalleSedeDTO[];
  onAbrirCrearFuncion: () => void;
  onAbrirCancelarFuncion: (funcion: FuncionAdminSedeDTO) => void;
  recargarTrigger: number;
}

function getFechaLocalHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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

  // Generar 3 fechas rápidas (Hoy, Mañana, Pasado Mañana)
  const dHoy = new Date();
  const fechasRapidas = [0, 1, 2].map((offset) => {
    const d = new Date(dHoy);
    d.setDate(dHoy.getDate() + offset);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric" });
    return { iso, label };
  });

  return (
    <div className="space-y-6">
      {/* Barra de Controles y Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Botones rápidos de fecha */}
          <div className="flex bg-dark-800 border border-white/10 rounded-xl p-1">
            {fechasRapidas.map((item) => (
              <button
                key={item.iso}
                type="button"
                onClick={() => setFecha(item.iso)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  fecha === item.iso
                    ? "bg-brand-blue text-white shadow-sm"
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
            className="bg-dark-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow transition-colors"
          />

          {/* Filtro por Sala */}
          <select
            value={salaFiltro}
            onChange={(e) => setSalaFiltro(e.target.value)}
            className="bg-dark-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow transition-colors"
          >
            <option value="">Todas las salas ({salas.length})</option>
            {salas.map((s) => (
              <option key={s.id_sala} value={s.id_sala}>
                {s.nombre_sala}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Principal: + Programar Función */}
        <button
          type="button"
          onClick={onAbrirCrearFuncion}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 self-start lg:self-auto"
        >
          <i className="fa-solid fa-plus text-[11px]"></i>
          <span>Programar Función</span>
        </button>
      </div>

      {/* Grilla / Timeline de Funciones */}
      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="h-40 bg-dark-900 rounded-2xl"></div>
          <div className="h-40 bg-dark-900 rounded-2xl"></div>
          <div className="h-40 bg-dark-900 rounded-2xl"></div>
        </div>
      ) : funciones.length === 0 ? (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 text-2xl mx-auto mb-3">
            <i className="fa-regular fa-calendar-xmark"></i>
          </div>
          <h3 className="text-base font-bold text-white mb-1">No hay funciones programadas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            No se encontraron proyecciones para la fecha seleccionada ({fecha}). Haz clic en el botón inferior para programar una función.
          </p>
          <button
            type="button"
            onClick={onAbrirCrearFuncion}
            className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Programar Primera Función</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funciones.map((fn) => {
            const estaCancelada = fn.estado === "Cancelada" || fn.estado === "CANCELADA";
            const porcentaje = fn.asientos_capacidad > 0
              ? Math.round((fn.asientos_ocupados / fn.asientos_capacidad) * 100)
              : 0;

            return (
              <div
                key={fn.id_funcion}
                className={`bg-dark-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all ${
                  estaCancelada
                    ? "border-red-500/30 opacity-70 bg-red-950/10"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                      {fn.hora_inicio} - {fn.hora_fin}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        estaCancelada
                          ? "bg-brand-red text-white"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {estaCancelada ? "CANCELADA" : "PROGRAMADA"}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1 mb-1">
                    {fn.pelicula_titulo}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1 text-brand-yellow font-semibold">
                      <i className="fa-solid fa-door-open text-[10px]"></i>
                      {fn.sala_nombre}
                    </span>
                    <span>·</span>
                    <span className="text-slate-300 font-semibold">{fn.formato_nombre}</span>
                    <span>·</span>
                    <span>{fn.idioma_audio}</span>
                  </div>

                  {/* Barra de Ocupación */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Ocupación de Sala</span>
                      <span className="font-mono font-bold text-white text-xs">
                        {fn.asientos_ocupados} / {fn.asientos_capacidad} ({porcentaje}%)
                      </span>
                    </div>
                    <div className="w-full bg-dark-950 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          porcentaje >= 80 ? "bg-amber-400" : "bg-brand-blue"
                        }`}
                        style={{ width: `${Math.max(fn.asientos_ocupados > 0 ? 4 : 0, porcentaje)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 mt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{fn.pelicula_duracion_min} min</span>
                  {!estaCancelada && (
                    <button
                      type="button"
                      onClick={() => onAbrirCancelarFuncion(fn)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-red hover:bg-red-500/10 transition-colors border border-transparent hover:border-brand-red/30 flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-ban text-[10px]"></i>
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
