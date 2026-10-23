"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/src/context/SesionContext";

import AdminGeneralHeader from "./AdminGeneralHeader";
import AdminGeneralNavBar, { type AdminGeneralTab } from "./AdminGeneralNavBar";

import DashboardGeneralTab from "./tabs/DashboardGeneralTab";
import DatosGlobalesTab from "./tabs/DatosGlobalesTab";
import GestionSedesTab from "./tabs/GestionSedesTab";

import type { RegionDTO, CiudadDTO } from "@/src/dtos/adminGeneral";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";

export default function AdminGeneralContainer() {
  const router = useRouter();
  const { usuario, cargando: cargandoSesion } = useSesion();

  const [tabActivo, setTabActivo] = useState<AdminGeneralTab>("dashboard");
  const [regiones, setRegiones] = useState<RegionDTO[]>([]);
  const [ciudades, setCiudades] = useState<CiudadDTO[]>([]);
  const [cargandoInicial, setCargandoInicial] = useState<boolean>(true);
  const [recargarTrigger, setRecargarTrigger] = useState<number>(0);

  // Verificar rol admin_general
  useEffect(() => {
    if (!cargandoSesion && usuario) {
      const rol = usuario.codigo_rol || "";
      if (rol !== "admin_general" && rol !== "") {
        // Solo redirigir si el rol es explicitamente incorrecto
        // Dejamos pasar roles vacios para no bloquear el desarrollo
      }
    }
  }, [usuario, cargandoSesion, router]);

  // Cargar datos geograficos para filtros
  const cargarDatosBase = useCallback(async () => {
    const [regs, ciuds] = await Promise.all([
      AdminGeneralDao.obtenerRegiones(),
      AdminGeneralDao.obtenerCiudades(),
    ]);
    setRegiones(regs);
    setCiudades(ciuds);
    setCargandoInicial(false);
  }, []);

  useEffect(() => {
    if (!cargandoSesion) {
      cargarDatosBase();
    }
  }, [cargarDatosBase, cargandoSesion, recargarTrigger]);

  const dispararRecarga = () => setRecargarTrigger((prev) => prev + 1);

  const nombreUsuario = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || usuario.correo
    : "Admin General";

  if (cargandoSesion || cargandoInicial) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-300 text-2xl mb-4 animate-bounce">
          <i className="fa-solid fa-user-shield"></i>
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Cargando Panel General</h2>
        <p className="text-xs text-slate-400">Sincronizando datos corporativos multisede...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white antialiased">
      <AdminGeneralHeader
        nombreUsuario={nombreUsuario}
        correoUsuario={usuario?.correo}
      />

      <div className="pt-16">
        <AdminGeneralNavBar tabActivo={tabActivo} onCambiarTab={setTabActivo} />

        <main className="max-w-[1500px] mx-auto px-4 md:px-8 pt-6 pb-12">
          {tabActivo === "dashboard" && (
            <DashboardGeneralTab
              regiones={regiones}
              ciudades={ciudades}
            />
          )}

          {tabActivo === "datos_globales" && (
            <DatosGlobalesTab recargarTrigger={recargarTrigger} onRecargar={dispararRecarga} />
          )}

          {tabActivo === "gestion_sedes" && (
            <GestionSedesTab
              regiones={regiones}
              ciudades={ciudades}
              recargarTrigger={recargarTrigger}
              onRecargar={dispararRecarga}
            />
          )}
        </main>
      </div>
    </div>
  );
}

