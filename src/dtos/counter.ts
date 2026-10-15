// DTOs para el Módulo POS Counter (Boletería, Dulcería y Mixto)

export type ModoCounter = "boleteria" | "dulceria" | "mixto";
export type MetodoPagoCounter = "Efectivo" | "Tarjeta" | "Yape";
export type TipoComprobanteCounter = "Boleta" | "Factura";

export interface ItemEntradaCounter {
  id_asiento_funcion: string;
  codigo_asiento: string; // Ej: "D5"
  fila?: string;
  numero?: number;
  id_tipo_entrada: string;
  tipo_nombre: string; // Ej: "General", "Niño", "Adulto Mayor"
  precio: number;
}

export interface ItemProductoCounter {
  id_producto: string;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  url_imagen?: string;
  categoria?: string;
}

export interface SocioCounterDTO {
  id_usuario: string;
  id_socio?: string;
  codigo_socio?: string;
  nombre_completo: string;
  dni: string;
  correo?: string;
  telefono?: string;
  puntos: number;
  nivel: string;
  es_cumpleanero?: boolean;
}

export interface RegistroSocioRapidoDTO {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
}

export interface VentaCounterInputDTO {
  modo: ModoCounter;
  id_sede: number;
  id_vendedor?: string;
  socio?: SocioCounterDTO | null;
  tipo_comprobante: TipoComprobanteCounter;
  numero_documento: string; // DNI (8 dígitos) o RUC (11 dígitos)
  nombre_cliente: string;
  metodo_pago: MetodoPagoCounter;
  monto_recibido?: number; // Para cálculo de vuelto en efectivo
  id_funcion?: string;
  pelicula_titulo?: string;
  formato?: string;
  sala?: string;
  hora?: string;
  entradas: ItemEntradaCounter[];
  productos: ItemProductoCounter[];
  descuento_puntos?: number;
  puntos_canjeados?: number;
}

export interface VentaCounterResultadoDTO {
  ok: boolean;
  id_orden: string;
  codigo_orden: string;
  numero_comprobante: string;
  tipo_comprobante: TipoComprobanteCounter;
  subtotal: number;
  descuento: number;
  total: number;
  monto_recibido: number;
  vuelto: number;
  puntos_ganados: number;
  fecha: string;
  metodo_pago: MetodoPagoCounter;
  nombre_cliente: string;
  numero_documento: string;
  id_sede: number;
  nombre_sede: string;
  entradas: ItemEntradaCounter[];
  productos: ItemProductoCounter[];
  pelicula_titulo?: string;
  formato?: string;
  sala?: string;
  hora?: string;
  qr_codigo?: string;
}

export interface OrdenContingenciaDTO {
  id_orden: string;
  codigo_orden: string;
  fecha: string;
  estado: string; // 'Pagada', 'Reembolsada', 'Cancelada'
  cliente_nombre: string;
  cliente_documento: string;
  nombre_cliente?: string;
  numero_documento?: string;
  tipo_comprobante: string;
  numero_comprobante: string;
  metodo_pago: string;
  total: number;
  id_sede: number;
  nombre_sede: string;
  entradas: ItemEntradaCounter[];
  productos: ItemProductoCounter[];
  pelicula_titulo?: string;
  sala?: string;
  formato?: string;
  hora?: string;
  pelicula?: {
    id_funcion?: string;
    titulo: string;
    sala: string;
    formato: string;
    hora: string;
    fecha: string;
  };
}
