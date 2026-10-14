// Servicio de Lógica de Negocio para Detalle de Película y Selección de Funciones
// Orquesta datos de Funciones, Sedes, Ciudades y Horarios

import { FuncionDao } from "@/src/daos/FuncionDao";
import { SedeDao } from "@/src/daos/SedeDao";
import { CarteleraService } from "@/src/services/carteleraService";
import type {
  DetallePeliculaDTO,
  FuncionItemDTO,
  SedeFuncionesGrupoDTO,
  DetallePeliculaResultadoDTO,
  FormatoGrupoDTO,
  SeleccionFuncionCompra,
} from "@/src/dtos/funcion";

export class FuncionService {
  /**
   * Obtiene todos los datos requeridos para la vista de detalle de una película.
   */
  static async obtenerDetalleCompleto(
    idPeliculaOSlug: string,
    fechaBase: Date = new Date()
  ): Promise<DetallePeliculaResultadoDTO | null> {
    const pelicula = await FuncionDao.resolverPelicula(idPeliculaOSlug);
    if (!pelicula) return null;

    const [funciones, sedes, ciudades] = await Promise.all([
      FuncionDao.obtenerFuncionesPorPelicula(pelicula.id_pelicula),
      SedeDao.obtenerSedes(),
      SedeDao.obtenerCiudadesConSedes(),
    ]);

    const dias = CarteleraService.generarDiasCartelera(7, fechaBase);

    return {
      pelicula,
      funciones,
      ciudades: ciudades.map((c) => ({ id_ciudad: c.id_ciudad, nombre: c.nombre })),
      sedes: sedes.map((s) => ({ id_sede: s.id_sede, nombre: s.nombre, id_ciudad: s.ciudad.id_ciudad })),
      dias,
    };
  }

  /**
   * Agrupa y filtra funciones por fecha, ciudad y sede para renderizado en acordeón.
   */
  static agruparPorSedeYFormato(
    funciones: FuncionItemDTO[],
    filtros: {
      fechaIso: string;
      idCiudad?: number;
      idSede?: number;
    }
  ): SedeFuncionesGrupoDTO[] {
    const { fechaIso, idCiudad, idSede } = filtros;

    // 1. Filtrar por fecha exacta
    let filtradas = funciones.filter((f) => f.fecha === fechaIso);

    // 2. Filtrar por ciudad si está definida
    if (idCiudad) {
      filtradas = filtradas.filter((f) => f.id_ciudad === idCiudad);
    }

    // 3. Filtrar por sede si está definida
    if (idSede) {
      filtradas = filtradas.filter((f) => f.id_sede === idSede);
    }

    // 4. Agrupar por sede
    const sedesMap = new Map<number, SedeFuncionesGrupoDTO>();

    for (const f of filtradas) {
      if (!sedesMap.has(f.id_sede)) {
        sedesMap.set(f.id_sede, {
          id_sede: f.id_sede,
          nombre_sede: f.sede_nombre,
          direccion: "", // Opcional
          id_ciudad: f.id_ciudad,
          nombre_ciudad: f.ciudad_nombre,
          formatos: [],
        });
      }

      const sedeGrupo = sedesMap.get(f.id_sede)!;

      // Buscar o crear grupo de formato
      let formatoGrupo = sedeGrupo.formatos.find(
        (fg) => fg.formato_completo === f.formato_completo
      );

      if (!formatoGrupo) {
        formatoGrupo = {
          formato_completo: f.formato_completo,
          nombre_formato: f.nombre_formato,
          idioma_audio: f.idioma_audio,
          horarios: [],
        };
        sedeGrupo.formatos.push(formatoGrupo);
      }

      formatoGrupo.horarios.push(f);
    }

    // 5. Ordenar formatos y horarios
    const resultado = Array.from(sedesMap.values());
    for (const sede of resultado) {
      for (const fmt of sede.formatos) {
        fmt.horarios.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      }
    }

    return resultado;
  }

  /**
   * Helper para construir la selección de compra lista para guardar en SEL o contexto.
   */
  static prepararSeleccionCompra(
    funcion: FuncionItemDTO,
    pelicula: DetallePeliculaDTO,
    diaLabel: string
  ): SeleccionFuncionCompra {
    return {
      id_funcion: funcion.id_funcion,
      id_pelicula: pelicula.id_pelicula,
      titulo_pelicula: pelicula.titulo,
      url_poster: pelicula.url_poster,
      id_sede: funcion.id_sede,
      nombre_sede: funcion.sede_nombre,
      id_sala: funcion.id_sala,
      numero_sala: funcion.numero_sala,
      nombre_sala: funcion.nombre_sala,
      fecha: funcion.fecha,
      fecha_formateada: diaLabel,
      hora: funcion.hora_inicio,
      formato: funcion.formato_completo,
      idioma_audio: funcion.idioma_audio,
    };
  }
}
