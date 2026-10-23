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

export default function DashboardGeneralTab({ regiones, ciudades }: DashboardGeneralTabProps) {
  const [periodo, setPeriodo] = useState<PeriodoDashboardGeneral>("30d");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [mostrarPopoverRango, setMostrarPopoverRango] = useState<boolean>(false);

  // Navegación de mes para el mini-calendario del popover
  const [mesCal, setMesCal] = useState<number>(() => new Date().getMonth());
  const [anioCal, setAnioCal] = useState<number>(() => new Date().getFullYear());

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
      fecha_inicio: periodo === "personalizado" ? fechaInicio : undefined,
      fecha_fin: periodo === "personalizado" ? fechaFin : undefined,
      id_region: idRegion,
      id_ciudad: idCiudad,
      id_sede: idSede,
    };
    const data = await AdminGeneralDao.obtenerDashboardGeneral(filtros);
    setDashboard(data);
    setCargando(false);
  }, [periodo, fechaInicio, fechaFin, idRegion, idCiudad, idSede]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const limpiarFiltros = () => {
    setIdRegion(undefined);
    setIdCiudad(undefined);
    setIdSede(undefined);
    setPeriodo("30d");
    setFechaInicio("");
    setFechaFin("");
    setMostrarPopoverRango(false);
  };

  const PERIODOS: { id: PeriodoDashboardGeneral; label: string }[] = [
    { id: "hoy", label: "Hoy" },
    { id: "7d", label: "7 días" },
    { id: "30d", label: "30 días" },
    { id: "anio", label: "Año" },
  ];

  // Métodos de selección del Date Range Picker
  const clickDiaCalendario = (diaIso: string) => {
    if (!fechaInicio || (fechaInicio && fechaFin)) {
      setFechaInicio(diaIso);
      setFechaFin("");
    } else {
      if (diaIso >= fechaInicio) {
        setFechaFin(diaIso);
      } else {
        setFechaFin(fechaInicio);
        setFechaInicio(diaIso);
      }
    }
  };

  const aplicarRangoPersonalizado = () => {
    if (fechaInicio && fechaFin) {
      setPeriodo("personalizado");
      setMostrarPopoverRango(false);
    }
  };

  const aplicarPresetRango = (dias: number) => {
    const finD = new Date();
    const iniD = new Date(finD.getTime() - dias * 24 * 60 * 60 * 1000);
    const fStr = `${finD.getFullYear()}-${String(finD.getMonth() + 1).padStart(2, "0")}-${String(finD.getDate()).padStart(2, "0")}`;
    const iStr = `${iniD.getFullYear()}-${String(iniD.getMonth() + 1).padStart(2, "0")}-${String(iniD.getDate()).padStart(2, "0")}`;
    setFechaInicio(iStr);
    setFechaFin(fStr);
  };

  const aplicarMesActualPreset = () => {
    const d = new Date();
    const iStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    const fStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setFechaInicio(iStr);
    setFechaFin(fStr);
  };

  // Generador de días para el mes visible en el popover
  const diasMesCal = (() => {
    const primerDia = new Date(anioCal, mesCal, 1);
    const ultimoDia = new Date(anioCal, mesCal + 1, 0);
    const dias = [];
    // Ajuste para lunes primer día (0=Dom -> 6, 1=Lun -> 0)
    const diaSemanaPrimer = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;
    for (let i = 0; i < diaSemanaPrimer; i++) {
      dias.push(null);
    }
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fechaIso = `${anioCal}-${String(mesCal + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      dias.push(fechaIso);
    }
    return dias;
  })();

  const NOMBRES_MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const kpis = dashboard?.kpis;

  // Totales de barras de ingresos
  const ingresosDiariosList = dashboard?.ingresos_diarios || [];
  const maxIngresoDiario = Math.max(...ingresosDiariosList.map((d) => d.total), 1);
  const totalIngresosDias = ingresosDiariosList.reduce((acc, d) => acc + d.total, 0);
  const promedioIngresosDias = ingresosDiariosList.length > 0 ? totalIngresosDias / ingresosDiariosList.length : 0;

  // Mix de ingresos
  const totalMix = kpis?.ingresos_netos || 0;
  const dulceriaMonto = kpis?.ingresos_dulceria || 0;
  const taquillaMonto = Math.max(0, totalMix - dulceriaMonto);
  const pctTaquilla = totalMix > 0 ? Math.round((taquillaMonto / totalMix) * 100) : 0;
  const pctDulceria = totalMix > 0 ? Math.round((dulceriaMonto / totalMix) * 100) : 0;
  const attachPct = kpis?.attach_dulceria_pct ?? 0;

  const radio = 40;
  const circ = 2 * Math.PI * radio;
  const strokeTaquilla = totalMix > 0 ? (pctTaquilla / 100) * circ : 0;
  const strokeDulceria = totalMix > 0 ? (pctDulceria / 100) * circ : 0;

  // Ranking de sedes ordenado por ingresos
  const sedesOrdenadas = [...(dashboard?.rendimiento_sedes || [])].sort((a, b) => b.ingresos - a.ingresos);
  const totalRedIngresos = sedesOrdenadas.reduce((sum, s) => sum + s.ingresos, 0);

  // Sedes para el select
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

        {/* Selector de Período con Date Range Picker Popover */}
        <div className="relative self-start sm:self-auto">
          <div className="flex items-center bg-[#0B1528] border border-white/10 rounded-2xl p-1 shadow-lg">
            {PERIODOS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPeriodo(p.id);
                  setMostrarPopoverRango(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  periodo === p.id
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {p.label}
              </button>
            ))}

            {/* Botón de Rango */}
            {periodo === "personalizado" && fechaInicio && fechaFin ? (
              <div className="flex items-center gap-1.5 bg-sky-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-sky-500/25">
                <i className="fa-regular fa-calendar text-[11px]"></i>
                <span>
                  {fechaInicio.slice(5)} a {fechaFin.slice(5)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPeriodo("30d");
                    setFechaInicio("");
                    setFechaFin("");
                  }}
                  className="hover:text-red-200 ml-1 cursor-pointer"
                  title="Restablecer período"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMostrarPopoverRango(!mostrarPopoverRango)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mostrarPopoverRango
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Seleccionar rango de fechas"
              >
                <i className="fa-regular fa-calendar text-[11px]"></i>
                <span className="hidden md:inline">Rango</span>
              </button>
            )}
          </div>

          {/* ── Popover Desplegable: Date Range Picker Interactivo ── */}
          {mostrarPopoverRango && (
            <div className="absolute right-0 top-12 z-50 bg-[#0B1528] border border-white/15 rounded-2xl p-4 shadow-2xl w-80 sm:w-96 animate-fadeIn text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar-days text-sky-400 text-sm"></i>
                  <span className="text-xs font-bold">Rango Personalizado</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (mesCal === 0) {
                        setMesCal(11);
                        setAnioCal(anioCal - 1);
                      } else {
                        setMesCal(mesCal - 1);
                      }
                    }}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-slate-300 cursor-pointer"
                  >
                    <i className="fa-solid fa-chevron-left text-[10px]"></i>
                  </button>
                  <span className="text-xs font-bold font-mono px-2">
                    {NOMBRES_MESES[mesCal]} {anioCal}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (mesCal === 11) {
                        setMesCal(0);
                        setAnioCal(anioCal + 1);
                      } else {
                        setMesCal(mesCal + 1);
                      }
                    }}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-slate-300 cursor-pointer"
                  >
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  </button>
                </div>
              </div>

              {/* Atajos Rápidos */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => aplicarPresetRango(7)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer transition-colors"
                >
                  Últimos 7d
                </button>
                <button
                  type="button"
                  onClick={() => aplicarPresetRango(14)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer transition-colors"
                >
                  Últimos 14d
                </button>
                <button
                  type="button"
                  onClick={() => aplicarPresetRango(30)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer transition-colors"
                >
                  Últimos 30d
                </button>
                <button
                  type="button"
                  onClick={aplicarMesActualPreset}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer transition-colors"
                >
                  Este Mes
                </button>
              </div>

              {/* Cabecera Días Semana */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
                  <span key={d} className="text-[10px] font-bold text-slate-500">
                    {d}
                  </span>
                ))}
              </div>

              {/* Grilla Días del Mes */}
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {diasMesCal.map((diaIso, idx) => {
                  if (!diaIso) {
                    return <div key={`empty-${idx}`} className="h-8"></div>;
                  }
                  const diaNum = parseInt(diaIso.split("-")[2], 10);
                  const esInicio = fechaInicio === diaIso;
                  const esFin = fechaFin === diaIso;
                  const estaEnRango =
                    fechaInicio && fechaFin && diaIso > fechaInicio && diaIso < fechaFin;

                  let claseDia = "text-slate-300 hover:bg-white/10";
                  if (esInicio || esFin) {
                    claseDia = "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/25";
                  } else if (estaEnRango) {
                    claseDia = "bg-sky-500/20 text-sky-200 font-semibold";
                  }

                  return (
                    <button
                      key={diaIso}
                      type="button"
                      onClick={() => clickDiaCalendario(diaIso)}
                      className={`h-8 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${claseDia}`}
                    >
                      {diaNum}
                    </button>
                  );
                })}
              </div>

              {/* Inputs Resumen y Botones de Acción */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Rango seleccionado:</span>
                  <span className="font-mono text-white text-[11px] font-bold truncate block">
                    {fechaInicio || "—"} {fechaFin ? `al ${fechaFin}` : "(selecciona fin)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMostrarPopoverRango(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!fechaInicio || !fechaFin}
                    onClick={aplicarRangoPersonalizado}
                    className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Barra de Filtros ── */}
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
          <p className="text-xs text-slate-500 mt-1">Consultando registros reales en Supabase</p>
        </div>
      ) : (
        <>
          {/* ── 8 Tarjetas de KPIs (Datos 100% Reales y Deltas Calculados) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "INGRESOS NETOS",
                valor: `S/ ${formatearSoles(kpis?.ingresos_netos ?? 0)}`,
                icono: "fa-sack-dollar",
                colorIcono: "text-amber-400",
                bgIcono: "bg-amber-400/10 border-amber-400/20",
                delta: kpis?.delta_ingresos_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "ENTRADAS VENDIDAS",
                valor: formatearSoles(kpis?.entradas_vendidas ?? 0),
                icono: "fa-ticket",
                colorIcono: "text-emerald-400",
                bgIcono: "bg-emerald-400/10 border-emerald-400/20",
                delta: kpis?.delta_entradas_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "DULCERÍA",
                valor: `S/ ${formatearSoles(kpis?.ingresos_dulceria ?? 0)}`,
                icono: "fa-bowl-food",
                colorIcono: "text-cyan-400",
                bgIcono: "bg-cyan-400/10 border-cyan-400/20",
                delta: kpis?.delta_dulceria_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "TICKET PROMEDIO",
                valor: `S/ ${(kpis?.ticket_promedio ?? 0).toFixed(2)}`,
                icono: "fa-receipt",
                colorIcono: "text-purple-400",
                bgIcono: "bg-purple-400/10 border-purple-400/20",
                delta: kpis?.delta_ticket_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "OCUPACIÓN",
                valor: `${kpis?.ocupacion_promedio_pct ?? 0}%`,
                icono: "fa-couch",
                colorIcono: "text-sky-400",
                bgIcono: "bg-sky-400/10 border-sky-400/20",
                delta: kpis?.delta_ocupacion_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "SOCIOS NUEVOS",
                valor: formatearSoles(kpis?.socios_nuevos ?? 0),
                icono: "fa-users",
                colorIcono: "text-pink-400",
                bgIcono: "bg-pink-400/10 border-pink-400/20",
                delta: kpis?.delta_socios_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "ATTACH DULCERÍA",
                valor: `${kpis?.attach_dulceria_pct ?? 0}%`,
                icono: "fa-bag-shopping",
                colorIcono: "text-orange-400",
                bgIcono: "bg-orange-400/10 border-orange-400/20",
                delta: kpis?.delta_attach_pct ?? 0,
                invertirColor: false,
              },
              {
                label: "REEMBOLSOS",
                valor: String(kpis?.reembolsos ?? 0),
                icono: "fa-rotate-left",
                colorIcono: "text-red-400",
                bgIcono: "bg-red-400/10 border-red-400/20",
                delta: kpis?.delta_reembolsos_pct ?? 0,
                invertirColor: true, // Menor es mejor para reembolsos
              },
            ].map((kpi) => {
              const deltaNum = kpi.delta;
              const esVerde = kpi.invertirColor ? deltaNum <= 0 : deltaNum >= 0;
              const deltaStr = `${deltaNum >= 0 ? "↑" : "↓"} ${Math.abs(deltaNum)}%`;

              return (
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
                        esVerde ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {deltaStr}
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
              );
            })}
          </div>

          {/* ── Fila Media: Ingresos por Día (Barras) + Mix de Ingresos (Donut) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico de Barras Graduado (2/3 ancho) con totales */}
            <div className="lg:col-span-2 bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Ingresos por día</h3>
                  <p className="text-xs text-slate-400">Distribución diaria de facturación en el período</p>
                </div>
                <div className="text-right self-start sm:self-auto">
                  <span className="text-xs font-mono font-bold text-sky-400 block">
                    Total: S/ {formatearSoles(totalIngresosDias)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Promedio: S/ {formatearSoles(promedioIngresosDias)}/día
                  </span>
                </div>
              </div>

              {/* Contenedor de las barras */}
              <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-white/5">
                {ingresosDiariosList.map((dia) => {
                  const pct = maxIngresoDiario > 0 ? Math.round((dia.total / maxIngresoDiario) * 100) : 0;
                  const alturaVisual = Math.max(pct, dia.total > 0 ? 8 : 4);

                  return (
                    <div
                      key={dia.fecha}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative"
                      title={`${dia.dia_nombre} ${dia.fecha}: S/ ${formatearSoles(dia.total)}`}
                    >
                      {/* Etiqueta superior */}
                      <span className="text-[10px] font-bold text-slate-300 font-mono mb-2 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                        S/ {formatearMiles(dia.total)}
                      </span>

                      {/* Barra con gradiente */}
                      <div className="w-full max-w-[44px] h-full flex items-end">
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

            {/* Donut Mix de Ingresos con Total y % ATTACH */}
            <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">Mix de ingresos</h3>
                    <p className="text-xs text-slate-400">Taquilla vs. Dulcería</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    S/ {formatearSoles(totalMix)}
                  </span>
                </div>

                {/* Donut SVG con porcentaje ATTACH central */}
                <div className="relative flex items-center justify-center my-3">
                  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radio}
                      fill="transparent"
                      stroke="#070e1b"
                      strokeWidth="14"
                    />
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
                <div className="space-y-3 mt-5">
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

              <p className="text-[11px] text-slate-500 pt-3 border-t border-white/5 mt-4">
                Attach = % de transacciones que incluyeron dulcería.
              </p>
            </div>
          </div>

          {/* ── Fila: Ranking de Sedes (Share de Ingresos Proporcional) ── */}
          <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Ranking de sedes</h3>
                <p className="text-xs text-slate-400">Cuota de facturación sobre la red y tasa de ocupación</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-amber-400 font-bold">
                  Total Red: S/ {formatearSoles(totalRedIngresos)}
                </span>
                <span className="text-slate-400 uppercase tracking-wider text-[11px]">
                  Share de Red
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {sedesOrdenadas.map((sede, idx) => {
                const esTop1 = idx === 0;

                return (
                  <div key={sede.id_sede} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold font-mono text-slate-400 w-4 text-right">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="font-semibold text-white truncate text-xs sm:text-sm block">
                            {sede.nombre}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {sede.ciudad} · Ocupación:{" "}
                            <strong className="text-slate-200">{sede.ocupacion_pct}%</strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-bold font-mono text-white">
                          S/ {new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(sede.ingresos)}
                        </span>
                        <span className="text-xs font-mono font-bold text-sky-400 w-12 text-right">
                          {sede.share_ingresos_pct}%
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progreso fiel al Share de Ingresos */}
                    <div className="w-full h-2 bg-[#070e1b] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          esTop1 ? "bg-[#F5A623]" : "bg-[#0284c7]"
                        }`}
                        style={{ width: `${Math.max(sede.share_ingresos_pct, sede.ingresos > 0 ? 3 : 0)}%` }}
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

          {/* ── Sección Ancha: Top Películas del Período (Ocupa el 100% del ancho liberado) ── */}
          <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Cabecera con Totales de Taquilla */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-clapperboard text-brand-yellow"></i>
                  <span>Top películas más taquilleras</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Películas con mayor venta, recaudación corporativa y cuota de mercado en el período
                </p>
              </div>

              {/* Métricas Resumen de la Red en este período */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono flex-wrap">
                <div className="bg-[#070e1b] border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-slate-400 font-sans text-[11px]">Taquilla Total:</span>
                  <span className="text-amber-400 font-bold">
                    S/ {new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                      (dashboard?.top_peliculas || []).reduce((acc, p) => acc + p.recaudacion, 0)
                    )}
                  </span>
                </div>
                <div className="bg-[#070e1b] border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-slate-400 font-sans text-[11px]">Entradas:</span>
                  <span className="text-sky-400 font-bold">
                    {(dashboard?.top_peliculas || []).reduce((acc, p) => acc + p.entradas_vendidas, 0)}
                  </span>
                </div>
              </div>
            </div>

            {(dashboard?.top_peliculas || []).length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <i className="fa-solid fa-film text-3xl mb-2 block text-slate-600"></i>
                <p className="text-sm">Sin funciones ni ventas registradas en el período seleccionado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(dashboard?.top_peliculas || []).map((p, idx) => {
                  const esTop1 = idx === 0;
                  const esTop2 = idx === 1;
                  const esTop3 = idx === 2;

                  return (
                    <div
                      key={p.id_pelicula}
                      className={`bg-[#070e1b] border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                        esTop1
                          ? "border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5"
                          : esTop2
                          ? "border-slate-300/25 hover:border-slate-300/40"
                          : esTop3
                          ? "border-amber-700/25 hover:border-amber-700/40"
                          : "border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0 mb-3">
                        {/* Medalla del Podio */}
                        <div
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 font-extrabold text-xs ${
                            esTop1
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20"
                              : esTop2
                              ? "bg-slate-300/15 border-slate-300/40 text-slate-200"
                              : esTop3
                              ? "bg-amber-800/15 border-amber-700/40 text-amber-400"
                              : "bg-sky-950/40 border-sky-500/30 text-sky-400"
                          }`}
                        >
                          {esTop1 ? <i className="fa-solid fa-crown text-[11px] text-amber-400"></i> : idx + 1}
                        </div>

                        {/* Mini Póster */}
                        <img
                          src={p.url_poster || "/img/poster-placeholder.jpg"}
                          alt={p.titulo}
                          className="w-14 h-20 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/img/poster-placeholder.jpg";
                          }}
                        />

                        {/* Info de la Película */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <h4 className="font-bold text-white text-sm truncate" title={p.titulo}>
                              {p.titulo}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                              {p.clasificacion || "APT"}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 truncate mb-2">
                            {p.generos && p.generos.length > 0 ? p.generos.join(", ") : "Cine Comercial"}
                            {p.duracion_min ? ` · ${p.duracion_min} min` : ""}
                            {p.sedes_count ? ` · ${p.sedes_count} sedes` : ""}
                          </p>

                          {/* Métricas Clave */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Recaudación</span>
                              <strong className="text-amber-400 font-mono font-bold text-xs">
                                S/ {new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p.recaudacion)}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Entradas / Ticket</span>
                              <span className="text-slate-200 font-mono text-[11px]">
                                <strong className="text-white">{p.entradas_vendidas}</strong> ent · S/ {p.ticket_promedio.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Barra de Cuota de Taquilla */}
                      <div className="pt-2.5 border-t border-white/5 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full h-1.5 bg-[#0d1d33] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                esTop1 ? "bg-[#F5A623]" : "bg-[#0284c7]"
                              }`}
                              style={{ width: `${Math.max(p.share_taquilla_pct, p.entradas_vendidas > 0 ? 3 : 0)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-sky-400 shrink-0">
                          {p.share_taquilla_pct}% <span className="text-[10px] text-slate-500 font-normal">taquilla</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
