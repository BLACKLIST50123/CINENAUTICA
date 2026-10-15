"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import CounterHeader from "../comun/CounterHeader";
import ModuloPagoPOS from "../comun/ModuloPagoPOS";
import ModalVincularSocio from "../comun/ModalVincularSocio";
import ModalBuscarOrden from "../comun/ModalBuscarOrden";
import ModalConfirmarSalidaCounter from "../comun/ModalConfirmarSalidaCounter";
import TicketTermicoPOS from "../comun/TicketTermicoPOS";
import { CounterService } from "@/src/services/counterService";
import type {
  SocioCounterDTO,
  ItemEntradaCounter,
  VentaCounterResultadoDTO,
  OrdenContingenciaDTO,
} from "@/src/dtos/counter";

export default function BoleteriaView() {
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
  const [subvista, setSubvista] = useState<"cartelera" | "asientos" | "cobro" | "exito">("cartelera");
  const [sesionId] = useState<string>(() => `pos_bol_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);

  // Socio Activo
  const [socioActivo, setSocioActivo] = useState<SocioCounterDTO | null>(null);

  // Cartelera y Filtros
  const [cargandoFunciones, setCargandoFunciones] = useState<boolean>(true);
  const [funciones, setFunciones] = useState<any[]>([]);
  const [filtroDia, setFiltroDia] = useState<"hoy" | "manana">("hoy");
  const [filtroFormato, setFiltroFormato] = useState<string>("Todos");
  const [busquedaPeli, setBusquedaPeli] = useState<string>("");
  const [modoAgrupacion, setModoAgrupacion] = useState<"peli" | "hora">("peli");

  // Función y Sala Seleccionada
  const [funcionSeleccionada, setFuncionSeleccionada] = useState<any | null>(null);
  const [salaInfo, setSalaInfo] = useState<any | null>(null);
  const [asientosSala, setAsientosSala] = useState<any[]>([]);
  const [tarifasDisponibles, setTarifasDisponibles] = useState<any[]>([]);
  const [tarifaSeleccionadaId, setTarifaSeleccionadaId] = useState<string>("");
  const [cargandoSala, setCargandoSala] = useState<boolean>(false);

  // Carrito de Entradas
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState<ItemEntradaCounter[]>([]);

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

  // ── 3. Cargar Sedes y Funciones ──
  useEffect(() => {
    CounterService.obtenerSedesActivas()
      .then((res) => {
        if (res && res.length > 0) setSedes(res);
      })
      .catch((e) => console.warn("Error al cargar sedes:", e));
  }, []);

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

  // ── 4. Cambio de Sede para Pruebas (con confirmación si hay selección) ──
  const handleCambiarSede = (nuevaSedeId: number) => {
    if (entradasSeleccionadas.length > 0) {
      setAccionSalidaPendiente(() => () => {
        liberarYLimpiarVenta();
        setIdSede(nuevaSedeId);
      });
      setModalSalidaAbierto(true);
    } else {
      setIdSede(nuevaSedeId);
    }
  };

  // ── 5. Selección de Función e Ingreso a Matriz de Sala ──
  const handleSeleccionarFuncion = async (fn: any) => {
    setFuncionSeleccionada(fn);
    setCargandoSala(true);
    setEntradasSeleccionadas([]);
    setSubvista("asientos");

    try {
      const mapa = await CounterService.obtenerMapaAsientos(fn.id_funcion);
      setSalaInfo(mapa.sala);
      setAsientosSala(mapa.asientos || []);
      setTarifasDisponibles(mapa.tarifas || []);
      if (mapa.tarifas && mapa.tarifas.length > 0) {
        setTarifaSeleccionadaId(mapa.tarifas[0].id_tipo_entrada || "");
      }
    } catch (e: any) {
      mostrarToast(`Error al cargar la sala: ${e.message}`);
      setSubvista("cartelera");
    } finally {
      setCargandoSala(false);
    }
  };

  // ── 6. Selección y Bloqueo en Tiempo Real de Butacas ──
  const tarifaActual = useMemo(() => {
    return (
      tarifasDisponibles.find((t) => t.id_tipo_entrada === tarifaSeleccionadaId) ||
      tarifasDisponibles[0] || {
        id_tipo_entrada: "1",
        nombre: "General",
        precio: 18.0,
      }
    );
  }, [tarifasDisponibles, tarifaSeleccionadaId]);

  const handleToggleAsiento = async (asiento: any) => {
    if (asiento.estado === "Ocupado" || asiento.en_mantenimiento) return;

    const yaSeleccionado = entradasSeleccionadas.some((e) => e.codigo_asiento === asiento.codigo);

    if (yaSeleccionado) {
      // Deseleccionar: liberar en BD y quitar del carrito
      const item = entradasSeleccionadas.find((e) => e.codigo_asiento === asiento.codigo);
      if (item) {
        CounterService.liberarAsientoCounter(item.id_asiento_funcion, sesionId).catch(console.warn);
      }
      setEntradasSeleccionadas((prev) => prev.filter((e) => e.codigo_asiento !== asiento.codigo));
      setAsientosSala((prev) =>
        prev.map((a) => (a.codigo === asiento.codigo ? { ...a, estado: "Disponible", id_sesion_bloqueo: null } : a))
      );
    } else {
      // Bloquear en Supabase en tiempo real (sin temporizador de expulsión en pantalla)
      try {
        const idBloqueo = await CounterService.bloquearAsientoCounter(
          funcionSeleccionada.id_funcion,
          asiento.id_asiento,
          sesionId
        );

        const nuevaEntrada: ItemEntradaCounter = {
          id_asiento_funcion: asiento.id_asiento_funcion || idBloqueo,
          codigo_asiento: asiento.codigo,
          fila: asiento.fila,
          numero: asiento.columna,
          id_tipo_entrada: tarifaActual.id_tipo_entrada || tarifaActual.id_tarifa || "1",
          tipo_nombre: tarifaActual.nombre || "General",
          precio: Number(tarifaActual.precio || 18.0),
        };

        setEntradasSeleccionadas((prev) => [...prev, nuevaEntrada]);
        setAsientosSala((prev) =>
          prev.map((a) =>
            a.codigo === asiento.codigo ? { ...a, estado: "Bloqueado", id_sesion_bloqueo: sesionId } : a
          )
        );
      } catch (err: any) {
        mostrarToast(err.message || "No se pudo seleccionar el asiento.");
      }
    }
  };

  // ── 7. Cancelación y Liberación Segura ──
  const liberarYLimpiarVenta = async () => {
    try {
      await CounterService.liberarTodosLosBloqueosCounter(sesionId);
    } catch (e) {
      console.warn("Fallo al liberar bloqueos:", e);
    }
    setEntradasSeleccionadas([]);
    setFuncionSeleccionada(null);
    setSubvista("cartelera");
  };

  const handleSolicitarCancelarVenta = () => {
    if (entradasSeleccionadas.length > 0) {
      setAccionSalidaPendiente(() => () => liberarYLimpiarVenta());
      setModalSalidaAbierto(true);
    } else {
      liberarYLimpiarVenta();
    }
  };

  // ── 8. Cálculos y Subtotales ──
  const subtotalEntradas = useMemo(() => {
    return entradasSeleccionadas.reduce((sum, e) => sum + Number(e.precio || 0), 0);
  }, [entradasSeleccionadas]);

  // ── 9. Procesar Cobro ──
  const handleConfirmarCobro = async (datosCobro: any) => {
    if (!funcionSeleccionada || entradasSeleccionadas.length === 0) return;

    setProcesandoCobro(true);
    try {
      const res = await CounterService.procesarVentaCounter({
        modo: "boleteria",
        id_sede: idSede,
        id_vendedor: "33333333-1111-4444-1111-111111111111", // Ana Boletería
        socio: socioActivo,
        tipo_comprobante: datosCobro.tipo_comprobante,
        numero_documento: datosCobro.numero_documento,
        nombre_cliente: datosCobro.nombre_cliente,
        metodo_pago: datosCobro.metodo_pago,
        monto_recibido: datosCobro.monto_recibido,
        id_funcion: funcionSeleccionada.id_funcion,
        pelicula_titulo: funcionSeleccionada.pelicula?.titulo || "Película",
        formato: funcionSeleccionada.formato_proyeccion?.nombre || "2D Doblada",
        sala: funcionSeleccionada.sala?.nombre_sala || "1",
        hora: funcionSeleccionada.hora_inicio || "",
        entradas: entradasSeleccionadas,
        productos: [],
        descuento_puntos: datosCobro.descuento_puntos,
        puntos_canjeados: datosCobro.puntos_canjeados,
      });

      setResultadoVenta(res);
      setSubvista("exito");
      mostrarToast(`¡Cobro exitoso! Vuelto: S/ ${res.vuelto.toFixed(2)}`);
    } catch (e: any) {
      throw e;
    } finally {
      setProcesandoCobro(false);
    }
  };

  // ── 10. Filtrado de Funciones ──
  const funcionesFiltradas = useMemo(() => {
    return funciones.filter((fn) => {
      const peliTitulo = fn.pelicula?.titulo?.toLowerCase() || "";
      const cumpleBusqueda = !busquedaPeli.trim() || peliTitulo.includes(busquedaPeli.toLowerCase());
      const formatoNombre = fn.formato_proyeccion?.nombre || "";
      const cumpleFormato = filtroFormato === "Todos" || formatoNombre.toLowerCase().includes(filtroFormato.toLowerCase());
      return cumpleBusqueda && cumpleFormato;
    });
  }, [funciones, busquedaPeli, filtroFormato]);

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
        modo="boleteria"
        sedeActual={sedeActual}
        sedesDisponibles={sedes}
        onCambiarSede={handleCambiarSede}
        socioActivo={socioActivo}
        onAbrirModalSocio={() => setModalSocioAbierto(true)}
        onAbrirModalOrden={() => setModalOrdenAbierto(true)}
        cajeroNombre="Ana Boletería"
      />

      {/* Layout Principal: Contenido a la izquierda (1fr) + Panel lateral (380px) */}
      <div className="flex-1 lg:grid lg:grid-cols-[1fr_380px]">
        <main className="min-w-0">
          {/* SUBVISTA 1: CARTELERA DE FUNCIONES */}
          {subvista === "cartelera" && (
            <div id="cv-inicio" className="p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Taquilla de Boletería</h1>
                  <p className="text-slate-400 text-xs md:text-sm">
                    {sedeActual.nombre} · Selección de película y función para emisión de entradas
                  </p>
                </div>

                {/* Switch Agrupación */}
                <div className="flex bg-dark-800 border border-white/5 rounded-xl p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setModoAgrupacion("peli")}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      modoAgrupacion === "peli" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <i className="fa-solid fa-film"></i>
                    <span>Por película</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoAgrupacion("hora")}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      modoAgrupacion === "hora" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <i className="fa-regular fa-clock"></i>
                    <span>Por hora</span>
                  </button>
                </div>
              </div>

              {/* Filtros: Día, Formato y Buscador */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex bg-dark-800 border border-white/5 rounded-xl p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setFiltroDia("hoy")}
                    className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                      filtroDia === "hoy" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroDia("manana")}
                    className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                      filtroDia === "manana" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Mañana
                  </button>
                </div>

                <div className="relative flex-grow max-w-xs">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <input
                    type="text"
                    value={busquedaPeli}
                    onChange={(e) => setBusquedaPeli(e.target.value)}
                    placeholder="Buscar película..."
                    className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["Todos", "2D Doblada", "2D Subtitulada", "SALA XD", "IMAX"].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFiltroFormato(fmt)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                        filtroFormato === fmt
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Películas / Funciones */}
              {cargandoFunciones ? (
                <div className="text-center py-20 text-slate-400">
                  <i className="fa-solid fa-spinner fa-spin text-3xl text-brand-blue mb-3"></i>
                  <p className="text-sm">Cargando cartelera de {sedeActual.nombre}...</p>
                </div>
              ) : funcionesFiltradas.length === 0 ? (
                <div className="text-center py-16 bg-dark-800 border border-white/5 rounded-2xl p-8">
                  <i className="fa-solid fa-film text-slate-500 text-4xl mb-3"></i>
                  <h3 className="text-lg font-bold text-white mb-1">No hay funciones disponibles</h3>
                  <p className="text-xs text-slate-400">
                    No se hallaron funciones para los filtros seleccionados en esta sede.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                  {funcionesFiltradas.map((fn) => (
                    <div
                      key={fn.id_funcion}
                      className="bg-dark-800 border border-white/5 hover:border-white/20 rounded-2xl p-4 flex gap-4 transition-colors"
                    >
                      <img
                        src={fn.pelicula?.url_poster || "/img/posters/default.webp"}
                        alt={fn.pelicula?.titulo || "Película"}
                        className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                              {fn.pelicula?.clasificacion || "APT"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {fn.pelicula?.duracion_min || 120} min
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base truncate mb-1">
                            {fn.pelicula?.titulo}
                          </h3>
                          <p className="text-xs text-slate-400 mb-2">
                            Sala {fn.sala?.nombre_sala || fn.numero_sala || "1"} · {fn.formato_proyeccion?.nombre || "2D Doblada"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-sm font-bold text-brand-yellow font-mono">
                            {fn.hora_inicio}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSeleccionarFuncion(fn)}
                            className="bg-brand-blue hover:bg-brand-dark-blue text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <span>Elegir Butacas</span>
                            <i className="fa-solid fa-arrow-right text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUBVISTA 2: SELECCIÓN DE BUTACAS Y MATRIZ */}
          {subvista === "asientos" && funcionSeleccionada && (
            <div id="cv-asientos" className="p-4 md:p-6 fade-in">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <button
                  type="button"
                  onClick={handleSolicitarCancelarVenta}
                  className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Volver a Funciones</span>
                </button>

                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold truncate">
                    {funcionSeleccionada.pelicula?.titulo}
                  </h2>
                  <p className="text-slate-400 text-xs">
                    {funcionSeleccionada.hora_inicio} · {funcionSeleccionada.formato_proyeccion?.nombre} · Sala{" "}
                    {funcionSeleccionada.sala?.nombre_sala || "1"}
                  </p>
                </div>
              </div>

              {/* Selector de Tarifa Activa para los siguientes clicks */}
              <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 mb-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Tipo de entrada para las próximas butacas seleccionadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tarifasDisponibles.map((tar) => {
                    const tarId = tar.id_tipo_entrada;
                    const esActiva = tarifaActual.id_tipo_entrada === tarId;
                    return (
                      <button
                        key={tarId}
                        type="button"
                        onClick={() => setTarifaSeleccionadaId(tarId)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                          esActiva
                            ? "bg-brand-blue text-white border-brand-blue shadow-md shadow-blue-500/20"
                            : "bg-dark-900 text-slate-300 border-white/10 hover:border-brand-blue"
                        }`}
                      >
                        <span>{tar.nombre}</span>
                        <span className="text-[11px] font-mono text-brand-yellow">
                          S/ {Number(tar.precio).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pantalla Curva y Matriz */}
              <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 md:p-8 overflow-x-auto text-center">
                {cargandoSala ? (
                  <div className="py-20 text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-brand-blue mb-3"></i>
                    <p className="text-sm">Cargando sala y butacas...</p>
                  </div>
                ) : (
                  <div className="min-w-[540px] max-w-2xl mx-auto">
                    {/* Pantalla */}
                    <div className="w-full max-w-[460px] mx-auto mb-8 text-center">
                      <div className="w-full h-8 screen-curve bg-gradient-to-b from-brand-blue/30 to-transparent rounded-t-full border-t-2 border-brand-blue/60 shadow-[0_-10px_20px_rgba(10,126,177,0.2)]"></div>
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 block">
                        Pantalla
                      </span>
                    </div>

                    {/* Matriz de Asientos */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {asientosSala.map((asiento) => {
                        const estaEnCarrito = entradasSeleccionadas.some(
                          (e) => e.codigo_asiento === asiento.codigo
                        );
                        const estaOcupado =
                          asiento.estado === "Ocupado" ||
                          (asiento.estado === "Bloqueado" && asiento.id_sesion_bloqueo !== sesionId);

                        let claseColor = "bg-green-600 hover:bg-green-500 text-white/90 cursor-pointer";
                        if (estaEnCarrito) {
                          claseColor = "bg-brand-yellow text-black font-extrabold shadow-lg shadow-yellow-500/30 scale-105";
                        } else if (estaOcupado) {
                          claseColor = "bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-60";
                        }

                        return (
                          <button
                            key={asiento.codigo}
                            type="button"
                            disabled={estaOcupado}
                            onClick={() => handleToggleAsiento(asiento)}
                            title={`${asiento.codigo} ${estaOcupado ? "(Ocupado)" : estaEnCarrito ? "(Seleccionado)" : "(Disponible)"}`}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-b-4 border-black/40 flex items-center justify-center text-[10px] font-mono font-bold transition-all ${claseColor}`}
                          >
                            {asiento.codigo}
                          </button>
                        );
                      })}
                    </div>

                    {/* Leyenda */}
                    <div className="flex flex-wrap justify-center gap-5 text-xs text-slate-400 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-green-600"></span>
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-brand-yellow"></span>
                        <span>Tu Selección</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700"></span>
                        <span>Ocupado / Bloqueado</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBVISTA 3: COBRO POS */}
          {subvista === "cobro" && (
            <ModuloPagoPOS
              total={subtotalEntradas}
              subtotal={subtotalEntradas}
              socioActivo={socioActivo}
              onVolver={() => setSubvista("asientos")}
              onConfirmarCobro={handleConfirmarCobro}
              procesando={procesandoCobro}
            />
          )}

          {/* SUBVISTA 4: COMPROBANTE Y TICKET TÉRMICO */}
          {subvista === "exito" && resultadoVenta && (
            <TicketTermicoPOS
              venta={resultadoVenta}
              onNuevaVenta={() => {
                liberarYLimpiarVenta();
                setResultadoVenta(null);
              }}
            />
          )}
        </main>

        {/* ASIDE LATERAL: PANEL DE VENTA EXCLUSIVO DE BOLETERÍA */}
        <aside
          id="panel-venta"
          className="bg-dark-800 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16"
        >
          {subvista === "cartelera" && entradasSeleccionadas.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3">
                <i className="fa-solid fa-ticket text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nueva Venta Taquilla</h3>
              <p className="text-slate-400 text-xs max-w-[15rem]">
                Elige una película y horario a la izquierda para seleccionar las butacas.
              </p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between p-5 min-h-0">
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Cabecera del Panel */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h3 className="font-bold text-white text-base">Venta en Curso</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Boletería POS</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSolicitarCancelarVenta}
                    className="text-xs text-slate-400 hover:text-brand-red border border-white/10 hover:border-brand-red/40 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    <i className="fa-solid fa-xmark mr-1"></i>
                    Cancelar
                  </button>
                </div>

                {/* Resumen de la Función */}
                {funcionSeleccionada && (
                  <div className="bg-dark-900 border border-white/5 rounded-xl p-3 flex gap-3">
                    <img
                      src={funcionSeleccionada.pelicula?.url_poster || "/img/posters/default.webp"}
                      className="w-12 h-16 object-cover rounded shadow"
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-xs truncate">
                        {funcionSeleccionada.pelicula?.titulo}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Sala {funcionSeleccionada.sala?.nombre_sala || "1"} · {funcionSeleccionada.hora_inicio}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        {funcionSeleccionada.formato_proyeccion?.nombre}
                      </p>
                    </div>
                  </div>
                )}

                {/* Lista de Butacas Seleccionadas */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Entradas ({entradasSeleccionadas.length})
                  </p>
                  {entradasSeleccionadas.length === 0 ? (
                    <p className="text-slate-500 text-xs italic">Aún no has seleccionado butacas.</p>
                  ) : (
                    <div className="space-y-2">
                      {entradasSeleccionadas.map((e) => (
                        <div
                          key={e.codigo_asiento}
                          className="flex items-center justify-between bg-dark-900/60 border border-white/5 rounded-lg px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-brand-yellow text-black font-bold flex items-center justify-center text-[10px]">
                              {e.codigo_asiento}
                            </span>
                            <span className="text-slate-300">{e.tipo_nombre}</span>
                          </div>
                          <span className="font-mono text-white font-semibold">
                            S/ {Number(e.precio).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Totales y Botón de Cobro */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Total Entradas:
                  </span>
                  <span className="text-2xl font-black text-brand-yellow font-mono">
                    S/ {subtotalEntradas.toFixed(2)}
                  </span>
                </div>

                {subvista === "asientos" && (
                  <button
                    type="button"
                    disabled={entradasSeleccionadas.length === 0}
                    onClick={() => setSubvista("cobro")}
                    className="w-full bg-brand-blue hover:bg-brand-dark-blue disabled:opacity-40 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
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

      {/* MODAL 4: CONFIRMAR SALIDA Y LIBERAR BUTACAS */}
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
