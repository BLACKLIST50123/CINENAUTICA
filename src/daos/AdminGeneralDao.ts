// DAO para Administrador General (admin_general)
// Consultas y operaciones a Supabase para los paneles del Super Admin

import { supabase } from "@/src/lib/supabase/cliente";
import type {
  SedeResumenDTO,
  NuevaSedePayload,
  EditarSedePayload,
  DashboardGeneralDTO,
  FiltrosDashboardGeneral,
  KpisGeneralesDTO,
  IngresosDiarioItemDTO,
  TopPeliculaGeneralDTO,
  RendimientoSedeItemDTO,
  PeliculaGlobalDTO,
  CrearPeliculaPayload,
  EditarPeliculaPayload,
  ProductoGlobalDTO,
  CrearProductoGlobalPayload,
  EditarProductoGlobalPayload,
  CategoriaProductoDTO,
  TarifaGlobalDTO,
  EditarTarifaGlobalPayload,
  FormatoProyeccionGlobalDTO,
  TipoEntradaGlobalDTO,
  CuponGlobalDTO,
  CrearCuponGlobalPayload,
  EditarCuponGlobalPayload,
  RegionDTO,
  CiudadDTO,
} from "@/src/dtos/adminGeneral";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getFechaLocalHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getRangoFechas(filtros: FiltrosDashboardGeneral): { inicio: Date; fin: Date; duracionMs: number } {
  const ahora = new Date();
  if (filtros.periodo === "personalizado" && filtros.fecha_inicio && filtros.fecha_fin) {
    const [yI, mI, dI] = filtros.fecha_inicio.split("-").map(Number);
    const [yF, mF, dF] = filtros.fecha_fin.split("-").map(Number);
    const inicio = new Date(yI, mI - 1, dI, 0, 0, 0, 0);
    const fin = new Date(yF, mF - 1, dF, 23, 59, 59, 999);
    const duracionMs = Math.max(fin.getTime() - inicio.getTime(), 24 * 60 * 60 * 1000);
    return { inicio, fin, duracionMs };
  }

  const fin = ahora;
  let inicio: Date;
  switch (filtros.periodo) {
    case "hoy":
      inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
      break;
    case "7d":
      inicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      inicio = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "anio":
      inicio = new Date(ahora.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    default:
      inicio = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }
  const duracionMs = Math.max(fin.getTime() - inicio.getTime(), 24 * 60 * 60 * 1000);
  return { inicio, fin, duracionMs };
}

function calcularDeltaReal(actual: number, anterior: number): number {
  if (anterior <= 0) {
    return actual > 0 ? 100 : 0;
  }
  return Math.round(((actual - anterior) / anterior) * 1000) / 10;
}

const DIAS_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function mapearTipoLanzamientoDb(t?: string): "Regular" | "Estreno" | "Pre_Estreno" | "Re_Estreno" {
  if (t === "Estreno") return "Estreno";
  if (t === "Preventa") return "Pre_Estreno";
  if (t === "Re_Estreno") return "Re_Estreno";
  return "Regular";
}

export class AdminGeneralDao {
  // ───────────────────────────────────────────────
  // 1. Datos de geografía (regiones y ciudades)
  // ───────────────────────────────────────────────

  static async obtenerRegiones(): Promise<RegionDTO[]> {
    const { data, error } = await supabase
      .from("region")
      .select("id_region, nombre")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener regiones:", error);
      return [];
    }
    return (data || []).map((r: any) => ({
      id_region: r.id_region,
      nombre: r.nombre,
    }));
  }

  static async obtenerCiudades(): Promise<CiudadDTO[]> {
    const { data, error } = await supabase
      .from("ciudad")
      .select("id_ciudad, nombre, id_region, region:id_region ( nombre )")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener ciudades:", error);
      return [];
    }
    return (data || []).map((c: any) => ({
      id_ciudad: c.id_ciudad,
      nombre: c.nombre,
      id_region: c.id_region,
      region_nombre: c.region?.nombre || "",
    }));
  }

  // ───────────────────────────────────────────────
  // 2. Lista de sedes con KPIs resumidos
  // ───────────────────────────────────────────────

  static async obtenerTodasSedes(filtros?: {
    id_region?: number;
    id_ciudad?: number;
  }): Promise<SedeResumenDTO[]> {
    let query = supabase
      .from("sede")
      .select(`
        id_sede,
        codigo,
        nombre,
        direccion,
        telefono,
        cant_salas,
        latitud,
        longitud,
        url_imagen,
        serie_boleta,
        serie_factura,
        activa,
        id_ciudad,
        ciudad:id_ciudad (
          id_ciudad,
          nombre,
          id_region,
          region:id_region ( nombre )
        )
      `)
      .order("nombre", { ascending: true });

    if (filtros?.id_ciudad) {
      query = query.eq("id_ciudad", filtros.id_ciudad);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener sedes:", error);
      return [];
    }

    const hoy = getFechaLocalHoy();
    // Inicio del mes actual
    const d = new Date();
    const inicioMes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

    const sedes = data || [];
    const resultados: SedeResumenDTO[] = [];

    for (const sede of sedes) {
      const ciudad = (sede as any).ciudad;

      // Filtro por región si aplica
      if (filtros?.id_region && ciudad?.id_region !== filtros.id_region) continue;

      // Funciones de hoy
      const { count: funcionesHoy } = await supabase
        .from("funcion")
        .select("id_funcion", { count: "exact", head: true })
        .eq("id_sede", (sede as any).id_sede)
        .eq("fecha", hoy)
        .neq("estado", "Cancelada");

      // Órdenes del mes para ingresos y entradas
      const { data: ordenesMes } = await supabase
        .from("orden")
        .select("total, subtotal_entradas, detalle_entrada ( id_detalle_entrada, estado )")
        .eq("id_sede", (sede as any).id_sede)
        .gte("fecha_creacion", `${inicioMes}T00:00:00.000Z`)
        .neq("estado", "Cancelada");

      let ingresosMes = 0;
      let entradasMes = 0;
      (ordenesMes || []).forEach((ord: any) => {
        ingresosMes += Number(ord.total || 0);
        entradasMes += (ord.detalle_entrada || []).filter(
          (de: any) => de.estado === "Vigente" || !de.estado
        ).length;
      });

      resultados.push({
        id_sede: (sede as any).id_sede,
        codigo: (sede as any).codigo || undefined,
        nombre: (sede as any).nombre,
        id_ciudad: (sede as any).id_ciudad || ciudad?.id_ciudad,
        ciudad: ciudad?.nombre || "—",
        region: ciudad?.region?.nombre || "—",
        direccion: (sede as any).direccion || "",
        telefono: (sede as any).telefono || "",
        latitud: (sede as any).latitud != null ? Number((sede as any).latitud) : null,
        longitud: (sede as any).longitud != null ? Number((sede as any).longitud) : null,
        url_imagen: (sede as any).url_imagen || "",
        serie_boleta: (sede as any).serie_boleta || "",
        serie_factura: (sede as any).serie_factura || "",
        cant_salas: (sede as any).cant_salas || 0,
        activa: (sede as any).activa ?? true,
        funciones_hoy: funcionesHoy || 0,
        ocupacion_hoy_pct: 0, // Se calcula de forma lazy en la vista si se necesita
        ingresos_mes: Math.round(ingresosMes),
        entradas_mes: entradasMes,
      });
    }

    return resultados;
  }

  static async crearSede(payload: NuevaSedePayload): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.from("sede").insert({
      nombre: payload.nombre,
      codigo: payload.codigo || payload.nombre.slice(0, 4).toUpperCase().replace(/\s+/g, ""),
      id_ciudad: payload.id_ciudad,
      direccion: payload.direccion,
      cant_salas: payload.cant_salas || 4,
      latitud: payload.latitud ?? null,
      longitud: payload.longitud ?? null,
      telefono: payload.telefono || null,
      url_imagen: payload.url_imagen || null,
      serie_boleta: payload.serie_boleta || null,
      serie_factura: payload.serie_factura || null,
      zona_horaria: "America/Lima",
      activa: true,
    });

    if (error) {
      console.error("Error al crear sede:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async editarSede(payload: EditarSedePayload): Promise<{ ok: boolean; error?: string }> {
    const updateData: Record<string, any> = {
      nombre: payload.nombre,
      id_ciudad: payload.id_ciudad,
      direccion: payload.direccion,
      activa: payload.activa,
    };

    if (payload.codigo !== undefined) updateData.codigo = payload.codigo;
    if (payload.cant_salas !== undefined) updateData.cant_salas = payload.cant_salas;
    if (payload.latitud !== undefined) updateData.latitud = payload.latitud;
    if (payload.longitud !== undefined) updateData.longitud = payload.longitud;
    if (payload.telefono !== undefined) updateData.telefono = payload.telefono || null;
    if (payload.url_imagen !== undefined) updateData.url_imagen = payload.url_imagen || null;
    if (payload.serie_boleta !== undefined) updateData.serie_boleta = payload.serie_boleta || null;
    if (payload.serie_factura !== undefined) updateData.serie_factura = payload.serie_factura || null;

    const { error } = await supabase
      .from("sede")
      .update(updateData as any)
      .eq("id_sede", payload.id_sede);

    if (error) {
      console.error("Error al editar sede:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  // ───────────────────────────────────────────────
  // 3. Dashboard General (KPIs multi-sede)
  // ───────────────────────────────────────────────

  static async obtenerDashboardGeneral(
    filtros: FiltrosDashboardGeneral
  ): Promise<DashboardGeneralDTO> {
    const { inicio, fin, duracionMs } = getRangoFechas(filtros);
    const isoInicio = inicio.toISOString();
    const isoFin = fin.toISOString();
    const inicioStr = inicio.toISOString().split("T")[0];
    const finStr = fin.toISOString().split("T")[0];

    // ── Construir filtros de sedes ──
    let sedeIds: number[] | null = null;

    if (filtros.id_sede) {
      sedeIds = [filtros.id_sede];
    } else if (filtros.id_ciudad) {
      const { data: sedesData } = await supabase
        .from("sede")
        .select("id_sede")
        .eq("id_ciudad", filtros.id_ciudad);
      sedeIds = (sedesData || []).map((s: any) => s.id_sede);
    } else if (filtros.id_region) {
      const { data: ciudadesData } = await supabase
        .from("ciudad")
        .select("id_ciudad")
        .eq("id_region", filtros.id_region);
      const ciudadIds = (ciudadesData || []).map((c: any) => c.id_ciudad);
      const { data: sedesData } = await supabase
        .from("sede")
        .select("id_sede")
        .in("id_ciudad", ciudadIds);
      sedeIds = (sedesData || []).map((s: any) => s.id_sede);
    }

    // ── 1. Órdenes del período actual ──
    let ordenesQuery = supabase
      .from("orden")
      .select(`
        id_orden,
        id_sede,
        fecha_creacion,
        total,
        subtotal_entradas,
        subtotal_productos,
        estado,
        detalle_entrada ( id_detalle_entrada, estado )
      `)
      .gte("fecha_creacion", isoInicio)
      .lte("fecha_creacion", isoFin)
      .neq("estado", "Cancelada")
      .order("fecha_creacion", { ascending: true });

    if (sedeIds && sedeIds.length > 0) {
      ordenesQuery = ordenesQuery.in("id_sede", sedeIds);
    }

    const { data: ordenes } = await ordenesQuery;
    const ordenesList = ordenes || [];

    // Calcular KPIs del período actual
    let ingresosNetos = 0;
    let entradasVendidas = 0;
    let ingresosDulceria = 0;
    let ordenesConDulceria = 0;
    const ingresosPorDia = new Map<string, number>();

    ordenesList.forEach((ord: any) => {
      ingresosNetos += Number(ord.total || 0);
      const subDulc = Number(ord.subtotal_productos || 0);
      ingresosDulceria += subDulc;
      if (subDulc > 0) ordenesConDulceria++;

      entradasVendidas += (ord.detalle_entrada || []).filter(
        (de: any) => de.estado === "Vigente" || !de.estado
      ).length;

      const fechaOrd = ord.fecha_creacion?.split("T")[0] || "";
      if (fechaOrd) {
        ingresosPorDia.set(fechaOrd, (ingresosPorDia.get(fechaOrd) || 0) + Number(ord.total || 0));
      }
    });

    // Reembolsos del período actual
    let reembolsosQuery = supabase
      .from("orden")
      .select("id_orden", { count: "exact", head: true })
      .gte("fecha_creacion", isoInicio)
      .lte("fecha_creacion", isoFin)
      .eq("estado", "Reembolsada");

    if (sedeIds && sedeIds.length > 0) {
      reembolsosQuery = reembolsosQuery.in("id_sede", sedeIds);
    }
    const { count: reembolsosCount } = await reembolsosQuery;
    const reembolsos = reembolsosCount || 0;

    const ticketPromedio = ordenesList.length > 0 ? ingresosNetos / ordenesList.length : 0;
    const attachDulceriaPct =
      ordenesList.length > 0 ? Math.round((ordenesConDulceria / ordenesList.length) * 100) : 0;

    // Socios nuevos en el período actual
    const { count: sociosNuevos } = await supabase
      .from("socio")
      .select("id_usuario, usuario!inner(fecha_registro)", { count: "exact", head: true })
      .gte("usuario.fecha_registro", isoInicio)
      .lte("usuario.fecha_registro", isoFin);

    // ── 2. Período anterior equivalente para calcular Deltas Reales ──
    const prevInicio = new Date(inicio.getTime() - duracionMs);
    const prevFin = new Date(inicio.getTime());
    const isoPrevInicio = prevInicio.toISOString();
    const isoPrevFin = prevFin.toISOString();

    let prevOrdenesQuery = supabase
      .from("orden")
      .select(`
        id_orden,
        total,
        subtotal_productos,
        estado,
        detalle_entrada ( id_detalle_entrada, estado )
      `)
      .gte("fecha_creacion", isoPrevInicio)
      .lt("fecha_creacion", isoPrevFin)
      .neq("estado", "Cancelada");

    if (sedeIds && sedeIds.length > 0) {
      prevOrdenesQuery = prevOrdenesQuery.in("id_sede", sedeIds);
    }

    const { data: prevOrdenes } = await prevOrdenesQuery;
    const prevOrdenesList = prevOrdenes || [];

    let prevIngresosNetos = 0;
    let prevEntradasVendidas = 0;
    let prevIngresosDulceria = 0;
    let prevOrdenesConDulceria = 0;

    prevOrdenesList.forEach((ord: any) => {
      prevIngresosNetos += Number(ord.total || 0);
      const subDulc = Number(ord.subtotal_productos || 0);
      prevIngresosDulceria += subDulc;
      if (subDulc > 0) prevOrdenesConDulceria++;
      prevEntradasVendidas += (ord.detalle_entrada || []).filter(
        (de: any) => de.estado === "Vigente" || !de.estado
      ).length;
    });

    const prevTicketPromedio = prevOrdenesList.length > 0 ? prevIngresosNetos / prevOrdenesList.length : 0;
    const prevAttachDulceria =
      prevOrdenesList.length > 0 ? Math.round((prevOrdenesConDulceria / prevOrdenesList.length) * 100) : 0;

    let prevReembolsosQuery = supabase
      .from("orden")
      .select("id_orden", { count: "exact", head: true })
      .gte("fecha_creacion", isoPrevInicio)
      .lt("fecha_creacion", isoPrevFin)
      .eq("estado", "Reembolsada");

    if (sedeIds && sedeIds.length > 0) {
      prevReembolsosQuery = prevReembolsosQuery.in("id_sede", sedeIds);
    }
    const { count: prevReembolsosCount } = await prevReembolsosQuery;
    const prevReembolsos = prevReembolsosCount || 0;

    const { count: prevSociosCount } = await supabase
      .from("socio")
      .select("id_usuario, usuario!inner(fecha_registro)", { count: "exact", head: true })
      .gte("usuario.fecha_registro", isoPrevInicio)
      .lt("usuario.fecha_registro", isoPrevFin);
    const prevSociosNuevos = prevSociosCount || 0;

    // ── 3. Ingresos Diarios (últimos 7 días con totales reales) ──
    const hoyStr = getFechaLocalHoy();
    const ingresosDiarios: IngresosDiarioItemDTO[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      ingresosDiarios.push({
        fecha: fechaStr,
        dia_nombre: DIAS_CORTO[d.getDay()],
        total: ingresosPorDia.get(fechaStr) || 0,
        es_hoy: fechaStr === hoyStr,
      });
    }

    // ── 4. Funciones y Top Películas con recaudación y cuota de taquilla ──
    let funcionesQuery = supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_sede,
        id_pelicula,
        fecha,
        hora_inicio,
        pelicula (
          id_pelicula,
          titulo,
          url_poster,
          duracion_min,
          clasificacion,
          genero_pelicula (
            genero ( nombre )
          )
        ),
        asiento_funcion (
          estado,
          detalle_entrada ( precio_unitario, estado )
        )
      `)
      .gte("fecha", inicioStr)
      .lte("fecha", finStr)
      .neq("estado", "Cancelada");

    if (sedeIds && sedeIds.length > 0) {
      funcionesQuery = funcionesQuery.in("id_sede", sedeIds);
    }

    const { data: funcionesData } = await funcionesQuery;
    const peliMap = new Map<string, TopPeliculaGeneralDTO & { sedesSet: Set<number> }>();

    (funcionesData || []).forEach((fn: any) => {
      const p = fn.pelicula;
      if (!p) return;
      const generos = (p.genero_pelicula || [])
        .map((gp: any) => gp.genero?.nombre)
        .filter(Boolean);

      const existing = peliMap.get(p.id_pelicula) || {
        id_pelicula: p.id_pelicula,
        titulo: p.titulo,
        url_poster: p.url_poster,
        entradas_vendidas: 0,
        recaudacion: 0,
        ticket_promedio: 0,
        share_taquilla_pct: 0,
        duracion_min: p.duracion_min || 115,
        clasificacion: p.clasificacion || "APT",
        generos,
        sedesSet: new Set<number>(),
      };
      if (fn.id_sede) existing.sedesSet.add(fn.id_sede);
      (fn.asiento_funcion || []).forEach((af: any) => {
        const est = (af.estado || "").toLowerCase();
        if (est === "ocupado" || est === "vendido") {
          existing.entradas_vendidas++;

          // detalle_entrada es retornado por PostgREST como un array de 1 a N
          const des = Array.isArray(af.detalle_entrada)
            ? af.detalle_entrada
            : af.detalle_entrada
            ? [af.detalle_entrada]
            : [];

          let precioEncontrado = 0;
          for (const de of des) {
            if (de && (de.estado === "Vigente" || !de.estado)) {
              const pu = Number(de.precio_unitario || 0);
              if (pu > 0) precioEncontrado += pu;
            }
          }

          if (precioEncontrado > 0) {
            existing.recaudacion += precioEncontrado;
          } else {
            // Fallback con tarifa estándar si el asiento ocupado no tiene detalle de orden asociado
            existing.recaudacion += 15.0;
          }
        }
      });
      peliMap.set(p.id_pelicula, existing);
    });

    const totalTaquillaPeriodo = Array.from(peliMap.values()).reduce((sum, p) => sum + p.recaudacion, 0);

    const topPeliculas: TopPeliculaGeneralDTO[] = Array.from(peliMap.values())
      .map(({ sedesSet, ...rest }) => ({
        ...rest,
        sedes_count: sedesSet.size,
        ticket_promedio:
          rest.entradas_vendidas > 0 ? Math.round((rest.recaudacion / rest.entradas_vendidas) * 100) / 100 : 0,
        share_taquilla_pct:
          totalTaquillaPeriodo > 0 ? Math.round((rest.recaudacion / totalTaquillaPeriodo) * 100) : 0,
      }))
      .sort((a, b) => b.entradas_vendidas - a.entradas_vendidas || b.recaudacion - a.recaudacion)
      .slice(0, 8);

    // ── 5. Rendimiento y Ranking por Sede con Share de Ingresos ──
    let sedesListQuery = supabase
      .from("sede")
      .select("id_sede, nombre, ciudad:id_ciudad ( nombre )")
      .eq("activa", true)
      .order("nombre", { ascending: true });

    if (sedeIds && sedeIds.length > 0) {
      sedesListQuery = sedesListQuery.in("id_sede", sedeIds);
    }

    const { data: sedesList } = await sedesListQuery;
    const rendimientoSedes: RendimientoSedeItemDTO[] = [];

    for (const sede of sedesList || []) {
      const idS = (sede as any).id_sede;
      const ordenesS = ordenesList.filter((o: any) => o.id_sede === idS);
      let ingS = 0;
      let entS = 0;
      ordenesS.forEach((o: any) => {
        ingS += Number(o.total || 0);
        entS += (o.detalle_entrada || []).filter(
          (de: any) => de.estado === "Vigente" || !de.estado
        ).length;
      });

      const funcionesSede = (funcionesData || []).filter((fn: any) => fn.id_sede === idS);
      let totalAsientosSede = 0;
      let ocupadosSede = 0;
      funcionesSede.forEach((fn: any) => {
        (fn.asiento_funcion || []).forEach((af: any) => {
          totalAsientosSede++;
          const est = (af.estado || "").toLowerCase();
          if (est === "ocupado" || est === "vendido") ocupadosSede++;
        });
      });

      const ocupacionPct = totalAsientosSede > 0 ? Math.round((ocupadosSede / totalAsientosSede) * 100) : 0;

      rendimientoSedes.push({
        id_sede: idS,
        nombre: (sede as any).nombre,
        ciudad: (sede as any).ciudad?.nombre || "—",
        ingresos: Math.round(ingS),
        entradas: entS,
        ocupacion_pct: ocupacionPct,
        share_ingresos_pct: 0,
      });
    }

    // Calcular share_ingresos_pct según el total facturado en la red
    const totalIngresosRed = rendimientoSedes.reduce((acc, s) => acc + s.ingresos, 0);
    rendimientoSedes.forEach((s) => {
      s.share_ingresos_pct = totalIngresosRed > 0 ? Math.round((s.ingresos / totalIngresosRed) * 100) : 0;
    });

    const ocupacionPromedio =
      rendimientoSedes.length > 0
        ? Math.round(rendimientoSedes.reduce((acc, s) => acc + s.ocupacion_pct, 0) / rendimientoSedes.length)
        : 0;

    const kpis: KpisGeneralesDTO = {
      ingresos_netos: Math.round(ingresosNetos),
      entradas_vendidas: entradasVendidas,
      ingresos_dulceria: Math.round(ingresosDulceria),
      ticket_promedio: Math.round(ticketPromedio * 100) / 100,
      ocupacion_promedio_pct: ocupacionPromedio,
      socios_nuevos: sociosNuevos || 0,
      attach_dulceria_pct: attachDulceriaPct,
      reembolsos,
      delta_ingresos_pct: calcularDeltaReal(ingresosNetos, prevIngresosNetos),
      delta_entradas_pct: calcularDeltaReal(entradasVendidas, prevEntradasVendidas),
      delta_dulceria_pct: calcularDeltaReal(ingresosDulceria, prevIngresosDulceria),
      delta_ticket_pct: calcularDeltaReal(ticketPromedio, prevTicketPromedio),
      delta_socios_pct: calcularDeltaReal(sociosNuevos || 0, prevSociosNuevos),
      delta_attach_pct: calcularDeltaReal(attachDulceriaPct, prevAttachDulceria),
      delta_reembolsos_pct: calcularDeltaReal(reembolsos, prevReembolsos),
    };

    return {
      kpis,
      ingresos_diarios: ingresosDiarios,
      top_peliculas: topPeliculas,
      rendimiento_sedes: rendimientoSedes,
    };
  }


  // ───────────────────────────────────────────────
  // 4. Películas — Catálogo Global
  // ───────────────────────────────────────────────

  static async obtenerPeliculasCatalogo(): Promise<PeliculaGlobalDTO[]> {
    const { data, error } = await supabase
      .from("pelicula")
      .select(`
        id_pelicula,
        titulo,
        sinopsis,
        duracion_min,
        clasificacion,
        url_poster,
        url_banner,
        trailer_url,
        tipo_lanzamiento,
        fecha_estreno,
        genero_pelicula (
          genero ( nombre )
        ),
        pelicula_formato ( id_formato ),
        pelicula_sede ( id_sede, habilitada, destacada_banner, orden_banner )
      `)
      .is("eliminado_en", null)
      .order("titulo", { ascending: true });

    if (error) {
      console.error("Error al obtener catálogo de películas:", error);
      return [];
    }

    return (data || []).map((item: any) => {
      const generos = (item.genero_pelicula || [])
        .map((gp: any) => gp.genero?.nombre)
        .filter(Boolean);
      const formatos = (item.pelicula_formato || [])
        .map((pf: any) => pf.id_formato)
        .filter(Boolean);
      const sedesActivas = (item.pelicula_sede || []).filter((ps: any) => ps.habilitada).length;
      const banner = (item.pelicula_sede || []).find((ps: any) => ps.destacada_banner);

      return {
        id_pelicula: item.id_pelicula,
        titulo: item.titulo,
        sinopsis: item.sinopsis,
        duracion_min: item.duracion_min,
        clasificacion: item.clasificacion,
        url_poster: item.url_poster,
        url_banner: item.url_banner,
        trailer_url: item.trailer_url || "",
        formatos,
        tipo_lanzamiento: item.tipo_lanzamiento,
        generos,
        destacada_banner: !!banner,
        orden_banner: banner?.orden_banner ?? null,
        activa: true,
        fecha_estreno: item.fecha_estreno ?? null,
        sedes_activas: sedesActivas,
      };
    });
  }

  static async crearPelicula(
    payload: CrearPeliculaPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const { generos, formatos, ...rest } = payload;

    const { data: peli, error } = await supabase
      .from("pelicula")
      .insert({
        titulo: rest.titulo,
        sinopsis: rest.sinopsis,
        duracion_min: rest.duracion_min,
        clasificacion: rest.clasificacion,
        url_poster: rest.url_poster,
        url_banner: rest.url_banner,
        trailer_url: rest.trailer_url || "",
        tipo_lanzamiento: mapearTipoLanzamientoDb(rest.tipo_lanzamiento),
        fecha_estreno: rest.fecha_estreno || null,
        estado_cartelera: "Proximo_Estreno",
      })
      .select("id_pelicula")
      .single();

    if (error || !peli) {
      console.error("Error al crear película:", error);
      return { ok: false, error: error?.message };
    }

    // Insertar formatos de proyección
    if (formatos && formatos.length > 0) {
      await supabase.from("pelicula_formato").insert(
        formatos.map((id_formato) => ({
          id_pelicula: peli.id_pelicula,
          id_formato,
        }))
      );
    }

    // Insertar géneros
    if (generos.length > 0) {
      const { data: generosData } = await supabase
        .from("genero")
        .select("id_genero, nombre")
        .in("nombre", generos);

      if (generosData && generosData.length > 0) {
        await supabase.from("genero_pelicula").insert(
          generosData.map((g: any) => ({
            id_pelicula: peli.id_pelicula,
            id_genero: g.id_genero,
          }))
        );
      }
    }

    return { ok: true };
  }

  static async editarPelicula(
    payload: EditarPeliculaPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const { id_pelicula, generos, formatos, ...rest } = payload;

    const { error } = await supabase
      .from("pelicula")
      .update({
        titulo: rest.titulo,
        sinopsis: rest.sinopsis,
        duracion_min: rest.duracion_min,
        clasificacion: rest.clasificacion,
        url_poster: rest.url_poster,
        url_banner: rest.url_banner,
        ...(rest.trailer_url !== undefined ? { trailer_url: rest.trailer_url } : {}),
        tipo_lanzamiento: mapearTipoLanzamientoDb(rest.tipo_lanzamiento),
        fecha_estreno: rest.fecha_estreno || null,
      })
      .eq("id_pelicula", id_pelicula);

    if (error) {
      console.error("Error al editar película:", error);
      return { ok: false, error: error.message };
    }

    // Sincronizar formatos de proyección
    if (formatos !== undefined) {
      await supabase.from("pelicula_formato").delete().eq("id_pelicula", id_pelicula);
      if (formatos.length > 0) {
        await supabase.from("pelicula_formato").insert(
          formatos.map((id_formato) => ({
            id_pelicula,
            id_formato,
          }))
        );
      }
    }

    // Reemplazar géneros
    if (generos.length > 0) {
      await supabase.from("genero_pelicula").delete().eq("id_pelicula", id_pelicula);
      const { data: generosData } = await supabase
        .from("genero")
        .select("id_genero, nombre")
        .in("nombre", generos);
      if (generosData && generosData.length > 0) {
        await supabase.from("genero_pelicula").insert(
          generosData.map((g: any) => ({
            id_pelicula,
            id_genero: g.id_genero,
          }))
        );
      }
    }

    return { ok: true };
  }

  static async eliminarPelicula(idPelicula: string): Promise<{ ok: boolean; error?: string }> {
    // Soft-delete: marcar eliminado_en
    const { error } = await supabase
      .from("pelicula")
      .update({ eliminado_en: new Date().toISOString() })
      .eq("id_pelicula", idPelicula);

    if (error) {
      console.error("Error al eliminar película:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  // ───────────────────────────────────────────────
  // 5. Dulcería Global
  // ───────────────────────────────────────────────

  static async obtenerProductosGlobal(): Promise<ProductoGlobalDTO[]> {
    const { data, error } = await supabase
      .from("producto")
      .select(`
        id_producto,
        nombre,
        descripcion,
        precio_base,
        url_imagen,
        id_categoria,
        disponible,
        categoria:id_categoria ( nombre ),
        producto_sede ( id_sede )
      `)
      .is("eliminado_en", null)
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener productos globales:", error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id_producto: item.id_producto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_base: Number(item.precio_base || 0),
      url_imagen: item.url_imagen,
      id_categoria: item.id_categoria,
      categoria_nombre: item.categoria?.nombre || "General",
      activo: item.disponible ?? true,
      sedes_con_precio_local: (item.producto_sede || []).length,
    }));
  }

  static async obtenerCategoriasProducto(): Promise<CategoriaProductoDTO[]> {
    const { data, error } = await supabase
      .from("categoria_producto")
      .select("id_categoria, nombre")
      .order("orden", { ascending: true });

    if (error) {
      console.error("Error al obtener categorías de producto:", error);
      return [];
    }
    return data || [];
  }

  static async crearProductoGlobal(
    payload: CrearProductoGlobalPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.from("producto").insert({
      nombre: payload.nombre.trim(),
      descripcion: payload.descripcion.trim(),
      precio_base: payload.precio_base,
      id_categoria: payload.id_categoria,
      url_imagen: payload.url_imagen || "fa-solid fa-bowl-food",
      disponible: true,
    });

    if (error) {
      console.error("Error al crear producto global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async editarProductoGlobal(
    payload: EditarProductoGlobalPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const updateData: any = {
      precio_base: payload.precio_base,
      disponible: payload.activo,
    };
    if (payload.nombre !== undefined) updateData.nombre = payload.nombre.trim();
    if (payload.descripcion !== undefined) updateData.descripcion = payload.descripcion.trim();
    if (payload.id_categoria !== undefined) updateData.id_categoria = payload.id_categoria;
    if (payload.url_imagen !== undefined) updateData.url_imagen = payload.url_imagen;

    const { error } = await supabase
      .from("producto")
      .update(updateData)
      .eq("id_producto", payload.id_producto);

    if (error) {
      console.error("Error al editar producto global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async eliminarProductoGlobal(
    idProducto: string
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("producto")
      .update({ eliminado_en: new Date().toISOString(), disponible: false })
      .eq("id_producto", idProducto);

    if (error) {
      console.error("Error al eliminar producto global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  // ───────────────────────────────────────────────
  // 6. Tarifas Globales, Formatos y Tipos de Entrada
  // ───────────────────────────────────────────────

  static async obtenerTarifasGlobales(): Promise<TarifaGlobalDTO[]> {
    const { data, error } = await supabase
      .from("tarifa")
      .select("id_tarifa, tipo_tarifa, dia_semana, precio, activo")
      .order("prioridad", { ascending: true });

    if (error) {
      console.error("Error al obtener tarifas globales:", error);
      return [];
    }

    return AdminGeneralDao._mapearTarifas(data || []);
  }

  private static _mapearTarifas(data: any[]): TarifaGlobalDTO[] {
    const DIAS: Record<number, string> = {
      1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves",
      5: "Viernes", 6: "Sábado", 7: "Domingo",
    };
    return data.map((t: any) => ({
      id_tarifa: t.id_tarifa,
      tipo_tarifa: t.tipo_tarifa,
      dia_semana: t.dia_semana ?? null,
      dia_nombre: t.dia_semana ? DIAS[t.dia_semana] : undefined,
      activo: t.activo ?? true,
      precio_general: Number(t.precio || 0),
    }));
  }

  static async editarTarifaGlobal(
    payload: EditarTarifaGlobalPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("tarifa")
      .update({
        precio: payload.precio_general,
        activo: payload.activo,
      })
      .eq("id_tarifa", payload.id_tarifa);

    if (error) {
      console.error("Error al editar tarifa global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async obtenerFormatosProyeccion(): Promise<FormatoProyeccionGlobalDTO[]> {
    const { data, error } = await supabase
      .from("formato_proyeccion")
      .select("id_formato, codigo, nombre, recargo, protegido, activo")
      .order("codigo", { ascending: true });

    if (error) {
      console.error("Error al obtener formatos de proyección:", error);
      return [];
    }
    return (data || []).map((f: any) => ({
      id_formato: f.id_formato,
      codigo: f.codigo,
      nombre: f.nombre,
      recargo: Number(f.recargo || 0),
      protegido: f.protegido ?? false,
      activo: f.activo ?? true,
    }));
  }

  static async editarFormatoProyeccion(
    idFormato: string,
    recargo: number,
    activo: boolean
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("formato_proyeccion")
      .update({ recargo, activo })
      .eq("id_formato", idFormato);

    if (error) {
      console.error("Error al editar formato de proyección:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async obtenerTiposEntrada(): Promise<TipoEntradaGlobalDTO[]> {
    const { data, error } = await supabase
      .from("tipo_entrada")
      .select("id_tipo_entrada, codigo, nombre, descuento_pct, obligatorio_legal, protegido, activo")
      .order("codigo", { ascending: true });

    if (error) {
      console.error("Error al obtener tipos de entrada:", error);
      return [];
    }
    return (data || []).map((te: any) => ({
      id_tipo_entrada: te.id_tipo_entrada,
      codigo: te.codigo,
      nombre: te.nombre,
      descuento_pct: Number(te.descuento_pct || 0),
      obligatorio_legal: te.obligatorio_legal ?? false,
      protegido: te.protegido ?? false,
      activo: te.activo ?? true,
    }));
  }

  static async editarTipoEntrada(
    idTipoEntrada: string,
    descuentoPct: number,
    activo: boolean
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("tipo_entrada")
      .update({ descuento_pct: descuentoPct, activo })
      .eq("id_tipo_entrada", idTipoEntrada);

    if (error) {
      console.error("Error al editar tipo de entrada:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  // ───────────────────────────────────────────────
  // 7. Cupones Globales
  // ───────────────────────────────────────────────

  static async obtenerCuponesGlobales(): Promise<CuponGlobalDTO[]> {
    const { data, error } = await supabase
      .from("cupon")
      .select(`
        id_cupon,
        codigo,
        descripcion,
        valor,
        tipo_descuento,
        fecha_inicio,
        fecha_fin,
        activo,
        usos_maximos,
        usos_actuales,
        cupon_sede ( id_sede, habilitado )
      `)
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error al obtener cupones globales:", error);
      return [];
    }

    return (data || []).map((c: any) => ({
      id_cupon: c.id_cupon,
      codigo: c.codigo,
      descripcion: c.descripcion || "",
      porcentaje_descuento: Number(c.valor || 0),
      fecha_inicio: c.fecha_inicio,
      fecha_fin: c.fecha_fin,
      habilitado: c.activo ?? true,
      usos_totales: Number(c.usos_actuales || 0),
      usos_maximos: c.usos_maximos ?? null,
      sedes_habilitadas: (c.cupon_sede || []).filter((cs: any) => cs.habilitado).length,
    }));
  }

  static async crearCuponGlobal(
    payload: CrearCuponGlobalPayload
  ): Promise<{ ok: boolean; error?: string }> {
    // Verificar unicidad del código
    const { data: existing } = await supabase
      .from("cupon")
      .select("id_cupon")
      .eq("codigo", payload.codigo.toUpperCase().trim())
      .maybeSingle();

    if (existing) {
      return { ok: false, error: `El código "${payload.codigo}" ya existe.` };
    }

    const { error } = await supabase.from("cupon").insert({
      codigo: payload.codigo.toUpperCase().trim(),
      descripcion: payload.descripcion,
      tipo_descuento: "Porcentaje",
      valor: payload.porcentaje_descuento,
      fecha_inicio: payload.fecha_inicio,
      fecha_fin: payload.fecha_fin,
      usos_maximos: payload.usos_maximos || 1000,
      usos_actuales: 0,
      activo: true,
    });

    if (error) {
      console.error("Error al crear cupón global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async editarCuponGlobal(
    payload: EditarCuponGlobalPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("cupon")
      .update({
        descripcion: payload.descripcion,
        valor: payload.porcentaje_descuento,
        fecha_inicio: payload.fecha_inicio,
        fecha_fin: payload.fecha_fin,
        usos_maximos: payload.usos_maximos || 1000,
      })
      .eq("id_cupon", payload.id_cupon);

    if (error) {
      console.error("Error al editar cupón global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async eliminarCuponGlobal(
    idCupon: string
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("cupon")
      .delete()
      .eq("id_cupon", idCupon);

    if (error) {
      console.error("Error al eliminar cupón global:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  static async toggleCupon(
    idCupon: string,
    habilitado: boolean
  ): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
      .from("cupon")
      .update({ activo: habilitado })
      .eq("id_cupon", idCupon);

    if (error) {
      console.error("Error al cambiar estado del cupón:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }
}

