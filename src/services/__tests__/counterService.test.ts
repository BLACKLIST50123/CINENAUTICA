import { describe, it, expect, vi } from "vitest";
import { CounterService } from "../counterService";
import type { VentaCounterInputDTO } from "@/src/dtos/counter";

describe("CounterService - Reglas de Negocio POS", () => {
  it("debe rechazar ventas sin items seleccionados (subtotal 0)", async () => {
    const inputVacio: VentaCounterInputDTO = {
      modo: "mixto",
      id_sede: 1,
      tipo_comprobante: "Boleta",
      numero_documento: "72849102",
      nombre_cliente: "Juan Perez",
      metodo_pago: "Efectivo",
      entradas: [],
      productos: [],
    };

    await expect(CounterService.procesarVentaCounter(inputVacio)).rejects.toThrow(
      "No hay productos ni entradas seleccionadas."
    );
  });

  it("debe rechazar cobro en efectivo si el monto recibido es menor al total", async () => {
    const inputInsuficiente: VentaCounterInputDTO = {
      modo: "dulceria",
      id_sede: 1,
      tipo_comprobante: "Boleta",
      numero_documento: "72849102",
      nombre_cliente: "Carlos Lopez",
      metodo_pago: "Efectivo",
      monto_recibido: 20, // Menor que 35
      entradas: [],
      productos: [
        {
          id_producto: "p1",
          nombre: "Combo Dúo",
          precio_unitario: 35,
          cantidad: 1,
          subtotal: 35,
        },
      ],
    };

    await expect(CounterService.procesarVentaCounter(inputInsuficiente)).rejects.toThrow(
      /Monto recibido.*es menor al total a pagar/
    );
  });

  it("debe validar DNI de 8 dígitos para registro express de socio", async () => {
    await expect(
      CounterService.registrarSocioRapido({
        dni: "123",
        nombres: "Ana",
        apellidos: "Gomez",
        telefono: "987654321",
        correo: "ana@gmail.com",
      })
    ).rejects.toThrow("El DNI debe tener exactamente 8 dígitos.");

    await expect(
      CounterService.registrarSocioRapido({
        dni: "72849102",
        nombres: "",
        apellidos: "Gomez",
        telefono: "987654321",
        correo: "ana@gmail.com",
      })
    ).rejects.toThrow("Nombres y apellidos son requeridos.");
  });
});
