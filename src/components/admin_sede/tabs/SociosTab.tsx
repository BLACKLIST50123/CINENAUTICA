"use client";

import React, { useState, useEffect } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { SocioConsultaSedeDTO } from "@/src/dtos/adminSede";

interface SociosTabProps {
  idSede: number;
}

export default function SociosTab({ idSede }: SociosTabProps) {
  const [termino, setTermino] = useState<string>("");
  const [socios, setSocios] = useState<SocioConsultaSedeDTO[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<SocioConsultaSedeDTO | null>(null);
  const [buscando, setBuscando] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (termino.trim().length >= 2) {
        setBuscando(true);
        const res = await AdminSedeDao.buscarSociosSede(termino);
        setSocios(res);
        setBuscando(false);
        if (res.length > 0 && !socioSeleccionado) {
          setSocioSeleccionado(res[0]);
        }
      } else {
        setSocios([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [termino]);

  const anioActual = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Atención y Consulta de Socios</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Búsqueda de clientes fidelizados, verificación de carnet digital y saldo de puntos Cine Náutica
        </p>
      </div>

      {/* Buscador de Socios */}
      <div className="relative max-w-xl">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input
          type="text"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Buscar por DNI, correo, nombre o código de socio..."
          className="w-full bg-dark-900 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-xl"
        />
        {buscando && (
          <i className="fa-solid fa-circle-notch fa-spin absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 text-sm"></i>
        )}
      </div>

      {termino.trim().length < 2 ? (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl mx-auto mb-3">
            <i className="fa-solid fa-id-card"></i>
          </div>
          <h3 className="text-base font-bold text-white mb-1">Ingresa un término de búsqueda</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Escribe el número de DNI (8 dígitos), correo electrónico o nombre del socio para ver su ficha, puntos disponibles y beneficios de cumpleaños.
          </p>
        </div>
      ) : socios.length === 0 && !buscando ? (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-10 text-center shadow-xl">
          <i className="fa-solid fa-user-xmark text-3xl text-slate-600 mb-2"></i>
          <p className="text-slate-400 text-sm">No se encontraron socios que coincidan con &quot;{termino}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Resultados */}
          <div className="bg-dark-900 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2 lg:col-span-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Resultados ({socios.length})
            </span>
            {socios.map((s) => {
              const esSeleccionado = socioSeleccionado?.id_usuario === s.id_usuario;
              return (
                <button
                  key={s.id_usuario}
                  type="button"
                  onClick={() => setSocioSeleccionado(s)}
                  className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                    esSeleccionado
                      ? "bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-950/20"
                      : "bg-dark-800 border-white/5 text-slate-300 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-sm truncate">{s.nombre} {s.apellido}</h4>
                    <span className="text-[11px] text-slate-400 block font-mono">DNI: {s.dni || "—"}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-950 border border-white/10 text-brand-yellow font-mono flex-shrink-0">
                    {s.puntos_actuales} pts
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ficha Detallada del Socio Seleccionado */}
          {socioSeleccionado && (
            <div className="bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 lg:col-span-2">
              {/* Carnet Digital */}
              <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-dark-800 to-dark-950 border border-white/15 shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-start justify-between relative z-10 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                      Club Cine Náutica
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {socioSeleccionado.nombre} {socioSeleccionado.apellido}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 flex items-center gap-1.5 shadow-sm">
                    <i className="fa-solid fa-crown text-[10px]"></i>
                    <span>Nivel {socioSeleccionado.nivel}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Código de Socio</span>
                    <b className="text-white font-mono text-sm">{socioSeleccionado.codigo_socio}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Puntos Acumulados</span>
                    <b className="text-brand-yellow font-mono text-base">{socioSeleccionado.puntos_actuales}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Multiplicador</span>
                    <b className="text-white font-mono text-sm">{socioSeleccionado.multiplicador_puntos}x por S/ 1</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Beneficio Cumpleaños</span>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        socioSeleccionado.cumple_usado_en_anio === anioActual
                          ? "bg-white/10 text-slate-400"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {socioSeleccionado.cumple_usado_en_anio === anioActual ? "Canjeado" : "Disponible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-dark-800 border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block mb-1">Documento de Identidad</span>
                  <b className="text-white font-mono text-sm">{socioSeleccionado.dni || "No registrado"}</b>
                </div>
                <div className="bg-dark-800 border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block mb-1">Teléfono Móvil</span>
                  <b className="text-white font-mono text-sm">{socioSeleccionado.telefono || "No registrado"}</b>
                </div>
                <div className="bg-dark-800 border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block mb-1">Correo Electrónico</span>
                  <b className="text-white text-sm truncate block">{socioSeleccionado.correo}</b>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
