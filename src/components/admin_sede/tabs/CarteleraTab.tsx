"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { PeliculaCatalogoSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface CarteleraTabProps {
  idSede: number;
  onIrAHorarios?: (idPelicula?: string) => void;
  onProgramarFuncion?: (idPelicula: string) => void;
}

export default function CarteleraTab({ idSede, onIrAHorarios, onProgramarFuncion }: CarteleraTabProps) {
  const [peliculas, setPeliculas] = useState<PeliculaCatalogoSedeDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>("");
  const [peliculaBannerPendiente, setPeliculaBannerPendiente] = useState<{
    pelicula: PeliculaCatalogoSedeDTO;
    nuevoEstado: boolean;
  } | null>(null);

  const cargarPeliculas = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerPeliculasCatalogoSede(idSede);
    setPeliculas(data);
    setCargando(false);
  }, [idSede]);

  useEffect(() => {
    cargarPeliculas();
  }, [cargarPeliculas]);

  const peliculasFiltradas = peliculas.filter((p) =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.generos.some((g) => g.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const confirmarCambioBanner = async () => {
    if (!peliculaBannerPendiente) return;
    const { pelicula, nuevoEstado } = peliculaBannerPendiente;

    // Actualización optimista
    setPeliculas((prev) =>
      prev.map((p) =>
        p.id_pelicula === pelicula.id_pelicula ? { ...p, destacada_banner: nuevoEstado } : p
      )
    );

    await AdminSedeDao.actualizarBannerPeliculaSede(idSede, pelicula.id_pelicula, nuevoEstado);
    setPeliculaBannerPendiente(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Catálogo de Películas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Películas maestras disponibles para programar funciones y destacar en el carrusel de la sede
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título o género..."
            className="w-full bg-dark-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition-colors"
          />
        </div>
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
          <div className="h-44 bg-dark-900 rounded-2xl"></div>
          <div className="h-44 bg-dark-900 rounded-2xl"></div>
          <div className="h-44 bg-dark-900 rounded-2xl"></div>
        </div>
      ) : peliculasFiltradas.length === 0 ? (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-10 text-center">
          <i className="fa-solid fa-film text-3xl text-slate-600 mb-2"></i>
          <p className="text-slate-400 text-sm">No se encontraron películas con los criterios de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {peliculasFiltradas.map((peli) => (
            <div
              key={peli.id_pelicula}
              className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl flex gap-4 transition-all hover:border-white/20"
            >
              {/* Poster */}
              <img
                src={peli.url_poster}
                alt={peli.titulo}
                className="w-24 h-36 object-cover rounded-xl bg-dark-950 flex-shrink-0 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/img/posters/poster1.png";
                }}
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-base leading-tight truncate">
                      {peli.titulo}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-800 border border-white/10 text-slate-300 flex-shrink-0">
                      {peli.clasificacion}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {peli.duracion_min} min · {peli.generos.slice(0, 2).join(", ") || "General"}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        peli.total_funciones_sede > 0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/5 text-slate-400"
                      }`}
                    >
                      <i className="fa-solid fa-calendar-days text-[9px]"></i>
                      <span>{peli.total_funciones_sede} funciones activas</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  {/* Switch Destacar en Banner */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={peli.destacada_banner}
                      onChange={(e) =>
                        setPeliculaBannerPendiente({
                          pelicula: peli,
                          nuevoEstado: e.target.checked,
                        })
                      }
                      className="rounded bg-dark-800 border-white/20 text-brand-yellow focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                    />
                    <span className={peli.destacada_banner ? "text-brand-yellow font-semibold" : "text-slate-400"}>
                      Banner
                    </span>
                  </label>

                  {/* Botón Ir a Horarios */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onIrAHorarios) onIrAHorarios(peli.id_pelicula);
                      else if (onProgramarFuncion) onProgramarFuncion(peli.id_pelicula);
                    }}
                    className="px-3.5 py-1.5 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <i className="fa-regular fa-calendar-days text-[11px]"></i>
                    <span>Horarios</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para destacar o retirar de banner */}
      <ModalConfirmacion
        abierto={!!peliculaBannerPendiente}
        titulo={
          peliculaBannerPendiente?.nuevoEstado
            ? "¿Destacar Película en el Banner?"
            : "¿Retirar del Banner de la Sede?"
        }
        mensaje={
          peliculaBannerPendiente?.nuevoEstado
            ? `'${peliculaBannerPendiente?.pelicula.titulo}' aparecerá en la portada principal del carrusel de esta sede.`
            : `'${peliculaBannerPendiente?.pelicula.titulo}' ya no se destacará en el carrusel de inicio de la sede.`
        }
        tipo="info"
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarCambioBanner}
        onCancelar={() => setPeliculaBannerPendiente(null)}
      />
    </div>
  );
}
