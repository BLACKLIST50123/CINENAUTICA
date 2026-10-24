"use client";

import React, { useState, useRef } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type { RegionDTO, CiudadDTO, NuevaSedePayload } from "@/src/dtos/adminGeneral";
import MapaSelectorUbicacion from "@/src/components/comun/MapaSelectorUbicacion";

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
  const [telefono, setTelefono] = useState<string>("");
  const [cantSalas, setCantSalas] = useState<number>(4);
  const [latitud, setLatitud] = useState<number | null>(-9.0744);
  const [longitud, setLongitud] = useState<number | null>(-78.5936);
  const [modoImagen, setModoImagen] = useState<"url" | "archivo">("url");
  const [urlImagen, setUrlImagen] = useState<string>("");
  const [serieBoleta, setSerieBoleta] = useState<string>("");
  const [serieFactura, setSerieFactura] = useState<string>("");
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!abierto) return null;

  const ciudadesFiltradas = regionSeleccionada
    ? ciudades.filter((c) => c.region_nombre === regionSeleccionada)
    : ciudades;

  const ciudadActual = ciudades.find((c) => c.id_ciudad === idCiudad)?.nombre;

  const handleProcesarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUrlImagen(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
      telefono: telefono.trim() || undefined,
      latitud: latitud != null && !isNaN(latitud) ? latitud : null,
      longitud: longitud != null && !isNaN(longitud) ? longitud : null,
      url_imagen: urlImagen.trim() || undefined,
      serie_boleta: serieBoleta.trim().toUpperCase() || undefined,
      serie_factura: serieFactura.trim().toUpperCase() || undefined,
    };

    const res = await AdminGeneralDao.crearSede(payload);
    setGuardando(false);

    if (res.ok) {
      setNombre("");
      setCodigo("");
      setDireccion("");
      setTelefono("");
      setCantSalas(4);
      setIdCiudad(0);
      setUrlImagen("");
      setSerieBoleta("");
      setSerieFactura("");
      onSedeCreada();
      onCerrar();
    } else {
      setError(res.error || "Error al crear la sede.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1528] p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full relative max-h-[92vh] overflow-y-auto scrollbar-none">
        <button
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer transition-colors"
          onClick={onCerrar}
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <i className="fa-solid fa-store text-lg"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Nueva Sede</h3>
            <p className="text-slate-400 text-xs">Registra una nueva sede para Cine Náutica</p>
          </div>
        </div>

        {error && (
          <div className="my-4 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5 mt-5" onSubmit={handleSubmit}>
          {/* Ubicación y Datos Generales */}
          <div className="bg-[#070e1b] border border-white/10 rounded-xl p-4 space-y-3.5">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info"></i>
              Identificación y Ubicación
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">
                  Nombre de la sede <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Ej: Náutica Piura Centro"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">Código</label>
                <input
                  type="text"
                  maxLength={20}
                  placeholder="Ej: PIU-01"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 uppercase text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">Región</label>
                <select
                  value={regionSeleccionada}
                  onChange={(e) => {
                    setRegionSeleccionada(e.target.value);
                    setIdCiudad(0);
                  }}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm cursor-pointer"
                >
                  <option value="">Selecciona región...</option>
                  {regiones.map((r) => (
                    <option key={r.id_region} value={r.nombre}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">
                  Ciudad <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={idCiudad}
                  onChange={(e) => setIdCiudad(Number(e.target.value))}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm cursor-pointer"
                >
                  <option value={0}>Selecciona ciudad...</option>
                  {ciudadesFiltradas.map((c) => (
                    <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">
                  Dirección completa <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  placeholder="Av. Grau 1234, Piura"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block font-medium">Teléfono</label>
                <input
                  type="tel"
                  maxLength={20}
                  placeholder="(01) 456-7890"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Selector de Ubicación en Mapa Leaflet */}
          <div className="bg-[#070e1b] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-map-location-dot"></i>
                Geolocalización en Mapa
              </p>
              <span className="text-[11px] text-slate-400">
                Arrastra el pin o haz clic en el mapa
              </span>
            </div>

            <MapaSelectorUbicacion
              latitud={latitud}
              longitud={longitud}
              ciudadNombre={ciudadActual}
              altura="220px"
              onChange={(lat, lng) => {
                setLatitud(lat);
                setLongitud(lng);
              }}
            />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={latitud ?? ""}
                  onChange={(e) => setLatitud(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="-9.074400"
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={longitud ?? ""}
                  onChange={(e) => setLongitud(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="-78.593600"
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Imagen de la Sede con Selector Dual */}
          <div className="bg-[#070e1b] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-image"></i>
                Foto de la Sede
              </p>
              <div className="flex bg-[#0B1528] p-0.5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setModoImagen("url")}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    modoImagen === "url" ? "bg-[#0284C7] text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Poner URL
                </button>
                <button
                  type="button"
                  onClick={() => setModoImagen("archivo")}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    modoImagen === "archivo" ? "bg-[#0284C7] text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Cargar Archivo
                </button>
              </div>
            </div>

            {modoImagen === "url" ? (
              <input
                type="url"
                value={urlImagen}
                onChange={(e) => setUrlImagen(e.target.value)}
                placeholder="https://ejemplo.com/sede-foto.jpg"
                className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleProcesarArchivo}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/20 hover:border-cyan-500 rounded-xl p-3 text-center cursor-pointer transition-colors text-xs text-slate-300 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-cloud-arrow-up text-cyan-400"></i>
                  <span>Seleccionar foto desde tu equipo</span>
                </button>
              </div>
            )}

            {urlImagen && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={urlImagen}
                  alt="Vista previa sede"
                  className="w-16 h-12 rounded-lg object-cover border border-white/10 shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/img/sede-default.jpg";
                  }}
                />
                <span className="text-[11px] text-emerald-400 font-medium">
                  <i className="fa-solid fa-check mr-1"></i> Imagen cargada correctamente
                </span>
              </div>
            )}
          </div>

          {/* Facturación y Capacidad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#070e1b] border border-white/10 rounded-xl p-3.5">
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                Serie Boleta
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="B001"
                value={serieBoleta}
                onChange={(e) => setSerieBoleta(e.target.value.toUpperCase())}
                className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2 text-white uppercase text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="bg-[#070e1b] border border-white/10 rounded-xl p-3.5">
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                Serie Factura
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="F001"
                value={serieFactura}
                onChange={(e) => setSerieFactura(e.target.value.toUpperCase())}
                className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2 text-white uppercase text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="bg-[#070e1b] border border-white/10 rounded-xl p-3.5">
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                Salas Iniciales
              </label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={cantSalas}
                onChange={(e) => setCantSalas(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
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
              className="bg-[#0284C7] hover:bg-[#0369A1] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-cyan-900/40 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {guardando && <i className="fa-solid fa-spinner fa-spin"></i>}
              <span>{guardando ? "Creando..." : "Guardar Sede"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
