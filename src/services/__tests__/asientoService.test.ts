import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { AsientoService, LIMITE_MAXIMO_ASIENTOS } from "../asientoService";
import { TarifaDao } from "@/src/daos/TarifaDao";
import { AsientoDao } from "@/src/daos/AsientoDao";

describe("AsientoService - Motor de Precios y Reglas de Negocio (Fase 4)", () => {
  it("debe calcular correctamente el precio con descuento según tipo de entrada", () => {
    const baseConFormato = 18; // ej. General 2D día fin de semana

    // General (0% descuento) -> 18.00
    const precioGeneral = AsientoService.calcularPrecioEntrada(baseConFormato, 0);
    expect(precioGeneral).toBe(18);

    // Niño (30% descuento) -> 18 * 0.7 = 12.60
    const precioNino = AsientoService.calcularPrecioEntrada(baseConFormato, 30);
    expect(precioNino).toBe(12.6);

    // Adulto Mayor (20% descuento) -> 18 * 0.8 = 14.40
    const precioAdultoMayor = AsientoService.calcularPrecioEntrada(baseConFormato, 20);
    expect(precioAdultoMayor).toBe(14.4);

    // CONADIS (20% descuento) -> 18 * 0.8 = 14.40
    const precioConadis = AsientoService.calcularPrecioEntrada(baseConFormato, 20);
    expect(precioConadis).toBe(14.4);
  });

  it("debe redondear adecuadamente a 2 decimales para importes fraccionarios", () => {
    // ej. 13 * 0.7 = 9.1
    const p1 = AsientoService.calcularPrecioEntrada(13, 30);
    expect(p1).toBe(9.1);

    // ej. 23 * 0.7 = 16.1
    const p2 = AsientoService.calcularPrecioEntrada(23, 30);
    expect(p2).toBe(16.1);
  });

  it("debe impedir reservar más de 8 asientos por transacción", async () => {
    await expect(
      AsientoService.seleccionarAsiento("f-dummy", "a-dummy", "s-dummy", 8)
    ).rejects.toThrow(/límite máximo permitido de 8 asientos/i);
  });
});

describe("AsientoService - Integración con Supabase", () => {
  const idSalaTradicional = "5a1a0000-0000-0000-0000-000000000001"; // Sala 1 Sede 1
  const idFuncionReal = "2be355d1-e402-4e99-9a85-c7f4645a5173";
  const idSesionTest = "99999999-9999-4999-9999-999999999999";

  afterAll(async () => {
    // Limpiar cualquier bloqueo de prueba
    await AsientoService.liberarTodosLosAsientos(idSesionTest);
  });

  it("debe obtener la matriz de sala con sus dimensiones y pasillos", async () => {
    const matriz = await AsientoService.obtenerMatrizSala(
      idSalaTradicional,
      idFuncionReal,
      idSesionTest
    );

    expect(matriz).toBeDefined();
    expect(matriz.filas).toBe(7);
    expect(matriz.columnas).toBe(12);
    expect(matriz.pasillos).toEqual([4, 10]);
    expect(matriz.total_asientos).toBe(84);
    expect(matriz.filas_nombres).toContain("A");
    expect(matriz.filas_nombres).toContain("G");

    // Verificar que la fila A tiene asientos indexados
    const filaA = matriz.grid["A"];
    expect(filaA).toBeDefined();
    expect(filaA.length).toBe(12);
    expect(filaA[0]?.codigo).toBe("A1");
  });

  it("debe calcular la tarifa vigente considerando día, formato y sede", async () => {
    // Martes (Tarifa Económica base = 12) + 2D (0) = 12.00
    const tarifaMartes2D = await AsientoService.obtenerTarifaVigente(
      "2026-10-13", // Martes
      "2D",
      1
    );
    expect(tarifaMartes2D.precio_base).toBe(12);
    expect(tarifaMartes2D.recargo_formato).toBe(0);
    expect(tarifaMartes2D.precio_base_con_formato).toBe(12);

    // Sábado (Tarifa Alta base = 18) + 3D (+5) = 23.00
    const tarifaSabado3D = await AsientoService.obtenerTarifaVigente(
      "2026-10-17", // Sábado
      "3D",
      1
    );
    expect(tarifaSabado3D.precio_base).toBe(18);
    expect(tarifaSabado3D.recargo_formato).toBe(5);
    expect(tarifaSabado3D.precio_base_con_formato).toBe(23);

    // Sede 3 (Chimbote tiene precio_local = 20 para fin de semana)
    const tarifaSede3 = await AsientoService.obtenerTarifaVigente(
      "2026-10-17",
      "2D",
      3
    );
    expect(tarifaSede3.precio_base).toBe(20);
  });

  it("debe permitir bloquear un asiento y luego liberarlo", async () => {
    // Tomar un asiento de la sala (ej. fila G columna 4)
    const asientos = await AsientoDao.obtenerAsientosPorSala(idSalaTradicional);
    const asientoPrueba = asientos.find((a) => a.fila === "G" && a.columna === 4);
    expect(asientoPrueba).toBeDefined();

    // Bloquear para nuestra sesión de prueba
    const bloqueo = await AsientoService.seleccionarAsiento(
      idFuncionReal,
      asientoPrueba!.id_asiento,
      idSesionTest,
      0
    );
    expect(bloqueo.id_bloqueo).toBeDefined();
    expect(bloqueo.id_asiento_funcion).toBeDefined();

    // Verificar en la matriz que figure como 'seleccionado' para nuestra sesión
    const matriz = await AsientoService.obtenerMatrizSala(
      idSalaTradicional,
      idFuncionReal,
      idSesionTest
    );
    const asientoEnMatriz = matriz.grid["G"][3];
    expect(asientoEnMatriz?.estado).toBe("seleccionado");

    // Deseleccionar y liberar
    await AsientoService.deseleccionarAsiento(bloqueo.id_asiento_funcion, idSesionTest);

    // Verificar que volvió a estar 'disponible'
    const matrizDespues = await AsientoService.obtenerMatrizSala(
      idSalaTradicional,
      idFuncionReal,
      idSesionTest
    );
    const asientoLiberado = matrizDespues.grid["G"][3];
    expect(asientoLiberado?.estado).toBe("disponible");
  });

  it("debe cargar salas y matrices diferentes al alternar entre funciones de distintas películas/sedes", async () => {
    const idFuncionDemonioLima = "3b000000-0000-0000-0000-000000000002"; // Sala 1 - Premium (Lima, 50 asientos)
    const idFuncionSpidermanChimbote = "93fad1bc-f258-4df8-84f9-cc78b0c34823"; // Sala 1 - Tradicional (Chimbote, 84 asientos)

    const [fnDemonio, fnSpiderman] = await Promise.all([
      import("@/src/daos/FuncionDao").then((m) => m.FuncionDao.obtenerFuncionCompraPorId(idFuncionDemonioLima)),
      import("@/src/daos/FuncionDao").then((m) => m.FuncionDao.obtenerFuncionCompraPorId(idFuncionSpidermanChimbote)),
    ]);

    expect(fnDemonio).toBeDefined();
    expect(fnDemonio?.nombre_sala).toBe("Sala 1 - Premium");
    expect(fnDemonio?.nombre_sede).toContain("Lima");

    expect(fnSpiderman).toBeDefined();
    expect(fnSpiderman?.nombre_sala).toBe("Sala 1 - Tradicional");
    expect(fnSpiderman?.nombre_sede).toContain("Chimbote");

    const [matrizDemonio, matrizSpiderman] = await Promise.all([
      AsientoService.obtenerMatrizSala(fnDemonio!.id_sala, fnDemonio!.id_funcion, idSesionTest),
      AsientoService.obtenerMatrizSala(fnSpiderman!.id_sala, fnSpiderman!.id_funcion, idSesionTest),
    ]);

    // Matriz de Demonio: Sala 1 - Premium, 5 filas x 10 columnas = 50 asientos
    expect(matrizDemonio.nombre_sala).toBe("Sala 1 - Premium");
    expect(matrizDemonio.total_asientos).toBe(50);
    expect(matrizDemonio.filas).toBe(5);
    expect(matrizDemonio.columnas).toBe(10);

    // Matriz de Spider-Man: Sala 1 - Tradicional, 7 filas x 12 columnas = 84 asientos
    expect(matrizSpiderman.nombre_sala).toBe("Sala 1 - Tradicional");
    expect(matrizSpiderman.total_asientos).toBe(84);
    expect(matrizSpiderman.filas).toBe(7);
    expect(matrizSpiderman.columnas).toBe(12);
  });
});

