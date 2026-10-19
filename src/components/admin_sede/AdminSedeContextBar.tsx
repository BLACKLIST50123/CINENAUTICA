"use client";

import React from "react";
import type { ContextoSedeDTO } from "@/src/dtos/adminSede";

interface AdminSedeContextBarProps {
  contexto: ContextoSedeDTO | null;
}

export default function AdminSedeContextBar({ contexto }: AdminSedeContextBarProps) {
  if (!contexto) {
    return (
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 mb-6 animate-pulse">
        <div className="h-6 bg-white/5 rounded w-48 mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-wrap items-center gap-4 mb-6 shadow-xl">
      <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0 text-white text-xl shadow-lg shadow-sky-500/10">
        <i className="fa-solid fa-store"></i>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
          {contexto.region} › {contexto.ciudad}
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
          {contexto.nombre}
        </h2>
        <p className="text-xs text-slate-400 truncate mt-0.5">{contexto.direccion}</p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
        {/* Chip Operativa */}
        <span className="flex items-center gap-2 bg-dark-800 border border-white/10 px-3 py-1.5 rounded-full text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{contexto.activa ? "Operativa" : "En Mantenimiento"}</span>
        </span>

        {/* Chip Salas */}
        <span className="flex items-center gap-2 bg-dark-800 border border-white/10 px-3 py-1.5 rounded-full text-slate-300">
          <i className="fa-solid fa-door-open text-brand-yellow"></i>
          <span>{contexto.cant_salas} salas</span>
        </span>

        {/* Chip Funciones Hoy */}
        <span className="flex items-center gap-2 bg-dark-800 border border-white/10 px-3 py-1.5 rounded-full text-slate-300">
          <i className="fa-solid fa-film text-brand-blue"></i>
          <span>{contexto.funciones_hoy} funciones hoy</span>
        </span>

        {/* Chip Ocupación */}
        <span className="flex items-center gap-2 bg-dark-800 border border-white/10 px-3 py-1.5 rounded-full text-slate-300">
          <i className="fa-solid fa-chair text-purple-400"></i>
          <span>{contexto.ocupacion_hoy_pct}% ocupación</span>
        </span>
      </div>
    </div>
  );
}
