// DTOs para el módulo de Administrador de Sede (admin_sede)
// Convención: contratos de datos entre DAOs, Servicios y Componentes de interfaz

export type PeriodoDashboard = 'hoy' | '7d' | '30d' | 'anio';

export interface ContextoSedeDTO {
  id_sede: number;
  nombre: string;
  ciudad: string;
  region: string;
  direccion: string;
  cant_salas: number;
  activa: boolean;
  funciones_hoy: number;
  ocupacion_hoy_pct: number;
}

export interface FuncionRendimientoItemDTO {
  id_funcion: string;
  titulo_pelicula: string;
  hora_inicio: string;
  hora_fin: string;
  formato_nombre: string;
  idioma: string;
  capacidad: number;
  ocupados: number;
  ocupacion_pct: number;
}

export interface FechaRendimientoItemDTO {
  fecha: string;
  fecha_formateada: string;
  total_funciones: number;
  funciones: FuncionRendimientoItemDTO[];
}

export interface RendimientoSalaJerarquicoDTO {
  id_sala: string;
  numero_sala: number;
  nombre_sala: string;
  formatos_str: string;
  capacidad_total: number;
  asientos_buen_estado: number;
  asientos_mantenimiento: number;
  asientos_accesibles: number;
  total_funciones: number;
  fechas: FechaRendimientoItemDTO[];
}

export interface MetricasDashboardDTO {
  periodo: PeriodoDashboard;
  ingresos_totales: number;
  entradas_vendidas: number;
  ingresos_dulceria: number;
  ocupacion_promedio_pct: number;
  total_transacciones: number;
  top_peliculas: {
    id_pelicula: string;
    titulo: string;
    url_poster: string;
    entradas_vendidas: number;
    recaudacion: number;
  }[];
  rendimiento_salas: {
    id_sala: string;
    numero_sala: number;
    nombre_sala: string;
    funciones_count: number;
    ocupacion_pct: number;
    recaudacion: number;
  }[];
  rendimiento_salas_detalle: RendimientoSalaJerarquicoDTO[];
  ultimas_ventas: {
    id_orden: string;
    codigo_orden: string;
    fecha_creacion: string;
    cliente: string;
    canal: string;
    total: number;
    estado: string;
    tipo_comprobante?: string;
  }[];
}

export interface PeliculaCatalogoSedeDTO {
  id_pelicula: string;
  titulo: string;
  sinopsis: string;
  duracion_min: number;
  clasificacion: string;
  url_poster: string;
  url_banner: string;
  tipo_lanzamiento: string;
  estado_cartelera: string;
  generos: string[];
  destacada_banner: boolean;
  orden_banner: number | null;
  total_funciones_sede: number;
}

export interface FuncionAdminSedeDTO {
  id_funcion: string;
  id_sede: number;
  id_pelicula: string;
  pelicula_titulo: string;
  pelicula_duracion_min: number;
  pelicula_poster: string;
  tipo_lanzamiento: string;
  id_sala: string;
  sala_numero: number;
  sala_nombre: string;
  id_formato: string;
  formato_nombre: string;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fin: string; // HH:mm
  idioma_audio: string; // 'Doblada' | 'Subtitulada' | 'Original'
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA' | string;
  asientos_ocupados: number;
  asientos_capacidad: number;
}

export interface NuevaFuncionPayload {
  id_sede: number;
  id_pelicula: string;
  id_sala: string;
  id_formato: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  idioma_audio: string;
  creado_por?: string;
}

export interface ReprogramarFuncionPayload {
  id_funcion: string;
  id_sede: number;
  accion: 'cancelar' | 'reprogramar';
  motivo: string;
  detalle_motivo: string;
  id_usuario_responsable: string;
  nueva_fecha?: string;
  nueva_hora_inicio?: string;
  nueva_hora_fin?: string;
  nueva_sala_id?: string;
}

export interface ProductoDulceriaSedeDTO {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio_base: number;
  precio_local: number;
  url_imagen: string;
  categoria_nombre: string;
  habilitado: boolean;
}

export interface SalaDetalleSedeDTO {
  id_sala: string;
  id_sede: number;
  numero_sala: number;
  nombre_sala: string;
  filas: number;
  columnas: number;
  pasillos: number[];
  estado: 'ACTIVA' | 'MANTENIMIENTO' | string;
  capacidad_total: number;
  formatos_soportados: {
    id_formato: string;
    codigo: string;
    nombre: string;
  }[];
  asientos: AsientoAdminSedeDTO[];
}

export interface AsientoAdminSedeDTO {
  id_asiento: string;
  id_sala: string;
  fila: string;
  columna: number;
  tipo_asiento: 'Normal' | 'Discapacitado' | 'Preferencial' | string;
  en_mantenimiento: boolean;
}

export interface TarifaSedeDTO {
  id_tarifa: string;
  tipo_tarifa: string;
  dia_semana: number | null; // 1 = Lunes, 7 = Domingo, null = General
  dia_nombre?: string;
  precio_general: number;
  precio_local: number;
  es_dia_semana: boolean;
  activo: boolean;
}

export interface CuponSedeDTO {
  id_cupon: string;
  codigo: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  habilitado_sede: boolean;
  usos_sede: number;
  usos_maximos_sede: number | null;
  es_local: boolean;
}

export interface SocioConsultaSedeDTO {
  id_usuario: string;
  codigo_socio: string;
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  telefono: string;
  nivel: string;
  multiplicador_puntos: number;
  puntos_actuales: number;
  fecha_nacimiento: string | null;
  cumple_usado_en_anio: number | null;
  visitas_sede_count: number;
}

export interface PersonalSedeDTO {
  id_usuario: string;
  id_personal_sede?: string;
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  telefono: string;
  id_rol: string;
  rol_codigo: 'counter_boleteria' | 'counter_dulceria' | 'counter_mixto' | 'admin_sede' | string;
  rol_nombre: string;
  activo: boolean;
  asignado_en: string;
  total_ordenes_mes: number;
  total_recaudado_mes: number;
  nota?: string;
  fecha_ingreso?: string;
  creado_por?: string;
}

export interface NuevoPersonalPayload {
  id_sede: number;
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  telefono: string;
  rol_codigo: 'counter_boleteria' | 'counter_dulceria' | 'counter_mixto' | 'admin_sede';
  nota?: string;
  contrasena?: string;
  id_usuario_creador?: string;
}

export interface EditarPersonalPayload {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  telefono: string;
  nota?: string;
  rol_codigo: 'counter_boleteria' | 'counter_dulceria' | 'counter_mixto' | 'admin_sede';
  contrasena?: string;
  password?: string;
}

export interface VentaPersonalDTO {
  id_orden: string;
  codigo_orden: string;
  total: number;
  creado_en: string;
  estado: string;
  canal: string;
  total_items: number;
}
