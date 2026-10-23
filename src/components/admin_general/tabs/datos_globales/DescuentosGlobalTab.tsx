"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type {
  CuponGlobalDTO,
  CrearCuponGlobalPayload,
  EditarCuponGlobalPayload,
} from "@/src/dtos/adminGeneral";
import ModalConfirmacion from "@/src/components/admin_sede/comun/ModalConfirmacion";

interface DescuentosGlobalTabProps {
  recargarTrigger: number;
  onRecargar: () => void;
}

const FORM_CUPON_VACIO: CrearCuponGlobalPayload = {
  codigo: "",
  descripcion: "",
  porcentaje_descuento: 20,
  fecha_inicio: new Date().toISOString().split("T")[0],
  fecha_fin: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  usos_maximos: 1000,
};

export default function DescuentosGlobalTab({
  recargarTrigger,
  onRecargar,
}: DescuentosGlobalTabProps) {
  const [cupones, setCupones] = useState<CuponGlobalDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>("");

  // Modal Crear / Editar
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [cuponEditar, setCuponEditar] = useState<CuponGlobalDTO | null>(null);
  const [form, setForm] = useState<CrearCuponGlobalPayload>(FORM_CUPON_VACIO);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<boolean>(false);

  // Modales de Confirmación
  const [cuponEliminar, setCuponEliminar] = useState<CuponGlobalDTO | null>(null);
  const [cuponAlternar, setCuponAlternar] = useState<CuponGlobalDTO | null>(null);
  const [confirmarGuardarPendiente, setConfirmarGuardarPendiente] = useState<boolean>(false);
  const [confirmarCancelarPendiente, setConfirmarCancelarPendiente] = useState<boolean>(false);

  const [toast, setToast] = useState<{ mensaje: string; tipo: "ok" | "error" } | null>(null);

  const cargarCupones = useCallback(async () => {
    setCargando(true);
    const data = await AdminGeneralDao.obtenerCuponesGlobales();
    setCupones(data);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarCupones();
  }, [cargarCupones, recargarTrigger]);

  const mostrarToast = (mensaje: string, tipo: "ok" | "error" = "ok") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const abrirCrear = () => {
    setForm(FORM_CUPON_VACIO);
    setCuponEditar(null);
    setErrores({});
    setModalAbierto(true);
  };

  const abrirEditar = (c: CuponGlobalDTO) => {
    setForm({
      codigo: c.codigo,
      descripcion: c.descripcion,
      porcentaje_descuento: c.porcentaje_descuento,
      fecha_inicio: c.fecha_inicio ? c.fecha_inicio.split("T")[0] : "",
      fecha_fin: c.fecha_fin ? c.fecha_fin.split("T")[0] : "",
      usos_maximos: c.usos_maximos || 1000,
    });
    setCuponEditar(c);
    setErrores({});
    setModalAbierto(true);
  };

  const validar = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.codigo.trim()) {
      errs.codigo = "El código es obligatorio.";
    } else if (form.codigo.trim().length < 3) {
      errs.codigo = "El código debe tener al menos 3 caracteres.";
    }

    if (!form.descripcion.trim()) {
      errs.descripcion = "La descripción del cupón es obligatoria.";
    }

    if (!form.porcentaje_descuento || form.porcentaje_descuento < 1 || form.porcentaje_descuento > 100) {
      errs.porcentaje_descuento = "El porcentaje debe estar entre 1% y 100%.";
    }

    if (!form.fecha_inicio) {
      errs.fecha_inicio = "La fecha de inicio es obligatoria.";
    }

    if (!form.fecha_fin) {
      errs.fecha_fin = "La fecha de fin es obligatoria.";
    } else if (form.fecha_inicio && form.fecha_fin < form.fecha_inicio) {
      errs.fecha_fin = "La fecha de fin debe ser posterior a la fecha de inicio.";
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const solicitarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setConfirmarGuardarPendiente(true);
  };

  const ejecutarGuardar = async () => {
    setGuardando(true);
    setConfirmarGuardarPendiente(false);

    let res;
    if (cuponEditar) {
      res = await AdminGeneralDao.editarCuponGlobal({
        id_cupon: cuponEditar.id_cupon,
        descripcion: form.descripcion,
        porcentaje_descuento: form.porcentaje_descuento,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        usos_maximos: form.usos_maximos,
      });
    } else {
      res = await AdminGeneralDao.crearCuponGlobal(form);
    }

    setGuardando(false);
    if (res.ok) {
      setModalAbierto(false);
      mostrarToast(
        cuponEditar
          ? `Cupón "${form.codigo}" actualizado correctamente.`
          : `Cupón "${form.codigo}" creado con ${form.porcentaje_descuento}% de descuento.`
      );
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al procesar el cupón.", "error");
    }
  };

  const solicitarCancelar = () => {
    if (form.codigo.trim() || form.descripcion.trim()) {
      setConfirmarCancelarPendiente(true);
    } else {
      setModalAbierto(false);
    }
  };

  const ejecutarEliminar = async () => {
    if (!cuponEliminar) return;
    setGuardando(true);
    const res = await AdminGeneralDao.eliminarCuponGlobal(cuponEliminar.id_cupon);
    setGuardando(false);
    const codigo = cuponEliminar.codigo;
    setCuponEliminar(null);

    if (res.ok) {
      mostrarToast(`Cupón "${codigo}" eliminado correctamente.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "No se pudo eliminar el cupón.", "error");
    }
  };

  const ejecutarAlternarEstado = async () => {
    if (!cuponAlternar) return;
    const nuevoEstado = !cuponAlternar.habilitado;

    // Actualización optimista
    setCupones((prev) =>
      prev.map((c) =>
        c.id_cupon === cuponAlternar.id_cupon ? { ...c, habilitado: nuevoEstado } : c
      )
    );

    const res = await AdminGeneralDao.toggleCupon(cuponAlternar.id_cupon, nuevoEstado);
    const codigo = cuponAlternar.codigo;
    setCuponAlternar(null);

    if (res.ok) {
      mostrarToast(`Cupón "${codigo}" ${nuevoEstado ? "habilitado" : "deshabilitado"}.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al cambiar estado.", "error");
      cargarCupones();
    }
  };

  const cuponesFiltrados = cupones.filter(
    (c) =>
      !busqueda ||
      c.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
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

      {/* Cabecera y botón Nuevo Cupón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Descuentos y Cupones Promocionales</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión corporativa de códigos de descuento, porcentajes de rebaja y campañas promocionales
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-yellow-500/10 cursor-pointer self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Nuevo Cupón</span>
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código de cupón o descripción..."
            className="w-full bg-[#070e1b] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {cuponesFiltrados.length} cupones registrados
        </span>
      </div>

      {/* Grilla de Tarjetas (Reutilizando diseño de Admin_Sede) */}
      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-[#0B1528] rounded-2xl"></div>
          ))}
        </div>
      ) : cuponesFiltrados.length === 0 ? (
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-10 text-center">
          <i className="fa-solid fa-tags text-4xl text-slate-600 mb-3 block"></i>
          <h3 className="text-base font-bold text-white mb-1">No se encontraron cupones</h3>
          <p className="text-xs text-slate-400">Prueba con otro término de búsqueda o crea un cupón corporativo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuponesFiltrados.map((c) => {
            const porcentajeUso =
              c.usos_maximos && c.usos_maximos > 0
                ? Math.min(100, Math.round((c.usos_totales / c.usos_maximos) * 100))
                : null;

            return (
              <div
                key={c.id_cupon}
                className={`bg-[#0B1528] border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                  c.habilitado
                    ? "border-white/10 hover:border-white/20"
                    : "border-white/5 opacity-60 bg-[#070d18]"
                }`}
              >
                <div>
                  {/* Código y Estado */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-sm tracking-wider px-2.5 py-1 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow rounded-lg">
                      {c.codigo}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCuponAlternar(c)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        c.habilitado
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/5 text-slate-400 border border-white/10"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${c.habilitado ? "bg-emerald-400" : "bg-slate-500"}`}
                      ></span>
                      <span>{c.habilitado ? "Activo" : "Inactivo"}</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base mt-2 mb-1">
                    {c.porcentaje_descuento}% de Descuento
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {c.descripcion || "Cupón de descuento para compras en taquilla o dulcería."}
                  </p>

                  {/* Barra de Usos */}
                  {c.usos_maximos && (
                    <div className="mb-3 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Límite de canjes</span>
                        <span className="font-mono">
                          {c.usos_totales} / {c.usos_maximos} ({porcentajeUso}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#070e1b] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            (porcentajeUso || 0) > 90 ? "bg-rose-500" : "bg-brand-blue"
                          }`}
                          style={{ width: `${porcentajeUso || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Fechas de Vigencia */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-3">
                    <i className="fa-regular fa-clock text-slate-500 text-xs"></i>
                    <span>
                      Vigencia: {c.fecha_inicio?.split("T")[0]} al {c.fecha_fin?.split("T")[0]}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    <strong className="text-white">{c.sedes_habilitadas}</strong> sedes habilitadas
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => abrirEditar(c)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-pen text-[10px] text-sky-400"></i>
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCuponEliminar(c)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20 transition-colors cursor-pointer"
                      title="Eliminar cupón"
                    >
                      <i className="fa-solid fa-trash text-[11px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal de Creación / Edición de Cupón ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-dark-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-white"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-dark-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                  <i className="fa-solid fa-tags"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {cuponEditar ? "Editar Cupón Promocional" : "Nuevo Cupón Promocional"}
                  </h3>
                  <p className="text-xs text-slate-400">Parámetros globales de descuento</p>
                </div>
              </div>
              <button
                type="button"
                onClick={solicitarCancelar}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={solicitarGuardar} className="p-6 space-y-4">
              {/* Código y Descuento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Código <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!!cuponEditar}
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                    placeholder="NAUTICA20"
                    className={`w-full bg-[#0B1528] border rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none transition-colors uppercase disabled:opacity-50 ${
                      errores.codigo ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                  {errores.codigo && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errores.codigo}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Descuento (%) <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.porcentaje_descuento}
                    onChange={(e) =>
                      setForm({ ...form, porcentaje_descuento: parseInt(e.target.value, 10) || 0 })
                    }
                    className={`w-full bg-[#0B1528] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                      errores.porcentaje_descuento ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                  {errores.porcentaje_descuento && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {errores.porcentaje_descuento}
                    </span>
                  )}
                </div>
              </div>

              {/* Fechas de Vigencia */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Fecha Inicio <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.fecha_inicio}
                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                    className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Fecha Fin <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.fecha_fin}
                    onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                    className={`w-full bg-[#0B1528] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer ${
                      errores.fecha_fin ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                  {errores.fecha_fin && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errores.fecha_fin}</span>
                  )}
                </div>
              </div>

              {/* Usos Máximos */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Límite de Canjes (Usos Máximos)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.usos_maximos || 1000}
                  onChange={(e) =>
                    setForm({ ...form, usos_maximos: parseInt(e.target.value, 10) || 1000 })
                  }
                  className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Descripción Promocional <span className="text-brand-yellow">*</span>
                </label>
                <textarea
                  rows={2}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Ej. 20% de descuento en boletos para socios y público en general"
                  className={`w-full bg-[#0B1528] border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors resize-none ${
                    errores.descripcion ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                  }`}
                ></textarea>
                {errores.descripcion && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{errores.descripcion}</span>
                )}
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={solicitarCancelar}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-lg shadow-yellow-500/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>{cuponEditar ? "Guardar Cambios" : "Crear Cupón"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modales de Confirmación Centrales con Portal ── */}

      {/* Confirmar Guardar */}
      <ModalConfirmacion
        abierto={confirmarGuardarPendiente}
        titulo={cuponEditar ? "¿Guardar Cambios del Cupón?" : "¿Crear Cupón Promocional?"}
        mensaje={
          cuponEditar
            ? `Se actualizarán los datos de vigencia y descuento de "${form.codigo}".`
            : `Se creará el cupón "${form.codigo}" con un ${form.porcentaje_descuento}% de descuento aplicable en sedes.`
        }
        tipo={cuponEditar ? "advertencia" : "exito"}
        textoConfirmar={cuponEditar ? "Confirmar Cambios" : "Crear Ahora"}
        textoCancelar="Revisar"
        cargando={guardando}
        onConfirmar={ejecutarGuardar}
        onCancelar={() => setConfirmarGuardarPendiente(false)}
      />

      {/* Confirmar Eliminación */}
      <ModalConfirmacion
        abierto={!!cuponEliminar}
        titulo="¿Eliminar Cupón Promocional?"
        mensaje={`¿Estás seguro de que deseas eliminar permanentemente el cupón "${cuponEliminar?.codigo}"? Los usuarios ya no podrán aplicarlo en sus compras.`}
        tipo="peligro"
        textoConfirmar="Eliminar Cupón"
        textoCancelar="Volver"
        cargando={guardando}
        onConfirmar={ejecutarEliminar}
        onCancelar={() => setCuponEliminar(null)}
      />

      {/* Confirmar Alternar Estado */}
      <ModalConfirmacion
        abierto={!!cuponAlternar}
        titulo={cuponAlternar?.habilitado ? "¿Desactivar Cupón?" : "¿Activar Cupón?"}
        mensaje={`¿Deseas ${cuponAlternar?.habilitado ? "desactivar" : "activar"} la validez de "${cuponAlternar?.codigo}"?`}
        tipo="advertencia"
        textoConfirmar="Confirmar"
        textoCancelar="Volver"
        onConfirmar={ejecutarAlternarEstado}
        onCancelar={() => setCuponAlternar(null)}
      />

      {/* Confirmar Cancelar / Descarte */}
      <ModalConfirmacion
        abierto={confirmarCancelarPendiente}
        titulo="¿Descartar Cambios?"
        mensaje="Tienes datos sin guardar en el cupón. ¿Deseas salir sin aplicar cambios?"
        tipo="advertencia"
        textoConfirmar="Descartar"
        textoCancelar="Continuar Editando"
        onConfirmar={() => {
          setConfirmarCancelarPendiente(false);
          setModalAbierto(false);
        }}
        onCancelar={() => setConfirmarCancelarPendiente(false)}
      />
    </div>
  );
}
