"use client";

import React, { useState } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import { AdminSedeService } from "@/src/services/adminSedeService";
import type { NuevoPersonalPayload } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface ModalNuevoPersonalProps {
  abierto: boolean;
  idSede: number;
  onCerrar: () => void;
  onPersonalCreado: () => void;
}

export default function ModalNuevoPersonal({
  abierto,
  idSede,
  onCerrar,
  onPersonalCreado,
}: ModalNuevoPersonalProps) {
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [rolCodigo, setRolCodigo] = useState<"counter_boleteria" | "counter_dulceria" | "counter_mixto">("counter_boleteria");
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  if (!abierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    const payload: NuevoPersonalPayload = {
      id_sede: idSede,
      nombre,
      apellido,
      dni,
      telefono,
      correo,
      rol_codigo: rolCodigo,
    };

    const val = AdminSedeService.validarDatosPersonal(payload);
    if (!val.valido) {
      setErrorValidacion(val.error || "Datos inválidos.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const ejecutarCreacion = async () => {
    setCargando(true);
    setErrorValidacion(null);

    const payload: NuevoPersonalPayload = {
      id_sede: idSede,
      nombre,
      apellido,
      dni,
      telefono,
      correo,
      rol_codigo: rolCodigo,
    };

    const res = await AdminSedeDao.crearPersonalSede(idSede, payload);

    setCargando(false);
    setMostrarConfirmacion(false);

    if (res.exito) {
      onPersonalCreado();
      onCerrar();
    } else {
      setErrorValidacion(res.mensaje);
    }
  };

  const rolesDisplay = {
    counter_boleteria: "Boletería (Venta de Entradas)",
    counter_dulceria: "Dulcería (Confitería y Snacks)",
    counter_mixto: "Caja Mixta (Entradas + Dulcería)",
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow text-lg">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Alta de Personal</h3>
                <p className="text-xs text-slate-400">Registra un colaborador de counter para esta sede</p>
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
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorValidacion}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombres
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Jorge"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ej. Ramírez"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  DNI (8 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                  placeholder="8 dígitos"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Teléfono (9 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={9}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                  placeholder="9 dígitos"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Correo Corporativo
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@cinenautica.pe"
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Puesto / Rol Asignado
              </label>
              <select
                value={rolCodigo}
                onChange={(e) => setRolCodigo(e.target.value as any)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
              >
                <option value="counter_boleteria">Cajero de Boletería (Boletería POS)</option>
                <option value="counter_dulceria">Cajero de Dulcería (Confitería POS)</option>
                <option value="counter_mixto">Cajero de Caja Mixta (Boletería + Dulcería)</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-lg shadow-yellow-500/10 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Continuar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        abierto={mostrarConfirmacion}
        titulo="¿Confirmar Registro de Colaborador?"
        mensaje={`Se creará la cuenta corporativa para ${nombre} ${apellido} (${rolesDisplay[rolCodigo]}) en esta sede con el correo ${correo}.`}
        tipo="info"
        textoConfirmar="Sí, Registrar"
        textoCancelar="Revisar"
        cargando={cargando}
        onConfirmar={ejecutarCreacion}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
