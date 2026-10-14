"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase/cliente";
import {
  AsientoService,
  LIMITE_MAXIMO_ASIENTOS,
  DURACION_RESERVA_SEGUNDOS,
  TIEMPO_GRACIA_SEGUNDOS,
} from "@/src/services/asientoService";
import type {
  SalaMatrizDTO,
  AsientoDTO,
  TipoEntradaDTO,
  TarifaVigenteDTO,
  AsientoSeleccionadoDTO,
} from "@/src/dtos/asiento";
import { SEL, intentarSalirDelFlujoDeCompra } from "@/src/lib/ui/nav";
import { mostrarToast } from "@/src/lib/ui/common";
import { FuncionDao } from "@/src/daos/FuncionDao";

export default function Asientos({ idFuncionParam }: { idFuncionParam?: string } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const funcionIdQuery = searchParams.get("funcion") || idFuncionParam || "";

  // ── 1. Estado de Sesión y Datos de Selección ──
  const [idSesion] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      let sid = sessionStorage.getItem("cinenautica_session_id") || "";
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("cinenautica_session_id", sid);
      }
      return sid;
    } catch {
      return "sesion-" + Math.random().toString(36).substring(2, 10);
    }
  });
  const [datosFuncion, setDatosFuncion] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  // ── 2. Datos de Sala y Tarifas ──
  const [matriz, setMatriz] = useState<SalaMatrizDTO | null>(null);
  const [tarifaVigente, setTarifaVigente] = useState<TarifaVigenteDTO | null>(null);
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntradaDTO[]>([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<AsientoSeleccionadoDTO[]>([]);

  // ── 3. Modales Interactivos ──
  const [asientoAccesiblePendiente, setAsientoAccesiblePendiente] = useState<AsientoDTO | null>(null);
  const [asientoParaModalTipo, setAsientoParaModalTipo] = useState<AsientoDTO | null>(null);
  const [tipoConadisPendiente, setTipoConadisPendiente] = useState<TipoEntradaDTO | null>(null);
  const [mostrarModalGracia, setMostrarModalGracia] = useState(false);
  const [segundosGracia, setSegundosGracia] = useState(TIEMPO_GRACIA_SEGUNDOS);

  // ── 4. Temporizador de 5 minutos ──
  const [segundosRestantes, setSegundosRestantes] = useState(DURACION_RESERVA_SEGUNDOS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const graciaTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Carga Atómica y Reactiva de Función, Sala y Tarifas ──
  useEffect(() => {
    let activo = true;

    async function cargarTodo() {
      setCargando(true);
      setErrorCarga(null);
      setMatriz(null);
      setAsientosSeleccionados([]);
      setSegundosRestantes(DURACION_RESERVA_SEGUNDOS);

      let targetFuncionId = funcionIdQuery;

      if (!targetFuncionId) {
        try {
          const raw = sessionStorage.getItem("cinenautica_seleccion_funcion");
          if (raw) {
            const parsed = JSON.parse(raw);
            targetFuncionId = parsed.id_funcion;
          }
        } catch {}
      }

      if (!targetFuncionId && SEL.id_funcion) {
        targetFuncionId = SEL.id_funcion;
      }

      if (!targetFuncionId) {
        if (!activo) return;
        setCargando(false);
        setErrorCarga("No se ha seleccionado ninguna función. Elige una función desde la cartelera.");
        return;
      }

      try {
        const info = await FuncionDao.obtenerFuncionCompraPorId(targetFuncionId);
        if (!activo) return;

        if (!info) {
          setCargando(false);
          setErrorCarga("La función seleccionada no está disponible o ha sido cancelada.");
          return;
        }

        // Sincronizar SEL y sessionStorage de forma limpia con los datos oficiales de la BD
        SEL.id_funcion = info.id_funcion;
        SEL.id_pelicula = info.id_pelicula;
        SEL.titulo = info.titulo;
        SEL.url_poster = info.url_poster;
        SEL.id_sede = info.id_sede;
        SEL.nombre_sede = info.nombre_sede;
        SEL.id_sala = info.id_sala;
        SEL.sala = info.sala;
        SEL.nombre_sala = info.nombre_sala;
        SEL.fecha = info.fecha;
        SEL.hora = info.hora;
        SEL.formato = info.formato;

        try {
          sessionStorage.setItem("cinenautica_seleccion_funcion", JSON.stringify(SEL));
        } catch {}

        // Limpiar asientos previos de otra función si difiere en sessionStorage
        try {
          const rawAsientos = sessionStorage.getItem("cinenautica_asientos_seleccionados");
          if (rawAsientos) {
            const parsed = JSON.parse(rawAsientos);
            if (parsed.id_funcion && parsed.id_funcion !== info.id_funcion) {
              sessionStorage.removeItem("cinenautica_asientos_seleccionados");
              SEL.asientos = [];
              SEL.total_asientos = 0;
            }
          }
        } catch {}

        let sid = idSesion;
        if (!sid && typeof window !== "undefined") {
          sid =
            sessionStorage.getItem("cinenautica_session_id") ||
            "sesion-" + Math.random().toString(36).substring(2, 10);
        }

        // Cargar DIRECTAMENTE la matriz estructural de la sala y tarifas de ESTA función
        const [matrizData, tarifaData, tiposData] = await Promise.all([
          AsientoService.obtenerMatrizSala(info.id_sala, info.id_funcion, sid),
          AsientoService.obtenerTarifaVigente(
            info.fecha || new Date().toISOString().split("T")[0],
            info.formato || "2D",
            Number(info.id_sede) || 1,
            Boolean(info.es_prestreno)
          ),
          AsientoService.obtenerTiposEntrada(),
        ]);

        if (!activo) return;

        // Restaurar asientos seleccionados solo si pertenecen a esta función específica
        const asientosEnEstaSesion: AsientoSeleccionadoDTO[] = [];
        let asientosGuardados: any[] = [];
        try {
          const raw = sessionStorage.getItem("cinenautica_asientos_seleccionados");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.id_funcion === info.id_funcion && Array.isArray(parsed.asientos)) {
              asientosGuardados = parsed.asientos;
            }
          }
        } catch {}

        const tipoGeneral = tiposData.find((t) => t.codigo === "general") || tiposData[0];

        Object.values(matrizData.grid).forEach((fila) => {
          fila.forEach((asiento) => {
            if (asiento && asiento.estado === "seleccionado" && asiento.id_asiento_funcion) {
              const guardado = asientosGuardados.find((g) => g.id_asiento === asiento.id_asiento);
              const tipoElegido = guardado
                ? tiposData.find((t) => t.id_tipo_entrada === guardado.id_tipo_entrada) || tipoGeneral
                : tipoGeneral;

              const precio = tipoElegido
                ? AsientoService.calcularPrecioEntrada(
                    tarifaData.precio_base_con_formato,
                    tipoElegido.descuento_pct
                  )
                : tarifaData.precio_base_con_formato;

              asientosEnEstaSesion.push({
                id_asiento: asiento.id_asiento,
                id_asiento_funcion: asiento.id_asiento_funcion,
                codigo: asiento.codigo,
                fila: asiento.fila,
                columna: asiento.columna,
                tipo_asiento: asiento.tipo_asiento,
                id_tipo_entrada: tipoElegido?.id_tipo_entrada || "",
                nombre_tipo_entrada: tipoElegido?.nombre || "General / Adulto",
                descuento_pct: tipoElegido?.descuento_pct || 0,
                precio,
              });
            }
          });
        });

        // Actualización ATÓMICA de todos los estados correspondientes a esta sala y función
        setDatosFuncion(info);
        setMatriz(matrizData);
        setTarifaVigente(tarifaData);
        setTiposEntrada(tiposData);
        setAsientosSeleccionados(asientosEnEstaSesion);
        setCargando(false);
      } catch (err: any) {
        if (!activo) return;
        console.error("Error al cargar mapa de asientos:", err);
        setErrorCarga(err.message || "Error al cargar la sala.");
        setCargando(false);
      }
    }

    cargarTodo();

    return () => {
      activo = false;
    };
  }, [funcionIdQuery, idSesion]);


  // ── Suscripción a Supabase Realtime para Bloqueos Concurrentes ──
  useEffect(() => {
    if (!datosFuncion?.id_funcion || !idSesion) return;

    const channel = supabase
      .channel(`bloqueos_asientos_${datosFuncion.id_funcion}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bloqueo_temporal",
        },
        () => {
          // Si otro usuario bloqueó o liberó un asiento, refrescar silenciosamente la matriz
          AsientoService.obtenerMatrizSala(
            datosFuncion.id_sala,
            datosFuncion.id_funcion,
            idSesion
          )
            .then((nuevaMatriz) => {
              setMatriz((actual) => {
                if (!actual) return nuevaMatriz;
                // Mantener los seleccionados localmente
                return nuevaMatriz;
              });
            })
            .catch((e) => console.warn("Error en actualización realtime:", e));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [datosFuncion?.id_funcion, datosFuncion?.id_sala, idSesion]);

  // ── Temporizador de Reserva (5 minutos con tick hacia el Badge global sin colisión de render) ──
  const formatearTiempo = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (cargando || errorCarga || mostrarModalGracia) return;

    timerRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        const siguiente = prev - 1;

        // Disparar evento en el próximo ciclo de eventos para evitar setState durante render
        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("temporizador-compra-tick", {
                detail: {
                  segundos: siguiente,
                  formateado: formatearTiempo(Math.max(0, siguiente)),
                },
              })
            );
          }, 0);
        }

        if (siguiente <= 0) {
          clearInterval(timerRef.current!);
          setMostrarModalGracia(true);
          setSegundosGracia(TIEMPO_GRACIA_SEGUNDOS);
          return 0;
        }

        return siguiente;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cargando, errorCarga, mostrarModalGracia]);

  // Cuenta regresiva del modal de gracia (30 segundos)
  useEffect(() => {
    if (!mostrarModalGracia) return;

    graciaTimerRef.current = setInterval(() => {
      setSegundosGracia((prev) => {
        if (prev <= 1) {
          clearInterval(graciaTimerRef.current!);
          cancelarYSalir();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (graciaTimerRef.current) clearInterval(graciaTimerRef.current);
    };
  }, [mostrarModalGracia]);

  // Confirmar que el cliente sigue activo y renovar 5 minutos más
  const renovarTiempo = async () => {
    try {
      if (idSesion) {
        await AsientoService.renovarTiempoReserva(idSesion);
      }
      setMostrarModalGracia(false);
      setSegundosRestantes(DURACION_RESERVA_SEGUNDOS);
      mostrarToast("Tiempo de reserva renovado por 5 minutos.", "exito");
    } catch {
      mostrarToast("No se pudo renovar la reserva.", "error");
    }
  };

  // Cancelar reserva y liberar asientos
  const cancelarYSalir = async () => {
    try {
      if (idSesion) {
        await AsientoService.liberarTodosLosAsientos(idSesion);
      }
      sessionStorage.removeItem("cinenautica_asientos_seleccionados");
      SEL.asientos = [];
      SEL.total_asientos = 0;
    } catch {}
    mostrarToast("Tu tiempo de reserva ha expirado. Los asientos han sido liberados.", "error");
    router.push("/");
  };

  // ── Manejo de Clic en Butaca (Optimistic UI: 0ms lag) ──
  const manejarClickAsiento = (asiento: AsientoDTO) => {
    if (!datosFuncion || !idSesion || !tarifaVigente) return;

    // Estados bloqueados
    if (
      asiento.estado === "ocupado" ||
      asiento.estado === "mantenimiento" ||
      asiento.estado === "bloqueado_otro"
    ) {
      if (asiento.estado === "bloqueado_otro") {
        mostrarToast("Este asiento se encuentra en selección por otro cliente.", "info");
      }
      return;
    }

    // Si ya está seleccionado por el usuario -> DESELECCIONAR INMEDIATAMENTE
    if (asiento.estado === "seleccionado") {
      deseleccionarAsientoOptimista(asiento);
      return;
    }

    // Validar límite de 8 asientos
    if (asientosSeleccionados.length >= LIMITE_MAXIMO_ASIENTOS) {
      mostrarToast(
        `Límite alcanzado: máximo ${LIMITE_MAXIMO_ASIENTOS} asientos por transacción.`,
        "error"
      );
      return;
    }

    // Si es un Asiento Accesible y aún no ha confirmado el aviso
    if (asiento.tipo_asiento.toLowerCase() === "accesible") {
      setAsientoAccesiblePendiente(asiento);
      return;
    }

    // Abrir modal de selección de tipo de entrada (General, Niño, etc.)
    setAsientoParaModalTipo(asiento);
  };

  // Deseleccionar con Optimistic UI
  const deseleccionarAsientoOptimista = (asiento: AsientoDTO) => {
    const estadoPrevio =
      asiento.tipo_asiento.toLowerCase() === "accesible" ? "accesible" : "disponible";

    // 1. Actualización visual instantánea (0ms)
    setAsientosSeleccionados((prev) => prev.filter((a) => a.id_asiento !== asiento.id_asiento));
    setMatriz((prev) => {
      if (!prev) return prev;
      const nuevoGrid = { ...prev.grid };
      const filaArr = [...(nuevoGrid[asiento.fila] || [])];
      const idx = asiento.columna - 1;
      if (filaArr[idx]) {
        filaArr[idx] = {
          ...filaArr[idx]!,
          estado: estadoPrevio,
        };
      }
      nuevoGrid[asiento.fila] = filaArr;
      return { ...prev, grid: nuevoGrid };
    });

    // 2. Liberación en BD en segundo plano
    if (asiento.id_asiento_funcion) {
      AsientoService.deseleccionarAsiento(asiento.id_asiento_funcion, idSesion).catch((err) => {
        console.warn("Advertencia al liberar en BD:", err);
      });
    }
  };

  // Confirmar selección con un tipo de entrada elegido
  const confirmarSeleccionConTipo = (asiento: AsientoDTO, tipo: TipoEntradaDTO) => {
    if (!tarifaVigente || !datosFuncion) return;

    setAsientoParaModalTipo(null);
    setTipoConadisPendiente(null);

    const precioCalculado = AsientoService.calcularPrecioEntrada(
      tarifaVigente.precio_base_con_formato,
      tipo.descuento_pct
    );

    const nuevoSeleccionado: AsientoSeleccionadoDTO = {
      id_asiento: asiento.id_asiento,
      id_asiento_funcion: asiento.id_asiento_funcion || "",
      codigo: asiento.codigo,
      fila: asiento.fila,
      columna: asiento.columna,
      tipo_asiento: asiento.tipo_asiento,
      id_tipo_entrada: tipo.id_tipo_entrada,
      nombre_tipo_entrada: tipo.nombre,
      descuento_pct: tipo.descuento_pct,
      precio: precioCalculado,
    };

    // 1. Actualización visual inmediata (Optimistic UI)
    setAsientosSeleccionados((prev) => [...prev, nuevoSeleccionado]);
    setMatriz((prev) => {
      if (!prev) return prev;
      const nuevoGrid = { ...prev.grid };
      const filaArr = [...(nuevoGrid[asiento.fila] || [])];
      const idx = asiento.columna - 1;
      if (filaArr[idx]) {
        filaArr[idx] = {
          ...filaArr[idx]!,
          estado: "seleccionado",
        };
      }
      nuevoGrid[asiento.fila] = filaArr;
      return { ...prev, grid: nuevoGrid };
    });

    // 2. Persistir bloqueo en Supabase en segundo plano
    AsientoService.seleccionarAsiento(
      datosFuncion.id_funcion,
      asiento.id_asiento,
      idSesion,
      asientosSeleccionados.length
    )
      .then(({ id_asiento_funcion }) => {
        // Enlazar id_asiento_funcion en el estado local
        setAsientosSeleccionados((prev) =>
          prev.map((a) => (a.id_asiento === asiento.id_asiento ? { ...a, id_asiento_funcion } : a))
        );
        setMatriz((prev) => {
          if (!prev) return prev;
          const nuevoGrid = { ...prev.grid };
          const filaArr = [...(nuevoGrid[asiento.fila] || [])];
          const idx = asiento.columna - 1;
          if (filaArr[idx]) {
            filaArr[idx] = { ...filaArr[idx]!, id_asiento_funcion };
          }
          nuevoGrid[asiento.fila] = filaArr;
          return { ...prev, grid: nuevoGrid };
        });
      })
      .catch((err: any) => {
        // Revertir en caso de colisión o fallo en BD
        mostrarToast(err.message || "El asiento no se pudo reservar.", "error");
        setAsientosSeleccionados((prev) => prev.filter((a) => a.id_asiento !== asiento.id_asiento));
        setMatriz((prev) => {
          if (!prev) return prev;
          const nuevoGrid = { ...prev.grid };
          const filaArr = [...(nuevoGrid[asiento.fila] || [])];
          const idx = asiento.columna - 1;
          if (filaArr[idx]) {
            filaArr[idx] = {
              ...filaArr[idx]!,
              estado:
                asiento.tipo_asiento.toLowerCase() === "accesible" ? "accesible" : "disponible",
            };
          }
          nuevoGrid[asiento.fila] = filaArr;
          return { ...prev, grid: nuevoGrid };
        });
      });
  };

  // Importe total calculado
  const totalEntradas = useMemo(() => {
    return asientosSeleccionados.reduce((acc, a) => acc + a.precio, 0);
  }, [asientosSeleccionados]);

  // Sincronizar en tiempo real el estado global y sessionStorage con los asientos seleccionados
  useEffect(() => {
    if (cargando || !datosFuncion?.id_funcion) return;

    const tieneAsientos = asientosSeleccionados.length > 0;
    if (typeof window !== "undefined") {
      (window as any).__tieneAsientosSeleccionados = tieneAsientos;
    }

    SEL.asientos = asientosSeleccionados.map((a) => a.codigo);
    SEL.total_asientos = totalEntradas;

    if (tieneAsientos) {
      const payload = {
        id_funcion: datosFuncion.id_funcion,
        id_sesion: idSesion,
        asientos: asientosSeleccionados,
        cantidad: asientosSeleccionados.length,
        total: totalEntradas,
      };
      try {
        sessionStorage.setItem("cinenautica_asientos_seleccionados", JSON.stringify(payload));
      } catch {}
    } else {
      try {
        sessionStorage.removeItem("cinenautica_asientos_seleccionados");
      } catch {}
    }
  }, [asientosSeleccionados, cargando, datosFuncion?.id_funcion, idSesion, totalEntradas]);

  // Escuchar evento de liberación de asientos para limpiar estado local
  useEffect(() => {
    function onLiberados() {
      setAsientosSeleccionados([]);
      setMatriz(null);
      if (typeof window !== "undefined") {
        (window as any).__tieneAsientosSeleccionados = false;
      }
    }

    window.addEventListener("asientos-liberados-sesion", onLiberados);
    return () => window.removeEventListener("asientos-liberados-sesion", onLiberados);
  }, []);

  // Interceptar botón atrás del navegador si hay asientos seleccionados
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (asientosSeleccionados.length > 0) {
      window.history.pushState({ cinenauticaAsientos: true }, "", window.location.href);
    }

    function manejarPopState() {
      if ((window as any).__tieneAsientosSeleccionados || asientosSeleccionados.length > 0) {
        intentarSalirDelFlujoDeCompra(() => {
          const idPeli = datosFuncion?.id_pelicula || SEL.id_pelicula || SEL.peli;
          if (idPeli) {
            router.push(`/pelicula/${idPeli}`);
          } else {
            router.push("/");
          }
        });
      }
    }

    window.addEventListener("popstate", manejarPopState);
    return () => {
      window.removeEventListener("popstate", manejarPopState);
    };
  }, [asientosSeleccionados.length > 0, datosFuncion?.id_pelicula, router]);

  // Limpieza al desmontar la vista
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__tieneAsientosSeleccionados = false;
      }
    };
  }, []);

  // Continuar a la Dulcería
  const avanzarADulceria = () => {
    if (asientosSeleccionados.length === 0) {
      mostrarToast("Selecciona al menos un asiento para continuar.", "info");
      return;
    }

    const payload = {
      id_funcion: datosFuncion.id_funcion,
      id_sesion: idSesion,
      asientos: asientosSeleccionados,
      cantidad: asientosSeleccionados.length,
      total: totalEntradas,
    };

    try {
      sessionStorage.setItem("cinenautica_asientos_seleccionados", JSON.stringify(payload));
    } catch {}

    // Sincronizar SEL global para retrocompatibilidad
    SEL.asientos = asientosSeleccionados.map((a) => a.codigo);
    SEL.total_asientos = totalEntradas;

    router.push("/dulceria");
  };

  // ── Pantalla de Carga y Manejo de Errores ──
  if (cargando) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 md:px-8 max-w-[1600px] mx-auto text-white">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-brand-yellow text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Cargando sala y disponibilidad...</h2>
          <p className="text-slate-400 text-sm">
            Consultando distribución y bloqueos de butacas en tiempo real.
          </p>
        </div>
      </div>
    );
  }

  if (errorCarga || !matriz) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 md:px-8 max-w-[1200px] mx-auto text-white text-center">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg mx-auto">
          <i className="fa-solid fa-triangle-exclamation text-brand-yellow text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Atención</h2>
          <p className="text-slate-400 mb-6">{errorCarga || "No se pudo cargar la sala."}</p>
          <button
            className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-3 rounded-full font-bold transition-colors"
            onClick={() => router.push("/")}
          >
            <i className="fa-solid fa-film mr-2"></i>
            Ir a Cartelera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-900 min-h-screen pb-40 pt-36 overflow-x-hidden" id="vista-asientos">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ── COLUMNA IZQUIERDA: Detalle de Película y Función ── */}
        <div className="w-full lg:col-span-1">
          <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 shadow-xl lg:sticky lg:top-28">
            <button
              className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm"
              onClick={() => {
                intentarSalirDelFlujoDeCompra(() => {
                  const idPeli = datosFuncion?.id_pelicula || SEL.id_pelicula || SEL.peli;
                  if (idPeli) {
                    router.push(`/pelicula/${idPeli}`);
                  } else {
                    router.push("/");
                  }
                });
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Cambiar función
            </button>

            <div id="info-pelicula-asientos">
              {datosFuncion.url_poster && (
                <img
                  alt={datosFuncion.titulo}
                  className="w-full rounded-xl mb-4 shadow-lg shadow-black/50 aspect-[2/3] object-cover"
                  src={datosFuncion.url_poster}
                />
              )}

              <h2 className="text-xl font-bold text-white mb-1">
                {datosFuncion.titulo}
              </h2>

              <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                  {datosFuncion.clasificacion || "APT"}
                </span>
                <span className="bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded font-bold border border-brand-blue/30">
                  {datosFuncion.formato || "2D Doblada"}
                </span>
              </div>

              <div className="space-y-3 mb-6 bg-dark-900 p-4 rounded-xl border border-white/5 mt-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <i className="fa-regular fa-calendar text-brand-blue w-4"></i>
                  <span className="font-bold text-white">
                    {datosFuncion.dia_label || datosFuncion.fecha}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <i className="fa-regular fa-clock text-brand-blue w-4"></i>
                  <span className="font-bold text-white">
                    {datosFuncion.hora || "19:00"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <i className="fa-solid fa-location-dot text-brand-blue w-4"></i>
                  <span className="font-bold text-white">
                    {datosFuncion.nombre_sede || "Cine Náutica"} — {matriz.nombre_sala}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="flex items-center gap-2 mb-1 text-slate-300 font-semibold">
                  <i className="fa-solid fa-circle-info text-brand-yellow"></i>
                  Reglas de reserva:
                </p>
                <ul className="space-y-1 list-disc list-inside text-slate-400">
                  <li>Máximo 8 asientos por compra.</li>
                  <li>Tienes 5 minutos para completar tu pedido.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUMNA CENTRAL: Mapa de Asientos y Pantalla Curva ── */}
        <div className="w-full lg:col-span-2">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Elige tus asientos
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {matriz.nombre_sala} ({matriz.total_disponibles} asientos disponibles)
              </p>
            </div>

            <div className="bg-dark-800 border border-brand-yellow/30 text-brand-yellow font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
              <i className="fa-solid fa-ticket"></i>
              <span>
                Tarifa base: S/ {tarifaVigente?.precio_base_con_formato.toFixed(2)} c/u
              </span>
            </div>
          </div>

          <div className="bg-dark-800 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl flex flex-col items-center overflow-x-auto relative">
            
            {/* Pantalla Curva con Reflejo */}
            <div className="w-full max-w-[500px] mb-12 text-center">
              <div className="w-full h-10 screen-curve rounded-t-[50%] border-t-4 border-brand-blue/60 shadow-[0_-15px_30px_rgba(10,126,177,0.3)]"></div>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-3 block">
                PANTALLA
              </span>
            </div>

            {/* Matriz Dinámica de Sala */}
            <div
              className="matriz-sala-cliente"
              id="grid-asientos"
              style={{ "--columnas-sala": String(matriz.columnas) } as React.CSSProperties}
            >
              {matriz.filas_nombres.map((filaNombre) => {
                const filaAsientos = matriz.grid[filaNombre] || [];

                return filaAsientos.map((asiento, colIndex) => {
                  const columnaNumero = colIndex + 1;

                  // Pasadizo estructural
                  if (!asiento) {
                    return (
                      <span
                        key={`gap-${filaNombre}-${columnaNumero}`}
                        aria-hidden="true"
                        className="asiento-pasadizo"
                      />
                    );
                  }

                  // ── Configuración de Estilos y Colores según requerimiento ──
                  let clasesEstilo =
                    "seat w-7 h-7 md:w-10 md:h-10 rounded-t-lg md:rounded-t-xl rounded-b-sm border-b-4 flex justify-center items-end pb-1 text-[8px] md:text-[10px] font-bold transition-all select-none ";

                  let tooltipTitulo = `${asiento.codigo} — ${asiento.tipo_asiento}`;

                  if (asiento.estado === "seleccionado") {
                    // ROJO #DC2026 para seleccionado
                    clasesEstilo +=
                      "bg-[#DC2026] hover:bg-[#b91c1c] text-white font-black border-black/50 ring-2 ring-[#DC2026] shadow-[0_0_15px_rgba(220,32,38,0.7)] scale-105 cursor-pointer";
                    tooltipTitulo = `${asiento.codigo} — Tu Selección`;
                  } else if (asiento.estado === "accesible") {
                    clasesEstilo +=
                      "bg-blue-600 hover:bg-blue-500 text-white border-black/50 cursor-pointer hover:scale-105";
                    tooltipTitulo = `${asiento.codigo} — Accesible`;
                  } else if (asiento.estado === "disponible") {
                    clasesEstilo +=
                      "bg-emerald-600 hover:bg-emerald-500 text-white/90 border-black/50 cursor-pointer hover:scale-105";
                    tooltipTitulo = `${asiento.codigo} — Disponible`;
                  } else if (asiento.estado === "bloqueado_otro") {
                    // GRIS MÁS CLARITO QUE OCUPADO PARA "EN SELECCIÓN"
                    clasesEstilo +=
                      "bg-slate-500 text-white/70 border-slate-700 cursor-not-allowed opacity-90";
                    tooltipTitulo = `${asiento.codigo} — En Selección`;
                  } else if (asiento.estado === "mantenimiento") {
                    clasesEstilo +=
                      "bg-gray-700 border-brand-red text-white/30 cursor-not-allowed";
                    tooltipTitulo = `${asiento.codigo} — Mantenimiento`;
                  } else {
                    // Ocupado (Gris más oscuro)
                    clasesEstilo +=
                      "asiento-cliente-no-disponible bg-[#1f2937]/90 text-white/20 border-black/60 cursor-not-allowed";
                    tooltipTitulo = `${asiento.codigo} — Ocupado`;
                  }

                  return (
                    <button
                      key={asiento.id_asiento}
                      className={clasesEstilo}
                      data-id={asiento.codigo}
                      disabled={
                        asiento.estado === "ocupado" ||
                        asiento.estado === "mantenimiento" ||
                        asiento.estado === "bloqueado_otro"
                      }
                      title={tooltipTitulo}
                      type="button"
                      onClick={() => manejarClickAsiento(asiento)}
                    >
                      {asiento.tipo_asiento.toLowerCase() === "accesible" ? (
                        <i className="fa-solid fa-wheelchair text-[10px] md:text-xs"></i>
                      ) : (
                        asiento.codigo
                      )}
                    </button>
                  );
                });
              })}
            </div>

            {/* Leyenda de Butacas */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-6 border-t border-white/10 text-xs text-slate-300 w-full">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 rounded-t-md rounded-b-xs inline-block border-b-2 border-black/50"></span>
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#DC2026] rounded-t-md rounded-b-xs inline-block border-b-2 border-black/50 ring-1 ring-[#DC2026]"></span>
                <span className="text-white font-bold">Tu Selección</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-600 rounded-t-md rounded-b-xs flex items-center justify-center text-[10px] text-white border-b-2 border-black/50">
                  <i className="fa-solid fa-wheelchair"></i>
                </span>
                <span>Accesible</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-500 rounded-t-md rounded-b-xs inline-block border-b-2 border-slate-700"></span>
                <span>En Selección</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 asiento-cliente-no-disponible rounded-t-md rounded-b-xs inline-block border-b-2 border-black/50"></span>
                <span>Ocupado</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Resumen de Compra en Tiempo Real ── */}
        <div className="w-full lg:col-span-1">
          <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 lg:sticky lg:top-28 shadow-xl">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
              <span>Resumen de Compra</span>
              <span className="text-xs font-normal text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                {asientosSeleccionados.length}/{LIMITE_MAXIMO_ASIENTOS}
              </span>
            </h3>

            <div className="mb-4">
              <h4 className="font-bold text-white text-base truncate">
                {datosFuncion.titulo}
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">
                {datosFuncion.dia_label || datosFuncion.fecha} • {datosFuncion.hora || "19:00"} • {datosFuncion.formato}
              </p>
              <p className="text-brand-yellow text-xs font-semibold mt-1">
                {datosFuncion.nombre_sede} — {matriz.nombre_sala}
              </p>
            </div>

            {/* Lista de Asientos Seleccionados */}
            <div className="border-t border-white/10 py-4 min-h-[140px] max-h-[380px] overflow-y-auto hide-scrollbar space-y-3" id="resumen-contenedor-asientos">
              {asientosSeleccionados.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm italic">
                  <i className="fa-solid fa-chair text-2xl mb-2 block opacity-40"></i>
                  Selecciona una o más butacas en el mapa para ver tu orden.
                </div>
              ) : (
                asientosSeleccionados.map((item) => (
                  <div
                    key={item.id_asiento}
                    className="bg-dark-900/80 p-3 rounded-xl border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-[#DC2026]/20 border border-[#DC2026]/40 text-[#DC2026] font-bold text-xs rounded-lg flex items-center justify-center">
                        {item.codigo}
                      </span>
                      <div>
                        <p className="text-white font-semibold text-xs leading-tight">
                          {item.nombre_tipo_entrada}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          {item.tipo_asiento.toLowerCase() === "accesible" ? "Accesible" : "Butaca"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-sm">
                        S/ {item.precio.toFixed(2)}
                      </span>
                      <button
                        aria-label={`Quitar asiento ${item.codigo}`}
                        className="text-slate-500 hover:text-brand-red text-xs transition-colors p-1"
                        type="button"
                        onClick={() => {
                          const seatObj = matriz.grid[item.fila]?.[item.columna - 1];
                          if (seatObj) {
                            deseleccionarAsientoOptimista(seatObj);
                          } else {
                            setAsientosSeleccionados((prev) =>
                              prev.filter((a) => a.id_asiento !== item.id_asiento)
                            );
                          }
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total y Botón de Checkout */}
            <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
              <span className="text-slate-300 text-sm">
                Total Entradas ({asientosSeleccionados.length}):
              </span>
              <span className="text-2xl font-black text-white" id="resumen-total">
                S/ {totalEntradas.toFixed(2)}
              </span>
            </div>

            <button
              className="w-full bg-brand-blue disabled:bg-slate-700 disabled:text-slate-500 hover:bg-brand-dark-blue text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              disabled={asientosSeleccionados.length === 0}
              id="btn-ir-dulceria"
              type="button"
              onClick={avanzarADulceria}
            >
              <span>Continuar a Dulcería</span>
              <i className="fa-solid fa-bowl-food"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: Elegir Tipo de Entrada (según imagen 2) ── */}
      {asientoParaModalTipo && !tipoConadisPendiente && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full relative">
            <button
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              type="button"
              onClick={() => setAsientoParaModalTipo(null)}
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              Elegir tipo de entrada
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Para el asiento <strong className="text-brand-yellow font-bold">{asientoParaModalTipo.codigo}</strong>
            </p>

            <div className="space-y-3">
              {tiposEntrada.map((t) => {
                const precio = tarifaVigente
                  ? AsientoService.calcularPrecioEntrada(
                      tarifaVigente.precio_base_con_formato,
                      t.descuento_pct
                    )
                  : 0;

                return (
                  <button
                    key={t.id_tipo_entrada}
                    className="w-full bg-[#111A2E]/80 hover:bg-[#1A2642] border border-white/5 hover:border-brand-blue/50 p-4 rounded-xl flex justify-between items-center transition-all text-left group"
                    type="button"
                    onClick={() => {
                      if (t.codigo === "conadis") {
                        // Abrir modal de aviso CONADIS
                        setTipoConadisPendiente(t);
                      } else {
                        confirmarSeleccionConTipo(asientoParaModalTipo, t);
                      }
                    }}
                  >
                    <span className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors">
                      {t.nombre}
                    </span>
                    <span className="font-extrabold text-white text-base">
                      S/ {precio.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Aviso CONADIS (según imagen 3) ── */}
      {tipoConadisPendiente && asientoParaModalTipo && (
        <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center relative">
            <div className="w-12 h-12 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mx-auto mb-4 text-brand-blue">
              <i className="fa-solid fa-info text-xl"></i>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              Aviso CONADIS
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              Deberás presentar tu carnet de CONADIS físico al ingresar a la sala. De no hacerlo, deberás pagar la diferencia en boletería. ¿Estás de acuerdo?
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-dark-800 hover:bg-dark-700 text-white py-3 px-4 rounded-xl font-semibold text-xs transition-colors border border-white/5"
                type="button"
                onClick={() => setTipoConadisPendiente(null)}
              >
                Elegir otro tipo
              </button>
              <button
                className="flex-1 bg-brand-blue hover:bg-brand-dark-blue text-white py-3 px-4 rounded-xl font-bold text-xs transition-colors shadow-lg shadow-brand-blue/30"
                type="button"
                onClick={() => {
                  const tipo = tipoConadisPendiente;
                  confirmarSeleccionConTipo(asientoParaModalTipo, tipo);
                }}
              >
                Sí, estoy de acuerdo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Confirmación de Asiento Accesible ── */}
      {asientoAccesiblePendiente && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0B132B] p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative">
            <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mb-4">
              <i className="fa-solid fa-wheelchair text-3xl text-blue-400"></i>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Asiento Accesible {asientoAccesiblePendiente.codigo}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Este espacio está diseñado prioritariamente para personas con movilidad reducida o
              en silla de ruedas. ¿Confirmas que requieres este asiento?
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                type="button"
                onClick={() => setAsientoAccesiblePendiente(null)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/30"
                type="button"
                onClick={() => {
                  const asiento = asientoAccesiblePendiente;
                  setAsientoAccesiblePendiente(null);
                  setAsientoParaModalTipo(asiento);
                }}
              >
                Confirmar Asiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Gracia de 30 Segundos por Expiración de Reserva ── */}
      {mostrarModalGracia && (
        <div className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B132B] p-8 rounded-3xl border border-brand-red/40 shadow-2xl max-w-md w-full text-center relative">
            <div className="w-16 h-16 rounded-full bg-brand-red/20 border border-brand-red/50 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-hourglass-half text-3xl text-brand-red"></i>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              ¿Sigues ahí?
            </h3>

            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Tu tiempo de reserva ha finalizado. Tienes
              {" "}
              <strong className="text-brand-yellow font-bold text-base">
                {segundosGracia} segundos
              </strong>
              {" "}
              para confirmar si continúas antes de que tus butacas sean liberadas al público.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <button
                className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3.5 rounded-xl font-black transition-all shadow-lg shadow-brand-yellow/30"
                type="button"
                onClick={renovarTiempo}
              >
                <i className="fa-solid fa-check mr-2"></i>
                Mantener mi reserva (+5 min)
              </button>
              <button
                className="w-full text-slate-400 hover:text-white py-2 text-sm font-semibold transition-colors"
                type="button"
                onClick={cancelarYSalir}
              >
                Liberar asientos y salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
