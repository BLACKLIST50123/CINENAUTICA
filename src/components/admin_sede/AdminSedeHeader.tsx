"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/cliente";
import ModalConfirmacion from "./comun/ModalConfirmacion";

interface AdminSedeHeaderProps {
  nombreSede: string;
  nombreUsuario: string;
  rolNombre: string;
}

export default function AdminSedeHeader({
  nombreSede,
  nombreUsuario,
  rolNombre,
}: AdminSedeHeaderProps) {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [confirmarLogout, setConfirmarLogout] = useState<boolean>(false);

  const handleCerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("cinenautica_rol_personal");
      localStorage.removeItem("cinenautica_usuario_id");
      localStorage.removeItem("cinenautica_usuario_nombre");
    } catch {}
    router.push("/acceso");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-dark-950/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Logo y Badge de Rol */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/admin_sede" className="flex items-center gap-2.5">
          <img src="/img/logo/logocinenautica.png" alt="Cine Náutica" className="h-9 w-auto object-contain" />
          <span className="hidden sm:inline-block text-xl font-bold tracking-tighter text-white">
            CINE<span className="text-brand-blue">NÁUTICA</span>
          </span>
        </Link>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-blue/15 text-brand-blue border border-brand-blue/30 tracking-wide uppercase">
          {rolNombre || "Admin de Sede"}
        </span>
      </div>

      {/* Sede, Hub y Perfil */}
      <div className="flex items-center gap-3">
        {/* Sede Asignada Fija */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-white">
          <i className="fa-solid fa-location-dot text-brand-yellow"></i>
          <span className="font-bold">{nombreSede || "CineNáutica Chimbote"}</span>
        </div>

        {/* Acceso Rápido al Hub de Counters */}
        <Link
          href="/counter"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          title="Ir al Hub de Terminales de la Sede"
        >
          <i className="fa-solid fa-cash-register text-brand-blue"></i>
          <span className="hidden sm:inline">Hub Counters</span>
        </Link>

        {/* Menú de Usuario */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-dark-800 border-2 border-brand-blue flex items-center justify-center text-brand-yellow font-bold text-xs shadow-md">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <div className="hidden md:block text-left leading-tight">
              <span className="block text-xs font-bold text-white truncate max-w-[120px]">
                {nombreUsuario || "Rosa Medina"}
              </span>
              <span className="block text-[10px] text-slate-400">Supervisor de Sede</span>
            </div>
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 hidden md:block"></i>
          </button>

          {menuAbierto && (
            <div className="absolute right-0 top-12 w-52 bg-dark-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn text-sm">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="font-bold text-white text-xs truncate">{nombreUsuario || "Rosa Medina"}</p>
                <p className="text-[11px] text-brand-yellow">{nombreSede}</p>
              </div>
              <Link
                href="/counter"
                onClick={() => setMenuAbierto(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-shapes text-brand-blue w-4"></i>
                <span>Hub de Terminales</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuAbierto(false);
                  setConfirmarLogout(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-brand-red hover:bg-red-500/10 transition-colors mt-1"
              >
                <i className="fa-solid fa-right-from-bracket w-4"></i>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      </header>
      <ModalConfirmacion
        abierto={confirmarLogout}
        titulo="¿Cerrar Sesión Corporativa?"
        mensaje="Se cerrará tu sesión activa como supervisor de sede y serás redirigido a la pantalla de acceso corporativo."
        tipo="advertencia"
        textoConfirmar="Sí, Cerrar Sesión"
        textoCancelar="Permanecer"
        onConfirmar={handleCerrarSesion}
        onCancelar={() => setConfirmarLogout(false)}
      />
    </>
  );
}
