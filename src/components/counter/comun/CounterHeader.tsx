"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase/cliente";
import type { ModoCounter, SocioCounterDTO } from "@/src/dtos/counter";

interface CounterHeaderProps {
  modo: ModoCounter;
  sedeActual: { id_sede: number; nombre: string };
  sedesDisponibles: { id_sede: number; nombre: string }[];
  onCambiarSede: (idSede: number) => void;
  socioActivo: SocioCounterDTO | null;
  onAbrirModalSocio: () => void;
  onAbrirModalOrden: () => void;
  onIniciarSoloDulceria?: () => void;
  cajeroNombre?: string;
  rolUsuario?: string;
  onCerrarSesion?: () => void;
}

export default function CounterHeader({
  modo,
  sedeActual,
  sedesDisponibles,
  onCambiarSede,
  socioActivo,
  onAbrirModalSocio,
  onAbrirModalOrden,
  onIniciarSoloDulceria,
  cajeroNombre = "Personal POS",
  rolUsuario,
  onCerrarSesion,
}: CounterHeaderProps) {
  const [relojHora, setRelojHora] = useState("");
  const [relojFecha, setRelojFecha] = useState("");
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      setRelojHora(
        ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
      setRelojFecha(
        ahora.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })
      );
    };

    actualizarReloj();
    const interval = setInterval(actualizarReloj, 1000);
    return () => clearInterval(interval);
  }, []);

  const badgeRol = {
    boleteria: { texto: "Boletería", icon: "fa-ticket", clase: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    dulceria: { texto: "Dulcería", icon: "fa-bowl-food", clase: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    mixto: { texto: "Caja Mixta", icon: "fa-cash-register", clase: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  }[modo];

  return (
    <header className="staff-header fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-6 flex items-center justify-between gap-4 bg-dark-900 border-b border-white/5 backdrop-blur-md">
      {/* SECCIÓN IZQUIERDA: Logo, Rol y Selector de Sede de Pruebas */}
      <div className="flex items-center gap-3 min-w-0">
        <a href="/" className="flex items-center gap-2">
          <img src="/img/logo/logocinenautica.png" className="h-9" alt="Logo Cine Náutica" />
          <span className="hidden md:block text-base font-bold tracking-tighter text-white">
            CINE<span className="text-brand-blue">NÁUTICA</span>
          </span>
        </a>

        {/* Badge del Rol Activo */}
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeRol.clase}`}
        >
          <i className={`fa-solid ${badgeRol.icon} text-[11px]`}></i>
          <span>{badgeRol.texto}</span>
        </span>

        {/* Indicador de Sede Asignada Fija */}
        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs">
          <i className="fa-solid fa-location-dot text-brand-yellow"></i>
          <span className="font-bold text-white text-xs">{sedeActual.nombre}</span>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Reloj, Socio, Accesos Rápidos y Menú Usuario */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Reloj en vivo */}
        <span className="hidden md:flex items-center gap-2 text-sm text-slate-300 font-semibold mr-1">
          <i className="fa-regular fa-clock text-brand-blue"></i>
          <span>{relojHora || "..."}</span>
          <span className="text-slate-500 text-xs capitalize">· {relojFecha}</span>
        </span>

        {/* Chip Cliente / Socio Activo */}
        <button
          id="chip-cliente"
          type="button"
          onClick={onAbrirModalSocio}
          className={`flex items-center gap-2 border rounded-full pl-2 pr-4 py-1.5 transition-colors ${
            socioActivo
              ? "bg-brand-blue/15 border-brand-blue/40 text-brand-blue hover:bg-brand-blue/25"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-white"
          }`}
        >
          <span className="w-7 h-7 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center">
            <i className={`fa-solid ${socioActivo ? "fa-id-card text-brand-blue" : "fa-user text-slate-400"} text-xs`}></i>
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[9px] uppercase text-slate-400 font-bold tracking-wider">
              {socioActivo ? `Socio · ${socioActivo.nivel}` : "Cliente"}
            </span>
            <span className="block text-xs font-bold text-white truncate max-w-[130px]">
              {socioActivo ? socioActivo.nombre_completo : "Invitado · Vincular socio"}
            </span>
          </span>
        </button>

        {/* Botón Solo Dulcería (Exclusivo de Caja Mixta) */}
        {modo === "mixto" && onIniciarSoloDulceria && (
          <button
            type="button"
            onClick={onIniciarSoloDulceria}
            className="hidden sm:flex items-center gap-2 bg-brand-yellow/10 hover:bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow rounded-xl px-3.5 py-2 text-xs font-bold transition-colors"
          >
            <i className="fa-solid fa-bowl-food"></i>
            <span>Solo dulcería</span>
          </button>
        )}

        {/* Botón Buscar Orden (Para Contingencias / Reimpresión / Reembolso) */}
        <button
          type="button"
          onClick={onAbrirModalOrden}
          className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Buscar orden</span>
        </button>

        {/* Menú Usuario Cajero */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-dark-800 border border-white/10 hover:border-brand-blue/50 transition-colors"
            title="Perfil de sesión"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/50 flex items-center justify-center">
              <i className="fa-solid fa-user text-brand-blue text-xs"></i>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-white text-xs font-bold leading-none truncate max-w-[120px]">{cajeroNombre}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-1">
                {rolUsuario === "admin_sede" ? "Admin Sede" : "Cajero"}
              </p>
            </div>
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 ml-0.5"></i>
          </button>

          {menuUsuarioAbierto && (
            <div className="absolute right-0 top-12 w-64 bg-dark-800 border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-white font-bold text-sm truncate">{cajeroNombre}</p>
                <p className="text-slate-400 text-xs">
                  {rolUsuario === "admin_sede"
                    ? `Admin de Sede · ${sedeActual.nombre}`
                    : `Cajero en ${sedeActual.nombre}`}
                </p>
              </div>

              {rolUsuario === "admin_sede" && (
                <Link
                  href="/counter"
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 flex items-center gap-2 transition-colors mb-1"
                >
                  <i className="fa-solid fa-store w-5 text-purple-400"></i>
                  <span>Volver al Hub de Sede</span>
                </Link>
              )}

              <button
                type="button"
                onClick={onAbrirModalOrden}
                className="w-full text-left sm:hidden px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-dark-700 flex items-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass w-5 text-slate-400"></i>
                Buscar orden
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                    localStorage.removeItem("cinenautica_rol_personal");
                  } catch {}
                  if (onCerrarSesion) onCerrarSesion();
                  window.location.href = "/acceso";
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-brand-red hover:bg-dark-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket w-5"></i>
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
