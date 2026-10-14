"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { TicketService } from "@/src/services/ticketService";
import type { OrdenCompletaDTO } from "@/src/dtos/orden";
import { limpiarEstadoCompraGlobal } from "@/src/lib/ui/nav";

export default function Ticket() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cargando, setCargando] = useState<boolean>(true);
  const [orden, setOrden] = useState<OrdenCompletaDTO | null>(null);
  const [puntosGanados, setPuntosGanados] = useState<number>(0);

  useEffect(() => {
    // La compra ya finalizó con éxito: limpiar residuos de asientos o bloqueos temporales
    limpiarEstadoCompraGlobal();

    let idOrden = searchParams.get("orden");

    // Si no viene en searchParams, buscar en sessionStorage
    if (!idOrden) {
      try {
        const raw = sessionStorage.getItem("cinenautica_orden_confirmada");
        if (raw) {
          const parsed = JSON.parse(raw);
          idOrden = parsed.id_orden || parsed.id;
          if (parsed.puntos_ganados) {
            setPuntosGanados(Number(parsed.puntos_ganados));
          }
        }
      } catch (e) {
        console.warn("No se pudo leer cinenautica_orden_confirmada:", e);
      }
    }

    if (!idOrden) {
      setCargando(false);
      return;
    }

    TicketService.obtenerTicket(idOrden)
      .then((datos) => {
        if (datos) {
          setOrden(datos);
          // Si no teníamos puntos calculados, calcularlos base 1 sol = 1 punto
          if (puntosGanados === 0 && datos.total > 0) {
            setPuntosGanados(Math.floor(datos.total));
          }
        }
      })
      .catch((err) => {
        console.error("Error al cargar orden en Ticket:", err);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [searchParams, puntosGanados]);

  // Si está cargando
  if (cargando) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 flex items-center justify-center text-white">
        <div className="text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-brand-yellow text-4xl mb-3"></i>
          <p className="text-slate-400 text-sm">Cargando tus comprobantes de compra...</p>
        </div>
      </div>
    );
  }

  // Si no se encontró la orden
  if (!orden) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 text-white">
        <div className="max-w-md mx-auto text-center py-20 bg-dark-800 p-8 rounded-2xl border border-white/5">
          <i className="fa-solid fa-ticket-simple text-slate-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">No se encontró la orden</h2>
          <p className="text-slate-400 text-sm mb-6">
            No pudimos ubicar los datos de esta compra o el enlace ha caducado.
          </p>
          <button
            className="bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all text-sm cursor-pointer"
            type="button"
            onClick={() => router.push("/")}
          >
            Explorar Cartelera
          </button>
        </div>
      </div>
    );
  }

  // Cálculos de comprobante
  const comp = orden.comprobante;
  const esFactura = comp?.tipo === "Factura";
  const subtotalSinIgv = comp?.subtotal_sin_igv ?? Number((orden.total / 1.18).toFixed(2));
  const igv = comp?.igv ?? Number((orden.total - subtotalSinIgv).toFixed(2));
  const fechaEmision = comp?.fecha_emision
    ? TicketService.formatearFechaHora(comp.fecha_emision)
    : TicketService.formatearFechaHora(orden.fecha_creacion);

  // String para código QR SUNAT
  const sunatQrString = `20512345678|${esFactura ? "01" : "03"}|${comp?.serie || "B001"}|${
    comp?.correlativo || 1
  }|${igv.toFixed(2)}|${orden.total.toFixed(2)}|${fechaEmision.fecha}|${
    esFactura ? "6" : "1"
  }|${comp?.numero_documento_cliente || ""}`;

  return (
    <div className="w-full bg-dark-900 min-h-screen pb-40 pt-28 md:pt-36 text-white" id="vista-ticket">
      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col items-center">
        
        {/* Encabezado Éxito */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_35px_rgba(16,185,129,0.5)] animate-bounce-slow">
            <i className="fa-solid fa-check text-3xl text-white"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            ¡Compra Confirmada!
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            Tu reserva ha sido registrada en el sistema. Puedes descargar o presentar estos comprobantes en el cine.
          </p>
        </div>

        {/* Puntos Ganados */}
        {puntosGanados > 0 && (
          <div
            className="mb-8 bg-gradient-to-r from-dark-800 to-dark-800/90 border border-brand-yellow/30 rounded-2xl px-6 py-3.5 flex items-center gap-3.5 shadow-xl max-w-md w-full"
            id="ticket-puntos-ganados"
          >
            <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-star text-brand-yellow text-xl"></i>
            </div>
            <p className="text-white text-xs md:text-sm">
              <span>Ganaste </span>
              <span className="font-black text-brand-yellow text-base">
                +{puntosGanados}
              </span>
              <span> Puntos Náutica con esta compra.</span>
            </p>
          </div>
        )}

        {/* Contenedor de Comprobantes */}
        <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-center lg:items-start">

          {/* ── 1. TICKET DE CINE IMPRIMIBLE ── */}
          {orden.entradas && orden.entradas.length > 0 && (
            <div className="flex flex-col items-center w-full max-w-[360px]">
              <div
                className="bg-[#fdfcfa] w-full shadow-2xl overflow-hidden border border-slate-200 text-black flex flex-col rounded-none"
                id="ticket-imprimible"
              >
                {/* Cabecera Ticket */}
                <div className="bg-brand-blue text-white px-5 py-4 flex justify-between items-center shadow-md">
                  <div>
                    <span className="font-black tracking-widest text-lg block leading-none">
                      CINE NÁUTICA
                    </span>
                    <span className="text-[10px] text-white/80 tracking-wider">
                      ENTRADA OFICIAL
                    </span>
                  </div>
                  <i className="fa-solid fa-film text-2xl text-white"></i>
                </div>

                <div className="p-6 pb-4 flex-1">
                  {/* Título de Película */}
                  <h3
                    className="text-2xl font-black text-black uppercase mb-1 leading-tight tracking-tight"
                    id="pdf-titulo-pelicula"
                  >
                    {orden.pelicula?.titulo || "Función Cine"}
                  </h3>
                  <p className="text-brand-blue font-bold text-xs uppercase mb-4" id="pdf-formato">
                    {orden.pelicula?.formato || "2D"} • {orden.pelicula?.sala || "Sala"}
                  </p>

                  {/* Grid de Datos */}
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs text-slate-800 mb-4 pb-4 border-b border-dashed border-slate-300">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Fecha</p>
                      <p className="font-bold text-sm" id="pdf-fecha">
                        {orden.pelicula?.fecha || fechaEmision.fecha}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Hora</p>
                      <p className="font-bold text-sm" id="pdf-hora">
                        {orden.pelicula?.hora || fechaEmision.hora}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Sede</p>
                      <p className="font-bold text-xs line-clamp-1" id="pdf-cine">
                        {orden.nombre_sede || "CineNáutica"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Butacas</p>
                      <p className="font-black text-sm text-brand-blue" id="pdf-asientos">
                        {orden.entradas.map((e) => e.codigo_asiento).filter(Boolean).join(", ")}
                      </p>
                    </div>

                    {orden.direccion_sede && (
                      <div className="col-span-2 pt-1">
                        <p className="text-slate-400 text-[10px] uppercase font-bold">Dirección</p>
                        <p className="font-semibold text-[11px] text-slate-600">
                          {orden.direccion_sede}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dulcería si compró */}
                  {orden.productos && orden.productos.length > 0 && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 mb-4">
                      <p className="text-amber-800 text-[11px] uppercase font-black mb-1.5 flex items-center gap-1.5">
                        <i className="fa-solid fa-bowl-food text-amber-600"></i>
                        Dulcería (Reclamar en barra)
                      </p>
                      <ul className="text-xs font-semibold text-slate-800 leading-snug space-y-1">
                        {orden.productos.map((prod, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>
                              {prod.cantidad}x {prod.nombre_producto}
                            </span>
                            <span className="font-mono text-slate-600">
                              S/ {prod.subtotal.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Código QR y Código alfanumérico */}
                  <div className="text-center pt-2">
                    <div className="inline-block p-2 bg-white rounded-xl border border-slate-200 shadow-sm mb-2">
                      <QRCodeSVG
                        level="M"
                        size={110}
                        value={orden.codigo_orden}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono tracking-widest font-bold">
                      {orden.codigo_orden}
                    </p>
                  </div>
                </div>

                {/* Pie de ticket */}
                <div className="bg-dark-900 p-2.5 text-center text-white">
                  <p className="text-[10px] text-slate-400">
                    Presenta este código QR o impreso para ingresar directamente a tu sala.
                  </p>
                </div>
              </div>

              {/* Botón Imprimir Ticket */}
              <button
                className="mt-4 bg-brand-blue hover:bg-blue-600 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 w-full text-sm cursor-pointer"
                type="button"
                onClick={() =>
                  TicketService.imprimirElemento(
                    "ticket-imprimible",
                    `Ticket_${orden.codigo_orden}`
                  )
                }
              >
                <i className="fa-solid fa-print"></i>
                Descargar / Imprimir Ticket
              </button>
            </div>
          )}

          {/* ── 2. COMPROBANTE FISCAL ELECTRÓNICO (BOLETA / FACTURA) ── */}
          <div className="flex flex-col items-center w-full max-w-[360px]">
            <div
              className="bg-white w-full shadow-2xl p-6 border-t-8 border-slate-800 text-black font-mono text-xs rounded-none relative"
              id="comprobante-imprimible"
            >
              {/* Encabezado Fiscal */}
              <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
                <h3 className="text-base font-black uppercase tracking-wider">
                  Cine Náutica S.A.C.
                </h3>
                <p className="text-[11px] text-slate-700">RUC: 20512345678</p>
                <p className="text-[10px] text-slate-600">
                  {orden.nombre_sede || "CineNáutica"}
                </p>
                {orden.direccion_sede && (
                  <p className="text-[10px] text-slate-500">{orden.direccion_sede}</p>
                )}
                <p className="mt-2 font-black text-xs uppercase" id="pdf-tipo-documento">
                  {esFactura ? "FACTURA ELECTRÓNICA" : "BOLETA ELECTRÓNICA"}
                </p>
                <p className="font-bold text-sm text-slate-800" id="pdf-numero-comprobante">
                  {comp?.numero_comprobante || `B001-${String(orden.codigo_orden).slice(-6)}`}
                </p>
              </div>

              {/* Datos de Cliente */}
              <div className="mb-3 text-[11px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <p>
                  <strong className="text-slate-600">Cliente:</strong>{" "}
                  <span className="font-bold">{comp?.nombre_cliente || orden.nombre_contacto}</span>
                </p>
                <p>
                  <strong className="text-slate-600">{esFactura ? "RUC:" : "DNI:"}</strong>{" "}
                  <span className="font-bold">{comp?.numero_documento_cliente || "00000000"}</span>
                </p>
                <p>
                  <strong className="text-slate-600">Emisión:</strong>{" "}
                  <span>{fechaEmision.fecha} {fechaEmision.hora}</span>
                </p>
                <p>
                  <strong className="text-slate-600">Moneda:</strong> SOLES (PEN)
                </p>
              </div>

              {/* Tabla de Items */}
              <table className="w-full text-left mb-3 text-[11px]">
                <thead>
                  <tr className="border-b border-dashed border-slate-400 font-bold">
                    <th className="pb-1">Cant. / Descripción</th>
                    <th className="text-right pb-1">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-slate-200">
                  {/* Entradas */}
                  {orden.entradas.map((ent, idx) => (
                    <tr key={`ent-${idx}`}>
                      <td className="py-1">
                        1x Entrada {ent.tipo_entrada || "General"} ({ent.codigo_asiento})
                      </td>
                      <td className="text-right py-1">S/ {ent.precio_unitario.toFixed(2)}</td>
                    </tr>
                  ))}

                  {/* Dulcería */}
                  {orden.productos.map((prod, idx) => (
                    <tr key={`prod-${idx}`}>
                      <td className="py-1">
                        {prod.cantidad}x {prod.nombre_producto}
                      </td>
                      <td className="text-right py-1">S/ {prod.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Desglose de Totales */}
              <div className="border-t border-dashed border-slate-400 pt-2 mb-4 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">OP. GRAVADA:</span>
                  <span>S/ {subtotalSinIgv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">I.G.V. (18%):</span>
                  <span>S/ {igv.toFixed(2)}</span>
                </div>

                {orden.descuento_cupon > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>DESC. CUPÓN:</span>
                    <span>- S/ {orden.descuento_cupon.toFixed(2)}</span>
                  </div>
                )}

                {orden.descuento_puntos > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>DESC. PUNTOS:</span>
                    <span>- S/ {orden.descuento_puntos.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800">
                  <span>IMPORTE TOTAL:</span>
                  <span>S/ {orden.total.toFixed(2)}</span>
                </div>
              </div>

              {/* QR SUNAT */}
              <div className="text-center pt-1 border-t border-dashed border-slate-300">
                <div className="inline-block p-1.5 bg-slate-50 border border-slate-200 rounded mb-1">
                  <QRCodeSVG level="L" size={85} value={sunatQrString} />
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Representación impresa del comprobante electrónico autorizado por SUNAT.
                </p>
              </div>
            </div>

            {/* Botón Imprimir Comprobante */}
            <button
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 w-full text-sm cursor-pointer"
              type="button"
              onClick={() =>
                TicketService.imprimirElemento(
                  "comprobante-imprimible",
                  `Comprobante_${comp?.numero_comprobante || orden.codigo_orden}`
                )
              }
            >
              <i className="fa-solid fa-file-invoice"></i>
              Descargar / Imprimir Comprobante
            </button>
          </div>

        </div>

        {/* Volver a Inicio */}
        <div className="mt-12 text-center">
          <button
            className="text-brand-yellow hover:text-white font-bold transition-colors text-sm flex items-center gap-2 mx-auto cursor-pointer"
            type="button"
            onClick={() => router.push("/")}
          >
            <i className="fa-solid fa-house"></i>
            Volver a la Cartelera Principal
          </button>
        </div>

      </div>
    </div>
  );
}
