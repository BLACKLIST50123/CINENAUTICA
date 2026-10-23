"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type {
  TarifaGlobalDTO,
  FormatoProyeccionGlobalDTO,
  TipoEntradaGlobalDTO,
} from "@/src/dtos/adminGeneral";
import ModalConfirmacion from "@/src/components/admin_sede/comun/ModalConfirmacion";

interface TarifasGlobalTabProps {
  recargarTrigger: number;
  onRecargar: () => void;
}

export default function TarifasGlobalTab({ recargarTrigger, onRecargar }: TarifasGlobalTabProps) {
  const [tarifas, setTarifas] = useState<TarifaGlobalDTO[]>([]);
  const [formatos, setFormatos] = useState<FormatoProyeccionGlobalDTO[]>([]);
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntradaGlobalDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Estados de edición
  const [tarifaEditar, setTarifaEditar] = useState<TarifaGlobalDTO | null>(null);
  const [nuevoPrecioTarifa, setNuevoPrecioTarifa] = useState<string>("");

  const [formatoEditar, setFormatoEditar] = useState<FormatoProyeccionGlobalDTO | null>(null);
  const [nuevoRecargoFormato, setNuevoRecargoFormato] = useState<string>("");

  const [tipoEntradaEditar, setTipoEntradaEditar] = useState<TipoEntradaGlobalDTO | null>(null);
  const [nuevoDescuentoEntrada, setNuevoDescuentoEntrada] = useState<string>("");

  const [guardando, setGuardando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string>("");

  // Modales de Confirmación
  const [confirmarGuardarTarifa, setConfirmarGuardarTarifa] = useState<boolean>(false);
  const [confirmarGuardarFormato, setConfirmarGuardarFormato] = useState<boolean>(false);
  const [confirmarGuardarTipoEntrada, setConfirmarGuardarTipoEntrada] = useState<boolean>(false);

  const [toast, setToast] = useState<{ mensaje: string; tipo: "ok" | "error" } | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    const [tfs, fmts, tEntradas] = await Promise.all([
      AdminGeneralDao.obtenerTarifasGlobales(),
      AdminGeneralDao.obtenerFormatosProyeccion(),
      AdminGeneralDao.obtenerTiposEntrada(),
    ]);
    setTarifas(tfs);
    setFormatos(fmts);
    setTiposEntrada(tEntradas);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos, recargarTrigger]);

  const mostrarToast = (mensaje: string, tipo: "ok" | "error" = "ok") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Tarifas por Día ──
  const abrirEditarTarifa = (t: TarifaGlobalDTO) => {
    setTarifaEditar(t);
    setNuevoPrecioTarifa(t.precio_general.toFixed(2));
    setErrorValidacion("");
  };

  const solicitarGuardarTarifa = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nuevoPrecioTarifa);
    if (isNaN(val) || val <= 0) {
      setErrorValidacion("El precio debe ser un número positivo mayor a S/ 0.00.");
      return;
    }
    setErrorValidacion("");
    setConfirmarGuardarTarifa(true);
  };

  const ejecutarGuardarTarifa = async () => {
    if (!tarifaEditar) return;
    setGuardando(true);
    setConfirmarGuardarTarifa(false);
    const precio = parseFloat(nuevoPrecioTarifa);

    const res = await AdminGeneralDao.editarTarifaGlobal({
      id_tarifa: tarifaEditar.id_tarifa,
      precio_general: precio,
      activo: tarifaEditar.activo,
    });

    setGuardando(false);
    if (res.ok) {
      setTarifaEditar(null);
      mostrarToast(`Tarifa de ${tarifaEditar.dia_nombre || tarifaEditar.tipo_tarifa} actualizada a S/ ${precio.toFixed(2)}.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al actualizar la tarifa.", "error");
    }
  };

  // ── Formatos de Proyección ──
  const abrirEditarFormato = (f: FormatoProyeccionGlobalDTO) => {
    setFormatoEditar(f);
    setNuevoRecargoFormato(f.recargo.toFixed(2));
    setErrorValidacion("");
  };

  const solicitarGuardarFormato = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nuevoRecargoFormato);
    if (isNaN(val) || val < 0) {
      setErrorValidacion("El recargo debe ser un número igual o mayor a S/ 0.00.");
      return;
    }
    setErrorValidacion("");
    setConfirmarGuardarFormato(true);
  };

  const ejecutarGuardarFormato = async () => {
    if (!formatoEditar) return;
    setGuardando(true);
    setConfirmarGuardarFormato(false);
    const recargo = parseFloat(nuevoRecargoFormato);

    const res = await AdminGeneralDao.editarFormatoProyeccion(
      formatoEditar.id_formato,
      recargo,
      formatoEditar.activo
    );

    setGuardando(false);
    if (res.ok) {
      setFormatoEditar(null);
      mostrarToast(`Recargo de formato ${formatoEditar.nombre} actualizado a S/ ${recargo.toFixed(2)}.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al actualizar el formato.", "error");
    }
  };

  // ── Tipos de Entrada ──
  const abrirEditarTipoEntrada = (te: TipoEntradaGlobalDTO) => {
    setTipoEntradaEditar(te);
    setNuevoDescuentoEntrada(te.descuento_pct.toString());
    setErrorValidacion("");
  };

  const solicitarGuardarTipoEntrada = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nuevoDescuentoEntrada);
    if (isNaN(val) || val < 0 || val > 100) {
      setErrorValidacion("El descuento debe ser un porcentaje entre 0% y 100%.");
      return;
    }
    setErrorValidacion("");
    setConfirmarGuardarTipoEntrada(true);
  };

  const ejecutarGuardarTipoEntrada = async () => {
    if (!tipoEntradaEditar) return;
    setGuardando(true);
    setConfirmarGuardarTipoEntrada(false);
    const desc = parseFloat(nuevoDescuentoEntrada);

    const res = await AdminGeneralDao.editarTipoEntrada(
      tipoEntradaEditar.id_tipo_entrada,
      desc,
      tipoEntradaEditar.activo
    );

    setGuardando(false);
    if (res.ok) {
      setTipoEntradaEditar(null);
      mostrarToast(`Descuento de entrada "${tipoEntradaEditar.nombre}" actualizado a ${desc}%.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al actualizar tipo de entrada.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[99999] px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-fadeIn ${
            toast.tipo === "ok" ? "bg-emerald-600 text-white shadow-emerald-500/20" : "bg-rose-600 text-white shadow-rose-500/20"
          }`}
        >
          <i className={`fa-solid ${toast.tipo === "ok" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
          <span>{toast.mensaje}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Tarifas, Formatos y Tipos de Entrada</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Parámetros maestros corporativos para el cálculo del precio de boletos en todas las sedes
        </p>
      </div>

      {cargando ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-48 bg-[#0B1528] rounded-2xl"></div>
          <div className="h-48 bg-[#0B1528] rounded-2xl"></div>
          <div className="h-48 bg-[#0B1528] rounded-2xl"></div>
        </div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 1: Tarifas por Día de Semana (Precios Base)
             ══════════════════════════════════════════════════════════ */}
          <section className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-calendar-week text-brand-yellow"></i>
                  <span>Tarifas por Día de Semana</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Precios base corporativos para cada día. Las sedes aplican estos valores salvo sobreescritura local autorizada.
                </p>
              </div>
              <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 rounded-xl self-start sm:self-auto">
                Boletería Base
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
              {tarifas.map((t) => (
                <div
                  key={t.id_tarifa}
                  className="bg-[#070e1b] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t.tipo_tarifa}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${t.activo ? "bg-emerald-400" : "bg-slate-500"}`}
                        title={t.activo ? "Activo" : "Inactivo"}
                      ></span>
                    </div>
                    <h4 className="text-base font-bold text-white">{t.dia_nombre || "Todos los días"}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Entrada 2D regular</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Precio General</span>
                      <span className="text-lg font-black text-brand-yellow font-mono">
                        S/ {t.precio_general.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => abrirEditarTarifa(t)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-pen text-[10px] text-sky-400"></i>
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 2: Formatos de Proyección
             ══════════════════════════════════════════════════════════ */}
          <section className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-clapperboard text-brand-blue"></i>
                  <span>Formatos de Proyección Cinematográfica</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recargo adicional en soles por tecnología de sala sobre la tarifa general del boleto
                </p>
              </div>
              <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/30 px-3 py-1 rounded-xl self-start sm:self-auto">
                Tecnología Audiovisual
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
              {formatos.map((fmt) => (
                <div
                  key={fmt.id_formato}
                  className="bg-[#070e1b] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {fmt.codigo}
                      </span>
                      {fmt.protegido && (
                        <span className="text-[10px] text-slate-500" title="Formato estándar del sistema">
                          <i className="fa-solid fa-lock"></i>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">{fmt.nombre}</h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Recargo Sala</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        +S/ {fmt.recargo.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => abrirEditarFormato(fmt)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-pen text-[10px] text-sky-400"></i>
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 3: Tipos de Entrada
             ══════════════════════════════════════════════════════════ */}
          <section className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-ticket text-emerald-400"></i>
                  <span>Tipos de Entrada y Beneficios</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reglas de descuento porcentual para niños, adultos mayores, socios y cumplimiento de ley
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-xl self-start sm:self-auto">
                Descuentos y Normativas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
              {tiposEntrada.map((te) => (
                <div
                  key={te.id_tipo_entrada}
                  className="bg-[#070e1b] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {te.codigo}
                      </span>
                      {te.obligatorio_legal && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                          Obligatorio Legal
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{te.nombre}</h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Descuento</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        {te.descuento_pct > 0 ? `-${te.descuento_pct}%` : "Tarifa Plena"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => abrirEditarTipoEntrada(te)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-pen text-[10px] text-sky-400"></i>
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Modal Editar Tarifa por Día ── */}
      {tarifaEditar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-dark-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 text-white">
            <h3 className="text-lg font-bold text-white mb-1">
              Editar Tarifa: {tarifaEditar.dia_nombre || tarifaEditar.tipo_tarifa}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Establece el precio base de boletería general aplicable para este día
            </p>

            <form onSubmit={solicitarGuardarTarifa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Nuevo Precio General (S/)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0.5"
                  value={nuevoPrecioTarifa}
                  onChange={(e) => setNuevoPrecioTarifa(e.target.value)}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                  autoFocus
                />
                {errorValidacion && (
                  <span className="text-xs text-rose-400 mt-1 block">{errorValidacion}</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTarifaEditar(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-md"
                >
                  Guardar Tarifa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Editar Formato de Proyección ── */}
      {formatoEditar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-dark-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 text-white">
            <h3 className="text-lg font-bold text-white mb-1">
              Editar Formato: {formatoEditar.nombre} ({formatoEditar.codigo})
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Configura el recargo por uso de proyector y sonido especial
            </p>

            <form onSubmit={solicitarGuardarFormato} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Recargo Adicional (S/)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={nuevoRecargoFormato}
                  onChange={(e) => setNuevoRecargoFormato(e.target.value)}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                  autoFocus
                />
                {errorValidacion && (
                  <span className="text-xs text-rose-400 mt-1 block">{errorValidacion}</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFormatoEditar(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue hover:bg-sky-400 text-white shadow-md"
                >
                  Actualizar Formato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Editar Tipo de Entrada ── */}
      {tipoEntradaEditar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-dark-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 text-white">
            <h3 className="text-lg font-bold text-white mb-1">
              Editar Tipo de Entrada: {tipoEntradaEditar.nombre}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ajusta el porcentaje de descuento a aplicar sobre el boleto general
            </p>

            <form onSubmit={solicitarGuardarTipoEntrada} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Descuento Porcentual (%)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={nuevoDescuentoEntrada}
                  onChange={(e) => setNuevoDescuentoEntrada(e.target.value)}
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                  autoFocus
                />
                {errorValidacion && (
                  <span className="text-xs text-rose-400 mt-1 block">{errorValidacion}</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTipoEntradaEditar(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-md"
                >
                  Actualizar Descuento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modales de Confirmación Centrales con Portal ── */}

      <ModalConfirmacion
        abierto={confirmarGuardarTarifa}
        titulo="¿Guardar Tarifa de Boletería?"
        mensaje={`Se actualizará el precio general de ${tarifaEditar?.dia_nombre || "la tarifa"} a S/ ${nuevoPrecioTarifa}.`}
        tipo="advertencia"
        textoConfirmar="Confirmar Precio"
        textoCancelar="Volver"
        cargando={guardando}
        onConfirmar={ejecutarGuardarTarifa}
        onCancelar={() => setConfirmarGuardarTarifa(false)}
      />

      <ModalConfirmacion
        abierto={confirmarGuardarFormato}
        titulo="¿Actualizar Recargo de Formato?"
        mensaje={`Se establecerá el recargo de ${formatoEditar?.nombre} en S/ ${nuevoRecargoFormato}.`}
        tipo="info"
        textoConfirmar="Confirmar Recargo"
        textoCancelar="Volver"
        cargando={guardando}
        onConfirmar={ejecutarGuardarFormato}
        onCancelar={() => setConfirmarGuardarFormato(false)}
      />

      <ModalConfirmacion
        abierto={confirmarGuardarTipoEntrada}
        titulo="¿Actualizar Descuento de Entrada?"
        mensaje={`Se aplicará un descuento del ${nuevoDescuentoEntrada}% a las entradas de tipo "${tipoEntradaEditar?.nombre}".`}
        tipo="info"
        textoConfirmar="Confirmar Descuento"
        textoCancelar="Volver"
        cargando={guardando}
        onConfirmar={ejecutarGuardarTipoEntrada}
        onCancelar={() => setConfirmarGuardarTipoEntrada(false)}
      />
    </div>
  );
}
