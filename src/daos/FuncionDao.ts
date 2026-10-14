// DAO para Funciones y Detalle de Película
// Acceso a datos de películas y sus funciones programadas desde Supabase

import { supabase } from "@/src/lib/supabase/cliente";
import type { DetallePeliculaDTO, FuncionItemDTO } from "@/src/dtos/funcion";

export class FuncionDao {
  /**
   * Obtiene el detalle de una película por su ID (UUID).
   */
  static async obtenerPeliculaPorId(idPelicula: string): Promise<DetallePeliculaDTO | null> {
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
        )
      `)
      .eq("id_pelicula", idPelicula)
      .is("eliminado_en", null)
      .maybeSingle();

    if (error) {
      console.error(`Error al obtener película ${idPelicula}:`, error);
      throw new Error(`Error al obtener película: ${error.message}`);
    }

    if (!data) return null;

    const generos: string[] = (data.genero_pelicula || [])
      .map((gp: any) => gp.genero?.nombre)
      .filter(Boolean);

    const formatos: string[] = (data.pelicula_formato || [])
      .map((pf: any) => pf.formato_proyeccion?.nombre?.toUpperCase() || pf.formato_proyeccion?.codigo?.toUpperCase())
      .filter(Boolean);

    return {
      id_pelicula: data.id_pelicula,
      titulo: data.titulo,
      sinopsis: data.sinopsis || "",
      duracion_min: data.duracion_min || 0,
      clasificacion: data.clasificacion || "APT",
      trailer_url: data.trailer_url,
      url_poster: data.url_poster,
      url_banner: data.url_banner,
      tipo_lanzamiento: data.tipo_lanzamiento || "Normal",
      estado_cartelera: data.estado_cartelera || "Cartelera",
      generos,
      formatos: formatos.length > 0 ? formatos : ["2D"],
    };
  }

  /**
   * Obtiene todas las funciones activas de una película a partir de una fecha determinada.
   */
  static async obtenerFuncionesPorPelicula(
    idPelicula: string,
    fechaDesde?: string
  ): Promise<FuncionItemDTO[]> {
    let query = supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_pelicula,
        id_sede,
        id_sala,
        id_formato,
        fecha,
        hora_inicio,
        hora_fin,
        idioma_audio,
        estado,
        sala (
          id_sala,
          numero_sala,
          nombre_sala
        ),
        sede (
          id_sede,
          nombre,
          direccion,
          id_ciudad,
          ciudad (
            id_ciudad,
            nombre
          )
        ),
        formato_proyeccion (
          id_formato,
          codigo,
          nombre
        )
      `)
      .eq("id_pelicula", idPelicula)
      .neq("estado", "Cancelada");

    if (fechaDesde) {
      query = query.gte("fecha", fechaDesde);
    }

    const { data, error } = await query
      .order("fecha", { ascending: true })
      .order("hora_inicio", { ascending: true });

    if (error) {
      console.error(`Error al obtener funciones para la película ${idPelicula}:`, error);
      throw new Error(`Error al obtener funciones: ${error.message}`);
    }

    if (!data) return [];

    return data.map((item: any) => {
      const nombreFormato = item.formato_proyeccion?.nombre || item.formato_proyeccion?.codigo || "2D";
      const idioma = item.idioma_audio || "Doblada";
      const formatoCompleto = `${nombreFormato} ${idioma}`.trim();

      // Formatear horas cortas (ej. "16:00:00" -> "16:00")
      const horaInicio = (item.hora_inicio || "").substring(0, 5);
      const horaFin = (item.hora_fin || "").substring(0, 5);

      return {
        id_funcion: item.id_funcion,
        id_pelicula: item.id_pelicula,
        id_sede: item.id_sede,
        sede_nombre: item.sede?.nombre || "CineNáutica",
        id_ciudad: item.sede?.ciudad?.id_ciudad || item.sede?.id_ciudad || 1,
        ciudad_nombre: item.sede?.ciudad?.nombre || "Chimbote",
        id_sala: item.id_sala,
        numero_sala: item.sala?.numero_sala || 1,
        nombre_sala: item.sala?.nombre_sala || `Sala ${item.sala?.numero_sala || 1}`,
        id_formato: item.id_formato,
        nombre_formato: nombreFormato,
        codigo_formato: item.formato_proyeccion?.codigo || "2D",
        idioma_audio: idioma,
        formato_completo: formatoCompleto,
        fecha: item.fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: item.estado,
      };
    });
  }

  /**
   * Resuelve una película por su ID o por slug/título legacy.
   */
  static async resolverPelicula(idPeliculaOSlug: string): Promise<DetallePeliculaDTO | null> {
    const SLUGS_CONOCIDOS: Record<string, string> = {
      "spiderman": "a0000000-0000-0000-0000-000000000002",
      "endgame-bonus": "a0000000-0000-0000-0000-000000000001",
      "demonio": "a0000000-0000-0000-0000-000000000003",
    };

    const uuid = SLUGS_CONOCIDOS[idPeliculaOSlug] || idPeliculaOSlug;

    // Intentar por ID
    try {
      const peli = await this.obtenerPeliculaPorId(uuid);
      if (peli) return peli;
    } catch {
      // Si el id no es un uuid válido, buscar por título aproximado
    }

    // Búsqueda por coincidencia de título si se pasó un slug
    const { data } = await supabase
      .from("pelicula")
      .select("id_pelicula")
      .ilike("titulo", `%${idPeliculaOSlug.replace(/-/g, " ")}%`)
      .is("eliminado_en", null)
      .limit(1)
      .maybeSingle();

    if (data?.id_pelicula) {
      return this.obtenerPeliculaPorId(data.id_pelicula);
    }

    return null;
  }

  /**
   * Obtiene la información completa de una función específica para la compra de asientos.
   */
  static async obtenerFuncionCompraPorId(idFuncion: string) {
    const { data, error } = await supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_pelicula,
        id_sede,
        id_sala,
        id_formato,
        fecha,
        hora_inicio,
        hora_fin,
        idioma_audio,
        sala (
          id_sala,
          numero_sala,
          nombre_sala
        ),
        sede (
          id_sede,
          nombre,
          direccion
        ),
        formato_proyeccion (
          id_formato,
          codigo,
          nombre
        )
      `)
      .eq("id_funcion", idFuncion)
      .maybeSingle();

    if (error || !data) return null;

    // Consultar datos de la película directamente por id_pelicula
    const { data: peliData } = await supabase
      .from("pelicula")
      .select("id_pelicula, titulo, url_poster, clasificacion, tipo_lanzamiento")
      .eq("id_pelicula", data.id_pelicula)
      .maybeSingle();

    const nombreFormato = (data as any).formato_proyeccion?.nombre || (data as any).formato_proyeccion?.codigo || "2D";
    const idioma = (data as any).idioma_audio || "Doblada";
    const hora = ((data as any).hora_inicio || "").substring(0, 5);

    return {
      id_funcion: data.id_funcion,
      id_pelicula: data.id_pelicula,
      titulo: peliData?.titulo || "Película",
      url_poster: peliData?.url_poster || "",
      clasificacion: peliData?.clasificacion || "APT",
      es_prestreno: peliData?.tipo_lanzamiento === "Pre_Estreno",
      id_sede: data.id_sede,
      nombre_sede: (data as any).sede?.nombre || "CineNáutica",
      id_sala: data.id_sala,
      sala: (data as any).sala?.numero_sala || 1,
      nombre_sala: (data as any).sala?.nombre_sala || `Sala ${(data as any).sala?.numero_sala || 1}`,
      fecha: data.fecha,
      hora,
      formato: `${nombreFormato} ${idioma}`.trim(),
      nombre_formato: nombreFormato,
      idioma_audio: idioma,
    };
  }
}
