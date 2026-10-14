// DAO para Dulcería (Fase 5)
import { supabase } from "@/src/lib/supabase/cliente";
import type { CategoriaProductoDTO, ProductoDTO } from "@/src/dtos/producto";

export class ProductoDao {
  /**
   * Obtiene todas las categorías activas de dulcería ordenadas por su campo orden.
   */
  static async obtenerCategorias(): Promise<CategoriaProductoDTO[]> {
    const { data, error } = await supabase
      .from("categoria_producto")
      .select("id_categoria, nombre, orden, activo")
      .eq("activo", true)
      .neq("nombre", "Sin categoría")
      .order("orden", { ascending: true });

    if (error) {
      console.error("Error al obtener categorías de productos:", error);
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }

    return (data || []).map((c) => ({
      id_categoria: c.id_categoria,
      nombre: c.nombre,
      orden: c.orden,
      activo: c.activo,
    }));
  }

  /**
   * Obtiene todos los productos disponibles para una sede, considerando precios locales y stock.
   */
  static async obtenerProductosPorSede(idSede: number): Promise<ProductoDTO[]> {
    // 1. Obtener productos activos con su categoría
    const { data: productos, error: prodError } = await supabase
      .from("producto")
      .select(`
        id_producto,
        id_categoria,
        nombre,
        descripcion,
        precio_base,
        url_imagen,
        disponible,
        categoria_producto (
          id_categoria,
          nombre,
          orden
        )
      `)
      .eq("disponible", true)
      .is("eliminado_en", null);

    if (prodError) {
      console.error("Error al obtener productos:", prodError);
      throw new Error(`Error al obtener productos: ${prodError.message}`);
    }

    if (!productos || productos.length === 0) return [];

    // 2. Obtener configuraciones específicas de la sede (precios locales, stock, habilitado)
    const { data: sedeProds, error: sedeError } = await supabase
      .from("producto_sede")
      .select("id_producto, precio_local, stock, habilitado")
      .eq("id_sede", idSede);

    if (sedeError) {
      console.warn("Advertencia al consultar producto_sede:", sedeError);
    }

    const mapaSede = new Map<string, { precio_local: number | null; stock: number; habilitado: boolean }>();
    (sedeProds || []).forEach((sp: any) => {
      mapaSede.set(sp.id_producto, {
        precio_local: sp.precio_local != null ? Number(sp.precio_local) : null,
        stock: sp.stock != null ? sp.stock : 999,
        habilitado: sp.habilitado !== false,
      });
    });

    // 3. Mapear productos con sus precios y stock de la sede
    const resultado: ProductoDTO[] = [];

    productos.forEach((p: any) => {
      const configSede = mapaSede.get(p.id_producto);

      // Si está explícitamente deshabilitado para esta sede, se omite
      if (configSede && !configSede.habilitado) {
        return;
      }

      const precioBase = Number(p.precio_base) || 0;
      const precioFinal = configSede?.precio_local != null ? configSede.precio_local : precioBase;
      const stock = configSede?.stock != null ? configSede.stock : 999;

      resultado.push({
        id_producto: p.id_producto,
        id_categoria: p.id_categoria,
        nombre_categoria: p.categoria_producto?.nombre || "Varios",
        nombre: p.nombre,
        descripcion: p.descripcion || "",
        precio_base: precioBase,
        precio_final: precioFinal,
        url_imagen: p.url_imagen || "fa-bowl-food",
        disponible: p.disponible,
        stock,
        id_sede: idSede,
      });
    });

    return resultado;
  }
}
