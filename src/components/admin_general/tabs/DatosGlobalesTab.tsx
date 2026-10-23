"use client";

import React, { useState } from "react";
import PeliculasGlobalTab from "./datos_globales/PeliculasGlobalTab";
import DulceriaGlobalTab from "./datos_globales/DulceriaGlobalTab";
import TarifasGlobalTab from "./datos_globales/TarifasGlobalTab";
import DescuentosGlobalTab from "./datos_globales/DescuentosGlobalTab";

export type SubTabGlobal = "peliculas" | "dulceria" | "tarifas" | "descuentos";

interface DatosGlobalesTabProps {
  recargarTrigger: number;
  onRecargar: () => void;
}

const SUB_TABS: { id: SubTabGlobal; label: string; icon: string }[] = [
  { id: "peliculas", label: "Películas", icon: "fa-solid fa-clapperboard" },
  { id: "dulceria", label: "Dulcería", icon: "fa-solid fa-bowl-food" },
  { id: "tarifas", label: "Tarifas", icon: "fa-solid fa-sack-dollar" },
  { id: "descuentos", label: "Descuentos", icon: "fa-solid fa-tags" },
];

export default function DatosGlobalesTab({ recargarTrigger, onRecargar }: DatosGlobalesTabProps) {
  const [subTab, setSubTab] = useState<SubTabGlobal>("peliculas");

  const subTabActual = SUB_TABS.find((t) => t.id === subTab) || SUB_TABS[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar de Datos Globales con clases del monolito */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-3 shadow-xl flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:sticky lg:top-40 scrollbar-none">
          {SUB_TABS.map((tab) => {
            const activo = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`side-tab ${activo ? "activo" : ""}`}
              >
                <i className={tab.icon}></i>
                {" "}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Contenido principal del Sub-Tab */}
      <div className="flex-grow min-w-0">
        {/* Breadcrumb idéntico al monolito */}
        <div className="flex items-center gap-3 mb-6 text-sm text-slate-400">
          <i className="fa-solid fa-globe text-brand-blue"></i>
          <span>Datos Globales</span>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
          <span className="text-white font-bold">{subTabActual.label}</span>
        </div>

        {subTab === "peliculas" && (
          <PeliculasGlobalTab recargarTrigger={recargarTrigger} onRecargar={onRecargar} />
        )}
        {subTab === "dulceria" && (
          <DulceriaGlobalTab recargarTrigger={recargarTrigger} onRecargar={onRecargar} />
        )}
        {subTab === "tarifas" && (
          <TarifasGlobalTab recargarTrigger={recargarTrigger} onRecargar={onRecargar} />
        )}
        {subTab === "descuentos" && (
          <DescuentosGlobalTab recargarTrigger={recargarTrigger} onRecargar={onRecargar} />
        )}
      </div>
    </div>
  );
}
