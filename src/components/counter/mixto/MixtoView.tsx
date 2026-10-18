"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import CounterHeader from "../comun/CounterHeader";
import ModuloPagoPOS from "../comun/ModuloPagoPOS";
import ModalVincularSocio from "../comun/ModalVincularSocio";
import ModalBuscarOrden from "../comun/ModalBuscarOrden";
import ModalConfirmarSalidaCounter from "../comun/ModalConfirmarSalidaCounter";
import TicketTermicoPOS from "../comun/TicketTermicoPOS";
import CarteleraFuncionesPOS from "../comun/CarteleraFuncionesPOS";
import ModalElegirTipoEntradaPOS from "../comun/ModalElegirTipoEntradaPOS";
import { obtenerIconoProducto } from "../dulceria/DulceriaView";
import { CounterService } from "@/src/services/counterService";
import type {
  SocioCounterDTO,
  ItemEntradaCounter,
  ItemProductoCounter,
  VentaCounterResultadoDTO,
  OrdenContingenciaDTO,
} from "@/src/dtos/counter";

export default function MixtoView() {
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
  const [subvista, setSubvista] = useState<"cartelera" | "asientos" | "dulceria" | "cobro" | "exito">("cartelera");
  const [ventaSoloDulceria, setVentaSoloDulceria] = useState<boolean>(false);
  // Sesion ID diferido en useEffect para evitar conflicto con SSR / Turbopack
  const [sesionId, setSesionId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        setSesionId(crypto.randomUUID());
      } else {
        setSesionId(
          "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          })
        );
      }
    }
  }, []);

  // Socio Activo
  const [socioActivo, setSocioActivo] = useState<SocioCounterDTO | null>(null);

  // Cartelera y Filtros
  const [cargandoFunciones, setCargandoFunciones] = useState<boolean>(true);
  const [funciones, setFunciones] = useState<any[]>([]);
  const [filtroDia, setFiltroDia] = useState<"hoy" | "manana">("hoy");

  // Función y Sala Seleccionada
  const [funcionSeleccionada, setFuncionSeleccionada] = useState<any | null>(null);
  const [salaInfo, setSalaInfo] = useState<any | null>(null);
  const [asientosSala, setAsientosSala] = useState<any[]>([]);
  const [tarifasDisponibles, setTarifasDisponibles] = useState<any[]>([]);
  const [cargandoSala, setCargandoSala] = useState<boolean>(false);

  // Agrupación estática de asientos por fila para conservar cuadrícula exacta
  const filasNombres = useMemo(() => {
    const setFilas = new Set<string>();
    asientosSala.forEach((a) => {
      if (a.fila) setFilas.add(a.fila);
    });
    return Array.from(setFilas).sort();
  }, [asientosSala]);

  const asientosPorFila = useMemo(() => {
    const map: Record<string, any[]> = {};
    filasNombres.forEach((f) => {
      map[f] = asientosSala
        .filter((a) => a.fila === f)
        .sort((a, b) => Number(a.columna) - Number(b.columna));
    });
    return map;
  }, [asientosSala, filasNombres]);

  // Entradas Seleccionadas
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState<ItemEntradaCounter[]>([]);

  // Modal para Elegir Tipo de Entrada al seleccionar un asiento
  const [asientoParaModalTipo, setAsientoParaModalTipo] = useState<any | null>(null);

  // Dulcería
  const [cargandoProductos, setCargandoProductos] = useState<boolean>(true);
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("todos");
  const [busquedaProducto, setBusquedaProducto] = useState<string>("");
  const [carritoDulceria, setCarritoDulceria] = useState<Map<string, ItemProductoCounter>>(new Map());

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

  // ── 3. Cargar Sedes ──
  useEffect(() => {
    CounterService.obtenerSedesActivas()
      .then((res) => {
        if (res && res.length > 0) setSedes(res);
      })
      .catch((e) => console.warn("Error al cargar sedes:", e));
  }, []);

  // ── 4. Cargar Funciones ──
  const cargarFuncionesSede = useCallback(async (sedeId: number, dia: "hoy" | "manana") => {
    setCargandoFunciones(true);
    try {
      const hoy = new Date();
      if (dia === "manana") {
        hoy.setDate(hoy.getDate() + 1);
      }
      const fechaIso = hoy.toISOString().split("T")[0];
      const data = await CounterService.obtenerFuncionesPorSedeYFecha(sedeId, fechaIso);
      setFunciones(data || []);
    } catch (err) {
      console.error("Error al cargar funciones:", err);
      setFunciones([]);
    } finally {
      setCargandoFunciones(false);
    }
  }, []);

  useEffect(() => {
    cargarFuncionesSede(idSede, filtroDia);
  }, [idSede, filtroDia, cargarFuncionesSede]);

  // ── 5. Cargar Dulcería ──
  const cargarDulceriaSede = useCallback(async (sedeId: number) => {
    setCargandoProductos(true);
    try {
      const res = await CounterService.obtenerProductosPorSede(sedeId);
      setProductos(res.productos || []);
      setCategorias(res.categorias || []);
    } catch (e) {
      console.error("Error al cargar catálogo de dulcería:", e);
      setProductos([]);
      setCategorias([]);
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  useEffect(() => {
    cargarDulceriaSede(idSede);
  }, [idSede, cargarDulceriaSede]);

  // ── 6. Cambio de Sede para Pruebas (con confirmación de salida) ──
  const handleCambiarSede = (nuevaSedeId: number) => {
    const tieneItems = entradasSeleccionadas.length > 0 || carritoDulceria.size > 0;
    if (tieneItems) {
      setAccionSalidaPendiente(() => () => {
        liberarYLimpiarVenta();
        setIdSede(nuevaSedeId);
      });
      setModalSalidaAbierto(true);
    } else {
      setIdSede(nuevaSedeId);
    }
  };

  // ── 7. Selección de Función e Ingreso a Sala ──
  const handleSeleccionarFuncion = async (fn: any) => {
    setVentaSoloDulceria(false);
    setFuncionSeleccionada(fn);
    setCargandoSala(true);
    setEntradasSeleccionadas([]);
    setSubvista("asientos");

    try {
      const mapa = await CounterService.obtenerMapaAsientos(fn.id_funcion);
      setSalaInfo(mapa.sala);
      setAsientosSala(mapa.asientos || []);
      setTarifasDisponibles(mapa.tarifas || []);
    } catch (e: any) {
      mostrarToast(`Error al cargar la sala: ${e.message}`);
      setSubvista("cartelera");
    } finally {
      setCargandoSala(false);
    }
  };

  // Selección y Bloqueo en Tiempo Real de Butacas
  const handleToggleAsiento = async (asiento: any) => {
    if (asiento.estado === "Ocupado" || asiento.en_mantenimiento) return;

    const estaOcupadoOtro =
      asiento.estado === "Bloqueado" && asiento.id_sesion_bloqueo !== sesionId;
    if (estaOcupadoOtro) {
      mostrarToast("El asiento se encuentra en selección por otro cliente.");
      return;
    }

    const yaSeleccionado = entradasSeleccionadas.some((e) => e.codigo_asiento === asiento.codigo);

    if (yaSeleccionado) {
      const item = entradasSeleccionadas.find((e) => e.codigo_asiento === asiento.codigo);
      if (item && item.id_asiento_funcion) {
        CounterService.liberarAsientoCounter(item.id_asiento_funcion, sesionId).catch(console.warn);
      }
      setEntradasSeleccionadas((prev) => prev.filter((e) => e.codigo_asiento !== asiento.codigo));
      setAsientosSala((prev) =>
        prev.map((a) => (a.codigo === asiento.codigo ? { ...a, estado: "Disponible", id_sesion_bloqueo: null } : a))
      );
    } else {
      // Abrir modal de selección de tipo de entrada (General, Niño, etc.)
      setAsientoParaModalTipo(asiento);
    }
  };

  const handleConfirmarAsientoConTipo = async (asiento: any, tipo: any) => {
    setAsientoParaModalTipo(null);
    const codigoAsiento = asiento.codigo;

    // 1. OPTIMISTIC UI: Pintar inmediatamente en rojo en la pantalla (0 ms)
    const entradaTemp: ItemEntradaCounter = {
      id_asiento_funcion: asiento.id_asiento_funcion || "",
      codigo_asiento: codigoAsiento,
      fila: asiento.fila,
      numero: asiento.columna,
      id_tipo_entrada: tipo.id_tipo_entrada || "1",
      tipo_nombre: tipo.nombre || "General",
      precio: Number(tipo.precio || 18.0),
    };

    setEntradasSeleccionadas((prev) => [...prev, entradaTemp]);
    setAsientosSala((prev) =>
      prev.map((a) =>
        a.codigo === codigoAsiento
          ? { ...a, estado: "Bloqueado", id_sesion_bloqueo: sesionId }
          : a
      )
    );

    // 2. Persistir bloqueo en Supabase concurrentemente en segundo plano
    try {
      const res = await CounterService.bloquearAsientoCounter(
        funcionSeleccionada.id_funcion,
        asiento.id_asiento,
        sesionId
      );

      // Sincronizar el id_asiento_funcion real y confirmado
      setEntradasSeleccionadas((prev) =>
        prev.map((e) =>
          e.codigo_asiento === codigoAsiento
            ? { ...e, id_asiento_funcion: res.id_asiento_funcion }
            : e
        )
      );
      setAsientosSala((prev) =>
        prev.map((a) =>
          a.codigo === codigoAsiento
            ? { ...a, id_asiento_funcion: res.id_asiento_funcion }
            : a
        )
      );
    } catch (err: any) {
      // Revertir optimistic update en caso de colisión o fallo
      setEntradasSeleccionadas((prev) => prev.filter((e) => e.codigo_asiento !== codigoAsiento));
      setAsientosSala((prev) =>
        prev.map((a) =>
          a.codigo === codigoAsiento
            ? { ...a, estado: "Disponible", id_sesion_bloqueo: null }
            : a
        )
      );
      mostrarToast(err.message || "El asiento no está disponible o fue tomado por otro usuario.");
    }
  };

  // ── 8. Control de Dulcería ──
  const modificarCantidadDulceria = (prod: any, delta: number) => {
    setCarritoDulceria((prev) => {
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
        });
      } else if (actual) {
        const nuevaCant = actual.cantidad + delta;
        if (nuevaCant <= 0) {
          nuevo.delete(prod.id_producto);
        } else {
          nuevo.set(prod.id_producto, {
            ...actual,
            cantidad: nuevaCant,
            subtotal: nuevaCant * precio,
          });
        }
      }
      return nuevo;
    });
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const cumpleCat =
        categoriaSeleccionada === "todos" ||
        p.id_categoria === categoriaSeleccionada ||
        p.categoria_nombre?.toLowerCase() === categoriaSeleccionada.toLowerCase();

      const cumpleBusq =
        !busquedaProducto.trim() ||
        p.nombre?.toLowerCase().includes(busquedaProducto.toLowerCase());

      return cumpleCat && cumpleBusq;
    });
  }, [productos, categoriaSeleccionada, busquedaProducto]);

  // ── 9. Flujo Especial: "Solo Dulcería" ──
  const handleIniciarSoloDulceria = () => {
    setVentaSoloDulceria(true);
    setFuncionSeleccionada(null);
    setEntradasSeleccionadas([]);
    setSubvista("dulceria");
  };

  // ── 10. Cancelación y Limpieza Segura ──
  const liberarYLimpiarVenta = async () => {
    try {
      await CounterService.liberarTodosLosBloqueosCounter(sesionId);
    } catch (e) {
      console.warn("Fallo al liberar bloqueos:", e);
    }
    setEntradasSeleccionadas([]);
    setCarritoDulceria(new Map());
    setFuncionSeleccionada(null);
    setVentaSoloDulceria(false);
    setSubvista("cartelera");
  };

  const handleSolicitarCancelarVenta = () => {
    const tieneItems = entradasSeleccionadas.length > 0 || carritoDulceria.size > 0;
    if (tieneItems) {
      setAccionSalidaPendiente(() => () => liberarYLimpiarVenta());
      setModalSalidaAbierto(true);
    } else {
      liberarYLimpiarVenta();
    }
  };

  // ── 11. Cálculos de Totales ──
  const subtotalEntradas = useMemo(() => {
    return entradasSeleccionadas.reduce((sum, e) => sum + Number(e.precio || 0), 0);
  }, [entradasSeleccionadas]);

  const itemsDulceriaArray = useMemo(() => {
    return Array.from(carritoDulceria.values());
  }, [carritoDulceria]);

  const subtotalDulceria = useMemo(() => {
    return itemsDulceriaArray.reduce((sum, p) => sum + Number(p.subtotal || 0), 0);
  }, [itemsDulceriaArray]);

  const totalVenta = subtotalEntradas + subtotalDulceria;

  // ── 12. Procesamiento del Cobro POS ──
  const handleProcesarCobro = async (datosPago: any) => {
    setProcesandoCobro(true);
    try {
      const resultado = await CounterService.procesarVentaCounter({
        modo: ventaSoloDulceria ? "dulceria" : "mixto",
        id_sede: idSede,
        socio: socioActivo,
        tipo_comprobante: datosPago.tipo_comprobante,
        numero_documento: datosPago.numero_documento,
        nombre_cliente: datosPago.nombre_cliente,
        metodo_pago: datosPago.metodo_pago,
        monto_recibido: datosPago.monto_recibido,
        id_funcion: funcionSeleccionada?.id_funcion,
        pelicula_titulo: funcionSeleccionada?.pelicula?.titulo,
        formato: funcionSeleccionada?.formato_proyeccion?.nombre,
        sala: funcionSeleccionada?.sala?.nombre_sala,
        hora: funcionSeleccionada?.hora_inicio,
        entradas: entradasSeleccionadas,
        productos: itemsDulceriaArray,
      });

      setResultadoVenta(resultado);
      setSubvista("exito");
      setEntradasSeleccionadas([]);
      setCarritoDulceria(new Map());
    } catch (err: any) {
      mostrarToast(err.message || "Error al procesar la venta en caja mixta.");
    } finally {
      setProcesandoCobro(false);
    }
  };

  const iniciarNuevaVenta = () => {
    setResultadoVenta(null);
    setFuncionSeleccionada(null);
    setEntradasSeleccionadas([]);
    setCarritoDulceria(new Map());
    setVentaSoloDulceria(false);
    setSubvista("cartelera");
    setSocioActivo(null);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col select-none">
      {/* Toast Notificación */}
      {toastMensaje && (
        <div className="fixed top-5 right-5 z-[150] bg-brand-red text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <i className="fa-solid fa-circle-exclamation text-lg"></i>
          <span className="text-sm font-semibold">{toastMensaje}</span>
        </div>
      )}

      {/* Cabecera Unificada Counter */}
      <CounterHeader
        modo="mixto"
        sedeActual={sedeActual}
        sedesDisponibles={sedes}
        onCambiarSede={handleCambiarSede}
        socioActivo={socioActivo}
        onAbrirModalSocio={() => setModalSocioAbierto(true)}
        onAbrirModalOrden={() => setModalOrdenAbierto(true)}
        onIniciarSoloDulceria={handleIniciarSoloDulceria}
        cajeroNombre="Marcos Caja Mixta"
      />

      {/* Layout Principal: Contenido (1fr) + Panel lateral combinado (380px) */}
      <div className="flex-1 lg:grid lg:grid-cols-[1fr_380px] pt-16">
        <main className="min-w-0">
          {/* SUBVISTA 1: CARTELERA DE FUNCIONES */}
          {subvista === "cartelera" && (
            <div id="cv-inicio" className="p-4 md:p-6 fade-in">
              <CarteleraFuncionesPOS
                funciones={funciones}
                cargando={cargandoFunciones}
                sedeNombre={sedeActual.nombre}
                filtroDia={filtroDia}
                onCambiarFiltroDia={(dia) => setFiltroDia(dia)}
                onSeleccionarFuncion={handleSeleccionarFuncion}
                funcionSeleccionadaId={funcionSeleccionada?.id_funcion}
              />
            </div>
          )}

          {/* SUBVISTA 2: SELECCIÓN DE BUTACAS */}
          {subvista === "asientos" && funcionSeleccionada && (
            <div className="p-4 md:p-6 fade-in">
              <div className="flex items-center justify-between gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleSolicitarCancelarVenta}
                  className="bg-[#0B1528] hover:bg-[#0E1A32] border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Volver a Cartelera</span>
                </button>

                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-extrabold text-white">
                    {funcionSeleccionada.pelicula?.titulo}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sala {salaInfo?.numero_sala || funcionSeleccionada.sala?.numero_sala || "1"} · {funcionSeleccionada.formato_proyeccion?.nombre || "2D"} ·{" "}
                    <span className="text-cyan-400 font-mono font-bold">
                      {funcionSeleccionada.hora_inicio?.substring(0, 5)}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={entradasSeleccionadas.length === 0}
                  onClick={() => setSubvista("dulceria")}
                  className="bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Continuar a Dulcería</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              {/* Matriz de Sala */}
              <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 shadow-xl text-center">
                {cargandoSala ? (
                  <div className="py-20 text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-cyan-400 mb-3"></i>
                    <p className="text-sm">Cargando sala y butacas...</p>
                  </div>
                ) : (
                  <div>
                    {/* Pantalla Curva del Cine */}
                    <div className="w-3/4 mx-auto mb-10 text-center">
                      <div className="h-2 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)]"></div>
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 block">
                        Pantalla
                      </span>
                    </div>

                    {/* Matriz Estática de Asientos agrupada por filas */}
                    <div className="overflow-x-auto py-2 mb-6 custom-scrollbar">
                      <div className="min-w-fit mx-auto flex flex-col items-center">
                        {filasNombres.map((filaNombre) => {
                          const butacasFila = asientosPorFila[filaNombre] || [];

                          return (
                            <div
                              key={filaNombre}
                              className="flex items-center justify-center gap-1.5 md:gap-2 mb-2 flex-nowrap"
                            >
                              {/* Letra de fila a la izquierda */}
                              <span className="w-5 md:w-6 text-center text-xs font-bold text-slate-500 font-mono select-none shrink-0">
                                {filaNombre}
                              </span>

                              {/* Butacas de esta fila */}
                              {butacasFila.map((asiento) => {
                                const estaEnCarrito = entradasSeleccionadas.some(
                                  (e) => e.codigo_asiento === asiento.codigo
                                );
                                const estaOcupado =
                                  asiento.estado === "Ocupado" ||
                                  (asiento.estado === "Bloqueado" &&
                                    asiento.id_sesion_bloqueo !== sesionId);

                                let claseColor =
                                  "bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer hover:scale-105";
                                if (estaEnCarrito) {
                                  // ROJO vibrante
                                  claseColor =
                                    "bg-[#DC2026] hover:bg-[#b91c1c] text-white font-black border-black/50 ring-2 ring-[#DC2026] shadow-[0_0_15px_rgba(220,32,38,0.7)] scale-105 cursor-pointer";
                                } else if (asiento.tipo?.toLowerCase() === "accesible") {
                                  claseColor =
                                    "bg-blue-600 hover:bg-blue-500 text-white border-black/50 cursor-pointer hover:scale-105";
                                } else if (estaOcupado) {
                                  claseColor =
                                    "bg-[#1f2937]/90 text-white/20 border-black/60 cursor-not-allowed";
                                }

                                return (
                                  <button
                                    key={asiento.codigo}
                                    type="button"
                                    disabled={estaOcupado}
                                    onClick={() => handleToggleAsiento(asiento)}
                                    title={`${asiento.codigo} ${
                                      estaOcupado
                                        ? "(Ocupado)"
                                        : estaEnCarrito
                                        ? "(Seleccionado)"
                                        : "(Disponible)"
                                    }`}
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/40 flex items-center justify-center text-[10px] md:text-xs font-mono font-bold transition-all shrink-0 ${claseColor}`}
                                  >
                                    {asiento.tipo?.toLowerCase() === "accesible" ? (
                                      <i className="fa-solid fa-wheelchair text-[10px]"></i>
                                    ) : (
                                      asiento.codigo
                                    )}
                                  </button>
                                );
                              })}

                              {/* Letra de fila a la derecha */}
                              <span className="w-5 md:w-6 text-center text-xs font-bold text-slate-500 font-mono select-none shrink-0">
                                {filaNombre}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Leyenda de Butacas */}
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-300 pt-5 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-emerald-600"></span>
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-[#DC2026] shadow-sm shadow-red-500/50"></span>
                        <span>Seleccionado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-[#1f2937] border border-black/60"></span>
                        <span>Ocupado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-blue-600"></span>
                        <span>Accesible</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBVISTA 3: DULCERÍA */}
          {subvista === "dulceria" && (
            <div id="cv-dulceria" className="p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  {!ventaSoloDulceria && (
                    <button
                      type="button"
                      onClick={() => setSubvista("asientos")}
                      className="bg-[#0B1528] hover:bg-[#0E1A32] border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      <span>Volver a Butacas</span>
                    </button>
                  )}
                  {ventaSoloDulceria && (
                    <button
                      type="button"
                      onClick={handleSolicitarCancelarVenta}
                      className="bg-[#0B1528] hover:bg-[#0E1A32] border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      <span>Ir a Cartelera</span>
                    </button>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold">Confitería y Snacks</h2>
                </div>

                <div className="relative flex-grow max-w-xs">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <input
                    type="text"
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full bg-[#0B1528] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setCategoriaSeleccionada("todos")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    categoriaSeleccionada === "todos"
                      ? "bg-[#0284C7] text-white border-cyan-500 shadow-md shadow-cyan-900/30"
                      : "bg-[#0B1528] text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Todos
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id_categoria}
                    type="button"
                    onClick={() => setCategoriaSeleccionada(cat.id_categoria)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      categoriaSeleccionada === cat.id_categoria
                        ? "bg-[#0284C7] text-white border-cyan-500 shadow-md shadow-cyan-900/30"
                        : "bg-[#0B1528] text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>

              {/* Grid de Productos */}
              {cargandoProductos ? (
                <div className="text-center py-20 text-slate-400">
                  <i className="fa-solid fa-spinner fa-spin text-3xl text-cyan-400 mb-3"></i>
                  <p className="text-sm">Cargando snacks y bebidas...</p>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div className="text-center py-16 bg-[#0B1528] border border-slate-800 rounded-2xl p-8">
                  <i className="fa-solid fa-cookie-bite text-slate-600 text-4xl mb-3"></i>
                  <p className="text-sm text-slate-400">No hay productos en esta categoría.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {productosFiltrados.map((prod) => {
                    const itemCarrito = carritoDulceria.get(prod.id_producto);
                    const cantidad = itemCarrito?.cantidad || 0;
                    const precio = Number(prod.precio_final || prod.precio_base || 0);
                    const { icono, colorIcono, bgGradiente } = obtenerIconoProducto(
                      prod.nombre,
                      prod.nombre_categoria
                    );

                    return (
                      <div
                        key={prod.id_producto}
                        className={`bg-[#0B1528] border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-md group ${
                          cantidad > 0
                            ? "border-cyan-500/80 bg-[#0B1528] shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40"
                            : "border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div>
                          {/* Espacio superior de la imagen: rectángulo a ancho completo con icono temático */}
                          <div
                            className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center bg-gradient-to-br ${bgGradiente} border relative mb-2.5 overflow-hidden transition-transform group-hover:scale-[1.02]`}
                          >
                            <i className={`${icono} ${colorIcono} text-4xl drop-shadow-md`}></i>
                            {cantidad > 0 && (
                              <span className="absolute top-2 right-2 bg-[#0284C7] text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                                {cantidad}
                              </span>
                            )}
                          </div>

                          {/* Nombre del producto debajo de la imagen */}
                          <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">
                            {prod.nombre}
                          </h3>

                          {/* Descripción breve debajo del nombre */}
                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 min-h-[30px]">
                            {prod.descripcion || "Snack fresco preparado al momento."}
                          </p>

                          {/* Precio debajo de la descripción */}
                          <p className="text-base font-extrabold text-cyan-400 font-mono mb-2">
                            S/ {precio.toFixed(2)}
                          </p>
                        </div>

                        {/* Botones de Cantidad + y - al fondo del card */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <span className="text-xs text-slate-400 font-medium">Cantidad:</span>

                          <div className="flex items-center gap-1.5 bg-[#070D18] border border-slate-800 rounded-lg p-1">
                            <button
                              type="button"
                              disabled={cantidad === 0}
                              onClick={() => modificarCantidadDulceria(prod, -1)}
                              className="w-7 h-7 rounded bg-[#0B1528] hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-[#0B1528] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono">
                              {cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => modificarCantidadDulceria(prod, 1)}
                              className="w-7 h-7 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUBVISTA 4: COBRO */}
          {subvista === "cobro" && (
            <div className="p-4 md:p-6 fade-in max-w-3xl mx-auto">
              <ModuloPagoPOS
                total={totalVenta}
                subtotal={totalVenta}
                socioActivo={socioActivo}
                onVolver={() => setSubvista(ventaSoloDulceria ? "dulceria" : "dulceria")}
                onConfirmarCobro={handleProcesarCobro}
                procesando={procesandoCobro}
              />
            </div>
          )}

          {/* SUBVISTA 5: ÉXITO */}
          {subvista === "exito" && resultadoVenta && (
            <div className="p-4 md:p-6 fade-in max-w-xl mx-auto">
              <TicketTermicoPOS venta={resultadoVenta} onNuevaVenta={iniciarNuevaVenta} />
            </div>
          )}
        </main>

        {/* ── PANEL LATERAL DERECHO: Carrito Combinado POS ── */}
        <aside className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0B1528] flex flex-col p-4 md:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-cash-register text-cyan-400"></i>
              <span>Venta en Caja Mixta</span>
            </h2>
            {(entradasSeleccionadas.length > 0 || itemsDulceriaArray.length > 0) &&
              subvista !== "cobro" &&
              subvista !== "exito" && (
                <button
                  type="button"
                  onClick={handleSolicitarCancelarVenta}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar Venta
                </button>
              )}
          </div>

          {/* Detalle Combinado */}
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {entradasSeleccionadas.length === 0 && itemsDulceriaArray.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <i className="fa-solid fa-cart-shopping text-3xl mb-2 opacity-30 block"></i>
                Elige una función y asientos a la izquierda, o usa el atajo &quot;Solo dulcería&quot;.
              </div>
            ) : (
              <>
                {/* Entradas */}
                {entradasSeleccionadas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Entradas ({entradasSeleccionadas.length})
                    </p>
                    {entradasSeleccionadas.map((e) => (
                      <div
                        key={e.codigo_asiento}
                        className="flex items-center justify-between bg-[#070D18] border border-slate-800/80 rounded-xl p-3 text-xs"
                      >
                        <div>
                          <span className="font-extrabold text-white font-mono block">
                            Butaca {e.codigo_asiento}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {e.tipo_nombre}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-white font-mono">
                            S/ {Number(e.precio).toFixed(2)}
                          </span>
                          {subvista === "asientos" && (
                            <button
                              type="button"
                              onClick={() => handleToggleAsiento({ codigo: e.codigo_asiento })}
                              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dulcería */}
                {itemsDulceriaArray.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Dulcería ({itemsDulceriaArray.length})
                    </p>
                    {itemsDulceriaArray.map((p) => (
                      <div
                        key={p.id_producto}
                        className="flex items-center justify-between bg-[#070D18] border border-slate-800/80 rounded-xl p-3 text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-white block truncate">{p.nombre}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {p.cantidad} x S/ {Number(p.precio_unitario).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white font-mono">
                            S/ {Number(p.subtotal).toFixed(2)}
                          </span>
                          {subvista === "dulceria" && (
                            <button
                              type="button"
                              onClick={() => modificarCantidadDulceria(p, -p.cantidad)}
                              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Totales y Botones de Avance */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {entradasSeleccionadas.length > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Subtotal Cine:</span>
                <span className="font-mono font-bold text-white">S/ {subtotalEntradas.toFixed(2)}</span>
              </div>
            )}
            {itemsDulceriaArray.length > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Subtotal Dulcería:</span>
                <span className="font-mono font-bold text-white">S/ {subtotalDulceria.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-base font-extrabold pt-2 border-t border-slate-800/60">
              <span className="text-white">TOTAL A COBRAR:</span>
              <span className="text-2xl text-cyan-400 font-mono">S/ {totalVenta.toFixed(2)}</span>
            </div>

            {/* Botones según la subvistas */}
            {subvista === "asientos" && (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={entradasSeleccionadas.length === 0}
                  onClick={() => setSubvista("dulceria")}
                  className="w-full bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-slate-800 disabled:text-slate-600 text-white py-3 rounded-xl font-bold text-xs md:text-sm transition-all shadow-md shadow-cyan-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Continuar a Dulcería</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button
                  type="button"
                  disabled={entradasSeleccionadas.length === 0}
                  onClick={() => setSubvista("cobro")}
                  className="w-full bg-[#070D18] hover:bg-slate-800 border border-slate-700 text-slate-300 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span>Saltar directo a Pago</span>
                  <i className="fa-solid fa-bolt text-amber-400"></i>
                </button>
              </div>
            )}

            {subvista === "dulceria" && (
              <button
                type="button"
                disabled={totalVenta === 0}
                onClick={() => setSubvista("cobro")}
                className="w-full bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-slate-800 disabled:text-slate-600 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Proceder al Cobro</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── MODALES COMPARTIDOS ── */}
      {/* MODAL 1: ELEGIR TIPO DE ENTRADA AL CLICAR BUTACA */}
      <ModalElegirTipoEntradaPOS
        asiento={asientoParaModalTipo}
        tarifas={tarifasDisponibles}
        onConfirmar={handleConfirmarAsientoConTipo}
        onCerrar={() => setAsientoParaModalTipo(null)}
      />

      {/* MODAL 2: VINCULACIÓN Y REGISTRO DE SOCIO */}
      <ModalVincularSocio
        abierto={modalSocioAbierto}
        onCerrar={() => setModalSocioAbierto(false)}
        socioActivo={socioActivo}
        onSeleccionarSocio={(socio: SocioCounterDTO | null) => {
          setSocioActivo(socio);
          if (socio) mostrarToast(`Socio ${socio.nombre_completo} vinculado.`);
        }}
      />

      {/* MODAL 3: BÚSQUEDA Y CONTINGENCIA DE ÓRDENES */}
      <ModalBuscarOrden
        abierto={modalOrdenAbierto}
        onCerrar={() => setModalOrdenAbierto(false)}
        idSedeActual={idSede}
        onReimprimir={(ord) => setOrdenReimpresion(ord)}
        onMostrarToast={mostrarToast}
      />

      {/* MODAL 4: REIMPRESIÓN TÉRMICA */}
      {ordenReimpresion && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1528] border border-slate-700/80 rounded-2xl w-full max-w-md p-4">
            <TicketTermicoPOS
              venta={ordenReimpresion}
              esModalReimpresion={true}
              onCerrarModal={() => setOrdenReimpresion(null)}
            />
          </div>
        </div>
      )}

      {/* MODAL 5: CONFIRMAR SALIDA Y LIBERAR TODO */}
      <ModalConfirmarSalidaCounter
        abierto={modalSalidaAbierto}
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
