"use client";

import React, { useState, useEffect } from "react";
import { AdminSedeService } from "@/src/services/adminSedeService";
import type { PeliculaCatalogoSedeDTO, SalaDetalleSedeDTO, NuevaFuncionPayload } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalCrearFuncionProps {
  abierto: boolean;
  idSede: number;
  peliculas: PeliculaCatalogoSedeDTO[];
  salas: SalaDetalleSedeDTO[];
  peliculaPreseleccionadaId?: string;
  fechaPreseleccionada?: string;
  horaPreseleccionada?: string;
  salaPreseleccionadaId?: string;
  onCerrar: () => void;
  onGuardadoExitoso: () => void;
}

export default function ModalCrearFuncion({
  abierto,
  idSede,
  peliculas,
  salas,
  peliculaPreseleccionadaId,
  fechaPreseleccionada,
  horaPreseleccionada,
  salaPreseleccionadaId,
  onCerrar,
  onGuardadoExitoso,
}: ModalCrearFuncionProps) {
  const [idPelicula, setIdPelicula] = useState<string>("");
  const [idSala, setIdSala] = useState<string>("");
  const [idFormato, setIdFormato] = useState<string>("");
  const [idioma, setIdioma] = useState<string>("Doblada");
  const [fecha, setFecha] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState<string>("16:00");
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  useEffect(() => {
    if (abierto) {
      const hoy = new Date();
      const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
      const horaActualStr = `${String(hoy.getHours()).padStart(2, "0")}:${String(hoy.getMinutes()).padStart(2, "0")}`;

      setFecha(fechaPreseleccionada || hoyStr);
      setHoraInicio(horaPreseleccionada || horaActualStr);

      if (peliculaPreseleccionadaId) {
        setIdPelicula(peliculaPreseleccionadaId);
      } else if (peliculas.length > 0) {
        setIdPelicula(peliculas[0].id_pelicula);
      }

      if (salaPreseleccionadaId) {
        setIdSala(salaPreseleccionadaId);
      } else if (salas.length > 0) {
        setIdSala(salas[0].id_sala);
      }
      setErrorValidacion(null);
    }
  }, [abierto, peliculaPreseleccionadaId, fechaPreseleccionada, horaPreseleccionada, salaPreseleccionadaId, peliculas, salas]);

  // Formatos soportados por la sala seleccionada
  const salaActual = salas.find((s) => s.id_sala === idSala);
  const formatosDisponibles = salaActual?.formatos_soportados || [
    { id_formato: "2d-def", codigo: "2D", nombre: "2D Digital" },
  ];

  useEffect(() => {
    if (formatosDisponibles.length > 0) {
      setIdFormato(formatosDisponibles[0].id_formato);
    }
  }, [idSala]);

  const peliculaActual = peliculas.find((p) => p.id_pelicula === idPelicula);
  const duracionMin = peliculaActual?.duracion_min || 120;
  const horaFinEstimada = AdminSedeService.calcularHoraFinEstimada(duracionMin, horaInicio);

  if (!abierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!idPelicula || !idSala || !idFormato || !fecha || !horaInicio) {
      setErrorValidacion("Por favor completa todos los campos requeridos.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const ejecutarGuardado = async () => {
    setGuardando(true);
    setErrorValidacion(null);

    const payload: NuevaFuncionPayload = {
      id_sede: idSede,
      id_pelicula: idPelicula,
      id_sala: idSala,
      id_formato: idFormato,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFinEstimada,
      idioma_audio: idioma,
    };

    const resultado = await AdminSedeService.programarFuncion(payload);

    setGuardando(false);
    setMostrarConfirmacion(false);

    if (resultado.exito) {
      onGuardadoExitoso();
      onCerrar();
    } else {
      setErrorValidacion(resultado.mensaje);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow text-lg">
                <i className="fa-solid fa-film"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Programar Función</h3>
                <p className="text-xs text-slate-400">Asigna película, sala y horario con validación anti-solape</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {errorValidacion && (
            <div className="mb-4 p-3.5 bg-red-500/10 border border-brand-red/30 rounded-xl flex items-center gap-3 text-sm text-brand-red">
              <i className="fa-solid fa-triangle-exclamation flex-shrink-0"></i>
              <span>{errorValidacion}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Película */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Película
              </label>
              <select
                value={idPelicula}
                onChange={(e) => setIdPelicula(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
              >
                {peliculas.map((p) => (
                  <option key={p.id_pelicula} value={p.id_pelicula}>
                    {p.titulo} ({p.duracion_min} min — {p.clasificacion})
                  </option>
                ))}
              </select>
            </div>

            {/* Sala y Formato */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sala
                </label>
                <select
                  value={idSala}
                  onChange={(e) => setIdSala(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                >
                  {salas.map((s) => (
                    <option key={s.id_sala} value={s.id_sala}>
                      {s.nombre_sala} ({s.capacidad_total} butacas)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Formato de Pantalla
                </label>
                <select
                  value={idFormato}
                  onChange={(e) => setIdFormato(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                >
                  {formatosDisponibles.map((f) => (
                    <option key={f.id_formato} value={f.id_formato}>
                      {f.nombre || f.codigo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Idioma y Doblaje
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Doblada", "Subtitulada", "Original"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setIdioma(item)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      idioma === item
                        ? "bg-brand-yellow/10 border-brand-yellow text-brand-yellow shadow-sm"
                        : "bg-dark-800 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha y Horario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Fecha de Proyección
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            {/* Resumen dinámico con margen de limpieza */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Duración:</span>{" "}
                <b className="text-white">{duracionMin} min</b> + <span className="text-brand-yellow">30 min limpieza</span>
              </div>
              <div>
                <span className="text-slate-400">Fin estimado:</span>{" "}
                <b className="text-brand-yellow font-mono text-sm">{horaFinEstimada}</b>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-lg shadow-yellow-500/10 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-floppy-disk"></i>
                <span>Continuar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo="¿Confirmar Programación de Función?"
        mensaje={`Se programará '${peliculaActual?.titulo}' en ${salaActual?.nombre_sala} para el ${fecha} de ${horaInicio} a ${horaFinEstimada} (${idioma}).`}
        tipo="advertencia"
        textoConfirmar="Sí, Guardar Función"
        textoCancelar="Revisar"
        cargando={guardando}
        onConfirmar={ejecutarGuardado}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
