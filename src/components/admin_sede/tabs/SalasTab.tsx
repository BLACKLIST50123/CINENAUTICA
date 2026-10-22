"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { SalaDetalleSedeDTO, AsientoAdminSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface SalasTabProps {
  idSede: number;
  salas: SalaDetalleSedeDTO[];
  onAbrirCrearSala: () => void;
  onRecargarSalas: () => void;
  onCambiosSinGuardarChange?: (hayCambios: boolean) => void;
}

interface FormatoGlobalItem {
  id_formato: number | string;
  codigo?: string;
  nombre: string;
}

type SubTabTipo = "dimensiones" | "estados";

// Letras para las filas (A, B, C...)
const LETRAS_FILAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function SalasTab({
  idSede,
  salas,
  onAbrirCrearSala,
  onRecargarSalas,
  onCambiosSinGuardarChange,
}: SalasTabProps) {
  const [salaIndex, setSalaIndex] = useState<number>(0);
  const [subtab, setSubtab] = useState<SubTabTipo>("dimensiones");

  // Formatos globales disponibles en la plataforma
  const [formatosGlobales, setFormatosGlobales] = useState<FormatoGlobalItem[]>([]);

  // Estados locales editables para la sala seleccionada
  const [filasInput, setFilasInput] = useState<number>(8);
  const [columnasInput, setColumnasInput] = useState<number>(8);
  const [pasillosLocales, setPasillosLocales] = useState<number[]>([]);
  const [formatosSeleccionados, setFormatosSeleccionados] = useState<string[]>([]);
  const [estadoOperativo, setEstadoOperativo] = useState<string>("ACTIVA");
  const [asientosMatriz, setAsientosMatriz] = useState<
    { fila: string; columna: number; tipo_asiento: string; en_mantenimiento: boolean }[]
  >([]);

  // Snapshot limpio y control de cambios no guardados
  const [snapshotLimpio, setSnapshotLimpio] = useState<string>("");
  const [salaDestinoPendiente, setSalaDestinoPendiente] = useState<number | null>(null);

  // Control de desplazamiento horizontal y botones para las pestañas de salas
  const salasScrollRef = useRef<HTMLDivElement>(null);
  const [puedeScrollIzq, setPuedeScrollIzq] = useState<boolean>(false);
  const [puedeScrollDer, setPuedeScrollDer] = useState<boolean>(false);

  const verificarScrollSalas = useCallback(() => {
    const el = salasScrollRef.current;
    if (!el) return;
    setPuedeScrollIzq(el.scrollLeft > 6);
    setPuedeScrollDer(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    verificarScrollSalas();
    const handleResize = () => verificarScrollSalas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [verificarScrollSalas, salas.length]);

  const scrollSalas = (direccion: "izq" | "der") => {
    const el = salasScrollRef.current;
    if (!el) return;
    const desplazamiento = 260;
    el.scrollBy({
      left: direccion === "izq" ? -desplazamiento : desplazamiento,
      behavior: "smooth",
    });
    setTimeout(verificarScrollSalas, 350);
  };

  const handleWheelSalas = (e: React.WheelEvent<HTMLDivElement>) => {
    if (salasScrollRef.current && e.deltaY !== 0) {
      salasScrollRef.current.scrollLeft += e.deltaY;
      verificarScrollSalas();
    }
  };

  // Modales y feedback
  const [mensajeAlerta, setMensajeAlerta] = useState<{ tipo: "error" | "exito"; texto: string } | null>(null);
  const [cargandoAccion, setCargandoAccion] = useState<boolean>(false);
  const [mostrarConfirmacionGuardar, setMostrarConfirmacionGuardar] = useState<boolean>(false);
  const [mostrarConfirmacionRestablecer, setMostrarConfirmacionRestablecer] = useState<boolean>(false);
  const [eliminarSalaPendiente, setEliminarSalaPendiente] = useState<SalaDetalleSedeDTO | null>(null);

  const salaActual: SalaDetalleSedeDTO | undefined = salas[salaIndex] || salas[0];

  const crearSnapshot = (filas: number, cols: number, estado: string, pasillos: number[], formatos: string[], asientos: any[]) => {
    return JSON.stringify({
      filas,
      cols,
      estado,
      pasillos: [...pasillos].sort((a, b) => a - b),
      formatos: [...formatos].sort(),
      asientos: asientos.map((a) => `${a.fila}:${a.columna}:${a.tipo_asiento}:${Boolean(a.en_mantenimiento)}`).sort(),
    });
  };

  const hayCambiosSinGuardar = useMemo(() => {
    if (!snapshotLimpio) return false;
    const actual = crearSnapshot(filasInput, columnasInput, estadoOperativo, pasillosLocales, formatosSeleccionados, asientosMatriz);
    return actual !== snapshotLimpio;
  }, [snapshotLimpio, filasInput, columnasInput, estadoOperativo, pasillosLocales, formatosSeleccionados, asientosMatriz]);

  useEffect(() => {
    onCambiosSinGuardarChange?.(hayCambiosSinGuardar);
  }, [hayCambiosSinGuardar, onCambiosSinGuardarChange]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hayCambiosSinGuardar) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hayCambiosSinGuardar]);

  // Cargar catálogo de formatos globales
  useEffect(() => {
    async function cargarFormatos() {
      const data = await AdminSedeDao.obtenerFormatosGlobales();
      setFormatosGlobales(data);
    }
    cargarFormatos();
  }, []);

  // Sincronizar estados locales cuando cambia la sala seleccionada
  const sincronizarSalaActual = (sala?: SalaDetalleSedeDTO) => {
    if (!sala) return;
    const f = sala.filas || 8;
    const c = sala.columnas || 8;
    setFilasInput(f);
    setColumnasInput(c);
    setPasillosLocales([...(sala.pasillos || [])]);
    setEstadoOperativo(sala.estado || "ACTIVA");

    // Formatos de la sala
    const formatosIds = (sala.formatos_soportados || []).map((fmt) => String(fmt.id_formato));
    setFormatosSeleccionados(formatosIds);

    // Mapear asientos existentes o inicializar matriz
    const mapaExistente = new Map<string, AsientoAdminSedeDTO>();
    (sala.asientos || []).forEach((a) => {
      mapaExistente.set(`${a.fila}-${a.columna}`, a);
    });

    const nuevaMatriz: { fila: string; columna: number; tipo_asiento: string; en_mantenimiento: boolean }[] = [];
    for (let r = 0; r < f; r++) {
      const letra = LETRAS_FILAS[r] || `F${r + 1}`;
      for (let col = 1; col <= c; col++) {
        const key = `${letra}-${col}`;
        const previo = mapaExistente.get(key);
        if (previo) {
          nuevaMatriz.push({
            fila: letra,
            columna: col,
            tipo_asiento: previo.tipo_asiento || "Normal",
            en_mantenimiento: Boolean(previo.en_mantenimiento),
          });
        } else {
          nuevaMatriz.push({
            fila: letra,
            columna: col,
            tipo_asiento: "Normal",
            en_mantenimiento: false,
          });
        }
      }
    }
    setAsientosMatriz(nuevaMatriz);
    setSnapshotLimpio(crearSnapshot(f, c, sala.estado || "ACTIVA", sala.pasillos || [], formatosIds, nuevaMatriz));
  };

  const handleSeleccionarSala = (idx: number) => {
    if (idx === salaIndex) return;
    if (hayCambiosSinGuardar) {
      setSalaDestinoPendiente(idx);
      return;
    }
    setSalaIndex(idx);
    sincronizarSalaActual(salas[idx]);
  };

  useEffect(() => {
    if (salaActual) {
      sincronizarSalaActual(salaActual);
    }
  }, [salaActual?.id_sala]);

  // Generar cuadrícula base con filas y columnas especificadas
  const generarCuadriculaBase = () => {
    const f = Math.max(1, Math.min(26, filasInput || 8));
    const c = Math.max(1, Math.min(30, columnasInput || 8));
    setFilasInput(f);
    setColumnasInput(c);

    // Filtrar pasillos que queden fuera de las nuevas columnas
    const pasillosValidos = pasillosLocales.filter((col) => col <= c);
    setPasillosLocales(pasillosValidos);

    const mapaPrevio = new Map<string, { tipo_asiento: string; en_mantenimiento: boolean }>();
    asientosMatriz.forEach((a) => {
      mapaPrevio.set(`${a.fila}-${a.columna}`, {
        tipo_asiento: a.tipo_asiento,
        en_mantenimiento: a.en_mantenimiento,
      });
    });

    const nuevaMatriz: { fila: string; columna: number; tipo_asiento: string; en_mantenimiento: boolean }[] = [];
    for (let r = 0; r < f; r++) {
      const letra = LETRAS_FILAS[r] || `F${r + 1}`;
      for (let col = 1; col <= c; col++) {
        const key = `${letra}-${col}`;
        const prev = mapaPrevio.get(key);
        nuevaMatriz.push({
          fila: letra,
          columna: col,
          tipo_asiento: prev ? prev.tipo_asiento : "Normal",
          en_mantenimiento: prev ? prev.en_mantenimiento : false,
        });
      }
    }
    setAsientosMatriz(nuevaMatriz);
  };

  // Alternar columna como pasillo
  const alternarColumnaPasillo = (col: number) => {
    setPasillosLocales((prev) => {
      if (prev.includes(col)) {
        return prev.filter((p) => p !== col);
      } else {
        return [...prev, col].sort((a, b) => a - b);
      }
    });
  };

  // En subtab de estados: ciclar estado de la butaca
  // Normal (Disponible) -> En Mantenimiento -> Accesible / Silla de ruedas -> Normal
  const ciclarEstadoButaca = (fila: string, columna: number) => {
    if (pasillosLocales.includes(columna)) return;

    setAsientosMatriz((prev) =>
      prev.map((a) => {
        if (a.fila === fila && a.columna === columna) {
          const esAccesible = a.tipo_asiento.toLowerCase() === "discapacitado" || a.tipo_asiento.toLowerCase() === "accesible";
          const esMantenimiento = a.en_mantenimiento;

          // Ciclo:
          // 1. Si era Normal y Disponible -> Pasa a En Mantenimiento
          // 2. Si era Mantenimiento -> Pasa a Accesible (no mantenimiento)
          // 3. Si era Accesible -> Vuelve a Normal Disponible
          if (!esMantenimiento && !esAccesible) {
            return { ...a, en_mantenimiento: true, tipo_asiento: "Normal" };
          } else if (esMantenimiento) {
            return { ...a, en_mantenimiento: false, tipo_asiento: "Discapacitado" };
          } else {
            return { ...a, en_mantenimiento: false, tipo_asiento: "Normal" };
          }
        }
        return a;
      })
    );
  };

  // Alternar selección de un formato
  const alternarFormato = (idFormato: string) => {
    setFormatosSeleccionados((prev) =>
      prev.includes(idFormato) ? prev.filter((id) => id !== idFormato) : [...prev, idFormato]
    );
  };

  // Cálculo de estadísticas
  const capacidadCalculada = useMemo(() => {
    return asientosMatriz.filter((a) => !pasillosLocales.includes(a.columna)).length;
  }, [asientosMatriz, pasillosLocales]);

  const butacasMantenimientoCount = useMemo(() => {
    return asientosMatriz.filter((a) => !pasillosLocales.includes(a.columna) && a.en_mantenimiento).length;
  }, [asientosMatriz, pasillosLocales]);

  const butacasAccesiblesCount = useMemo(() => {
    return asientosMatriz.filter(
      (a) =>
        !pasillosLocales.includes(a.columna) &&
        !a.en_mantenimiento &&
        (a.tipo_asiento.toLowerCase() === "discapacitado" || a.tipo_asiento.toLowerCase() === "accesible")
    ).length;
  }, [asientosMatriz, pasillosLocales]);

  // Guardar configuración completa en base de datos
  const ejecutarGuardarCambios = async () => {
    if (!salaActual) return;
    setCargandoAccion(true);
    setMensajeAlerta(null);

    try {
      // 1. Guardar estructura y asientos
      const resEstructura = await AdminSedeDao.guardarEstructuraYAsientosSala(
        salaActual.id_sala,
        filasInput,
        columnasInput,
        pasillosLocales,
        asientosMatriz
      );

      if (!resEstructura.exito) {
        throw new Error(resEstructura.mensaje);
      }

      // 2. Guardar formatos soportados
      const formatosOk = await AdminSedeDao.actualizarFormatosSala(
        salaActual.id_sala,
        formatosSeleccionados
      );

      if (!formatosOk) {
        throw new Error("No se pudieron actualizar los formatos admitidos de la sala.");
      }

      // 3. Guardar estado operativo si cambió
      if (estadoOperativo !== salaActual.estado) {
        await AdminSedeDao.actualizarConfiguracionSala(salaActual.id_sala, estadoOperativo);
      }

      setMensajeAlerta({
        tipo: "exito",
        texto: `Configuración de '${salaActual.nombre_sala}' guardada exitosamente.`,
      });
      setSnapshotLimpio(crearSnapshot(filasInput, columnasInput, estadoOperativo, pasillosLocales, formatosSeleccionados, asientosMatriz));
      setMostrarConfirmacionGuardar(false);
      onRecargarSalas();
    } catch (err: any) {
      setMensajeAlerta({
        tipo: "error",
        texto: err.message || "Ocurrió un error al guardar los cambios de la sala.",
      });
      setMostrarConfirmacionGuardar(false);
    } finally {
      setCargandoAccion(false);
    }
  };

  // Restablecer cambios sin guardar
  const confirmarRestablecer = () => {
    sincronizarSalaActual(salaActual);
    setMostrarConfirmacionRestablecer(false);
    setMensajeAlerta({ tipo: "exito", texto: "Cambios revertidos a la última versión guardada." });
  };

  // Eliminar sala con validación
  const confirmarEliminarSala = async () => {
    if (!eliminarSalaPendiente) return;
    setCargandoAccion(true);

    const res = await AdminSedeDao.eliminarSalaSede(eliminarSalaPendiente.id_sala);
    setCargandoAccion(false);
    setEliminarSalaPendiente(null);

    if (res.exito) {
      setMensajeAlerta({ tipo: "exito", texto: res.mensaje });
      setSalaIndex(0);
      onRecargarSalas();
    } else {
      setMensajeAlerta({ tipo: "error", texto: res.mensaje });
    }
  };

  if (!salaActual) {
    return (
      <div className="bg-[#0D1627] border border-white/10 rounded-2xl p-12 text-center shadow-xl">
        <i className="fa-solid fa-film text-4xl text-slate-600 mb-3"></i>
        <p className="text-slate-300 font-medium text-sm mb-4">No hay salas registradas en esta sede.</p>
        <button
          type="button"
          onClick={onAbrirCrearSala}
          className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-colors"
        >
          Crear Primera Sala
        </button>
      </div>
    );
  }

  // Agrupar la matriz local por fila
  const matrizPorFila = new Map<string, { fila: string; columna: number; tipo_asiento: string; en_mantenimiento: boolean }[]>();
  asientosMatriz.forEach((a) => {
    const list = matrizPorFila.get(a.fila) || [];
    list.push(a);
    matrizPorFila.set(a.fila, list);
  });

  return (
    <div className="space-y-6">
      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Gestión de Salas y Butacas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura la matriz de butacas, pasillos, formatos admitidos y estado operativo de cada sala
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirCrearSala}
          className="px-4 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-yellow-500/10 self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus text-[11px]"></i>
          <span>Nueva Sala</span>
        </button>
      </div>

      {mensajeAlerta && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            mensajeAlerta.tipo === "error"
              ? "bg-red-500/10 border-brand-red/30 text-brand-red"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${mensajeAlerta.tipo === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`}></i>
            <span>{mensajeAlerta.texto}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeAlerta(null)}
            className="text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Selector Horizontal de Salas con Botones de Navegación y Barra Deslizable */}
      <div className="relative flex items-center gap-2">
        {/* Botón Scroll Izquierda */}
        <button
          type="button"
          onClick={() => scrollSalas("izq")}
          disabled={!puedeScrollIzq}
          aria-label="Desplazar salas a la izquierda"
          title="Desplazar salas a la izquierda"
          className="w-8 h-8 rounded-xl bg-[#0D1627] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {/* Contenedor Horizontal con Scroll Limpio (Barra oculta) */}
        <div
          ref={salasScrollRef}
          onScroll={verificarScrollSalas}
          onWheel={handleWheelSalas}
          className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none select-none"
        >
          {salas.map((s, idx) => {
            const seleccionada = salaIndex === idx;
            return (
              <button
                key={s.id_sala}
                type="button"
                onClick={() => handleSeleccionarSala(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2.5 shrink-0 ${
                  seleccionada
                    ? "bg-brand-blue text-white border-brand-blue font-bold shadow-lg shadow-sky-500/20"
                    : "bg-[#0D1627] border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <i className="fa-solid fa-door-open text-[11px]"></i>
                <span>{s.nombre_sala}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    s.estado === "ACTIVA"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {s.estado === "ACTIVA" ? "Activa" : "Mant."}
                </span>
              </button>
            );
          })}
        </div>

        {/* Botón Scroll Derecha */}
        <button
          type="button"
          onClick={() => scrollSalas("der")}
          disabled={!puedeScrollDer}
          aria-label="Desplazar salas a la derecha"
          title="Desplazar salas a la derecha"
          className="w-8 h-8 rounded-xl bg-[#0D1627] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Contenedor Principal de la Sala Seleccionada */}
      <div className="bg-[#0D1627] border border-white/15 rounded-2xl p-5 md:p-6 shadow-2xl space-y-6">
        {/* Barra Superior de la Sala: Estado, Formatos y Butacas */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-white">{salaActual.nombre_sala}</h3>
              {/* Badge Butacas */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                <span className="text-slate-400">Butacas:</span>
                <span className="font-bold text-white">
                  {butacasMantenimientoCount} / {capacidadCalculada}
                </span>
                {butacasMantenimientoCount > 0 && (
                  <span className="text-[10px] text-amber-400 font-semibold">({butacasMantenimientoCount} mant.)</span>
                )}
              </div>
            </div>

            {/* Chips de Formatos Admitidos */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Formatos:
              </span>
              {(formatosGlobales.length > 0
                ? formatosGlobales
                : [
                    { id_formato: "1", nombre: "2D" },
                    { id_formato: "2", nombre: "3D" },
                    { id_formato: "3", nombre: "4DX" },
                    { id_formato: "4", nombre: "XD" },
                    { id_formato: "5", nombre: "VIP" },
                    { id_formato: "6", nombre: "D-BOX" },
                    { id_formato: "7", nombre: "IMAX" },
                  ]
              ).map((fmt) => {
                const idStr = String(fmt.id_formato);
                const activo = formatosSeleccionados.includes(idStr);
                return (
                  <button
                    key={idStr}
                    type="button"
                    onClick={() => alternarFormato(idStr)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      activo
                        ? "bg-brand-blue/20 text-brand-blue border-brand-blue/50 shadow-sm shadow-sky-500/20"
                        : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {fmt.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Estado Operativo y Botón Eliminar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Estado Operativo:
              </span>
              <button
                type="button"
                onClick={() => setEstadoOperativo("ACTIVA")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  estadoOperativo === "ACTIVA"
                    ? "bg-emerald-500 text-dark-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Activa
              </button>
              <button
                type="button"
                onClick={() => setEstadoOperativo("MANTENIMIENTO")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  estadoOperativo === "MANTENIMIENTO"
                    ? "bg-amber-500 text-dark-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mantenimiento
              </button>
            </div>

            <button
              type="button"
              onClick={() => setEliminarSalaPendiente(salaActual)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-brand-red hover:bg-red-500/10 border border-brand-red/30 transition-colors flex items-center gap-1.5"
              title="Eliminar Sala"
            >
              <i className="fa-solid fa-trash-can text-[11px]"></i>
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        </div>

        {/* Selector de Sub-Tabs: Dimensiones y Estructura vs Estado de Butacas */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setSubtab("dimensiones")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              subtab === "dimensiones"
                ? "bg-white/15 text-white border-white/30 shadow-md"
                : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <i className="fa-solid fa-table-cells text-brand-yellow"></i>
            <span>Dimensiones y Estructura</span>
          </button>
          <button
            type="button"
            onClick={() => setSubtab("estados")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              subtab === "estados"
                ? "bg-white/15 text-white border-white/30 shadow-md"
                : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <i className="fa-solid fa-couch text-sky-400"></i>
            <span>Estado de Butacas</span>
          </button>
        </div>

        {/* Controles de Sub-Tab 1: Dimensiones y Estructura */}
        {subtab === "dimensiones" && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300 font-semibold">Filas:</label>
                <input
                  type="number"
                  min="1"
                  max="26"
                  value={filasInput}
                  onChange={(e) => setFilasInput(parseInt(e.target.value) || 1)}
                  className="w-16 bg-[#070d18] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300 font-semibold">Columnas:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={columnasInput}
                  onChange={(e) => setColumnasInput(parseInt(e.target.value) || 1)}
                  className="w-16 bg-[#070d18] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <button
                type="button"
                onClick={generarCuadriculaBase}
                className="px-3.5 py-1.5 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i className="fa-solid fa-rotate text-[11px]"></i>
                <span>Generar Cuadrícula Base</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-sky-400"></i>
              <span>Haz clic en el número de columna o en una butaca para convertir la columna en <b>pasillo</b>.</span>
            </p>
          </div>
        )}

        {/* Controles de Sub-Tab 2: Estado de Butacas */}
        {subtab === "estados" && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <i className="fa-solid fa-hand-pointer text-brand-yellow"></i>
              <span>Haz clic en cada butaca para alternar: <b>Disponible</b> → <b>Mantenimiento</b> → <b>Accesible</b>.</span>
            </div>

            {/* Leyenda de Estados */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-400 inline-block"></span>
                <span>Disponible ({capacidadCalculada - butacasMantenimientoCount - butacasAccesiblesCount})</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3.5 h-3.5 rounded bg-rose-500/20 border border-rose-400 inline-block"></span>
                <span>Mantenimiento ({butacasMantenimientoCount})</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3.5 h-3.5 rounded bg-brand-blue/20 border border-brand-blue inline-block"></span>
                <span>Accesible ({butacasAccesiblesCount})</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3.5 h-3.5 rounded border border-dashed border-white/20 inline-block"></span>
                <span>Pasillo</span>
              </span>
            </div>
          </div>
        )}

        {/* Representación Visual: Pantalla Curvada y Matriz */}
        <div className="max-w-4xl mx-auto pt-2">
          {/* Pantalla Curvada Brillante */}
          <div className="relative mb-8 text-center">
            <div className="w-3/4 mx-auto h-3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)]"></div>
            <div className="w-full mx-auto h-1 bg-gradient-to-r from-transparent via-sky-300/40 to-transparent rounded-full -mt-1 blur-sm"></div>
            <span className="block text-[11px] uppercase font-extrabold tracking-[0.25em] text-slate-400 mt-2">
              P A N T A L L A
            </span>
          </div>

          {/* Matriz interactiva de butacas */}
          <div className="overflow-x-auto pb-6 pt-2 flex justify-center">
            <div className="inline-flex flex-col gap-2 min-w-max">
              {/* Selector / Encabezado de Columnas en Subtab Dimensiones (Alineado exactamente con cada columna) */}
              {subtab === "dimensiones" && (
                <div className="flex items-center gap-2 mb-1">
                  {/* Espaciador izquierdo que calza exactamente con la letra de fila */}
                  <span className="w-6 shrink-0 select-none"></span>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: columnasInput }).map((_, cIdx) => {
                      const colNum = cIdx + 1;
                      const esPasillo = pasillosLocales.includes(colNum);
                      return (
                        <button
                          key={colNum}
                          type="button"
                          onClick={() => alternarColumnaPasillo(colNum)}
                          title={`Columna ${colNum}: ${esPasillo ? "Pasillo (Clic para restaurar)" : "Butacas (Clic para hacer pasillo)"}`}
                          className={`w-10 md:w-11 h-6 md:h-7 rounded text-[10px] md:text-xs font-bold font-mono transition-all flex items-center justify-center border shrink-0 ${
                            esPasillo
                              ? "bg-amber-500/20 text-amber-300 border-dashed border-amber-400/50"
                              : "bg-white/5 text-slate-400 border-white/10 hover:border-brand-yellow hover:text-white"
                          }`}
                        >
                          {esPasillo ? "PAS" : colNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Espaciador derecho que calza con la letra de fila derecha */}
                  <span className="w-6 shrink-0 select-none"></span>
                </div>
              )}

              {Array.from(matrizPorFila.entries()).map(([fila, listaAsientos]) => (
                <div key={fila} className="flex items-center gap-2">
                  {/* Letra izquierda */}
                  <span className="w-6 text-xs font-bold text-slate-400 font-mono text-center select-none shrink-0">
                    {fila}
                  </span>

                  <div className="flex items-center gap-2">
                    {listaAsientos.map((asiento) => {
                      const esPasillo = pasillosLocales.includes(asiento.columna);
                      const esMantenimiento = asiento.en_mantenimiento;
                      const esAccesible =
                        asiento.tipo_asiento.toLowerCase() === "discapacitado" ||
                        asiento.tipo_asiento.toLowerCase() === "accesible";

                      if (esPasillo) {
                        return (
                          <div
                            key={`${asiento.fila}-${asiento.columna}`}
                            onClick={() => {
                              if (subtab === "dimensiones") {
                                alternarColumnaPasillo(asiento.columna);
                              }
                            }}
                            title={`Pasillo (Columna ${asiento.columna})`}
                            className={`w-10 md:w-11 h-9 md:h-10 rounded border border-dashed border-white/15 bg-transparent flex items-center justify-center text-slate-600 text-[10px] shrink-0 ${
                              subtab === "dimensiones" ? "cursor-pointer hover:border-brand-yellow/50" : "select-none opacity-40"
                            }`}
                          >
                            <i className="fa-solid fa-shoe-prints text-[10px] opacity-40"></i>
                          </div>
                        );
                      }

                      // Estilos idénticos a Counter POS
                      let claseColor =
                        "bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer hover:scale-105 border-b-4 border-black/40";
                      let contenidoButaca: React.ReactNode = `${asiento.fila}${asiento.columna}`;

                      if (esMantenimiento) {
                        claseColor =
                          "bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer hover:scale-105 border-b-4 border-black/60";
                        contenidoButaca = (
                          <div className="flex flex-col items-center justify-center leading-none">
                            <i className="fa-solid fa-wrench text-[9px] mb-0.5"></i>
                            <span className="text-[9px] md:text-[10px] font-mono font-extrabold tracking-tighter">
                              {asiento.fila}{asiento.columna}
                            </span>
                          </div>
                        );
                      } else if (esAccesible) {
                        claseColor =
                          "bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer hover:scale-105 border-b-4 border-black/50";
                        contenidoButaca = (
                          <div className="flex flex-col items-center justify-center leading-none">
                            <i className="fa-solid fa-wheelchair text-[10px] mb-0.5"></i>
                            <span className="text-[9px] md:text-[10px] font-mono font-extrabold tracking-tighter">
                              {asiento.fila}{asiento.columna}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={`${asiento.fila}-${asiento.columna}`}
                          type="button"
                          onClick={() => {
                            if (subtab === "dimensiones") {
                              alternarColumnaPasillo(asiento.columna);
                            } else {
                              ciclarEstadoButaca(asiento.fila, asiento.columna);
                            }
                          }}
                          title={`Butaca ${asiento.fila}${asiento.columna} - ${
                            esMantenimiento
                              ? "En Mantenimiento (Clic para cambiar)"
                              : esAccesible
                              ? "Asiento Accesible (Clic para cambiar)"
                              : "Disponible (Clic para cambiar)"
                          }`}
                          className={`w-10 md:w-11 h-9 md:h-10 rounded-t-lg rounded-b-sm flex items-center justify-center text-[10px] md:text-xs font-mono font-extrabold tracking-tight transition-all shrink-0 active:scale-95 shadow-sm ${claseColor}`}
                        >
                          {contenidoButaca}
                        </button>
                      );
                    })}
                  </div>

                  {/* Letra derecha */}
                  <span className="w-6 text-xs font-bold text-slate-400 font-mono text-center select-none shrink-0">
                    {fila}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones Inferiores: Restablecer y Guardar Cambios */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            <span>Aforo activo: </span>
            <b className="text-white">{capacidadCalculada - butacasMantenimientoCount}</b>
            <span> de </span>
            <b className="text-white">{capacidadCalculada} butacas</b>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={cargandoAccion}
              onClick={() => setMostrarConfirmacionRestablecer(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i>
              <span>Restablecer</span>
            </button>

            <button
              type="button"
              disabled={cargandoAccion}
              onClick={() => setMostrarConfirmacionGuardar(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 transition-colors flex items-center justify-center gap-2 shadow-md shadow-yellow-500/10"
            >
              <i className="fa-solid fa-floppy-disk text-[11px]"></i>
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para Guardar Cambios */}
      <ModalConfirmacion
        abierto={mostrarConfirmacionGuardar}
        titulo="¿Guardar Cambios en la Sala?"
        mensaje={`Se actualizarán las dimensiones (${filasInput} filas × ${columnasInput} columnas), formatos admitidos (${formatosSeleccionados.length} seleccionados), estado operativo (${estadoOperativo}) y el aforo (${capacidadCalculada} butacas totales, ${butacasMantenimientoCount} en mantenimiento) de '${salaActual.nombre_sala}'.`}
        tipo="info"
        textoConfirmar="Sí, Guardar Cambios"
        textoCancelar="Cancelar"
        cargando={cargandoAccion}
        onConfirmar={ejecutarGuardarCambios}
        onCancelar={() => setMostrarConfirmacionGuardar(false)}
      />

      {/* Modal de confirmación para Restablecer */}
      <ModalConfirmacion
        abierto={mostrarConfirmacionRestablecer}
        titulo="¿Revertir Cambios sin Guardar?"
        mensaje="Se descartarán las modificaciones realizadas en la cuadrícula, pasillos y estados de las butacas, volviendo a los datos guardados en el servidor."
        tipo="advertencia"
        textoConfirmar="Sí, Revertir"
        textoCancelar="Cancelar"
        onConfirmar={confirmarRestablecer}
        onCancelar={() => setMostrarConfirmacionRestablecer(false)}
      />

      {/* Modal de confirmación para Eliminar Sala */}
      <ModalConfirmacion
        abierto={!!eliminarSalaPendiente}
        titulo="¿Eliminar Esta Sala?"
        mensaje={`Se eliminará permanentemente '${eliminarSalaPendiente?.nombre_sala}' y toda su distribución de butacas. El sistema validará que no tenga funciones activas programadas.`}
        tipo="peligro"
        textoConfirmar="Sí, Eliminar Sala"
        textoCancelar="Cancelar"
        cargando={cargandoAccion}
        onConfirmar={confirmarEliminarSala}
        onCancelar={() => setEliminarSalaPendiente(null)}
      />

      {/* Modal de confirmación para Descartar Cambios no guardados al cambiar de sala */}
      <ModalConfirmacion
        abierto={salaDestinoPendiente !== null}
        titulo="¿Descartar cambios no guardados?"
        mensaje="Has realizado modificaciones en la estructura o butacas de la sala actual. Si sales ahora, se perderán todos los cambios que hayas hecho."
        tipo="advertencia"
        textoConfirmar="Salir"
        textoCancelar="Volver"
        onConfirmar={() => {
          const idx = salaDestinoPendiente!;
          setSalaDestinoPendiente(null);
          setSalaIndex(idx);
          sincronizarSalaActual(salas[idx]);
        }}
        onCancelar={() => setSalaDestinoPendiente(null)}
      />
    </div>
  );
}
