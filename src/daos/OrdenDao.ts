// DAO para Órdenes, Pagos, Comprobantes y Validación de Tickets (Fase 6 y 7)
import { supabase } from "@/src/lib/supabase/cliente";
import { CuponDao } from "@/src/daos/CuponDao";
import type {
  CrearOrdenInputDTO,
  CheckoutResultadoDTO,
  OrdenCompletaDTO,
} from "@/src/dtos/orden";

export class OrdenDao {
  /**
   * Ejecuta el checkout completo.
   * Intenta primero la función RPC procesar_checkout_compra en Supabase.
   * Si la función RPC no está disponible o falla, ejecuta la lógica secuencial por tablas.
   */
  static async procesarCheckout(
    input: CrearOrdenInputDTO
  ): Promise<CheckoutResultadoDTO> {
    // Ejecutar persistencia directa y completa vía PostgREST
    return await this.ejecutarCheckoutDirecto(input);
  }

  /**
   * Flujo directo de persistencia en caso de que la función RPC no esté disponible
   */
  private static async ejecutarCheckoutDirecto(
    input: CrearOrdenInputDTO
  ): Promise<CheckoutResultadoDTO> {
    const idOrden = crypto.randomUUID();
    const codigoOrden = `ORD-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Calcular subtotales
    const subtotalEntradas = (input.entradas || []).reduce(
      (sum, e) => sum + Number(e.precio_unitario || 0),
      0
    );
    const subtotalProductos = (input.productos || []).reduce(
      (sum, p) => sum + Number(p.precio_unitario || 0) * Number(p.cantidad || 0),
      0
    );
    const subtotal = subtotalEntradas + subtotalProductos;

    if (subtotal <= 0) {
      throw new Error("No hay items seleccionados para comprar.");
    }

    // 2. Verificar cupón si se proporcionó
    let idCupon: string | null = null;
    let descuentoCupon = 0;
    if (input.codigo_cupon) {
      const { data: cup } = await supabase
        .from("cupon")
        .select("id_cupon, tipo_descuento, valor")
        .eq("codigo", input.codigo_cupon.toUpperCase())
        .eq("activo", true)
        .maybeSingle();

      if (cup) {
        idCupon = cup.id_cupon;
        if (cup.tipo_descuento === "Porcentaje") {
          descuentoCupon = Number(((subtotal * Number(cup.valor)) / 100).toFixed(2));
        } else {
          descuentoCupon = Math.min(Number(cup.valor), subtotal);
        }
      }
    }

    // 3. Puntos de socio
    let descuentoPuntos = 0;
    let puntosCanjeados = input.puntos_canjeados || 0;
    if (input.id_usuario && puntosCanjeados >= 50) {
      descuentoPuntos = Number((puntosCanjeados * 0.1).toFixed(2));
      const maxDesc = Number(((subtotal - descuentoCupon) * 0.5).toFixed(2));
      if (descuentoPuntos > maxDesc) {
        descuentoPuntos = maxDesc;
        puntosCanjeados = Math.ceil(descuentoPuntos / 0.1);
      }
    }

    const total = Math.max(0, Number((subtotal - descuentoCupon - descuentoPuntos).toFixed(2)));

    // 4. Insertar Orden
    const { error: errOrden } = await supabase.from("orden").insert({
      id_orden: idOrden,
      codigo_orden: codigoOrden,
      id_sede: input.id_sede,
      id_usuario: input.id_usuario || null,
      canal: "Web",
      id_cupon: idCupon,
      correo_contacto: input.correo_contacto,
      nombre_contacto: input.nombre_contacto,
      estado: "Pagada",
      subtotal_entradas: subtotalEntradas,
      subtotal_productos: subtotalProductos,
      descuento_cupon: descuentoCupon,
      puntos_canjeados: puntosCanjeados,
      descuento_puntos: descuentoPuntos,
      total: total,
    });

    if (errOrden) {
      throw new Error(`Error al crear la orden: ${errOrden.message}`);
    }

    // 5. Insertar Detalle Entradas y marcar asientos Ocupados
    if (input.entradas && input.entradas.length > 0) {
      const detallesEntrada = input.entradas.map((e) => ({
        id_detalle_entrada: crypto.randomUUID(),
        id_orden: idOrden,
        id_asiento_funcion: e.id_asiento_funcion,
        id_tipo_entrada: e.id_tipo_entrada,
        estado: "Vigente",
        precio_lista: e.precio_lista,
        descuento: e.descuento,
        precio_unitario: e.precio_unitario,
        codigo_validacion: `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        validada: false,
      }));

      const { error: errEnt } = await supabase.from("detalle_entrada").insert(detallesEntrada);
      if (errEnt) {
        console.error("Error al insertar detalle entradas:", errEnt);
      }

      const asientoIds = input.entradas.map((e) => e.id_asiento_funcion);
      await supabase
        .from("asiento_funcion")
        .update({ estado: "Ocupado" })
        .in("id_asiento_funcion", asientoIds);

      await supabase
        .from("bloqueo_temporal")
        .delete()
        .in("id_asiento_funcion", asientoIds);
    }

    // 6. Insertar Detalle Productos y descontar stock
    if (input.productos && input.productos.length > 0) {
      const detallesProd = input.productos.map((p) => ({
        id_detalle_producto: crypto.randomUUID(),
        id_orden: idOrden,
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
      }));

      await supabase.from("detalle_producto").insert(detallesProd);
    }

    const { error: errPago } = await supabase.from("pago").insert({
      id_pago: crypto.randomUUID(),
      id_orden: idOrden,
      metodo_pago: input.metodo_pago,
      monto: total,
      estado: "Completado",
      fecha_pago: new Date().toISOString(),
      referencia_pasarela: `PASARELA-SIM-${Date.now()}`,
      clave_idempotencia: crypto.randomUUID(),
    });

    if (errPago) {
      console.error("Error al registrar pago:", errPago);
    }

    // 8. Correlativo y Comprobante
    const prefijo = input.tipo_comprobante === "Factura" ? "F" : "B";
    const serie = `${prefijo}${String(input.id_sede).padStart(3, "0")}`;

    // Obtener correlativo
    const { data: corrData } = await supabase
      .from("correlativo_comprobante")
      .select("ultimo")
      .eq("id_sede", input.id_sede)
      .eq("tipo", input.tipo_comprobante)
      .eq("serie", serie)
      .maybeSingle();

    const nuevoCorrelativo = (corrData?.ultimo || 0) + 1;
    await supabase.from("correlativo_comprobante").upsert(
      {
        id_sede: input.id_sede,
        tipo: input.tipo_comprobante,
        serie: serie,
        ultimo: nuevoCorrelativo,
      },
      { onConflict: "id_sede,tipo,serie" }
    );

    const numeroComprobante = `${serie}-${String(nuevoCorrelativo).padStart(8, "0")}`;
    const subtotalSinIgv = Number((total / 1.18).toFixed(2));
    const igv = Number((total - subtotalSinIgv).toFixed(2));

    const { error: errComp } = await supabase.from("comprobante").insert({
      id_comprobante: crypto.randomUUID(),
      id_orden: idOrden,
      id_sede: input.id_sede,
      tipo: input.tipo_comprobante,
      numero_documento_cliente: input.numero_documento,
      nombre_cliente: input.nombre_contacto,
      serie: serie,
      correlativo: nuevoCorrelativo,
      numero_comprobante: numeroComprobante,
      subtotal_sin_igv: subtotalSinIgv,
      igv: igv,
      total: total,
      fecha_emision: new Date().toISOString(),
    });

    if (errComp) {
      console.error("Error al insertar comprobante:", errComp);
    }

    // 9. Puntos ganados si es socio
    let puntosGanados = 0;
    if (input.id_usuario && total > 0) {
      puntosGanados = Math.floor(total);
      const { data: socioData } = await supabase
        .from("socio")
        .select("puntos")
        .eq("id_usuario", input.id_usuario)
        .maybeSingle();

      if (socioData) {
        const saldoFinal = (socioData.puntos || 0) - puntosCanjeados + puntosGanados;
        await supabase
          .from("socio")
          .update({ puntos: Math.max(0, saldoFinal) })
          .eq("id_usuario", input.id_usuario);
      }
    }

    // 10. Limpiar bloqueo de sesión
    if (input.id_sesion) {
      await supabase
        .from("bloqueo_temporal")
        .delete()
        .eq("id_sesion", input.id_sesion);
    }

    // 11. Registrar uso de cupón si aplica
    if (idCupon) {
      await CuponDao.registrarUsoCupon(idCupon, input.id_sede);
    }

    return {
      ok: true,
      id_orden: idOrden,
      codigo_orden: codigoOrden,
      numero_comprobante: numeroComprobante,
      tipo_comprobante: input.tipo_comprobante,
      subtotal: subtotal,
      descuento_cupon: descuentoCupon,
      descuento_puntos: descuentoPuntos,
      total: total,
      puntos_ganados: puntosGanados,
      fecha_creacion: new Date().toISOString(),
    };
  }

  /**
   * Obtiene la información completa de una orden para emitir el ticket
   */
  static async obtenerOrdenCompleta(idOrden: string): Promise<OrdenCompletaDTO | null> {
    const query = supabase
      .from("orden")
      .select(`
        id_orden,
        codigo_orden,
        id_sede,
        canal,
        correo_contacto,
        nombre_contacto,
        fecha_creacion,
        estado,
        subtotal_entradas,
        subtotal_productos,
        descuento_cupon,
        descuento_puntos,
        puntos_canjeados,
        total,
        sede (
          nombre,
          direccion
        ),
        comprobante (
          id_comprobante,
          id_sede,
          tipo,
          numero_documento_cliente,
          nombre_cliente,
          serie,
          correlativo,
          numero_comprobante,
          subtotal_sin_igv,
          igv,
          total,
          fecha_emision
        ),
        detalle_entrada (
          id_detalle_entrada,
          id_asiento_funcion,
          precio_unitario,
          codigo_validacion,
          tipo_entrada ( nombre ),
          asiento_funcion (
            asiento ( fila, columna ),
            funcion (
              fecha,
              hora_inicio,
              id_pelicula,
              formato_proyeccion ( nombre ),
              sala ( nombre_sala )
            )
          )
        ),
        detalle_producto (
          id_detalle_producto,
          id_producto,
          cantidad,
          precio_unitario,
          producto ( nombre )
        )
      `);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrden);
    const { data: ord, error } = await (isUuid
      ? query.eq("id_orden", idOrden)
      : query.eq("codigo_orden", idOrden)
    ).maybeSingle();

    if (error) {
      console.error("Error al obtener orden completa:", error);
      return null;
    }

    if (!ord) {
      return null;
    }

    // Mapear detalle de entradas
    const entradas = (ord.detalle_entrada || []).map((de: any) => {
      const fila = de.asiento_funcion?.asiento?.fila || "";
      const col = de.asiento_funcion?.asiento?.columna || "";
      return {
        id_detalle_entrada: de.id_detalle_entrada,
        id_asiento_funcion: de.id_asiento_funcion,
        codigo_asiento: `${fila}${col}`,
        tipo_entrada: de.tipo_entrada?.nombre || "General",
        precio_unitario: Number(de.precio_unitario),
        codigo_validacion: de.codigo_validacion,
      };
    });

    // Mapear detalle de productos
    const productos = (ord.detalle_producto || []).map((dp: any) => ({
      id_detalle_producto: dp.id_detalle_producto,
      id_producto: dp.id_producto,
      nombre_producto: dp.producto?.nombre || "Producto",
      cantidad: Number(dp.cantidad),
      precio_unitario: Number(dp.precio_unitario),
      subtotal: Number(dp.cantidad) * Number(dp.precio_unitario),
    }));

    // Datos de película si tiene entradas
    let peliculaInfo: any = undefined;
    const primeraEntrada = ord.detalle_entrada?.[0];
    if (primeraEntrada?.asiento_funcion?.funcion) {
      const fn = primeraEntrada.asiento_funcion.funcion;
      let titulo = "Función Cine";
      let posterUrl = "";

      if (fn.id_pelicula) {
        const { data: peliData } = await supabase
          .from("pelicula")
          .select("titulo, url_poster")
          .eq("id_pelicula", fn.id_pelicula)
          .maybeSingle();

        if (peliData) {
          titulo = peliData.titulo || titulo;
          posterUrl = peliData.url_poster || posterUrl;
        }
      }

      peliculaInfo = {
        titulo,
        formato: fn.formato_proyeccion?.nombre || "2D",
        sala: fn.sala?.nombre_sala || "Sala",
        fecha: fn.fecha || "",
        hora: fn.hora_inicio || "",
        poster_url: posterUrl,
      };
    }

    const compData = Array.isArray(ord.comprobante) ? ord.comprobante[0] : ord.comprobante;

    return {
      id_orden: ord.id_orden,
      codigo_orden: ord.codigo_orden,
      id_sede: ord.id_sede,
      nombre_sede: (ord.sede as any)?.nombre || "CineNáutica",
      direccion_sede: (ord.sede as any)?.direccion || "",
      canal: ord.canal,
      correo_contacto: ord.correo_contacto || "",
      nombre_contacto: ord.nombre_contacto || "",
      fecha_creacion: ord.fecha_creacion,
      estado: ord.estado,
      subtotal_entradas: Number(ord.subtotal_entradas),
      subtotal_productos: Number(ord.subtotal_productos),
      descuento_cupon: Number(ord.descuento_cupon),
      descuento_puntos: Number(ord.descuento_puntos),
      puntos_canjeados: Number(ord.puntos_canjeados),
      total: Number(ord.total),
      entradas,
      productos,
      comprobante: compData
        ? {
            id_comprobante: compData.id_comprobante,
            id_sede: compData.id_sede,
            tipo: compData.tipo,
            numero_documento_cliente: compData.numero_documento_cliente,
            nombre_cliente: compData.nombre_cliente,
            serie: compData.serie,
            correlativo: compData.correlativo,
            numero_comprobante: compData.numero_comprobante,
            subtotal_sin_igv: Number(compData.subtotal_sin_igv),
            igv: Number(compData.igv),
            total: Number(compData.total),
            fecha_emision: compData.fecha_emision,
          }
        : undefined,
      pelicula: peliculaInfo,
    };
  }

  /**
   * Obtiene el listado de órdenes históricas de un usuario/socio o por su correo
   */
  static async obtenerOrdenesPorUsuario(
    idUsuario?: string | null,
    correo?: string | null
  ): Promise<OrdenCompletaDTO[]> {
    if (!idUsuario && !correo) {
      return [];
    }

    let query = supabase
      .from("orden")
      .select(`
        id_orden,
        codigo_orden,
        id_sede,
        canal,
        correo_contacto,
        nombre_contacto,
        fecha_creacion,
        estado,
        subtotal_entradas,
        subtotal_productos,
        descuento_cupon,
        descuento_puntos,
        puntos_canjeados,
        total,
        sede (
          nombre,
          direccion
        ),
        comprobante (
          id_comprobante,
          id_sede,
          tipo,
          numero_documento_cliente,
          nombre_cliente,
          serie,
          correlativo,
          numero_comprobante,
          subtotal_sin_igv,
          igv,
          total,
          fecha_emision
        ),
        detalle_entrada (
          id_detalle_entrada,
          id_asiento_funcion,
          precio_unitario,
          codigo_validacion,
          tipo_entrada ( nombre ),
          asiento_funcion (
            asiento ( fila, columna ),
            funcion (
              fecha,
              hora_inicio,
              id_pelicula,
              formato_proyeccion ( nombre ),
              sala ( nombre_sala )
            )
          )
        ),
        detalle_producto (
          id_detalle_producto,
          id_producto,
          cantidad,
          precio_unitario,
          producto ( nombre )
        )
      `)
      .order("fecha_creacion", { ascending: false });

    if (idUsuario && correo) {
      query = query.or(`id_usuario.eq.${idUsuario},correo_contacto.eq.${correo}`);
    } else if (idUsuario) {
      query = query.eq("id_usuario", idUsuario);
    } else if (correo) {
      query = query.eq("correo_contacto", correo);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error("Error al obtener órdenes del usuario:", error);
      return [];
    }

    // Colectar id_pelicula únicos para consultar títulos y pósters
    const peliculaIds = new Set<string>();
    data.forEach((ord: any) => {
      const peliId = ord.detalle_entrada?.[0]?.asiento_funcion?.funcion?.id_pelicula;
      if (peliId) peliculaIds.add(peliId);
    });

    const peliculasMap = new Map<string, { titulo: string; url_poster: string }>();
    if (peliculaIds.size > 0) {
      const { data: pelis } = await supabase
        .from("pelicula")
        .select("id_pelicula, titulo, url_poster")
        .in("id_pelicula", Array.from(peliculaIds));

      (pelis || []).forEach((p: any) => {
        peliculasMap.set(p.id_pelicula, { titulo: p.titulo, url_poster: p.url_poster });
      });
    }

    return data.map((ord: any) => {
      const entradas = (ord.detalle_entrada || []).map((de: any) => {
        const fila = de.asiento_funcion?.asiento?.fila || "";
        const col = de.asiento_funcion?.asiento?.columna || "";
        return {
          id_detalle_entrada: de.id_detalle_entrada,
          id_asiento_funcion: de.id_asiento_funcion,
          codigo_asiento: `${fila}${col}`,
          tipo_entrada: de.tipo_entrada?.nombre || "General",
          precio_unitario: Number(de.precio_unitario),
          codigo_validacion: de.codigo_validacion,
        };
      });

      const productos = (ord.detalle_producto || []).map((dp: any) => ({
        id_detalle_producto: dp.id_detalle_producto,
        id_producto: dp.id_producto,
        nombre_producto: dp.producto?.nombre || "Producto",
        cantidad: Number(dp.cantidad),
        precio_unitario: Number(dp.precio_unitario),
        subtotal: Number(dp.cantidad) * Number(dp.precio_unitario),
      }));

      let peliculaInfo: any = undefined;
      const fn = ord.detalle_entrada?.[0]?.asiento_funcion?.funcion;
      if (fn) {
        const peli = fn.id_pelicula ? peliculasMap.get(fn.id_pelicula) : undefined;
        peliculaInfo = {
          titulo: peli?.titulo || "Función Cine",
          formato: fn.formato_proyeccion?.nombre || "2D",
          sala: fn.sala?.nombre_sala || "Sala",
          fecha: fn.fecha || "",
          hora: fn.hora_inicio || "",
          poster_url: peli?.url_poster || "",
        };
      }

      const compData = Array.isArray(ord.comprobante) ? ord.comprobante[0] : ord.comprobante;

      return {
        id_orden: ord.id_orden,
        codigo_orden: ord.codigo_orden,
        id_sede: ord.id_sede,
        nombre_sede: ord.sede?.nombre || "CineNáutica",
        direccion_sede: ord.sede?.direccion || "",
        canal: ord.canal,
        correo_contacto: ord.correo_contacto || "",
        nombre_contacto: ord.nombre_contacto || "",
        fecha_creacion: ord.fecha_creacion,
        estado: ord.estado,
        subtotal_entradas: Number(ord.subtotal_entradas || 0),
        subtotal_productos: Number(ord.subtotal_productos || 0),
        descuento_cupon: Number(ord.descuento_cupon || 0),
        descuento_puntos: Number(ord.descuento_puntos || 0),
        puntos_canjeados: Number(ord.puntos_canjeados || 0),
        total: Number(ord.total || 0),
        entradas,
        productos,
        comprobante: compData
          ? {
              id_comprobante: compData.id_comprobante,
              id_sede: compData.id_sede,
              tipo: compData.tipo,
              numero_documento_cliente: compData.numero_documento_cliente,
              nombre_cliente: compData.nombre_cliente,
              serie: compData.serie,
              correlativo: compData.correlativo,
              numero_comprobante: compData.numero_comprobante,
              subtotal_sin_igv: Number(compData.subtotal_sin_igv),
              igv: Number(compData.igv),
              total: Number(compData.total),
              fecha_emision: compData.fecha_emision,
            }
          : undefined,
        pelicula: peliculaInfo,
      };
    });
  }
}
