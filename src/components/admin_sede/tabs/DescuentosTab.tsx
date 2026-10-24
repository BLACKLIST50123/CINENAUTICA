"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { CuponSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface DescuentosTabProps {
  idSede: number;
  onAbrirCrearCuponLocal: () => void;
  recargarTrigger: number;
}

export default function DescuentosTab({
  idSede,
  onAbrirCrearCuponLocal,
  recargarTrigger,
}: DescuentosTabProps) {
  const [cupones, setCupones] = useState<CuponSedeDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [cuponAlternar, setCuponAlternar] = useState<CuponSedeDTO | null>(null);

  const [cuponEliminar, setCuponEliminar] = useState<CuponSedeDTO | null>(null);

  const cargarCupones = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerCuponesSede(idSede);
    setCupones(data);
    setCargando(false);
  }, [idSede, recargarTrigger]);

  useEffect(() => {
    cargarCupones();
  }, [cargarCupones]);

  const confirmarAlternarCupon = async () => {
    if (!cuponAlternar) return;
    const nuevoEstado = !cuponAlternar.habilitado_sede;

    // Actualización optimista
    setCupones((prev) =>
      prev.map((c) =>
        c.id_cupon === cuponAlternar.id_cupon ? { ...c, habilitado_sede: nuevoEstado } : c
      )
    );

    await AdminSedeDao.actualizarCuponSede(idSede, cuponAlternar.id_cupon, nuevoEstado);
    setCuponAlternar(null);
  };

  const confirmarEliminarCupon = async () => {
    if (!cuponEliminar) return;

    setCupones((prev) => prev.filter((c) => c.id_cupon !== cuponEliminar.id_cupon));
    await AdminSedeDao.eliminarCuponSede(idSede, cuponEliminar.id_cupon);
    setCuponEliminar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Descuentos y Cupones Promocionales</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cupones corporativos vigentes y gestión de promociones locales exclusivas de esta sede
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirCrearCuponLocal}
          className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-950/40 self-start sm:self-auto cursor-pointer"
        >
          <i className="fa-solid fa-plus text-[11px]"></i>
          <span>Crear Cupón Local</span>
        </button>
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="h-40 bg-dark-900 rounded-2xl"></div>
          <div className="h-40 bg-dark-900 rounded-2xl"></div>
          <div className="h-40 bg-dark-900 rounded-2xl"></div>
        </div>
      ) : cupones.length === 0 ? (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-10 text-center">
          <i className="fa-solid fa-tags text-3xl text-slate-600 mb-2"></i>
          <p className="text-slate-400 text-sm">No hay cupones configurados en esta sede.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cupones.map((c) => {
            const porcentaje = c.usos_maximos_sede && c.usos_maximos_sede > 0
              ? Math.min(100, Math.round((c.usos_sede / c.usos_maximos_sede) * 100))
              : null;

            return (
              <div
                key={c.id_cupon}
                className={`bg-dark-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all ${
                  c.habilitado_sede
                    ? "border-white/10 hover:border-cyan-500/30"
                    : "border-white/5 opacity-60 bg-dark-950/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-sm tracking-wider px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg">
                      {c.codigo}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.es_local
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {c.es_local ? "Local Sede" : "Corporativo"}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mt-2 mb-1">
                    {c.porcentaje_descuento}% de Descuento
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {c.descripcion || "Cupón de descuento para compras en Cine Náutica."}
                  </p>

                  {/* Barra de Usos */}
                  {c.usos_maximos_sede && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">Canjes en Sede</span>
                        <span className="font-mono font-bold text-white text-xs">
                          {c.usos_sede} / {c.usos_maximos_sede}
                        </span>
                      </div>
                      <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                        <div
                          className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${porcentaje || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 truncate">
                    Hasta {c.fecha_fin || "Vigente"}
                  </span>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setCuponAlternar(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        c.habilitado_sede
                          ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30"
                          : "bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <i className={`fa-solid ${c.habilitado_sede ? "fa-toggle-on text-sm" : "fa-toggle-off text-sm"}`}></i>
                      <span>{c.habilitado_sede ? "Activo" : "Pausado"}</span>
                    </button>

                    {c.es_local && (
                      <button
                        type="button"
                        onClick={() => setCuponEliminar(c)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#DC2026]/10 hover:bg-[#DC2026] text-[#DC2026] hover:text-white border border-[#DC2026]/30 transition-all flex items-center gap-1 cursor-pointer"
                        title="Eliminar cupón de la sede"
                      >
                        <i className="fa-solid fa-trash-can text-[11px]"></i>
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación para alternar estado de cupón */}
      <ModalConfirmacion
        abierto={!!cuponAlternar}
        titulo={
          cuponAlternar?.habilitado_sede
            ? "¿Pausar Cupón en esta Sede?"
            : "¿Activar Cupón en esta Sede?"
        }
        mensaje={
          cuponAlternar?.habilitado_sede
            ? `El cupón '${cuponAlternar?.codigo}' dejará de ser aceptado para compras en las boleterías y web de esta sede.`
            : `El cupón '${cuponAlternar?.codigo}' volverá a aplicarse para compras en esta sede.`
        }
        tipo={cuponAlternar?.habilitado_sede ? "advertencia" : "info"}
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarAlternarCupon}
        onCancelar={() => setCuponAlternar(null)}
      />

      {/* Modal de confirmación para eliminar cupón local */}
      <ModalConfirmacion
        abierto={!!cuponEliminar}
        titulo="¿Eliminar Cupón Local?"
        mensaje={`¿Estás seguro de que deseas eliminar permanentemente el cupón '${cuponEliminar?.codigo}' de esta sede?`}
        tipo="peligro"
        textoConfirmar="Sí, Eliminar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarEliminarCupon}
        onCancelar={() => setCuponEliminar(null)}
      />
    </div>
  );
}
