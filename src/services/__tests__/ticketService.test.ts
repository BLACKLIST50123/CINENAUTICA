import { describe, it, expect } from "vitest";
import { TicketService } from "../ticketService";

describe("TicketService - Desglose de Comprobantes e Impresión", () => {
  it("debe calcular correctamente el desglose de IGV al 18%", () => {
    // Total S/ 118.00 -> Op Gravada S/ 100.00 + IGV S/ 18.00
    const r1 = TicketService.calcularDesgloseIGV(118.0);
    expect(r1.subtotalSinIgv).toBe(100.0);
    expect(r1.igv).toBe(18.0);

    // Total S/ 36.00 -> Op Gravada S/ 30.51 + IGV S/ 5.49
    const r2 = TicketService.calcularDesgloseIGV(36.0);
    expect(r2.subtotalSinIgv).toBe(30.51);
    expect(r2.igv).toBe(5.49);
    expect(Number((r2.subtotalSinIgv + r2.igv).toFixed(2))).toBe(36.0);
  });

  it("debe formatear fechas ISO correctamente a formato peruano", () => {
    const res = TicketService.formatearFechaHora("2026-10-14T18:30:00Z");
    expect(res.fecha).toBeDefined();
    expect(res.hora).toBeDefined();
    expect(res.fecha.length).toBeGreaterThan(5);
  });

  it("debe manejar órdenes no existentes retornando null de forma segura", async () => {
    const res = await TicketService.obtenerTicket("00000000-0000-0000-0000-000000000000");
    expect(res).toBeNull();
  });
});
