"use client";

import React from "react";

interface ModalConfirmarSalidaCounterProps {
  abierto: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
  mensajePersonalizado?: string;
}

export default function ModalConfirmarSalidaCounter({
  abierto,
  onCancelar,
  onConfirmar,
  mensajePersonalizado,
}: ModalConfirmarSalidaCounterProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center">
        <div className="w-14 h-14 bg-brand-red/15 text-brand-red border border-brand-red/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          ¿Deseas cancelar la venta en curso?
        </h3>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {mensajePersonalizado ||
            "Tienes butacas o productos seleccionados. Al cancelar la venta, las butacas se liberarán inmediatamente en la sala para otros clientes y el carrito se vaciará por completo."}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-bold text-sm transition-colors"
          >
            Continuar Venta
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="w-full bg-brand-red hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-600/20"
          >
            Sí, Cancelar y Liberar
          </button>
        </div>
      </div>
    </div>
  );
}
