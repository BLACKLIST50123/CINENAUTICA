import { describe, it, expect } from "vitest";
import { SocioService } from "../socioService";
import type { NivelSocioDTO } from "@/src/dtos/socio";

const NIVELES_MOCK: NivelSocioDTO[] = [
  {
    id_nivel: 1,
    codigo: "BRONCE",
    nombre: "Bronce",
    min_puntos: 0,
    multiplicador: 1.0,
    fila_preferencial: false,
    color_hex: "#CD7F32",
  },
  {
    id_nivel: 2,
    codigo: "PLATA",
    nombre: "Plata",
    min_puntos: 300,
    multiplicador: 1.1,
    fila_preferencial: true,
    color_hex: "#C0C0C0",
  },
  {
    id_nivel: 3,
    codigo: "ORO",
    nombre: "Oro",
    min_puntos: 800,
    multiplicador: 1.25,
    fila_preferencial: true,
    color_hex: "#FFD700",
  },
];

describe("SocioService - Progresión de Niveles y Beneficios", () => {
  it("debe calcular el progreso para un usuario en nivel Bronce", () => {
    // 150 puntos en Bronce (0 a 300) = 50% de avance, faltan 150 para Plata
    const prog = SocioService.calcularProgreso(150, NIVELES_MOCK);
    expect(prog.nivel_actual).toBe("Bronce");
    expect(prog.siguiente_nivel).toBe("Plata");
    expect(prog.porcentaje_progreso).toBe(50);
    expect(prog.puntos_faltantes).toBe(150);
  });

  it("debe calcular el progreso para un usuario en nivel Plata", () => {
    // 550 puntos en Plata (300 a 800)
    // Avance = 550 - 300 = 250 de 500 = 50% de avance, faltan 250 para Oro
    const prog = SocioService.calcularProgreso(550, NIVELES_MOCK);
    expect(prog.nivel_actual).toBe("Plata");
    expect(prog.siguiente_nivel).toBe("Oro");
    expect(prog.porcentaje_progreso).toBe(50);
    expect(prog.puntos_faltantes).toBe(250);
  });

  it("debe marcar progreso al 100% para nivel Oro (máximo nivel)", () => {
    const prog = SocioService.calcularProgreso(950, NIVELES_MOCK);
    expect(prog.nivel_actual).toBe("Oro");
    expect(prog.siguiente_nivel).toBeNull();
    expect(prog.porcentaje_progreso).toBe(100);
    expect(prog.puntos_faltantes).toBe(0);
  });

  it("debe evaluar correctamente el beneficio de cumpleaños", () => {
    const hoy = new Date();
    const mesActual = hoy.getUTCMonth();
    const anioActual = hoy.getUTCFullYear();

    // Cumpleañero del mes actual que no lo ha usado
    const fechaEsteMes = `1998-${String(mesActual + 1).padStart(2, "0")}-20`;
    const resEsteMes = SocioService.evaluarCumpleanos(fechaEsteMes, null);
    expect(resEsteMes.es_mes_actual).toBe(true);
    expect(resEsteMes.disponible).toBe(true);
    expect(resEsteMes.ya_usado).toBe(false);

    // Cumpleañero del mes actual que ya lo usó este año
    const resUsado = SocioService.evaluarCumpleanos(fechaEsteMes, anioActual);
    expect(resUsado.es_mes_actual).toBe(true);
    expect(resUsado.disponible).toBe(false);
    expect(resUsado.ya_usado).toBe(true);

    // Sin fecha de nacimiento
    const resSinFecha = SocioService.evaluarCumpleanos(null, null);
    expect(resSinFecha.disponible).toBe(false);
    expect(resSinFecha.es_mes_actual).toBe(false);
  });
});
