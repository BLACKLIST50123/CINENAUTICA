"use client";

import React, { useState, useEffect } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { ProductoDulceriaSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";
import { obtenerIconoProducto } from "@/src/components/counter/dulceria/DulceriaView";

interface ModalPrecioDulceProps {
  abierto: boolean;
  producto: ProductoDulceriaSedeDTO | null;
  idSede: number;
  onCerrar: () => void;
  onGuardadoExitoso: () => void;
}

export default function ModalPrecioDulce({
  abierto,
  producto,
  idSede,
  onCerrar,
  onGuardadoExitoso,
}: ModalPrecioDulceProps) {
  const [habilitado, setHabilitado] = useState<boolean>(true);
  const [precioLocal, setPrecioLocal] = useState<string>("0.00");
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);
  const [mostrarConfirmacionRestablecer, setMostrarConfirmacionRestablecer] = useState<boolean>(false);

  useEffect(() => {
    if (producto) {
      setHabilitado(producto.habilitado);
      setPrecioLocal(producto.precio_local.toFixed(2));
      setErrorValidacion(null);
    }
  }, [producto, abierto]);

  if (!abierto || !producto) return null;

  const estiloIcono = obtenerIconoProducto(producto.nombre, producto.categoria_nombre);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    const num = parseFloat(precioLocal);
    if (isNaN(num) || num < 0) {
      setErrorValidacion("Ingresa un precio válido (mayor o igual a S/ 0.00).");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const ejecutarGuardado = async () => {
    setCargando(true);
    setErrorValidacion(null);

    const num = parseFloat(precioLocal);
    const ok = await AdminSedeDao.actualizarVisibilidadYPrecioDulce(
      idSede,
      producto.id_producto,
      habilitado,
      num
    );

    setCargando(false);
    setMostrarConfirmacion(false);

    if (ok) {
      onGuardadoExitoso();
      onCerrar();
    } else {
      setErrorValidacion("No se pudo actualizar el producto en la sede. Intenta nuevamente.");
    }
  };

  const confirmarRestablecerPrecioBase = () => {
    setPrecioLocal(producto.precio_base.toFixed(2));
    setMostrarConfirmacionRestablecer(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#0B1528] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
                <i className="fa-solid fa-bowl-food"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Configurar Producto</h3>
                <p className="text-xs text-slate-400">Visibilidad y precio local en la sede</p>
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

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3.5 mb-5">
            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center border bg-gradient-to-br ${estiloIcono.bgGradiente} flex-shrink-0`}
            >
              <i className={`${estiloIcono.icono} text-2xl ${estiloIcono.colorIcono}`}></i>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{producto.nombre}</h4>
              <p className="text-xs text-slate-400">{producto.categoria_nombre}</p>
              <p className="text-xs text-cyan-400 font-semibold mt-1">
                Precio base general: S/ {producto.precio_base.toFixed(2)}
              </p>
            </div>
          </div>

          {errorValidacion && (
            <div className="mb-4 p-3 bg-red-500/10 border border-brand-red/30 rounded-xl flex items-center gap-2 text-xs text-brand-red">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorValidacion}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Switch de visibilidad en sede */}
            <div className="flex items-center justify-between p-3.5 bg-dark-800 border border-white/10 rounded-xl">
              <div>
                <span className="block text-sm font-semibold text-white">Disponibilidad en Sede</span>
                <span className="block text-xs text-slate-400">
                  {habilitado ? "Visible para compras web y counter" : "Oculto en esta sede"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHabilitado(!habilitado)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  habilitado ? "bg-emerald-500" : "bg-dark-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    habilitado ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Precio Local */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Precio Local de la Sede (S/)
                </label>
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacionRestablecer(true)}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Restablecer a base
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  S/
                </span>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={precioLocal}
                  onChange={(e) => setPrecioLocal(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>
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
                <i className="fa-solid fa-floppy-disk"></i>
                <span>Continuar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo="¿Guardar Cambios de Producto?"
        mensaje={`Se actualizará '${producto.nombre}' en esta sede: ${
          habilitado ? "Visible en catálogo" : "Oculto del catálogo"
        } con un precio de S/ ${parseFloat(precioLocal).toFixed(2)}.`}
        tipo="info"
        textoConfirmar="Guardar Cambios"
        textoCancelar="Revisar"
        cargando={cargando}
        onConfirmar={ejecutarGuardado}
        onCancelar={() => setMostrarConfirmacion(false)}
      />

      <ModalConfirmacion
        abierto={mostrarConfirmacionRestablecer}
        titulo="¿Restablecer al Precio Base General?"
        mensaje={`El precio sugerido de '${producto.nombre}' volverá al valor base general de S/ ${producto.precio_base.toFixed(2)}.`}
        tipo="advertencia"
        textoConfirmar="Sí, Restablecer"
        textoCancelar="Cancelar"
        onConfirmar={confirmarRestablecerPrecioBase}
        onCancelar={() => setMostrarConfirmacionRestablecer(false)}
      />
    </>
  );
}
