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
import { CounterService } from "@/src/services/counterService";
import { supabase } from "@/src/lib/supabase/cliente";
import type {
  SocioCounterDTO,
  ItemEntradaCounter,
  VentaCounterResultadoDTO,
  OrdenContingenciaDTO,
} from "@/src/dtos/counter";
import { AsientosMapaSkeleton } from "@/src/components/comun/skeletons";

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
          rolCodigo: storedRol || "counter_boleteria",
        };
      }
    }
    return {
      idUsuario: "",
      nombreCompleto: "Cajero",
      rolCodigo: "counter_boleteria",
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
            const rol = (usuarioData.rol as any)?.codigo || "counter_boleteria";
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
        console.warn("No se pudo cargar el perfil de usuario activo:", e);
      }
    }
    cargarUsuarioSesion();
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

  // Carrito de Entradas
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState<ItemEntradaCounter[]>([]);

  // Modal para Elegir Tipo de Entrada al seleccionar un asiento
  const [asientoParaModalTipo, setAsientoParaModalTipo] = useState<any | null>(null);

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

  const cargarFuncionesSede = useCallback(
    async (sedeId: number, dia: "hoy" | "manana", mostrarSpinner = true) => {
      if (mostrarSpinner) setCargandoFunciones(true);
      try {
        const hoy = new Date();
        if (dia === "manana") {
          hoy.setDate(hoy.getDate() + 1);
        }
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd = String(hoy.getDate()).padStart(2, "0");
        const fechaIso = `${yyyy}-${mm}-${dd}`;
        const data = await CounterService.obtenerFuncionesPorSedeYFecha(sedeId, fechaIso);
        setFunciones(data || []);
      } catch (err) {
        console.error("Error al cargar funciones:", err);
        setFunciones([]);
      } finally {
        if (mostrarSpinner) setCargandoFunciones(false);
      }
    },
    []
  );

  // Carga inicial y reactiva al volver a cartelera o cambiar filtros/sede
  useEffect(() => {
    if (subvista === "cartelera") {
      cargarFuncionesSede(idSede, filtroDia, funciones.length === 0);
    }
  }, [subvista, idSede, filtroDia, cargarFuncionesSede]);

  // ── Suscripción en Tiempo Real para Ocupación de Funciones (Cartelera) ──
  useEffect(() => {
    let timerDebounce: NodeJS.Timeout | null = null;

    const refrescarFuncionesSilencioso = () => {
      if (timerDebounce) clearTimeout(timerDebounce);
      timerDebounce = setTimeout(() => {
        if (subvista === "cartelera") {
          cargarFuncionesSede(idSede, filtroDia, false);
        }
      }, 300);
    };

    const canalCartelera = supabase
      .channel(`realtime_cartelera_pos_${idSede}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asiento_funcion",
        },
        () => {
          refrescarFuncionesSilencioso();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bloqueo_temporal",
        },
        () => {
          refrescarFuncionesSilencioso();
        }
      )
      .subscribe();

    return () => {
      if (timerDebounce) clearTimeout(timerDebounce);
      supabase.removeChannel(canalCartelera);
    };
  }, [idSede, filtroDia, subvista, cargarFuncionesSede]);

  // ── Suscripción en Tiempo Real para Matriz de Sala (Concurrencia entre terminales / Web) ──
  useEffect(() => {
    if (!funcionSeleccionada?.id_funcion || subvista !== "asientos") return;

    let timerDebounce: NodeJS.Timeout | null = null;

    const canalSala = supabase
      .channel(`realtime_sala_pos_${funcionSeleccionada.id_funcion}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asiento_funcion",
          filter: `id_funcion=eq.${funcionSeleccionada.id_funcion}`,
        },
        () => {
          if (timerDebounce) clearTimeout(timerDebounce);
          timerDebounce = setTimeout(async () => {
            try {
              const mapa = await CounterService.obtenerMapaAsientos(funcionSeleccionada.id_funcion);
              setAsientosSala((prev) => {
                const codigosMios = new Set(entradasSeleccionadas.map((e) => e.codigo_asiento));
                return (mapa.asientos || []).map((a: any) => {
                  if (codigosMios.has(a.codigo)) {
                    return { ...a, estado: "Bloqueado", id_sesion_bloqueo: sesionId };
                  }
                  return a;
                });
              });
            } catch (e) {
              console.warn("Error al sincronizar sala en tiempo real:", e);
            }
          }, 250);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bloqueo_temporal",
        },
        () => {
          if (timerDebounce) clearTimeout(timerDebounce);
          timerDebounce = setTimeout(async () => {
            try {
              const mapa = await CounterService.obtenerMapaAsientos(funcionSeleccionada.id_funcion);
              setAsientosSala((prev) => {
                const codigosMios = new Set(entradasSeleccionadas.map((e) => e.codigo_asiento));
                return (mapa.asientos || []).map((a: any) => {
                  if (codigosMios.has(a.codigo)) {
                    return { ...a, estado: "Bloqueado", id_sesion_bloqueo: sesionId };
                  }
                  return a;
                });
              });
            } catch (e) {
              console.warn("Error al sincronizar bloqueos de sala en tiempo real:", e);
            }
          }, 250);
        }
      )
      .subscribe();

    return () => {
      if (timerDebounce) clearTimeout(timerDebounce);
      supabase.removeChannel(canalSala);
    };
  }, [funcionSeleccionada?.id_funcion, subvista, entradasSeleccionadas, sesionId]);

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
    } catch (e: any) {
      mostrarToast(`Error al cargar la sala: ${e.message}`);
      setSubvista("cartelera");
    } finally {
      setCargandoSala(false);
    }
  };

  // ── 6. Selección y Bloqueo en Tiempo Real de Butacas ──
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
      // Deseleccionar: liberar en BD y quitar del carrito
      const item = entradasSeleccionadas.find((e) => e.codigo_asiento === asiento.codigo);
      if (item && item.id_asiento_funcion) {
        CounterService.liberarAsientoCounter(item.id_asiento_funcion, sesionId).catch(console.warn);
      }
      setEntradasSeleccionadas((prev) => prev.filter((e) => e.codigo_asiento !== asiento.codigo));
      setAsientosSala((prev) =>
        prev.map((a) => (a.codigo === asiento.codigo ? { ...a, estado: "Disponible", id_sesion_bloqueo: null } : a))
      );
    } else {
      // Abrir modal de selección de tipo de entrada (General, Niño, Adulto Mayor, etc.)
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
    cargarFuncionesSede(idSede, filtroDia, false);
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

  const totalVenta = subtotalEntradas;

  // ── 9. Procesamiento del Pago POS ──
  const handleProcesarCobro = async (datosPago: any) => {
    setProcesandoCobro(true);
    try {
      const resultado = await CounterService.procesarVentaCounter({
        modo: "boleteria",
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
        id_vendedor: usuarioActivo.idUsuario,
        entradas: entradasSeleccionadas,
        productos: [],
      });

      setResultadoVenta(resultado);
      setSubvista("exito");
      setEntradasSeleccionadas([]);
      // Refresco silencioso de las funciones para que la ocupación quede al 100% actualizada al instante
      cargarFuncionesSede(idSede, filtroDia, false);
    } catch (err: any) {
      mostrarToast(err.message || "Error al procesar la venta.");
    } finally {
      setProcesandoCobro(false);
    }
  };

  const iniciarNuevaVenta = () => {
    setResultadoVenta(null);
    setFuncionSeleccionada(null);
    setEntradasSeleccionadas([]);
    setSubvista("cartelera");
    setSocioActivo(null);
    // Garantiza que la barra y el conteo de la función recién comprada se refleje inmediatamente
    cargarFuncionesSede(idSede, filtroDia, false);
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
        modo="boleteria"
        sedeActual={sedeActual}
        sedesDisponibles={sedes}
        onCambiarSede={handleCambiarSede}
        socioActivo={socioActivo}
        onAbrirModalSocio={() => setModalSocioAbierto(true)}
        onAbrirModalOrden={() => setModalOrdenAbierto(true)}
        cajeroNombre={usuarioActivo.nombreCompleto}
        rolUsuario={usuarioActivo.rolCodigo}
      />

      {/* Layout Principal: Contenido a la izquierda (1fr) + Panel lateral (380px) */}
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

          {/* SUBVISTA 2: SELECCIÓN DE BUTACAS Y MATRIZ */}
          {subvista === "asientos" && funcionSeleccionada && (
            <div className="p-4 md:p-6 fade-in">
              {/* Barra superior de navegación interna */}
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

                <div className="w-28"></div>
              </div>

              {/* Contenedor del Mapa de Asientos */}
              <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                {cargandoSala ? (
                  <AsientosMapaSkeleton filas={6} columnas={10} className="border-0 bg-transparent p-4 shadow-none" />
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
                                  // ROJO vibrante idéntico a cliente
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

          {/* SUBVISTA 3: COBRO Y PAGO */}
          {subvista === "cobro" && (
            <div className="p-4 md:p-6 fade-in max-w-3xl mx-auto">
              <ModuloPagoPOS
                total={totalVenta}
                subtotal={totalVenta}
                socioActivo={socioActivo}
                onVolver={() => setSubvista("asientos")}
                onConfirmarCobro={handleProcesarCobro}
                procesando={procesandoCobro}
              />
            </div>
          )}

          {/* SUBVISTA 4: VENTA COMPLETADA Y EMISIÓN DE TICKET */}
          {subvista === "exito" && resultadoVenta && (
            <div className="p-4 md:p-6 fade-in max-w-xl mx-auto">
              <TicketTermicoPOS venta={resultadoVenta} onNuevaVenta={iniciarNuevaVenta} />
            </div>
          )}
        </main>

        {/* ── PANEL LATERAL DERECHO: Resumen de Orden y Cobro POS ── */}
        <aside className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0B1528] flex flex-col p-4 md:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-cash-register text-cyan-400"></i>
              <span>Venta en Caja</span>
            </h2>
            {entradasSeleccionadas.length > 0 && subvista !== "cobro" && subvista !== "exito" && (
              <button
                type="button"
                onClick={handleSolicitarCancelarVenta}
                className="text-[11px] text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
              >
                Cancelar Venta
              </button>
            )}
          </div>

          {/* Detalle de Entradas */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {entradasSeleccionadas.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <i className="fa-solid fa-ticket text-3xl mb-2 opacity-30 block"></i>
                Selecciona una función y butacas en el mapa para iniciar la venta.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Butacas Seleccionadas ({entradasSeleccionadas.length})
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
          </div>

          {/* Totales y Botón de Pago */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subtotal Entradas:</span>
              <span className="font-mono font-bold text-white">S/ {subtotalEntradas.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold pt-2 border-t border-slate-800/60">
              <span className="text-white">TOTAL A COBRAR:</span>
              <span className="text-2xl text-cyan-400 font-mono">S/ {totalVenta.toFixed(2)}</span>
            </div>

            {subvista === "asientos" && (
              <button
                type="button"
                disabled={entradasSeleccionadas.length === 0}
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

      {/* MODAL 5: CONFIRMAR SALIDA Y LIBERAR BUTACAS */}
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
