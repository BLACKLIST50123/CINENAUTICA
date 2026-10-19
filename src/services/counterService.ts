// Servicio unificado para Punto de Venta (Counter: Boletería, Dulcería y Mixto)
import { supabase } from "@/src/lib/supabase/cliente";
import { SedeDao } from "@/src/daos/SedeDao";
import { FuncionDao } from "@/src/daos/FuncionDao";
import { AsientoDao } from "@/src/daos/AsientoDao";
import { AsientoService } from "@/src/services/asientoService";
import { ProductoDao } from "@/src/daos/ProductoDao";
import { SocioDao } from "@/src/daos/SocioDao";
import { TarifaDao } from "@/src/daos/TarifaDao";
import type {
  VentaCounterInputDTO,
  VentaCounterResultadoDTO,
  SocioCounterDTO,
  RegistroSocioRapidoDTO,
  OrdenContingenciaDTO,
} from "@/src/dtos/counter";

export class CounterService {
  /**
   * Obtiene la lista de sedes activas para el selector de pruebas
   */
  static async obtenerSedesActivas() {
    return await SedeDao.obtenerSedes();
  }

  /**
   * Obtiene las funciones del día para una sede específica con ocupación real de sala
   */
  static async obtenerFuncionesPorSedeYFecha(idSede: number, fechaIso?: string) {
    let fecha = fechaIso;
    if (!fecha) {
      const d = new Date();
      fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    const { data, error } = await supabase
      .from("funcion")
      .select(`
        id_funcion,
        id_pelicula,
        id_sede,
        id_sala,
        id_formato,
        fecha,
        hora_inicio,
        hora_fin,
        idioma_audio,
        estado,
        sala ( id_sala, numero_sala, nombre_sala, filas, columnas ),
        pelicula ( id_pelicula, titulo, url_poster, duracion_min, clasificacion ),
        formato_proyeccion ( id_formato, codigo, nombre )
      `)
      .eq("id_sede", idSede)
      .eq("fecha", fecha)
      .neq("estado", "Cancelada")
      .order("hora_inicio", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("Error al obtener funciones de la sede:", error);
      return [];
    }

    const idsFunciones = data.map((f: any) => f.id_funcion);
    const idsSalas = Array.from(new Set(data.map((f: any) => f.id_sala).filter(Boolean)));

    // 1. Capacidad real por sala desde la tabla asiento
    const mapaCapacidadSala = new Map<string, number>();
    if (idsSalas.length > 0) {
      const { data: asientosSalas } = await supabase
        .from("asiento")
        .select("id_sala")
        .in("id_sala", idsSalas)
        .eq("en_mantenimiento", false);

      asientosSalas?.forEach((a: any) => {
        mapaCapacidadSala.set(a.id_sala, (mapaCapacidadSala.get(a.id_sala) || 0) + 1);
      });
    }

    // 2. Conteo de asientos vendidos / ocupados en asiento_funcion
    const mapaOcupados = new Map<string, number>();
    if (idsFunciones.length > 0) {
      const { data: asientosOcupados } = await supabase
        .from("asiento_funcion")
        .select("id_funcion")
        .in("id_funcion", idsFunciones)
        .eq("estado", "Ocupado");

      asientosOcupados?.forEach((af: any) => {
        mapaOcupados.set(af.id_funcion, (mapaOcupados.get(af.id_funcion) || 0) + 1);
      });

      // 3. Bloqueos temporales activos (en selección actual)
      const ahoraIso = new Date().toISOString();
      const { data: bloqueosActivos } = await supabase
        .from("bloqueo_temporal")
        .select(`
          id_asiento_funcion,
          asiento_funcion!inner(id_funcion)
        `)
        .eq("estado", "Activo")
        .gt("fecha_hora_expiracion", ahoraIso);

      bloqueosActivos?.forEach((b: any) => {
        const idFn = b.asiento_funcion?.id_funcion;
        if (idFn && idsFunciones.includes(idFn)) {
          mapaOcupados.set(idFn, (mapaOcupados.get(idFn) || 0) + 1);
        }
      });
    }

    return data.map((item: any) => {
      const total =
        mapaCapacidadSala.get(item.id_sala) ||
        (item.sala?.filas && item.sala?.columnas ? item.sala.filas * item.sala.columnas : 84);
      const ocupados = mapaOcupados.get(item.id_funcion) || 0;
      const pct = total > 0 ? Math.round((ocupados / total) * 100) : 0;

      return {
        ...item,
        hora_inicio: item.hora_inicio?.slice(0, 5) ?? item.hora_inicio,
        hora_fin: item.hora_fin?.slice(0, 5) ?? item.hora_fin,
        ocupacion: {
          ocupados,
          total,
          pct,
        },
      };
    });
  }

  /**
   * Obtiene la matriz de sala, asientos físicos y estados para una función
   */
  static async obtenerMapaAsientos(idFuncion: string) {
    const fn = await FuncionDao.obtenerFuncionCompraPorId(idFuncion);
    if (!fn) throw new Error("La función especificada no existe.");

    const sala = await AsientoDao.obtenerSala(fn.id_sala);
    if (!sala) throw new Error("Sala no encontrada.");

    const [asientosFisicos, asientosFuncion, bloqueosActivos, tiposEntrada] =
      await Promise.all([
        AsientoDao.obtenerAsientosPorSala(fn.id_sala),
        AsientoDao.obtenerAsientosFuncion(idFuncion),
        AsientoDao.obtenerBloqueosActivos(idFuncion),
        TarifaDao.obtenerTiposEntrada(),
      ]);

    const tarifaVigente = await AsientoService.obtenerTarifaVigente(
      fn.fecha,
      fn.formato,
      fn.id_sede,
      fn.es_prestreno
    );

    const tarifasMapeadas = tiposEntrada.map((te) => ({
      id_tipo_entrada: te.id_tipo_entrada,
      codigo: te.codigo,
      nombre: te.nombre,
      precio: AsientoService.calcularPrecioEntrada(
        tarifaVigente.precio_base_con_formato,
        te.descuento_pct
      ),
      descuento_pct: te.descuento_pct,
    }));

    // Combinar estado de asientos
    const mapaEstados = new Map<string, { id_asiento_funcion: string; estado: string }>();
    asientosFuncion.forEach((af: any) => {
      mapaEstados.set(af.id_asiento, {
        id_asiento_funcion: af.id_asiento_funcion,
        estado: af.estado,
      });
    });

    const mapaBloqueos = new Map<string, string>(); // id_asiento -> id_sesion
    bloqueosActivos.forEach((b: any) => {
      if (b.id_asiento) mapaBloqueos.set(b.id_asiento, b.id_sesion);
    });

    const asientosMapeados = asientosFisicos.map((af: any) => {
      const afInfo = mapaEstados.get(af.id_asiento);
      const sesionBloqueo = mapaBloqueos.get(af.id_asiento);

      let estado = afInfo?.estado || "Disponible";
      if (sesionBloqueo && estado === "Disponible") {
        estado = "Bloqueado";
      }

      return {
        id_asiento: af.id_asiento,
        id_asiento_funcion: afInfo?.id_asiento_funcion || "",
        fila: af.fila,
        columna: af.columna,
        codigo: `${af.fila}${af.columna}`,
        tipo: af.tipo_asiento,
        en_mantenimiento: af.en_mantenimiento,
        estado,
        id_sesion_bloqueo: sesionBloqueo || null,
      };
    });

    return {
      funcion: fn,
      sala,
      asientos: asientosMapeados,
      tarifas: tarifasMapeadas,
    };
  }

  /**
   * Bloquea temporalmente un asiento en Supabase para el Counter (en tiempo real)
   * Asegura el registro en asiento_funcion y genera el bloqueo_temporal.
   */
  static async bloquearAsientoCounter(
    idFuncion: string,
    idAsiento: string,
    idSesion: string,
    idUsuario?: string
  ): Promise<{ id_asiento_funcion: string; id_bloqueo: string }> {
    const idAsientoFuncion = await AsientoDao.asegurarAsientoFuncion(idFuncion, idAsiento);
    const idBloqueo = await AsientoDao.bloquearAsiento(idAsientoFuncion, idSesion, idUsuario);
    return {
      id_asiento_funcion: idAsientoFuncion,
      id_bloqueo: idBloqueo,
    };
  }

  /**
   * Libera el bloqueo de un asiento específico
   */
  static async liberarAsientoCounter(idAsientoFuncion: string, idSesion: string) {
    await AsientoDao.liberarBloqueoAsiento(idAsientoFuncion, idSesion);
  }

  /**
   * Libera todos los bloqueos temporales de una sesión de venta en counter
   */
  static async liberarTodosLosBloqueosCounter(idSesion: string) {
    if (!idSesion) return;
    await AsientoDao.liberarTodosLosBloqueosDeSesion(idSesion);
  }

  /**
   * Obtiene el catálogo de dulcería con stock y precios para una sede
   */
  static async obtenerProductosPorSede(idSede: number) {
    const [categorias, productos] = await Promise.all([
      ProductoDao.obtenerCategorias(),
      ProductoDao.obtenerProductosPorSede(idSede),
    ]);
    return { categorias, productos };
  }

  /**
   * Busca un socio por DNI o Código de Socio para ventanilla
   */
  static async buscarSocio(criterio: string): Promise<SocioCounterDTO | null> {
    const crit = criterio.trim();
    if (!crit) return null;

    let { data: usuario } = await supabase
      .from("usuario")
      .select("id_usuario, nombre, apellido, correo, dni, telefono")
      .eq("dni", crit)
      .maybeSingle();

    let idUsuario = usuario?.id_usuario;

    if (!idUsuario) {
      const { data: socioDirecto } = await supabase
        .from("socio")
        .select("id_usuario, codigo_socio")
        .ilike("codigo_socio", crit)
        .maybeSingle();

      if (socioDirecto) {
        idUsuario = socioDirecto.id_usuario;
      }
    }

    if (!idUsuario) return null;

    const socioCompleto = await SocioDao.obtenerSocioPorUsuario(idUsuario);
    if (!socioCompleto) return null;

    return {
      id_usuario: socioCompleto.id_usuario,
      codigo_socio: socioCompleto.codigo_socio,
      nombre_completo: `${socioCompleto.nombre} ${socioCompleto.apellido}`.trim(),
      dni: socioCompleto.dni || "",
      correo: socioCompleto.correo,
      telefono: socioCompleto.telefono || undefined,
      puntos: Number(socioCompleto.puntos || 0),
      nivel: socioCompleto.nivel?.nombre || "Bronce",
    };
  }

  /**
   * Registra un nuevo socio express en ventanilla
   */
  static async registrarSocioRapido(
    datos: RegistroSocioRapidoDTO
  ): Promise<SocioCounterDTO> {
    const dni = datos.dni.trim();
    const nombres = datos.nombres.trim();
    const apellidos = datos.apellidos.trim();
    const correo = datos.correo.trim().toLowerCase();
    const telefono = datos.telefono.trim();

    if (!dni || dni.length !== 8) {
      throw new Error("El DNI debe tener exactamente 8 dígitos.");
    }
    if (!nombres || !apellidos) {
      throw new Error("Nombres y apellidos son requeridos.");
    }

    const { data: existente } = await supabase
      .from("usuario")
      .select("id_usuario, dni, correo")
      .or(`dni.eq.${dni},correo.eq.${correo}`)
      .maybeSingle();

    let idUsuario = existente?.id_usuario;

    if (!idUsuario) {
      idUsuario = crypto.randomUUID();
      const { error: errInsertUser } = await supabase.from("usuario").insert({
        id_usuario: idUsuario,
        id_rol: "44444444-4444-4444-4444-444444444444", // rol 'cliente'
        nombre: nombres,
        apellido: apellidos,
        dni: dni,
        correo: correo,
        telefono: telefono || null,
        activo: true,
      });

      if (errInsertUser) {
        throw new Error(`Error al crear usuario: ${errInsertUser.message}`);
      }
    }

    const { data: socioExistente } = await supabase
      .from("socio")
      .select("id_usuario, codigo_socio, puntos")
      .eq("id_usuario", idUsuario)
      .maybeSingle();

    let codigoSocio = socioExistente?.codigo_socio;

    if (!socioExistente) {
      codigoSocio = `SOC-${dni}`;
      const { error: errInsertSocio } = await supabase.from("socio").insert({
        id_usuario: idUsuario,
        codigo_socio: codigoSocio,
        puntos: 0,
        id_nivel: 1, // Nivel Bronce
      });

      if (errInsertSocio) {
        throw new Error(`Error al registrar socio: ${errInsertSocio.message}`);
      }
    }

    return {
      id_usuario: idUsuario,
      codigo_socio: codigoSocio,
      nombre_completo: `${nombres} ${apellidos}`.trim(),
      dni: dni,
      correo: correo,
      telefono: telefono,
      puntos: Number(socioExistente?.puntos || 0),
      nivel: "Bronce",
    };
  }

  /**
   * Procesa la venta presencial en el POS (Boletería, Dulcería o Mixto)
   */
  static async procesarVentaCounter(
    input: VentaCounterInputDTO
  ): Promise<VentaCounterResultadoDTO> {
    const idOrden = crypto.randomUUID();
    const ahora = new Date();
    const codigoOrden = `ORD-${ahora
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1. Cálculos de subtotales
    const subtotalEntradas = (input.entradas || []).reduce(
      (acc, e) => acc + Number(e.precio || 0),
      0
    );
    const subtotalProductos = (input.productos || []).reduce(
      (acc, p) => acc + Number(p.subtotal || p.precio_unitario * p.cantidad || 0),
      0
    );
    const subtotal = subtotalEntradas + subtotalProductos;

    if (subtotal <= 0) {
      throw new Error("No hay productos ni entradas seleccionadas.");
    }

    const descuentoPuntos = Number(input.descuento_puntos || 0);
    const total = Math.max(0, Number((subtotal - descuentoPuntos).toFixed(2)));

    let montoRecibido = Number(input.monto_recibido || total);
    if (input.metodo_pago === "Efectivo") {
      if (montoRecibido < total) {
        throw new Error(
          `Monto recibido (S/ ${montoRecibido.toFixed(2)}) es menor al total a pagar (S/ ${total.toFixed(2)}).`
        );
      }
    } else {
      montoRecibido = total;
    }
    const vuelto = Math.max(0, Number((montoRecibido - total).toFixed(2)));

    // 2. Insertar orden en Supabase
    const { error: errOrden } = await supabase.from("orden").insert({
      id_orden: idOrden,
      codigo_orden: codigoOrden,
      id_sede: input.id_sede,
      id_usuario: input.socio?.id_usuario || null,
      id_vendedor: input.id_vendedor || null,
      canal: "Counter",
      correo_contacto: input.socio?.correo || "ventanilla@cinenautica.pe",
      nombre_contacto: input.nombre_cliente || input.socio?.nombre_completo || "Cliente Ventanilla",
      fecha_creacion: ahora.toISOString(),
      estado: "Pagada",
      subtotal_entradas: subtotalEntradas,
      subtotal_productos: subtotalProductos,
      descuento_cupon: 0,
      puntos_canjeados: input.puntos_canjeados || 0,
      descuento_puntos: descuentoPuntos,
      total: total,
    });

    if (errOrden) {
      console.error("Error al registrar orden counter:", errOrden);
      throw new Error(`Error al crear orden: ${errOrden.message}`);
    }

    // 3. Registrar entradas en detalle_entrada
    if (input.entradas && input.entradas.length > 0) {
      const idsAsientoFuncion: string[] = [];
      const detallesEntradas = [];

      for (const e of input.entradas) {
        let idAf = e.id_asiento_funcion;
        if (!idAf && input.id_funcion && (e as any).id_asiento) {
          idAf = await AsientoDao.asegurarAsientoFuncion(input.id_funcion, (e as any).id_asiento);
        }
        if (idAf) {
          idsAsientoFuncion.push(idAf);
          detallesEntradas.push({
            id_orden: idOrden,
            id_asiento_funcion: idAf,
            id_tipo_entrada: e.id_tipo_entrada,
            precio_lista: e.precio,
            precio_unitario: e.precio,
            codigo_validacion: `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          });
        }
      }

      if (detallesEntradas.length > 0) {
        const { error: errEntradas } = await supabase
          .from("detalle_entrada")
          .insert(detallesEntradas as any);

        if (errEntradas) {
          console.error("Fallo inserción en detalle_entrada:", errEntradas.message);
          throw new Error(`Error al registrar detalle de entradas: ${errEntradas.message}`);
        }

        // Marcar butacas a 'Ocupado'
        await supabase
          .from("asiento_funcion")
          .update({ estado: "Ocupado" })
          .in("id_asiento_funcion", idsAsientoFuncion);

        // Eliminar bloqueos temporales
        await supabase
          .from("bloqueo_temporal")
          .delete()
          .in("id_asiento_funcion", idsAsientoFuncion);
      }
    }

    // 4. Registrar productos en detalle_producto
    if (input.productos && input.productos.length > 0) {
      const detallesProductos = input.productos.map((p) => ({
        id_orden: idOrden,
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
      }));

      const { error: errProd } = await supabase
        .from("detalle_producto")
        .insert(detallesProductos);

      if (errProd) {
        console.warn("Fallo inserción en detalle_producto:", errProd.message);
      }
    }

    // 5. Registrar Pago
    const idPago = crypto.randomUUID();
    await supabase.from("pago").insert({
      id_pago: idPago,
      id_orden: idOrden,
      metodo_pago: input.metodo_pago,
      monto: total,
      estado: "Aprobado",
      fecha_pago: ahora.toISOString(),
      referencia_pasarela: `POS-${input.metodo_pago.toUpperCase()}-${ahora.getTime().toString().slice(-6)}`,
    });

    // 6. Generar Comprobante
    const serie = input.tipo_comprobante === "Factura" ? "F001" : "B001";
    const correlativo = Math.floor(100000 + Math.random() * 900000);
    const numeroComprobante = `${serie}-${correlativo}`;
    const subtotalSinIgv = Number((total / 1.18).toFixed(2));
    const igv = Number((total - subtotalSinIgv).toFixed(2));

    await supabase.from("comprobante").insert({
      id_comprobante: crypto.randomUUID(),
      id_orden: idOrden,
      id_sede: input.id_sede,
      tipo: input.tipo_comprobante,
      numero_documento_cliente: input.numero_documento || "00000000",
      nombre_cliente: input.nombre_cliente || "Cliente Ventanilla",
      serie: serie,
      correlativo: correlativo,
      numero_comprobante: numeroComprobante,
      subtotal_sin_igv: subtotalSinIgv,
      igv: igv,
      total: total,
      fecha_emision: ahora.toISOString(),
    });

    // 7. Puntos ganados
    let puntosGanados = 0;
    if (input.socio?.id_usuario) {
      puntosGanados = Math.floor(total / 10);
      if (puntosGanados > 0) {
        try {
          await (supabase.rpc as any)("acumular_puntos_socio", {
            p_id_usuario: input.socio.id_usuario,
            p_puntos: puntosGanados,
            p_id_orden: idOrden,
          });
        } catch {
          await supabase
            .from("socio")
            .update({ puntos: (input.socio?.puntos || 0) + puntosGanados })
            .eq("id_usuario", input.socio.id_usuario);
        }
      }
    }

    return {
      ok: true,
      id_orden: idOrden,
      codigo_orden: codigoOrden,
      numero_comprobante: numeroComprobante,
      tipo_comprobante: input.tipo_comprobante,
      subtotal: subtotal,
      descuento: descuentoPuntos,
      total: total,
      monto_recibido: montoRecibido,
      vuelto: vuelto,
      puntos_ganados: puntosGanados,
      fecha: ahora.toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" }),
      metodo_pago: input.metodo_pago,
      nombre_cliente: input.nombre_cliente,
      numero_documento: input.numero_documento,
      id_sede: input.id_sede,
      nombre_sede: "CineNáutica",
      entradas: input.entradas || [],
      productos: input.productos || [],
      pelicula_titulo: input.pelicula_titulo,
      formato: input.formato,
      sala: input.sala,
      hora: input.hora,
      qr_codigo: `CN-VAL|${codigoOrden}|${numeroComprobante}|${total.toFixed(2)}`,
    };
  }

  /**
   * Busca órdenes para acciones de contingencia (Reimprimir, Reembolsar)
   */
  static async buscarOrdenesContingencia(
    criterio: string,
    idSede?: number
  ): Promise<OrdenContingenciaDTO[]> {
    const crit = criterio.trim().toUpperCase();
    if (!crit) return [];

    let query = supabase
      .from("orden")
      .select(`
        id_orden,
        codigo_orden,
        fecha_creacion,
        estado,
        nombre_contacto,
        correo_contacto,
        total,
        id_sede,
        sede ( nombre ),
        comprobante (
          tipo,
          numero_comprobante,
          numero_documento_cliente,
          nombre_cliente
        ),
        pago ( metodo_pago ),
        detalle_entrada (
          id_detalle_entrada,
          id_asiento_funcion,
          precio_unitario,
          codigo_validacion,
          asiento_funcion (
            id_funcion,
            asiento ( fila, columna ),
            funcion (
              id_pelicula,
              hora_inicio,
              fecha,
              sala ( nombre_sala ),
              formato_proyeccion ( nombre ),
              pelicula ( titulo )
            )
          )
        ),
        detalle_producto (
          id_producto,
          cantidad,
          precio_unitario,
          producto ( nombre )
        )
      `)
      .order("fecha_creacion", { ascending: false })
      .limit(10);

    if (idSede) {
      query = query.eq("id_sede", idSede);
    }

    if (crit.startsWith("ORD-")) {
      query = query.ilike("codigo_orden", `%${crit}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error("Error al buscar órdenes para contingencia:", error);
      return [];
    }

    return data.map((ord: any) => {
      const comp = Array.isArray(ord.comprobante) ? ord.comprobante[0] : ord.comprobante;
      const pago = Array.isArray(ord.pago) ? ord.pago[0] : ord.pago;

      const entradas: any[] = (ord.detalle_entrada || []).map((de: any) => {
        const fila = de.asiento_funcion?.asiento?.fila || "";
        const col = de.asiento_funcion?.asiento?.columna || "";
        return {
          id_asiento_funcion: de.id_asiento_funcion,
          codigo_asiento: `${fila}${col}`,
          id_tipo_entrada: "",
          tipo_nombre: "Entrada Cine",
          precio: Number(de.precio_unitario),
        };
      });

      const productos: any[] = (ord.detalle_producto || []).map((dp: any) => ({
        id_producto: dp.id_producto,
        nombre: dp.producto?.nombre || "Producto",
        cantidad: Number(dp.cantidad),
        precio_unitario: Number(dp.precio_unitario),
        subtotal: Number(dp.cantidad) * Number(dp.precio_unitario),
      }));

      const primerFn = ord.detalle_entrada?.[0]?.asiento_funcion?.funcion;
      let peliculaData = undefined;
      if (primerFn) {
        peliculaData = {
          id_funcion: ord.detalle_entrada?.[0]?.asiento_funcion?.id_funcion,
          titulo: primerFn.pelicula?.titulo || "Película",
          sala: primerFn.sala?.nombre_sala || "Sala",
          formato: primerFn.formato_proyeccion?.nombre || "2D",
          hora: primerFn.hora_inicio || "",
          fecha: primerFn.fecha || "",
        };
      }

      return {
        id_orden: ord.id_orden,
        codigo_orden: ord.codigo_orden,
        fecha: new Date(ord.fecha_creacion).toLocaleString("es-PE", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        estado: ord.estado,
        cliente_nombre: comp?.nombre_cliente || ord.nombre_contacto || "Cliente",
        cliente_documento: comp?.numero_documento_cliente || "",
        nombre_cliente: comp?.nombre_cliente || ord.nombre_contacto || "Cliente",
        numero_documento: comp?.numero_documento_cliente || "",
        tipo_comprobante: comp?.tipo || "Boleta",
        numero_comprobante: comp?.numero_comprobante || "B001-000000",
        metodo_pago: pago?.metodo_pago || "Efectivo",
        total: Number(ord.total || 0),
        id_sede: ord.id_sede,
        nombre_sede: ord.sede?.nombre || "CineNáutica",
        entradas,
        productos,
        pelicula: peliculaData,
        pelicula_titulo: peliculaData?.titulo,
        sala: peliculaData?.sala,
        formato: peliculaData?.formato,
        hora: peliculaData?.hora,
      };
    });
  }

  /**
   * Ejecuta el reembolso de una orden por contingencia:
   * - Cambia estado de orden a 'Reembolsada'
   * - Libera butacas de la función a 'Disponible'
   */
  static async reembolsarOrdenContingencia(idOrden: string, _motivo?: string) {
    const { data: orden } = await supabase
      .from("orden")
      .select(`
        id_orden,
        estado,
        detalle_entrada ( id_asiento_funcion )
      `)
      .eq("id_orden", idOrden)
      .single();

    if (!orden) throw new Error("La orden especificada no existe.");
    if (orden.estado === "Reembolsada") {
      throw new Error("Esta orden ya ha sido reembolsada previamente.");
    }

    const { error: errUpdate } = await supabase
      .from("orden")
      .update({ estado: "Reembolsada" })
      .eq("id_orden", idOrden);

    if (errUpdate) {
      throw new Error(`Error al actualizar estado de la orden: ${errUpdate.message}`);
    }

    const idsAsientosFuncion = (orden.detalle_entrada || []).map(
      (de: any) => de.id_asiento_funcion
    );

    if (idsAsientosFuncion.length > 0) {
      await supabase
        .from("asiento_funcion")
        .update({ estado: "Disponible" })
        .in("id_asiento_funcion", idsAsientosFuncion);
    }

    return { ok: true, mensaje: "Orden reembolsada y butacas liberadas exitosamente." };
  }
}
