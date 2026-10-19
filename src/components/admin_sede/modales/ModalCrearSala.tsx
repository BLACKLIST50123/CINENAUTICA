"use client";

import React, { useState } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalCrearSalaProps {
  abierto: boolean;
  idSede: number;
  onCerrar: () => void;
  onSalaCreada: () => void;
}

export default function ModalCrearSala({
  abierto,
  idSede,
  onCerrar,
  onSalaCreada,
}: ModalCrearSalaProps) {
  const [nombre, setNombre] = useState<string>("");
  const [filas, setFilas] = useState<number>(7);
  const [columnas, setColumnas] = useState<number>(12);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  if (!abierto) return null;

  const capacidad = Math.max(1, filas) * Math.max(1, columnas);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (filas < 3 || filas > 20) {
      setErrorValidacion("El número de filas debe estar entre 3 y 20.");
      return;
    }
    if (columnas < 4 || columnas > 25) {
      setErrorValidacion("El número de columnas debe estar entre 4 y 25.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const ejecutarCreacion = async () => {
    setCargando(true);
    setErrorValidacion(null);

    try {
      await AdminSedeDao.crearSalaSede(
        idSede,
        nombre.trim(),
        filas,
        columnas,
        []
      );

      setCargando(false);
      setMostrarConfirmacion(false);
      onSalaCreada();
      onCerrar();
    } catch (err: any) {
      setCargando(false);
      setMostrarConfirmacion(false);
      setErrorValidacion(err.message || "Error al crear la sala.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow text-lg">
                <i className="fa-solid fa-plus"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Nueva Sala</h3>
                <p className="text-xs text-slate-400">Genera una sala con su matriz de butacas</p>
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
            <div className="mb-4 p-3 bg-red-500/10 border border-brand-red/30 rounded-xl flex items-center gap-2 text-xs text-brand-red">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorValidacion}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre de Sala (Opcional)
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Sala 3 - Tradicional"
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Filas (Letras A-Z)
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={filas}
                  onChange={(e) => setFilas(parseInt(e.target.value, 10) || 7)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Columnas (Números)
                </label>
                <input
                  type="number"
                  min="4"
                  max="25"
                  value={columnas}
                  onChange={(e) => setColumnas(parseInt(e.target.value, 10) || 12)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Distribución:</span>{" "}
                <b className="text-white">{filas} filas × {columnas} columnas</b>
              </div>
              <div>
                <span className="text-slate-400">Aforo:</span>{" "}
                <b className="text-brand-yellow font-bold text-sm">{capacidad} butacas</b>
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
                <i className="fa-solid fa-plus"></i>
                <span>Continuar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo="¿Crear Nueva Sala?"
        mensaje={`Se creará una nueva sala con capacidad para ${capacidad} butacas (${filas} filas × ${columnas} columnas) en esta sede.`}
        tipo="info"
        textoConfirmar="Sí, Crear Sala"
        textoCancelar="Revisar"
        cargando={cargando}
        onConfirmar={ejecutarCreacion}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
