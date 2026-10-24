// DTOs para el módulo de Administrador General (admin_general)
// Convención: contratos de datos entre DAOs, Servicios y Componentes de interfaz

// ─────────────────────────────────────────────
// Sedes
// ─────────────────────────────────────────────

export interface SedeResumenDTO {
  id_sede: number;
  codigo?: string;
  nombre: string;
  id_ciudad?: number;
  ciudad: string;
  region: string;
  direccion: string;
  telefono?: string;
  latitud?: number | null;
  longitud?: number | null;
  url_imagen?: string;
  serie_boleta?: string;
  serie_factura?: string;
  cant_salas: number;
  activa: boolean;
  funciones_hoy: number;
  ocupacion_hoy_pct: number;
  ingresos_mes: number;
  entradas_mes: number;
}

export interface NuevaSedePayload {
  nombre: string;
  codigo?: string;
  id_ciudad: number;
  direccion: string;
  cant_salas: number;
  latitud?: number | null;
  longitud?: number | null;
  telefono?: string;
  url_imagen?: string;
  serie_boleta?: string;
  serie_factura?: string;
}

export interface EditarSedePayload {
  id_sede: number;
  nombre: string;
  codigo?: string;
  id_ciudad: number;
  direccion: string;
  cant_salas?: number;
  latitud?: number | null;
  longitud?: number | null;
  telefono?: string;
  url_imagen?: string;
  serie_boleta?: string;
  serie_factura?: string;
  activa: boolean;
}

// ─────────────────────────────────────────────
// Dashboard General
// ─────────────────────────────────────────────

export type PeriodoDashboardGeneral = "hoy" | "7d" | "30d" | "anio" | "personalizado";

export interface FiltrosDashboardGeneral {
  periodo: PeriodoDashboardGeneral;
  fecha_inicio?: string; // YYYY-MM-DD
  fecha_fin?: string;    // YYYY-MM-DD
  id_region?: number;
  id_ciudad?: number;
  id_sede?: number;
}

export interface KpisGeneralesDTO {
  ingresos_netos: number;
  entradas_vendidas: number;
  ingresos_dulceria: number;
  ticket_promedio: number;
  ocupacion_promedio_pct: number;
  socios_nuevos: number;
  attach_dulceria_pct: number;
  reembolsos: number;
  delta_ingresos_pct: number;
  delta_entradas_pct: number;
  delta_dulceria_pct: number;
  delta_ticket_pct: number;
  delta_ocupacion_pct?: number;
  delta_socios_pct?: number;
  delta_attach_pct?: number;
  delta_reembolsos_pct?: number;
}

export interface IngresosDiarioItemDTO {
  fecha: string;       // YYYY-MM-DD
  dia_nombre: string;  // "Sáb", "Dom", etc.
  total: number;
  es_hoy: boolean;
}

export interface RendimientoSedeItemDTO {
  id_sede: number;
  nombre: string;
  ciudad: string;
  ingresos: number;
  entradas: number;
  ocupacion_pct: number;
  share_ingresos_pct: number;
}

export interface TopPeliculaGeneralDTO {
  id_pelicula: string;
  titulo: string;
  url_poster: string;
  entradas_vendidas: number;
  recaudacion: number;
  ticket_promedio: number;
  share_taquilla_pct: number;
  sedes_count?: number;
  duracion_min?: number;
  clasificacion?: string;
  generos?: string[];
}

export interface DashboardGeneralDTO {
  kpis: KpisGeneralesDTO;
  ingresos_diarios: IngresosDiarioItemDTO[];
  top_peliculas: TopPeliculaGeneralDTO[];
  rendimiento_sedes: RendimientoSedeItemDTO[];
}


// ─────────────────────────────────────────────
// Películas (catálogo global)
// ─────────────────────────────────────────────

export interface PeliculaGlobalDTO {
  id_pelicula: string;
  titulo: string;
  sinopsis: string;
  duracion_min: number;
  clasificacion: string;
  url_poster: string;
  url_banner: string;
  trailer_url?: string;
  formatos?: string[];
  tipo_lanzamiento: "Estreno" | "Preventa" | "Cartelera" | "Pronto" | string;
  generos: string[];
  destacada_banner: boolean;
  orden_banner: number | null;
  activa: boolean;
  fecha_estreno: string | null;
  sedes_activas: number;
}

export interface CrearPeliculaPayload {
  titulo: string;
  sinopsis: string;
  duracion_min: number;
  clasificacion: string;
  url_poster: string;
  url_banner: string;
  trailer_url?: string;
  formatos?: string[];
  tipo_lanzamiento: string;
  generos: string[];
  destacada_banner: boolean;
  orden_banner?: number;
  fecha_estreno?: string;
}

export interface EditarPeliculaPayload extends CrearPeliculaPayload {
  id_pelicula: string;
}

// ─────────────────────────────────────────────
// Dulcería Global
// ─────────────────────────────────────────────

export interface CategoriaProductoDTO {
  id_categoria: string;
  nombre: string;
}

export interface ProductoGlobalDTO {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio_base: number;
  url_imagen: string;
  id_categoria?: string;
  categoria_nombre: string;
  activo: boolean;
  sedes_con_precio_local: number;
}

export interface CrearProductoGlobalPayload {
  nombre: string;
  descripcion: string;
  precio_base: number;
  id_categoria: string;
  url_imagen?: string;
}

export interface EditarProductoGlobalPayload {
  id_producto: string;
  nombre?: string;
  descripcion?: string;
  precio_base: number;
  id_categoria?: string;
  url_imagen?: string;
  activo: boolean;
}

// ─────────────────────────────────────────────
// Tarifas Globales, Formatos y Tipos de Entrada
// ─────────────────────────────────────────────

export interface TarifaGlobalDTO {
  id_tarifa: string;
  tipo_tarifa: string;
  dia_semana: number | null;
  dia_nombre?: string;
  activo: boolean;
  precio_general: number;
}

export interface EditarTarifaGlobalPayload {
  id_tarifa: string;
  precio_general: number;
  activo: boolean;
}

export interface FormatoProyeccionGlobalDTO {
  id_formato: string;
  codigo: string;
  nombre: string;
  recargo: number;
  protegido: boolean;
  activo: boolean;
}

export interface TipoEntradaGlobalDTO {
  id_tipo_entrada: string;
  codigo: string;
  nombre: string;
  descuento_pct: number;
  obligatorio_legal: boolean;
  protegido: boolean;
  activo: boolean;
}

// ─────────────────────────────────────────────
// Cupones Globales
// ─────────────────────────────────────────────

export interface CuponGlobalDTO {
  id_cupon: string;
  codigo: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  habilitado: boolean;
  usos_totales: number;
  usos_maximos: number | null;
  sedes_habilitadas: number;
}

export interface CrearCuponGlobalPayload {
  codigo: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  usos_maximos?: number;
}

export interface EditarCuponGlobalPayload {
  id_cupon: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  usos_maximos?: number;
}

// ─────────────────────────────────────────────
// Ciudades / Regiones (para filtros y selects)
// ─────────────────────────────────────────────

export interface RegionDTO {
  id_region: number;
  nombre: string;
}

export interface CiudadDTO {
  id_ciudad: number;
  nombre: string;
  id_region: number;
  region_nombre: string;
}

