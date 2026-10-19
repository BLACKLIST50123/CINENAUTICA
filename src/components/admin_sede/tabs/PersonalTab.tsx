"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { PersonalSedeDTO } from "@/src/dtos/adminSede";

interface PersonalTabProps {
  idSede: number;
  onAbrirNuevoPersonal: () => void;
  onVerFichaPersonal: (personal: PersonalSedeDTO) => void;
  recargarTrigger: number;
}

export default function PersonalTab({
  idSede,
  onAbrirNuevoPersonal,
  onVerFichaPersonal,
  recargarTrigger,
}: PersonalTabProps) {
  const [personalList, setPersonalList] = useState<PersonalSedeDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const cargarPersonal = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerPersonalSede(idSede);
    setPersonalList(data);
    setCargando(false);
  }, [idSede, recargarTrigger]);

  useEffect(() => {
    cargarPersonal();
  }, [cargarPersonal]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Equipo de Personal de la Sede</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Colaboradores asignados exclusivamente a los counters de atención y venta de esta sede
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNuevoPersonal}
          className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <i className="fa-solid fa-user-plus text-[11px]"></i>
          <span>Registrar Colaborador</span>
        </button>
      </div>

      {/* Tabla de Personal */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl">
        {cargando ? (
          <div className="h-44 bg-dark-800 rounded-xl animate-pulse"></div>
        ) : personalList.length === 0 ? (
          <div className="text-center py-10">
            <i className="fa-solid fa-users-slash text-3xl text-slate-600 mb-2"></i>
            <p className="text-slate-400 text-sm">No hay colaboradores registrados en esta sede.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-800 text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Colaborador</th>
                  <th className="py-3 px-4">Rol / Puesto</th>
                  <th className="py-3 px-4">DNI / Teléfono</th>
                  <th className="py-3 px-4">Correo Corporativo</th>
                  <th className="py-3 px-4">Ventas (Mes)</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {personalList.map((p) => (
                  <tr key={p.id_usuario} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-yellow font-bold text-xs flex-shrink-0">
                          {p.nombre.charAt(0)}{p.apellido.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm leading-tight">
                            {p.nombre} {p.apellido}
                          </h4>
                          <span className="text-[10px] text-slate-500">ID: {p.id_usuario.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-dark-800 border border-white/10 text-slate-300">
                        {p.rol_nombre}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      <div>DNI: {p.dni || "—"}</div>
                      <div className="text-[10px] text-slate-500">Tel: {p.telefono || "—"}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{p.correo}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-white">{p.total_ordenes_mes} órdenes</span>
                      <span className="block text-[10px] text-brand-yellow">
                        S/ {p.total_recaudado_mes.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.activo
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-brand-red border border-red-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-emerald-400" : "bg-brand-red"}`}></span>
                        <span>{p.activo ? "Activo" : "Inactivo"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onVerFichaPersonal(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-white border border-white/10 transition-colors inline-flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-id-card text-brand-blue text-[10px]"></i>
                        <span>Ficha</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
