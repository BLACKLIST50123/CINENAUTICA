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
import ModalConfirmacion from "./comun/ModalConfirmacion";

export interface AdminSedeContainerProps {
  idSedeInicial?: number;
  onVolverAdminGeneral?: () => void;
}

export default function AdminSedeContainer({
  idSedeInicial,
  onVolverAdminGeneral,
}: AdminSedeContainerProps = {}) {
  const router = useRouter();
  const { usuario, cargando: cargandoSesion } = useSesion();

  const [idSede, setIdSede] = useState<number>(idSedeInicial || 1);
  const [contextoSede, setContextoSede] = useState<ContextoSedeDTO | null>(null);
  const [salas, setSalas] = useState<SalaDetalleSedeDTO[]>([]);
  const [peliculas, setPeliculas] = useState<PeliculaCatalogoSedeDTO[]>([]);
  const [tabActivo, setTabActivo] = useState<AdminSedeTab>("dashboard");
  const [recargarTrigger, setRecargarTrigger] = useState<number>(0);
  const [cargandoInicial, setCargandoInicial] = useState<boolean>(true);

  // Guardia de cambios no guardados en Salas
  const [hayCambiosSalas, setHayCambiosSalas] = useState<boolean>(false);
  const [tabDestinoPendiente, setTabDestinoPendiente] = useState<AdminSedeTab | null>(null);

  const handleCambiarTab = (tab: AdminSedeTab) => {
    if (tab === tabActivo) return;
    if (tabActivo === "salas" && hayCambiosSalas) {
      setTabDestinoPendiente(tab);
      return;
    }
    setTabActivo(tab);
  };

  // Estados de Modales
  const [modalCrearFuncionAbierto, setModalCrearFuncionAbierto] = useState<boolean>(false);
  const [peliculaPreseleccionadaId, setPeliculaPreseleccionadaId] = useState<string | undefined>();
  const [funcionCancelar, setFuncionCancelar] = useState<FuncionAdminSedeDTO | null>(null);
  const [productoEditar, setProductoEditar] = useState<ProductoDulceriaSedeDTO | null>(null);
  const [modalCrearSalaAbierto, setModalCrearSalaAbierto] = useState<boolean>(false);
  const [modalCrearCuponLocalAbierto, setModalCrearCuponLocalAbierto] = useState<boolean>(false);
  const [modalNuevoPersonalAbierto, setModalNuevoPersonalAbierto] = useState<boolean>(false);
  const [personalFicha, setPersonalFicha] = useState<PersonalSedeDTO | null>(null);

  // 1. Obtener la sede asignada al colaborador o usar idSedeInicial
  useEffect(() => {
    async function resolverSede() {
      if (idSedeInicial) {
        setIdSede(idSedeInicial);
        return;
      }

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
  }, [usuario, cargandoSesion, idSedeInicial]);

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

  const [paramsCrearFuncion, setParamsCrearFuncion] = useState<{
    idPelicula?: string;
    fecha?: string;
    hora?: string;
    idSala?: string;
  }>({});

  const handleProgramarFuncionDesdeCartelera = (idPelicula: string) => {
    setParamsCrearFuncion({ idPelicula });
    setPeliculaPreseleccionadaId(idPelicula);
    setModalCrearFuncionAbierto(true);
  };

  const handleAbrirCrearFuncion = (params?: { fecha?: string; hora?: string; idSala?: string; idPelicula?: string }) => {
    setParamsCrearFuncion(params || {});
    setPeliculaPreseleccionadaId(params?.idPelicula);
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
        {onVolverAdminGeneral && (
          <div className="mb-4 bg-purple-950/70 border border-purple-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Modo Vista Corporativa</p>
                <p className="text-xs text-purple-200">Administrando sede individual como Super Administrador General</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onVolverAdminGeneral}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-purple-500/25 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Volver a Gestión de Sedes</span>
            </button>
          </div>
        )}

        {/* Barra de Contexto en Vivo */}
        <AdminSedeContextBar contexto={contextoSede} />

        {/* Layout en 2 columnas: Sidebar + Contenido del Tab Activo */}
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSedeSidebar tabActivo={tabActivo} onCambiarTab={handleCambiarTab} />

          <div className="flex-1 min-w-0">
            {tabActivo === "dashboard" && <DashboardTab idSede={idSede} />}

            {tabActivo === "cartelera" && (
              <CarteleraTab
                idSede={idSede}
                onIrAHorarios={() => handleCambiarTab("horarios")}
                onProgramarFuncion={handleProgramarFuncionDesdeCartelera}
              />
            )}

            {tabActivo === "horarios" && (
              <HorariosTab
                idSede={idSede}
                salas={salas}
                onAbrirCrearFuncion={handleAbrirCrearFuncion}
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
                onCambiosSinGuardarChange={setHayCambiosSalas}
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
        peliculaPreseleccionadaId={paramsCrearFuncion.idPelicula || peliculaPreseleccionadaId}
        fechaPreseleccionada={paramsCrearFuncion.fecha}
        horaPreseleccionada={paramsCrearFuncion.hora}
        salaPreseleccionadaId={paramsCrearFuncion.idSala}
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

      {/* Modal de confirmación para Descartar Cambios en Salas al cambiar de tab */}
      <ModalConfirmacion
        abierto={tabDestinoPendiente !== null}
        titulo="¿Descartar cambios no guardados?"
        mensaje="Tienes modificaciones pendientes en la configuración de la sala actual. Si cambias de pestaña ahora, perderás todos los cambios no guardados."
        tipo="advertencia"
        textoConfirmar="Salir"
        textoCancelar="Volver"
        onConfirmar={() => {
          const tab = tabDestinoPendiente!;
          setTabDestinoPendiente(null);
          setHayCambiosSalas(false);
          setTabActivo(tab);
        }}
        onCancelar={() => setTabDestinoPendiente(null)}
      />
    </div>
  );
}
