// DAO para Cupones de Descuento (Fase 6)
import { supabase } from "@/src/lib/supabase/cliente";
import type { CuponDTO } from "@/src/dtos/orden";

export class CuponDao {
  /**
   * Busca y valida un cupón por su código en una sede específica
   */
  static async buscarCuponPorCodigo(
    codigo: string,
    idSede: number
  ): Promise<CuponDTO | null> {
    const cleanCode = codigo.trim().toUpperCase();

    const { data, error } = await supabase
      .from("cupon")
      .select(`
        id_cupon,
        codigo,
        descripcion,
        tipo_descuento,
        valor,
        fecha_inicio,
        fecha_fin,
        usos_maximos,
        usos_actuales,
        activo,
        cupon_sede!inner (
          id_sede,
          habilitado,
          usos_maximos_sede,
          usos_sede
        )
      `)
      .eq("codigo", cleanCode)
      .eq("activo", true)
      .eq("cupon_sede.id_sede", idSede)
      .eq("cupon_sede.habilitado", true)
      .maybeSingle();

    if (error) {
      console.error("Error al buscar cupón en Supabase:", error);
      return null;
    }

    if (!data) return null;

    const hoy = new Date().toISOString().split("T")[0];
    if (data.fecha_inicio > hoy || data.fecha_fin < hoy) {
      return null;
    }

    if (data.usos_actuales >= data.usos_maximos) {
      return null;
    }

    const sedeData = Array.isArray(data.cupon_sede) ? data.cupon_sede[0] : data.cupon_sede;
    if (sedeData && sedeData.usos_maximos_sede && sedeData.usos_sede >= sedeData.usos_maximos_sede) {
      return null;
    }

    return {
      id_cupon: data.id_cupon,
      codigo: data.codigo,
      descripcion: data.descripcion || "",
      tipo_descuento: data.tipo_descuento as "Porcentaje" | "Fijo",
      valor: Number(data.valor),
      activo: Boolean(data.activo),
      usos_actuales: data.usos_actuales,
      usos_maximos: data.usos_maximos,
    };
  }

  /**
   * Obtiene todos los cupones activos vigentes para la cartelera / promociones
   */
  static async obtenerCuponesActivos(): Promise<CuponDTO[]> {
    const hoy = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("cupon")
      .select("id_cupon, codigo, descripcion, tipo_descuento, valor, usos_maximos, usos_actuales, activo, fecha_fin")
      .eq("activo", true)
      .gte("fecha_fin", hoy)
      .order("valor", { ascending: false });

    if (error || !data) {
      console.error("Error al obtener cupones activos:", error);
      return [];
    }

    return data.map((c: any) => ({
      id_cupon: c.id_cupon,
      codigo: c.codigo,
      descripcion: c.descripcion || "",
      tipo_descuento: c.tipo_descuento as "Porcentaje" | "Fijo",
      valor: Number(c.valor),
      activo: Boolean(c.activo),
      usos_actuales: c.usos_actuales,
      usos_maximos: c.usos_maximos,
    }));
  }
}

