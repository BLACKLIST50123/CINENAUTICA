// DAO para Socio Náutica, Niveles y Movimientos de Puntos (Fase 8)
import { supabase } from "@/src/lib/supabase/cliente";
import type { NivelSocioDTO, MovimientoPuntosDTO } from "@/src/dtos/socio";

export class SocioDao {
  /**
   * Obtiene la lista de niveles del programa de lealtad ordenados por puntaje
   */
  static async obtenerNiveles(): Promise<NivelSocioDTO[]> {
    const { data, error } = await supabase
      .from("nivel_socio")
      .select("id_nivel, codigo, nombre, min_puntos, multiplicador, fila_preferencial, color_hex")
      .order("min_puntos", { ascending: true });

    if (error) {
      console.error("Error al obtener niveles de socio:", error);
      return [];
    }

    return (data || []).map((n) => ({
      id_nivel: n.id_nivel,
      codigo: n.codigo,
      nombre: n.nombre,
      min_puntos: n.min_puntos,
      multiplicador: Number(n.multiplicador),
      fila_preferencial: Boolean(n.fila_preferencial),
      color_hex: n.color_hex || "#CD7F32",
    }));
  }

  /**
   * Obtiene la información básica del socio junto a sus datos de usuario
   */
  static async obtenerSocioPorUsuario(idUsuario: string) {
    const { data, error } = await supabase
      .from("socio")
      .select(`
        id_usuario,
        codigo_socio,
        puntos,
        id_nivel,
        fecha_nacimiento,
        cumple_usado_en_anio,
        usuario (
          nombre,
          apellido,
          correo
        ),
        nivel_socio (
          id_nivel,
          codigo,
          nombre,
          min_puntos,
          multiplicador,
          fila_preferencial,
          color_hex
        )
      `)
      .eq("id_usuario", idUsuario)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Error al obtener socio por id_usuario:", error);
      return null;
    }

    const u = Array.isArray(data.usuario) ? data.usuario[0] : data.usuario;
    const n = Array.isArray(data.nivel_socio) ? data.nivel_socio[0] : data.nivel_socio;

    return {
      id_usuario: data.id_usuario,
      codigo_socio: data.codigo_socio,
      puntos: data.puntos,
      id_nivel: data.id_nivel,
      fecha_nacimiento: data.fecha_nacimiento,
      cumple_usado_en_anio: data.cumple_usado_en_anio,
      nombre: u?.nombre || "Socio",
      apellido: u?.apellido || "",
      correo: u?.correo || "",
      nivel: n
        ? {
            id_nivel: n.id_nivel,
            codigo: n.codigo,
            nombre: n.nombre,
            min_puntos: n.min_puntos,
            multiplicador: Number(n.multiplicador),
            fila_preferencial: Boolean(n.fila_preferencial),
            color_hex: n.color_hex || "#CD7F32",
          }
        : {
            id_nivel: 1,
            codigo: "BRONCE",
            nombre: "Bronce",
            min_puntos: 0,
            multiplicador: 1.0,
            fila_preferencial: false,
            color_hex: "#CD7F32",
          },
    };
  }

  /**
   * Obtiene los movimientos históricos de puntos del socio
   */
  static async obtenerHistorialPuntos(idUsuario: string): Promise<MovimientoPuntosDTO[]> {
    const { data, error } = await supabase
      .from("historial_puntos_socio")
      .select("id_historial_puntos, id_orden, id_sede, tipo, puntos, saldo_resultante, descripcion, fecha_hora")
      .eq("id_usuario", idUsuario)
      .order("fecha_hora", { ascending: false });

    if (error) {
      console.error("Error al obtener historial de puntos:", error);
      return [];
    }

    return (data || []).map((h) => ({
      id_historial_puntos: Number(h.id_historial_puntos),
      id_orden: h.id_orden,
      id_sede: h.id_sede,
      tipo: h.tipo,
      puntos: h.puntos,
      saldo_resultante: h.saldo_resultante,
      descripcion: h.descripcion,
      fecha_hora: h.fecha_hora,
    }));
  }
}
