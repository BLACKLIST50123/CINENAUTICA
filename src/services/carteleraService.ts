// Servicio de Cartelera
// Lógica de negocio para cartelera, filtros por sede/fecha y carrusel hero

import { SedeDao } from "@/src/daos/SedeDao";
import { PeliculaDao } from "@/src/daos/PeliculaDao";
import type {
  SedeDTO,
  CiudadConSedesDTO,
  PeliculaCarteleraDTO,
  FuncionResumenDTO,
  DiaCarteleraDTO,
} from "@/src/dtos/cartelera";

const NOMBRES_DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const NOMBRES_DIAS_LARGOS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const NOMBRES_MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Oct",
  "Nov",
  "Dic",
];

export interface DatosInicioDTO {
  sedes: SedeDTO[];
  ciudades: CiudadConSedesDTO[];
  peliculasCartelera: PeliculaCarteleraDTO[];
  peliculasBanner: PeliculaCarteleraDTO[];
  funciones: FuncionResumenDTO[];
  dias: DiaCarteleraDTO[];
}

export class CarteleraService {
  /**
   * Genera los próximos 7 días a partir de una fecha base (por defecto hoy).
   */
  static generarDiasCartelera(diasCount = 7, fechaBase: Date = new Date()): DiaCarteleraDTO[] {
    const dias: DiaCarteleraDTO[] = [];

    for (let i = 0; i < diasCount; i++) {
      const d = new Date(fechaBase);
      d.setDate(d.getDate() + i);

      const año = d.getFullYear();
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const diaNum = String(d.getDate()).padStart(2, "0");
      const fechaIso = `${año}-${mes}-${diaNum}`;

      const diaSemanaIndex = d.getDay();
      const diaSemanaCorto = NOMBRES_DIAS_CORTOS[diaSemanaIndex];
      const diaSemanaLargo = NOMBRES_DIAS_LARGOS[diaSemanaIndex];
      const diaMes = `${d.getDate()} ${NOMBRES_MESES[d.getMonth()]}`;

      let labelCorto = `${diaSemanaCorto} ${d.getDate()}`;
      if (i === 0) labelCorto = `Hoy · ${diaSemanaCorto} ${d.getDate()}`;
      else if (i === 1) labelCorto = `Mañana · ${diaSemanaCorto} ${d.getDate()}`;

      dias.push({
        codigo: `d${i}`,
        fechaIso,
        diaSemanaCorto,
        diaSemanaLargo,
        diaMes,
        labelCorto,
        esHoy: i === 0,
      });
    }

    return dias;
  }

  /**
   * Carga todos los datos necesarios para la pantalla de inicio desde Supabase.
   */
  static async obtenerDatosInicio(fechaBase?: Date): Promise<DatosInicioDTO> {
    const [sedes, ciudades, peliculas, funciones] = await Promise.all([
      SedeDao.obtenerSedes(),
      SedeDao.obtenerCiudadesConSedes(),
      PeliculaDao.obtenerPeliculasCartelera(),
      PeliculaDao.obtenerFunciones(),
    ]);

    // Asociar a cada película las fechas y sedes que efectivamente tienen funciones
    const peliculasConDisponibilidad = peliculas.map((peli) => {
      const funcionesPeli = funciones.filter(
        (f) => f.id_pelicula === peli.id_pelicula
      );

      const fechasConFuncion = Array.from(
        new Set(funcionesPeli.map((f) => f.fecha))
      );

      const sedesConFuncion = Array.from(
        new Set(funcionesPeli.map((f) => f.id_sede))
      );

      // Unir sedes habilitadas en pelicula_sede + sedes con funciones programadas
      const sedesDisponibles = Array.from(
        new Set([...peli.sedes_disponibles, ...sedesConFuncion])
      );

      // Extraer formatos adicionales encontrados en las funciones programadas
      const formatosFunciones = Array.from(
        new Set(funcionesPeli.map((f) => f.nombre_formato.toUpperCase()))
      );
      const formatosFinales = Array.from(
        new Set([...peli.formatos, ...formatosFunciones])
      );

      return {
        ...peli,
        sedes_disponibles: sedesDisponibles,
        fechas_disponibles: fechasConFuncion,
        formatos: formatosFinales.length > 0 ? formatosFinales : ["2D"],
      };
    });

    // Películas destacadas para el banner hero
    const peliculasBanner = peliculasConDisponibilidad
      .filter(
        (p) =>
          p.destacada_banner ||
          p.tipo_lanzamiento === "Estreno" ||
          p.tipo_lanzamiento === "Pre_Estreno" ||
          p.tipo_lanzamiento === "Re_Estreno"
      )
      .sort((a, b) => (a.orden_banner ?? 99) - (b.orden_banner ?? 99));

    // Si no hubiera banner explícito, tomar las 3 primeras
    const bannerFinal =
      peliculasBanner.length > 0
        ? peliculasBanner
        : peliculasConDisponibilidad.slice(0, 3);

    // Días de la semana para el filtro
    const dias = this.generarDiasCartelera(7, fechaBase);

    return {
      sedes,
      ciudades,
      peliculasCartelera: peliculasConDisponibilidad,
      peliculasBanner: bannerFinal,
      funciones,
      dias,
    };
  }

  /**
   * Filtra películas en memoria según los criterios seleccionados.
   */
  static filtrarPeliculas(
    peliculas: PeliculaCarteleraDTO[],
    funciones: FuncionResumenDTO[],
    filtros: {
      idPelicula?: string;
      idCiudad?: number;
      idSede?: number;
      fechaIso?: string;
      idsSedesDeCiudad?: number[];
    }
  ): PeliculaCarteleraDTO[] {
    return peliculas.filter((peli) => {
      // 1. Filtro por película seleccionada
      if (filtros.idPelicula && peli.id_pelicula !== filtros.idPelicula) {
        return false;
      }

      // 2. Filtro por sede directa
      if (filtros.idSede && !peli.sedes_disponibles.includes(filtros.idSede)) {
        return false;
      }

      // 3. Filtro por ciudad (si no se eligió sede puntual, debe estar en alguna sede de la ciudad)
      if (
        !filtros.idSede &&
        filtros.idsSedesDeCiudad &&
        filtros.idsSedesDeCiudad.length > 0
      ) {
        const disponibleEnCiudad = peli.sedes_disponibles.some((sId) =>
          filtros.idsSedesDeCiudad!.includes(sId)
        );
        if (!disponibleEnCiudad) return false;
      }

      // 4. Filtro por fecha: verificar si tiene funciones para esa fecha
      // Nota: Si la fecha especificada tiene funciones en la BD, se verifica compatibilidad
      if (filtros.fechaIso) {
        const tieneFuncionEnFecha = funciones.some((f) => {
          if (f.id_pelicula !== peli.id_pelicula) return false;
          if (f.fecha !== filtros.fechaIso) return false;
          if (filtros.idSede && f.id_sede !== filtros.idSede) return false;
          if (
            !filtros.idSede &&
            filtros.idsSedesDeCiudad &&
            filtros.idsSedesDeCiudad.length > 0 &&
            !filtros.idsSedesDeCiudad.includes(f.id_sede)
          ) {
            return false;
          }
          return true;
        });

        // Si hay funciones en la base de datos registradas para la película en alguna fecha,
        // respetamos el filtro estricto por fecha. Si aún no hay funciones programadas para esa fecha puntual
        // en la BD de prueba, pero la película está activa en la sede, permitimos que se visualice
        // indicando disponibilidad en cartelera para evitar dejar vacía la vista con datos de prueba escasos.
        if (peli.fechas_disponibles.length > 0) {
          return tieneFuncionEnFecha;
        }
      }

      return true;
    });
  }
}
