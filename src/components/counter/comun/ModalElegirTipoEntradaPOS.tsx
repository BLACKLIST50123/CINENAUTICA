"use client";

import React from "react";

interface TarifaOption {
  id_tipo_entrada: string;
  nombre: string;
  precio: number;
  descuento_pct?: number;
}

interface ModalElegirTipoEntradaPOSProps {
  asiento: {
    codigo: string;
    id_asiento: string;
    id_asiento_funcion?: string;
    fila?: string;
    columna?: number;
    tipo?: string;
  } | null;
  tarifas: TarifaOption[];
  onConfirmar: (asiento: any, tipo: TarifaOption) => void;
  onCerrar: () => void;
}

export default function ModalElegirTipoEntradaPOS({
  asiento,
  tarifas,
  onConfirmar,
  onCerrar,
}: ModalElegirTipoEntradaPOSProps) {
  if (!asiento) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#0B1528] border border-slate-700/80 rounded-2xl p-6 shadow-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-150">
        <button
          aria-label="Cerrar modal"
          type="button"
          onClick={onCerrar}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <h3 className="text-xl font-bold text-white mb-1">
          Elegir tipo de entrada
        </h3>
        <p className="text-slate-400 text-sm mb-5">
          Para el asiento <strong className="text-amber-400 font-bold">{asiento.codigo}</strong>
        </p>

        <div className="space-y-3">
          {tarifas.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              <i className="fa-solid fa-spinner fa-spin text-lg mb-2 block text-cyan-400"></i>
              Cargando tarifas disponibles...
            </div>
          ) : (
            tarifas.map((t) => (
              <button
                key={t.id_tipo_entrada}
                type="button"
                onClick={() => onConfirmar(asiento, t)}
                className="w-full bg-[#050B14] hover:bg-[#0E1A32] border border-slate-700/70 hover:border-cyan-500/80 p-4 rounded-xl flex justify-between items-center transition-all text-left group shadow-inner cursor-pointer"
              >
                <div>
                  <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors block">
                    {t.nombre}
                  </span>
                  {t.descuento_pct && t.descuento_pct > 0 ? (
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Descuento -{t.descuento_pct}%
                    </span>
                  ) : null}
                </div>
                <span className="font-black text-white text-base font-mono">
                  S/ {Number(t.precio || 0).toFixed(2)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
