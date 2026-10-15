"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { SedeDTO } from "@/src/dtos/cartelera";

interface CounterHubViewProps {
  sedes: { id_sede: number; nombre: string }[];
  sedeSeleccionada: number;
  onCambiarSede: (idSede: number) => void;
  rolUsuario?: string;
}

export default function CounterHubView({
  sedes,
  sedeSeleccionada,
  onCambiarSede,
  rolUsuario = "admin_sede",
}: CounterHubViewProps) {
  const sedeActual = sedes.find((s) => s.id_sede === sedeSeleccionada) || sedes[0] || {
    id_sede: 1,
    nombre: "CineNáutica Chimbote",
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col justify-between p-6 md:p-12 antialiased">
      {/* Cabecera del Hub */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/img/logo/logocinenautica.png" className="h-10" alt="Logo" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              CINE<span className="text-brand-blue">NÁUTICA</span>
              <span className="ml-3 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase font-bold">
                Admin Sede
              </span>
            </h1>
            <p className="text-xs text-slate-400">Terminal de Supervisión y Cajas POS</p>
          </div>
        </div>

        {/* Selector de Sede */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <i className="fa-solid fa-location-dot text-brand-yellow"></i>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Sede Asignada</span>
            <select
              value={sedeSeleccionada}
              onChange={(e) => onCambiarSede(Number(e.target.value))}
              className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer"
            >
              {sedes.map((s) => (
                <option key={s.id_sede} value={s.id_sede} className="bg-dark-900 text-white">
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido Principal: Las 3 Cajas */}
      <div className="max-w-6xl w-full mx-auto my-auto py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Puntos de Venta <span className="text-brand-yellow">Presencial</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Como Administrador de Sede, puedes supervisar, realizar aperturas o ingresar a cualquiera de las 3 modalidades de counter disponibles en {sedeActual.nombre}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1: Boletería */}
          <Link
            href="/counter/boleteria"
            className="group bg-dark-800 hover:bg-dark-800/80 border border-white/10 hover:border-blue-500/50 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-ticket"></i>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Counter Boletería
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full mb-3">
                Taquilla Exclusiva
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Venta presencial de entradas de cine, cartelera de funciones de hoy/mañana, selección de matriz de sala y butacas sin límite de tiempo, emisión de ticket con QR.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Terminal Boletería</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* Tarjeta 2: Dulcería */}
          <Link
            href="/counter/dulceria"
            className="group bg-dark-800 hover:bg-dark-800/80 border border-white/10 hover:border-amber-500/50 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xl hover:shadow-amber-500/10"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-5 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-bowl-food"></i>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  Counter Dulcería
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full mb-3">
                Candy Bar & Snacks
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Venta rápida y despacho en barra de popcorn gigante, combos de estreno, gaseosas, dulces y promociones con cobro POS y ticket térmico.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Terminal Dulcería</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* Tarjeta 3: Mixto */}
          <Link
            href="/counter/mixto"
            className="group bg-dark-800 hover:bg-dark-800/80 border border-white/10 hover:border-emerald-500/50 rounded-3xl p-6 transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xl hover:shadow-emerald-500/10"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-cash-register"></i>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Counter Mixto
                </h3>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full mb-3">
                Caja Integral Unificada
              </span>

              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Punto de venta completo: permite vender entradas y dulcería en una misma orden o usar el atajo directo de &quot;Solo dulcería&quot; según la afluencia del público.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Caja Mixta</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>
        </div>
      </div>

      {/* Pie de página con enlace a panel admin */}
      <div className="max-w-6xl w-full mx-auto pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Cine Náutica · Sistema Interno POS Multisede</p>
        <Link
          href="/admin_sede"
          className="text-slate-400 hover:text-brand-yellow font-bold flex items-center gap-1.5 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Volver al Panel de Admin Sede</span>
        </Link>
      </div>
    </div>
  );
}
