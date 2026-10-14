// DTOs para Dulcería (Fase 5)

export interface CategoriaProductoDTO {
  id_categoria: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface ProductoDTO {
  id_producto: string;
  id_categoria: string;
  nombre_categoria: string;
  nombre: string;
  descripcion: string;
  precio_base: number;
  precio_final: number;
  url_imagen: string;
  disponible: boolean;
  stock: number;
  id_sede?: number;
}

export interface ItemPedidoDulceriaDTO {
  id_producto: string;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  url_imagen?: string;
  descripcion?: string;
}

export interface ResumenDulceriaDTO {
  items: ItemPedidoDulceriaDTO[];
  total_productos: number;
  total_importe: number;
}
