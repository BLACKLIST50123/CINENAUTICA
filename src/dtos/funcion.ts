export interface DetallePeliculaDTO {
  id_pelicula: string;
  titulo: string;
  sinopsis: string;
  duracion_min: number;
  clasificacion: string;
  trailer_url: string | null;
  url_poster: string;
  url_banner: string | null;
  tipo_lanzamiento: string;
  estado_cartelera: string;
  generos: string[];
  formatos: string[];
}

export interface FuncionItemDTO {
  id_funcion: string;
  id_pelicula: string;
  id_sede: number;
  sede_nombre: string;
  id_ciudad: number;
  ciudad_nombre: string;
  id_sala: string;
  numero_sala: number;
  nombre_sala: string;
  id_formato: string;
  nombre_formato: string;
  codigo_formato: string;
  idioma_audio: string;
  formato_completo: string; // Ej: "2D Doblada", "IMAX Subtitulada"
  fecha: string; // ISO: YYYY-MM-DD
  hora_inicio: string; // HH:MM
  hora_fin: string; // HH:MM
  estado: string;
}

export interface FormatoGrupoDTO {
  formato_completo: string;
  nombre_formato: string;
  idioma_audio: string;
  horarios: FuncionItemDTO[];
}

export interface SedeFuncionesGrupoDTO {
  id_sede: number;
  nombre_sede: string;
  direccion: string;
  id_ciudad: number;
  nombre_ciudad: string;
  formatos: FormatoGrupoDTO[];
}

export interface DetallePeliculaResultadoDTO {
  pelicula: DetallePeliculaDTO;
  funciones: FuncionItemDTO[];
  ciudades: { id_ciudad: number; nombre: string }[];
  sedes: { id_sede: number; nombre: string; id_ciudad: number }[];
  dias: {
    codigo: string;
    fechaIso: string;
    diaSemanaCorto: string;
    diaSemanaLargo: string;
    diaMes: string;
    labelCorto: string;
    esHoy: boolean;
  }[];
}

export interface SeleccionFuncionCompra {
  id_funcion: string;
  id_pelicula: string;
  titulo_pelicula: string;
  url_poster?: string;
  id_sede: number;
  nombre_sede: string;
  id_sala: string;
  numero_sala: number;
  nombre_sala: string;
  fecha: string;
  fecha_formateada: string;
  hora: string;
  formato: string;
  idioma_audio: string;
}
