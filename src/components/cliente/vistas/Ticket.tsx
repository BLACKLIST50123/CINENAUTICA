"use client";

import { descargarPDF } from "@/src/lib/ui/common";
import { cambiarVista } from "@/src/lib/ui/nav";

export default function Ticket() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-40 transition-opacity duration-300 absolute top-0 left-0 z-40 pt-36" id="vista-ticket">
        <div className="max-w-[1000px] mx-auto px-4 py-8 flex flex-col items-center">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
              <i className="fa-solid fa-check text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              ¡Compra Exitosa!
            </h2>
            <p className="text-slate-400 text-lg">
              Tu reserva está confirmada. Descarga tus comprobantes.
            </p>
          </div>
          <div className="mb-8 bg-dark-800 border border-brand-yellow/30 rounded-2xl px-6 py-4 flex items-center gap-3 max-w-md" id="ticket-puntos-ganados">
            <i className="fa-solid fa-star text-2xl text-brand-yellow"></i>
            {" "}
            <p className="text-white text-sm">
              <span id="ticket-puntos-ganados-sujeto">
                Ganaste
              </span>
              {" "}
              <span className="font-bold text-brand-yellow" id="ticket-puntos-ganados-cantidad">
                76
              </span>
              {" "}
              puntos Náutica con esta compra.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-start">
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="bg-[#fdfcfa] w-[350px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-black" id="ticket-imprimible">
                <div className="bg-brand-blue text-white p-4 flex justify-between items-center">
                  <span className="font-bold tracking-widest text-lg">
                    CINE NÁUTICA
                  </span>
                  {" "}
                  <i className="fa-solid fa-film text-xl"></i>
                </div>
                <div className="p-6 pb-2">
                  <h3 className="text-2xl font-bold text-black uppercase mb-1 leading-tight" data-bind="titulo" id="pdf-titulo-pelicula">
                    Spider-Man: Un Nuevo Día
                  </h3>
                  <p className="text-brand-blue font-bold text-sm mb-4" data-bind="formato" id="pdf-formato">
                    2D DOBLADA
                  </p>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-slate-800 mb-4">
                    <div>
                      <p className="text-slate-500 text-xs uppercase">
                        Fecha
                      </p>
                      <p className="font-bold" data-bind="fecha" id="pdf-fecha">
                        26 Ago
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase">
                        Hora
                      </p>
                      <p className="font-bold" data-bind="hora" id="pdf-hora">
                        18:00
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase">
                        Cine
                      </p>
                      <p className="font-bold" data-bind="cine" id="pdf-cine">
                        Cine Náutica
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase">
                        Asientos
                      </p>
                      <p className="font-bold text-brand-blue" id="pdf-asientos">
                        D5, D6
                      </p>
                    </div>
                    <div className="col-span-2" id="pdf-direccion-fila">
                      <p className="text-slate-500 text-xs uppercase">
                        Dirección
                      </p>
                      <p className="font-bold text-xs" data-bind="sededir">
                        Av. Principal 123, Megaplaza Chimbote
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 mt-2">
                    <p className="text-slate-500 text-xs uppercase mb-1 font-bold">
                      <i className="fa-solid fa-bowl-food text-yellow-600"></i>
                      {" "}
                      Tu Dulcería (Reclamar en barra)
                    </p>
                    <ul className="text-sm font-semibold text-slate-800 leading-tight space-y-1" id="pdf-dulces">
                      <li>
                        1x Combo Dúo
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="ticket-cutout px-6">
                  <div className="barcode w-full mb-2 opacity-80"></div>
                  <p className="text-center text-xs text-slate-500 tracking-[0.3em] font-mono">
                    CR-
                    <span id="pdf-codigo">
                      482913
                    </span>
                  </p>
                </div>
                <div className="bg-dark-900 p-2 text-center text-white mt-4">
                  <p id="pdf-instruccion-ticket" className="text-[10px] text-slate-400">
                    Presenta este código QR o impreso para ingresar a la sala.
                  </p>
                </div>
              </div>
              {" "}
              <button className="mt-6 bg-brand-blue hover:bg-brand-dark-blue text-white py-3 px-6 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2 w-full justify-center" onClick={(event) => { descargarPDF('ticket-imprimible', 'Ticket_Náutica.pdf'); }}>
                <i className="fa-solid fa-download"></i>
                {" "}
                Descargar Ticket
              </button>
            </div>
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="bg-white w-[350px] shadow-2xl p-6 border-t-8 border-slate-800 text-black font-mono text-sm relative" id="comprobante-imprimible">
                <div className="text-center border-b border-dashed border-slate-400 pb-4 mb-4">
                  <h2 className="text-xl font-bold uppercase tracking-wider">
                    Cine Náutica S.A.C.
                  </h2>
                  <p>
                    RUC: 20512345678
                  </p>
                  <p data-bind="sededir">
                    Av. Principal 123, Megaplaza Chimbote
                  </p>
                  <p className="mt-2 font-bold" id="pdf-tipo-documento">
                    BOLETA ELECTRÓNICA
                  </p>
                  <p>
                    B001-000
                    <span id="pdf-numero-comprobante">
                      00481
                    </span>
                  </p>
                </div>
                <div className="mb-4 text-xs">
                  <p>
                    <strong>
                      Cliente:
                    </strong>
                    {" "}
                    <span id="pdf-nombre-cliente">
                      Juan Pérez
                    </span>
                  </p>
                  <p>
                    <strong>
                      DNI/RUC:
                    </strong>
                    {" "}
                    <span id="pdf-documento-cliente">
                      12345678
                    </span>
                  </p>
                  <p>
                    <strong>
                      Fecha Emisión:
                    </strong>
                    {" "}
                    <span id="pdf-fecha-emision">
                      09/10/2026
                    </span>
                  </p>
                </div>
                <table className="w-full text-left mb-4 text-xs">
                  <thead>
                    <tr className="border-b border-dashed border-slate-400">
                      <th className="pb-1">
                        Cant. / Desc.
                      </th>
                      <th className="text-right pb-1">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody id="pdf-items-comprobante">
                    <tr>
                      <td className="py-1">
                        2x Entrada General
                      </td>
                      <td className="text-right">
                        S/ 36.00
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">
                        1x Combo Dúo
                      </td>
                      <td className="text-right">
                        S/ 40.00
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="border-t border-dashed border-slate-400 pt-2 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span>
                      OP. GRAVADA
                    </span>
                    <span id="pdf-subtotal">
                      S/ 64.41
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>
                      IGV (18%)
                    </span>
                    <span id="pdf-igv">
                      S/ 11.59
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-slate-400">
                    <span>
                      TOTAL
                    </span>
                    <span id="pdf-total-comprobante">
                      S/ 76.00
                    </span>
                  </div>
                </div>
                <div className="text-center text-xs">
                  <div className="w-20 h-20 mx-auto border-2 border-slate-300 flex items-center justify-center mb-2 bg-slate-100">
                    <i className="fa-solid fa-qrcode text-4xl text-slate-400"></i>
                  </div>
                  <p>
                    Representación impresa del comprobante electrónico.
                  </p>
                </div>
              </div>
              {" "}
              <button className="mt-6 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2 w-full justify-center" onClick={(event) => { descargarPDF('comprobante-imprimible', 'Comprobante_Náutica.pdf'); }}>
                <i className="fa-solid fa-file-invoice"></i>
                {" "}
                Descargar Comprobante
              </button>
            </div>
          </div>
          {" "}
          <button className="mt-12 text-brand-yellow hover:text-white font-bold transition-colors underline" onClick={(event) => { cambiarVista('vista-ticket', 'vista-inicio'); }}>
            Volver al Inicio
          </button>
        </div>
      </div>
    </>
  );
}
