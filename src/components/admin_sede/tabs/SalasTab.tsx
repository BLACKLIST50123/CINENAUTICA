"use client";

import React, { useState } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { SalaDetalleSedeDTO, AsientoAdminSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface SalasTabProps {
  idSede: number;
  salas: SalaDetalleSedeDTO[];
  onAbrirCrearSala: () => void;
  onRecargarSalas: () => void;
}

export default function SalasTab({
  idSede,
  salas,
  onAbrirCrearSala,
  onRecargarSalas,
}: SalasTabProps) {
  const [salaIndex, setSalaIndex] = useState<number>(0);
  const [asientoMantenimientoPendiente, setAsientoMantenimientoPendiente] = useState<AsientoAdminSedeDTO | null>(null);
  const [eliminarSalaPendiente, setEliminarSalaPendiente] = useState<SalaDetalleSedeDTO | null>(null);
  const [mensajeAlerta, setMensajeAlerta] = useState<{ tipo: "error" | "exito"; texto: string } | null>(null);
  const [cargandoAccion, setCargandoAccion] = useState<boolean>(false);

  const salaActual: SalaDetalleSedeDTO | undefined = salas[salaIndex] || salas[0];

  // Alternar mantenimiento de un asiento
  const confirmarAlternarMantenimiento = async () => {
    if (!asientoMantenimientoPendiente) return;
    setCargandoAccion(true);

    const nuevoEstado = !asientoMantenimientoPendiente.en_mantenimiento;
    const ok = await AdminSedeDao.actualizarMantenimientoAsiento(
      asientoMantenimientoPendiente.id_asiento,
      nuevoEstado
    );

    setCargandoAccion(false);
    setAsientoMantenimientoPendiente(null);

    if (ok) {
      onRecargarSalas();
    } else {
      setMensajeAlerta({ tipo: "error", texto: "No se pudo actualizar el estado de la butaca." });
    }
  };

  const [salaEstadoPendiente, setSalaEstadoPendiente] = useState<{
    sala: SalaDetalleSedeDTO;
    nuevoEstado: "ACTIVA" | "MANTENIMIENTO";
  } | null>(null);

  // Alternar estado de la sala (ACTIVA <-> MANTENIMIENTO) con confirmación previa
  const solicitarAlternarEstadoSala = () => {
    if (!salaActual) return;
    const nuevoEstado = salaActual.estado === "ACTIVA" ? "MANTENIMIENTO" : "ACTIVA";
    setSalaEstadoPendiente({ sala: salaActual, nuevoEstado });
  };

  const confirmarAlternarEstadoSala = async () => {
    if (!salaEstadoPendiente) return;
    setCargandoAccion(true);

    const ok = await AdminSedeDao.actualizarConfiguracionSala(
      salaEstadoPendiente.sala.id_sala,
      salaEstadoPendiente.nuevoEstado
    );

    setCargandoAccion(false);
    setSalaEstadoPendiente(null);

    if (ok) {
      setMensajeAlerta({
        tipo: "exito",
        texto: `Sala '${salaEstadoPendiente.sala.nombre_sala}' actualizada a estado ${salaEstadoPendiente.nuevoEstado}.`,
      });
      onRecargarSalas();
    } else {
      setMensajeAlerta({
        tipo: "error",
        texto: "No se pudo actualizar el estado de la sala en la base de datos.",
      });
    }
  };

  // Confirmar eliminación de sala con validación de seguridad
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
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-12 text-center">
        <p className="text-slate-400 text-sm mb-4">No hay salas registradas en esta sede.</p>
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

  // Agrupar asientos por fila
  const asientosPorFila = new Map<string, AsientoAdminSedeDTO[]>();
  (salaActual.asientos || []).forEach((a) => {
    const list = asientosPorFila.get(a.fila) || [];
    list.push(a);
    asientosPorFila.set(a.fila, list);
  });

  const butacasMantenimientoCount = salaActual.asientos.filter((a) => a.en_mantenimiento).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Gestión de Salas y Butacas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervisión de aforo, formatos admitidos y control de butacas en mantenimiento
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirCrearSala}
          className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
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

      {/* Pestañas de Salas de la Sede */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {salas.map((s, idx) => (
          <button
            key={s.id_sala}
            type="button"
            onClick={() => setSalaIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
              salaIndex === idx
                ? "bg-brand-blue text-white border-brand-blue font-bold shadow-lg shadow-sky-500/15"
                : "bg-dark-900 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className="fa-solid fa-door-open text-[11px]"></i>
            <span>{s.nombre_sala}</span>
          </button>
        ))}
      </div>

      {/* Panel de Control de la Sala Actual */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{salaActual.nombre_sala}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  salaActual.estado === "ACTIVA"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-brand-yellow border border-amber-500/20"
                }`}
              >
                {salaActual.estado === "ACTIVA" ? "Sala Activa" : "En Mantenimiento"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Capacidad: <b>{salaActual.capacidad_total} butacas</b> ({salaActual.filas} filas × {salaActual.columnas} columnas) · {butacasMantenimientoCount} butacas bloqueadas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={cargandoAccion}
              onClick={solicitarAlternarEstadoSala}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-white border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-power-off text-brand-yellow text-[10px]"></i>
              <span>{salaActual.estado === "ACTIVA" ? "Pausar Sala" : "Activar Sala"}</span>
            </button>

            <button
              type="button"
              disabled={cargandoAccion}
              onClick={() => setEliminarSalaPendiente(salaActual)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-red hover:bg-red-500/10 border border-brand-red/30 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-trash-can text-[10px]"></i>
              <span>Eliminar Sala</span>
            </button>
          </div>
        </div>

        {/* Guía Visual y Leyenda */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs bg-dark-800/60 p-3 rounded-xl border border-white/5">
          <span className="text-slate-400">
            <i className="fa-solid fa-hand-pointer text-brand-yellow mr-1.5"></i>
            Haz clic en una butaca para alternar su estado entre <b>Disponible</b> o <b>Mantenimiento</b>.
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3.5 h-3.5 rounded bg-brand-blue border border-sky-400 inline-block"></span>
              <span>Disponible</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-brand-yellow inline-block"></span>
              <span>Mantenimiento</span>
            </span>
          </div>
        </div>

        {/* Pantalla del Cine */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="w-full h-2.5 bg-gradient-to-r from-transparent via-brand-blue to-transparent rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)] mb-2"></div>
          <span className="block text-center text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-8">
            Pantalla de Proyección
          </span>

          {/* Matriz interactiva de butacas */}
          <div className="overflow-x-auto pb-4 flex justify-center">
            <div className="inline-flex flex-col gap-2 min-w-max">
              {Array.from(asientosPorFila.entries()).map(([fila, listaAsientos]) => (
                <div key={fila} className="flex items-center gap-2">
                  <span className="w-5 text-xs font-bold text-slate-500 font-mono text-center">
                    {fila}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {listaAsientos.map((asiento) => {
                      const esMantenimiento = asiento.en_mantenimiento;
                      const esPasillo = (salaActual.pasillos || []).includes(asiento.columna);

                      return (
                        <button
                          key={asiento.id_asiento}
                          type="button"
                          onClick={() => setAsientoMantenimientoPendiente(asiento)}
                          title={`Butaca ${asiento.fila}${asiento.columna} - ${esMantenimiento ? "En Mantenimiento" : "Disponible"}`}
                          className={`w-7 h-7 rounded text-[10px] font-bold font-mono transition-all flex items-center justify-center ${
                            esPasillo ? "mr-4" : ""
                          } ${
                            esMantenimiento
                              ? "bg-amber-500/20 text-brand-yellow border border-brand-yellow hover:bg-amber-500/30"
                              : "bg-dark-800 text-slate-300 border border-white/10 hover:border-brand-blue hover:text-white hover:bg-brand-blue/20"
                          }`}
                        >
                          {asiento.columna}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-5 text-xs font-bold text-slate-500 font-mono text-center">
                    {fila}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para alternar estado de butaca */}
      <ModalConfirmacion
        abierto={!!asientoMantenimientoPendiente}
        titulo={
          asientoMantenimientoPendiente?.en_mantenimiento
            ? "¿Habilitar Butaca?"
            : "¿Poner Butaca en Mantenimiento?"
        }
        mensaje={
          asientoMantenimientoPendiente?.en_mantenimiento
            ? `La butaca ${asientoMantenimientoPendiente?.fila}${asientoMantenimientoPendiente?.columna} volverá a estar disponible para la venta en todas las funciones futuras.`
            : `La butaca ${asientoMantenimientoPendiente?.fila}${asientoMantenimientoPendiente?.columna} se marcará en mantenimiento y no podrá ser comprada por ningún cliente ni counter.`
        }
        tipo={asientoMantenimientoPendiente?.en_mantenimiento ? "info" : "advertencia"}
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
        cargando={cargandoAccion}
        onConfirmar={confirmarAlternarMantenimiento}
        onCancelar={() => setAsientoMantenimientoPendiente(null)}
      />

      {/* Modal de confirmación para eliminar sala */}
      <ModalConfirmacion
        abierto={!!eliminarSalaPendiente}
        titulo="¿Eliminar Esta Sala?"
        mensaje={`Se eliminará permanentemente la '${eliminarSalaPendiente?.nombre_sala}' y toda su distribución de butacas. El sistema validará que no tenga funciones activas programadas.`}
        tipo="peligro"
        textoConfirmar="Sí, Eliminar Sala"
        textoCancelar="Cancelar"
        cargando={cargandoAccion}
        onConfirmar={confirmarEliminarSala}
        onCancelar={() => setEliminarSalaPendiente(null)}
      />

      {/* Modal de confirmación para pausar o activar sala */}
      <ModalConfirmacion
        abierto={!!salaEstadoPendiente}
        titulo={
          salaEstadoPendiente?.nuevoEstado === "MANTENIMIENTO"
            ? "¿Pausar Operaciones en esta Sala?"
            : "¿Activar Sala para Funciones?"
        }
        mensaje={
          salaEstadoPendiente?.nuevoEstado === "MANTENIMIENTO"
            ? `La '${salaEstadoPendiente?.sala.nombre_sala}' se pondrá en MANTENIMIENTO. No se podrán programar nuevas proyecciones en esta sala hasta que sea reactivada.`
            : `La '${salaEstadoPendiente?.sala.nombre_sala}' pasará al estado ACTIVA y estará disponible para programar cartelera y proyecciones.`
        }
        tipo={salaEstadoPendiente?.nuevoEstado === "MANTENIMIENTO" ? "advertencia" : "info"}
        textoConfirmar={
          salaEstadoPendiente?.nuevoEstado === "MANTENIMIENTO"
            ? "Sí, Pausar Sala"
            : "Sí, Activar Sala"
        }
        textoCancelar="Cancelar"
        cargando={cargandoAccion}
        onConfirmar={confirmarAlternarEstadoSala}
        onCancelar={() => setSalaEstadoPendiente(null)}
      />
    </div>
  );
}
