// Servicio de Negocio para Emisión, Formato y Renderizado de Tickets y Comprobantes (Fase 7)
import { OrdenDao } from "@/src/daos/OrdenDao";
import type { OrdenCompletaDTO } from "@/src/dtos/orden";

export class TicketService {
  /**
   * Obtiene la información completa de la orden para renderizar el ticket
   */
  static async obtenerTicket(idOrden: string): Promise<OrdenCompletaDTO | null> {
    if (!idOrden || !idOrden.trim()) return null;
    return await OrdenDao.obtenerOrdenCompleta(idOrden.trim());
  }

  /**
   * Calcula el desglose de IGV oficial (18%)
   */
  static calcularDesgloseIGV(total: number): { subtotalSinIgv: number; igv: number } {
    const subtotalSinIgv = Number((total / 1.18).toFixed(2));
    const igv = Number((total - subtotalSinIgv).toFixed(2));
    return { subtotalSinIgv, igv };
  }

  /**
   * Formatea fecha y hora para visualización en comprobante
   */
  static formatearFechaHora(fechaIso: string): { fecha: string; hora: string } {
    try {
      const d = new Date(fechaIso);
      const fecha = d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const hora = d.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return { fecha, hora };
    } catch {
      return { fecha: fechaIso, hora: "" };
    }
  }

  /**
   * Dispara la impresión nativa adaptando la hoja al tamaño del ticket/comprobante,
   * con márgenes interiores adecuados y sin redondear las puntas.
   */
  static imprimirElemento(elementoId: string, tituloVentana = "Imprimir Comprobante"): void {
    if (typeof window === "undefined") return;

    const el = document.getElementById(elementoId);
    if (!el) {
      window.print();
      return;
    }

    const esComprobante = elementoId.includes("comprobante") || el.id.includes("comprobante");
    const anchoMm = 85;

    const contenidoHtml = el.innerHTML;

    const printWindow = window.open("", "_blank", "width=480,height=750");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${tituloVentana}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'brand-blue': '#0A7EB1',
                    'brand-dark-blue': '#075A80',
                    'brand-yellow': '#DC9E3F',
                    'brand-red': '#DC2026',
                    'dark-900': '#050B14',
                    'dark-800': '#0D1627',
                  }
                }
              }
            }
          </script>
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
              border-radius: 0 !important; /* Sin redondear las puntas */
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background-color: #ffffff !important;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .contenedor-hoja {
              width: ${anchoMm}mm;
              margin: 0 auto;
              background: #ffffff;
            }
            .tarjeta-impresion {
              width: 100%;
              background: #ffffff;
              color: #000000;
              display: flex;
              flex-direction: column;
              border-radius: 0 !important;
            }
            /* Ticket de cine oficial */
            .tipo-ticket {
              background: #fdfcfa !important;
              border: 1px solid #cbd5e1 !important;
            }
            .tipo-ticket * {
              border-radius: 0 !important;
            }
            /* Comprobante fiscal con margen suficiente para que los textos no queden pegados al borde */
            .tipo-comprobante {
              background: #ffffff !important;
              padding: 24px 20px !important;
              border-top: 8px solid #1e293b !important;
              border-left: 1px solid #cbd5e1 !important;
              border-right: 1px solid #cbd5e1 !important;
              border-bottom: 1px solid #cbd5e1 !important;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
            }
            .tipo-comprobante * {
              border-radius: 0 !important;
            }
            .bg-brand-blue { background-color: #0A7EB1 !important; color: #ffffff !important; }
            .text-brand-blue { color: #0A7EB1 !important; }
            .bg-brand-yellow { background-color: #DC9E3F !important; }
            .text-brand-yellow { color: #DC9E3F !important; }
            .bg-dark-900 { background-color: #050B14 !important; color: #ffffff !important; }
            table { width: 100% !important; border-collapse: collapse !important; }
          </style>
        </head>
        <body>
          <div class="contenedor-hoja">
            <div class="tarjeta-impresion ${esComprobante ? 'tipo-comprobante' : 'tipo-ticket'}">
              ${contenidoHtml}
            </div>
          </div>
          <script>
            function ejecutarImpresion() {
              try {
                var tarjeta = document.querySelector('.tarjeta-impresion');
                if (tarjeta) {
                  var pxAltura = Math.max(tarjeta.scrollHeight, tarjeta.offsetHeight, tarjeta.getBoundingClientRect().height);
                  var mmAltura = Math.ceil((pxAltura * 25.4) / 96) + 4;
                  var styleTag = document.createElement('style');
                  styleTag.innerHTML = '@page { size: ${anchoMm}mm ' + mmAltura + 'mm; margin: 0; } @media print { html, body { width: ${anchoMm}mm; height: ' + mmAltura + 'mm; margin: 0; padding: 0; } }';
                  document.head.appendChild(styleTag);
                }
              } catch(e) {}
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() { window.close(); }, 800);
              }, 450);
            }
            if (document.readyState === 'complete') {
              ejecutarImpresion();
            } else {
              window.addEventListener('load', ejecutarImpresion);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
