// DAO para Asientos, Salas y Bloqueos Temporales (Fase 4)
import { supabase } from "@/src/lib/supabase/cliente";

export interface AsientoFisicoBD {
  id_asiento: string;
  id_sala: string;
  fila: string;
  columna: number;
  tipo_asiento: string;
  en_mantenimiento: boolean;
}

export interface SalaBD {
  id_sala: string;
  id_sede: number;
  numero_sala: number;
  nombre_sala: string;
  filas: number;
  columnas: number;
  pasillos: number[] | null;
  estado: string;
}

export interface AsientoFuncionBD {
  id_asiento_funcion: string;
  id_funcion: string;
  id_asiento: string;
  estado: "Disponible" | "Reservado" | "Ocupado";
}

export interface BloqueoTemporalBD {
  id_bloqueo: string;
  id_asiento_funcion: string;
  id_sesion: string;
  id_usuario?: string | null;
  fecha_hora_bloqueo: string;
  fecha_hora_expiracion: string;
  estado: "Activo" | "Expirado" | "Liberado" | "Confirmado";
  id_asiento?: string;
}

export class AsientoDao {
  /**
   * Obtiene la información estructural de una sala (filas, columnas, pasillos)
   */
  static async obtenerSala(idSala: string): Promise<SalaBD | null> {
    const { data, error } = await supabase
      .from("sala")
      .select("id_sala, id_sede, numero_sala, nombre_sala, filas, columnas, pasillos, estado")
      .eq("id_sala", idSala)
      .single();

    if (error) {
      console.error("Error al obtener sala:", error);
      throw new Error(`Error al obtener sala: ${error.message}`);
    }

    return data;
  }

  /**
   * Obtiene todos los asientos físicos registrados para una sala
   */
  static async obtenerAsientosPorSala(idSala: string): Promise<AsientoFisicoBD[]> {
    const { data, error } = await supabase
      .from("asiento")
      .select("id_asiento, id_sala, fila, columna, tipo_asiento, en_mantenimiento")
      .eq("id_sala", idSala)
      .order("fila", { ascending: true })
      .order("columna", { ascending: true });

    if (error) {
      console.error("Error al obtener asientos de sala:", error);
      throw new Error(`Error al obtener asientos de sala: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene el estado de los asientos para una función específica
   */
  static async obtenerAsientosFuncion(idFuncion: string): Promise<AsientoFuncionBD[]> {
    const { data, error } = await supabase
      .from("asiento_funcion")
      .select("id_asiento_funcion, id_funcion, id_asiento, estado")
      .eq("id_funcion", idFuncion);

    if (error) {
      console.error("Error al obtener asientos_funcion:", error);
      throw new Error(`Error al obtener asientos de función: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene los bloqueos temporales activos para una función
   */
  static async obtenerBloqueosActivos(idFuncion: string): Promise<BloqueoTemporalBD[]> {
    const ahoraIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("bloqueo_temporal")
      .select(`
        id_bloqueo,
        id_asiento_funcion,
        id_sesion,
        id_usuario,
        fecha_hora_bloqueo,
        fecha_hora_expiracion,
        estado,
        asiento_funcion!inner (
          id_funcion,
          id_asiento
        )
      `)
      .eq("asiento_funcion.id_funcion", idFuncion)
      .eq("estado", "Activo")
      .gt("fecha_hora_expiracion", ahoraIso);

    if (error) {
      console.error("Error al obtener bloqueos activos:", error);
      throw new Error(`Error al obtener bloqueos temporales: ${error.message}`);
    }

    return (data || []).map((b: any) => ({
      id_bloqueo: b.id_bloqueo,
      id_asiento_funcion: b.id_asiento_funcion,
      id_sesion: b.id_sesion,
      id_usuario: b.id_usuario,
      fecha_hora_bloqueo: b.fecha_hora_bloqueo,
      fecha_hora_expiracion: b.fecha_hora_expiracion,
      estado: b.estado,
      id_asiento: b.asiento_funcion?.id_asiento,
    }));
  }

  /**
   * Asegura la existencia de un registro en asiento_funcion y retorna su ID
   */
  static async asegurarAsientoFuncion(idFuncion: string, idAsiento: string): Promise<string> {
    // 1. Intentar consultar si ya existe
    const { data: existente } = await supabase
      .from("asiento_funcion")
      .select("id_asiento_funcion")
      .eq("id_funcion", idFuncion)
      .eq("id_asiento", idAsiento)
      .maybeSingle();

    if (existente?.id_asiento_funcion) {
      return existente.id_asiento_funcion;
    }

    // 2. Si no existe, insertar con estado 'Disponible'
    const { data: insertado, error } = await supabase
      .from("asiento_funcion")
      .insert({
        id_funcion: idFuncion,
        id_asiento: idAsiento,
        estado: "Disponible",
      })
      .select("id_asiento_funcion")
      .single();

    if (error) {
      // Si falló por conflicto concurrente, volver a consultar
      const { data: reintento } = await supabase
        .from("asiento_funcion")
        .select("id_asiento_funcion")
        .eq("id_funcion", idFuncion)
        .eq("id_asiento", idAsiento)
        .maybeSingle();

      if (reintento?.id_asiento_funcion) {
        return reintento.id_asiento_funcion;
      }

      console.error("Error al registrar asiento_funcion:", error);
      throw new Error(`No se pudo registrar la butaca en la función: ${error.message}`);
    }

    return insertado.id_asiento_funcion;
  }

  /**
   * Bloquea temporalmente un asiento durante 5 minutos para una sesión
   */
  static async bloquearAsiento(
    idAsientoFuncion: string,
    idSesion: string,
    idUsuario?: string | null
  ): Promise<string> {
    const ahora = new Date();
    const ahoraIso = ahora.toISOString();
    const expiracionIso = new Date(ahora.getTime() + 5 * 60 * 1000).toISOString();

    // 1. Verificar si ya está bloqueado por otra sesión activa
    const { data: bloqueosExistentes } = await supabase
      .from("bloqueo_temporal")
      .select("id_bloqueo, id_sesion, fecha_hora_expiracion, estado")
      .eq("id_asiento_funcion", idAsientoFuncion)
      .eq("estado", "Activo")
      .gt("fecha_hora_expiracion", ahoraIso);

    const bloqueoOtro = bloqueosExistentes?.find((b) => b.id_sesion !== idSesion);
    if (bloqueoOtro) {
      throw new Error("El asiento acaba de ser seleccionado por otro cliente.");
    }

    const bloqueoMio = bloqueosExistentes?.find((b) => b.id_sesion === idSesion);
    if (bloqueoMio) {
      // Renovar expiración del bloqueo existente
      await supabase
        .from("bloqueo_temporal")
        .update({
          fecha_hora_expiracion: expiracionIso,
        })
        .eq("id_bloqueo", bloqueoMio.id_bloqueo);

      return bloqueoMio.id_bloqueo;
    }

    // 2. Crear nuevo bloqueo temporal
    const { data: nuevoBloqueo, error } = await supabase
      .from("bloqueo_temporal")
      .insert({
        id_asiento_funcion: idAsientoFuncion,
        id_sesion: idSesion,
        id_usuario: idUsuario || null,
        fecha_hora_bloqueo: ahoraIso,
        fecha_hora_expiracion: expiracionIso,
        estado: "Activo",
      })
      .select("id_bloqueo")
      .single();

    if (error) {
      console.error("Error al crear bloqueo temporal:", error);
      throw new Error(`No se pudo bloquear el asiento: ${error.message}`);
    }

    return nuevoBloqueo.id_bloqueo;
  }

  /**
   * Libera el bloqueo temporal de un asiento específico de la sesión
   */
  static async liberarBloqueoAsiento(
    idAsientoFuncion: string,
    idSesion: string
  ): Promise<void> {
    const { error } = await supabase
      .from("bloqueo_temporal")
      .delete()
      .eq("id_asiento_funcion", idAsientoFuncion)
      .eq("id_sesion", idSesion);

    if (error) {
      console.warn("Advertencia al liberar bloqueo de asiento:", error.message);
    }
  }

  /**
   * Libera todos los bloqueos temporales activos de una sesión (al salir o expirar el tiempo)
   */
  static async liberarTodosLosBloqueosDeSesion(idSesion: string): Promise<void> {
    const { error } = await supabase
      .from("bloqueo_temporal")
      .delete()
      .eq("id_sesion", idSesion);

    if (error) {
      console.warn("Advertencia al liberar bloqueos de sesión:", error.message);
    }
  }

  /**
   * Renueva el tiempo de expiración (+5 minutos) de todos los bloqueos activos de una sesión
   */
  static async renovarBloqueosDeSesion(idSesion: string): Promise<void> {
    const expiracionIso = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("bloqueo_temporal")
      .update({
        fecha_hora_expiracion: expiracionIso,
      })
      .eq("id_sesion", idSesion)
      .eq("estado", "Activo");

    if (error) {
      console.warn("Advertencia al renovar bloqueos de sesión:", error.message);
    }
  }
}
