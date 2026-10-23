import { describe, it, expect } from "vitest";
import { AdminGeneralDao } from "../AdminGeneralDao";

describe("AdminGeneralDao", () => {
  it("debe obtener regiones y ciudades desde Supabase", async () => {
    const regiones = await AdminGeneralDao.obtenerRegiones();
    expect(Array.isArray(regiones)).toBe(true);
    expect(regiones.length).toBeGreaterThan(0);
    expect(regiones[0]).toHaveProperty("id_region");
    expect(regiones[0]).toHaveProperty("nombre");

    const ciudades = await AdminGeneralDao.obtenerCiudades();
    expect(Array.isArray(ciudades)).toBe(true);
    expect(ciudades.length).toBeGreaterThan(0);
    expect(ciudades[0]).toHaveProperty("id_ciudad");
    expect(ciudades[0]).toHaveProperty("region_nombre");
  });

  it("debe obtener lista de sedes con KPIs resumidos", async () => {
    const sedes = await AdminGeneralDao.obtenerTodasSedes();
    expect(Array.isArray(sedes)).toBe(true);
    expect(sedes.length).toBeGreaterThan(0);
    const s = sedes[0];
    expect(s).toHaveProperty("id_sede");
    expect(s).toHaveProperty("nombre");
    expect(s).toHaveProperty("ciudad");
    expect(s).toHaveProperty("region");
    expect(s).toHaveProperty("cant_salas");
  });

  it("debe obtener catalogo global de peliculas", async () => {
    const peliculas = await AdminGeneralDao.obtenerPeliculasCatalogo();
    expect(Array.isArray(peliculas)).toBe(true);
    expect(peliculas.length).toBeGreaterThan(0);
    const p = peliculas[0];
    expect(p).toHaveProperty("id_pelicula");
    expect(p).toHaveProperty("titulo");
    expect(p).toHaveProperty("duracion_min");
    expect(Array.isArray(p.generos)).toBe(true);
  });

  it("debe obtener productos de dulceria global", async () => {
    const productos = await AdminGeneralDao.obtenerProductosGlobal();
    expect(Array.isArray(productos)).toBe(true);
    expect(productos.length).toBeGreaterThan(0);
    const pr = productos[0];
    expect(pr).toHaveProperty("id_producto");
    expect(pr).toHaveProperty("nombre");
    expect(pr).toHaveProperty("precio_base");
    expect(pr).toHaveProperty("categoria_nombre");
  });

  it("debe obtener tarifas globales", async () => {
    const tarifas = await AdminGeneralDao.obtenerTarifasGlobales();
    expect(Array.isArray(tarifas)).toBe(true);
    expect(tarifas.length).toBeGreaterThan(0);
    const t = tarifas[0];
    expect(t).toHaveProperty("id_tarifa");
    expect(t).toHaveProperty("tipo_tarifa");
    expect(t).toHaveProperty("precio_general");
  });

  it("debe obtener cupones globales", async () => {
    const cupones = await AdminGeneralDao.obtenerCuponesGlobales();
    expect(Array.isArray(cupones)).toBe(true);
    if (cupones.length > 0) {
      const c = cupones[0];
      expect(c).toHaveProperty("id_cupon");
      expect(c).toHaveProperty("codigo");
      expect(c).toHaveProperty("porcentaje_descuento");
    }
  });

  it("debe calcular el dashboard general multisede con KPIs reales", async () => {
    const dash = await AdminGeneralDao.obtenerDashboardGeneral({ periodo: "30d" });
    expect(dash).toBeDefined();
    expect(dash).toHaveProperty("kpis");
    expect(dash.kpis).toHaveProperty("ingresos_netos");
    expect(dash.kpis).toHaveProperty("entradas_vendidas");
    expect(Array.isArray(dash.ingresos_diarios)).toBe(true);
    expect(Array.isArray(dash.top_peliculas)).toBe(true);
    expect(Array.isArray(dash.rendimiento_sedes)).toBe(true);
  });
});
