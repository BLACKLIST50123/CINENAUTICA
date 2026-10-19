"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import CounterHeader from "../comun/CounterHeader";
import ModuloPagoPOS from "../comun/ModuloPagoPOS";
import ModalVincularSocio from "../comun/ModalVincularSocio";
import ModalBuscarOrden from "../comun/ModalBuscarOrden";
import ModalConfirmarSalidaCounter from "../comun/ModalConfirmarSalidaCounter";
import TicketTermicoPOS from "../comun/TicketTermicoPOS";
import { CounterService } from "@/src/services/counterService";
import { supabase } from "@/src/lib/supabase/cliente";
import type {
  SocioCounterDTO,
  ItemProductoCounter,
  VentaCounterResultadoDTO,
  OrdenContingenciaDTO,
} from "@/src/dtos/counter";

export function obtenerIconoProducto(nombre: string, categoria?: string) {
  const n = (nombre || "").toLowerCase();
  const c = (categoria || "").toLowerCase();

  if (n.includes("popcorn") || n.includes("canchita") || c.includes("popcorn") || c.includes("canchita")) {
    return {
      icono: "fa-solid fa-bowl-food",
      colorIcono: "text-amber-400",
      bgGradiente: "from-amber-500/20 via-yellow-500/10 to-amber-950/30 border-amber-500/30",
    };
  }
  if (n.includes("combo") || c.includes("combo")) {
    return {
      icono: "fa-solid fa-boxes-stacked",
      colorIcono: "text-cyan-400",
      bgGradiente: "from-cyan-500/20 via-blue-500/10 to-cyan-950/30 border-cyan-500/30",
    };
  }
  if (
    n.includes("gaseosa") ||
    n.includes("bebida") ||
    n.includes("agua") ||
    n.includes("jugo") ||
    n.includes("coca") ||
    n.includes("inca") ||
    c.includes("bebida")
  ) {
    return {
      icono: "fa-solid fa-glass-water",
      colorIcono: "text-sky-400",
      bgGradiente: "from-blue-500/20 via-sky-500/10 to-blue-950/30 border-sky-500/30",
    };
  }
  if (n.includes("nacho") || n.includes("queso") || n.includes("hot") || n.includes("snack") || c.includes("snack")) {
    return {
      icono: "fa-solid fa-hotdog",
      colorIcono: "text-orange-400",
      bgGradiente: "from-orange-500/20 via-amber-500/10 to-orange-950/30 border-orange-500/30",
    };
  }
  if (n.includes("chocolate") || n.includes("dulce") || n.includes("gomita") || n.includes("golosina") || c.includes("dulce")) {
    return {
      icono: "fa-solid fa-cookie-bite",
      colorIcono: "text-pink-400",
      bgGradiente: "from-pink-500/20 via-rose-500/10 to-pink-950/30 border-pink-500/30",
    };
  }

  return {
    icono: "fa-solid fa-utensils",
    colorIcono: "text-slate-300",
    bgGradiente: "from-slate-700/30 via-slate-800/20 to-slate-900/40 border-slate-700/40",
  };
}

export default function DulceriaView() {
  // ── 1. Sedes y Contexto Operativo ──
  const [sedes, setSedes] = useState<{ id_sede: number; nombre: string }[]>([
    { id_sede: 1, nombre: "CineNáutica Chimbote" },
    { id_sede: 2, nombre: "CineNáutica Costa Azul" },
    { id_sede: 3, nombre: "CineNáutica Nuevo Chimbote" },
    { id_sede: 6, nombre: "CineNáutica Lima Norte" },
  ]);
  const [idSede, setIdSede] = useState<number>(1);
  const sedeActual = sedes.find((s) => s.id_sede === idSede) || sedes[0];

  // ── 2. Estados de Venta y Subvistas ──
  const [subvista, setSubvista] = useState<"catalogo" | "cobro" | "exito">("catalogo");

  // ── Usuario Autenticado Real ──
  const [usuarioActivo, setUsuarioActivo] = useState<{
    idUsuario: string;
    nombreCompleto: string;
    rolCodigo: string;
  }>(() => {
    if (typeof window !== "undefined") {
      const storedNombre = localStorage.getItem("cinenautica_usuario_nombre");
      const storedRol = localStorage.getItem("cinenautica_rol_personal");
      const storedId = localStorage.getItem("cinenautica_usuario_id");
      if (storedNombre && storedId) {
        return {
          idUsuario: storedId,
          nombreCompleto: storedNombre,
          rolCodigo: storedRol || "counter_dulceria",
        };
      }
    }
    return {
      idUsuario: "",
      nombreCompleto: "Cajero",
      rolCodigo: "counter_dulceria",
    };
  });

  useEffect(() => {
    async function cargarUsuarioSesion() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: usuarioData } = await supabase
            .from("usuario")
            .select("id_usuario, nombre, apellido, correo, rol:id_rol (codigo, nombre_rol)")
            .eq("id_usuario", session.user.id)
            .maybeSingle();

          if (usuarioData) {
            const nombre = `${usuarioData.nombre || ""} ${usuarioData.apellido || ""}`.trim() || usuarioData.correo;
            const rol = (usuarioData.rol as any)?.codigo || "counter_dulceria";
            setUsuarioActivo({
              idUsuario: usuarioData.id_usuario,
              nombreCompleto: nombre,
              rolCodigo: rol,
            });

            try {
              localStorage.setItem("cinenautica_usuario_nombre", nombre);
              localStorage.setItem("cinenautica_rol_personal", rol);
              localStorage.setItem("cinenautica_usuario_id", usuarioData.id_usuario);
            } catch {}
          }

          // Cargar sede asignada en personal_sede
          const { data: psData } = await supabase
            .from("personal_sede")
            .select("id_sede")
            .eq("id_usuario", session.user.id)
            .eq("activo", true)
            .maybeSingle();

          if (psData?.id_sede) {
            setIdSede(psData.id_sede);
          }
        }
      } catch (e) {
        console.warn("No se pudo cargar el perfil de usuario activo en dulcería:", e);
      }
    }
    cargarUsuarioSesion();
  }, []);

  // Socio Activo
  const [socioActivo, setSocioActivo] = useState<SocioCounterDTO | null>(null);

  // Catálogo y Filtros
  const [cargandoProductos, setCargandoProductos] = useState<boolean>(true);
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("all");
  const [busqueda, setBusqueda] = useState<string>("");

  // Carrito de Productos (id_producto -> ItemProductoCounter)
  const [carrito, setCarrito] = useState<Map<string, ItemProductoCounter>>(new Map());

  // Venta Finalizada y Reimpresión
  const [resultadoVenta, setResultadoVenta] = useState<VentaCounterResultadoDTO | null>(null);
  const [ordenReimpresion, setOrdenReimpresion] = useState<OrdenContingenciaDTO | null>(null);
  const [procesandoCobro, setProcesandoCobro] = useState(false);

  // Modales
  const [modalSocioAbierto, setModalSocioAbierto] = useState(false);
  const [modalOrdenAbierto, setModalOrdenAbierto] = useState(false);
  const [modalSalidaAbierto, setModalSalidaAbierto] = useState(false);
  const [accionSalidaPendiente, setAccionSalidaPendiente] = useState<(() => void) | null>(null);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const mostrarToast = (msg: string) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(null), 4000);
  };

  // ── 3. Cargar Sedes y Catálogo de Dulcería ──
  useEffect(() => {
    CounterService.obtenerSedesActivas()
      .then((res) => {
        if (res && res.length > 0) {
          setSedes(res);
          try {
            const sedeGuardada = localStorage.getItem("cinenautica_sede_personal");
            if (sedeGuardada && res.some((s) => s.id_sede === Number(sedeGuardada))) {
              setIdSede(Number(sedeGuardada));
            }
          } catch {}
        }
      })
      .catch((e) => console.warn("Error al cargar sedes:", e));
  }, []);

  const cargarDulceria = useCallback(async (sedeId: number) => {
    setCargandoProductos(true);
    try {
      const data = await CounterService.obtenerProductosPorSede(sedeId);
      setCategorias(data.categorias || []);
      setProductos(data.productos || []);
    } catch (err) {
      console.error("Error al cargar dulcería:", err);
      setProductos([]);
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  useEffect(() => {
    cargarDulceria(idSede);
  }, [idSede, cargarDulceria]);

  // ── 4. Cambio de Sede para Pruebas (con confirmación si hay selección) ──
  const handleCambiarSede = (nuevaSedeId: number) => {
    if (carrito.size > 0) {
      setAccionSalidaPendiente(() => () => {
        setCarrito(new Map());
        setIdSede(nuevaSedeId);
      });
      setModalSalidaAbierto(true);
    } else {
      setIdSede(nuevaSedeId);
    }
  };

  // ── 5. Control de Cantidades en Carrito ──
  const modificarCantidad = (prod: any, delta: number) => {
    setCarrito((prev) => {
      const nuevo = new Map(prev);
      const actual = nuevo.get(prod.id_producto);
      const precio = Number(prod.precio_final || prod.precio_base || 0);

      if (!actual && delta > 0) {
        nuevo.set(prod.id_producto, {
          id_producto: prod.id_producto,
          nombre: prod.nombre,
          precio_unitario: precio,
          cantidad: 1,
          subtotal: precio,
          url_imagen: prod.url_imagen,
          categoria: prod.nombre_categoria,
        });
      } else if (actual) {
        const nuevaCant = actual.cantidad + delta;
        if (nuevaCant <= 0) {
          nuevo.delete(prod.id_producto);
        } else {
          nuevo.set(prod.id_producto, {
            ...actual,
            cantidad: nuevaCant,
            subtotal: Number((nuevaCant * actual.precio_unitario).toFixed(2)),
          });
        }
      }
      return nuevo;
    });
  };

  const listaItemsCarrito = useMemo(() => Array.from(carrito.values()), [carrito]);

  const totalDulceria = useMemo(() => {
    return listaItemsCarrito.reduce((acc, item) => acc + item.subtotal, 0);
  }, [listaItemsCarrito]);

  // ── 6. Cancelar Pedido ──
  const handleSolicitarCancelar = () => {
    if (carrito.size > 0) {
      setAccionSalidaPendiente(() => () => {
        setCarrito(new Map());
        setSubvista("catalogo");
      });
      setModalSalidaAbierto(true);
    } else {
      setCarrito(new Map());
      setSubvista("catalogo");
    }
  };

  // ── 7. Procesar Cobro ──
  const handleConfirmarCobro = async (datosCobro: any) => {
    if (listaItemsCarrito.length === 0) return;

    setProcesandoCobro(true);
    try {
      const res = await CounterService.procesarVentaCounter({
        modo: "dulceria",
        id_sede: idSede,
        id_vendedor: usuarioActivo.idUsuario,
        socio: socioActivo,
        tipo_comprobante: datosCobro.tipo_comprobante,
        numero_documento: datosCobro.numero_documento,
        nombre_cliente: datosCobro.nombre_cliente,
        metodo_pago: datosCobro.metodo_pago,
        monto_recibido: datosCobro.monto_recibido,
        entradas: [],
        productos: listaItemsCarrito,
        descuento_puntos: datosCobro.descuento_puntos,
        puntos_canjeados: datosCobro.puntos_canjeados,
      });

      setResultadoVenta(res);
      setSubvista("exito");
      mostrarToast(`¡Cobro de dulcería exitoso! Vuelto: S/ ${res.vuelto.toFixed(2)}`);
    } catch (e: any) {
      throw e;
    } finally {
      setProcesandoCobro(false);
    }
  };

  // ── 8. Filtro de Productos ──
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda =
        !busqueda.trim() || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCat =
        categoriaSeleccionada === "all" ||
        p.id_categoria === categoriaSeleccionada ||
        p.nombre_categoria?.toLowerCase().includes(categoriaSeleccionada.toLowerCase());
      return coincideBusqueda && coincideCat;
    });
  }, [productos, busqueda, categoriaSeleccionada]);

  return (
    <div className="bg-dark-900 text-white min-h-screen pt-16 antialiased flex flex-col justify-between">
      {/* Toast Notificación */}
      {toastMensaje && (
        <div className="fixed top-20 right-6 z-[150] bg-dark-800 border border-brand-yellow/50 text-brand-yellow px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMensaje}</span>
        </div>
      )}

      {/* Header Compartido POS */}
      <CounterHeader
        modo="dulceria"
        sedeActual={sedeActual}
        sedesDisponibles={sedes}
        onCambiarSede={handleCambiarSede}
        socioActivo={socioActivo}
        onAbrirModalSocio={() => setModalSocioAbierto(true)}
        onAbrirModalOrden={() => setModalOrdenAbierto(true)}
        cajeroNombre={usuarioActivo.nombreCompleto}
        rolUsuario={usuarioActivo.rolCodigo}
      />

      {/* Layout Principal: Contenido (1fr) + Panel lateral de pedido (380px) */}
      <div className="flex-1 lg:grid lg:grid-cols-[1fr_380px]">
        <main className="min-w-0">
          {/* SUBVISTA 1: CATÁLOGO DE DULCERÍA */}
          {subvista === "catalogo" && (
            <div id="cv-dulceria" className="p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Caja de Dulcería & Snacks</h1>
                  <p className="text-slate-400 text-xs md:text-sm">
                    {sedeActual.nombre} · Venta directa y despacho de combos, bebidas y popcorn
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setCategoriaSeleccionada("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    categoriaSeleccionada === "all"
                      ? "bg-brand-yellow text-black border-brand-yellow"
                      : "bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow"
                  }`}
                >
                  Todo
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id_categoria}
                    type="button"
                    onClick={() => setCategoriaSeleccionada(cat.id_categoria)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      categoriaSeleccionada === cat.id_categoria
                        ? "bg-brand-yellow text-black border-brand-yellow"
                        : "bg-dark-900 text-slate-300 border-white/10 hover:border-brand-yellow"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>

              {/* Grid de Productos */}
              {cargandoProductos ? (
                <div className="text-center py-20 text-slate-400">
                  <i className="fa-solid fa-spinner fa-spin text-3xl text-brand-yellow mb-3"></i>
                  <p className="text-sm">Cargando dulcería de {sedeActual.nombre}...</p>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div className="text-center py-16 bg-dark-800 border border-white/5 rounded-2xl p-8">
                  <i className="fa-solid fa-bowl-food text-slate-500 text-4xl mb-3"></i>
                  <h3 className="text-lg font-bold text-white mb-1">No hay productos en esta categoría</h3>
                  <p className="text-xs text-slate-400">
                    Prueba cambiando de categoría o usando el buscador.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {productosFiltrados.map((prod) => {
                    const cantidadEnCarrito = carrito.get(prod.id_producto)?.cantidad || 0;
                    const precio = Number(prod.precio_final || prod.precio_base || 0);
                    const { icono, colorIcono, bgGradiente } = obtenerIconoProducto(
                      prod.nombre,
                      prod.nombre_categoria
                    );

                    return (
                      <div
                        key={prod.id_producto}
                        className={`bg-dark-800 border rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-all group shadow-md hover:border-slate-700 ${
                          cantidadEnCarrito > 0
                            ? "border-brand-yellow/60 bg-dark-800/95 shadow-lg shadow-yellow-500/10 ring-1 ring-brand-yellow/40"
                            : "border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div>
                          {/* Espacio superior de la imagen: rectángulo a ancho completo con icono temático */}
                          <div
                            className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center bg-gradient-to-br ${bgGradiente} border relative mb-2.5 overflow-hidden transition-transform group-hover:scale-[1.02]`}
                          >
                            <i className={`${icono} ${colorIcono} text-4xl drop-shadow-md`}></i>
                            {cantidadEnCarrito > 0 && (
                              <span className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                                {cantidadEnCarrito}
                              </span>
                            )}
                          </div>

                          {/* Nombre del producto debajo de la imagen */}
                          <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 mb-1">
                            {prod.nombre}
                          </h3>

                          {/* Descripción breve debajo del nombre */}
                          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 min-h-[30px]">
                            {prod.descripcion || "Snack fresco listo para disfrutar."}
                          </p>

                          {/* Precio debajo de la descripción */}
                          <p className="text-brand-yellow font-extrabold text-base font-mono mt-2">
                            S/ {precio.toFixed(2)}
                          </p>
                        </div>

                        {/* Botones de Cantidad + y - al fondo del card */}
                        <div className="flex items-center justify-between bg-dark-900 rounded-xl px-2.5 py-1.5 border border-white/10 mt-1">
                          <button
                            type="button"
                            disabled={cantidadEnCarrito === 0}
                            onClick={() => modificarCantidad(prod, -1)}
                            className="w-7 h-7 rounded-lg bg-dark-700 text-white hover:bg-brand-red disabled:opacity-30 disabled:hover:bg-dark-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>

                          <span className="text-white font-bold text-xs font-mono">
                            {cantidadEnCarrito}
                          </span>

                          <button
                            type="button"
                            onClick={() => modificarCantidad(prod, 1)}
                            className="w-7 h-7 rounded-lg bg-dark-700 text-white hover:bg-brand-yellow hover:text-black flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUBVISTA 2: COBRO POS */}
          {subvista === "cobro" && (
            <ModuloPagoPOS
              total={totalDulceria}
              subtotal={totalDulceria}
              socioActivo={socioActivo}
              onVolver={() => setSubvista("catalogo")}
              onConfirmarCobro={handleConfirmarCobro}
              procesando={procesandoCobro}
            />
          )}

          {/* SUBVISTA 3: TICKET TÉRMICO */}
          {subvista === "exito" && resultadoVenta && (
            <TicketTermicoPOS
              venta={resultadoVenta}
              onNuevaVenta={() => {
                setCarrito(new Map());
                setResultadoVenta(null);
                setSubvista("catalogo");
              }}
            />
          )}
        </main>

        {/* ASIDE LATERAL: PANEL DE PEDIDO EXCLUSIVO DE DULCERÍA */}
        <aside
          id="panel-venta"
          className="bg-dark-800 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16"
        >
          {listaItemsCarrito.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                <i className="fa-solid fa-bowl-food text-2xl text-amber-400"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nuevo Pedido</h3>
              <p className="text-slate-400 text-xs max-w-[15rem]">
                Agrega combos, popcorn o bebidas usando los botones &quot;+&quot; para iniciar la orden.
              </p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between p-5 min-h-0">
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Cabecera del Panel */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h3 className="font-bold text-white text-base">Pedido de Dulcería</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Confitería POS</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSolicitarCancelar}
                    className="text-xs text-slate-400 hover:text-brand-red border border-white/10 hover:border-brand-red/40 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    <i className="fa-solid fa-xmark mr-1"></i>
                    Cancelar
                  </button>
                </div>

                {/* Lista de Productos en Pedido */}
                <div className="space-y-2">
                  {listaItemsCarrito.map((item) => (
                    <div
                      key={item.id_producto}
                      className="flex items-center justify-between bg-dark-900/60 border border-white/5 rounded-xl p-2.5 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-white font-bold truncate">{item.nombre}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.cantidad} x S/ {item.precio_unitario.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-mono text-brand-yellow font-bold text-sm">
                          S/ {item.subtotal.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => modificarCantidad(item, -1)}
                          className="w-6 h-6 rounded bg-dark-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px]"
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales y Botón de Cobro */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Total Dulcería:
                  </span>
                  <span className="text-2xl font-black text-brand-yellow font-mono">
                    S/ {totalDulceria.toFixed(2)}
                  </span>
                </div>

                {subvista === "catalogo" && (
                  <button
                    type="button"
                    onClick={() => setSubvista("cobro")}
                    className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                  >
                    <span>Continuar al Cobro</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* MODAL 1: VINCULAR / AFILIAR SOCIO */}
      <ModalVincularSocio
        abierto={modalSocioAbierto}
        onCerrar={() => setModalSocioAbierto(false)}
        socioActivo={socioActivo}
        onSeleccionarSocio={(s) => {
          setSocioActivo(s);
          if (s) mostrarToast(`Socio vinculado: ${s.nombre_completo}`);
        }}
      />

      {/* MODAL 2: BÚSQUEDA Y CONTINGENCIA DE ÓRDENES */}
      <ModalBuscarOrden
        abierto={modalOrdenAbierto}
        onCerrar={() => setModalOrdenAbierto(false)}
        idSedeActual={idSede}
        onReimprimir={(ord) => setOrdenReimpresion(ord)}
        onMostrarToast={mostrarToast}
      />

      {/* MODAL 3: REIMPRESIÓN TÉRMICA */}
      {ordenReimpresion && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-md p-4">
            <TicketTermicoPOS
              venta={ordenReimpresion}
              esModalReimpresion={true}
              onCerrarModal={() => setOrdenReimpresion(null)}
            />
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRMAR SALIDA Y VACIAR CARRITO */}
      <ModalConfirmarSalidaCounter
        abierto={modalSalidaAbierto}
        mensajePersonalizado="Tienes productos de dulcería agregados al pedido. ¿Deseas vaciar el pedido y salir?"
        onCancelar={() => {
          setModalSalidaAbierto(false);
          setAccionSalidaPendiente(null);
        }}
        onConfirmar={() => {
          setModalSalidaAbierto(false);
          if (accionSalidaPendiente) {
            accionSalidaPendiente();
            setAccionSalidaPendiente(null);
          }
        }}
      />
    </div>
  );
}
