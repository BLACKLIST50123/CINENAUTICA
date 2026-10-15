"use client";

import React, { useState } from "react";
import { CounterService } from "@/src/services/counterService";
import type { SocioCounterDTO } from "@/src/dtos/counter";

interface ModalVincularSocioProps {
  abierto: boolean;
  onCerrar: () => void;
  socioActivo: SocioCounterDTO | null;
  onSeleccionarSocio: (socio: SocioCounterDTO | null) => void;
}

export default function ModalVincularSocio({
  abierto,
  onCerrar,
  socioActivo,
  onSeleccionarSocio,
}: ModalVincularSocioProps) {
  const [tab, setTab] = useState<"buscar" | "registrar">("buscar");

  // Estado pestaña buscar
  const [criterio, setCriterio] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [socioEncontrado, setSocioEncontrado] = useState<SocioCounterDTO | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  // Estado pestaña registrar
  const [nuevoDni, setNuevoDni] = useState("");
  const [nuevosNombres, setNuevosNombres] = useState("");
  const [nuevosApellidos, setNuevosApellidos] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState<string | null>(null);

  if (!abierto) return null;

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criterio.trim()) return;

    setBuscando(true);
    setErrorBusqueda(null);
    setSocioEncontrado(null);

    try {
      const resultado = await CounterService.buscarSocio(criterio);
      if (resultado) {
        setSocioEncontrado(resultado);
      } else {
        setErrorBusqueda("No se encontró ningún socio registrado con ese DNI o Código.");
      }
    } catch (err: any) {
      setErrorBusqueda(err.message || "Error al buscar socio.");
    } finally {
      setBuscando(false);
    }
  };

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorRegistro(null);

    if (nuevoDni.trim().length !== 8) {
      setErrorRegistro("El DNI debe contener exactamente 8 dígitos.");
      return;
    }
    if (!nuevosNombres.trim() || !nuevosApellidos.trim()) {
      setErrorRegistro("Nombres y apellidos son requeridos.");
      return;
    }

    setRegistrando(true);
    try {
      const socioNuevo = await CounterService.registrarSocioRapido({
        dni: nuevoDni.trim(),
        nombres: nuevosNombres.trim(),
        apellidos: nuevosApellidos.trim(),
        telefono: nuevoTelefono.trim() || "999999999",
        correo: nuevoCorreo.trim() || `socio_${nuevoDni.trim()}@cinenautica.pe`,
      });

      onSeleccionarSocio(socioNuevo);
      onCerrar();
    } catch (err: any) {
      setErrorRegistro(err.message || "Error al afiliar al nuevo socio.");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Cabecera del modal */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center">
              <i className="fa-solid fa-id-card text-brand-blue text-sm"></i>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Programa Socio Náutica</h3>
              <p className="text-xs text-slate-400">Vincular o afiliar cliente en ventanilla</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Socio actualmente vinculado */}
        {socioActivo && (
          <div className="px-5 py-3 bg-brand-blue/10 border-b border-brand-blue/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-brand-blue"></i>
              <span className="text-xs text-white">
                Vinculado a: <b>{socioActivo.nombre_completo}</b> ({socioActivo.puntos} pts)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onSeleccionarSocio(null);
                onCerrar();
              }}
              className="text-xs text-brand-red hover:underline font-semibold"
            >
              Desvincular
            </button>
          </div>
        )}

        {/* Pestañas: Buscar vs Registrar */}
        <div className="flex border-b border-white/5 bg-dark-900/50">
          <button
            type="button"
            onClick={() => setTab("buscar")}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              tab === "buscar"
                ? "border-brand-blue text-white bg-dark-800"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-magnifying-glass mr-1.5"></i>
            Buscar Socio
          </button>
          <button
            type="button"
            onClick={() => setTab("registrar")}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              tab === "registrar"
                ? "border-brand-blue text-white bg-dark-800"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-user-plus mr-1.5"></i>
            Nuevo Socio Exprés
          </button>
        </div>

        {/* Contenido pestaña Buscar */}
        {tab === "buscar" && (
          <div className="p-5 space-y-4">
            <form onSubmit={handleBuscar} className="flex gap-2">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                  type="text"
                  value={criterio}
                  onChange={(e) => setCriterio(e.target.value)}
                  placeholder="DNI (8 dígitos) o Código (SOC-...)"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={buscando || !criterio.trim()}
                className="bg-brand-blue hover:bg-brand-dark-blue disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                {buscando ? <i className="fa-solid fa-spinner fa-spin"></i> : "Buscar"}
              </button>
            </form>

            {errorBusqueda && (
              <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-3 text-xs text-brand-red flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{errorBusqueda}</span>
              </div>
            )}

            {socioEncontrado && (
              <div className="bg-dark-900 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">{socioEncontrado.nombre_completo}</h4>
                    <p className="text-xs text-slate-400 font-mono">DNI: {socioEncontrado.dni}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Nivel {socioEncontrado.nivel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-300">
                    Puntos acumulados: <b className="text-brand-yellow">{socioEncontrado.puntos} pts</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSeleccionarSocio(socioEncontrado);
                      onCerrar();
                    }}
                    className="bg-green-600 hover:bg-green-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Vincular a esta venta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contenido pestaña Registrar */}
        {tab === "registrar" && (
          <form onSubmit={handleRegistrar} className="p-5 space-y-3">
            {errorRegistro && (
              <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-3 text-xs text-brand-red flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{errorRegistro}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">DNI (8 dígitos) *</label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  value={nuevoDni}
                  onChange={(e) => setNuevoDni(e.target.value.replace(/\D/g, ""))}
                  placeholder="72481920"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Teléfono</label>
                <input
                  type="text"
                  maxLength={9}
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value.replace(/\D/g, ""))}
                  placeholder="987654321"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nombres *</label>
                <input
                  type="text"
                  required
                  value={nuevosNombres}
                  onChange={(e) => setNuevosNombres(e.target.value)}
                  placeholder="Juan Carlos"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Apellidos *</label>
                <input
                  type="text"
                  required
                  value={nuevosApellidos}
                  onChange={(e) => setNuevosApellidos(e.target.value)}
                  placeholder="Pérez Gómez"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={nuevoCorreo}
                onChange={(e) => setNuevoCorreo(e.target.value)}
                placeholder="cliente@gmail.com (opcional)"
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              * Se creará la afiliación gratuita con nivel Bronce y se vinculará de inmediato a la venta.
            </p>

            <button
              type="submit"
              disabled={registrando}
              className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/20"
            >
              {registrando ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Afiliando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Afiliar y Vincular al Instante</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
