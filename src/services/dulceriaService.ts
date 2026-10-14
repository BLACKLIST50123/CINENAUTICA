// Servicio de Negocio para Dulcería (Fase 5)
import { ProductoDao } from "@/src/daos/ProductoDao";
import type {
  CategoriaProductoDTO,
  ProductoDTO,
  ItemPedidoDulceriaDTO,
  ResumenDulceriaDTO,
} from "@/src/dtos/producto";

export interface CatalogoDulceriaDTO {
  categorias: CategoriaProductoDTO[];
  productos: ProductoDTO[];
}

export class DulceriaService {
  /**
   * Obtiene las categorías y productos disponibles para la sede seleccionada.
   */
  static async obtenerCatalogo(idSede: number): Promise<CatalogoDulceriaDTO> {
    const [categorias, productos] = await Promise.all([
      ProductoDao.obtenerCategorias(),
      ProductoDao.obtenerProductosPorSede(idSede),
    ]);

    return {
      categorias,
      productos,
    };
  }

  /**
   * Calcula los totales del carrito de dulcería de forma segura y precisa.
   */
  static calcularTotalesPedido(items: ItemPedidoDulceriaDTO[]): ResumenDulceriaDTO {
    let totalProductos = 0;
    let totalImporte = 0;

    items.forEach((item) => {
      const cantidad = Math.max(0, item.cantidad);
      const subtotal = Math.round(item.precio_unitario * cantidad * 100) / 100;
      totalProductos += cantidad;
      totalImporte += subtotal;
    });

    return {
      items,
      total_productos: totalProductos,
      total_importe: Math.round(totalImporte * 100) / 100,
    };
  }

  /**
   * Valida si la cantidad deseada está dentro del stock disponible.
   */
  static validarCantidadPermitida(stock: number, cantidadDeseada: number): number {
    if (cantidadDeseada < 0) return 0;
    if (cantidadDeseada > stock) return stock;
    return cantidadDeseada;
  }
}
