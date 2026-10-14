// DTOs para Cartelera, Sedes y Funciones
// Convención: interfaces y tipos de transporte para la capa de presentación y servicios

export interface SedeDTO {
  id_sede: number;
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string | null;
  cant_salas: number;
  latitud: number | null;
  longitud: number | null;
  url_imagen: string | null;
  zona_horaria: string;
  activa: boolean;
  ciudad: {
    id_ciudad: number;
    nombre: string;
  };
  region: {
    id_region: number;
    nombre: string;
  };
}

export interface CiudadConSedesDTO {
  id_ciudad: number;
  nombre: string;
  region: string;
  sedes: SedeDTO[];
}

export interface PeliculaCarteleraDTO {
  id_pelicula: string;
  titulo: string;
  sinopsis: string;
  duracion_min: number;
  clasificacion: string;
  trailer_url: string;
  url_poster: string;
  url_banner: string;
  tipo_lanzamiento: 'Estreno' | 'Pre_Estreno' | 'Re_Estreno' | 'Especial' | string;
  estado_cartelera: 'Cartelera' | 'Pre_Estreno' | 'Proximamente' | string;
  generos: string[];
  formatos: string[];
  sedes_disponibles: number[];
  fechas_disponibles: string[]; // Formato YYYY-MM-DD
  destacada_banner?: boolean;
  orden_banner?: number | null;
}

export interface FuncionResumenDTO {
  id_funcion: string;
  id_sede: number;
  id_pelicula: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  idioma_audio: string;
  estado: string;
  formato: string;
  nombre_formato: string;
  nombre_sala: string;
  numero_sala: number;
}

export interface DiaCarteleraDTO {
  codigo: string; // 'd0', 'd1', etc.
  fechaIso: string; // 'YYYY-MM-DD'
  diaSemanaCorto: string; // 'Sáb', 'Dom', etc.
  diaSemanaLargo: string; // 'Sábado', etc.
  diaMes: string; // '13 Oct'
  labelCorto: string; // 'Hoy · Mar 13', 'Mañana · Mié 14'
  esHoy: boolean;
}
