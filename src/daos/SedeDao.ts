// DAO para Sede y Ubicaciones
// Acceso a datos de sedes, ciudades y regiones desde Supabase

import { supabase } from "@/src/lib/supabase/cliente";
import type { SedeDTO, CiudadConSedesDTO } from "@/src/dtos/cartelera";

export class SedeDao {
  /**
   * Obtiene todas las sedes activas con su ciudad y región correspondiente.
   */
  static async obtenerSedes(): Promise<SedeDTO[]> {
    const { data, error } = await supabase
      .from("sede")
      .select(`
        id_sede,
        codigo,
        nombre,
        direccion,
        telefono,
        cant_salas,
        latitud,
        longitud,
        url_imagen,
        zona_horaria,
        activa,
        ciudad:id_ciudad (
          id_ciudad,
          nombre,
          region:id_region (
            id_region,
            nombre
          )
        )
      `)
      .eq("activa", true)
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener sedes desde Supabase:", error);
      throw new Error(`Error al obtener sedes: ${error.message}`);
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id_sede: item.id_sede,
      codigo: item.codigo,
      nombre: item.nombre,
      direccion: item.direccion,
      telefono: item.telefono,
      cant_salas: item.cant_salas,
      latitud: item.latitud ? Number(item.latitud) : null,
      longitud: item.longitud ? Number(item.longitud) : null,
      url_imagen: item.url_imagen,
      zona_horaria: item.zona_horaria,
      activa: item.activa,
      ciudad: {
        id_ciudad: item.ciudad?.id_ciudad ?? 0,
        nombre: item.ciudad?.nombre ?? "Sin Ciudad",
      },
      region: {
        id_region: item.ciudad?.region?.id_region ?? 0,
        nombre: item.ciudad?.region?.nombre ?? "Sin Región",
      },
    }));
  }

  /**
   * Obtiene las ciudades agrupadas con sus sedes activas.
   */
  static async obtenerCiudadesConSedes(): Promise<CiudadConSedesDTO[]> {
    const sedes = await this.obtenerSedes();
    const ciudadesMap = new Map<number, CiudadConSedesDTO>();

    for (const sede of sedes) {
      const idCiudad = sede.ciudad.id_ciudad;
      if (!ciudadesMap.has(idCiudad)) {
        ciudadesMap.set(idCiudad, {
          id_ciudad: idCiudad,
          nombre: sede.ciudad.nombre,
          region: sede.region.nombre,
          sedes: [],
        });
      }
      ciudadesMap.get(idCiudad)!.sedes.push(sede);
    }

    return Array.from(ciudadesMap.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }

  /**
   * Obtiene los datos de una sede específica por su ID.
   */
  static async obtenerSedePorId(idSede: number): Promise<SedeDTO | null> {
    const { data, error } = await supabase
      .from("sede")
      .select(`
        id_sede,
        codigo,
        nombre,
        direccion,
        telefono,
        cant_salas,
        latitud,
        longitud,
        url_imagen,
        zona_horaria,
        activa,
        ciudad:id_ciudad (
          id_ciudad,
          nombre,
          region:id_region (
            id_region,
            nombre
          )
        )
      `)
      .eq("id_sede", idSede)
      .eq("activa", true)
      .maybeSingle();

    if (error) {
      console.error(`Error al obtener sede ${idSede}:`, error);
      return null;
    }

    if (!data) return null;

    const item = data as any;
    return {
      id_sede: item.id_sede,
      codigo: item.codigo,
      nombre: item.nombre,
      direccion: item.direccion,
      telefono: item.telefono,
      cant_salas: item.cant_salas,
      latitud: item.latitud ? Number(item.latitud) : null,
      longitud: item.longitud ? Number(item.longitud) : null,
      url_imagen: item.url_imagen,
      zona_horaria: item.zona_horaria,
      activa: item.activa,
      ciudad: {
        id_ciudad: item.ciudad?.id_ciudad ?? 0,
        nombre: item.ciudad?.nombre ?? "Sin Ciudad",
      },
      region: {
        id_region: item.ciudad?.region?.id_region ?? 0,
        nombre: item.ciudad?.region?.nombre ?? "Sin Región",
      },
    };
  }
}
