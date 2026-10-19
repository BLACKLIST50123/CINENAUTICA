"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/src/context/SesionContext";
import { supabase } from "@/src/lib/supabase/cliente";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type {
  ContextoSedeDTO,
  SalaDetalleSedeDTO,
  PeliculaCatalogoSedeDTO,
  FuncionAdminSedeDTO,
  ProductoDulceriaSedeDTO,
  PersonalSedeDTO,
} from "@/src/dtos/adminSede";

import AdminSedeHeader from "./AdminSedeHeader";
import AdminSedeContextBar from "./AdminSedeContextBar";
import AdminSedeSidebar, { type AdminSedeTab } from "./AdminSedeSidebar";

import DashboardTab from "./tabs/DashboardTab";
import CarteleraTab from "./tabs/CarteleraTab";
import HorariosTab from "./tabs/HorariosTab";
import DulceriaTab from "./tabs/DulceriaTab";
import SalasTab from "./tabs/SalasTab";
import TarifasTab from "./tabs/TarifasTab";
import DescuentosTab from "./tabs/DescuentosTab";
import SociosTab from "./tabs/SociosTab";
import PersonalTab from "./tabs/PersonalTab";

import ModalCrearFuncion from "./modales/ModalCrearFuncion";
import ModalCancelarFuncion from "./modales/ModalCancelarFuncion";
import ModalPrecioDulce from "./modales/ModalPrecioDulce";
import ModalCrearSala from "./modales/ModalCrearSala";
import ModalCrearCuponLocal from "./modales/ModalCrearCuponLocal";
import ModalNuevoPersonal from "./modales/ModalNuevoPersonal";
import ModalFichaPersonal from "./modales/ModalFichaPersonal";

export default function AdminSedeContainer() {
  const router = useRouter();
  const { usuario, cargando: cargandoSesion } = useSesion();

  const [idSede, setIdSede] = useState<number>(1);
  const [contextoSede, setContextoSede] = useState<ContextoSedeDTO | null>(null);
  const [salas, setSalas] = useState<SalaDetalleSedeDTO[]>([]);
  const [peliculas, setPeliculas] = useState<PeliculaCatalogoSedeDTO[]>([]);
  const [tabActivo, setTabActivo] = useState<AdminSedeTab>("dashboard");
  const [recargarTrigger, setRecargarTrigger] = useState<number>(0);
  const [cargandoInicial, setCargandoInicial] = useState<boolean>(true);

  // Estados de Modales
  const [modalCrearFuncionAbierto, setModalCrearFuncionAbierto] = useState<boolean>(false);
  const [peliculaPreseleccionadaId, setPeliculaPreseleccionadaId] = useState<string | undefined>();
  const [funcionCancelar, setFuncionCancelar] = useState<FuncionAdminSedeDTO | null>(null);
  const [productoEditar, setProductoEditar] = useState<ProductoDulceriaSedeDTO | null>(null);
  const [modalCrearSalaAbierto, setModalCrearSalaAbierto] = useState<boolean>(false);
  const [modalCrearCuponLocalAbierto, setModalCrearCuponLocalAbierto] = useState<boolean>(false);
  const [modalNuevoPersonalAbierto, setModalNuevoPersonalAbierto] = useState<boolean>(false);
  const [personalFicha, setPersonalFicha] = useState<PersonalSedeDTO | null>(null);

  // 1. Obtener la sede asignada al colaborador
  useEffect(() => {
    async function resolverSede() {
      let sedeEncontrada = 1;

      if (usuario?.id_usuario) {
        const { data: ps } = await supabase
          .from("personal_sede")
          .select("id_sede")
          .eq("id_usuario", usuario.id_usuario)
          .maybeSingle();

        if (ps?.id_sede) {
          sedeEncontrada = ps.id_sede;
        }
      }

      setIdSede(sedeEncontrada);
    }

    if (!cargandoSesion) {
      resolverSede();
    }
  }, [usuario, cargandoSesion]);

  // 2. Cargar contexto y recursos de la sede
  const cargarRecursosSede = useCallback(async () => {
    if (!idSede) return;
    const [ctx, sls, pelis] = await Promise.all([
      AdminSedeDao.obtenerContextoSede(idSede),
      AdminSedeDao.obtenerSalasSede(idSede),
      AdminSedeDao.obtenerPeliculasCatalogoSede(idSede),
    ]);

    setContextoSede(ctx);
    setSalas(sls);
    setPeliculas(pelis);
    setCargandoInicial(false);
  }, [idSede]);

  useEffect(() => {
    cargarRecursosSede();
  }, [cargarRecursosSede, recargarTrigger]);

  const dispararRecarga = () => {
    setRecargarTrigger((prev) => prev + 1);
  };

  const handleProgramarFuncionDesdeCartelera = (idPelicula: string) => {
    setPeliculaPreseleccionadaId(idPelicula);
    setModalCrearFuncionAbierto(true);
  };

  if (cargandoSesion || cargandoInicial) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue text-2xl mb-4 animate-bounce">
          <i className="fa-solid fa-store"></i>
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Cargando Panel de Administración</h2>
        <p className="text-xs text-slate-400">Sincronizando recursos operativos de la sede...</p>
      </div>
    );
  }

  const nombreUsuario = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || usuario.correo
    : "Rosa Medina";

  return (
    <div className="min-h-screen bg-dark-950 text-white antialiased">
      {/* Cabecera Corporativa */}
      <AdminSedeHeader
        nombreSede={contextoSede?.nombre || "CineNáutica Chimbote"}
        nombreUsuario={nombreUsuario}
        rolNombre="Admin de Sede"
      />

      {/* Contenedor Principal */}
      <main className="max-w-[1500px] mx-auto px-4 md:px-8 pt-24 pb-12">
        {/* Barra de Contexto en Vivo */}
        <AdminSedeContextBar contexto={contextoSede} />

        {/* Layout en 2 columnas: Sidebar + Contenido del Tab Activo */}
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSedeSidebar tabActivo={tabActivo} onCambiarTab={setTabActivo} />

          <div className="flex-1 min-w-0">
            {tabActivo === "dashboard" && <DashboardTab idSede={idSede} />}

            {tabActivo === "cartelera" && (
              <CarteleraTab
                idSede={idSede}
                onProgramarFuncion={handleProgramarFuncionDesdeCartelera}
              />
            )}

            {tabActivo === "horarios" && (
              <HorariosTab
                idSede={idSede}
                salas={salas}
                onAbrirCrearFuncion={() => {
                  setPeliculaPreseleccionadaId(undefined);
                  setModalCrearFuncionAbierto(true);
                }}
                onAbrirCancelarFuncion={(fn) => setFuncionCancelar(fn)}
                recargarTrigger={recargarTrigger}
              />
            )}

            {tabActivo === "dulceria" && (
              <DulceriaTab
                idSede={idSede}
                onEditarProducto={(p) => setProductoEditar(p)}
                recargarTrigger={recargarTrigger}
              />
            )}

            {tabActivo === "salas" && (
              <SalasTab
                idSede={idSede}
                salas={salas}
                onAbrirCrearSala={() => setModalCrearSalaAbierto(true)}
                onRecargarSalas={dispararRecarga}
              />
            )}

            {tabActivo === "tarifas" && <TarifasTab idSede={idSede} />}

            {tabActivo === "descuentos" && (
              <DescuentosTab
                idSede={idSede}
                onAbrirCrearCuponLocal={() => setModalCrearCuponLocalAbierto(true)}
                recargarTrigger={recargarTrigger}
              />
            )}

            {tabActivo === "socios" && <SociosTab idSede={idSede} />}

            {tabActivo === "personal" && (
              <PersonalTab
                idSede={idSede}
                onAbrirNuevoPersonal={() => setModalNuevoPersonalAbierto(true)}
                onVerFichaPersonal={(p) => setPersonalFicha(p)}
                recargarTrigger={recargarTrigger}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modales Funcionales */}
      <ModalCrearFuncion
        abierto={modalCrearFuncionAbierto}
        idSede={idSede}
        peliculas={peliculas}
        salas={salas}
        peliculaPreseleccionadaId={peliculaPreseleccionadaId}
        onCerrar={() => setModalCrearFuncionAbierto(false)}
        onGuardadoExitoso={dispararRecarga}
      />

      <ModalCancelarFuncion
        abierto={!!funcionCancelar}
        funcion={funcionCancelar}
        idUsuarioResponsable={usuario?.id_usuario || "22222222-2222-4444-2222-222222222222"}
        onCerrar={() => setFuncionCancelar(null)}
        onCancelacionExitosa={dispararRecarga}
      />

      <ModalPrecioDulce
        abierto={!!productoEditar}
        producto={productoEditar}
        idSede={idSede}
        onCerrar={() => setProductoEditar(null)}
        onGuardadoExitoso={dispararRecarga}
      />

      <ModalCrearSala
        abierto={modalCrearSalaAbierto}
        idSede={idSede}
        onCerrar={() => setModalCrearSalaAbierto(false)}
        onSalaCreada={dispararRecarga}
      />

      <ModalCrearCuponLocal
        abierto={modalCrearCuponLocalAbierto}
        idSede={idSede}
        onCerrar={() => setModalCrearCuponLocalAbierto(false)}
        onCuponCreado={dispararRecarga}
      />

      <ModalNuevoPersonal
        abierto={modalNuevoPersonalAbierto}
        idSede={idSede}
        onCerrar={() => setModalNuevoPersonalAbierto(false)}
        onPersonalCreado={dispararRecarga}
      />

      <ModalFichaPersonal
        abierto={!!personalFicha}
        personal={personalFicha}
        onCerrar={() => setPersonalFicha(null)}
        onEstadoCambiado={dispararRecarga}
      />
    </div>
  );
}
