// Servicio de Lógica de Negocio para Socio Náutica (Fase 8)
import { SocioDao } from "@/src/daos/SocioDao";
import type {
  NivelSocioDTO,
  ProgresoNivelDTO,
  EstadoCumpleanosDTO,
  PerfilSocioCompletoDTO,
} from "@/src/dtos/socio";

const NOMBRES_MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre",
];

export class SocioService {
  /**
   * Calcula el progreso porcentual y puntos faltantes hacia el siguiente nivel
   */
  static calcularProgreso(puntos: number, niveles: NivelSocioDTO[]): ProgresoNivelDTO {
    const ordenados = [...niveles].sort((a, b) => a.min_puntos - b.min_puntos);

    // Determinar nivel actual y siguiente
    let nivelActual = ordenados[0] || { nombre: "Bronce", min_puntos: 0 };
    let siguienteNivel: NivelSocioDTO | null = ordenados[1] || null;

    for (let i = 0; i < ordenados.length; i++) {
      if (puntos >= ordenados[i].min_puntos) {
        nivelActual = ordenados[i];
        siguienteNivel = ordenados[i + 1] || null;
      }
    }

    if (!siguienteNivel) {
      return {
        nivel_actual: nivelActual.nombre,
        siguiente_nivel: null,
        puntos_actuales: puntos,
        puntos_objetivo: nivelActual.min_puntos,
        puntos_faltantes: 0,
        porcentaje_progreso: 100,
      };
    }

    const rangoBase = nivelActual.min_puntos;
    const rangoObjetivo = siguienteNivel.min_puntos;
    const rangoTotal = rangoObjetivo - rangoBase;
    const avance = Math.max(0, puntos - rangoBase);
    const porcentaje = Math.min(100, Math.round((avance / rangoTotal) * 100));
    const faltantes = Math.max(0, rangoObjetivo - puntos);

    return {
      nivel_actual: nivelActual.nombre,
      siguiente_nivel: siguienteNivel.nombre,
      puntos_actuales: puntos,
      puntos_objetivo: rangoObjetivo,
      puntos_faltantes: faltantes,
      porcentaje_progreso: porcentaje,
    };
  }

  /**
   * Evalúa el estado del beneficio de cumpleaños
   */
  static evaluarCumpleanos(
    fechaNacimiento: string | null,
    cumpleUsadoEnAnio: number | null
  ): EstadoCumpleanosDTO {
    if (!fechaNacimiento) {
      return {
        es_mes_actual: false,
        mes_nombre: "No registrado",
        ya_usado: false,
        disponible: false,
        mensaje: "Registra tu fecha de nacimiento en tu perfil para recibir tu entrada gratis.",
      };
    }

    const d = new Date(fechaNacimiento);
    if (isNaN(d.getTime())) {
      return {
        es_mes_actual: false,
        mes_nombre: "No válido",
        ya_usado: false,
        disponible: false,
        mensaje: "Fecha de nacimiento no válida.",
      };
    }

    const mesNac = d.getUTCMonth();
    const nombreMes = NOMBRES_MESES[mesNac] || "este mes";

    const hoy = new Date();
    const mesActual = hoy.getUTCMonth();
    const anioActual = hoy.getUTCFullYear();

    const esMes = mesNac === mesActual;
    const yaUsado = cumpleUsadoEnAnio === anioActual;

    if (esMes) {
      if (yaUsado) {
        return {
          es_mes_actual: true,
          mes_nombre: nombreMes,
          ya_usado: true,
          disponible: false,
          mensaje: `Ya reclamaste tu beneficio de cumpleaños del año ${anioActual}.`,
        };
      }
      return {
        es_mes_actual: true,
        mes_nombre: nombreMes,
        ya_usado: false,
        disponible: true,
        mensaje: "¡Es tu mes de cumpleaños! Tienes una entrada 2D gratis disponible en counter.",
      };
    }

    return {
      es_mes_actual: false,
      mes_nombre: nombreMes,
      ya_usado: yaUsado,
      disponible: false,
      mensaje: `Tu cumpleaños es en ${nombreMes}. Tu beneficio se activará en ese mes.`,
    };
  }

  /**
   * Obtiene el perfil completo y enriquecido de un socio
   */
  static async obtenerPerfilCompleto(idUsuario: string): Promise<PerfilSocioCompletoDTO | null> {
    const [socio, niveles, movimientos] = await Promise.all([
      SocioDao.obtenerSocioPorUsuario(idUsuario),
      SocioDao.obtenerNiveles(),
      SocioDao.obtenerHistorialPuntos(idUsuario),
    ]);

    if (!socio) return null;

    const progreso = this.calcularProgreso(socio.puntos, niveles);
    const estadoCumple = this.evaluarCumpleanos(
      socio.fecha_nacimiento,
      socio.cumple_usado_en_anio
    );

    return {
      id_usuario: socio.id_usuario,
      codigo_socio: socio.codigo_socio,
      nombre: socio.nombre,
      apellido: socio.apellido,
      correo: socio.correo,
      puntos: socio.puntos,
      nivel: socio.nivel,
      fecha_nacimiento: socio.fecha_nacimiento,
      cumple_usado_en_anio: socio.cumple_usado_en_anio,
      progreso,
      estado_cumpleanos: estadoCumple,
      movimientos,
    };
  }
}
