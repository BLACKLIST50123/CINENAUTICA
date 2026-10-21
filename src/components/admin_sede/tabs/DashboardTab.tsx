"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { MetricasDashboardDTO, PeriodoDashboard } from "@/src/dtos/adminSede";

interface DashboardTabProps {
  idSede: number;
}

export default function DashboardTab({ idSede }: DashboardTabProps) {
  const [periodo, setPeriodo] = useState<PeriodoDashboard>("hoy");
  const [metricas, setMetricas] = useState<MetricasDashboardDTO | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [salasExpandidas, setSalasExpandidas] = useState<Set<string>>(new Set());
  const [fechasExpandidas, setFechasExpandidas] = useState<Set<string>>(new Set());

  const cargarMetricas = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerMetricasDashboard(idSede, periodo);
    setMetricas(data);
    // Auto-expandir la primera sala con funciones para buena experiencia inicial
    if (data?.rendimiento_salas_detalle?.length) {
      const primeraConFunciones = data.rendimiento_salas_detalle.find(s => s.total_funciones > 0) || data.rendimiento_salas_detalle[0];
      if (primeraConFunciones) {
        setSalasExpandidas(new Set([primeraConFunciones.id_sala]));
        if (primeraConFunciones.fechas.length > 0) {
          setFechasExpandidas(new Set([`${primeraConFunciones.id_sala}_${primeraConFunciones.fechas[0].fecha}`]));
        }
      }
    }
    setCargando(false);
  }, [idSede, periodo]);

  const toggleSala = (idSala: string) => {
    setSalasExpandidas((prev) => {
      const next = new Set(prev);
      if (next.has(idSala)) next.delete(idSala);
      else next.add(idSala);
      return next;
    });
  };

  const toggleFecha = (fechaKey: string) => {
    setFechasExpandidas((prev) => {
      const next = new Set(prev);
      if (next.has(fechaKey)) next.delete(fechaKey);
      else next.add(fechaKey);
      return next;
    });
  };

  useEffect(() => {
    cargarMetricas();
  }, [cargarMetricas]);

  return (
    <div className="space-y-6">
      {/* Selector de Periodo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Dashboard Operativo</h2>
          <p className="text-xs text-slate-400 mt-0.5">Indicadores en vivo de recaudación y afluencia</p>
        </div>

        <div className="flex bg-dark-900 border border-white/10 rounded-xl p-1 self-start sm:self-auto">
          {(
            [
              { id: "hoy", label: "Hoy" },
              { id: "7d", label: "7 Días" },
              { id: "30d", label: "30 Días" },
              { id: "anio", label: "Año" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriodo(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                periodo === item.id
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 KPIs Principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Ingresos Totales */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ingresos Totales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">
              <i className="fa-solid fa-sack-dollar"></i>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono">
            S/ {cargando ? "..." : metricas?.ingresos_totales.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Taquilla + Dulcería</span>
        </div>

        {/* KPI 2: Entradas Vendidas */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tickets Vendidos</span>
            <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center text-sm">
              <i className="fa-solid fa-ticket"></i>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono">
            {cargando ? "..." : metricas?.entradas_vendidas}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Butacas confirmadas</span>
        </div>

        {/* KPI 3: Dulcería */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dulcería</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm">
              <i className="fa-solid fa-bowl-food"></i>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono">
            S/ {cargando ? "..." : metricas?.ingresos_dulceria.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Combos y snacks</span>
        </div>

        {/* KPI 4: Ocupación Promedio */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ocupación Media</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-brand-blue flex items-center justify-center text-sm">
              <i className="fa-solid fa-chair"></i>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono">
            {cargando ? "..." : `${metricas?.ocupacion_promedio_pct}%`}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Aforo utilizado</span>
        </div>

        {/* KPI 5: Transacciones */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Transacciones</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm">
              <i className="fa-solid fa-receipt"></i>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono">
            {cargando ? "..." : metricas?.total_transacciones}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Órdenes completadas</span>
        </div>
      </div>

      {/* Grilla: Top Películas y Rendimiento de Salas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Películas */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <i className="fa-solid fa-clapperboard text-brand-yellow"></i>
              <span>Top Películas en la Sede</span>
            </h3>
            <span className="text-xs text-slate-400">Por entradas vendidas</span>
          </div>

          {cargando ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-12 bg-white/5 rounded-xl"></div>
              <div className="h-12 bg-white/5 rounded-xl"></div>
              <div className="h-12 bg-white/5 rounded-xl"></div>
            </div>
          ) : !metricas?.top_peliculas.length ? (
            <p className="text-sm text-slate-500 italic py-6 text-center">No hay registros de ventas en este periodo.</p>
          ) : (
            <div className="space-y-2.5">
              {metricas.top_peliculas.map((p, idx) => (
                <div
                  key={p.id_pelicula}
                  className="flex items-center gap-3.5 p-2.5 bg-dark-800 border border-white/5 rounded-xl"
                >
                  <span className="w-6 text-center font-bold text-slate-500 text-sm">#{idx + 1}</span>
                  <img
                    src={p.url_poster}
                    alt={p.titulo}
                    className="w-10 h-14 object-cover rounded-md bg-dark-950 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/posters/poster1.png";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-sm truncate">{p.titulo}</h4>
                    <span className="text-xs text-slate-400">{p.entradas_vendidas} entradas vendidas</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-sm text-brand-yellow font-mono">
                      S/ {p.recaudacion.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rendimiento por Sala (Acordeón Jerárquico: Sala -> Fechas -> Funciones) */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <i className="fa-solid fa-table-cells-large text-brand-blue"></i>
              <span>Rendimiento por Sala</span>
            </h3>
            {/* Leyenda Visual de Estados */}
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                <span>Buen estado</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
                <span>Mantenimiento</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-blue inline-block"></span>
                <span>Accesible</span>
              </span>
            </div>
          </div>

          {cargando ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-14 bg-white/5 rounded-xl"></div>
              <div className="h-14 bg-white/5 rounded-xl"></div>
              <div className="h-14 bg-white/5 rounded-xl"></div>
            </div>
          ) : !metricas?.rendimiento_salas_detalle?.length ? (
            <p className="text-sm text-slate-500 italic py-6 text-center">No hay salas disponibles en la sede.</p>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {metricas.rendimiento_salas_detalle.map((sala) => {
                const estaExpandida = salasExpandidas.has(sala.id_sala);

                return (
                  <div
                    key={sala.id_sala}
                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                      estaExpandida
                        ? "bg-[#0c1527] border-brand-blue/60 shadow-lg shadow-sky-500/10"
                        : "bg-dark-800/80 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {/* Cabecera de Sala (Nivel 1) */}
                    <div
                      onClick={() => toggleSala(sala.id_sala)}
                      className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <i
                          className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-200 ${
                            estaExpandida ? "rotate-180 text-brand-blue" : ""
                          }`}
                        ></i>
                        <span className="font-bold text-white text-sm">{sala.nombre_sala}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 font-bold">
                          {sala.formatos_str}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Capacidad Total */}
                        <span className="text-xs text-slate-300 font-mono font-semibold">
                          {sala.capacidad_total} asit.
                        </span>

                        {/* Badges de Estados de Butacas */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 font-mono"
                            title="Butacas en Buen Estado"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                            {sala.asientos_buen_estado}
                          </span>

                          <span
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] font-bold text-rose-400 font-mono"
                            title="Butacas en Mantenimiento"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>
                            {sala.asientos_mantenimiento}
                          </span>

                          <span
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-[11px] font-bold text-sky-400 font-mono"
                            title="Butacas Accesibles"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
                            {sala.asientos_accesibles}
                          </span>
                        </div>

                        {/* Conteo de funciones */}
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          {sala.total_funciones} {sala.total_funciones === 1 ? "func." : "funcs."}
                        </span>
                      </div>
                    </div>

                    {/* Desglose de Fechas de la Sala (Nivel 2) */}
                    {estaExpandida && (
                      <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-white/5 bg-[#090f1d]/50">
                        {sala.fechas.length === 0 ? (
                          <p className="text-xs text-slate-500 italic py-2 text-center">
                            Sin funciones programadas en este periodo.
                          </p>
                        ) : (
                          sala.fechas.map((fecha) => {
                            const fKey = `${sala.id_sala}_${fecha.fecha}`;
                            const fechaExpandida = fechasExpandidas.has(fKey);

                            return (
                              <div key={fecha.fecha} className="space-y-1.5">
                                {/* Fila de Fecha Desplegable */}
                                <div
                                  onClick={() => toggleFecha(fKey)}
                                  className="flex items-center justify-between p-2 rounded-lg bg-dark-800/60 hover:bg-dark-800 border border-white/5 cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <i
                                      className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${
                                        fechaExpandida ? "rotate-180 text-brand-blue" : ""
                                      }`}
                                    ></i>
                                    <span className="font-bold text-xs text-slate-200 tracking-wide uppercase">
                                      {fecha.fecha_formateada}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    {fecha.total_funciones} {fecha.total_funciones === 1 ? "función" : "funciones"}
                                  </span>
                                </div>

                                {/* Funciones de la Fecha (Nivel 3) */}
                                {fechaExpandida && (
                                  <div className="space-y-2 pl-3 pt-1">
                                    {fecha.funciones.map((fn) => (
                                      <div
                                        key={fn.id_funcion}
                                        className="bg-[#070d18] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition-colors"
                                      >
                                        <div>
                                          <h4 className="font-bold text-white text-xs truncate max-w-[220px]">
                                            {fn.titulo_pelicula}
                                          </h4>
                                          <div className="mt-1">
                                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono">
                                              {fn.hora_inicio} - {fn.hora_fin}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex flex-col sm:items-end gap-1.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-white">
                                              {fn.ocupados} / {fn.capacidad}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-slate-300">
                                              {fn.formato_nombre}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold font-mono text-white">
                                              {fn.ocupacion_pct}%
                                            </span>
                                            <div className="w-24 bg-dark-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                                              <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                  fn.ocupacion_pct >= 85
                                                    ? "bg-rose-500"
                                                    : fn.ocupacion_pct >= 50
                                                    ? "bg-amber-500"
                                                    : "bg-emerald-500"
                                                }`}
                                                style={{ width: `${Math.max(4, fn.ocupacion_pct)}%` }}
                                              ></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tabla: Últimas Ventas en Tiempo Real */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-emerald-400"></i>
            <span>Últimas Transacciones Registradas</span>
          </h3>
          <button
            type="button"
            onClick={cargarMetricas}
            className="text-xs text-brand-blue hover:underline flex items-center gap-1.5"
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            <span>Actualizar</span>
          </button>
        </div>

        {cargando ? (
          <div className="h-28 bg-white/5 rounded-xl animate-pulse"></div>
        ) : !metricas?.ultimas_ventas.length ? (
          <p className="text-sm text-slate-500 italic py-6 text-center">Sin transacciones recientes en el periodo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-800 text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Canal</th>
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metricas.ultimas_ventas.map((v) => (
                  <tr key={v.id_orden} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{v.codigo_orden}</td>
                    <td className="py-2.5 px-3 text-slate-300 truncate max-w-[150px]">{v.cliente}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300">
                        {v.canal}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(v.fecha_creacion).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-yellow">
                      S/ {v.total.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.estado === "PAGADA" || v.estado === "Completada"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : v.estado === "Contingencia"
                            ? "bg-yellow-500/10 text-brand-yellow"
                            : "bg-white/5 text-slate-400"
                        }`}
                      >
                        {v.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
