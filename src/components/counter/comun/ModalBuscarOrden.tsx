"use client";

import React, { useState } from "react";
import { CounterService } from "@/src/services/counterService";
import type { OrdenContingenciaDTO } from "@/src/dtos/counter";

interface ModalBuscarOrdenProps {
  abierto: boolean;
  onCerrar: () => void;
  idSedeActual: number;
  onReimprimir: (orden: OrdenContingenciaDTO) => void;
  onMostrarToast?: (mensaje: string) => void;
}

export default function ModalBuscarOrden({
  abierto,
  onCerrar,
  idSedeActual,
  onReimprimir,
  onMostrarToast,
}: ModalBuscarOrdenProps) {
  const [criterio, setCriterio] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [ordenes, setOrdenes] = useState<OrdenContingenciaDTO[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenContingenciaDTO | null>(null);
  const [reembolsando, setReembolsando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);

  if (!abierto) return null;

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criterio.trim()) return;

    setBuscando(true);
    setMensajeEstado(null);
    setOrdenSeleccionada(null);

    try {
      const resultados = await CounterService.buscarOrdenesContingencia(criterio, idSedeActual);
      setOrdenes(resultados);
      if (resultados.length === 0) {
        setMensajeEstado({ tipo: "err", texto: "No se encontraron órdenes con ese código o DNI." });
      }
    } catch (err: any) {
      setMensajeEstado({ tipo: "err", texto: err.message || "Error al buscar órdenes." });
    } finally {
      setBuscando(false);
    }
  };

  const handleReembolsar = async (orden: OrdenContingenciaDTO) => {
    if (!confirm(`¿Confirmas el REEMBOLSO de la orden ${orden.codigo_orden} por contingencia?\nEsto liberará los asientos ocupados a estado 'Disponible'.`)) {
      return;
    }

    setReembolsando(true);
    try {
      await CounterService.reembolsarOrdenContingencia(orden.id_orden, "Contingencia de ventanilla");
      setMensajeEstado({
        tipo: "ok",
        texto: `Orden ${orden.codigo_orden} reembolsada exitosamente. Asientos liberados.`,
      });

      // Actualizar estado local de la orden
      setOrdenes((prev) =>
        prev.map((o) => (o.id_orden === orden.id_orden ? { ...o, estado: "Reembolsada" } : o))
      );
      if (ordenSeleccionada?.id_orden === orden.id_orden) {
        setOrdenSeleccionada({ ...ordenSeleccionada, estado: "Reembolsada" });
      }
    } catch (err: any) {
      setMensajeEstado({ tipo: "err", texto: err.message || "Error al reembolsar orden." });
    } finally {
      setReembolsando(false);
    }
  };

  const handleReubicarClick = () => {
    if (onMostrarToast) {
      onMostrarToast("Próximamente: Módulo de reubicación por contingencia de sala (Disponible en Fase Admin)");
    } else {
      alert("Próximamente: Módulo de reubicación por contingencia de sala (Disponible en Fase Admin)");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Cabecera */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <i className="fa-solid fa-magnifying-glass text-brand-yellow text-sm"></i>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Búsqueda y Contingencias de Órdenes</h3>
              <p className="text-xs text-slate-400">Reimpresión, reembolso y reubicación de tickets</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Formulario de Búsqueda */}
        <div className="p-5 border-b border-white/5">
          <form onSubmit={handleBuscar} className="flex gap-2">
            <div className="relative flex-1">
              <i className="fa-solid fa-receipt absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
              <input
                type="text"
                value={criterio}
                onChange={(e) => setCriterio(e.target.value)}
                placeholder="Código de Orden (ORD-...) o DNI del cliente"
                className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={buscando || !criterio.trim()}
              className="bg-brand-yellow hover:bg-yellow-400 disabled:opacity-50 text-black px-5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              {buscando ? <i className="fa-solid fa-spinner fa-spin"></i> : "Buscar"}
            </button>
          </form>

          {mensajeEstado && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                mensajeEstado.tipo === "ok"
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-brand-red/10 border border-brand-red/30 text-brand-red"
              }`}
            >
              <i className={`fa-solid ${mensajeEstado.tipo === "ok" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
              <span>{mensajeEstado.texto}</span>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {ordenes.length === 0 && !buscando && !mensajeEstado && (
            <div className="text-center py-12 text-slate-500 text-sm">
              <i className="fa-solid fa-file-invoice text-3xl mb-2 block opacity-40"></i>
              Ingresa el código de compra o el DNI para buscar las órdenes del día.
            </div>
          )}

          {ordenes.map((ord) => (
            <div
              key={ord.id_orden}
              className={`bg-dark-900 border rounded-xl p-4 transition-colors ${
                ord.estado === "Reembolsada"
                  ? "border-brand-red/30 opacity-75"
                  : "border-white/10 hover:border-brand-blue/50"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-sm font-bold text-white mr-2">{ord.codigo_orden}</span>
                  <span className="text-xs text-slate-400">· {ord.fecha}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ord.estado === "Pagada"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : ord.estado === "Reembolsada"
                      ? "bg-brand-red/20 text-brand-red border border-brand-red/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {ord.estado}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1 mb-3">
                <p>
                  <span className="text-slate-500">Cliente:</span> <b>{ord.cliente_nombre}</b> {ord.cliente_documento && `(${ord.cliente_documento})`}
                </p>
                {ord.pelicula && (
                  <p>
                    <span className="text-slate-500">Función:</span> {ord.pelicula.titulo} · Sala {ord.pelicula.sala} ({ord.pelicula.formato}) · {ord.pelicula.hora}
                  </p>
                )}
                {ord.entradas.length > 0 && (
                  <p>
                    <span className="text-slate-500">Butacas:</span>{" "}
                    {ord.entradas.map((e) => e.codigo_asiento).join(", ")}
                  </p>
                )}
                {ord.productos.length > 0 && (
                  <p>
                    <span className="text-slate-500">Dulcería:</span>{" "}
                    {ord.productos.map((p) => `${p.cantidad}x ${p.nombre}`).join(", ")}
                  </p>
                )}
                <p className="text-sm font-bold text-white pt-1">
                  Total: <span className="text-brand-yellow">S/ {ord.total.toFixed(2)}</span> ({ord.tipo_comprobante} {ord.numero_comprobante})
                </p>
              </div>

              {/* Botones de Contingencia y Reimpresión */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {/* 1. Reimprimir */}
                <button
                  type="button"
                  onClick={() => {
                    onReimprimir(ord);
                    onCerrar();
                  }}
                  className="bg-brand-blue hover:bg-brand-dark-blue text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>Reimprimir Ticket</span>
                </button>

                {/* 2. Reubicar (Toast según AGENTS.md) */}
                <button
                  type="button"
                  onClick={handleReubicarClick}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-arrows-split-up-and-left"></i>
                  <span>Reubicar</span>
                </button>

                {/* 3. Reembolsar */}
                {ord.estado !== "Reembolsada" && (
                  <button
                    type="button"
                    disabled={reembolsando}
                    onClick={() => handleReembolsar(ord)}
                    className="bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/40 text-brand-red px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>Reembolsar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
