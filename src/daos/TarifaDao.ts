// DAO para Tarifas, Tipos de Entrada y Feriados
import { supabase } from "@/src/lib/supabase/cliente";
import type { TipoEntradaDTO } from "@/src/dtos/asiento";

export interface TarifaBD {
  id_tarifa: string;
  tipo_tarifa: "Dia_Semana" | "Prestreno" | "Especial";
  dia_semana: number | null;
  precio: number;
  prioridad: number;
  activo: boolean;
}

export interface TarifaSedeBD {
  id_sede: number;
  id_tarifa: string;
  precio_local: number;
}

export interface FeriadoBD {
  id_feriado: string;
  fecha: string; // YYYY-MM-DD
  nombre: string;
  activo: boolean;
}

export interface FormatoProyeccionBD {
  id_formato: string;
  codigo: string;
  nombre: string;
  recargo: number;
  activo: boolean;
}

export class TarifaDao {
  /**
   * Obtiene todas las tarifas base activas
   */
  static async obtenerTarifas(): Promise<TarifaBD[]> {
    const { data, error } = await supabase
      .from("tarifa")
      .select("*")
      .eq("activo", true)
      .order("prioridad", { ascending: true });

    if (error) {
      console.error("Error al obtener tarifas:", error);
      throw new Error(`Error al obtener tarifas: ${error.message}`);
    }

    return (data || []).map((t: any) => ({
      ...t,
      precio: Number(t.precio),
    }));
  }

  /**
   * Obtiene los precios locales por sede
   */
  static async obtenerTarifasSede(idSede: number): Promise<TarifaSedeBD[]> {
    const { data, error } = await supabase
      .from("tarifa_sede")
      .select("*")
      .eq("id_sede", idSede);

    if (error) {
      console.error("Error al obtener tarifas por sede:", error);
      throw new Error(`Error al obtener tarifas por sede: ${error.message}`);
    }

    return (data || []).map((ts: any) => ({
      ...ts,
      precio_local: Number(ts.precio_local),
    }));
  }

  /**
   * Obtiene los tipos de entrada activos (General, Niño, Adulto Mayor, CONADIS)
   */
  static async obtenerTiposEntrada(): Promise<TipoEntradaDTO[]> {
    const { data, error } = await supabase
      .from("tipo_entrada")
      .select("*")
      .eq("activo", true)
      .order("descuento_pct", { ascending: true });

    if (error) {
      console.error("Error al obtener tipos de entrada:", error);
      throw new Error(`Error al obtener tipos de entrada: ${error.message}`);
    }

    return (data || []).map((te: any) => ({
      id_tipo_entrada: te.id_tipo_entrada,
      codigo: te.codigo,
      nombre: te.nombre,
      descuento_pct: Number(te.descuento_pct),
      obligatorio_legal: Boolean(te.obligatorio_legal),
      activo: Boolean(te.activo),
    }));
  }

  /**
   * Obtiene la lista de feriados registrados
   */
  static async obtenerFeriados(): Promise<FeriadoBD[]> {
    const { data, error } = await supabase
      .from("feriado")
      .select("*")
      .eq("activo", true);

    if (error) {
      console.error("Error al obtener feriados:", error);
      throw new Error(`Error al obtener feriados: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene los formatos de proyección con sus recargos correspondientes
   */
  static async obtenerFormatos(): Promise<FormatoProyeccionBD[]> {
    const { data, error } = await supabase
      .from("formato_proyeccion")
      .select("*")
      .eq("activo", true);

    if (error) {
      console.error("Error al obtener formatos de proyección:", error);
      throw new Error(`Error al obtener formatos: ${error.message}`);
    }

    return (data || []).map((f: any) => ({
      ...f,
      recargo: Number(f.recargo),
    }));
  }
}
