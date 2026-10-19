"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { PersonalSedeDTO, VentaPersonalDTO } from "@/src/dtos/adminSede";
import { useSesion } from "@/src/context/SesionContext";
import ModalConfirmacion from "../comun/ModalConfirmacion";
import ModalEditarPersonal from "../modales/ModalEditarPersonal";

interface PersonalTabProps {
  idSede: number;
  onAbrirNuevoPersonal: () => void;
  onVerFichaPersonal?: (personal: PersonalSedeDTO) => void;
  recargarTrigger: number;
}

export default function PersonalTab({
  idSede,
  onAbrirNuevoPersonal,
  recargarTrigger,
}: PersonalTabProps) {
  const { usuario } = useSesion();

  const [personalList, setPersonalList] = useState<PersonalSedeDTO[]>([]);
  const [personalSeleccionadoId, setPersonalSeleccionadoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  // Historial de ventas para el colaborador seleccionado
  const [ventasPersonal, setVentasPersonal] = useState<VentaPersonalDTO[]>([]);
  const [cargandoVentas, setCargandoVentas] = useState<boolean>(false);

  // Modales
  const [modalEditarAbierto, setModalEditarAbierto] = useState<boolean>(false);
  const [personalAlternarEstado, setPersonalAlternarEstado] = useState<PersonalSedeDTO | null>(null);
  const [cargandoAccion, setCargandoAccion] = useState<boolean>(false);
  const [mensajeAlerta, setMensajeAlerta] = useState<{ tipo: "error" | "exito"; texto: string } | null>(null);

  // Cargar lista de colaboradores de la sede
  const cargarPersonal = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerPersonalSede(idSede);

    // Filtrar estrictamente solo roles de counters y administradores de la sede
    const rolesPermitidos = [
      "counter_boleteria",
      "counter_dulceria",
      "counter_mixto",
      "admin_sede",
    ];

    const filtrados = data.filter((p) =>
      rolesPermitidos.includes((p.rol_codigo || "").toLowerCase())
    );

    setPersonalList(filtrados);

    // Si no hay seleccionado o el seleccionado ya no existe, seleccionar el primero
    if (filtrados.length > 0) {
      setPersonalSeleccionadoId((prev) => {
        const existe = filtrados.some((p) => p.id_usuario === prev);
        return existe ? prev : filtrados[0].id_usuario;
      });
    } else {
      setPersonalSeleccionadoId(null);
    }

    setCargando(false);
  }, [idSede, recargarTrigger]);

  useEffect(() => {
    cargarPersonal();
  }, [cargarPersonal]);

  // Colaborador actualmente seleccionado
  const personalActual = useMemo(() => {
    return personalList.find((p) => p.id_usuario === personalSeleccionadoId) || personalList[0] || null;
  }, [personalList, personalSeleccionadoId]);

  // Si es un Counter, cargar su historial de ventas recientes
  useEffect(() => {
    async function cargarHistorial() {
      if (!personalActual) {
        setVentasPersonal([]);
        return;
      }

      const esAdmin = personalActual.rol_codigo === "admin_sede";
      if (esAdmin) {
        setVentasPersonal([]);
        return;
      }

      setCargandoVentas(true);
      const data = await AdminSedeDao.obtenerHistorialVentasPersonal(personalActual.id_usuario);
      setVentasPersonal(data);
      setCargandoVentas(false);
    }

    cargarHistorial();
  }, [personalActual?.id_usuario, personalActual?.rol_codigo, recargarTrigger]);

  // Validaciones de seguridad para alternar estado
  const esMismoUsuarioLogueado = Boolean(
    usuario && personalActual && usuario.id_usuario === personalActual.id_usuario
  );

  const administradoresActivosCount = useMemo(() => {
    return personalList.filter((p) => p.rol_codigo === "admin_sede" && p.activo).length;
  }, [personalList]);

  const esUnicoAdminActivo = Boolean(
    personalActual &&
      personalActual.rol_codigo === "admin_sede" &&
      personalActual.activo &&
      administradoresActivosCount <= 1
  );

  // Alternar estado activo / inactivo
  const confirmarAlternarEstado = async () => {
    if (!personalAlternarEstado) return;
    setCargandoAccion(true);
    setMensajeAlerta(null);

    const nuevoEstado = !personalAlternarEstado.activo;
    const ok = await AdminSedeDao.alternarEstadoPersonal(
      personalAlternarEstado.id_usuario,
      nuevoEstado
    );

    setCargandoAccion(false);
    setPersonalAlternarEstado(null);

    if (ok) {
      setMensajeAlerta({
        tipo: "exito",
        texto: `La cuenta de '${personalAlternarEstado.nombre} ${personalAlternarEstado.apellido}' ahora está ${
          nuevoEstado ? "ACTIVA" : "INACTIVA"
        }.`,
      });
      cargarPersonal();
    } else {
      setMensajeAlerta({
        tipo: "error",
        texto: "No se pudo actualizar el estado de la cuenta. Intenta de nuevo.",
      });
    }
  };

  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) return "—";
    try {
      const d = new Date(fechaStr);
      return d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerta de feedback */}
      {mensajeAlerta && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            mensajeAlerta.tipo === "error"
              ? "bg-red-500/10 border-brand-red/30 text-brand-red"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${mensajeAlerta.tipo === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`}></i>
            <span>{mensajeAlerta.texto}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeAlerta(null)}
            className="text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* CONTENEDOR 1: Lista / Grid de Personal de la Sede */}
      <div className="bg-[#0D1627] border border-white/15 rounded-2xl p-5 md:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Equipo de Personal de la Sede</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Counters de atención al cliente y administradores asignados a esta sede ({personalList.length} miembros)
            </p>
          </div>

          <button
            type="button"
            onClick={onAbrirNuevoPersonal}
            className="px-4 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-md shadow-yellow-500/10 self-start sm:self-auto"
          >
            <i className="fa-solid fa-user-plus text-[11px]"></i>
            <span>Registrar Colaborador</span>
          </button>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            <div className="h-32 bg-white/5 rounded-xl"></div>
            <div className="h-32 bg-white/5 rounded-xl"></div>
            <div className="h-32 bg-white/5 rounded-xl"></div>
            <div className="h-32 bg-white/5 rounded-xl"></div>
          </div>
        ) : personalList.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-solid fa-users-slash text-4xl text-slate-600 mb-3"></i>
            <p className="text-slate-300 font-medium text-sm">No hay personal registrado en esta sede.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personalList.map((p) => {
              const estaSeleccionado = personalActual?.id_usuario === p.id_usuario;
              const esAdmin = p.rol_codigo === "admin_sede";

              return (
                <div
                  key={p.id_usuario}
                  onClick={() => setPersonalSeleccionadoId(p.id_usuario)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    estaSeleccionado
                      ? "bg-white/10 border-brand-yellow shadow-lg shadow-yellow-500/10 -translate-y-0.5 ring-1 ring-brand-yellow/50"
                      : "bg-[#070d18] border-white/10 hover:border-white/25 hover:bg-white/5"
                  }`}
                >
                  <div>
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                            esAdmin
                              ? "bg-amber-500/20 text-brand-yellow border-amber-500/40"
                              : "bg-brand-blue/20 text-brand-blue border-brand-blue/40"
                          }`}
                        >
                          {p.nombre.charAt(0)}
                          {p.apellido.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs leading-tight line-clamp-1">
                            {p.nombre} {p.apellido}
                          </h4>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            DNI: {p.dni || "—"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.activo ? "bg-emerald-400" : "bg-brand-red"
                        }`}
                        title={p.activo ? "Activo" : "Inactivo"}
                      ></span>
                    </div>

                    {/* Rol Badge */}
                    <div className="mb-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          esAdmin
                            ? "bg-amber-500/15 text-brand-yellow border-amber-500/30"
                            : "bg-white/5 text-slate-300 border-white/10"
                        }`}
                      >
                        {p.rol_nombre}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mb-1">
                      <i className="fa-regular fa-envelope mr-1 text-[10px]"></i>
                      {p.correo}
                    </p>
                  </div>

                  {/* Footer de la tarjeta con stats de ventas si es counter */}
                  <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                    {!esAdmin ? (
                      <>
                        <span className="text-slate-400 font-mono">
                          {p.total_ordenes_mes} órds.
                        </span>
                        <span className="font-bold text-brand-yellow font-mono">
                          S/ {p.total_recaudado_mes.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <i className="fa-solid fa-shield-halved text-brand-yellow text-[10px]"></i>
                        Supervisión Sede
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTENEDOR 2: Ficha Detallada del Colaborador Seleccionado */}
      {personalActual && (
        <div className="bg-[#0D1627] border border-white/15 rounded-2xl p-5 md:p-6 shadow-2xl space-y-6">
          {/* Header de la Ficha */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg border shadow-inner ${
                  personalActual.rol_codigo === "admin_sede"
                    ? "bg-amber-500/20 text-brand-yellow border-amber-500/40"
                    : "bg-brand-blue/20 text-brand-blue border-brand-blue/40"
                }`}
              >
                {personalActual.nombre.charAt(0)}
                {personalActual.apellido.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-extrabold text-white">
                    {personalActual.nombre} {personalActual.apellido}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      personalActual.rol_codigo === "admin_sede"
                        ? "bg-amber-500/15 text-brand-yellow border-amber-500/30"
                        : "bg-brand-blue/15 text-brand-blue border-brand-blue/30"
                    }`}
                  >
                    {personalActual.rol_nombre}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                      personalActual.activo
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-brand-red border border-red-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        personalActual.activo ? "bg-emerald-400" : "bg-brand-red"
                      }`}
                    ></span>
                    <span>{personalActual.activo ? "Cuenta Activa" : "Cuenta Desactivada"}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  ID: <span className="font-mono">{personalActual.id_usuario}</span> · Ingreso:{" "}
                  {formatearFecha(personalActual.fecha_ingreso || personalActual.asignado_en)}
                </p>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Botón Editar Datos */}
              <button
                type="button"
                onClick={() => setModalEditarAbierto(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors flex items-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-pen-to-square text-brand-yellow text-xs"></i>
                <span>Editar Datos</span>
              </button>

              {/* Botón Activar / Desactivar con protecciones */}
              <button
                type="button"
                disabled={esMismoUsuarioLogueado || esUnicoAdminActivo || cargandoAccion}
                onClick={() => setPersonalAlternarEstado(personalActual)}
                title={
                  esMismoUsuarioLogueado
                    ? "No puedes desactivar tu propia cuenta en sesión."
                    : esUnicoAdminActivo
                    ? "No se puede desactivar el único administrador activo de la sede."
                    : personalActual.activo
                    ? "Desactivar acceso"
                    : "Activar acceso"
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                  esMismoUsuarioLogueado || esUnicoAdminActivo
                    ? "opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-slate-500"
                    : personalActual.activo
                    ? "text-brand-red hover:bg-red-500/10 border-brand-red/30"
                    : "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                }`}
              >
                <i
                  className={`fa-solid ${
                    personalActual.activo ? "fa-user-slash" : "fa-user-check"
                  } text-xs`}
                ></i>
                <span>{personalActual.activo ? "Desactivar Cuenta" : "Activar Cuenta"}</span>
              </button>
            </div>
          </div>

          {/* Grilla de Datos de Contacto y Perfil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Correo Corporativo</span>
              <span className="text-white font-mono font-semibold">{personalActual.correo}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">DNI</span>
              <span className="text-white font-mono font-semibold">
                {personalActual.dni || "No registrado"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Teléfono de Contacto</span>
              <span className="text-white font-mono font-semibold">
                {personalActual.telefono || "No registrado"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Fecha de Registro</span>
              <span className="text-white font-semibold">
                {formatearFecha(personalActual.fecha_ingreso || personalActual.asignado_en)}
              </span>
            </div>
          </div>

          {/* Observaciones o Nota interna */}
          {personalActual.nota && (
            <div className="p-3.5 bg-[#070d18] border border-white/10 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Nota Interna / Observaciones:
              </span>
              <p className="text-slate-300 leading-relaxed">{personalActual.nota}</p>
            </div>
          )}

          {/* Si es Counter: Métricas de Venta e Historial de Ventas */}
          {personalActual.rol_codigo !== "admin_sede" ? (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-brand-yellow"></i>
                  <span>Historial de Ventas Recientes en Counter</span>
                </h4>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-slate-400 mr-2">Órdenes (Mes):</span>
                    <b className="text-white">{personalActual.total_ordenes_mes}</b>
                  </div>
                  <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-slate-400 mr-2">Recaudado (Mes):</span>
                    <b className="text-brand-yellow">
                      S/ {personalActual.total_recaudado_mes.toFixed(2)}
                    </b>
                  </div>
                </div>
              </div>

              {/* Tabla de ventas recientes */}
              {cargandoVentas ? (
                <div className="h-40 bg-white/5 rounded-xl animate-pulse"></div>
              ) : ventasPersonal.length === 0 ? (
                <div className="bg-[#070d18] border border-white/10 rounded-xl p-8 text-center">
                  <i className="fa-solid fa-cash-register text-3xl text-slate-600 mb-2"></i>
                  <p className="text-slate-400 text-xs">
                    Este colaborador aún no registra órdenes de venta en esta sede.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#070d18]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3.5">Código Orden</th>
                        <th className="py-2.5 px-3.5">Fecha y Hora</th>
                        <th className="py-2.5 px-3.5">Boletos / Items</th>
                        <th className="py-2.5 px-3.5">Canal</th>
                        <th className="py-2.5 px-3.5">Monto Total</th>
                        <th className="py-2.5 px-3.5 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {ventasPersonal.map((v) => (
                        <tr key={v.id_orden} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3.5 font-bold text-white">{v.codigo_orden}</td>
                          <td className="py-2.5 px-3.5 text-slate-400">
                            {new Date(v.creado_en).toLocaleString("es-PE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-300">
                            {v.total_items} {v.total_items === 1 ? "ítem" : "ítems"}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-400">{v.canal}</td>
                          <td className="py-2.5 px-3.5 font-bold text-brand-yellow">
                            S/ {v.total.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {v.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Si es Administrador: Panel de Supervisión y Alcance */
            <div className="pt-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <i className="fa-solid fa-shield-halved text-brand-yellow"></i>
                <span>Alcance y Permisos de Supervisión de Sede</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#070d18] border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 text-brand-yellow font-bold mb-1">
                    <i className="fa-solid fa-film"></i>
                    <span>Cartelera y Horarios</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Autorizado para programar funciones, modificar horarios y cancelar proyecciones.
                  </p>
                </div>

                <div className="p-3 bg-[#070d18] border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 text-brand-blue font-bold mb-1">
                    <i className="fa-solid fa-couch"></i>
                    <span>Salas y Butacas</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Control de matriz de butacas, pasillos, formatos admitidos y estado operativo.
                  </p>
                </div>

                <div className="p-3 bg-[#070d18] border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                    <i className="fa-solid fa-users-gear"></i>
                    <span>Gestión de Personal</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Alta, edición de credenciales y asignación de puestos para el equipo de la sede.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para Editar Datos del Personal */}
      <ModalEditarPersonal
        abierto={modalEditarAbierto}
        personal={personalActual}
        onCerrar={() => setModalEditarAbierto(false)}
        onGuardadoExitoso={() => {
          setMensajeAlerta({
            tipo: "exito",
            texto: "Datos del personal actualizados exitosamente en la base de datos.",
          });
          cargarPersonal();
        }}
      />

      {/* Modal de confirmación para Alternar Estado (Activar / Desactivar) */}
      <ModalConfirmacion
        abierto={!!personalAlternarEstado}
        titulo={
          personalAlternarEstado?.activo
            ? "¿Desactivar Cuenta de Personal?"
            : "¿Activar Cuenta de Personal?"
        }
        mensaje={
          personalAlternarEstado?.activo
            ? `Se deshabilitará el acceso al sistema para '${personalAlternarEstado?.nombre} ${personalAlternarEstado?.apellido}'. No podrá iniciar sesión en counters ni paneles administrativos.`
            : `Se reactivará el acceso al sistema para '${personalAlternarEstado?.nombre} ${personalAlternarEstado?.apellido}'.`
        }
        tipo={personalAlternarEstado?.activo ? "advertencia" : "info"}
        textoConfirmar={
          personalAlternarEstado?.activo ? "Sí, Desactivar" : "Sí, Activar"
        }
        textoCancelar="Cancelar"
        cargando={cargandoAccion}
        onConfirmar={confirmarAlternarEstado}
        onCancelar={() => setPersonalAlternarEstado(null)}
      />
    </div>
  );
}
