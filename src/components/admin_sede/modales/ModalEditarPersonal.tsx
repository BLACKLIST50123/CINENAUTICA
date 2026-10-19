"use client";

import React, { useState, useEffect } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { PersonalSedeDTO, EditarPersonalPayload } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalEditarPersonalProps {
  abierto: boolean;
  personal: PersonalSedeDTO | null;
  onCerrar: () => void;
  onGuardadoExitoso: () => void;
}

export default function ModalEditarPersonal({
  abierto,
  personal,
  onCerrar,
  onGuardadoExitoso,
}: ModalEditarPersonalProps) {
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [nota, setNota] = useState<string>("");
  const [rolCodigo, setRolCodigo] = useState<
    "counter_boleteria" | "counter_dulceria" | "counter_mixto" | "admin_sede"
  >("counter_boleteria");
  const [password, setPassword] = useState<string>("");

  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    if (personal) {
      setNombre(personal.nombre || "");
      setApellido(personal.apellido || "");
      setCorreo(personal.correo || "");
      setDni(personal.dni || "");
      setTelefono(personal.telefono || "");
      setNota(personal.nota || "");
      setRolCodigo((personal.rol_codigo as any) || "counter_boleteria");
      setPassword("");
      setErrorValidacion(null);
    }
  }, [personal, abierto]);

  if (!abierto || !personal) return null;

  const validarFormulario = (): boolean => {
    setErrorValidacion(null);

    if (!nombre.trim() || !apellido.trim()) {
      setErrorValidacion("El nombre y apellido son obligatorios.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      setErrorValidacion("Ingresa un correo electrónico corporativo válido.");
      return false;
    }

    const dniLimpio = dni.trim();
    if (dniLimpio && !/^\d{8}$/.test(dniLimpio)) {
      setErrorValidacion("El DNI debe contener exactamente 8 dígitos numéricos.");
      return false;
    }

    const telLimpio = telefono.trim();
    if (telLimpio && !/^\d{9}$/.test(telLimpio)) {
      setErrorValidacion("El teléfono debe contener exactamente 9 dígitos numéricos.");
      return false;
    }

    if (password && password.length < 6) {
      setErrorValidacion("Si deseas cambiar la contraseña, debe tener al menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      setMostrarConfirmacion(true);
    }
  };

  const ejecutarGuardado = async () => {
    setCargando(true);
    setErrorValidacion(null);

    const payload: EditarPersonalPayload = {
      id_usuario: personal.id_usuario,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      correo: correo.trim().toLowerCase(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      nota: nota.trim(),
      rol_codigo: rolCodigo,
      password: password.trim() ? password.trim() : undefined,
    };

    const res = await AdminSedeDao.actualizarDatosPersonal(payload);
    setCargando(false);
    setMostrarConfirmacion(false);

    if (res.exito) {
      onGuardadoExitoso();
      onCerrar();
    } else {
      setErrorValidacion(res.mensaje);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-[#0D1627] border border-white/15 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue text-lg">
                <i className="fa-solid fa-user-pen"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Editar Datos del Personal</h3>
                <p className="text-xs text-slate-400">Modifica perfil, credenciales y rol en la sede</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {errorValidacion && (
            <div className="mb-4 p-3 bg-red-500/10 border border-brand-red/30 rounded-xl flex items-center gap-2 text-xs text-brand-red">
              <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
              <span>{errorValidacion}</span>
            </div>
          )}

          <form onSubmit={handlePreSubmit} className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombres <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Apellidos <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            {/* Correo y Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico <span className="text-brand-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Rol Asignado <span className="text-brand-red">*</span>
                </label>
                <select
                  value={rolCodigo}
                  onChange={(e) => setRolCodigo(e.target.value as any)}
                  className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                >
                  <option value="counter_boleteria">Counter Boletería</option>
                  <option value="counter_dulceria">Counter Dulcería</option>
                  <option value="counter_mixto">Counter Mixto</option>
                  <option value="admin_sede">Administrador de Sede</option>
                </select>
              </div>
            </div>

            {/* DNI y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  DNI (8 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                  placeholder="87654321"
                  className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Teléfono (9 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={9}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                  placeholder="987654321"
                  className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
                />
              </div>
            </div>

            {/* Nota Interna */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nota Interna / Observaciones
              </label>
              <textarea
                rows={2}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Horario habitual, observaciones del supervisor, notas de capacitación..."
                className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
              ></textarea>
            </div>

            {/* Contraseña Opcional */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nueva Contraseña <span className="text-slate-500 font-normal">(Dejar en blanco para mantener la actual)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070d18] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono"
              />
            </div>

            {/* Botones de acción */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 transition-colors shadow-md shadow-yellow-500/10 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-floppy-disk text-[11px]"></i>
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de confirmación para guardar cambios */}
      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo="¿Confirmar Actualización de Datos?"
        mensaje={`Se actualizarán los datos de perfil y rol de '${nombre} ${apellido}' (${correo}).`}
        tipo="info"
        textoConfirmar="Sí, Guardar"
        textoCancelar="Cancelar"
        cargando={cargando}
        onConfirmar={ejecutarGuardado}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
