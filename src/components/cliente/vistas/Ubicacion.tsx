"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SedeDao } from "@/src/daos/SedeDao";
import type { SedeDTO } from "@/src/dtos/cartelera";

export default function Ubicacion() {
  const router = useRouter();

  const [sedes, setSedes] = useState<SedeDTO[]>([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<SedeDTO | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarSedes() {
      try {
        const res = await SedeDao.obtenerSedes();
        if (activo) {
          setSedes(res);
          if (res.length > 0) {
            setSedeSeleccionada(res[0]);
          }
        }
      } catch (e) {
        console.error("Error al cargar sedes:", e);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarSedes();

    return () => {
      activo = false;
    };
  }, []);

  const verCarteleraSede = (sede: SedeDTO) => {
    try {
      localStorage.setItem("cinenautica_sede_activa", String(sede.id_sede));
    } catch {
      // Ignorar
    }
    router.push(`/?sede=${sede.id_sede}`);
  };

  // Agrupar sedes por ciudad
  const sedesPorCiudad = sedes.reduce((acc, sede) => {
    const ciudad = sede.ciudad?.nombre || "Otras";
    if (!acc[ciudad]) acc[ciudad] = [];
    acc[ciudad].push(sede);
    return acc;
  }, {} as Record<string, SedeDTO[]>);

  const lat = sedeSeleccionada?.latitud || -9.0746;
  const lon = sedeSeleccionada?.longitud || -78.5936;
  const mapaUrl = `https://maps.google.com/maps?q=${lat},${lon}&hl=es&z=15&output=embed`;

  return (
    <div
      className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 relative z-10 pt-24"
      id="vista-ubicacion"
    >
      <div className="max-w-[1300px] mx-auto px-4 md:px-12">
        {/* Botón Volver */}
        <button
          type="button"
          className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Volver al Inicio
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow text-2xl shadow-lg">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Nuestras Sedes
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Encuentra la sede más cercana a ti con la mejor calidad de sonido e imagen
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-dark-800 rounded-2xl h-96 animate-pulse"></div>
            <div className="bg-dark-800 rounded-2xl h-96 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* Mapa Interactivo y Detalle de Sede Activa */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contenedor del Mapa */}
              <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-dark-800">
                <iframe
                  title={`Mapa de ${sedeSeleccionada?.nombre}`}
                  src={mapaUrl}
                  width="100%"
                  height="100%"
                  className="border-0 filter brightness-90 contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Ficha Informativa de la Sede Seleccionada */}
              {sedeSeleccionada && (
                <div className="bg-dark-800/90 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                        {sedeSeleccionada.ciudad?.nombre || "Perú"}
                      </span>
                      <h2 className="text-2xl font-bold text-white">
                        {sedeSeleccionada.nombre}
                      </h2>
                    </div>
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full w-max flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Abierto hoy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm pt-2">
                    <p className="flex items-start gap-3 bg-dark-900/60 p-3 rounded-xl border border-white/5">
                      <i className="fa-solid fa-map-pin text-brand-blue mt-0.5 text-base shrink-0"></i>
                      <span>
                        <strong className="text-white block text-xs">Dirección:</strong>
                        {sedeSeleccionada.direccion || "Dirección céntrica"}
                      </span>
                    </p>
                    <p className="flex items-start gap-3 bg-dark-900/60 p-3 rounded-xl border border-white/5">
                      <i className="fa-solid fa-clock text-brand-yellow mt-0.5 text-base shrink-0"></i>
                      <span>
                        <strong className="text-white block text-xs">Horario de atención:</strong>
                        Lunes a Domingo: 13:00 - 23:30
                      </span>
                    </p>
                    <p className="flex items-start gap-3 bg-dark-900/60 p-3 rounded-xl border border-white/5">
                      <i className="fa-solid fa-phone text-emerald-400 mt-0.5 text-base shrink-0"></i>
                      <span>
                        <strong className="text-white block text-xs">Teléfono:</strong>
                        {sedeSeleccionada.telefono || "(043) 345-678"}
                      </span>
                    </p>
                    <p className="flex items-start gap-3 bg-dark-900/60 p-3 rounded-xl border border-white/5">
                      <i className="fa-solid fa-film text-purple-400 mt-0.5 text-base shrink-0"></i>
                      <span>
                        <strong className="text-white block text-xs">Instalaciones:</strong>
                        {sedeSeleccionada.cant_salas || 5} salas digitales (2D, 3D, XD y VIP)
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => verCarteleraSede(sedeSeleccionada)}
                    className="mt-6 w-full sm:w-auto bg-brand-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-brand-blue/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-ticket"></i>
                    Ver cartelera de {sedeSeleccionada.nombre}
                  </button>
                </div>
              )}
            </div>

            {/* Selector de Sedes agrupadas por ciudad */}
            <div className="bg-dark-800/90 border border-white/10 rounded-2xl p-5 shadow-xl h-max max-h-[640px] overflow-y-auto backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-signs-post text-brand-yellow"></i>
                Seleccionar sede
              </h3>

              {Object.entries(sedesPorCiudad).map(([ciudad, listaSedes]) => (
                <div key={ciudad} className="mb-5 last:mb-0">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mb-2.5">
                    {ciudad}
                  </p>
                  <div className="space-y-2">
                    {listaSedes.map((sede) => {
                      const seleccionada = sedeSeleccionada?.id_sede === sede.id_sede;
                      return (
                        <button
                          key={sede.id_sede}
                          type="button"
                          onClick={() => setSedeSeleccionada(sede)}
                          className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all cursor-pointer ${
                            seleccionada
                              ? "bg-dark-900 border-2 border-brand-yellow shadow-md"
                              : "bg-dark-900/60 hover:bg-dark-900 border border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              seleccionada
                                ? "bg-brand-yellow text-dark-900"
                                : "bg-brand-blue/10 border border-brand-blue/30 text-brand-blue"
                            }`}
                          >
                            <i className="fa-solid fa-location-dot text-sm"></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-bold text-sm truncate ${
                                seleccionada ? "text-brand-yellow" : "text-white"
                              }`}
                            >
                              {sede.nombre}
                            </p>
                            <p className="text-slate-400 text-xs truncate">
                              {sede.direccion}
                            </p>
                          </div>
                          {seleccionada && (
                            <i className="fa-solid fa-check text-brand-yellow text-xs"></i>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
