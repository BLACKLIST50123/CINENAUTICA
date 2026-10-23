"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type { SedeResumenDTO, RegionDTO, CiudadDTO } from "@/src/dtos/adminGeneral";
import AdminSedeContainer from "@/src/components/admin_sede/AdminSedeContainer";
import ModalNuevaSede from "../modales/ModalNuevaSede";

interface GestionSedesTabProps {
  regiones: RegionDTO[];
  ciudades: CiudadDTO[];
  recargarTrigger: number;
  onRecargar: () => void;
}

export default function GestionSedesTab({
  regiones,
  ciudades,
  recargarTrigger,
  onRecargar,
}: GestionSedesTabProps) {
  const [sedeSeleccionadaId, setSedeSeleccionadaId] = useState<number | null>(null);
  const [sedes, setSedes] = useState<SedeResumenDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>("");
  const [regionFiltro, setRegionFiltro] = useState<string>("");
  const [ciudadFiltro, setCiudadFiltro] = useState<string>("");
  const [modalNuevaSedeAbierto, setModalNuevaSedeAbierto] = useState<boolean>(false);
  const [ciudadesAbiertas, setCiudadesAbiertas] = useState<Record<string, boolean>>({});

  const cargarSedes = useCallback(async () => {
    setCargando(true);
    const data = await AdminGeneralDao.obtenerTodasSedes();
    setSedes(data);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarSedes();
  }, [cargarSedes, recargarTrigger]);

  // Si se ha seleccionado una sede para administrar, renderizamos AdminSedeContainer embebido
  if (sedeSeleccionadaId !== null) {
    return (
      <div className="-mt-6">
        <AdminSedeContainer
          idSedeInicial={sedeSeleccionadaId}
          onVolverAdminGeneral={() => {
            setSedeSeleccionadaId(null);
            cargarSedes();
          }}
        />
      </div>
    );
  }

  // Filtrado de ciudades disponibles en el select según región seleccionada
  const ciudadesParaSelect = regionFiltro
    ? ciudades.filter((c) => c.region_nombre === regionFiltro)
    : ciudades;

  // Filtrado de sedes
  const sedesFiltradas = sedes.filter((s) => {
    if (regionFiltro && s.region !== regionFiltro) return false;
    if (ciudadFiltro && s.ciudad !== ciudadFiltro) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      const matchNombre = s.nombre.toLowerCase().includes(q);
      const matchDir = s.direccion.toLowerCase().includes(q);
      const matchCiudad = s.ciudad.toLowerCase().includes(q);
      const matchRegion = s.region.toLowerCase().includes(q);
      if (!matchNombre && !matchDir && !matchCiudad && !matchRegion) return false;
    }
    return true;
  });

  // Agrupamiento por región y luego por ciudad
  const sedesPorRegion: Record<string, Record<string, SedeResumenDTO[]>> = {};
  sedesFiltradas.forEach((s) => {
    const reg = s.region || "Otras";
    const cd = s.ciudad || "Otras";
    if (!sedesPorRegion[reg]) sedesPorRegion[reg] = {};
    if (!sedesPorRegion[reg][cd]) sedesPorRegion[reg][cd] = [];
    sedesPorRegion[reg][cd].push(s);
  });

  const totalCiudadesConSedes = new Set(sedesFiltradas.map((s) => s.ciudad)).size;

  const toggleCiudad = (ciudad: string) => {
    setCiudadesAbiertas((prev) => ({
      ...prev,
      [ciudad]: !prev[ciudad],
    }));
  };

  const expandirTodas = () => {
    const nuevoEstado: Record<string, boolean> = {};
    sedes.forEach((s) => {
      nuevoEstado[s.ciudad] = true;
    });
    setCiudadesAbiertas(nuevoEstado);
  };

  const colapsarTodas = () => {
    const nuevoEstado: Record<string, boolean> = {};
    sedes.forEach((s) => {
      nuevoEstado[s.ciudad] = false;
    });
    setCiudadesAbiertas(nuevoEstado);
  };

  return (
    <div className="max-w-[1500px] mx-auto py-2">
      {/* Cabecera idéntica al monolito */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestión de Sedes</h2>
          <p className="text-slate-500 text-sm mt-1">
            Elige una sede para administrarla como lo haría su Admin de sede.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalNuevaSedeAbierto(true)}
          className="bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-yellow-500/20 cursor-pointer flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Nueva sede</span>
        </button>
      </div>

      {/* Barra de filtros idéntica al monolito (.filtro-barra) */}
      <div className="filtro-barra rounded-2xl p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B1528] border border-white/10 shadow-xl">
        <div className="md:col-span-2 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar sede, dirección o ciudad..."
            className="w-full bg-dark-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>
        <div className="filtro-campo flex flex-col justify-center">
          <label className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5 font-bold uppercase">
            <i className="fa-solid fa-map text-brand-blue"></i>
            Región
          </label>
          <select
            value={regionFiltro}
            onChange={(e) => {
              setRegionFiltro(e.target.value);
              setCiudadFiltro("");
            }}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue cursor-pointer"
          >
            <option value="">Todas las regiones</option>
            {regiones.map((r) => (
              <option key={r.id_region} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>
        </div>
        <div className="filtro-campo flex flex-col justify-center">
          <label className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5 font-bold uppercase">
            <i className="fa-solid fa-city text-brand-yellow"></i>
            Ciudad
          </label>
          <select
            value={ciudadFiltro}
            onChange={(e) => setCiudadFiltro(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue cursor-pointer"
          >
            <option value="">Todas las ciudades</option>
            {ciudadesParaSelect.map((c) => (
              <option key={c.id_ciudad} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contador y Botones Expandir todas / Colapsar todas */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <p className="text-xs text-slate-400">
          <span className="font-bold text-white">{sedesFiltradas.length}</span> sedes en{" "}
          <span className="font-bold text-white">{totalCiudadesConSedes}</span> ciudades
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandirTodas}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <i className="fa-solid fa-angles-down text-[11px] text-sky-400"></i>
            <span>Expandir todas</span>
          </button>
          <button
            type="button"
            onClick={colapsarTodas}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <i className="fa-solid fa-angles-up text-[11px] text-slate-400"></i>
            <span>Colapsar todas</span>
          </button>
        </div>
      </div>

      {/* Lista de resultados agrupados */}
      {cargando ? (
        <div className="py-16 text-center text-slate-500">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3 text-brand-blue"></i>
          <p className="text-sm">Cargando sedes...</p>
        </div>
      ) : Object.keys(sedesPorRegion).length === 0 ? (
        <div className="py-16 bg-dark-800 border border-white/5 rounded-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-slate-500 text-xl">
            <i className="fa-solid fa-store-slash"></i>
          </div>
          <h3 className="text-base font-bold text-white mb-1">No se encontraron sedes</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Prueba ajustando los filtros de búsqueda o registra una nueva sede.
          </p>
        </div>
      ) : (
        <div>
          {Object.entries(sedesPorRegion).map(([regionNombre, ciudadesMap]) => {
            const sedesDeRegion = Object.values(ciudadesMap).flat();
            const ciudadesCount = Object.keys(ciudadesMap).length;

            return (
              <section key={regionNombre} className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                    {regionNombre}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {ciudadesCount} {ciudadesCount === 1 ? "ciudad" : "ciudades"} · {sedesDeRegion.length} {sedesDeRegion.length === 1 ? "sede" : "sedes"}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  {Object.entries(ciudadesMap).map(([ciudadNombre, sedesDeCiudad]) => {
                    const abierto = Boolean(ciudadesAbiertas[ciudadNombre]);
                    const totalFuncionesCiudad = sedesDeCiudad.reduce((sum, s) => sum + (s.funciones_hoy || 0), 0);

                    return (
                      <div
                        key={ciudadNombre}
                        className={`acc ${abierto ? "open" : ""} bg-[#0B1528] border border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all`}
                      >
                        <button
                          type="button"
                          className="acc-head p-4 md:p-5 flex items-center gap-4 w-full text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
                          onClick={() => toggleCiudad(ciudadNombre)}
                        >
                          <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-city text-brand-yellow"></i>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-white font-bold text-lg leading-tight">
                              {ciudadNombre}
                            </h4>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {sedesDeCiudad.length} {sedesDeCiudad.length === 1 ? "sede" : "sedes"} · {totalFuncionesCiudad} funciones hoy
                            </p>
                          </div>
                          <i
                            className={`fa-solid fa-chevron-down acc-chevron text-slate-400 transition-transform duration-200 ${
                              abierto ? "rotate-180" : ""
                            }`}
                          ></i>
                        </button>

                        <div className="acc-body">
                          <div className="acc-inner">
                            <div className="p-4 md:p-5 pt-1 border-t border-white/5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pt-4">
                                {sedesDeCiudad.map((sede) => (
                                  <button
                                    key={sede.id_sede}
                                    type="button"
                                    className="sede-card text-left cursor-pointer group"
                                    onClick={() => setSedeSeleccionadaId(sede.id_sede)}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center">
                                        <i className="fa-solid fa-store text-brand-blue"></i>
                                      </div>
                                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                        <span className={`dot ${sede.activa ? "bg-green-500" : "bg-red-500"}`}></span>
                                        {sede.activa ? "Operativa" : "Inactiva"}
                                      </span>
                                    </div>

                                    <h4 className="text-white font-bold mt-3 leading-tight group-hover:text-brand-blue transition-colors">
                                      {sede.nombre}
                                    </h4>
                                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 min-h-[2rem]">
                                      {sede.direccion}
                                    </p>

                                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                      <div className="bg-dark-900 rounded-lg py-2">
                                        <p className="text-white font-bold text-sm">{sede.cant_salas}</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-bold">Salas</p>
                                      </div>
                                      <div className="bg-dark-900 rounded-lg py-2">
                                        <p className="text-white font-bold text-sm">{sede.funciones_hoy}</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-bold">Hoy</p>
                                      </div>
                                      <div className="bg-dark-900 rounded-lg py-2">
                                        <p className="text-brand-yellow font-bold text-sm">{sede.ocupacion_hoy_pct}%</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-bold">Ocup.</p>
                                      </div>
                                    </div>

                                    <div className="barra-mini mt-3 bg-dark-900 rounded-full h-1.5 overflow-hidden">
                                      <i
                                        className="block h-full bg-brand-blue rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(sede.ocupacion_hoy_pct || 40, 100)}%` }}
                                      ></i>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs text-slate-400">
                                      <span className="truncate flex items-center gap-1.5 text-brand-blue font-semibold">
                                        <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
                                        Administrar sede
                                      </span>
                                      <i className="fa-solid fa-arrow-right text-slate-500 group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Modal para crear nueva sede */}
      <ModalNuevaSede
        abierto={modalNuevaSedeAbierto}
        regiones={regiones}
        ciudades={ciudades}
        onCerrar={() => setModalNuevaSedeAbierto(false)}
        onSedeCreada={() => {
          cargarSedes();
          onRecargar();
        }}
      />
    </div>
  );
}
