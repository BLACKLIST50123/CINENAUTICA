"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { TicketService } from "@/src/services/ticketService";
import type { VentaCounterResultadoDTO, OrdenContingenciaDTO } from "@/src/dtos/counter";

interface TicketTermicoPOSProps {
  venta: VentaCounterResultadoDTO | OrdenContingenciaDTO;
  onNuevaVenta?: () => void;
  esModalReimpresion?: boolean;
  onCerrarModal?: () => void;
}

export default function TicketTermicoPOS({
  venta,
  onNuevaVenta,
  esModalReimpresion = false,
  onCerrarModal,
}: TicketTermicoPOSProps) {
  const tieneEntradas = Array.isArray(venta.entradas) && venta.entradas.length > 0;
  const tieneProductos = Array.isArray(venta.productos) && venta.productos.length > 0;

  const subtotalSinIgv = Number((venta.total / 1.18).toFixed(2));
  const igv = Number((venta.total - subtotalSinIgv).toFixed(2));

  const handleImprimir = () => {
    TicketService.imprimirElemento("pos-ticket-imprimible", `Ticket_${venta.codigo_orden}`);
  };

  const nombreCliente = (venta as any).nombre_cliente || (venta as any).cliente_nombre || "Cliente Ventanilla";
  const numeroDoc = (venta as any).numero_documento || (venta as any).cliente_documento || "";
  const peliculaTitulo = (venta as any).pelicula_titulo || (venta as any).pelicula?.titulo || "Película";
  const sala = (venta as any).sala || (venta as any).pelicula?.sala || "1";
  const formato = (venta as any).formato || (venta as any).pelicula?.formato || "2D";
  const hora = (venta as any).hora || (venta as any).pelicula?.hora || "";

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-lg mx-auto animate-fade-in">
      {!esModalReimpresion && (
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl shadow-lg shadow-green-500/20">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 className="text-2xl font-bold text-white">¡Venta Exitosa!</h2>
          <p className="text-xs text-slate-400 mt-1">
            Comprobante emitido correctamente en ventanilla
          </p>
        </div>
      )}

      {/* CONTENEDOR DEL TICKET TÉRMICO (Ancho 85mm estándar tipo Cliente) */}
      <div
        id="pos-ticket-imprimible"
        className="bg-white text-black font-mono text-xs w-full max-w-[360px] shadow-2xl p-5 border-t-8 border-slate-900 select-all"
        style={{ borderRadius: 0 }}
      >
        {/* Cabecera Térmica */}
        <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
          <h3 className="text-base font-black uppercase tracking-wider">CINE NÁUTICA S.A.C.</h3>
          <p className="text-[11px] text-slate-700">RUC: 20512345678</p>
          <p className="text-[10px] text-slate-600 font-bold">
            {venta.nombre_sede || "CineNáutica Ventanilla"}
          </p>
          <p className="text-[10px] text-slate-500">Punto de Venta Presencial (Counter)</p>

          <p className="mt-2 font-black text-xs uppercase">
            {venta.tipo_comprobante === "Factura" ? "FACTURA ELECTRÓNICA" : "BOLETA ELECTRÓNICA"}
          </p>
          <p className="font-bold text-sm text-slate-900">{venta.numero_comprobante}</p>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5">
            {venta.codigo_orden}
          </p>
        </div>

        {/* Datos de Atención */}
        <div className="mb-3 text-[11px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
          <p>
            <strong className="text-slate-600">Cliente:</strong>{" "}
            <span className="font-bold">{nombreCliente}</span>
          </p>
          {numeroDoc && numeroDoc !== "00000000" && (
            <p>
              <strong className="text-slate-600">
                {venta.tipo_comprobante === "Factura" ? "RUC:" : "DNI:"}
              </strong>{" "}
              <span className="font-bold">{numeroDoc}</span>
            </p>
          )}
          <p>
            <strong className="text-slate-600">Fecha/Hora:</strong> <span>{venta.fecha}</span>
          </p>
          <p>
            <strong className="text-slate-600">Medio de Pago:</strong>{" "}
            <span className="font-bold uppercase">{venta.metodo_pago}</span>
          </p>
        </div>

        {/* Detalle de Película / Butacas (Boletería y Mixto) */}
        {tieneEntradas && (
          <div className="mb-3 border-b border-dashed border-slate-300 pb-2">
            <p className="text-[10px] font-black uppercase text-slate-800 tracking-wider mb-1">
              --- ACCESO A SALA DE CINE ---
            </p>
            <p className="font-bold text-xs text-slate-900">
              {peliculaTitulo}
            </p>
            <p className="text-[10px] text-slate-600">
              Sala {sala} · {formato} · {hora}
            </p>
            <p className="text-[11px] font-bold text-slate-900 mt-1">
              Butacas: {venta.entradas.map((e) => e.codigo_asiento).join(", ")}
            </p>
          </div>
        )}

        {/* Tabla de Items */}
        <table className="w-full text-left mb-3 text-[11px]">
          <thead>
            <tr className="border-b border-dashed border-slate-400 font-bold">
              <th className="pb-1">Cant / Detalle</th>
              <th className="text-right pb-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-slate-200">
            {/* Entradas */}
            {venta.entradas?.map((ent, idx) => (
              <tr key={`pos-ent-${idx}`}>
                <td className="py-1">
                  1x Entrada {ent.tipo_nombre || "General"} ({ent.codigo_asiento})
                </td>
                <td className="text-right py-1">S/ {Number(ent.precio).toFixed(2)}</td>
              </tr>
            ))}

            {/* Productos Dulcería */}
            {venta.productos?.map((prod, idx) => (
              <tr key={`pos-prod-${idx}`}>
                <td className="py-1">
                  {prod.cantidad}x {prod.nombre || (prod as any).nombre_producto}
                </td>
                <td className="text-right py-1">
                  S/ {Number(prod.subtotal || prod.precio_unitario * prod.cantidad).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Desglose de Totales */}
        <div className="border-t border-dashed border-slate-400 pt-2 mb-3 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-600">OP. GRAVADA:</span>
            <span>S/ {subtotalSinIgv.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">I.G.V. (18%):</span>
            <span>S/ {igv.toFixed(2)}</span>
          </div>
          {(venta as any).descuento > 0 && (
            <div className="flex justify-between text-green-700 font-bold">
              <span>DESCUENTO PUNTOS:</span>
              <span>- S/ {Number((venta as any).descuento).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 border-t border-dashed border-slate-400 pt-1 mt-1">
            <span>TOTAL PAGADO:</span>
            <span>S/ {Number(venta.total).toFixed(2)}</span>
          </div>

          {(venta as any).monto_recibido > 0 && (
            <>
              <div className="flex justify-between text-[10px] text-slate-600 pt-1">
                <span>Efectivo Recibido:</span>
                <span>S/ {Number((venta as any).monto_recibido).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-800 font-bold">
                <span>Vuelto:</span>
                <span>S/ {Number((venta as any).vuelto || 0).toFixed(2)}</span>
              </div>
            </>
          )}

          {(venta as any).puntos_ganados > 0 && (
            <div className="text-center text-[10px] text-amber-700 font-bold pt-1">
              ★ ¡Puntos acumulados con esta compra: +{(venta as any).puntos_ganados} pts!
            </div>
          )}
        </div>

        {/* Código QR Térmico */}
        <div className="text-center pt-2 border-t border-dashed border-slate-300">
          <div className="inline-block p-1.5 bg-white border border-slate-300 mb-1">
            <QRCodeSVG size={95} value={venta.codigo_orden} level="M" />
          </div>
          <p className="text-[10px] text-slate-600 font-mono tracking-wider font-bold">
            {venta.codigo_orden}
          </p>
          <p className="text-[9px] text-slate-500 mt-1">
            {tieneEntradas && tieneProductos
              ? "Válido para ingreso a sala y retiro en barra de dulcería"
              : tieneEntradas
              ? "Válido para ingreso directo a sala de cine"
              : "Presentar en barra de dulcería para despacho"}
          </p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="w-full max-w-[360px] space-y-2.5 mt-5">
        <button
          type="button"
          onClick={handleImprimir}
          className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <i className="fa-solid fa-print"></i>
          <span>Imprimir Ticket Térmico</span>
        </button>

        {!esModalReimpresion && onNuevaVenta && (
          <button
            type="button"
            onClick={onNuevaVenta}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Iniciar Nueva Venta</span>
          </button>
        )}

        {esModalReimpresion && onCerrarModal && (
          <button
            type="button"
            onClick={onCerrarModal}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 px-4 rounded-xl font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}
