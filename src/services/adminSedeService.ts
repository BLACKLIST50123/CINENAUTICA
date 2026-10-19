// Servicio de Reglas de Negocio para Administrador de Sede
// Validación anti-solape, cálculo de horas con margen de limpieza, validaciones de integridad

import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type {
  NuevaFuncionPayload,
  ReprogramarFuncionPayload,
  PeriodoDashboard,
  NuevoPersonalPayload,
} from "@/src/dtos/adminSede";

export const MARGEN_LIMPIEZA_MINUTOS = 30;

export interface RangoHorario {
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
}

export class AdminSedeService {
  /**
   * Convierte una hora en formato "HH:mm" a minutos desde las 00:00.
   */
  static horaAMinutos(hora: string): number {
    const [h, m] = hora.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  /**
   * Convierte minutos desde las 00:00 a string "HH:mm".
   */
  static minutosAHora(minutosTotales: number): string {
    const minsNormalizados = ((minutosTotales % 1440) + 1440) % 1440;
    const h = Math.floor(minsNormalizados / 60);
    const m = minsNormalizados % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  /**
   * Calcula la hora de finalización estimada sumando la duración en minutos más el margen de limpieza (30 min).
   */
  static calcularHoraFinEstimada(
    duracionMinutos: number,
    horaInicio: string,
    margenLimpieza: number = MARGEN_LIMPIEZA_MINUTOS
  ): string {
    const minutosInicio = this.horaAMinutos(horaInicio);
    const minutosFin = minutosInicio + duracionMinutos + margenLimpieza;
    return this.minutosAHora(minutosFin);
  }

  /**
   * Valida si dos rangos horarios se solapan, considerando el margen de limpieza de la sala.
   */
  static seSolapan(
    rangoA: RangoHorario,
    rangoB: RangoHorario,
    margenLimpieza: number = 0
  ): boolean {
    const inicioA = this.horaAMinutos(rangoA.horaInicio);
    const finA = this.horaAMinutos(rangoA.horaFin) + margenLimpieza;
    const inicioB = this.horaAMinutos(rangoB.horaInicio);
    const finB = this.horaAMinutos(rangoB.horaFin) + margenLimpieza;

    return Math.max(inicioA, inicioB) < Math.min(finA, finB);
  }

  /**
   * Valida la disponibilidad de una sala para una fecha y horario antes de programar una función.
   */
  static async validarDisponibilidadSala(
    idSede: number,
    idSala: string,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    excludeFuncionId?: string
  ): Promise<{ disponible: boolean; conflictoCon?: string }> {
    const funcionesExistentes = await AdminSedeDao.obtenerFuncionesSede(idSede, fecha, idSala);

    const funcionesActivas = funcionesExistentes.filter(
      (f) => f.estado !== "CANCELADA" && f.estado !== "Cancelada" && f.id_funcion !== excludeFuncionId
    );

    const nuevoRango: RangoHorario = { horaInicio, horaFin };

    for (const fn of funcionesActivas) {
      const rangoExistente: RangoHorario = {
        horaInicio: fn.hora_inicio,
        horaFin: fn.hora_fin,
      };

      if (this.seSolapan(nuevoRango, rangoExistente)) {
        return {
          disponible: false,
          conflictoCon: `${fn.pelicula_titulo} (${fn.hora_inicio} - ${fn.hora_fin})`,
        };
      }
    }

    return { disponible: true };
  }

  /**
   * Valida datos de personal según AGENTS.md (DNI 8 dígitos, Teléfono 9 dígitos, correo corporativo).
   */
  static validarDatosPersonal(datos: NuevoPersonalPayload): { valido: boolean; error?: string } {
    if (!datos.nombre.trim() || !datos.apellido.trim()) {
      return { valido: false, error: "El nombre y apellido son obligatorios." };
    }

    const dniLimpio = datos.dni.trim();
    if (!/^\d{8}$/.test(dniLimpio)) {
      return { valido: false, error: "El DNI debe contener exactamente 8 dígitos numéricos." };
    }

    const telefonoLimpio = datos.telefono.trim();
    if (!/^\d{9}$/.test(telefonoLimpio)) {
      return { valido: false, error: "El teléfono debe contener exactamente 9 dígitos numéricos." };
    }

    const correoLimpio = datos.correo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      return { valido: false, error: "El correo electrónico ingresado no tiene un formato válido." };
    }

    return { valido: true };
  }

  /**
   * Programa una nueva función tras validar reglas anti-solape.
   */
  static async programarFuncion(
    payload: NuevaFuncionPayload
  ): Promise<{ exito: boolean; mensaje: string; idFuncion?: string }> {
    if (!payload.id_pelicula || !payload.id_sala || !payload.fecha || !payload.hora_inicio) {
      return { exito: false, mensaje: "Todos los campos de la función son obligatorios." };
    }

    const disponibilidad = await this.validarDisponibilidadSala(
      payload.id_sede,
      payload.id_sala,
      payload.fecha,
      payload.hora_inicio,
      payload.hora_fin
    );

    if (!disponibilidad.disponible) {
      return {
        exito: false,
        mensaje: `Horario en conflicto con la función de ${disponibilidad.conflictoCon}. Se debe respetar el margen de limpieza de la sala.`,
      };
    }

    try {
      const idFuncion = await AdminSedeDao.insertarFuncion(payload);
      return { exito: true, mensaje: "Función programada exitosamente.", idFuncion };
    } catch (err: any) {
      return { exito: false, mensaje: err.message || "Error al programar la función." };
    }
  }

  /**
   * Cancela una función con pase a contingencia.
   */
  static async cancelarFuncion(
    payload: ReprogramarFuncionPayload
  ): Promise<{ exito: boolean; mensaje: string }> {
    if (!payload.motivo.trim() || !payload.detalle_motivo.trim()) {
      return { exito: false, mensaje: "Debes especificar un motivo y detalle para cancelar la función." };
    }

    const ok = await AdminSedeDao.cancelarFuncionConContingencia(
      payload.id_funcion,
      payload.id_sede,
      payload.motivo,
      payload.detalle_motivo,
      payload.id_usuario_responsable
    );

    if (!ok) {
      return { exito: false, mensaje: "Ocurrió un error al registrar la cancelación de la función." };
    }

    return {
      exito: true,
      mensaje: "Función cancelada correctamente. Las órdenes asociadas han pasado a estado de Contingencia.",
    };
  }
}
