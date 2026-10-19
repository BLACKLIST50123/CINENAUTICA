"use client";

import React from "react";

export type AdminSedeTab =
  | "dashboard"
  | "cartelera"
  | "horarios"
  | "dulceria"
  | "salas"
  | "tarifas"
  | "descuentos"
  | "socios"
  | "personal";

interface AdminSedeSidebarProps {
  tabActivo: AdminSedeTab;
  onCambiarTab: (tab: AdminSedeTab) => void;
}

const TABS: { id: AdminSedeTab; label: string; icono: string }[] = [
  { id: "dashboard", label: "Dashboard", icono: "fa-chart-line" },
  { id: "cartelera", label: "Cartelera", icono: "fa-clapperboard" },
  { id: "horarios", label: "Horarios", icono: "fa-clock" },
  { id: "dulceria", label: "Dulcería", icono: "fa-bowl-food" },
  { id: "salas", label: "Salas", icono: "fa-chair" },
  { id: "tarifas", label: "Tarifas", icono: "fa-sack-dollar" },
  { id: "descuentos", label: "Descuentos", icono: "fa-tags" },
  { id: "socios", label: "Socios", icono: "fa-id-card" },
  { id: "personal", label: "Personal", icono: "fa-users-gear" },
];

export default function AdminSedeSidebar({
  tabActivo,
  onCambiarTab,
}: AdminSedeSidebarProps) {
  return (
    <aside className="w-full lg:w-60 flex-shrink-0">
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-2.5 shadow-xl flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:sticky lg:top-24 scrollbar-none">
        {TABS.map((tab) => {
          const esActivo = tabActivo === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onCambiarTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal text-left ${
                esActivo
                  ? "bg-brand-blue text-white shadow-lg shadow-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <i className={`fa-solid ${tab.icono} w-4 text-center text-base ${esActivo ? "text-white" : "text-brand-yellow"}`}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
