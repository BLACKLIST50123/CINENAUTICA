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
   * Dispara la impresión nativa de un elemento térmico específico
   */
  static imprimirElemento(elementoId: string, tituloVentana = "Imprimir Ticket"): void {
    if (typeof window === "undefined") return;

    const el = document.getElementById(elementoId);
    if (!el) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=420,height=650");
    if (!printWindow) {
      window.print();
      return;
    }

    const contenidoHtml = el.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${tituloVentana}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 4mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 6px;
              width: 72mm;
              font-size: 11px;
            }
            * { box-sizing: border-box; }
            h2, h3, p { margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 3px 0; font-size: 10px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .border-b { border-bottom: 1px dashed #666; }
            .border-t { border-top: 1px dashed #666; }
            .py-2 { padding-top: 6px; padding-bottom: 6px; }
            .my-2 { margin-top: 6px; margin-bottom: 6px; }
            svg { display: block; margin: 0 auto; max-width: 120px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${contenidoHtml}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
