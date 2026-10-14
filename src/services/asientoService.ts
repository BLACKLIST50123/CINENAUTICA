// Servicio de Gestión de Asientos, Mapa de Sala y Tarifas (Fase 4)
import { AsientoDao } from "@/src/daos/AsientoDao";
import { TarifaDao } from "@/src/daos/TarifaDao";
import type {
  AsientoDTO,
  SalaMatrizDTO,
  TipoEntradaDTO,
  TarifaVigenteDTO,
  EstadoAsientoVisual,
} from "@/src/dtos/asiento";

export const LIMITE_MAXIMO_ASIENTOS = 8;
export const DURACION_RESERVA_SEGUNDOS = 300; // 5 minutos
export const TIEMPO_GRACIA_SEGUNDOS = 30; // 30 segundos

export class AsientoService {
  /**
   * Obtiene la estructura completa de la sala y mapea el estado en vivo de cada butaca
   */
  static async obtenerMatrizSala(
    idSala: string,
    idFuncion: string,
    idSesion: string
  ): Promise<SalaMatrizDTO> {
    const sala = await AsientoDao.obtenerSala(idSala);
    if (!sala) {
      throw new Error("Sala no encontrada");
    }

    const [asientosFisicos, asientosFuncion, bloqueosActivos] = await Promise.all([
      AsientoDao.obtenerAsientosPorSala(idSala),
      AsientoDao.obtenerAsientosFuncion(idFuncion),
      AsientoDao.obtenerBloqueosActivos(idFuncion),
    ]);

    // Mapear asientos_funcion por id_asiento
    const mapaAsientoFuncion = new Map<string, { id_asiento_funcion: string; estado: string }>();
    asientosFuncion.forEach((af) => {
      mapaAsientoFuncion.set(af.id_asiento, {
        id_asiento_funcion: af.id_asiento_funcion,
        estado: af.estado,
      });
    });

    // Mapear bloqueos activos por id_asiento
    const mapaBloqueos = new Map<string, { id_sesion: string }>();
    bloqueosActivos.forEach((b) => {
      if (b.id_asiento) {
        mapaBloqueos.set(b.id_asiento, { id_sesion: b.id_sesion });
      }
    });

    // Filas únicas ordenadas alfabéticamente (ej. ["A", "B", "C", ...])
    const filasSet = new Set<string>();
    asientosFisicos.forEach((a) => filasSet.add(a.fila.trim().toUpperCase()));
    const filasNombres = Array.from(filasSet).sort();

    // Construir la matriz fila -> columna
    const grid: Record<string, (AsientoDTO | null)[]> = {};
    filasNombres.forEach((f) => {
      grid[f] = Array(sala.columnas).fill(null);
    });

    let totalDisponibles = 0;

    asientosFisicos.forEach((a) => {
      const fila = a.fila.trim().toUpperCase();
      const colIdx = a.columna - 1; // 0-indexed para el array

      if (colIdx >= 0 && colIdx < sala.columnas && grid[fila]) {
        const af = mapaAsientoFuncion.get(a.id_asiento);
        const bloqueo = mapaBloqueos.get(a.id_asiento);

        let estado: EstadoAsientoVisual = "disponible";

        if (a.en_mantenimiento) {
          estado = "mantenimiento";
        } else if (af?.estado === "Ocupado" || af?.estado === "Reservado") {
          estado = "ocupado";
        } else if (bloqueo) {
          if (bloqueo.id_sesion === idSesion) {
            estado = "seleccionado";
          } else {
            estado = "bloqueado_otro";
          }
        } else if (a.tipo_asiento.toLowerCase() === "accesible") {
          estado = "accesible";
        }

        if (estado === "disponible" || estado === "accesible" || estado === "seleccionado") {
          totalDisponibles++;
        }

        const dto: AsientoDTO = {
          id_asiento: a.id_asiento,
          id_sala: a.id_sala,
          fila,
          columna: a.columna,
          tipo_asiento: a.tipo_asiento,
          en_mantenimiento: a.en_mantenimiento,
          codigo: `${fila}${a.columna}`,
          id_asiento_funcion: af?.id_asiento_funcion || null,
          estado,
        };

        grid[fila][colIdx] = dto;
      }
    });

    return {
      id_sala: sala.id_sala,
      id_sede: sala.id_sede,
      numero_sala: sala.numero_sala,
      nombre_sala: sala.nombre_sala,
      filas: sala.filas,
      columnas: sala.columnas,
      pasillos: sala.pasillos || [],
      filas_nombres: filasNombres,
      grid,
      total_asientos: asientosFisicos.length,
      total_disponibles: totalDisponibles,
    };
  }

  /**
   * Motor de Tarifas Dinámicas (3 capas según Reglas de Negocio)
   * 1. Tarifa Base por Día / Pre-Estreno / Feriado / Sede
   * 2. Recargo por Formato de Proyección
   * 3. Descuento por Tipo de Entrada
   */
  static async obtenerTarifaVigente(
    fechaIso: string,
    formatoNombre: string,
    idSede: number,
    esPrestreno: boolean = false
  ): Promise<TarifaVigenteDTO> {
    const [tarifas, tarifasSede, feriados, formatos] = await Promise.all([
      TarifaDao.obtenerTarifas(),
      TarifaDao.obtenerTarifasSede(idSede),
      TarifaDao.obtenerFeriados(),
      TarifaDao.obtenerFormatos(),
    ]);

    // Parsear fecha
    const fechaObj = new Date(`${fechaIso}T00:00:00`);
    const jsDay = fechaObj.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const diaSemanaBD = jsDay === 0 ? 7 : jsDay; // 1 = Lunes ... 7 = Domingo

    // Verificar si es feriado
    const esFeriado = feriados.some((f) => f.fecha === fechaIso && f.activo);

    let tarifaElegida = tarifas[0];

    if (esPrestreno) {
      tarifaElegida =
        tarifas.find((t) => t.tipo_tarifa === "Prestreno") ||
        tarifas.find((t) => t.dia_semana === 7) ||
        tarifas[0];
    } else if (esFeriado) {
      // Feriado aplica Tarifa Alta (igual a domingo)
      tarifaElegida =
        tarifas.find((t) => t.dia_semana === 7) ||
        tarifas.find((t) => t.dia_semana === 6) ||
        tarifas[0];
    } else {
      // Por día de semana: Martes (2) = Económica, Lun/Mié (1,3) = Media, Jue-Dom (4,5,6,7) = Alta
      tarifaElegida =
        tarifas.find((t) => t.tipo_tarifa === "Dia_Semana" && t.dia_semana === diaSemanaBD) ||
        tarifas[0];
    }

    // Verificar si la sede tiene override en tarifa_sede
    let precioBase = tarifaElegida.precio;
    const precioSede = tarifasSede.find((ts) => ts.id_tarifa === tarifaElegida.id_tarifa);
    if (precioSede) {
      precioBase = precioSede.precio_local;
    }

    // Calcular recargo por formato
    const formatoLower = (formatoNombre || "").toLowerCase();
    let recargoFormato = 0;

    const formatoBD = formatos.find((f) =>
      formatoLower.includes(f.codigo.toLowerCase()) || formatoLower.includes(f.nombre.toLowerCase())
    );

    if (formatoBD) {
      recargoFormato = formatoBD.recargo;
    } else {
      // Fallback a reglas del negocio
      if (formatoLower.includes("premier")) recargoFormato = 40;
      else if (formatoLower.includes("imax")) recargoFormato = 36;
      else if (formatoLower.includes("vip")) recargoFormato = 20;
      else if (formatoLower.includes("4dx")) recargoFormato = 15;
      else if (formatoLower.includes("d-box") || formatoLower.includes("dbox")) recargoFormato = 15;
      else if (formatoLower.includes("xd")) recargoFormato = 8;
      else if (formatoLower.includes("3d")) recargoFormato = 5;
      else recargoFormato = 0;
    }

    const precioBaseConFormato = Math.round((precioBase + recargoFormato) * 100) / 100;

    return {
      id_tarifa: tarifaElegida.id_tarifa,
      tipo_tarifa: tarifaElegida.tipo_tarifa,
      dia_semana: tarifaElegida.dia_semana,
      precio_base: precioBase,
      recargo_formato: recargoFormato,
      precio_base_con_formato: precioBaseConFormato,
      es_feriado: esFeriado,
      es_prestreno: esPrestreno,
    };
  }

  /**
   * Calcula el precio final redondeado a 2 decimales para un tipo de entrada específico
   */
  static calcularPrecioEntrada(precioBaseConFormato: number, descuentoPct: number): number {
    const factor = (100 - descuentoPct) / 100;
    const precioFinal = precioBaseConFormato * factor;
    return Math.round(precioFinal * 100) / 100;
  }

  /**
   * Obtiene la lista de tipos de entrada activos
   */
  static async obtenerTiposEntrada(): Promise<TipoEntradaDTO[]> {
    return TarifaDao.obtenerTiposEntrada();
  }

  /**
   * Intenta seleccionar y bloquear un asiento para la sesión activa
   * Aplica la regla de negocio de MÁXIMO 8 ASIENTOS
   */
  static async seleccionarAsiento(
    idFuncion: string,
    idAsiento: string,
    idSesion: string,
    cantidadAsientosActuales: number,
    idUsuario?: string | null
  ): Promise<{ id_asiento_funcion: string; id_bloqueo: string }> {
    if (cantidadAsientosActuales >= LIMITE_MAXIMO_ASIENTOS) {
      throw new Error(
        `Has alcanzado el límite máximo permitido de ${LIMITE_MAXIMO_ASIENTOS} asientos por transacción.`
      );
    }

    // 1. Asegurar fila en asiento_funcion
    const idAsientoFuncion = await AsientoDao.asegurarAsientoFuncion(idFuncion, idAsiento);

    // 2. Crear bloqueo temporal de 5 minutos
    const idBloqueo = await AsientoDao.bloquearAsiento(idAsientoFuncion, idSesion, idUsuario);

    return { id_asiento_funcion: idAsientoFuncion, id_bloqueo: idBloqueo };
  }

  /**
   * Deselecciona y libera el bloqueo de un asiento
   */
  static async deseleccionarAsiento(idAsientoFuncion: string, idSesion: string): Promise<void> {
    await AsientoDao.liberarBloqueoAsiento(idAsientoFuncion, idSesion);
  }

  /**
   * Libera todos los asientos reservados por la sesión (al expirar o abandonar el flujo)
   */
  static async liberarTodosLosAsientos(idSesion: string): Promise<void> {
    await AsientoDao.liberarTodosLosBloqueosDeSesion(idSesion);
  }

  /**
   * Renueva el tiempo de expiración (+5 minutos) de los asientos bloqueados
   */
  static async renovarTiempoReserva(idSesion: string): Promise<void> {
    await AsientoDao.renovarBloqueosDeSesion(idSesion);
  }
}
