// DTOs para Órdenes, Pagos, Comprobantes y Cupones (Fase 6)

export type TipoComprobante = "Boleta" | "Factura";
export type MetodoPago = "Tarjeta" | "Yape";

export interface EntradaOrdenInputDTO {
  id_asiento_funcion: string;
  id_tipo_entrada: string;
  precio_lista: number;
  descuento: number;
  precio_unitario: number;
  codigo_asiento?: string;
  tipo_nombre?: string;
}

export interface ProductoOrdenInputDTO {
  id_producto: string;
  cantidad: number;
  precio_unitario: number;
  nombre?: string;
}

export interface CrearOrdenInputDTO {
  id_sede: number;
  id_usuario?: string | null;
  correo_contacto: string;
  nombre_contacto: string;
  tipo_comprobante: TipoComprobante;
  numero_documento: string;
  metodo_pago: MetodoPago;
  codigo_cupon?: string | null;
  puntos_canjeados?: number;
  id_sesion?: string;
  entradas: EntradaOrdenInputDTO[];
  productos: ProductoOrdenInputDTO[];
}

export interface CheckoutResultadoDTO {
  ok: boolean;
  id_orden: string;
  codigo_orden: string;
  numero_comprobante: string;
  tipo_comprobante: string;
  subtotal: number;
  descuento_cupon: number;
  descuento_puntos: number;
  total: number;
  puntos_ganados: number;
  saldo_puntos?: number;
  fecha_creacion: string;
}

export interface CuponDTO {
  id_cupon: string;
  codigo: string;
  descripcion: string;
  tipo_descuento: "Porcentaje" | "Fijo";
  valor: number;
  activo: boolean;
  usos_actuales?: number;
  usos_maximos?: number;
}

export interface ValidacionCuponResultado {
  valido: boolean;
  mensaje?: string;
  cupon?: CuponDTO;
  montoDescuento?: number;
}

export interface OrdenDetalleEntradaDTO {
  id_detalle_entrada: string;
  id_asiento_funcion: string;
  codigo_asiento?: string;
  tipo_entrada?: string;
  precio_unitario: number;
  codigo_validacion: string;
}

export interface OrdenDetalleProductoDTO {
  id_detalle_producto: string;
  id_producto: string;
  nombre_producto?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface ComprobanteDTO {
  id_comprobante: string;
  id_sede: number;
  tipo: TipoComprobante;
  numero_documento_cliente: string;
  nombre_cliente: string;
  serie: string;
  correlativo: number;
  numero_comprobante: string;
  subtotal_sin_igv: number;
  igv: number;
  total: number;
  fecha_emision: string;
}

export interface OrdenCompletaDTO {
  id_orden: string;
  codigo_orden: string;
  id_sede: number;
  nombre_sede?: string;
  direccion_sede?: string;
  canal: string;
  correo_contacto: string;
  nombre_contacto: string;
  fecha_creacion: string;
  estado: string;
  subtotal_entradas: number;
  subtotal_productos: number;
  descuento_cupon: number;
  descuento_puntos: number;
  puntos_canjeados: number;
  total: number;
  entradas: OrdenDetalleEntradaDTO[];
  productos: OrdenDetalleProductoDTO[];
  comprobante?: ComprobanteDTO;
  pelicula?: {
    titulo: string;
    formato: string;
    sala: string;
    fecha: string;
    hora: string;
    poster_url?: string;
  };
}
