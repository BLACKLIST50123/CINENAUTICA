"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSesion } from "@/src/context/SesionContext";
import { HistorialService } from "@/src/services/historialService";
import type { OrdenCompletaDTO } from "@/src/dtos/orden";
import { abrirModalLogin } from "@/src/lib/ui/common";

export default function Historial() {
  const router = useRouter();
  const { usuario, cargando: cargandoSesion } = useSesion();

  const [ordenes, setOrdenes] = useState<OrdenCompletaDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [ordenExpandida, setOrdenExpandida] = useState<string | null>(null);

  // Búsqueda para usuarios invitados
  const [correoBusqueda, setCorreoBusqueda] = useState<string>("");
  const [buscando, setBuscando] = useState<boolean>(false);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarHistorial() {
      if (cargandoSesion) return;
      setCargando(true);
      try {
        if (usuario?.id_usuario || usuario?.correo) {
          const res = await HistorialService.obtenerHistorial(
            usuario?.id_usuario,
            usuario?.correo
          );
          if (activo) setOrdenes(res);
        } else {
          // Intentar obtener compras de invitado guardadas en localStorage si existen
          const ultimoCorreo = localStorage.getItem("cinenautica_ultimo_correo");
          if (ultimoCorreo) {
            setCorreoBusqueda(ultimoCorreo);
            const res = await HistorialService.obtenerHistorial(null, ultimoCorreo);
            if (activo) setOrdenes(res);
          } else {
            if (activo) setOrdenes([]);
          }
        }
      } catch (e) {
        console.error("Error al cargar historial de compras:", e);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarHistorial();

    return () => {
      activo = false;
    };
  }, [usuario, cargandoSesion]);

  const handleBuscarPorCorreo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correoBusqueda.trim()) return;
    setBuscando(true);
    setErrorBusqueda(null);
    try {
      const res = await HistorialService.obtenerHistorial(null, correoBusqueda.trim());
      setOrdenes(res);
      if (res.length === 0) {
        setErrorBusqueda("No se encontraron compras asociadas a este correo.");
      } else {
        localStorage.setItem("cinenautica_ultimo_correo", correoBusqueda.trim());
      }
    } catch (err: any) {
      setErrorBusqueda("Error al consultar las compras. Intenta de nuevo.");
    } finally {
      setBuscando(false);
    }
  };

  const toggleExpandir = (idOrden: string) => {
    setOrdenExpandida((prev) => (prev === idOrden ? null : idOrden));
  };

  return (
    <div
      className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 relative z-10 pt-24"
      id="vista-historial"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Botón Volver */}
        <button
          className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Volver al Inicio
        </button>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow text-2xl shadow-lg">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Mis Compras
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Revisa y descarga tus boletos electrónicos de funciones y dulcería
              </p>
            </div>
          </div>

          {/* Estado de sesión / botón login */}
          {!usuario && (
            <div className="flex items-center gap-2 bg-dark-800/80 border border-white/10 p-2.5 px-4 rounded-xl backdrop-blur-md">
              <span className="text-xs text-slate-300">¿Tienes cuenta de Socio?</span>
              <button
                type="button"
                onClick={() => abrirModalLogin()}
                className="text-xs font-bold text-brand-blue hover:text-blue-400 transition-colors underline cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </div>
          )}
        </div>

        {/* Buscador de compras por correo para usuarios invitados */}
        {!usuario && (
          <form
            onSubmit={handleBuscarPorCorreo}
            className="mb-8 p-4 md:p-6 bg-dark-800/60 border border-white/10 rounded-2xl backdrop-blur-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass text-brand-blue"></i>
                  Buscar compras como invitado
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ingresa el correo electrónico que usaste durante tu compra:
                </p>
              </div>
              <div className="flex gap-2 flex-1 md:max-w-md">
                <input
                  type="email"
                  value={correoBusqueda}
                  onChange={(e) => setCorreoBusqueda(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="flex-1 bg-dark-900 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors"
                />
                <button
                  type="submit"
                  disabled={buscando}
                  className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {buscando ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa-solid fa-search"></i>
                  )}
                  Buscar
                </button>
              </div>
            </div>
            {errorBusqueda && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {errorBusqueda}
              </p>
            )}
          </form>
        )}

        {/* Estado Cargando */}
        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-dark-800/60 rounded-2xl border border-white/5 p-5 animate-pulse h-64"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                  <div className="h-4 bg-white/10 rounded w-16"></div>
                </div>
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-white/5 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : ordenes.length === 0 ? (
          /* Estado Vacío */
          <div className="bg-dark-800/40 rounded-3xl border border-white/5 p-12 text-center max-w-lg mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-500 text-3xl mb-4">
              <i className="fa-solid fa-ticket-simple"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No tienes compras registradas
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Cuando compres entradas o combos en dulcería, podrás ver tus comprobantes y códigos QR aquí.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-brand-red/30 cursor-pointer inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-film"></i>
              Explorar Cartelera
            </button>
          </div>
        ) : (
          /* Grid de Órdenes */
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
            id="grid-historial-compras"
          >
            {ordenes.map((ord) => {
              const estadoVis = HistorialService.formatearEstado(ord.estado);
              const fechaFmt = HistorialService.formatearFecha(ord.fecha_creacion);
              const resumenAsientos = HistorialService.obtenerResumenAsientos(
                ord.entradas
              );
              const resumenProductos = HistorialService.obtenerResumenProductos(
                ord.productos
              );
              const expandida = ordenExpandida === ord.id_orden;

              return (
                <div
                  key={ord.id_orden}
                  className="bg-dark-800/90 rounded-2xl border border-white/10 p-5 shadow-xl hover:border-brand-blue/50 transition-all flex flex-col justify-between backdrop-blur-sm"
                >
                  <div>
                    {/* Header de la Tarjeta */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2.5 py-1 rounded-lg border border-brand-blue/30 font-mono">
                        {ord.codigo_orden}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${estadoVis.badgeClase}`}
                      >
                        <i className={estadoVis.icono}></i>
                        {estadoVis.label}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs mb-3 flex items-center gap-1.5">
                      <i className="fa-regular fa-clock"></i>
                      {fechaFmt}
                    </p>

                    {/* Película o Dulcería directa */}
                    {ord.pelicula ? (
                      <div className="flex gap-3 mb-3">
                        {ord.pelicula.poster_url ? (
                          <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 relative bg-dark-900 border border-white/10">
                            <Image
                              src={ord.pelicula.poster_url}
                              alt={ord.pelicula.titulo}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-16 rounded-lg bg-dark-900 border border-white/10 flex items-center justify-center shrink-0 text-slate-500 text-lg">
                            <i className="fa-solid fa-film"></i>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-bold text-base leading-tight truncate">
                            {ord.pelicula.titulo}
                          </h4>
                          <p className="text-slate-400 text-xs mt-1">
                            {ord.pelicula.fecha} • {ord.pelicula.hora} •{" "}
                            <span className="text-brand-blue font-semibold">
                              {ord.pelicula.formato}
                            </span>
                          </p>
                          <p className="text-slate-500 text-[11px] truncate">
                            {ord.pelicula.sala} • {ord.nombre_sede}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <h4 className="text-white font-bold text-base flex items-center gap-2">
                          <i className="fa-solid fa-popcorn text-brand-yellow"></i>
                          Compra de Dulcería
                        </h4>
                        <p className="text-slate-500 text-xs mt-1">
                          {ord.nombre_sede}
                        </p>
                      </div>
                    )}

                    {/* Entradas */}
                    {ord.entradas && ord.entradas.length > 0 && (
                      <p className="text-xs text-slate-300 mb-2 flex items-center gap-2 bg-dark-900/60 p-2 rounded-lg border border-white/5">
                        <i className="fa-solid fa-chair text-brand-red"></i>
                        <span className="font-semibold text-white">
                          {resumenAsientos}
                        </span>
                      </p>
                    )}

                    {/* Productos */}
                    {resumenProductos && (
                      <p className="text-xs text-slate-300 mb-3 flex items-start gap-2 bg-dark-900/60 p-2 rounded-lg border border-white/5">
                        <i className="fa-solid fa-bowl-food text-brand-yellow mt-0.5"></i>
                        <span className="truncate">{resumenProductos}</span>
                      </p>
                    )}

                    {/* Sección Expandible */}
                    {expandida && (
                      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 space-y-2 bg-dark-900/40 p-3 rounded-xl mb-3">
                        <div className="flex justify-between text-slate-400">
                          <span>Comprobante:</span>
                          <span className="text-white font-mono font-bold">
                            {ord.comprobante?.numero_comprobante || "Electrónico"}
                          </span>
                        </div>
                        {ord.descuento_cupon > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Descuento Cupón:</span>
                            <span>- S/ {ord.descuento_cupon.toFixed(2)}</span>
                          </div>
                        )}
                        {ord.descuento_puntos > 0 && (
                          <div className="flex justify-between text-brand-yellow">
                            <span>Puntos Canjeados:</span>
                            <span>- S/ {ord.descuento_puntos.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                          <span>Canal:</span>
                          <span className="text-white">{ord.canal || "Web"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer de la Tarjeta */}
                  <div>
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center mb-3">
                      <div>
                        <span className="text-slate-400 text-xs block">
                          Total pagado
                        </span>
                        <span className="text-brand-yellow font-bold text-xl">
                          S/ {ord.total.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpandir(ord.id_orden)}
                        className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {expandida ? "Menos info" : "Detalles"}
                        <i
                          className={`fa-solid fa-chevron-${
                            expandida ? "up" : "down"
                          } text-[10px]`}
                        ></i>
                      </button>
                    </div>

                    {/* Botón Ver Ticket / Boleta */}
                    <button
                      type="button"
                      onClick={() => router.push(`/ticket?orden=${ord.id_orden}`)}
                      className="w-full bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-white font-bold text-xs py-2.5 rounded-xl border border-brand-blue/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-brand-blue/20"
                    >
                      <i className="fa-solid fa-qrcode"></i>
                      Ver Ticket y Boleta
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
