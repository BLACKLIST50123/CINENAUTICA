"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { TarifaSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface TarifasTabProps {
  idSede: number;
}

export default function TarifasTab({ idSede }: TarifasTabProps) {
  const [tarifas, setTarifas] = useState<TarifaSedeDTO[]>([]);
  const [preciosLocalesEditados, setPreciosLocalesEditados] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState<boolean>(true);
  const [tarifaGuardarPendiente, setTarifaGuardarPendiente] = useState<{
    tarifa: TarifaSedeDTO;
    nuevoPrecio: number;
  } | null>(null);
  const [tarifaRestablecerPendiente, setTarifaRestablecerPendiente] = useState<TarifaSedeDTO | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarTarifas = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerTarifasSede(idSede);
    setTarifas(data);

    const inputsMap: Record<string, string> = {};
    data.forEach((t) => {
      inputsMap[t.id_tarifa] = t.precio_local.toFixed(2);
    });
    setPreciosLocalesEditados(inputsMap);
    setCargando(false);
  }, [idSede]);

  useEffect(() => {
    cargarTarifas();
  }, [cargarTarifas]);

  const tarifasDiasSemana = tarifas.filter((t) => t.es_dia_semana);
  const tarifasGenerales = tarifas.filter((t) => !t.es_dia_semana);

  const solicitarGuardarTarifa = (tarifa: TarifaSedeDTO) => {
    const val = parseFloat(preciosLocalesEditados[tarifa.id_tarifa] || "0");
    if (isNaN(val) || val <= 0) return;
    setTarifaGuardarPendiente({ tarifa, nuevoPrecio: val });
  };

  const confirmarGuardarTarifa = async () => {
    if (!tarifaGuardarPendiente) return;
    setGuardando(true);

    const { tarifa, nuevoPrecio } = tarifaGuardarPendiente;
    const ok = await AdminSedeDao.guardarTarifaSede(idSede, tarifa.id_tarifa, nuevoPrecio);

    setGuardando(false);
    setTarifaGuardarPendiente(null);

    if (ok) {
      setMensaje(`Tarifa de ${tarifa.dia_nombre} actualizada a S/ ${nuevoPrecio.toFixed(2)}.`);
      setTimeout(() => setMensaje(null), 4000);
      cargarTarifas();
    }
  };

  const solicitarRestablecerTarifa = (tarifa: TarifaSedeDTO) => {
    setTarifaRestablecerPendiente(tarifa);
  };

  const confirmarRestablecerTarifa = async () => {
    if (!tarifaRestablecerPendiente) return;
    setGuardando(true);

    const ok = await AdminSedeDao.guardarTarifaSede(
      idSede,
      tarifaRestablecerPendiente.id_tarifa,
      tarifaRestablecerPendiente.precio_general
    );

    setGuardando(false);
    const nombreDia = tarifaRestablecerPendiente.dia_nombre;
    const precioGen = tarifaRestablecerPendiente.precio_general;
    setTarifaRestablecerPendiente(null);

    if (ok) {
      setMensaje(`Tarifa de ${nombreDia} restablecida al precio general de S/ ${precioGen.toFixed(2)}.`);
      setTimeout(() => setMensaje(null), 4000);
      cargarTarifas();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Tarifas y Precios de Boletería</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Consulta de tarifas generales y personalización de precios de días de semana para esta sede
        </p>
      </div>

      {mensaje && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i>
          <span>{mensaje}</span>
        </div>
      )}

      {/* Sección 1: Tarifas de Días de Semana (Editables por la Sede) */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-calendar-week text-brand-yellow"></i>
              <span>Tarifas por Día de Semana (Precios Locales)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Personaliza el precio de la entrada general para cada día según promociones locales
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="h-40 bg-dark-800 rounded-xl animate-pulse"></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-800 text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Día</th>
                  <th className="py-3 px-4">Precio General Base</th>
                  <th className="py-3 px-4">Precio Local de Sede</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tarifasDiasSemana.map((t) => {
                  const valorInput = preciosLocalesEditados[t.id_tarifa] || t.precio_local.toFixed(2);
                  const haCambiado = Math.abs(parseFloat(valorInput) - t.precio_local) > 0.01;

                  return (
                    <tr key={t.id_tarifa} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white text-sm">{t.dia_nombre}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        S/ {t.precio_general.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                            S/
                          </span>
                          <input
                            type="number"
                            step="0.50"
                            min="1"
                            value={valorInput}
                            onChange={(e) =>
                              setPreciosLocalesEditados({
                                ...preciosLocalesEditados,
                                [t.id_tarifa]: e.target.value,
                              })
                            }
                            className="w-full bg-dark-800 border border-white/10 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow font-mono font-bold"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {Math.abs(t.precio_local - t.precio_general) > 0.01 && (
                            <button
                              type="button"
                              disabled={guardando}
                              onClick={() => solicitarRestablecerTarifa(t)}
                              title="Restablecer al precio base corporativo"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                            >
                              <i className="fa-solid fa-rotate-left text-[10px]"></i>
                              <span>Restablecer</span>
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={!haCambiado || guardando}
                            onClick={() => solicitarGuardarTarifa(t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              haCambiado
                                ? "bg-brand-yellow hover:bg-yellow-400 text-dark-950 shadow-sm"
                                : "bg-white/5 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            Guardar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sección 2: Tarifas Generales del Sistema (Solo Lectura) */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-lock text-brand-blue"></i>
            <span>Tarifas Generales Corporativas (Solo Lectura)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Fijadas centralmente por el Administrador General para toda la cadena
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {tarifasGenerales.map((t) => (
            <div key={t.id_tarifa} className="bg-dark-800 border border-white/5 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
                {t.tipo_tarifa.replace("_", " ")}
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white font-mono">
                  S/ {t.precio_general.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">Corporativo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación para guardar cambios de tarifa */}
      <ModalConfirmacion
        abierto={!!tarifaGuardarPendiente}
        titulo="¿Guardar Nueva Tarifa?"
        mensaje={`Se actualizará el precio de la entrada para los días ${
          tarifaGuardarPendiente?.tarifa.dia_nombre
        } a S/ ${tarifaGuardarPendiente?.nuevoPrecio.toFixed(2)} en esta sede.`}
        tipo="info"
        textoConfirmar="Confirmar Precio"
        textoCancelar="Cancelar"
        cargando={guardando}
        onConfirmar={confirmarGuardarTarifa}
        onCancelar={() => setTarifaGuardarPendiente(null)}
      />

      {/* Modal de confirmación para restablecer tarifa al precio general */}
      <ModalConfirmacion
        abierto={!!tarifaRestablecerPendiente}
        titulo="¿Restablecer Tarifa al Precio General?"
        mensaje={`La tarifa para los días ${
          tarifaRestablecerPendiente?.dia_nombre
        } volverá al precio base corporativo de S/ ${tarifaRestablecerPendiente?.precio_general.toFixed(2)}.`}
        tipo="advertencia"
        textoConfirmar="Sí, Restablecer"
        textoCancelar="Cancelar"
        cargando={guardando}
        onConfirmar={confirmarRestablecerTarifa}
        onCancelar={() => setTarifaRestablecerPendiente(null)}
      />
    </div>
  );
}
