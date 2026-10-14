// DAO para Mensajes de Contacto y Atención al Cliente (Fase 10)
import { supabase } from "@/src/lib/supabase/cliente";

export interface MensajeContactoInputDTO {
  nombres: string;
  apellidos: string;
  correo: string;
  distrito?: string;
  mensaje: string;
}

export class ContactoDao {
  /**
   * Guarda un mensaje de contacto enviado por el cliente en Supabase
   */
  static async enviarMensaje(
    datos: MensajeContactoInputDTO
  ): Promise<{ ok: boolean; id_mensaje?: string; error?: string }> {
    try {
      const { data, error } = await (supabase as any)
        .from("mensaje_contacto")
        .insert({
          nombres: datos.nombres.trim(),
          apellidos: datos.apellidos.trim(),
          correo: datos.correo.trim().toLowerCase(),
          distrito: datos.distrito?.trim() || null,
          mensaje: datos.mensaje.trim(),
        })
        .select("id_mensaje")
        .single();

      if (error) {
        console.error("Error al guardar mensaje de contacto:", error);
        return { ok: false, error: error.message };
      }

      return { ok: true, id_mensaje: data?.id_mensaje };
    } catch (e: any) {
      console.error("Excepción al enviar mensaje de contacto:", e);
      return { ok: false, error: e.message || "Error desconocido" };
    }
  }
}
