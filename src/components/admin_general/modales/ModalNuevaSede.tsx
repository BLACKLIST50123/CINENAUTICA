"use client";

import React, { useState } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type { RegionDTO, CiudadDTO, NuevaSedePayload } from "@/src/dtos/adminGeneral";

interface ModalNuevaSedeProps {
  abierto: boolean;
  regiones: RegionDTO[];
  ciudades: CiudadDTO[];
  onCerrar: () => void;
  onSedeCreada: () => void;
}

export default function ModalNuevaSede({
  abierto,
  regiones,
  ciudades,
  onCerrar,
  onSedeCreada,
}: ModalNuevaSedeProps) {
  const [nombre, setNombre] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const [regionSeleccionada, setRegionSeleccionada] = useState<string>("");
  const [idCiudad, setIdCiudad] = useState<number>(0);
  const [direccion, setDireccion] = useState<string>("");
  const [cantSalas, setCantSalas] = useState<number>(4);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!abierto) return null;

  const ciudadesFiltradas = regionSeleccionada
    ? ciudades.filter((c) => c.region_nombre === regionSeleccionada)
    : ciudades;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre de la sede es obligatorio.");
      return;
    }
    if (!idCiudad) {
      setError("Debes seleccionar una ciudad.");
      return;
    }
    if (!direccion.trim()) {
      setError("La dirección es obligatoria.");
      return;
    }

    setGuardando(true);
    setError("");

    const payload: NuevaSedePayload = {
      nombre: nombre.trim(),
      codigo: codigo.trim().toUpperCase() || undefined,
      id_ciudad: idCiudad,
      direccion: direccion.trim(),
      cant_salas: cantSalas || 4,
    };

    const res = await AdminGeneralDao.crearSede(payload);
    setGuardando(false);

    if (res.ok) {
      setNombre("");
      setCodigo("");
      setDireccion("");
      setCantSalas(4);
      setIdCiudad(0);
      onSedeCreada();
      onCerrar();
    } else {
      setError(res.error || "Error al crear la sede.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full relative max-h-[92vh] overflow-y-auto scrollbar-none">
        <button
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
          onClick={onCerrar}
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h3 className="text-2xl font-bold text-white mb-1">Nueva sede</h3>
        <p className="text-slate-400 text-sm mb-6">Registra una nueva sede para su cine</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Ubicación */}
          <div className="bg-dark-900 border border-white/10 rounded-xl p-4 space-y-3">
            <p className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-location-dot text-brand-blue"></i>
              Ubicación
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-500 mb-1 block">Nombre de la sede</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Ej: Náutica Piura Centro"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Código</label>
                <input
                  type="text"
                  maxLength={20}
                  placeholder="Ej: PIU-01"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow uppercase text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Región</label>
                <select
                  value={regionSeleccionada}
                  onChange={(e) => {
                    setRegionSeleccionada(e.target.value);
                    setIdCiudad(0);
                  }}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow text-sm cursor-pointer"
                >
                  <option value="">Selecciona región...</option>
                  {regiones.map((r) => (
                    <option key={r.id_region} value={r.nombre}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Ciudad</label>
                <select
                  required
                  value={idCiudad}
                  onChange={(e) => setIdCiudad(Number(e.target.value))}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow text-sm cursor-pointer"
                >
                  <option value={0}>Selecciona ciudad...</option>
                  {ciudadesFiltradas.map((c) => (
                    <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Dirección completa</label>
              <input
                type="text"
                required
                maxLength={255}
                placeholder="Av. Grau 1234, Piura"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow text-sm"
              />
            </div>
          </div>

          {/* Configuración de Salas */}
          <div className="bg-dark-900 border border-white/10 rounded-xl p-4 space-y-3">
            <p className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-couch text-brand-yellow"></i>
              Capacidad Inicial
            </p>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Cantidad de salas iniciales</label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={cantSalas}
                onChange={(e) => setCantSalas(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-yellow text-sm"
              />
              <p className="text-[10px] text-slate-500 mt-1">Podrás personalizar y configurar cada sala una vez creada la sede.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={guardando}
              onClick={onCerrar}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-yellow-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {guardando && <i className="fa-solid fa-spinner fa-spin"></i>}
              <span>{guardando ? "Creando..." : "Guardar sede"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
