import { describe, it, expect } from "vitest";
import { PagoService } from "../pagoService";

describe("PagoService - Lógica de Negocio y Reglas de Compra", () => {
  it("debe validar correctamente DNI para Boleta y RUC para Factura", () => {
    // Boleta: 8 dígitos exactos
    expect(PagoService.validarDocumento("Boleta", "72481920").valido).toBe(true);
    expect(PagoService.validarDocumento("Boleta", "123").valido).toBe(false);
    expect(PagoService.validarDocumento("Boleta", "7248192A").valido).toBe(false);

    // Factura: 11 dígitos exactos iniciando con 10 o 20
    expect(PagoService.validarDocumento("Factura", "20601234567").valido).toBe(true);
    expect(PagoService.validarDocumento("Factura", "10724819201").valido).toBe(true);
    expect(PagoService.validarDocumento("Factura", "15123456789").valido).toBe(false);
    expect(PagoService.validarDocumento("Factura", "206012345").valido).toBe(false);
  });

  it("debe validar correos electrónicos y nombres de contacto", () => {
    expect(PagoService.validarCorreo("cliente@gmail.com")).toBe(true);
    expect(PagoService.validarCorreo("correo_invalido")).toBe(false);
    expect(PagoService.validarCorreo("test@dominio.com.pe")).toBe(true);

    expect(PagoService.validarNombre("Ana")).toBe(true);
    expect(PagoService.validarNombre("Ed")).toBe(false);
    expect(PagoService.validarNombre("  Juan Perez  ")).toBe(true);
  });

  it("debe calcular el canje de puntos de Socio respetando mínimos y tope del 50%", () => {
    // Menos del mínimo de 50 puntos
    const r1 = PagoService.calcularDescuentoPuntos(40, 200, 100);
    expect(r1.error).toBeDefined();
    expect(r1.descuentoSoles).toBe(0);

    // Saldo insuficiente
    const r2 = PagoService.calcularDescuentoPuntos(150, 100, 100);
    expect(r2.error).toBeDefined();

    // 100 puntos = S/ 10.00 de descuento en subtotal de S/ 60
    const r3 = PagoService.calcularDescuentoPuntos(100, 500, 60);
    expect(r3.descuentoSoles).toBe(10);
    expect(r3.puntosValidados).toBe(100);

    // Límite del 50% de la compra (subtotal S/ 40 -> max S/ 20 de descuento)
    // 300 puntos pedirían S/ 30, pero se debe limitar a S/ 20 (200 puntos)
    const r4 = PagoService.calcularDescuentoPuntos(300, 500, 40);
    expect(r4.descuentoSoles).toBe(20);
    expect(r4.puntosValidados).toBe(200);
  });

  it("debe verificar correctamente el beneficio de cumpleaños", () => {
    const hoy = new Date();
    const mesActual = hoy.getUTCMonth();
    const anioActual = hoy.getUTCFullYear();

    // Cumpleañero en el mes actual que no lo usó este año
    const fechaCumpleEsteMes = `1995-${String(mesActual + 1).padStart(2, "0")}-15`;
    expect(
      PagoService.verificarBeneficioCumpleanos(fechaCumpleEsteMes, null)
    ).toBe(true);

    // Cumpleañero que ya lo usó este año
    expect(
      PagoService.verificarBeneficioCumpleanos(fechaCumpleEsteMes, anioActual)
    ).toBe(false);

    // Cumpleañero de otro mes
    const otroMes = (mesActual + 6) % 12;
    const fechaOtroMes = `1990-${String(otroMes + 1).padStart(2, "0")}-10`;
    expect(
      PagoService.verificarBeneficioCumpleanos(fechaOtroMes, null)
    ).toBe(false);
  });

  it("debe consultar y validar el cupón semilla VERANO20 desde Supabase", async () => {
    // Sede 1 (Chimbote), Subtotal S/ 100
    const res = await PagoService.validarYAplicarCupon("VERANO20", 1, 100);
    expect(res.valido).toBe(true);
    expect(res.cupon?.codigo).toBe("VERANO20");
    expect(res.cupon?.tipo_descuento).toBe("Porcentaje");
    expect(res.cupon?.valor).toBe(20);
    expect(res.montoDescuento).toBe(20); // 20% de 100 = 20
  });
});
