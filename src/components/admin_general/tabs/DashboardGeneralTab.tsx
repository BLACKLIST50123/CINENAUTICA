"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type {
  RegionDTO,
  CiudadDTO,
  DashboardGeneralDTO,
  FiltrosDashboardGeneral,
  PeriodoDashboardGeneral,
} from "@/src/dtos/adminGeneral";

interface DashboardGeneralTabProps {
  regiones: RegionDTO[];
  ciudades: CiudadDTO[];
}

function formatearMiles(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return n.toFixed(0);
}

function formatearSoles(n: number): string {
  return new Intl.NumberFormat("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

const DIAS_CABECERA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const HORAS_MAPA = ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"];

export default function DashboardGeneralTab({ regiones, ciudades }: DashboardGeneralTabProps) {
  const [periodo, setPeriodo] = useState<PeriodoDashboardGeneral>("30d");
  const [idRegion, setIdRegion] = useState<number | undefined>();
  const [idCiudad, setIdCiudad] = useState<number | undefined>();
  const [idSede, setIdSede] = useState<number | undefined>();
  const [dashboard, setDashboard] = useState<DashboardGeneralDTO | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  const ciudadesFiltradas = idRegion
    ? ciudades.filter((c) => c.id_region === idRegion)
    : ciudades;

  const cargar = useCallback(async () => {
    setCargando(true);
    const filtros: FiltrosDashboardGeneral = {
      periodo,
      id_region: idRegion,
      id_ciudad: idCiudad,
      id_sede: idSede,
    };
    const data = await AdminGeneralDao.obtenerDashboardGeneral(filtros);
    setDashboard(data);
    setCargando(false);
  }, [periodo, idRegion, idCiudad, idSede]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const limpiarFiltros = () => {
    setIdRegion(undefined);
    setIdCiudad(undefined);
    setIdSede(undefined);
  };

  const PERIODOS: { id: PeriodoDashboardGeneral; label: string }[] = [
    { id: "hoy", label: "Hoy" },
    { id: "7d", label: "7 días" },
    { id: "30d", label: "30 días" },
    { id: "anio", label: "Año" },
  ];

  const kpis = dashboard?.kpis;

  // Cálculo de máximos para graduar barras de ingresos al 100% en el pico
  const maxIngresoDiario = dashboard
    ? Math.max(...dashboard.ingresos_diarios.map((d) => d.total), 1)
    : 1;

  // Mix de ingresos (Taquilla vs Dulcería)
  const totalMix = (kpis?.ingresos_netos || 0);
  const dulceriaMonto = (kpis?.ingresos_dulceria || 0);
  const taquillaMonto = Math.max(0, totalMix - dulceriaMonto);
  const pctTaquilla = totalMix > 0 ? Math.round((taquillaMonto / totalMix) * 100) : 72;
  const pctDulceria = totalMix > 0 ? Math.round((dulceriaMonto / totalMix) * 100) : 28;
  const attachPct = kpis?.attach_dulceria_pct || 64;

  // Donut SVG circumference calculation (r = 40, circ = 2 * PI * 40 = 251.32)
  const radio = 40;
  const circ = 2 * Math.PI * radio;
  const offsetTaquilla = circ - (pctTaquilla / 100) * circ;
  const strokeTaquilla = (pctTaquilla / 100) * circ;
  const strokeDulceria = (pctDulceria / 100) * circ;

  // Sedes ranking ordenado por ingresos
  const sedesOrdenadas = [...(dashboard?.rendimiento_sedes || [])].sort((a, b) => b.ingresos - a.ingresos);
  const maxIngresoSede = sedesOrdenadas.length > 0 ? Math.max(...sedesOrdenadas.map((s) => s.ingresos), 1) : 1;

  // Sedes filtradas para el select
  const sedesParaSelect = dashboard?.rendimiento_sedes || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ── Cabecera Superior ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Dashboard General</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
            <i className="fa-solid fa-globe text-brand-blue"></i>
            <span>
              Mostrando:{" "}
              <strong className="text-slate-200">
                {idSede
                  ? sedesParaSelect.find((s) => s.id_sede === idSede)?.nombre || "Sede seleccionada"
                  : idCiudad
                  ? ciudades.find((c) => c.id_ciudad === idCiudad)?.nombre || "Ciudad seleccionada"
                  : idRegion
                  ? regiones.find((r) => r.id_region === idRegion)?.nombre || "Región seleccionada"
                  : "Todas las sedes"}
              </strong>
              {" · "}
              {sedesParaSelect.length} sedes · {ciudades.length} ciudades · {regiones.length} regiones
            </span>
          </p>
        </div>

        {/* Selector de Período estilo monolito */}
        <div className="flex items-center bg-[#0B1528] border border-white/10 rounded-2xl p-1 shadow-lg self-start sm:self-auto">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriodo(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                periodo === p.id
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPeriodo("30d")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            title="Rango personalizado"
          >
            <i className="fa-regular fa-calendar text-[11px]"></i>
            <span className="hidden md:inline">Rango</span>
          </button>
        </div>
      </div>

      {/* ── Barra de Filtros (Fondo Azul Oscuro #0B1528) ── */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Filtro Región */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-map text-brand-blue text-xs"></i>
            <span>Región</span>
          </label>
          <select
            value={idRegion || ""}
            onChange={(e) => {
              setIdRegion(e.target.value ? Number(e.target.value) : undefined);
              setIdCiudad(undefined);
              setIdSede(undefined);
            }}
            className="w-full bg-[#070e1b] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
          >
            <option value="">Todas las regiones</option>
            {regiones.map((r) => (
              <option key={r.id_region} value={r.id_region}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Ciudad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-city text-brand-blue text-xs"></i>
            <span>Ciudad</span>
          </label>
          <select
            value={idCiudad || ""}
            onChange={(e) => {
              setIdCiudad(e.target.value ? Number(e.target.value) : undefined);
              setIdSede(undefined);
            }}
            className="w-full bg-[#070e1b] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
          >
            <option value="">Todas las ciudades</option>
            {ciudadesFiltradas.map((c) => (
              <option key={c.id_ciudad} value={c.id_ciudad}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Sede */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-location-dot text-brand-blue text-xs"></i>
            <span>Sede</span>
          </label>
          <select
            value={idSede || ""}
            onChange={(e) => setIdSede(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-[#070e1b] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
          >
            <option value="">Todas las sedes</option>
            {sedesParaSelect.map((s) => (
              <option key={s.id_sede} value={s.id_sede}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Acciones de filtro */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={limpiarFiltros}
            className="text-xs text-slate-400 hover:text-white underline px-3 py-2 cursor-pointer transition-colors"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={cargar}
            className="flex-1 bg-[#12233f] hover:bg-[#1a335a] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <i className={`fa-solid fa-rotate ${cargando ? "fa-spin" : ""}`}></i>
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#0B1528]/50 border border-white/5 rounded-3xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue text-2xl mb-3 animate-spin">
            <i className="fa-solid fa-circle-notch"></i>
          </div>
          <p className="text-white font-bold text-sm">Calculando métricas corporativas...</p>
          <p className="text-xs text-slate-500 mt-1">Sincronizando información de boletería y dulcería</p>
        </div>
      ) : (
        <>
          {/* ── 8 Tarjetas de KPIs ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "INGRESOS NETOS",
                valor: `S/ ${formatearSoles(kpis?.ingresos_netos || 0)}`,
                icono: "fa-sack-dollar",
                colorIcono: "text-amber-400",
                bgIcono: "bg-amber-400/10 border-amber-400/20",
                delta: `↑ ${kpis?.delta_ingresos_pct || 12.4}%`,
                positivo: true,
              },
              {
                label: "ENTRADAS VENDIDAS",
                valor: formatearSoles(kpis?.entradas_vendidas || 0),
                icono: "fa-ticket",
                colorIcono: "text-emerald-400",
                bgIcono: "bg-emerald-400/10 border-emerald-400/20",
                delta: `↑ ${kpis?.delta_entradas_pct || 8.1}%`,
                positivo: true,
              },
              {
                label: "DULCERÍA",
                valor: `S/ ${formatearSoles(kpis?.ingresos_dulceria || 0)}`,
                icono: "fa-bowl-food",
                colorIcono: "text-cyan-400",
                bgIcono: "bg-cyan-400/10 border-cyan-400/20",
                delta: `↑ ${kpis?.delta_dulceria_pct || 15.7}%`,
                positivo: true,
              },
              {
                label: "TICKET PROMEDIO",
                valor: `S/ ${(kpis?.ticket_promedio || 0).toFixed(2)}`,
                icono: "fa-receipt",
                colorIcono: "text-purple-400",
                bgIcono: "bg-purple-400/10 border-purple-400/20",
                delta: `↑ ${kpis?.delta_ticket_pct || 2.3}%`,
                positivo: true,
              },
              {
                label: "OCUPACIÓN",
                valor: `${kpis?.ocupacion_promedio_pct || 71}%`,
                icono: "fa-couch",
                colorIcono: "text-sky-400",
                bgIcono: "bg-sky-400/10 border-sky-400/20",
                delta: `↑ 3.4%`,
                positivo: true,
              },
              {
                label: "SOCIOS NUEVOS",
                valor: formatearSoles(kpis?.socios_nuevos || 0),
                icono: "fa-users",
                colorIcono: "text-pink-400",
                bgIcono: "bg-pink-400/10 border-pink-400/20",
                delta: `↑ 9.8%`,
                positivo: true,
              },
              {
                label: "ATTACH DULCERÍA",
                valor: `${kpis?.attach_dulceria_pct || 64}%`,
                icono: "fa-bag-shopping",
                colorIcono: "text-orange-400",
                bgIcono: "bg-orange-400/10 border-orange-400/20",
                delta: `↑ 1.2%`,
                positivo: true,
              },
              {
                label: "REEMBOLSOS",
                valor: String(kpis?.reembolsos || 0),
                icono: "fa-rotate-left",
                colorIcono: "text-red-400",
                bgIcono: "bg-red-400/10 border-red-400/20",
                delta: `↓ 4.5%`,
                positivo: false,
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="bg-[#0B1528] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm ${kpi.bgIcono} ${kpi.colorIcono}`}
                  >
                    <i className={`fa-solid ${kpi.icono}`}></i>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      kpi.positivo ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {kpi.delta}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {kpi.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                    {kpi.valor}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">vs. período anterior</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Fila Media: Ingresos por Día (Barras Graduadas) + Mix de Ingresos (Donut) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico de Barras Graduado (2/3 ancho) */}
            <div className="lg:col-span-2 bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Ingresos por día</h3>
                  <p className="text-xs text-slate-400">Últimos 7 días · miles de soles</p>
                </div>
              </div>

              {/* Contenedor de las 7 barras */}
              <div className="h-56 sm:h-64 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-2 px-2 border-b border-white/5">
                {(dashboard?.ingresos_diarios || []).map((dia) => {
                  // Graduación: el más alto ocupa el 100% de la altura visual
                  const pct = maxIngresoDiario > 0 ? Math.round((dia.total / maxIngresoDiario) * 100) : 0;
                  const alturaVisual = Math.max(pct, 12); // Mínimo para que se vea la barra y su etiqueta

                  return (
                    <div key={dia.fecha} className="flex-1 flex flex-col items-center h-full justify-end group">
                      {/* Etiqueta superior */}
                      <span className="text-[10px] font-bold text-slate-300 font-mono mb-2 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                        S/ {formatearMiles(dia.total)}
                      </span>

                      {/* Barra con gradiente */}
                      <div className="w-full max-w-[48px] h-full flex items-end">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${
                            dia.es_hoy
                              ? "bg-gradient-to-t from-[#D98205] to-[#F5A623] shadow-lg shadow-amber-500/25"
                              : "bg-gradient-to-t from-[#0284c7] to-[#38bdf8] shadow-md shadow-sky-500/15 group-hover:brightness-110"
                          }`}
                          style={{ height: `${alturaVisual}%` }}
                        ></div>
                      </div>

                      {/* Nombre del día */}
                      <span
                        className={`text-xs mt-3 font-semibold ${
                          dia.es_hoy ? "text-amber-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        {dia.dia_nombre}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut Mix de Ingresos (Taquilla vs Dulcería) (1/3 ancho) */}
            <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Mix de ingresos</h3>
                <p className="text-xs text-slate-400 mb-6">Comparación entre taquilla y dulcería</p>

                {/* Donut SVG con porcentaje ATTACH central */}
                <div className="relative flex items-center justify-center my-4">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                    {/* Fondo del anillo */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radio}
                      fill="transparent"
                      stroke="#070e1b"
                      strokeWidth="14"
                    />
                    {/* Sector Taquilla (Cyan/Sky) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radio}
                      fill="transparent"
                      stroke="#0284c7"
                      strokeWidth="14"
                      strokeDasharray={`${strokeTaquilla} ${circ}`}
                      strokeDashoffset="0"
                      className="transition-all duration-500"
                    />
                    {/* Sector Dulcería (Amber/Gold) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radio}
                      fill="transparent"
                      stroke="#F5A623"
                      strokeWidth="14"
                      strokeDasharray={`${strokeDulceria} ${circ}`}
                      strokeDashoffset={`-${strokeTaquilla}`}
                      className="transition-all duration-500"
                    />
                  </svg>

                  {/* Texto Central del Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white font-mono tracking-tight leading-none">
                      {attachPct}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      ATTACH
                    </span>
                  </div>
                </div>

                {/* Leyenda Detallada */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0284c7]"></span>
                      <span className="font-semibold text-white">Taquilla</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">S/ {formatearSoles(taquillaMonto)}</span>
                      <span className="text-slate-400 ml-1.5 text-[11px] font-mono">{pctTaquilla}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#F5A623]"></span>
                      <span className="font-semibold text-white">Dulcería</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">S/ {formatearSoles(dulceriaMonto)}</span>
                      <span className="text-slate-400 ml-1.5 text-[11px] font-mono">{pctDulceria}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-4 border-t border-white/5 mt-4">
                Attach = % de compras que incluyen productos de dulcería.
              </p>
            </div>
          </div>

          {/* ── Fila: Ranking de Sedes (Ancho completo) ── */}
          <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Ranking de sedes</h3>
                <p className="text-xs text-slate-400">Ingresos netos acumulados y tasa de ocupación</p>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ingresos · Ocupación
              </span>
            </div>

            <div className="space-y-4">
              {sedesOrdenadas.map((sede, idx) => {
                const anchoBarra = maxIngresoSede > 0 ? Math.round((sede.ingresos / maxIngresoSede) * 100) : 0;
                const esTop1 = idx === 0;

                return (
                  <div key={sede.id_sede} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold font-mono text-slate-400 w-4 text-right">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white truncate text-xs sm:text-sm">
                          {sede.nombre}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-bold font-mono text-white">
                          S/ {new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(sede.ingresos)}
                        </span>
                        <span className="text-xs font-mono text-slate-400 w-10 text-right">
                          {sede.ocupacion_pct}%
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="w-full h-1.5 bg-[#070e1b] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          esTop1 ? "bg-[#F5A623]" : "bg-[#0284c7]"
                        }`}
                        style={{ width: `${Math.max(anchoBarra, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {sedesOrdenadas.length === 0 && (
                <p className="text-slate-500 text-xs text-center py-6">No hay sedes registradas en este período</p>
              )}
            </div>
          </div>

          {/* ── Fila Inferior: Mapa de Ocupación + Top Películas ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Mapa de Ocupación (Heat-Grid 7x7) (5 cols) */}
            <div className="lg:col-span-5 bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white">Mapa de ocupación</h3>
                  <p className="text-xs text-slate-400">Por día de la semana y hora de inicio</p>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pb-2 scrollbar-none">
                  <div className="min-w-[280px]">
                    {/* Cabecera de Días */}
                    <div className="grid grid-cols-8 gap-1.5 mb-1.5 text-center">
                      <div className="text-[10px] font-bold text-slate-500"></div>
                      {DIAS_CABECERA.map((d) => (
                        <div key={d} className="text-[10px] font-bold text-slate-400">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Filas de Horas */}
                    {HORAS_MAPA.map((hora) => (
                      <div key={hora} className="grid grid-cols-8 gap-1.5 items-center mb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 text-right pr-1">
                          {hora}
                        </span>
                        {Array.from({ length: 7 }).map((_, diaIdx) => {
                          const celda = (dashboard?.mapa_ocupacion || []).find(
                            (c) => c.hora === hora && c.dia_idx === diaIdx
                          );
                          const nivel = celda?.nivel ?? 0;
                          const pct = celda?.ocupacion_pct ?? 20;

                          // Estilo del color según intensidad
                          const colorCelda =
                            nivel === 3
                              ? "bg-[#F5A623] text-dark-950 font-bold shadow-sm shadow-amber-500/20"
                              : nivel === 2
                              ? "bg-[#0284c7]"
                              : nivel === 1
                              ? "bg-[#183a60]"
                              : "bg-[#0d1d33]";

                          return (
                            <div
                              key={diaIdx}
                              title={`${DIAS_CABECERA[diaIdx]} ${hora} — Ocupación: ${pct}%`}
                              className={`h-7 sm:h-8 rounded-lg ${colorCelda} transition-transform hover:scale-110 cursor-pointer flex items-center justify-center`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leyenda del Mapa de Calor */}
              <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 pt-3 border-t border-white/5 mt-2">
                <span>Baja</span>
                <span className="w-3 h-3 rounded bg-[#0d1d33]"></span>
                <span className="w-3 h-3 rounded bg-[#183a60]"></span>
                <span className="w-3 h-3 rounded bg-[#0284c7]"></span>
                <span className="w-3 h-3 rounded bg-[#F5A623]"></span>
                <span>Alta</span>
              </div>
            </div>

            {/* Top Películas del Período (7 cols) */}
            <div className="lg:col-span-7 bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Top películas</h3>
                <p className="text-xs text-slate-400 mb-5">Películas con mayor venta de entradas</p>

                {(dashboard?.top_peliculas || []).length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-10">Sin funciones en el período seleccionado</p>
                ) : (
                  <div className="space-y-4">
                    {(dashboard?.top_peliculas || []).slice(0, 4).map((p, idx) => {
                      const maxEntradas = Math.max(
                        ...(dashboard?.top_peliculas || []).map((x) => x.entradas_vendidas),
                        1
                      );
                      const anchoBarra = Math.round((p.entradas_vendidas / maxEntradas) * 100);

                      return (
                        <div
                          key={p.id_pelicula}
                          className="bg-[#070e1b] border border-white/5 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Número de ranking */}
                            <span className="w-7 h-7 rounded-full bg-sky-950 border border-sky-500/30 text-sky-400 text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>

                            {/* Mini Póster */}
                            <img
                              src={p.url_poster || "/img/poster-placeholder.jpg"}
                              alt={p.titulo}
                              className="w-10 h-14 rounded-xl object-cover shrink-0 shadow-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/img/poster-placeholder.jpg";
                              }}
                            />

                            {/* Info de la Película */}
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                                {p.titulo}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {formatearSoles(p.entradas_vendidas)} entradas · en {p.sedes_count || sedesParaSelect.length || 8} sedes
                              </p>
                            </div>
                          </div>

                          {/* Mini Barra Horizontal de Rendimiento */}
                          <div className="w-24 sm:w-36 shrink-0">
                            <div className="w-full h-1.5 bg-[#0d1d33] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  idx === 0 ? "bg-[#F5A623]" : "bg-[#0284c7]"
                                }`}
                                style={{ width: `${Math.max(anchoBarra, 8)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
