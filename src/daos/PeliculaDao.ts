// DAO para Películas y Funciones
// Acceso a datos de cartelera, banners y funciones desde Supabase

import { supabase } from "@/src/lib/supabase/cliente";
import type { PeliculaCarteleraDTO, FuncionResumenDTO } from "@/src/dtos/cartelera";

export class PeliculaDao {
  /**
   * Obtiene las películas activas para cartelera con sus géneros, formatos y sedes habilitadas.
   */
  static async obtenerPeliculasCartelera(): Promise<PeliculaCarteleraDTO[]> {
    const { data, error } = await supabase
      .from("pelicula")
      .select(`
        id_pelicula,
        titulo,
        sinopsis,
        duracion_min,
        clasificacion,
        trailer_url,
        url_poster,
        url_banner,
        tipo_lanzamiento,
        estado_cartelera,
        genero_pelicula (
          genero (
            id_genero,
            nombre
          )
        ),
        pelicula_formato (
          formato_proyeccion (
            id_formato,
            codigo,
            nombre
          )
        ),
        pelicula_sede (
          id_sede,
          habilitada,
          destacada_banner,
          orden_banner
        )
      `)
      .is("eliminado_en", null)
      .order("titulo", { ascending: true });

    if (error) {
      console.error("Error al obtener películas de cartelera:", error);
      throw new Error(`Error al obtener películas: ${error.message}`);
    }

    if (!data) return [];

    return data.map((item: any) => {
      // Extraer géneros
      const generos: string[] = (item.genero_pelicula || [])
        .map((gp: any) => gp.genero?.nombre)
        .filter(Boolean);

      // Extraer formatos
      const formatos: string[] = (item.pelicula_formato || [])
        .map((pf: any) => pf.formato_proyeccion?.nombre?.toUpperCase() || pf.formato_proyeccion?.codigo?.toUpperCase())
        .filter(Boolean);

      // Sedes donde está habilitada
      const sedesHabilitadas: number[] = (item.pelicula_sede || [])
        .filter((ps: any) => ps.habilitada)
        .map((ps: any) => ps.id_sede);

      // Banner prioritario
      const asignacionBanner = (item.pelicula_sede || []).find(
        (ps: any) => ps.destacada_banner
      );

      return {
        id_pelicula: item.id_pelicula,
        titulo: item.titulo,
        sinopsis: item.sinopsis,
        duracion_min: item.duracion_min,
        clasificacion: item.clasificacion,
        trailer_url: item.trailer_url,
        url_poster: item.url_poster,
        url_banner: item.url_banner,
        tipo_lanzamiento: item.tipo_lanzamiento,
        estado_cartelera: item.estado_cartelera,
        generos,
        formatos,
        sedes_disponibles: sedesHabilitadas,
        fechas_disponibles: [], // Se poblará con las funciones existentes
        destacada_banner: !!asignacionBanner,
        orden_banner: asignacionBanner?.orden_banner ?? null,
      };
    });
  }

  /**
   * Obtiene las funciones de la cartelera según filtros opcionales.
   */
  static async obtenerFunciones(filtros?: {
    id_sede?: number;
    fecha?: string;
    id_pelicula?: string;
  }): Promise<FuncionResumenDTO[]> {
    let query = supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_sede,
        id_pelicula,
        fecha,
        hora_inicio,
        hora_fin,
        idioma_audio,
        estado,
        sala (
          id_sala,
          nombre_sala,
          numero_sala
        ),
        formato_proyeccion (
          id_formato,
          codigo,
          nombre
        )
      `)
      .neq("estado", "Cancelada")
      .order("hora_inicio", { ascending: true });

    if (filtros?.id_sede) {
      query = query.eq("id_sede", filtros.id_sede);
    }
    if (filtros?.fecha) {
      query = query.eq("fecha", filtros.fecha);
    }
    if (filtros?.id_pelicula) {
      query = query.eq("id_pelicula", filtros.id_pelicula);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener funciones:", error);
      throw new Error(`Error al obtener funciones: ${error.message}`);
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id_funcion: item.id_funcion,
      id_sede: item.id_sede,
      id_pelicula: item.id_pelicula,
      fecha: item.fecha,
      hora_inicio: item.hora_inicio?.slice(0, 5) ?? item.hora_inicio,
      hora_fin: item.hora_fin?.slice(0, 5) ?? item.hora_fin,
      idioma_audio: item.idioma_audio,
      estado: item.estado,
      formato: item.formato_proyeccion?.codigo ?? "2d",
      nombre_formato: item.formato_proyeccion?.nombre ?? "2D",
      nombre_sala: item.sala?.nombre_sala ?? `Sala ${item.sala?.numero_sala ?? ""}`,
      numero_sala: item.sala?.numero_sala ?? 1,
    }));
  }

  /**
   * Obtiene una película por su ID con sus detalles completos.
   */
  static async obtenerPeliculaPorId(idPelicula: string): Promise<PeliculaCarteleraDTO | null> {
    const { data, error } = await supabase
      .from("pelicula")
      .select(`
        id_pelicula,
        titulo,
        sinopsis,
        duracion_min,
        clasificacion,
        trailer_url,
        url_poster,
        url_banner,
        tipo_lanzamiento,
        estado_cartelera,
        genero_pelicula (
          genero (
            id_genero,
            nombre
          )
        ),
        pelicula_formato (
          formato_proyeccion (
            id_formato,
            codigo,
            nombre
          )
        ),
        pelicula_sede (
          id_sede,
          habilitada,
          destacada_banner,
          orden_banner
        )
      `)
      .eq("id_pelicula", idPelicula)
      .is("eliminado_en", null)
      .maybeSingle();

    if (error || !data) {
      console.error(`Error al obtener película ${idPelicula}:`, error);
      return null;
    }

    const item = data as any;
    const generos: string[] = (item.genero_pelicula || [])
      .map((gp: any) => gp.genero?.nombre)
      .filter(Boolean);

    const formatos: string[] = (item.pelicula_formato || [])
      .map((pf: any) => pf.formato_proyeccion?.nombre?.toUpperCase() || pf.formato_proyeccion?.codigo?.toUpperCase())
      .filter(Boolean);

    const sedesHabilitadas: number[] = (item.pelicula_sede || [])
      .filter((ps: any) => ps.habilitada)
      .map((ps: any) => ps.id_sede);

    const asignacionBanner = (item.pelicula_sede || []).find(
      (ps: any) => ps.destacada_banner
    );

    return {
      id_pelicula: item.id_pelicula,
      titulo: item.titulo,
      sinopsis: item.sinopsis,
      duracion_min: item.duracion_min,
      clasificacion: item.clasificacion,
      trailer_url: item.trailer_url,
      url_poster: item.url_poster,
      url_banner: item.url_banner,
      tipo_lanzamiento: item.tipo_lanzamiento,
      estado_cartelera: item.estado_cartelera,
      generos,
      formatos,
      sedes_disponibles: sedesHabilitadas,
      fechas_disponibles: [],
      destacada_banner: !!asignacionBanner,
      orden_banner: asignacionBanner?.orden_banner ?? null,
    };
  }
}
