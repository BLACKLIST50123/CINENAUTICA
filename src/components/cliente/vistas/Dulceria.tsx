"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DulceriaService } from "@/src/services/dulceriaService";
import type { CategoriaProductoDTO, ProductoDTO, ItemPedidoDulceriaDTO } from "@/src/dtos/producto";
import { SEL, S, intentarSalirDelFlujoDeCompra, limpiarEstadoCompraGlobal } from "@/src/lib/ui/nav";
import { mostrarToast } from "@/src/lib/ui/common";
import { DulceriaCardSkeleton, SkeletonBase } from "@/src/components/comun/skeletons";

export default function Dulceria() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sedeParam = searchParams.get("sede");

  // ── 1. Estados de Datos y Carga ──
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CategoriaProductoDTO[]>([]);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("all");

  // ── 2. Estado del Pedido de Dulcería ──
  // Mapa de id_producto -> cantidad
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  // ── 3. Datos del Contexto de Compra ──
  const [idSede, setIdSede] = useState<number>(1);
  const [nombreSede, setNombreSede] = useState<string>("CineNáutica Chimbote");
  const [esFlujoDirecto, setEsFlujoDirecto] = useState<boolean>(false);
  const [datosFuncion, setDatosFuncion] = useState<any>(null);
  const [asientosComprados, setAsientosComprados] = useState<any[]>([]);
  const [totalEntradas, setTotalEntradas] = useState<number>(0);

  // Inicializar contexto de sede y compra (desde sesión o SEL)
  useEffect(() => {
    let sedeId = 1;
    let sedeNom = "CineNáutica Chimbote";

    // Verificar si es dulcería directa
    const directo =
      Boolean(S.dulceria) ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem("cinenautica_flujo_dulceria_directo") === "true");
    setEsFlujoDirecto(directo);

    if (directo) {
      // En compra directa de dulcería, aislar y limpiar películas/asientos anteriores
      setDatosFuncion(null);
      setAsientosComprados([]);
      setTotalEntradas(0);
      try {
        sessionStorage.removeItem("cinenautica_seleccion_funcion");
        sessionStorage.removeItem("cinenautica_asientos_seleccionados");

        const sid =
          sedeParam ||
          sessionStorage.getItem("cinenautica_sede_id") ||
          SEL.sede;
        if (sid) {
          const match = String(sid).match(/\d+/);
          if (match) sedeId = Number(match[0]);
        }
        const sNom =
          sessionStorage.getItem("cinenautica_sede_nombre") || SEL.nombre_sede;
        if (sNom) sedeNom = sNom;
      } catch {}
    } else {
      // 1. Obtener datos de función y asientos si viene del flujo de películas
      try {
        const rawFuncion = sessionStorage.getItem("cinenautica_seleccion_funcion");
        if (rawFuncion) {
          const fn = JSON.parse(rawFuncion);
          setDatosFuncion(fn);
          if (fn.id_sede) {
            sedeId = Number(fn.id_sede);
            sedeNom = fn.nombre_sede || sedeNom;
          }
        } else if (SEL.id_sede) {
          sedeId = Number(SEL.id_sede);
          sedeNom = SEL.nombre_sede || sedeNom;
        }

        const rawAsientos = sessionStorage.getItem("cinenautica_asientos_seleccionados");
        if (rawAsientos) {
          const as = JSON.parse(rawAsientos);
          if (Array.isArray(as.asientos)) {
            setAsientosComprados(as.asientos);
            setTotalEntradas(Number(as.total) || 0);
          }
        }
      } catch {}
    }

    setIdSede(sedeId);
    setNombreSede(sedeNom);

    // Cargar catálogo de dulcería desde Supabase para esta sede
    setCargando(true);
    DulceriaService.obtenerCatalogo(sedeId)
      .then((catalogo) => {
        setCategorias(catalogo.categorias);
        setProductos(catalogo.productos);

        // Restaurar cantidades previas de sessionStorage si existen
        try {
          const rawDulces = sessionStorage.getItem("cinenautica_dulceria_seleccion");
          if (rawDulces) {
            const parsed = JSON.parse(rawDulces);
            if (Array.isArray(parsed.items)) {
              const prevCant: Record<string, number> = {};
              parsed.items.forEach((it: any) => {
                prevCant[it.id_producto] = Number(it.cantidad) || 0;
              });
              setCantidades(prevCant);
            }
          }
        } catch {}
      })
      .catch((err) => {
        console.error("Error al cargar catálogo de dulcería:", err);
        setErrorCarga("No se pudo cargar el catálogo de dulcería de la sede.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // Modificar cantidad de un producto
  const modificarCantidad = (idProducto: string, delta: number) => {
    const prod = productos.find((p) => p.id_producto === idProducto);
    if (!prod) return;

    setCantidades((prev) => {
      const actual = prev[idProducto] || 0;
      const nuevo = Math.max(0, actual + delta);

      // Validar contra stock
      if (nuevo > prod.stock) {
        mostrarToast(`Stock máximo disponible alcanzado (${prod.stock} unids).`, "info");
        return prev;
      }

      const copia = { ...prev };
      if (nuevo === 0) {
        delete copia[idProducto];
      } else {
        copia[idProducto] = nuevo;
      }
      return copia;
    });
  };

  // Productos filtrados por la categoría seleccionada
  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === "all") return productos;
    return productos.filter((p) => p.id_categoria === categoriaActiva);
  }, [productos, categoriaActiva]);

  // Items del pedido con sus cálculos de subtotal
  const itemsPedido = useMemo<ItemPedidoDulceriaDTO[]>(() => {
    const resultado: ItemPedidoDulceriaDTO[] = [];

    Object.entries(cantidades).forEach(([idProd, cant]) => {
      if (cant <= 0) return;
      const prod = productos.find((p) => p.id_producto === idProd);
      if (!prod) return;

      resultado.push({
        id_producto: prod.id_producto,
        nombre: prod.nombre,
        precio_unitario: prod.precio_final,
        cantidad: cant,
        subtotal: prod.precio_final * cant,
        url_imagen: prod.url_imagen,
        descripcion: prod.descripcion,
      });
    });

    return resultado;
  }, [cantidades, productos]);

  // Resumen calculado mediante el servicio de negocio
  const resumenPedido = useMemo(() => {
    return DulceriaService.calcularTotalesPedido(itemsPedido);
  }, [itemsPedido]);

  // Total combinado (Entradas + Dulcería)
  const totalGeneral = useMemo(() => {
    return (esFlujoDirecto ? 0 : totalEntradas) + resumenPedido.total_importe;
  }, [esFlujoDirecto, totalEntradas, resumenPedido.total_importe]);

  // Sincronizar estado global de compra activa con la dulcería
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tieneProductos = resumenPedido.total_productos > 0;
    (window as any).__tieneProductosDulceriaSeleccionados = tieneProductos;

    if (tieneProductos) {
      const payload = {
        id_sede: idSede,
        items: itemsPedido,
        total_productos: resumenPedido.total_productos,
        total_importe: resumenPedido.total_importe,
      };
      try {
        sessionStorage.setItem("cinenautica_dulceria_seleccion", JSON.stringify(payload));
      } catch {}
      SEL.dulces = itemsPedido;
      SEL.total_dulces = resumenPedido.total_importe;
    } else {
      try {
        sessionStorage.removeItem("cinenautica_dulceria_seleccion");
      } catch {}
      SEL.dulces = [];
      SEL.total_dulces = 0;
    }
  }, [resumenPedido.total_productos, itemsPedido, idSede]);

  // Interceptar botón atrás del navegador si es flujo directo y tiene productos agregados
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (esFlujoDirecto && resumenPedido.total_productos > 0) {
      window.history.pushState({ cinenauticaDulceria: true }, "", window.location.href);
    }

    function manejarPopState() {
      if (esFlujoDirecto && (resumenPedido.total_productos > 0 || (window as any).__tieneProductosDulceriaSeleccionados)) {
        intentarSalirDelFlujoDeCompra(() => {
          limpiarEstadoCompraGlobal();
          router.push("/");
        });
      }
    }

    window.addEventListener("popstate", manejarPopState);
    return () => {
      window.removeEventListener("popstate", manejarPopState);
    };
  }, [esFlujoDirecto, resumenPedido.total_productos, router]);

  // Escuchar cuando se limpia la compra desde el modal de confirmación o navbar
  useEffect(() => {
    function onLimpiar() {
      setCantidades({});
    }
    window.addEventListener("cambio-flujo-compra", onLimpiar);
    return () => {
      window.removeEventListener("cambio-flujo-compra", onLimpiar);
    };
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__tieneProductosDulceriaSeleccionados = false;
      }
    };
  }, []);

  // Continuar al paso de pago
  const continuarAPago = () => {
    // Si es dulcería directa, exige al menos 1 producto
    if (esFlujoDirecto && resumenPedido.total_productos === 0) {
      mostrarToast("Selecciona al menos un producto de la dulcería para continuar.", "info");
      return;
    }

    // Si es dulcería directa, persistir flag para las vistas siguientes
    if (esFlujoDirecto) {
      try {
        sessionStorage.setItem("cinenautica_flujo_dulceria_directo", "true");
        sessionStorage.removeItem("cinenautica_seleccion_funcion");
        sessionStorage.removeItem("cinenautica_asientos_seleccionados");
      } catch {}
    }

    // Guardar selección en sessionStorage y en objeto global SEL
    const payload = {
      id_sede: idSede,
      items: itemsPedido,
      total_productos: resumenPedido.total_productos,
      total_importe: resumenPedido.total_importe,
    };

    try {
      sessionStorage.setItem("cinenautica_dulceria_seleccion", JSON.stringify(payload));
    } catch {}

    SEL.dulces = itemsPedido;
    SEL.total_dulces = resumenPedido.total_importe;

    router.push("/pago");
  };

  // Volver atrás
  const manejarVolver = () => {
    if (esFlujoDirecto) {
      if (resumenPedido.total_productos > 0) {
        intentarSalirDelFlujoDeCompra(() => {
          limpiarEstadoCompraGlobal();
          router.push("/");
        });
      } else {
        limpiarEstadoCompraGlobal();
        router.push("/");
      }
    } else {
      router.push(SEL.id_funcion ? `/asientos?funcion=${SEL.id_funcion}` : "/asientos");
    }
  };

  // Helper para renderizar ícono o imagen del producto
  const renderVisualProducto = (urlImagen: string) => {
    if (urlImagen.startsWith("http://") || urlImagen.startsWith("https://") || urlImagen.startsWith("/")) {
      return (
        <img
          alt="Producto"
          className="w-full h-full object-cover rounded-xl"
          src={urlImagen}
        />
      );
    }

    // Clase FontAwesome
    const faIcon = urlImagen.startsWith("fa-") ? urlImagen : "fa-bowl-food";
    return (
      <div className="w-full h-full bg-gradient-to-br from-brand-yellow/15 to-brand-blue/15 flex items-center justify-center text-brand-yellow text-3xl group-hover:scale-110 transition-transform duration-300">
        <i className={`fa-solid ${faIcon}`}></i>
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pb-40 pt-36">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Skeleton Catálogo */}
          <div className="w-full lg:w-2/3">
            <SkeletonBase className="h-4 w-32 rounded mb-6" />
            <div className="flex items-center gap-3 mb-8">
              <SkeletonBase className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2">
                <SkeletonBase className="h-7 w-48 rounded" />
                <SkeletonBase className="h-4 w-32 rounded" />
              </div>
            </div>
            {/* Categorías tabs skeleton */}
            <div className="flex gap-3 mb-8 border-b border-white/10 pb-3">
              <SkeletonBase className="h-8 w-24 rounded-lg" />
              <SkeletonBase className="h-8 w-28 rounded-lg" />
              <SkeletonBase className="h-8 w-24 rounded-lg" />
              <SkeletonBase className="h-8 w-28 rounded-lg" />
            </div>
            {/* Grid de productos skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <DulceriaCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Columna Derecha: Skeleton Resumen de Pedido */}
          <div className="w-full lg:w-1/3">
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
              <SkeletonBase className="h-6 w-40 rounded" />
              <SkeletonBase className="h-20 w-full rounded-xl" />
              <div className="pt-4 border-t border-white/5 space-y-2">
                <SkeletonBase className="h-4 w-full rounded" />
                <SkeletonBase className="h-4 w-3/4 rounded" />
              </div>
              <SkeletonBase className="h-12 w-full rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 md:px-12 max-w-[1200px] mx-auto text-white text-center">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg mx-auto">
          <i className="fa-solid fa-triangle-exclamation text-brand-yellow text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Atención</h2>
          <p className="text-slate-400 mb-6">{errorCarga}</p>
          <button
            className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-3 rounded-full font-bold transition-colors"
            onClick={() => router.push("/")}
          >
            Volver a Cartelera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-900 min-h-screen pb-40 pt-36" id="vista-dulceria">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row gap-8">
        
        {/* ── COLUMNA IZQUIERDA: Catálogo de Productos y Categorías ── */}
        <div className="w-full lg:w-2/3">
          
          {/* Botón de retroceso contextual */}
          <button
            className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm cursor-pointer"
            id="btn-volver-asientos-dulceria"
            onClick={manejarVolver}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>{esFlujoDirecto ? "Volver al Inicio" : "Volver a Asientos"}</span>
          </button>

          {/* Encabezado de la Dulcería */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-900/20">
                <i className="fa-solid fa-bowl-food text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  Dulcería Náutica
                </h1>
                <p className="text-slate-400 text-xs md:text-sm mt-0.5 flex items-center gap-1.5 font-medium">
                  <i className="fa-solid fa-location-dot text-cyan-400"></i>
                  <span>{nombreSede}</span>
                  {esFlujoDirecto && (
                    <span className="bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded text-[10px] font-bold border border-brand-blue/30 ml-1">
                      Compra directa
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Filtro de Categorías con Scroll Horizontal Suave */}
          <div
            className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 border-b border-white/10 pb-2"
            id="categorias-dulceria"
          >
            <button
              className={`px-4 py-2 font-bold text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                categoriaActiva === "all"
                  ? "text-cyan-400 border-cyan-400 scale-105"
                  : "text-slate-400 hover:text-white border-transparent"
              }`}
              onClick={() => setCategoriaActiva("all")}
            >
              Todos los productos ({productos.length})
            </button>

            {categorias.map((cat) => {
              const cantidadEnCat = productos.filter((p) => p.id_categoria === cat.id_categoria).length;
              const activo = categoriaActiva === cat.id_categoria;

              return (
                <button
                  key={cat.id_categoria}
                  className={`px-4 py-2 font-bold text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    activo
                      ? "text-cyan-400 border-cyan-400 scale-105"
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                  onClick={() => setCategoriaActiva(cat.id_categoria)}
                >
                  {cat.nombre} ({cantidadEnCat})
                </button>
              );
            })}
          </div>

          {/* Grid de Productos */}
          {productosFiltrados.length === 0 ? (
            <div className="bg-dark-800/50 p-12 rounded-2xl border border-white/5 text-center text-slate-500 py-16">
              <i className="fa-solid fa-box-open text-4xl mb-3 opacity-40"></i>
              <p className="text-base font-semibold text-slate-300">
                No hay productos disponibles en esta categoría.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Selecciona otra categoría o explora "Todos los productos".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="grid-productos">
              {productosFiltrados.map((prod) => {
                const cantidadActual = cantidades[prod.id_producto] || 0;
                const sinStock = prod.stock <= 0;

                return (
                  <div
                    key={prod.id_producto}
                    className={`bg-dark-800 rounded-2xl border transition-all duration-300 p-4 flex gap-4 shadow-xl group hover:border-white/20 relative overflow-hidden ${
                      cantidadActual > 0
                        ? "border-cyan-500/50 bg-dark-800/90 ring-1 ring-cyan-500/30"
                        : "border-white/5"
                    }`}
                  >
                    {/* Badge de Stock Crítico */}
                    {prod.stock > 0 && prod.stock <= 10 && (
                      <span className="absolute top-2 right-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Últimas {prod.stock} unids
                      </span>
                    )}

                    {/* Imagen o Ícono del Producto */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-dark-900 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/5">
                      {renderVisualProducto(prod.url_imagen)}
                    </div>

                    {/* Información del Producto */}
                    <div className="flex-grow flex flex-col justify-between min-w-0">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
                          {prod.nombre_categoria}
                        </span>
                        <h3 className="text-white font-bold text-base leading-tight mt-0.5 truncate group-hover:text-cyan-400 transition-colors">
                          {prod.nombre}
                        </h3>
                        <p className="text-slate-400 text-xs leading-snug line-clamp-2 mt-1">
                          {prod.descripcion}
                        </p>
                      </div>

                      {/* Precio y Controles de Cantidad */}
                      <div className="flex justify-between items-end mt-3 pt-2 border-t border-white/5">
                        <div>
                          <span className="text-xs text-slate-400 block font-normal leading-none">
                            Precio unitario:
                          </span>
                          <span className="font-black text-white text-lg">
                            S/ {prod.precio_final.toFixed(2)}
                          </span>
                        </div>

                        {sinStock ? (
                          <span className="text-brand-red text-xs font-bold bg-brand-red/10 border border-brand-red/20 px-3 py-1.5 rounded-lg">
                            Agotado
                          </span>
                        ) : (
                          <div className="flex items-center gap-2.5 bg-dark-900 rounded-full px-2.5 py-1.5 border border-white/10 shadow-inner">
                            <button
                              aria-label={`Disminuir ${prod.nombre}`}
                              className="w-7 h-7 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-red disabled:opacity-30 disabled:hover:bg-dark-700 transition-colors cursor-pointer"
                              disabled={cantidadActual === 0}
                              type="button"
                              onClick={() => modificarCantidad(prod.id_producto, -1)}
                            >
                              <i className="fa-solid fa-minus text-xs"></i>
                            </button>

                            <span className="text-white font-extrabold text-sm w-5 text-center select-none">
                              {cantidadActual}
                            </span>

                            <button
                              aria-label={`Aumentar ${prod.nombre}`}
                              className="w-7 h-7 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-[#0284C7] hover:text-white disabled:opacity-30 disabled:hover:bg-dark-700 disabled:hover:text-white transition-colors cursor-pointer"
                              disabled={cantidadActual >= prod.stock}
                              type="button"
                              onClick={() => modificarCantidad(prod.id_producto, 1)}
                            >
                              <i className="fa-solid fa-plus text-xs"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: Resumen de Pedido y Checkout ── */}
        <div className="w-full lg:w-1/3">
          <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 sticky top-28 shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="border-b border-white/10 pb-4 mb-4">
              <h2 className="text-xl font-bold text-white flex items-center justify-between">
                <span>Tu Pedido Final</span>
                <span className="text-xs bg-white/5 text-slate-400 font-semibold px-2.5 py-1 rounded-full">
                  {resumenPedido.total_productos} snacks
                </span>
              </h2>
            </div>

            <div className="overflow-y-auto hide-scrollbar flex-grow pr-1 space-y-4">
              
              {/* Sección Entradas de Cine (si corresponde al flujo de película) */}
              {!esFlujoDirecto && (
                <div className="bg-dark-900/60 p-4 rounded-xl border border-white/5" id="bloque-entradas-resumen-dulceria">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-ticket"></i>
                      <span>Entradas de Cine</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">
                      {asientosComprados.length} butacas
                    </span>
                  </div>

                  {datosFuncion && (
                    <div className="mb-2 text-xs text-slate-300">
                      <p className="font-bold text-white truncate">{datosFuncion.titulo}</p>
                      <p className="text-[11px] text-slate-400">
                        {datosFuncion.dia_label || datosFuncion.fecha} • {datosFuncion.hora} • {datosFuncion.formato}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-white/5" id="lista-final-asientos">
                    {asientosComprados.map((item: any) => (
                      <div key={item.id_asiento || item.codigo} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-[#DC2026]/20 border border-[#DC2026]/40 text-[#DC2026] rounded flex items-center justify-center font-bold text-[10px]">
                            {item.codigo}
                          </span>
                          <span>{item.nombre_tipo_entrada || "General"}</span>
                        </span>
                        <span className="text-white font-semibold">
                          S/ {Number(item.precio || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección Dulcería Seleccionada */}
              <div className="bg-dark-900/60 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-bowl-food"></i>
                    <span>Productos Dulcería</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">
                    {resumenPedido.total_productos} items
                  </span>
                </div>

                <div className="space-y-2.5" id="lista-final-dulces">
                  {itemsPedido.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                      <i className="fa-solid fa-basket-shopping text-2xl mb-1.5 block opacity-40"></i>
                      Aún no has agregado productos a tu orden.
                    </div>
                  ) : (
                    itemsPedido.map((item) => (
                      <div
                        key={item.id_producto}
                        className="flex justify-between items-center text-xs bg-dark-950/40 p-2 rounded-lg border border-white/5"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-white font-semibold truncate leading-tight">
                            <span className="text-cyan-400 font-black mr-1">
                              {item.cantidad}x
                            </span>
                            {item.nombre}
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            S/ {item.precio_unitario.toFixed(2)} c/u
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold whitespace-nowrap">
                            S/ {item.subtotal.toFixed(2)}
                          </span>
                          <button
                            aria-label={`Eliminar ${item.nombre}`}
                            className="text-slate-500 hover:text-brand-red p-1 transition-colors"
                            type="button"
                            onClick={() => modificarCantidad(item.id_producto, -item.cantidad)}
                          >
                            <i className="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Totales y Botón de Pago */}
            <div className="border-t border-brand-blue/30 pt-4 mt-4">
              
              {!esFlujoDirecto && (
                <div className="flex justify-between items-center mb-1 text-xs" id="fila-total-entradas-dulceria">
                  <span className="text-slate-400">Total Entradas ({asientosComprados.length}):</span>
                  <span className="text-white font-bold" id="total-entradas">
                    S/ {totalEntradas.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center mb-4 text-xs">
                <span className="text-slate-400">Total Dulcería ({resumenPedido.total_productos}):</span>
                <span className="text-white font-bold" id="total-dulces">
                  S/ {resumenPedido.total_importe.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-dark-900 p-4 rounded-xl border border-white/5 shadow-inner">
                <span className="text-slate-300 font-bold text-sm">
                  TOTAL A PAGAR:
                </span>
                <span className="text-2xl md:text-3xl font-black text-cyan-400" id="total-general-dulceria">
                  S/ {totalGeneral.toFixed(2)}
                </span>
              </div>

              <button
                className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white py-4 rounded-xl font-black transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base shadow-xl shadow-cyan-900/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={esFlujoDirecto && resumenPedido.total_productos === 0}
                onClick={continuarAPago}
              >
                <span>
                  {esFlujoDirecto
                    ? "Continuar al Pago"
                    : resumenPedido.total_productos === 0
                    ? "Continuar sin Dulcería"
                    : "Continuar al Pago"}
                </span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
