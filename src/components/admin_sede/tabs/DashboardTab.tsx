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

  const cargarMetricas = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerMetricasDashboard(idSede, periodo);
    setMetricas(data);
    setCargando(false);
  }, [idSede, periodo]);

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

        {/* Rendimiento por Sala */}
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <i className="fa-solid fa-door-open text-brand-blue"></i>
              <span>Rendimiento por Sala</span>
            </h3>
            <span className="text-xs text-slate-400">Ocupación y funciones</span>
          </div>

          {cargando ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-12 bg-white/5 rounded-xl"></div>
              <div className="h-12 bg-white/5 rounded-xl"></div>
            </div>
          ) : !metricas?.rendimiento_salas.length ? (
            <p className="text-sm text-slate-500 italic py-6 text-center">No hay funciones registradas en este periodo.</p>
          ) : (
            <div className="space-y-3">
              {metricas.rendimiento_salas.map((s) => (
                <div key={s.id_sala} className="p-3 bg-dark-800 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-white">{s.nombre_sala}</span>
                    <span className="text-xs text-slate-400 font-mono">{s.funciones_count} funciones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-dark-950 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className="bg-brand-blue h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, s.ocupacion_pct)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-brand-yellow font-mono w-10 text-right">
                      {s.ocupacion_pct}%
                    </span>
                  </div>
                </div>
              ))}
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
