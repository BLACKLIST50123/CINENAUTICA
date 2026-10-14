/**
 * DTOs para el Módulo de Selección de Asientos y Mapa de Sala (Fase 4)
 */

export type TipoAsiento = "Butaca" | "Accesible" | "Pasadizo" | "Mantenimiento";

export type EstadoAsientoVisual =
  | "disponible"
  | "seleccionado"
  | "ocupado"
  | "bloqueado_otro"
  | "mantenimiento"
  | "accesible";

export interface AsientoDTO {
  id_asiento: string;
  id_sala: string;
  fila: string;
  columna: number;
  tipo_asiento: string;
  en_mantenimiento: boolean;
  codigo: string; // ej. "A1", "D5"
  id_asiento_funcion?: string | null;
  estado: EstadoAsientoVisual;
}

export interface SalaMatrizDTO {
  id_sala: string;
  id_sede: number;
  numero_sala: number;
  nombre_sala: string;
  filas: number;
  columnas: number;
  pasillos: number[];
  filas_nombres: string[];
  grid: Record<string, (AsientoDTO | null)[]>; // Clave: fila "A", valor: array ordenado por columna 1..N
  total_asientos: number;
  total_disponibles: number;
}

export interface TipoEntradaDTO {
  id_tipo_entrada: string;
  codigo: string;
  nombre: string;
  descuento_pct: number;
  obligatorio_legal: boolean;
  activo: boolean;
}

export interface TarifaVigenteDTO {
  id_tarifa: string;
  tipo_tarifa: string;
  dia_semana: number | null;
  precio_base: number;
  recargo_formato: number;
  precio_base_con_formato: number;
  es_feriado: boolean;
  es_prestreno: boolean;
  sede_nombre?: string;
}

export interface AsientoSeleccionadoDTO {
  id_asiento: string;
  id_asiento_funcion: string;
  codigo: string;
  fila: string;
  columna: number;
  tipo_asiento: string;
  id_tipo_entrada: string;
  nombre_tipo_entrada: string;
  descuento_pct: number;
  precio: number;
}

export interface ResumenCompraAsientosDTO {
  id_funcion: string;
  id_sesion: string;
  asientos: AsientoSeleccionadoDTO[];
  cantidad: number;
  total: number;
}
