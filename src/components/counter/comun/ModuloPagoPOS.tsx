"use client";

import React, { useState, useEffect } from "react";
import type {
  MetodoPagoCounter,
  TipoComprobanteCounter,
  SocioCounterDTO,
} from "@/src/dtos/counter";

interface ModuloPagoPOSProps {
  total: number;
  subtotal: number;
  socioActivo: SocioCounterDTO | null;
  onVolver: () => void;
  onConfirmarCobro: (datos: {
    tipo_comprobante: TipoComprobanteCounter;
    numero_documento: string;
    nombre_cliente: string;
    metodo_pago: MetodoPagoCounter;
    monto_recibido: number;
    descuento_puntos?: number;
    puntos_canjeados?: number;
  }) => Promise<void>;
  procesando?: boolean;
}

export default function ModuloPagoPOS({
  total,
  subtotal,
  socioActivo,
  onVolver,
  onConfirmarCobro,
  procesando = false,
}: ModuloPagoPOSProps) {
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobanteCounter>("Boleta");
  const [numeroDoc, setNumeroDoc] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPagoCounter>("Efectivo");
  const [montoRecibido, setMontoRecibido] = useState<number>(total);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  // Canje de puntos si hay socio
  const [canjearPuntos, setCanjearPuntos] = useState(false);
  const [puntosACanjear, setPuntosACanjear] = useState(0);

  // Autocompletar datos si hay socio vinculado
  useEffect(() => {
    if (socioActivo) {
      if (tipoComprobante === "Boleta") {
        setNumeroDoc(socioActivo.dni || "");
        setNombreCliente(socioActivo.nombre_completo || "");
      }
    }
  }, [socioActivo, tipoComprobante]);

  // Actualizar monto recibido inicial al cambiar el total
  useEffect(() => {
    setMontoRecibido(total);
  }, [total]);

  // Cálculo de puntos
  const puntosDisponibles = socioActivo?.puntos || 0;
  const descuentoPuntos = canjearPuntos ? Number((puntosACanjear * 0.1).toFixed(2)) : 0;
  const totalNeto = Math.max(0, Number((total - descuentoPuntos).toFixed(2)));
  const vuelto = metodoPago === "Efectivo" ? Math.max(0, Number((montoRecibido - totalNeto).toFixed(2))) : 0;

  const aplicarBillete = (monto: number) => {
    setMontoRecibido(monto);
  };

  const handleCobrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    // Validar comprobante
    if (tipoComprobante === "Factura") {
      const rucLimpio = numeroDoc.replace(/\D/g, "");
      if (rucLimpio.length !== 11 || (!rucLimpio.startsWith("10") && !rucLimpio.startsWith("20"))) {
        setErrorValidacion("Para Factura, ingrese un RUC válido de 11 dígitos.");
        return;
      }
      if (!nombreCliente.trim()) {
        setErrorValidacion("Ingrese la Razón Social para la Factura.");
        return;
      }
    } else {
      // Boleta
      if (numeroDoc.trim()) {
        const dniLimpio = numeroDoc.replace(/\D/g, "");
        if (dniLimpio.length !== 8) {
          setErrorValidacion("El DNI de la boleta debe tener 8 dígitos.");
          return;
        }
      }
    }

    // Validar efectivo
    if (metodoPago === "Efectivo") {
      if (montoRecibido < totalNeto) {
        setErrorValidacion(`El monto recibido (S/ ${montoRecibido.toFixed(2)}) es menor al total a cobrar (S/ ${totalNeto.toFixed(2)}).`);
        return;
      }
    }

    try {
      await onConfirmarCobro({
        tipo_comprobante: tipoComprobante,
        numero_documento: numeroDoc.trim() || (tipoComprobante === "Boleta" ? "00000000" : ""),
        nombre_cliente: nombreCliente.trim() || (socioActivo?.nombre_completo || "Cliente Ventanilla"),
        metodo_pago: metodoPago,
        monto_recibido: metodoPago === "Efectivo" ? montoRecibido : totalNeto,
        descuento_puntos: descuentoPuntos,
        puntos_canjeados: canjearPuntos ? puntosACanjear : 0,
      });
    } catch (err: any) {
      setErrorValidacion(err.message || "Error al procesar la venta en caja.");
    }
  };

  return (
    <div id="cv-pago" className="p-4 md:p-6 fade-in max-w-3xl mx-auto w-full">
      {/* Cabecera del cobro */}
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={onVolver}
          className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Volver</span>
        </button>
        <h2 className="text-2xl font-bold">Cobro en Ventanilla</h2>
      </div>

      {errorValidacion && (
        <div className="mb-4 bg-brand-red/10 border border-brand-red/40 rounded-xl p-3.5 flex items-center gap-3 text-brand-red text-sm">
          <i className="fa-solid fa-triangle-exclamation text-base"></i>
          <span>{errorValidacion}</span>
        </div>
      )}

      <form onSubmit={handleCobrar} className="space-y-5">
        {/* 1. Comprobante */}
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
            1 · Comprobante Electrónico
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTipoComprobante("Boleta")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                tipoComprobante === "Boleta"
                  ? "bg-[#0284C7] text-white shadow-md shadow-cyan-600/20"
                  : "bg-dark-900 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-receipt mr-1.5"></i>
              Boleta
            </button>
            <button
              type="button"
              onClick={() => setTipoComprobante("Factura")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                tipoComprobante === "Factura"
                  ? "bg-[#0284C7] text-white shadow-md shadow-cyan-600/20"
                  : "bg-dark-900 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-building mr-1.5"></i>
              Factura
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {tipoComprobante === "Factura" ? "RUC (11 dígitos)" : "DNI (8 dígitos, opcional)"}
              </label>
              <input
                type="text"
                maxLength={tipoComprobante === "Factura" ? 11 : 8}
                value={numeroDoc}
                onChange={(e) => setNumeroDoc(e.target.value.replace(/\D/g, ""))}
                placeholder={tipoComprobante === "Factura" ? "20601234567" : "72481920"}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {tipoComprobante === "Factura" ? "Razón Social" : "Nombre del Cliente"}
              </label>
              <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder={tipoComprobante === "Factura" ? "Empresa SAC" : "Juan Pérez"}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            <i className="fa-solid fa-circle-info text-cyan-400 mr-1"></i>
            {tipoComprobante === "Factura"
              ? "Exige RUC y Razón Social según normativa tributaria."
              : "En boleta menor a S/ 700 el documento es opcional para el cliente."}
          </p>
        </div>

        {/* 2. Descuentos y Puntos de Socio */}
        {socioActivo && puntosDisponibles >= 50 && (
          <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
              2 · Beneficio Socio Náutica
            </p>
            <div className="bg-dark-900 border border-brand-yellow/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-white text-sm font-bold flex items-center gap-2">
                  <i className="fa-solid fa-star text-brand-yellow"></i>
                  Puntos Disponibles: <span className="text-brand-yellow">{puntosDisponibles} pts</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  50 pts = S/ 5.00 de descuento (máx. 50% de la venta)
                </p>
              </div>

              {!canjearPuntos ? (
                <button
                  type="button"
                  onClick={() => {
                    const maxPuntosPorTope = Math.floor((total * 0.5) / 0.1);
                    const canje = Math.min(puntosDisponibles, maxPuntosPorTope);
                    setPuntosACanjear(canje);
                    setCanjearPuntos(true);
                  }}
                  className="bg-brand-yellow hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  Canjear Puntos
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xs font-bold">
                    - S/ {descuentoPuntos.toFixed(2)} ({puntosACanjear} pts)
                  </span>
                  <button
                    type="button"
                    onClick={() => setCanjearPuntos(false)}
                    className="text-slate-400 hover:text-brand-red text-xs underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Método de Pago */}
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
            3 · Método de Pago
          </p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <button
              type="button"
              onClick={() => setMetodoPago("Efectivo")}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-colors ${
                metodoPago === "Efectivo"
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                  : "bg-dark-900 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-money-bill-wave text-lg"></i>
              <span>Efectivo</span>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago("Tarjeta")}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                metodoPago === "Tarjeta"
                  ? "bg-[#0284C7] text-white shadow-lg shadow-cyan-600/30"
                  : "bg-dark-900 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-credit-card text-lg"></i>
              <span>Tarjeta POS</span>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago("Yape")}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                metodoPago === "Yape"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-dark-900 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-mobile-screen text-lg"></i>
              <span>Yape / Plin</span>
            </button>
          </div>

          {/* EFECTIVO: Monto recibido + Billetes + Vuelto */}
          {metodoPago === "Efectivo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">
                    Monto Recibido del Cliente
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                      S/
                    </span>
                    <input
                      type="number"
                      step="any"
                      min={0}
                      value={montoRecibido}
                      onChange={(e) => setMontoRecibido(Number(e.target.value) || 0)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 pl-11 text-2xl font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-wider text-green-300 font-bold">
                    Vuelto a Entregar
                  </p>
                  <p className="text-3xl font-bold text-green-400 font-mono">
                    S/ {vuelto.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Botones rápidos de billetes */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[10, 20, 50, 100, 200].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => aplicarBillete(b)}
                    className="bg-dark-900 hover:bg-dark-700 border border-white/10 hover:border-cyan-500/50 rounded-lg py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    S/ {b}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => aplicarBillete(totalNeto)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 rounded-lg py-2 text-xs font-bold text-cyan-400 transition-colors cursor-pointer"
                >
                  Exacto
                </button>
              </div>
            </div>
          )}

          {/* TARJETA: Instrucción de terminal POS */}
          {metodoPago === "Tarjeta" && (
            <div className="text-center py-6 bg-dark-900 border border-white/5 rounded-xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3">
                <i className="fa-solid fa-credit-card text-2xl text-cyan-400"></i>
              </div>
              <p className="text-white font-bold text-base mb-1">
                Pase o inserte la tarjeta en el POS físico
              </p>
              <p className="text-slate-400 text-xs mb-3">
                Monto exacto a cobrar en terminal:{" "}
                <span className="text-white font-bold text-sm">S/ {totalNeto.toFixed(2)}</span>
              </p>
              <p className="text-[11px] text-green-400">
                <i className="fa-solid fa-check-circle mr-1"></i>
                Terminal listo para recibir autorización
              </p>
            </div>
          )}

          {/* YAPE / PLIN: Código QR rápido de caja */}
          {metodoPago === "Yape" && (
            <div className="text-center py-6 bg-dark-900 border border-white/5 rounded-xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3">
                <i className="fa-solid fa-qrcode text-2xl text-purple-400"></i>
              </div>
              <p className="text-white font-bold text-base mb-1">
                QR Yape / Plin en Pantalla de Caja
              </p>
              <p className="text-slate-400 text-xs mb-3">
                El cliente debe transferir exactamente:{" "}
                <span className="text-brand-yellow font-bold text-sm">S/ {totalNeto.toFixed(2)}</span>
              </p>
              <span className="inline-block bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
                Esperando confirmación visual de transferencia
              </span>
            </div>
          )}
        </div>

        {/* Botón Principal de Cobro */}
        <button
          type="submit"
          disabled={procesando}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-xl shadow-green-600/20"
        >
          {procesando ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Emitiendo Comprobante...</span>
            </>
          ) : (
            <>
              <span>Cobrar S/ {totalNeto.toFixed(2)}</span>
              <i className="fa-solid fa-check"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
