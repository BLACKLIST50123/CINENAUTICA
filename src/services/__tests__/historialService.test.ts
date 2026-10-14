import { describe, it, expect, vi } from "vitest";
import { HistorialService } from "../historialService";

describe("HistorialService", () => {
  it("formatearFecha retorna formato amigable peruano", () => {
    const fecha = "2026-10-14T19:45:00.000Z";
    const res = HistorialService.formatearFecha(fecha);
    expect(res).toContain("2026");
    expect(res).toContain("Oct");
  });

  it("formatearEstado retorna badges y etiquetas correctas", () => {
    const pagada = HistorialService.formatearEstado("Pagada");
    expect(pagada.label).toBe("Pagada");
    expect(pagada.badgeClase).toContain("emerald");

    const cancelada = HistorialService.formatearEstado("Cancelada");
    expect(cancelada.label).toBe("Cancelada");
    expect(cancelada.badgeClase).toContain("red");

    const pendiente = HistorialService.formatearEstado("Pendiente");
    expect(pendiente.label).toBe("Pendiente");
    expect(pendiente.badgeClase).toContain("amber");
  });

  it("obtenerResumenAsientos resume asientos y cantidad de entradas", () => {
    const entradas: any[] = [
      { id_detalle_entrada: "1", codigo_asiento: "D5" },
      { id_detalle_entrada: "2", codigo_asiento: "D6" },
    ];
    const resumen = HistorialService.obtenerResumenAsientos(entradas);
    expect(resumen).toBe("D5, D6 (2 entradas)");

    const vacio = HistorialService.obtenerResumenAsientos([]);
    expect(vacio).toBe("Sin entradas de cine");
  });

  it("obtenerResumenProductos formatea la lista de dulcería", () => {
    const productos: any[] = [
      { id_detalle_producto: "1", cantidad: 1, nombre_producto: "Combo Dúo" },
      { id_detalle_producto: "2", cantidad: 2, nombre_producto: "Gaseosa Grande" },
    ];
    const resumen = HistorialService.obtenerResumenProductos(productos);
    expect(resumen).toBe("1x Combo Dúo, 2x Gaseosa Grande");

    const vacio = HistorialService.obtenerResumenProductos([]);
    expect(vacio).toBe("");
  });
});
