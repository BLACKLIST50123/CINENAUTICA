import { describe, it, expect } from "vitest";
import { DulceriaService } from "../dulceriaService";

describe("DulceriaService - Lógica de Negocio y Precios (Fase 5)", () => {
  it("debe calcular correctamente los totales de dulcería", () => {
    const items = [
      {
        id_producto: "p1",
        nombre: "Combo Dúo",
        precio_unitario: 40,
        cantidad: 2,
        subtotal: 80,
      },
      {
        id_producto: "p2",
        nombre: "Gaseosa Grande",
        precio_unitario: 12.5,
        cantidad: 3,
        subtotal: 37.5,
      },
    ];

    const resumen = DulceriaService.calcularTotalesPedido(items);
    expect(resumen.total_productos).toBe(5);
    expect(resumen.total_importe).toBe(117.5);
  });

  it("debe restringir la cantidad al stock disponible", () => {
    expect(DulceriaService.validarCantidadPermitida(5, 10)).toBe(5);
    expect(DulceriaService.validarCantidadPermitida(5, -2)).toBe(0);
    expect(DulceriaService.validarCantidadPermitida(5, 3)).toBe(3);
  });
});

describe("DulceriaService - Integración con Supabase", () => {
  it("debe cargar categorías y productos reales de la sede 1 (Chimbote)", async () => {
    const catalogo = await DulceriaService.obtenerCatalogo(1);

    expect(catalogo).toBeDefined();
    expect(catalogo.categorias.length).toBeGreaterThan(0);
    expect(catalogo.productos.length).toBeGreaterThan(0);

    // Debe contener categorías como Combos Populares o Bebidas
    const nombresCat = catalogo.categorias.map((c) => c.nombre);
    expect(nombresCat).toContain("Combos Populares");

    // Verificar que los productos tienen precios válidos y stock
    const comboDuo = catalogo.productos.find((p) => p.nombre.toLowerCase().includes("combo dúo"));
    expect(comboDuo).toBeDefined();
    expect(comboDuo?.precio_final).toBe(40);
  });

  it("debe aplicar el precio local para sede 3 (Lima)", async () => {
    const catalogoLima = await DulceriaService.obtenerCatalogo(3);

    // En Lima (Sede 3), Combo Dúo tiene precio local S/ 43.00 y Combo Mega Familiar S/ 68.00
    const comboDuoLima = catalogoLima.productos.find((p) => p.nombre.toLowerCase().includes("combo dúo"));
    expect(comboDuoLima).toBeDefined();
    expect(comboDuoLima?.precio_final).toBe(43);

    const comboMegaLima = catalogoLima.productos.find((p) => p.nombre.toLowerCase().includes("mega familiar"));
    expect(comboMegaLima).toBeDefined();
    expect(comboMegaLima?.precio_final).toBe(68);
  });
});
