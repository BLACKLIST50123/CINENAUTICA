"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  tipo?: "peligro" | "advertencia" | "info" | "exito";
  textoConfirmar?: string;
  textoCancelar?: string;
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  tipo = "advertencia",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  cargando = false,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  const [montado, setMontado] = useState<boolean>(false);
  const [sacudir, setSacudir] = useState<boolean>(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  if (!abierto || !montado) return null;

  const coloresIcono = {
    peligro: "bg-red-500/10 text-brand-red border-brand-red/30",
    advertencia: "bg-yellow-500/10 text-brand-yellow border-brand-yellow/30",
    info: "bg-blue-500/10 text-brand-blue border-brand-blue/30",
    exito: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  }[tipo];

  const coloresBoton = {
    peligro: "bg-brand-red hover:bg-red-600 text-white",
    advertencia: "bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold",
    info: "bg-brand-blue hover:bg-sky-400 text-white",
    exito: "bg-emerald-500 hover:bg-emerald-600 text-white",
  }[tipo];

  const icono = {
    peligro: "fa-triangle-exclamation",
    advertencia: "fa-circle-exclamation",
    info: "fa-circle-info",
    exito: "fa-circle-check",
  }[tipo];

  // Backdrop estático / bloqueante: Clic afuera en el overlay oscuro no cierra el modal,
  // sino que genera una suave pulsación para indicar que se debe confirmar o cancelar.
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSacudir(true);
      setTimeout(() => setSacudir(false), 260);
    }
  };

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-2xl text-white transform transition-transform duration-150 ${
          sacudir
            ? "scale-[1.03] border-brand-yellow/50 shadow-[0_0_30px_rgba(220,158,63,0.25)]"
            : "scale-100"
        }`}
      >
        {/* Botón X de cerrar accesible */}
        <button
          type="button"
          disabled={cargando}
          onClick={onCancelar}
          title="Cerrar modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border text-xl flex-shrink-0 ${coloresIcono}`}
          >
            <i className={`fa-solid ${icono}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1 leading-snug">{titulo}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{mensaje}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            disabled={cargando}
            onClick={onCancelar}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            disabled={cargando}
            onClick={onConfirmar}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all flex items-center gap-2 cursor-pointer ${coloresBoton} disabled:opacity-50`}
          >
            {cargando ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Procesando...</span>
              </>
            ) : (
              <span>{textoConfirmar}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
