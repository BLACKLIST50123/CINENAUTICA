"use client";

import React, { useState } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { PersonalSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalFichaPersonalProps {
  abierto: boolean;
  personal: PersonalSedeDTO | null;
  onCerrar: () => void;
  onEstadoCambiado: () => void;
}

export default function ModalFichaPersonal({
  abierto,
  personal,
  onCerrar,
  onEstadoCambiado,
}: ModalFichaPersonalProps) {
  const [cargando, setCargando] = useState<boolean>(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  if (!abierto || !personal) return null;

  const alternarEstado = async () => {
    setCargando(true);
    const nuevoEstado = !personal.activo;
    const ok = await AdminSedeDao.alternarEstadoPersonal(personal.id_usuario, nuevoEstado);

    setCargando(false);
    setMostrarConfirmacion(false);

    if (ok) {
      onEstadoCambiado();
      onCerrar();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue text-lg">
                <i className="fa-solid fa-id-badge"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ficha de Colaborador</h3>
                <p className="text-xs text-slate-400">Detalles de personal y métricas de caja</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-dark-800 border border-white/10 rounded-xl p-4">
              <div className="w-14 h-14 rounded-full bg-brand-blue/20 border-2 border-brand-blue flex items-center justify-center text-brand-yellow text-xl font-bold">
                {personal.nombre.charAt(0)}{personal.apellido.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {personal.nombre} {personal.apellido}
                </h4>
                <p className="text-xs text-brand-yellow font-semibold">{personal.rol_nombre}</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    personal.activo
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-brand-red border border-red-500/20"
                  }`}
                >
                  {personal.activo ? "Cuenta Activa" : "Cuenta Deshabilitada"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-dark-800 border border-white/10 rounded-xl p-3">
                <span className="text-slate-400 block mb-1">DNI</span>
                <b className="text-white font-mono text-sm">{personal.dni || "—"}</b>
              </div>
              <div className="bg-dark-800 border border-white/10 rounded-xl p-3">
                <span className="text-slate-400 block mb-1">Teléfono</span>
                <b className="text-white font-mono text-sm">{personal.telefono || "—"}</b>
              </div>
              <div className="bg-dark-800 border border-white/10 rounded-xl p-3 col-span-2">
                <span className="text-slate-400 block mb-1">Correo Corporativo</span>
                <b className="text-white text-sm break-all">{personal.correo}</b>
              </div>
            </div>

            {/* Métricas de venta */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                Desempeño en Caja (Mes Actual)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Órdenes Atendidas</span>
                  <b className="text-lg font-bold text-white">{personal.total_ordenes_mes}</b>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Recaudación en Caja</span>
                  <b className="text-lg font-bold text-brand-yellow font-mono">
                    S/ {personal.total_recaudado_mes.toFixed(2)}
                  </b>
                </div>
              </div>
            </div>

            {/* Acción de activación / desactivación */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMostrarConfirmacion(true)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                  personal.activo
                    ? "bg-red-500/10 border-brand-red/30 text-brand-red hover:bg-red-500/20"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                <i className={`fa-solid ${personal.activo ? "fa-user-slash" : "fa-user-check"}`}></i>
                <span>{personal.activo ? "Desactivar Acceso Corporativo" : "Reactivar Cuenta de Colaborador"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo={personal.activo ? "¿Desactivar Cuenta de Personal?" : "¿Reactivar Cuenta de Personal?"}
        mensaje={
          personal.activo
            ? `El colaborador ${personal.nombre} ${personal.apellido} perderá acceso inmediato a los sistemas de counter de la sede.`
            : `El colaborador ${personal.nombre} ${personal.apellido} volverá a tener acceso a sus funciones de counter.`
        }
        tipo={personal.activo ? "peligro" : "info"}
        textoConfirmar={personal.activo ? "Sí, Desactivar" : "Sí, Reactivar"}
        textoCancelar="Cancelar"
        cargando={cargando}
        onConfirmar={alternarEstado}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
