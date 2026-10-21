// DAO para Administrador de Sede (admin_sede)
// Consultas y operaciones a Supabase para los 9 paneles de la sede

import { supabase } from "@/src/lib/supabase/cliente";
import type {
  ContextoSedeDTO,
  MetricasDashboardDTO,
  PeriodoDashboard,
  PeliculaCatalogoSedeDTO,
  FuncionAdminSedeDTO,
  NuevaFuncionPayload,
  ProductoDulceriaSedeDTO,
  SalaDetalleSedeDTO,
  AsientoAdminSedeDTO,
  TarifaSedeDTO,
  CuponSedeDTO,
  SocioConsultaSedeDTO,
  PersonalSedeDTO,
  NuevoPersonalPayload,
  EditarPersonalPayload,
  VentaPersonalDTO,
} from "@/src/dtos/adminSede";

function getFechaLocalHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export class AdminSedeDao {
  /**
   * 1. Obtiene información de contexto de la sede en vivo (cabecera y context-bar).
   */
  static async obtenerContextoSede(idSede: number): Promise<ContextoSedeDTO | null> {
    const { data: sede, error } = await supabase
      .from("sede")
      .select(`
        id_sede,
        nombre,
        direccion,
        cant_salas,
        activa,
        ciudad:id_ciudad (
          nombre,
          region:id_region ( nombre )
        )
      `)
      .eq("id_sede", idSede)
      .single();

    if (error || !sede) {
      console.error(`Error al obtener sede ${idSede}:`, error);
      return null;
    }

    const hoy = getFechaLocalHoy();

    // Contar funciones de hoy en la sede
    const { count: funcionesHoy } = await supabase
      .from("funcion")
      .select("id_funcion", { count: "exact", head: true })
      .eq("id_sede", idSede)
      .eq("fecha", hoy)
      .neq("estado", "Cancelada");

    // Calcular ocupación estimada de hoy
    const { data: funcionesData } = await supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_sala,
        asiento_funcion ( id_asiento_funcion, estado )
      `)
      .eq("id_sede", idSede)
      .eq("fecha", hoy)
      .neq("estado", "Cancelada");

    let totalOcupados = 0;
    let totalCapacidad = 0;

    if (funcionesData && funcionesData.length > 0) {
      const { data: salas } = await supabase
        .from("sala")
        .select("id_sala, filas, columnas")
        .eq("id_sede", idSede);

      const salaCapacidadMap = new Map<string, number>();
      (salas || []).forEach((s: any) => {
        salaCapacidadMap.set(s.id_sala, (s.filas || 7) * (s.columnas || 12));
      });

      for (const fn of funcionesData) {
        const cap = salaCapacidadMap.get(fn.id_sala) || 84;
        totalCapacidad += cap;
        const ocupados = (fn.asiento_funcion || []).filter((af: any) => {
          const est = (af.estado || "").toLowerCase();
          return est === "ocupado" || est === "vendido";
        }).length;
        totalOcupados += ocupados;
      }
    }

    const ocupacionPct = totalCapacidad > 0 ? Math.round((totalOcupados / totalCapacidad) * 100) : 0;

    return {
      id_sede: sede.id_sede,
      nombre: sede.nombre,
      ciudad: (sede.ciudad as any)?.nombre || "Chimbote",
      region: (sede.ciudad as any)?.region?.nombre || "Áncash",
      direccion: sede.direccion,
      cant_salas: sede.cant_salas || 6,
      activa: sede.activa ?? true,
      funciones_hoy: funcionesHoy || 0,
      ocupacion_hoy_pct: Math.min(100, Math.max(0, ocupacionPct)),
    };
  }

  /**
   * 2. Métricas y KPIs agregados para el Dashboard de la sede.
   */
  static async obtenerMetricasDashboard(
    idSede: number,
    periodo: PeriodoDashboard
  ): Promise<MetricasDashboardDTO> {
    const ahora = new Date();
    let fechaInicioFiltro: Date;

    if (periodo === 'hoy') {
      fechaInicioFiltro = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    } else if (periodo === '7d') {
      fechaInicioFiltro = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (periodo === '30d') {
      fechaInicioFiltro = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      fechaInicioFiltro = new Date(ahora.getFullYear(), 0, 1, 0, 0, 0);
    }

    const isoFechaInicio = fechaInicioFiltro.toISOString();

    // Obtener órdenes de la sede
    const { data: ordenes } = await supabase
      .from("orden")
      .select(`
        id_orden,
        codigo_orden,
        fecha_creacion,
        canal,
        estado,
        subtotal_entradas,
        subtotal_productos,
        total,
        nombre_contacto,
        correo_contacto,
        detalle_entrada ( id_detalle_entrada, estado )
      `)
      .eq("id_sede", idSede)
      .gte("fecha_creacion", isoFechaInicio)
      .neq("estado", "Cancelada")
      .order("fecha_creacion", { ascending: false });

    let ingresosTotales = 0;
    let entradasVendidas = 0;
    let ingresosDulceria = 0;
    const ordenesList = ordenes || [];

    ordenesList.forEach((ord: any) => {
      ingresosTotales += Number(ord.total || 0);
      ingresosDulceria += Number(ord.subtotal_productos || 0);
      entradasVendidas += (ord.detalle_entrada || []).filter(
        (de: any) => de.estado === "Vigente" || !de.estado
      ).length;
    });

    // Obtener funciones del periodo
    const hoyIso = getFechaLocalHoy();
    const fechaMin = periodo === 'hoy' ? hoyIso : fechaInicioFiltro.toISOString().split('T')[0];

    // Obtener salas de la sede con sus asientos y formatos admitidos
    const { data: salasData } = await supabase
      .from("sala")
      .select(`
        id_sala,
        numero_sala,
        nombre_sala,
        filas,
        columnas,
        asiento (
          id_asiento,
          en_mantenimiento,
          tipo_asiento
        ),
        sala_formato (
          formato_proyeccion ( nombre, codigo )
        )
      `)
      .eq("id_sede", idSede)
      .order("numero_sala", { ascending: true });

    const { data: funcionesData } = await supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_pelicula,
        id_sala,
        fecha,
        hora_inicio,
        hora_fin,
        idioma_audio,
        pelicula ( id_pelicula, titulo, url_poster ),
        sala ( id_sala, numero_sala, nombre_sala, filas, columnas ),
        formato_proyeccion ( id_formato, nombre, codigo ),
        asiento_funcion (
          id_asiento_funcion,
          estado,
          detalle_entrada ( precio_unitario, estado )
        )
      `)
      .eq("id_sede", idSede)
      .gte("fecha", fechaMin)
      .neq("estado", "Cancelada")
      .order("hora_inicio", { ascending: true });

    // Calcular ocupación y desglose de salas
    let totalCap = 0;
    let totalOcup = 0;
    const salaMap = new Map<string, {
      id_sala: string;
      numero_sala: number;
      nombre_sala: string;
      funciones_count: number;
      capacidad: number;
      ocupados: number;
      recaudacion: number;
    }>();

    // Mapeo de películas para Top Películas
    const peliMap = new Map<string, {
      id_pelicula: string;
      titulo: string;
      url_poster: string;
      entradas_vendidas: number;
      recaudacion: number;
    }>();

    (funcionesData || []).forEach((fn: any) => {
      const sala = fn.sala;
      const capSala = (sala?.filas || 7) * (sala?.columnas || 12);
      const ocupadosList = (fn.asiento_funcion || []).filter((af: any) => {
        const est = (af.estado || "").toLowerCase();
        return est === "ocupado" || est === "vendido";
      });
      const ocupados = ocupadosList.length;

      let fnRecaudacion = 0;
      ocupadosList.forEach((af: any) => {
        const de = af.detalle_entrada?.[0];
        const precio = Number(de?.precio_unitario || 0);
        fnRecaudacion += precio > 0 ? precio : 18;
      });

      totalCap += capSala;
      totalOcup += ocupados;

      if (sala?.id_sala) {
        const item = salaMap.get(sala.id_sala) || {
          id_sala: sala.id_sala,
          numero_sala: sala.numero_sala || 1,
          nombre_sala: sala.nombre_sala || `Sala ${sala.numero_sala}`,
          funciones_count: 0,
          capacidad: 0,
          ocupados: 0,
          recaudacion: 0,
        };
        item.funciones_count += 1;
        item.capacidad += capSala;
        item.ocupados += ocupados;
        item.recaudacion += fnRecaudacion;
        salaMap.set(sala.id_sala, item);
      }

      const peli = fn.pelicula;
      if (peli?.id_pelicula) {
        const itemP = peliMap.get(peli.id_pelicula) || {
          id_pelicula: peli.id_pelicula,
          titulo: peli.titulo || "Película",
          url_poster: peli.url_poster || "",
          entradas_vendidas: 0,
          recaudacion: 0,
        };
        itemP.entradas_vendidas += ocupados;
        itemP.recaudacion += fnRecaudacion;
        peliMap.set(peli.id_pelicula, itemP);
      }
    });

    const ocupacionPromedio = totalCap > 0 ? Math.round((totalOcup / totalCap) * 100) : 0;

    const rendimientoSalas = Array.from(salaMap.values()).map(s => ({
      id_sala: s.id_sala,
      numero_sala: s.numero_sala,
      nombre_sala: s.nombre_sala,
      funciones_count: s.funciones_count,
      ocupacion_pct: s.capacidad > 0 ? Math.round((s.ocupados / s.capacidad) * 100) : 0,
      recaudacion: s.recaudacion,
    }));

    // Construir estructura jerárquica: Sala -> Fechas -> Funciones
    const rendimientoSalasDetalle = (salasData || []).map((s: any) => {
      const asientos = s.asiento || [];
      const buenEstado = asientos.filter(
        (a: any) => !a.en_mantenimiento && (a.tipo_asiento || "").toLowerCase() !== "pasillo"
      ).length;
      const mantenimiento = asientos.filter((a: any) => a.en_mantenimiento).length;
      const accesibles = asientos.filter(
        (a: any) => (a.tipo_asiento || "").toLowerCase() === "accesible"
      ).length;
      const capacidadTotal = (s.filas || 7) * (s.columnas || 12);

      const formatos = Array.from(
        new Set(
          (s.sala_formato || [])
            .map((sf: any) => sf.formato_proyeccion?.nombre || sf.formato_proyeccion?.codigo)
            .filter(Boolean)
        )
      );
      const formatosStr = formatos.length > 0 ? formatos.join(" / ") : "2D";

      // Funciones de esta sala en el periodo
      const funcionesDeSala = (funcionesData || []).filter((fn: any) => fn.id_sala === s.id_sala);

      // Agrupar funciones de esta sala por fecha
      const fechaMap = new Map<string, any[]>();
      funcionesDeSala.forEach((fn: any) => {
        const fKey = fn.fecha;
        const list = fechaMap.get(fKey) || [];
        list.push(fn);
        fechaMap.set(fKey, list);
      });

      // Ordenar fechas cronológicamente
      const fechasSorted = Array.from(fechaMap.keys()).sort();
      const fechasDTO = fechasSorted.map((fKey) => {
        const fnList = fechaMap.get(fKey) || [];
        const partes = fKey.split("-");
        const fObj = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        const fStr = fObj.toLocaleDateString("es-PE", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }).toUpperCase();

        const funcionesDTO = fnList.map((fn: any) => {
          const ocupadosList = (fn.asiento_funcion || []).filter((af: any) => {
            const est = (af.estado || "").toLowerCase();
            return est === "ocupado" || est === "vendido";
          });
          const ocupados = ocupadosList.length;
          const cap = capacidadTotal > 0 ? capacidadTotal : 84;
          const pct = Math.min(100, Math.round((ocupados / cap) * 100));

          return {
            id_funcion: fn.id_funcion,
            titulo_pelicula: fn.pelicula?.titulo || "Película",
            hora_inicio: (fn.hora_inicio || "").substring(0, 5),
            hora_fin: (fn.hora_fin || "").substring(0, 5),
            formato_nombre: fn.formato_proyeccion?.nombre || fn.formato_proyeccion?.codigo || "2D",
            idioma: fn.idioma_audio || "Doblada",
            capacidad: cap,
            ocupados: ocupados,
            ocupacion_pct: pct,
          };
        });

        return {
          fecha: fKey,
          fecha_formateada: fStr,
          total_funciones: funcionesDTO.length,
          funciones: funcionesDTO,
        };
      });

      return {
        id_sala: s.id_sala,
        numero_sala: s.numero_sala || 1,
        nombre_sala: s.nombre_sala || `Sala ${s.numero_sala || 1}`,
        formatos_str: formatosStr,
        capacidad_total: capacidadTotal,
        asientos_buen_estado: buenEstado > 0 ? buenEstado : capacidadTotal,
        asientos_mantenimiento: mantenimiento,
        asientos_accesibles: accesibles,
        total_funciones: funcionesDeSala.length,
        fechas: fechasDTO,
      };
    });

    const topPeliculas = Array.from(peliMap.values())
      .sort((a, b) => b.entradas_vendidas - a.entradas_vendidas)
      .slice(0, 5);

    const ultimasVentas = ordenesList.slice(0, 8).map((ord: any) => ({
      id_orden: ord.id_orden,
      codigo_orden: ord.codigo_orden,
      fecha_creacion: ord.fecha_creacion,
      cliente: ord.nombre_contacto || ord.correo_contacto || "Cliente Presencial",
      canal: ord.canal || "Web",
      total: Number(ord.total || 0),
      estado: ord.estado,
    }));

    return {
      periodo,
      ingresos_totales: Number(ingresosTotales.toFixed(2)),
      entradas_vendidas: entradasVendidas,
      ingresos_dulceria: Number(ingresosDulceria.toFixed(2)),
      ocupacion_promedio_pct: Math.min(100, Math.max(0, ocupacionPromedio)),
      total_transacciones: ordenesList.length,
      top_peliculas: topPeliculas,
      rendimiento_salas: rendimientoSalas,
      rendimiento_salas_detalle: rendimientoSalasDetalle,
      ultimas_ventas: ultimasVentas,
    };
  }

  /**
   * 3. Obtiene todo el catálogo general de películas con su estado de banner en la sede.
   */
  static async obtenerPeliculasCatalogoSede(idSede: number): Promise<PeliculaCatalogoSedeDTO[]> {
    const { data: peliculas, error } = await supabase
      .from("pelicula")
      .select(`
        id_pelicula,
        titulo,
        sinopsis,
        duracion_min,
        clasificacion,
        url_poster,
        url_banner,
        tipo_lanzamiento,
        estado_cartelera,
        genero_pelicula ( genero ( nombre ) )
      `)
      .is("eliminado_en", null)
      .order("titulo", { ascending: true });

    if (error || !peliculas) {
      console.error("Error al obtener catálogo de películas:", error);
      return [];
    }

    // Obtener configuración de banners en pelicula_sede
    const { data: psData } = await supabase
      .from("pelicula_sede")
      .select("id_pelicula, destacada_banner, orden_banner")
      .eq("id_sede", idSede);

    const bannerMap = new Map<string, { destacada: boolean; orden: number | null }>();
    (psData || []).forEach((ps: any) => {
      bannerMap.set(ps.id_pelicula, {
        destacada: ps.destacada_banner ?? false,
        orden: ps.orden_banner ?? null,
      });
    });

    // Contar funciones activas en la sede para cada película
    const { data: funciones } = await supabase
      .from("funcion")
      .select("id_pelicula")
      .eq("id_sede", idSede)
      .neq("estado", "Cancelada");

    const funcionesMap = new Map<string, number>();
    (funciones || []).forEach((f: any) => {
      funcionesMap.set(f.id_pelicula, (funcionesMap.get(f.id_pelicula) || 0) + 1);
    });

    return peliculas.map((p: any) => {
      const bannerInfo = bannerMap.get(p.id_pelicula) || { destacada: false, orden: null };
      const generos = (p.genero_pelicula || [])
        .map((gp: any) => gp.genero?.nombre)
        .filter(Boolean);

      return {
        id_pelicula: p.id_pelicula,
        titulo: p.titulo,
        sinopsis: p.sinopsis,
        duracion_min: p.duracion_min || 120,
        clasificacion: p.clasificacion || "TE",
        url_poster: p.url_poster || "",
        url_banner: p.url_banner || "",
        tipo_lanzamiento: p.tipo_lanzamiento || "Estreno",
        estado_cartelera: p.estado_cartelera || "Cartelera",
        generos,
        destacada_banner: bannerInfo.destacada,
        orden_banner: bannerInfo.orden,
        total_funciones_sede: funcionesMap.get(p.id_pelicula) || 0,
      };
    });
  }

  /**
   * 4. Actualiza si una película está destacada en el banner de la sede.
   */
  static async actualizarBannerPeliculaSede(
    idSede: number,
    idPelicula: string,
    destacadaBanner: boolean
  ): Promise<boolean> {
    const { data: existente } = await supabase
      .from("pelicula_sede")
      .select("id_sede")
      .eq("id_sede", idSede)
      .eq("id_pelicula", idPelicula)
      .maybeSingle();

    if (existente) {
      const { error } = await supabase
        .from("pelicula_sede")
        .update({
          destacada_banner: destacadaBanner,
          actualizado_en: new Date().toISOString(),
        })
        .eq("id_sede", idSede)
        .eq("id_pelicula", idPelicula);

      return !error;
    } else {
      const { error } = await supabase
        .from("pelicula_sede")
        .insert({
          id_sede: idSede,
          id_pelicula: idPelicula,
          habilitada: true,
          destacada_banner: destacadaBanner,
          fecha_inicio: getFechaLocalHoy(),
        });

      return !error;
    }
  }

  /**
   * 5. Obtiene las funciones de la sede para una fecha y/o sala, con ocupación real.
   */
  static async obtenerFuncionesSede(
    idSede: number,
    fecha?: string,
    idSala?: string
  ): Promise<FuncionAdminSedeDTO[]> {
    let query = supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_sede,
        id_pelicula,
        id_sala,
        id_formato,
        fecha,
        hora_inicio,
        hora_fin,
        idioma_audio,
        estado,
        pelicula ( id_pelicula, titulo, duracion_min, url_poster, tipo_lanzamiento ),
        sala ( id_sala, numero_sala, nombre_sala, filas, columnas ),
        formato_proyeccion ( id_formato, nombre, codigo ),
        asiento_funcion ( id_asiento_funcion, estado )
      `)
      .eq("id_sede", idSede);

    if (fecha) {
      query = query.eq("fecha", fecha);
    }
    if (idSala) {
      query = query.eq("id_sala", idSala);
    }

    const { data, error } = await query.order("hora_inicio", { ascending: true });

    if (error || !data) {
      console.error("Error al obtener funciones de sede:", error);
      return [];
    }

    return data.map((item: any) => {
      const sala = item.sala;
      const capacidad = (sala?.filas || 7) * (sala?.columnas || 12);
      const ocupados = (item.asiento_funcion || []).filter((af: any) => {
        const est = (af.estado || "").toLowerCase();
        return est === "ocupado" || est === "vendido";
      }).length;

      return {
        id_funcion: item.id_funcion,
        id_sede: item.id_sede,
        id_pelicula: item.id_pelicula,
        pelicula_titulo: item.pelicula?.titulo || "Película",
        pelicula_duracion_min: item.pelicula?.duracion_min || 120,
        pelicula_poster: item.pelicula?.url_poster || "",
        tipo_lanzamiento: item.pelicula?.tipo_lanzamiento || "Regular",
        id_sala: item.id_sala,
        sala_numero: item.sala?.numero_sala || 1,
        sala_nombre: item.sala?.nombre_sala || `Sala ${item.sala?.numero_sala || 1}`,
        id_formato: item.id_formato,
        formato_nombre: item.formato_proyeccion?.nombre || item.formato_proyeccion?.codigo || "2D",
        fecha: item.fecha,
        hora_inicio: (item.hora_inicio || "").substring(0, 5),
        hora_fin: (item.hora_fin || "").substring(0, 5),
        idioma_audio: item.idioma_audio || "Doblada",
        estado: item.estado || "PROGRAMADA",
        asientos_ocupados: ocupados,
        asientos_capacidad: capacidad,
      };
    });
  }

  /**
   * 6. Inserta una nueva función en la sede.
   */
  static async insertarFuncion(payload: NuevaFuncionPayload): Promise<string> {
    const { data, error } = await supabase
      .from("funcion")
      .insert({
        id_sede: payload.id_sede,
        id_pelicula: payload.id_pelicula,
        id_sala: payload.id_sala,
        id_formato: payload.id_formato,
        fecha: payload.fecha,
        hora_inicio: payload.hora_inicio,
        hora_fin: payload.hora_fin,
        idioma_audio: payload.idioma_audio,
        estado: "Programada",
        creado_por: payload.creado_por || null,
      })
      .select("id_funcion")
      .single();

    if (error || !data) {
      console.error("Error al insertar función en Supabase:", error);
      throw new Error(`Error al programar función: ${error?.message || "Error desconocido"}`);
    }

    return data.id_funcion;
  }

  /**
   * 7. Cancela una función y pasa las órdenes a 'Contingencia' con registro de auditoría.
   */
  static async cancelarFuncionConContingencia(
    idFuncion: string,
    idSede: number,
    motivo: string,
    detalle: string,
    idUsuarioResponsable: string
  ): Promise<boolean> {
    // 1. Obtener datos de la función actual
    const { data: fn } = await supabase
      .from("funcion")
      .select("id_sala, fecha, hora_inicio, hora_fin")
      .eq("id_funcion", idFuncion)
      .single();

    // 2. Registrar en reprogramacion_funcion
    await supabase
      .from("reprogramacion_funcion")
      .insert({
        id_sede: idSede,
        id_funcion: idFuncion,
        id_sala_anterior: fn?.id_sala || "",
        id_sala_nueva: fn?.id_sala || "",
        fecha_anterior: fn?.fecha || getFechaLocalHoy(),
        hora_inicio_anterior: fn?.hora_inicio || "00:00:00",
        hora_fin_anterior: fn?.hora_fin || "00:00:00",
        fecha_nueva: fn?.fecha || getFechaLocalHoy(),
        hora_inicio_nueva: fn?.hora_inicio || "00:00:00",
        hora_fin_nueva: fn?.hora_fin || "00:00:00",
        motivo: motivo,
        detalle_motivo: detalle,
        id_usuario_responsable: idUsuarioResponsable,
      });

    // 3. Cambiar estado de la función a 'Cancelada'
    const { error: errFuncion } = await supabase
      .from("funcion")
      .update({ estado: "Cancelada", actualizado_en: new Date().toISOString() })
      .eq("id_funcion", idFuncion);

    if (errFuncion) {
      console.error("Error al cancelar función:", errFuncion);
      return false;
    }

    // 4. Buscar órdenes con tickets para esta función y pasarlas a 'Contingencia'
    const { data: asientosFuncion } = await supabase
      .from("asiento_funcion")
      .select("id_asiento_funcion")
      .eq("id_funcion", idFuncion);

    if (asientosFuncion && asientosFuncion.length > 0) {
      const idsAf = asientosFuncion.map((a: any) => a.id_asiento_funcion);
      const { data: detalles } = await supabase
        .from("detalle_entrada")
        .select("id_orden")
        .in("id_asiento_funcion", idsAf);

      if (detalles && detalles.length > 0) {
        const idsOrdenes = Array.from(new Set(detalles.map((d: any) => d.id_orden)));
        await supabase
          .from("orden")
          .update({ estado: "Contingencia" as any })
          .in("id_orden", idsOrdenes);
      }
    }

    return true;
  }

  /**
   * 8. Obtiene los productos de confitería con su estado y precio local para la sede.
   */
  static async obtenerProductosDulceriaSede(idSede: number): Promise<ProductoDulceriaSedeDTO[]> {
    const { data: productos, error } = await supabase
      .from("producto")
      .select(`
        id_producto,
        nombre,
        descripcion,
        precio_base,
        url_imagen,
        categoria:id_categoria ( nombre )
      `)
      .is("eliminado_en", null)
      .order("nombre", { ascending: true });

    if (error || !productos) {
      console.error("Error al obtener productos de dulcería:", error);
      return [];
    }

    const { data: psData } = await supabase
      .from("producto_sede")
      .select("id_producto, habilitado, precio_local")
      .eq("id_sede", idSede);

    const sedeMap = new Map<string, { habilitado: boolean; precioLocal: number | null }>();
    (psData || []).forEach((ps: any) => {
      sedeMap.set(ps.id_producto, {
        habilitado: ps.habilitado ?? true,
        precioLocal: ps.precio_local ? Number(ps.precio_local) : null,
      });
    });

    return productos.map((p: any) => {
      const infoSede = sedeMap.get(p.id_producto);
      const precioBase = Number(p.precio_base || 0);
      const precioLocal = infoSede?.precioLocal !== null && infoSede?.precioLocal !== undefined
        ? Number(infoSede.precioLocal)
        : precioBase;
      const habilitado = infoSede?.habilitado !== undefined ? infoSede.habilitado : true;

      return {
        id_producto: p.id_producto,
        nombre: p.nombre,
        descripcion: p.descripcion || "",
        precio_base: precioBase,
        precio_local: precioLocal,
        url_imagen: p.url_imagen || "/img/dulceria/combo1.png",
        categoria_nombre: (p.categoria as any)?.nombre || "General",
        habilitado: habilitado,
      };
    });
  }

  /**
   * 9. Actualiza visibilidad (mostrar/ocultar) y precio local de un producto en la sede.
   */
  static async actualizarVisibilidadYPrecioDulce(
    idSede: number,
    idProducto: string,
    habilitado: boolean,
    precioLocal?: number
  ): Promise<boolean> {
    const { data: existente } = await supabase
      .from("producto_sede")
      .select("id_sede")
      .eq("id_sede", idSede)
      .eq("id_producto", idProducto)
      .maybeSingle();

    if (existente) {
      const { error } = await supabase
        .from("producto_sede")
        .update({
          habilitado: habilitado,
          ...(precioLocal !== undefined ? { precio_local: precioLocal } : {}),
          actualizado_en: new Date().toISOString(),
        })
        .eq("id_sede", idSede)
        .eq("id_producto", idProducto);

      return !error;
    } else {
      const { error } = await supabase
        .from("producto_sede")
        .insert({
          id_sede: idSede,
          id_producto: idProducto,
          habilitado: habilitado,
          precio_local: precioLocal ?? 0,
        });

      return !error;
    }
  }

  /**
   * 10. Obtiene las salas de la sede con sus dimensiones, formatos y butacas.
   */
  static async obtenerSalasSede(idSede: number): Promise<SalaDetalleSedeDTO[]> {
    const { data: salas, error } = await supabase
      .from("sala")
      .select(`
        id_sala,
        id_sede,
        numero_sala,
        nombre_sala,
        filas,
        columnas,
        pasillos,
        estado,
        sala_formato (
          formato_proyeccion (
            id_formato,
            codigo,
            nombre
          )
        )
      `)
      .eq("id_sede", idSede)
      .order("numero_sala", { ascending: true });

    if (error || !salas) {
      console.error("Error al obtener salas de la sede:", error);
      return [];
    }

    // Para cada sala, traer sus asientos
    const resultado: SalaDetalleSedeDTO[] = [];

    for (const s of salas) {
      const { data: asientos } = await supabase
        .from("asiento")
        .select("id_asiento, id_sala, fila, columna, tipo_asiento, en_mantenimiento")
        .eq("id_sala", s.id_sala)
        .order("fila", { ascending: true })
        .order("columna", { ascending: true });

      const formatos = (s.sala_formato || [])
        .map((sf: any) => ({
          id_formato: sf.formato_proyeccion?.id_formato || "",
          codigo: sf.formato_proyeccion?.codigo || "",
          nombre: sf.formato_proyeccion?.nombre || "",
        }))
        .filter((f: any) => f.id_formato);

      const listaAsientos: AsientoAdminSedeDTO[] = (asientos || []).map((a: any) => ({
        id_asiento: a.id_asiento,
        id_sala: a.id_sala,
        fila: a.fila,
        columna: a.columna,
        tipo_asiento: a.tipo_asiento || "Normal",
        en_mantenimiento: a.en_mantenimiento ?? false,
      }));

      resultado.push({
        id_sala: s.id_sala,
        id_sede: s.id_sede,
        numero_sala: s.numero_sala,
        nombre_sala: s.nombre_sala,
        filas: s.filas || 7,
        columnas: s.columnas || 12,
        pasillos: Array.isArray(s.pasillos) ? s.pasillos : [],
        estado: s.estado || "ACTIVA",
        capacidad_total: listaAsientos.length || (s.filas || 7) * (s.columnas || 12),
        formatos_soportados: formatos,
        asientos: listaAsientos,
      });
    }

    return resultado;
  }

  /**
   * 11. Crea una nueva sala con sus butacas y formatos asociados.
   */
  static async crearSalaSede(
    idSede: number,
    nombre: string,
    filas: number,
    columnas: number,
    formatosIds: string[]
  ): Promise<string> {
    // 1. Obtener siguiente número de sala
    const { data: salasExistentes } = await supabase
      .from("sala")
      .select("numero_sala")
      .eq("id_sede", idSede)
      .order("numero_sala", { ascending: false })
      .limit(1);

    const proximoNum = (salasExistentes?.[0]?.numero_sala || 0) + 1;

    // 2. Insertar sala
    const { data: nuevaSala, error } = await supabase
      .from("sala")
      .insert({
        id_sede: idSede,
        numero_sala: proximoNum,
        nombre_sala: nombre || `Sala ${proximoNum}`,
        filas: filas,
        columnas: columnas,
        pasillos: [],
        estado: "ACTIVA" as any,
      })
      .select("id_sala")
      .single();

    if (error || !nuevaSala) {
      console.error("Error al crear sala:", error);
      throw new Error(`No se pudo crear la sala: ${error?.message}`);
    }

    const idSala = nuevaSala.id_sala;

    // 3. Generar butacas iniciales
    const asientosInsertar = [];
    for (let f = 0; f < filas; f++) {
      const letraFila = String.fromCharCode(65 + f);
      for (let c = 1; c <= columnas; c++) {
        asientosInsertar.push({
          id_sala: idSala,
          fila: letraFila,
          columna: c,
          tipo_asiento: "Normal",
          en_mantenimiento: false,
        });
      }
    }

    await supabase.from("asiento").insert(asientosInsertar);

    // 4. Asignar formatos
    if (formatosIds.length > 0) {
      const formatosInsert = formatosIds.map(fid => ({
        id_sala: idSala,
        id_formato: fid,
      }));
      await supabase.from("sala_formato").insert(formatosInsert);
    }

    return idSala;
  }

  /**
   * 12. Elimina una sala de la sede si no tiene funciones ni ventas.
   */
  static async eliminarSalaSede(idSala: string): Promise<{ exito: boolean; mensaje: string }> {
    // 1. Validar funciones activas
    const { count: funcionesCount } = await supabase
      .from("funcion")
      .select("id_funcion", { count: "exact", head: true })
      .eq("id_sala", idSala)
      .neq("estado", "Cancelada");

    if (funcionesCount && funcionesCount > 0) {
      return {
        exito: false,
        mensaje: `No se puede eliminar la sala porque tiene ${funcionesCount} función(es) activa(s) programada(s).`,
      };
    }

    // 2. Eliminar asientos asociados
    await supabase.from("asiento").delete().eq("id_sala", idSala);

    // 3. Eliminar formatos de sala
    await supabase.from("sala_formato").delete().eq("id_sala", idSala);

    // 4. Eliminar sala
    const { error } = await supabase.from("sala").delete().eq("id_sala", idSala);

    if (error) {
      return { exito: false, mensaje: `Error al eliminar la sala: ${error.message}` };
    }

    return { exito: true, mensaje: "Sala eliminada con éxito." };
  }

  /**
   * 13. Actualiza el estado de butacas en mantenimiento o pasillos de una sala.
   */
  static async actualizarMantenimientoAsiento(
    idAsiento: string,
    enMantenimiento: boolean
  ): Promise<boolean> {
    const { error } = await supabase
      .from("asiento")
      .update({ en_mantenimiento: enMantenimiento })
      .eq("id_asiento", idAsiento);

    return !error;
  }

  /**
   * 14. Actualiza estado de la sala (ACTIVA / MANTENIMIENTO) y sus pasillos.
   */
  static async actualizarConfiguracionSala(
    idSala: string,
    estado: string,
    pasillos?: number[]
  ): Promise<boolean> {
    const updatePayload: any = { estado };
    if (pasillos !== undefined) updatePayload.pasillos = pasillos;

    const { error } = await supabase
      .from("sala")
      .update(updatePayload)
      .eq("id_sala", idSala);

    return !error;
  }

  /**
   * 15. Consulta tarifas generales y tarifas de la sede (Lunes a Domingo).
   */
  static async obtenerTarifasSede(idSede: number): Promise<TarifaSedeDTO[]> {
    const { data: tarifas, error } = await supabase
      .from("tarifa")
      .select("id_tarifa, tipo_tarifa, dia_semana, precio, activo")
      .order("prioridad", { ascending: true });

    if (error || !tarifas) {
      console.error("Error al obtener tarifas:", error);
      return [];
    }

    const { data: tsData } = await supabase
      .from("tarifa_sede")
      .select("id_tarifa, precio_local")
      .eq("id_sede", idSede);

    const precioLocalMap = new Map<string, number>();
    (tsData || []).forEach((ts: any) => {
      precioLocalMap.set(ts.id_tarifa, Number(ts.precio_local));
    });

    const nombresDias: Record<number, string> = {
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado",
      7: "Domingo",
    };

    return tarifas.map((t: any) => {
      const precioBase = Number(t.precio || 0);
      const precioLoc = precioLocalMap.get(t.id_tarifa) ?? precioBase;
      const esDia = t.tipo_tarifa === "Dia_Semana" && t.dia_semana !== null;

      return {
        id_tarifa: t.id_tarifa,
        tipo_tarifa: t.tipo_tarifa,
        dia_semana: t.dia_semana,
        dia_nombre: t.dia_semana ? nombresDias[t.dia_semana] : undefined,
        precio_general: precioBase,
        precio_local: precioLoc,
        es_dia_semana: esDia,
        activo: t.activo ?? true,
      };
    });
  }

  /**
   * 16. Guarda el precio local de una tarifa de día de semana para la sede.
   */
  static async guardarTarifaSede(
    idSede: number,
    idTarifa: string,
    precioLocal: number
  ): Promise<boolean> {
    const { data: existente } = await supabase
      .from("tarifa_sede")
      .select("id_sede")
      .eq("id_sede", idSede)
      .eq("id_tarifa", idTarifa)
      .maybeSingle();

    if (existente) {
      const { error } = await supabase
        .from("tarifa_sede")
        .update({ precio_local: precioLocal })
        .eq("id_sede", idSede)
        .eq("id_tarifa", idTarifa);

      return !error;
    } else {
      const { error } = await supabase
        .from("tarifa_sede")
        .insert({
          id_sede: idSede,
          id_tarifa: idTarifa,
          precio_local: precioLocal,
        });

      return !error;
    }
  }

  /**
   * 17. Consulta los cupones activos y configurados para la sede.
   */
  static async obtenerCuponesSede(idSede: number): Promise<CuponSedeDTO[]> {
    const { data: cupones, error } = await supabase
      .from("cupon")
      .select("id_cupon, codigo, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, activo")
      .is("eliminado_en", null)
      .order("codigo", { ascending: true });

    if (error || !cupones) {
      console.error("Error al obtener cupones:", error);
      return [];
    }

    const { data: csData } = await supabase
      .from("cupon_sede")
      .select("id_cupon, habilitado, usos_sede, usos_maximos_sede")
      .eq("id_sede", idSede);

    const sedeMap = new Map<string, { habilitado: boolean; usos: number; maxUsos: number | null }>();
    (csData || []).forEach((cs: any) => {
      sedeMap.set(cs.id_cupon, {
        habilitado: cs.habilitado ?? true,
        usos: cs.usos_sede || 0,
        maxUsos: cs.usos_maximos_sede ?? null,
      });
    });

    return cupones.map((c: any) => {
      const infoSede = sedeMap.get(c.id_cupon);

      return {
        id_cupon: c.id_cupon,
        codigo: c.codigo,
        descripcion: c.descripcion || "",
        porcentaje_descuento: Number(c.valor || 0),
        fecha_inicio: c.fecha_inicio || "",
        fecha_fin: c.fecha_fin || "",
        habilitado_sede: infoSede ? infoSede.habilitado : true,
        usos_sede: infoSede?.usos || 0,
        usos_maximos_sede: infoSede?.maxUsos ?? null,
        es_local: Boolean(infoSede && infoSede.maxUsos),
      };
    });
  }

  /**
   * 18. Crea un cupón local exclusivo para la sede.
   */
  static async crearCuponLocal(
    idSede: number,
    datos: {
      codigo: string;
      descripcion: string;
      porcentaje: number;
      fechaFin: string;
      maxUsos: number;
    }
  ): Promise<boolean> {
    const codigoUpper = datos.codigo.trim().toUpperCase();
    const hoy = getFechaLocalHoy();

    const { data: cupon, error } = await supabase
      .from("cupon")
      .insert({
        codigo: codigoUpper,
        descripcion: datos.descripcion,
        tipo_descuento: "Porcentaje",
        valor: datos.porcentaje,
        fecha_inicio: hoy,
        fecha_fin: datos.fechaFin,
        usos_maximos: datos.maxUsos,
        usos_actuales: 0,
        activo: true,
      })
      .select("id_cupon")
      .single();

    if (error || !cupon) {
      console.error("Error al crear cupón local:", error);
      return false;
    }

    await supabase.from("cupon_sede").insert({
      id_sede: idSede,
      id_cupon: cupon.id_cupon,
      habilitado: true,
      usos_maximos_sede: datos.maxUsos,
      usos_sede: 0,
    });

    return true;
  }

  /**
   * 19. Activa, pausa o actualiza el cupo de un cupón en la sede.
   */
  static async actualizarCuponSede(
    idSede: number,
    idCupon: string,
    habilitado: boolean,
    maxUsos?: number
  ): Promise<boolean> {
    const { data: existente } = await supabase
      .from("cupon_sede")
      .select("id_sede")
      .eq("id_sede", idSede)
      .eq("id_cupon", idCupon)
      .maybeSingle();

    if (existente) {
      const updateData: any = { habilitado };
      if (maxUsos !== undefined) updateData.usos_maximos_sede = maxUsos;

      const { error } = await supabase
        .from("cupon_sede")
        .update(updateData)
        .eq("id_sede", idSede)
        .eq("id_cupon", idCupon);

      return !error;
    } else {
      const { error } = await supabase
        .from("cupon_sede")
        .insert({
          id_sede: idSede,
          id_cupon: idCupon,
          habilitado: habilitado,
          usos_maximos_sede: maxUsos ?? 100,
          usos_sede: 0,
        });

      return !error;
    }
  }

  /**
   * 20. Búsqueda reactiva de socios por DNI, correo o nombre.
   */
  static async buscarSociosSede(termino: string): Promise<SocioConsultaSedeDTO[]> {
    if (!termino || termino.trim().length < 2) return [];

    const cleanTerm = termino.trim().toLowerCase();

    const { data, error } = await supabase
      .from("socio")
      .select(`
        id_usuario,
        codigo_socio,
        puntos,
        fecha_nacimiento,
        cumple_usado_en_anio,
        usuario!socio_id_usuario_fkey (
          nombre,
          apellido,
          correo,
          dni,
          telefono
        ),
        nivel_socio (
          nombre,
          multiplicador
        )
      `)
      .limit(50);

    if (error || !data) {
      console.error("Error al buscar socios:", error);
      return [];
    }

    return (data || [])
      .filter((s: any) => {
        const u = s.usuario;
        if (!u) return false;
        const nombreCompleto = `${u.nombre || ""} ${u.apellido || ""}`.toLowerCase();
        return (
          nombreCompleto.includes(cleanTerm) ||
          (u.dni || "").toLowerCase().includes(cleanTerm) ||
          (u.correo || "").toLowerCase().includes(cleanTerm) ||
          (s.codigo_socio || "").toLowerCase().includes(cleanTerm)
        );
      })
      .map((s: any) => ({
        id_usuario: s.id_usuario,
        codigo_socio: s.codigo_socio || "SOC-000",
        nombre: s.usuario?.nombre || "",
        apellido: s.usuario?.apellido || "",
        correo: s.usuario?.correo || "",
        dni: s.usuario?.dni || "",
        telefono: s.usuario?.telefono || "",
        nivel: (s.nivel_socio as any)?.nombre || "Bronce",
        multiplicador_puntos: Number((s.nivel_socio as any)?.multiplicador || 1),
        puntos_actuales: s.puntos || 0,
        fecha_nacimiento: s.fecha_nacimiento,
        cumple_usado_en_anio: s.cumple_usado_en_anio,
        visitas_sede_count: 3, // Indicador de actividad
      }));
  }

  /**
   * 21. Obtiene el personal asignado a la sede con métricas de ventas.
   */
  static async obtenerPersonalSede(idSede: number): Promise<PersonalSedeDTO[]> {
    const { data, error } = await supabase
      .from("personal_sede")
      .select(`
        id_usuario,
        id_sede,
        activo,
        asignado_en,
        usuario:id_usuario (
          id_usuario,
          nombre,
          apellido,
          correo,
          dni,
          telefono,
          id_rol,
          activo,
          nota,
          fecha_registro,
          id_usuario_creador,
          rol:id_rol (
            id_rol,
            codigo,
            nombre_rol
          )
        )
      `)
      .eq("id_sede", idSede);

    if (error || !data) {
      console.error("Error al obtener personal de sede:", error);
      return [];
    }

    // Para cada colaborador, traer órdenes del mes
    const primerDiaMes = new Date();
    primerDiaMes.setDate(1);
    primerDiaMes.setHours(0, 0, 0, 0);

    const { data: ordenesMes } = await supabase
      .from("orden")
      .select("id_vendedor, total")
      .eq("id_sede", idSede)
      .gte("fecha_creacion", primerDiaMes.toISOString());

    const ventasPorVendedor = new Map<string, { count: number; total: number }>();
    (ordenesMes || []).forEach((o: any) => {
      if (o.id_vendedor) {
        const item = ventasPorVendedor.get(o.id_vendedor) || { count: 0, total: 0 };
        item.count += 1;
        item.total += Number(o.total || 0);
        ventasPorVendedor.set(o.id_vendedor, item);
      }
    });

    return data.map((item: any) => {
      const u = item.usuario;
      const ventas = ventasPorVendedor.get(item.id_usuario) || { count: 0, total: 0 };
      const rolCodigo = (u?.rol as any)?.codigo || "counter_boleteria";
      const rolNombre = (u?.rol as any)?.nombre_rol || "Counter";

      return {
        id_usuario: item.id_usuario,
        nombre: u?.nombre || "",
        apellido: u?.apellido || "",
        correo: u?.correo || "",
        dni: u?.dni || "",
        telefono: u?.telefono || "",
        id_rol: u?.id_rol || "",
        rol_codigo: rolCodigo,
        rol_nombre: rolNombre,
        activo: item.activo && u?.activo !== false,
        asignado_en: item.asignado_en || new Date().toISOString(),
        total_ordenes_mes: ventas.count,
        total_recaudado_mes: Number(ventas.total.toFixed(2)),
        nota: u?.nota || "",
        fecha_ingreso: u?.fecha_registro || item.asignado_en || new Date().toISOString(),
        creado_por: u?.id_usuario_creador || undefined,
      };
    });
  }

  /**
   * 22. Da de alta un nuevo colaborador de counter en la sede.
   */
  static async crearPersonalSede(
    idSede: number,
    datos: NuevoPersonalPayload
  ): Promise<{ exito: boolean; mensaje: string }> {
    // 1. Obtener id_rol para el rol_codigo
    const { data: rolData } = await supabase
      .from("rol")
      .select("id_rol")
      .eq("codigo", datos.rol_codigo)
      .single();

    if (!rolData) {
      return { exito: false, mensaje: "El rol seleccionado no es válido." };
    }

    // 2. Verificar si el correo ya existe
    const { data: usuarioExistente } = await supabase
      .from("usuario")
      .select("id_usuario")
      .eq("correo", datos.correo.trim().toLowerCase())
      .maybeSingle();

    if (usuarioExistente) {
      return { exito: false, mensaje: "Ya existe un usuario con este correo electrónico." };
    }

    // 3. Crear usuario en la tabla 'usuario'
    const nuevoIdUsuario = crypto.randomUUID();
    const { error: errUsuario } = await supabase
      .from("usuario")
      .insert({
        id_usuario: nuevoIdUsuario,
        id_rol: rolData.id_rol,
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        correo: datos.correo.trim().toLowerCase(),
        dni: datos.dni.trim(),
        telefono: datos.telefono.trim(),
        activo: true,
        id_usuario_creador: datos.id_usuario_creador || null,
      });

    if (errUsuario) {
      return { exito: false, mensaje: `Error al crear el perfil de usuario: ${errUsuario.message}` };
    }

    // 4. Asignar a la sede en personal_sede
    const { error: errPersonal } = await supabase
      .from("personal_sede")
      .insert({
        id_usuario: nuevoIdUsuario,
        id_sede: idSede,
        activo: true,
      });

    if (errPersonal) {
      return { exito: false, mensaje: `Error al asignar a la sede: ${errPersonal.message}` };
    }

    return { exito: true, mensaje: "Colaborador registrado exitosamente en la sede." };
  }

  /**
   * 23. Activa o desactiva la cuenta de un colaborador de la sede.
   */
  static async alternarEstadoPersonal(idUsuario: string, activo: boolean): Promise<boolean> {
    const { error: err1 } = await supabase
      .from("personal_sede")
      .update({ activo })
      .eq("id_usuario", idUsuario);

    const { error: err2 } = await supabase
      .from("usuario")
      .update({ activo })
      .eq("id_usuario", idUsuario);

    return !err1 && !err2;
  }

  /**
   * 24. Obtiene todos los formatos de proyección del sistema.
   */
  static async obtenerFormatosGlobales(): Promise<{ id_formato: string; codigo: string; nombre: string }[]> {
    const { data, error } = await supabase
      .from("formato_proyeccion")
      .select("id_formato, codigo, nombre")
      .order("nombre");

    if (error || !data) return [];
    return data;
  }

  /**
   * 25. Actualiza los formatos admitidos para una sala.
   */
  static async actualizarFormatosSala(idSala: string, formatosIds: string[]): Promise<boolean> {
    await supabase.from("sala_formato").delete().eq("id_sala", idSala);
    if (formatosIds.length === 0) return true;

    const inserts = formatosIds.map((id_formato) => ({ id_sala: idSala, id_formato }));
    const { error } = await supabase.from("sala_formato").insert(inserts);
    return !error;
  }

  /**
   * 26. Guarda la cuadrícula de dimensiones, pasillos y estado de butacas de una sala.
   */
  static async guardarEstructuraYAsientosSala(
    idSala: string,
    filas: number,
    columnas: number,
    pasillos: number[],
    asientos: { fila: string; columna: number; tipo_asiento: string; en_mantenimiento: boolean }[]
  ): Promise<{ exito: boolean; mensaje: string }> {
    const capacidad = asientos.filter((a) => !pasillos.includes(a.columna)).length || filas * columnas;

    // 1. Actualizar sala
    const { error: errSala } = await supabase
      .from("sala")
      .update({
        filas,
        columnas,
        capacidad_total: capacidad,
        pasillos,
        actualizado_en: new Date().toISOString(),
      } as any)
      .eq("id_sala", idSala);

    if (errSala) {
      return { exito: false, mensaje: `Error al actualizar la sala: ${errSala.message}` };
    }

    // 2. Sincronizar asientos de la sala
    await supabase.from("asiento").delete().eq("id_sala", idSala);

    if (asientos.length > 0) {
      const rowsToInsert = asientos.map((a) => ({
        id_asiento: crypto.randomUUID(),
        id_sala: idSala,
        fila: a.fila,
        columna: a.columna,
        tipo_asiento: a.tipo_asiento.toLowerCase() === "accesible" ? "accesible" : "estandar",
        en_mantenimiento: a.en_mantenimiento,
      }));

      const batchSize = 100;
      for (let i = 0; i < rowsToInsert.length; i += batchSize) {
        const batch = rowsToInsert.slice(i, i + batchSize);
        const { error: errAsientos } = await supabase.from("asiento").insert(batch);
        if (errAsientos) {
          console.error("Error al insertar asientos:", errAsientos);
        }
      }
    }

    return { exito: true, mensaje: "Estructura y distribución de butacas guardadas exitosamente." };
  }

  /**
   * 27. Obtiene el historial de ventas recientes de un colaborador en counter.
   */
  static async obtenerHistorialVentasPersonal(idUsuario: string): Promise<VentaPersonalDTO[]> {
    const { data, error } = await supabase
      .from("orden")
      .select("id_orden, codigo_orden, total, estado, creado_en, canal, detalle_entrada(id_detalle_entrada)")
      .eq("id_vendedor", idUsuario)
      .order("creado_en", { ascending: false })
      .limit(15);

    if (error || !data) {
      return [];
    }

    return data.map((o: any) => ({
      id_orden: o.id_orden,
      codigo_orden: o.codigo_orden || o.id_orden.substring(0, 8).toUpperCase(),
      total: Number(o.total || 0),
      creado_en: o.creado_en,
      estado: o.estado,
      canal: o.canal || "Counter POS",
      total_items: (o.detalle_entrada || []).length || 1,
    }));
  }

  /**
   * 28. Actualiza los datos de perfil de un colaborador de la sede.
   */
  static async actualizarDatosPersonal(
    payload: EditarPersonalPayload
  ): Promise<{ exito: boolean; mensaje: string }> {
    // 1. Obtener id_rol
    const { data: rolData, error: errRol } = await supabase
      .from("rol")
      .select("id_rol")
      .eq("codigo", payload.rol_codigo)
      .maybeSingle();

    if (errRol || !rolData) {
      return { exito: false, mensaje: "Rol no encontrado en el sistema." };
    }

    // 2. Actualizar usuario
    const updateData: any = {
      nombre: payload.nombre.trim(),
      apellido: payload.apellido.trim(),
      correo: payload.correo.trim().toLowerCase(),
      dni: payload.dni.trim(),
      telefono: payload.telefono.trim(),
      nota: payload.nota ? payload.nota.trim() : null,
      id_rol: rolData.id_rol,
    };

    const { error: errUser } = await supabase
      .from("usuario")
      .update(updateData)
      .eq("id_usuario", payload.id_usuario);

    if (errUser) {
      return { exito: false, mensaje: `Error al actualizar perfil: ${errUser.message}` };
    }

    return { exito: true, mensaje: "Datos del colaborador actualizados exitosamente." };
  }
}
