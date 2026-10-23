"use client";

import React from "react";

export type AdminGeneralTab = "dashboard" | "datos_globales" | "gestion_sedes";

interface AdminGeneralNavBarProps {
  tabActivo: AdminGeneralTab;
  onCambiarTab: (tab: AdminGeneralTab) => void;
}

const TABS: { id: AdminGeneralTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard General", icon: "fa-solid fa-chart-pie" },
  { id: "datos_globales", label: "Datos Globales", icon: "fa-solid fa-globe" },
  { id: "gestion_sedes", label: "Gestion de Sedes", icon: "fa-solid fa-store" },
];

export default function AdminGeneralNavBar({ tabActivo, onCambiarTab }: AdminGeneralNavBarProps) {
  return (
    <div className="sticky top-16 z-40 bg-dark-900/95 backdrop-blur border-b border-white/5 px-2 md:px-8">
      <div className="max-w-[1500px] mx-auto flex gap-1 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const activo = tabActivo === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onCambiarTab(tab.id)}
              className={[
                "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all",
                activo
                  ? "border-brand-blue text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20",
              ].join(" ")}
            >
              <i className={`${tab.icon} text-sm ${activo ? "text-brand-blue" : ""}`}></i>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
