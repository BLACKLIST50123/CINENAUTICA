"use client";

import React, { useState } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalCrearCuponLocalProps {
  abierto: boolean;
  idSede: number;
  onCerrar: () => void;
  onCuponCreado: () => void;
}

export default function ModalCrearCuponLocal({
  abierto,
  idSede,
  onCerrar,
  onCuponCreado,
}: ModalCrearCuponLocalProps) {
  const [codigo, setCodigo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [porcentaje, setPorcentaje] = useState<number>(20);
  const [fechaFin, setFechaFin] = useState<string>("");
  const [maxUsos, setMaxUsos] = useState<number>(100);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  if (!abierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    const cleanCodigo = codigo.trim().toUpperCase();
    if (!cleanCodigo || cleanCodigo.length < 3) {
      setErrorValidacion("El código debe tener al menos 3 caracteres.");
      return;
    }
    if (porcentaje < 1 || porcentaje > 100) {
      setErrorValidacion("El porcentaje debe estar entre 1% y 100%.");
      return;
    }
    if (!fechaFin) {
      setErrorValidacion("Selecciona una fecha de vencimiento válida.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const ejecutarCreacion = async () => {
    setCargando(true);
    setErrorValidacion(null);

    const ok = await AdminSedeDao.crearCuponLocal(idSede, {
      codigo: codigo.trim().toUpperCase(),
      descripcion: descripcion.trim(),
      porcentaje,
      fechaFin,
      maxUsos,
    });

    setCargando(false);
    setMostrarConfirmacion(false);

    if (ok) {
      onCuponCreado();
      onCerrar();
    } else {
      setErrorValidacion("No se pudo registrar el cupón local. Verifica que el código no esté repetido.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#0B1528] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
                <i className="fa-solid fa-tags"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Crear Cupón Local</h3>
                <p className="text-xs text-slate-400">Promoción exclusiva para esta sede</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                Código del Cupón
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ej. NAUTICA25, PROMOCHIMBOTE"
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors font-mono tracking-wider font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Descripción
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej. 20% de descuento en entradas generales"
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Descuento (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors font-bold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Límite de Canjes
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={maxUsos}
                  onChange={(e) => setMaxUsos(parseInt(e.target.value, 10) || 100)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Fecha Límite de Vigencia
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-2 cursor-pointer"
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
        titulo="¿Crear Cupón Local?"
        mensaje={`Se creará el cupón '${codigo}' con ${porcentaje}% de descuento, válido en esta sede hasta el ${fechaFin} con un máximo de ${maxUsos} canjes.`}
        tipo="info"
        textoConfirmar="Sí, Crear Cupón"
        textoCancelar="Revisar"
        cargando={cargando}
        onConfirmar={ejecutarCreacion}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
