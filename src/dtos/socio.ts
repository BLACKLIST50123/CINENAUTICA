// DTOs para el Perfil y Programa de Lealtad Socio Náutica (Fase 8)

export interface NivelSocioDTO {
  id_nivel: number;
  codigo: string;
  nombre: string;
  min_puntos: number;
  multiplicador: number;
  fila_preferencial: boolean;
  color_hex: string;
}

export interface ProgresoNivelDTO {
  nivel_actual: string;
  siguiente_nivel: string | null;
  puntos_actuales: number;
  puntos_objetivo: number;
  puntos_faltantes: number;
  porcentaje_progreso: number;
}

export interface EstadoCumpleanosDTO {
  es_mes_actual: boolean;
  mes_nombre: string;
  ya_usado: boolean;
  disponible: boolean;
  mensaje: string;
}

export interface MovimientoPuntosDTO {
  id_historial_puntos: number;
  id_orden?: string | null;
  id_sede?: number | null;
  tipo: "Acumulacion" | "Canje" | "Ajuste" | "Cumpleaños" | string;
  puntos: number;
  saldo_resultante: number;
  descripcion: string;
  fecha_hora: string;
}

export interface PerfilSocioCompletoDTO {
  id_usuario: string;
  codigo_socio: string;
  nombre: string;
  apellido: string;
  correo: string;
  dni?: string | null;
  telefono?: string | null;
  puntos: number;
  nivel: NivelSocioDTO;
  fecha_nacimiento: string | null;
  cumple_usado_en_anio: number | null;
  progreso: ProgresoNivelDTO;
  estado_cumpleanos: EstadoCumpleanosDTO;
  movimientos: MovimientoPuntosDTO[];
}
