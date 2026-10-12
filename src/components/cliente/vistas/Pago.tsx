"use client";

import { abrirModalLegal, toggleMetodoPago, toggleTipoDocumento } from "@/src/lib/ui/cliente";
import { aplicarCumpleanosSocio, aplicarCupon, aplicarPuntosSocio, formatearNumeroTarjetaEnVivo, formatearVencimientoTarjetaEnVivo, restringirSoloNumeros } from "@/src/lib/ui/common";
import { cambiarVista, procesarPago } from "@/src/lib/ui/nav";

export default function Pago() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-40 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-36" id="vista-pago">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8 flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3">
            <button className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors" onClick={(event) => { cambiarVista('vista-pago', 'vista-dulceria'); }}>
              <i className="fa-solid fa-arrow-left"></i>
              {" "}
              Volver a Dulcería
            </button>
            {" "}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
              Detalles de Pago
            </h2>
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 mb-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">
                Comprobante de Pago
              </h3>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input defaultChecked className="accent-brand-blue w-4 h-4" name="comprobante" type="radio" value="boleta" onChange={(event) => { toggleTipoDocumento(); }} />
                  {" "}
                  <span className="font-semibold">
                    Boleta
                  </span>
                </label>
                {" "}
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input className="accent-brand-blue w-4 h-4" name="comprobante" type="radio" value="factura" onChange={(event) => { toggleTipoDocumento(); }} />
                  {" "}
                  <span className="font-semibold">
                    Factura
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors" id="campo-dni" inputMode="numeric" maxLength={8} placeholder="Número de DNI" type="text" onInput={(event) => { restringirSoloNumeros(event.currentTarget, 8); }} />
                </div>
                <div>
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors hidden" id="campo-ruc" inputMode="numeric" maxLength={11} placeholder="Número de RUC" type="text" onInput={(event) => { restringirSoloNumeros(event.currentTarget, 11); }} />
                </div>
                <div className="md:col-span-2">
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors" id="campo-nombre" placeholder="Nombres y Apellidos" type="text" />
                </div>
                <div className="md:col-span-2">
                  <input className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors" id="campo-correo" placeholder="Correo Electrónico (para tu ticket)" type="email" />
                </div>
              </div>
              {" "}
              <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer select-none mt-4">
                <input className="mt-0.5 accent-brand-blue w-4 h-4 flex-shrink-0" id="check-privacidad-pago" type="checkbox" />
                {" "}
                <span>
                  Acepto las
                  {" "}
                  <a className="text-brand-yellow hover:underline" href="#" onClick={(event) => { abrirModalLegal('privacidad'); event.preventDefault(); }}>
                    Políticas de Privacidad
                  </a>
                  {" "}
                  (Ley N° 29733).
                </span>
              </label>
            </div>
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 mb-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">
                <i className="fa-solid fa-tag text-brand-yellow mr-2"></i>
                Cupón de Descuento
              </h3>
              <div className="flex gap-3">
                <input className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-brand-yellow transition-colors" id="input-cupon" placeholder="Ej: VERANO20" type="text" />
                {" "}
                <button className="bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-colors" type="button" onClick={(event) => { aplicarCupon(); }}>
                  Aplicar
                </button>
              </div>
            </div>
            <div className="hidden bg-dark-800 p-6 rounded-2xl border border-white/5 mb-8 shadow-xl" id="bloque-canje-puntos-pago">
              <h3 className="text-xl font-bold text-white mb-1">
                <i className="fa-solid fa-star text-brand-yellow mr-2"></i>
                Canjear Puntos Socio Náutica
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                Tienes
                {" "}
                <span className="text-brand-yellow font-bold" id="pago-puntos-disponibles">
                  540
                </span>
                {" "}
                puntos disponibles (cada punto equivale a S/ 0.10 de descuento).
              </p>
              <div className="flex gap-3">
                <input className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-colors" id="input-puntos-canje" min="0" placeholder="Cantidad de puntos" type="number" />
                {" "}
                <button className="bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-colors" type="button" onClick={(event) => { aplicarPuntosSocio(); }}>
                  Canjear
                </button>
              </div>
            </div>
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">
                Método de Pago
              </h3>
              <div className="border border-white/10 rounded-xl overflow-hidden mb-4 transition-all">
                <label className="flex items-center gap-3 p-4 bg-dark-700 cursor-pointer border-b border-white/10 hover:bg-dark-600 transition-colors">
                  <input defaultChecked className="accent-brand-blue w-4 h-4" name="paymethod" type="radio" value="card" onChange={(event) => { toggleMetodoPago(); }} />
                  {" "}
                  <span className="text-white font-bold flex-grow">
                    Tarjeta de Crédito / Débito
                  </span>
                  {" "}
                  <div className="flex gap-2 text-xl text-white/70">
                    <i className="fa-brands fa-cc-visa"></i>
                    {" "}
                    <i className="fa-brands fa-cc-mastercard"></i>
                    {" "}
                    <i className="fa-brands fa-cc-amex"></i>
                  </div>
                </label>
                {" "}
                <div className="p-5 bg-dark-900 flex flex-col gap-4" id="formulario-tarjeta">
                  <input className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue font-mono" id="campo-numero-tarjeta" inputMode="numeric" maxLength={19} placeholder="Número de Tarjeta" type="text" onInput={(event) => { formatearNumeroTarjetaEnVivo(event.currentTarget); }} />
                  {" "}
                  <div className="flex gap-4">
                    <input className="w-1/2 bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue font-mono" id="campo-vencimiento-tarjeta" inputMode="numeric" maxLength={5} placeholder="MM/AA" type="text" onInput={(event) => { formatearVencimientoTarjetaEnVivo(event.currentTarget); }} />
                    {" "}
                    <input className="w-1/2 bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue font-mono" id="campo-cvv-tarjeta" inputMode="numeric" maxLength={4} placeholder="CVV" type="text" onInput={(event) => { restringirSoloNumeros(event.currentTarget, 4); }} />
                  </div>
                  {" "}
                  <input className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue" id="campo-titular-tarjeta" placeholder="Nombre del Titular" type="text" />
                </div>
              </div>
              <div className="border border-white/10 rounded-xl overflow-hidden transition-all">
                <label className="flex items-center gap-3 p-4 bg-dark-700 cursor-pointer hover:bg-dark-600 transition-colors">
                  <input className="accent-brand-blue w-4 h-4" name="paymethod" type="radio" value="yape" onChange={(event) => { toggleMetodoPago(); }} />
                  {" "}
                  <span className="text-white font-bold flex-grow">
                    Billetera Digital (Yape / Plin)
                  </span>
                  {" "}
                  <div className="w-7 h-7 rounded bg-[#742384] text-white flex items-center justify-center text-sm font-bold shadow-md">
                    Y
                  </div>
                </label>
                {" "}
                <div className="p-6 bg-dark-900 hidden flex flex-col items-center text-center" id="formulario-yape">
                  <div className="bg-white p-2 rounded-xl mb-4 w-40 h-40 flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-qrcode text-6xl text-black"></i>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">
                    Escanea el código QR desde tu app.
                  </p>
                  <p className="text-brand-yellow font-bold text-2xl mb-4" id="monto-yape">
                    S/ 76.00
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 sticky top-28 shadow-xl">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-4">
                Resumen Final
              </h3>
              <div className="mb-4" id="bloque-pelicula-pago">
                <h4 className="font-bold text-brand-yellow text-lg" data-bind="titulo" id="pago-titulo-pelicula">
                  Spider-Man: Un Nuevo Día
                </h4>
                <p className="text-slate-300 font-semibold text-sm mt-1" data-bind="detalle" id="pago-detalle-pelicula">
                  Sáb, 10 Oct • 19:00 • 2D Doblada
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                <div className="flex justify-between items-center" id="bloque-entradas-resumen-pago">
                  <span className="text-slate-400">
                    Entradas:
                  </span>
                  {" "}
                  <span className="text-white font-semibold" id="pago-total-entradas">
                    S/ 36.00
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">
                    Dulcería:
                  </span>
                  {" "}
                  <span className="text-white font-semibold" id="pago-total-dulces">
                    S/ 40.00
                  </span>
                </div>
                <div className="hidden flex justify-between items-center" id="fila-descuento-cupon">
                  <span className="text-brand-yellow text-sm">
                    Cupón
                    {" "}
                    <span className="font-mono" id="pago-descuento-codigo"></span>
                    :
                  </span>
                  {" "}
                  <span className="text-brand-yellow font-semibold" id="pago-descuento-monto"></span>
                </div>
                <div className="hidden flex justify-between items-center" id="fila-descuento-puntos">
                  <span className="text-brand-yellow text-sm">
                    <span id="pago-puntos-canjeados-texto"></span>
                    {" "}
                    pts canjeados:
                  </span>
                  {" "}
                  <span className="text-brand-yellow font-semibold" id="pago-descuento-puntos-monto"></span>
                </div>
                <div className="hidden mt-4 pt-4 border-t border-white/5" id="bloque-cumpleanos">
                  <div className="bg-gradient-to-r from-brand-yellow/20 to-transparent p-4 rounded-xl border border-brand-yellow/30 flex justify-between items-center">
                    <div>
                      <h4 className="text-brand-yellow font-bold text-sm">
                        <i className="fa-solid fa-cake-candles mr-2"></i>
                        ¡Feliz mes de cumpleaños!
                      </h4>
                      <p className="text-slate-300 text-xs mt-1">
                        Tienes 1 entrada 2D gratis disponible.
                      </p>
                    </div>
                    {" "}
                    <button className="bg-brand-yellow hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-[0_0_10px_rgba(220,158,63,0.3)]" id="btn-aplicar-cumpleanos" type="button" onClick={(event) => { aplicarCumpleanosSocio(); }}>
                      Reclamar
                    </button>
                  </div>
                </div>
                <div className="hidden flex justify-between items-center mt-2" id="fila-descuento-cumpleanos">
                  <span className="text-brand-yellow text-sm">
                    <i className="fa-solid fa-cake-candles mr-1"></i>
                    {" "}
                    Beneficio Cumpleaños:
                  </span>
                  {" "}
                  <span className="text-brand-yellow font-semibold" id="pago-descuento-cumpleanos-monto"></span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-blue bg-dark-900 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-300 font-bold">
                    TOTAL:
                  </span>
                  {" "}
                  <span className="text-3xl font-bold text-brand-yellow" id="pago-total-general">
                    S/ 76.00
                  </span>
                </div>
                {" "}
                <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg shadow-lg mt-6" id="btn-confirmar-pago" onClick={(event) => { procesarPago(); }}>
                  Confirmar y Pagar
                  {" "}
                  <i className="fa-solid fa-check-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
