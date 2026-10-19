"use client";

import React, { useState } from "react";
import { AdminSedeService } from "@/src/services/adminSedeService";
import type { FuncionAdminSedeDTO, ReprogramarFuncionPayload } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalCancelarFuncionProps {
  abierto: boolean;
  funcion: FuncionAdminSedeDTO | null;
  idUsuarioResponsable: string;
  onCerrar: () => void;
  onCancelacionExitosa: () => void;
}

export default function ModalCancelarFuncion({
  abierto,
  funcion,
  idUsuarioResponsable,
  onCerrar,
  onCancelacionExitosa,
}: ModalCancelarFuncionProps) {
  const [motivo, setMotivo] = useState<string>("Falla técnica");
  const [detalle, setDetalle] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  if (!abierto || !funcion) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!detalle.trim()) {
      setErrorValidacion("Debes ingresar una explicación detallada del motivo de la cancelación.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const ejecutarCancelacion = async () => {
    setCargando(true);
    setErrorValidacion(null);

    const payload: ReprogramarFuncionPayload = {
      id_funcion: funcion.id_funcion,
      id_sede: funcion.id_sede,
      accion: "cancelar",
      motivo: motivo,
      detalle_motivo: detalle.trim(),
      id_usuario_responsable: idUsuarioResponsable,
    };

    const res = await AdminSedeService.cancelarFuncion(payload);

    setCargando(false);
    setMostrarConfirmacion(false);

    if (res.exito) {
      onCancelacionExitosa();
      onCerrar();
    } else {
      setErrorValidacion(res.mensaje);
    }
  };

  const tieneVentas = funcion.asientos_ocupados > 0;

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-brand-red/30 flex items-center justify-center text-brand-red text-lg">
                <i className="fa-solid fa-ban"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cancelar Función</h3>
                <p className="text-xs text-slate-400">Pasa la función a cancelada y registra motivo en auditoría</p>
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

          {/* Ficha rápida de la función */}
          <div className="bg-dark-800 border border-white/10 rounded-xl p-4 mb-4">
            <h4 className="font-bold text-white text-base mb-1">{funcion.pelicula_titulo}</h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>
                <i className="fa-solid fa-door-open text-brand-yellow mr-1"></i>
                {funcion.sala_nombre}
              </span>
              <span>
                <i className="fa-regular fa-clock text-brand-blue mr-1"></i>
                {funcion.hora_inicio} - {funcion.hora_fin}
              </span>
              <span>
                <i className="fa-solid fa-film text-purple-400 mr-1"></i>
                {funcion.formato_nombre} · {funcion.idioma_audio}
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold">
              <span className="text-slate-400">Butacas ocupadas: </span>
              <span className={tieneVentas ? "text-brand-yellow font-bold" : "text-emerald-400"}>
                {funcion.asientos_ocupados} / {funcion.asientos_capacidad}
              </span>
            </div>
          </div>

          {tieneVentas && (
            <div className="mb-4 p-3.5 bg-yellow-500/10 border border-brand-yellow/30 rounded-xl flex items-start gap-3 text-xs text-brand-yellow leading-relaxed">
              <i className="fa-solid fa-triangle-exclamation text-base flex-shrink-0 mt-0.5"></i>
              <div>
                <b className="block text-white mb-0.5">Atención: Hay boletos vendidos</b>
                Esta función cuenta con <b>{funcion.asientos_ocupados} boletos vendidos</b>. Al cancelarla, las órdenes pasarán automáticamente al estado <b>Contingencia</b> para que los clientes sean atendidos o reubicados en counter.
              </div>
            </div>
          )}

          {errorValidacion && (
            <div className="mb-4 p-3 bg-red-500/10 border border-brand-red/30 rounded-xl flex items-center gap-2 text-xs text-brand-red">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorValidacion}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Motivo de Cancelación
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
              >
                <option value="Falla técnica">Falla técnica de proyector / sonido</option>
                <option value="Mantenimiento de sala">Mantenimiento urgente de sala</option>
                <option value="Baja asistencia">Baja asistencia</option>
                <option value="Cambio de programación">Cambio en la programación</option>
                <option value="Corte de energía">Corte de energía o fuerza mayor</option>
                <option value="Otro">Otro motivo justificado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Explicación del Motivo (Obligatorio)
              </label>
              <textarea
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                rows={3}
                placeholder="Explica qué ocurrió y las acciones adoptadas para la contingencia..."
                className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors resize-none"
              ></textarea>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-red hover:bg-red-600 text-white shadow-lg shadow-red-500/10 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Continuar a Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo="¿Estás seguro de cancelar esta función?"
        mensaje={`La función de '${funcion.pelicula_titulo}' será cancelada inmediatamente. ${
          tieneVentas
            ? `Se pasarán ${funcion.asientos_ocupados} boleto(s) a Contingencia.`
            : "No hay entradas vendidas afectadas."
        }`}
        tipo="peligro"
        textoConfirmar="Sí, Cancelar Función"
        textoCancelar="No, Regresar"
        cargando={cargando}
        onConfirmar={ejecutarCancelacion}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
