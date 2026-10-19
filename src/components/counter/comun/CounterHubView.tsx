"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/cliente";

interface CounterHubViewProps {
  sedes: { id_sede: number; nombre: string; direccion?: string }[];
  sedeSeleccionada: number;
  onCambiarSede: (idSede: number) => void;
  rolUsuario?: string;
  nombreUsuario?: string;
}

export default function CounterHubView({
  sedes,
  sedeSeleccionada,
  onCambiarSede,
  rolUsuario = "admin_sede",
  nombreUsuario = "Rosa Medina",
}: CounterHubViewProps) {
  const router = useRouter();

  const sedeActual =
    sedes.find((s) => s.id_sede === sedeSeleccionada) ||
    sedes[0] || {
      id_sede: 1,
      nombre: "CineNáutica Chimbote",
      direccion: "Megaplaza Chimbote",
    };

  const handleCerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("cinenautica_rol_personal");
    } catch {}
    router.push("/acceso");
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col justify-between p-6 md:p-10 font-sans antialiased">
      {/* ── CABECERA DEL HUB ── */}
      <header className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/img/logo/logocinenautica.png" className="h-10 w-auto object-contain" alt="Logo" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-black tracking-tight">
                CINE<span className="text-brand-blue">NÁUTICA</span>
              </h1>
              <span className="text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Admin Sede
              </span>
            </div>
            <p className="text-xs text-slate-400">Hub de Supervisión Local y Terminales POS</p>
          </div>
        </div>

        {/* CONTROLES SUPERIORES: Selector de Sede + Perfil + Salir */}
        <div className="flex items-center gap-3">
          {/* Sede Asignada Fija */}
          <div className="flex items-center gap-2.5 bg-dark-800 border border-white/10 rounded-2xl px-4 py-2">
            <i className="fa-solid fa-location-dot text-brand-yellow text-sm"></i>
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Sede Asignada
              </span>
              <span className="font-bold text-xs md:text-sm text-white">
                {sedeActual.nombre}
              </span>
            </div>
          </div>

          {/* Badge del Administrador */}
          <div className="hidden sm:flex items-center gap-2.5 bg-dark-800 border border-white/10 rounded-2xl px-3.5 py-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xs font-bold">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div className="text-left text-xs leading-tight">
              <span className="block font-bold text-white">{nombreUsuario}</span>
              <span className="text-[10px] text-slate-400">Supervisor de Sede</span>
            </div>
          </div>

          {/* Botón Salir */}
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Cerrar sesión y salir"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL: ELECCIÓN ENTRE PANEL ADMIN Y LAS 3 CAJAS POS ── */}
      <main className="max-w-7xl w-full mx-auto my-auto py-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 rounded-full mb-2.5">
            Módulos Disponibles en {sedeActual.nombre}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
            ¿A qué módulo deseas <span className="text-brand-yellow">ingresar hoy</span>?
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Como Administrador de Sede tienes acceso integral para gestionar las operaciones del local o abrir cualquiera de las 3 terminales de venta presencial.
          </p>
        </div>

        {/* GRILLA DE 4 TARJETAS: PANEL ADMIN + 3 CAJAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* TARJETA 1: PANEL ADMIN SEDE (DESTACADA) */}
          <Link
            href="/admin_sede"
            className="group bg-gradient-to-b from-purple-900/20 to-dark-800 hover:to-dark-800/80 border-2 border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
              Mando Principal
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center text-2xl mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg shadow-purple-500/20">
                <i className="fa-solid fa-gauge-high"></i>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                  Panel Admin Sede
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full mb-3">
                Supervisión Integral
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Gestión de programación de funciones, cartelera local, configuración de salas, control de mantenimiento, personal asignado y reportes de la sede.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
              <span>Abrir Panel de Sede</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* TARJETA 2: BOLETERÍA */}
          <Link
            href="/counter/boleteria"
            className="group bg-dark-800 hover:bg-dark-800/80 border border-white/10 hover:border-blue-500/60 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-ticket"></i>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                  Counter Boletería
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full mb-3">
                Taquilla Exclusiva
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Venta presencial de entradas de cine, cartelera de horarios de hoy/mañana, selección de matriz de sala y emisión de ticket con QR.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Terminal Boletería</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* TARJETA 3: DULCERÍA */}
          <Link
            href="/counter/dulceria"
            className="group bg-dark-800 hover:bg-dark-800/80 border border-white/10 hover:border-amber-500/60 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xl hover:shadow-amber-500/10"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-5 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-bowl-food"></i>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                  Counter Dulcería
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full mb-3">
                Candy Bar & Snacks
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Venta rápida y despacho en barra de popcorn gigante, combos de estreno, bebidas, dulces y cobro POS con ticket térmico.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Terminal Dulcería</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* TARJETA 4: CAJA MIXTA */}
          <Link
            href="/counter/mixto"
            className="group bg-dark-800 hover:bg-dark-800/80 border border-white/10 hover:border-emerald-500/60 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xl hover:shadow-emerald-500/10"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-cash-register"></i>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  Counter Mixto
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full mb-3">
                Caja Integral Unificada
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Punto de venta completo: emisión de entradas y dulcería en una sola orden o conmutación rápida a solo snacks según la demanda.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Caja Mixta</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>
        </div>
      </main>

      {/* ── PIE DEL HUB ── */}
      <footer className="max-w-7xl w-full mx-auto pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Cine Náutica · Sistema Interno POS Multisede</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Terminal Conectada a Supabase Realtime
          </span>
        </div>
      </footer>
    </div>
  );
}
