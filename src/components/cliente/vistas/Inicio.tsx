"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { abrirModalTrailer } from "@/src/lib/ui/cliente";
import { abrirDetallePelicula, cambiarVista, intentarSalirDelFlujoDeCompra, S, vistaActual } from "@/src/lib/ui/nav";
import { useSesion } from "@/src/context/SesionContext";
import { CarteleraService, type DatosInicioDTO } from "@/src/services/carteleraService";
import type { PeliculaCarteleraDTO } from "@/src/dtos/cartelera";
import { PeliculaCardSkeleton } from "@/src/components/comun/skeletons";

export default function Inicio() {
  const { socio, usuario } = useSesion();

  // Estados de carga y datos desde Supabase
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [datos, setDatos] = useState<DatosInicioDTO | null>(null);

  // Estados de filtros
  const [filtroPelicula, setFiltroPelicula] = useState<string>("");
  const [filtroCiudad, setFiltroCiudad] = useState<string>("");
  const [filtroSede, setFiltroSede] = useState<string>("");
  const [filtroFechaIso, setFiltroFechaIso] = useState<string>("");

  // Control del carrusel hero
  const [slideActivo, setSlideActivo] = useState(0);
  const carruselPausado = useRef(false);

  // Cargar datos reales al montar
  useEffect(() => {
    let montado = true;
    async function cargar() {
      try {
        setCargando(true);
        setErrorCarga(null);
        const res = await CarteleraService.obtenerDatosInicio();
        if (!montado) return;
        setDatos(res);
        if (res.dias.length > 0) {
          setFiltroFechaIso(res.dias[0].fechaIso);
        }

        // Si se seleccionó una sede desde el navbar/modal externo
        if (S.sedeNav) {
          const sedeEncontrada = res.sedes.find((s) => String(s.id_sede) === String(S.sedeNav));
          if (sedeEncontrada) {
            setFiltroCiudad(String(sedeEncontrada.ciudad.id_ciudad));
            setFiltroSede(String(sedeEncontrada.id_sede));
          }
          S.sedeNav = undefined;
        }
      } catch (err: any) {
        if (!montado) return;
        console.error("Error al cargar cartelera:", err);
        setErrorCarga("No se pudo conectar con la base de datos de CineNáutica.");
      } finally {
        if (montado) setCargando(false);
      }
    }

    cargar();
    return () => {
      montado = false;
    };
  }, []);

  // Intervalo automático para rotación del carrusel
  useEffect(() => {
    if (!datos?.peliculasBanner || datos.peliculasBanner.length <= 1) return;
    const intervalo = setInterval(() => {
      if (!carruselPausado.current) {
        setSlideActivo((prev) => (prev + 1) % datos.peliculasBanner.length);
      }
    }, 6000);
    return () => clearInterval(intervalo);
  }, [datos?.peliculasBanner]);

  // Sedes filtradas por la ciudad seleccionada
  const sedesOpciones = useMemo(() => {
    if (!datos?.sedes) return [];
    if (!filtroCiudad) return datos.sedes;
    return datos.sedes.filter((s) => String(s.ciudad.id_ciudad) === filtroCiudad);
  }, [datos?.sedes, filtroCiudad]);

  // Lista de IDs de sedes de la ciudad activa (para filtro multi-sede)
  const idsSedesDeCiudad = useMemo(() => {
    if (!filtroCiudad || !datos?.sedes) return undefined;
    return datos.sedes
      .filter((s) => String(s.ciudad.id_ciudad) === filtroCiudad)
      .map((s) => s.id_sede);
  }, [datos?.sedes, filtroCiudad]);

  // Películas de cartelera filtradas dinámicamente con CarteleraService
  const peliculasFiltradas = useMemo(() => {
    if (!datos) return [];
    return CarteleraService.filtrarPeliculas(
      datos.peliculasCartelera,
      datos.funciones,
      {
        idPelicula: filtroPelicula || undefined,
        idCiudad: filtroCiudad ? Number(filtroCiudad) : undefined,
        idSede: filtroSede ? Number(filtroSede) : undefined,
        fechaIso: filtroFechaIso || undefined,
        idsSedesDeCiudad,
      }
    );
  }, [datos, filtroPelicula, filtroCiudad, filtroSede, filtroFechaIso, idsSedesDeCiudad]);

  // Próximos estrenos (películas con estado Proximamente)
  const proximosEstrenos = useMemo(() => {
    if (!datos) return [];
    return datos.peliculasCartelera.filter(
      (p) => p.estado_cartelera === "Proximamente"
    );
  }, [datos]);

  // Manejo de cambio de ciudad: resetear sede si no pertenece a la nueva ciudad
  function manejarCambioCiudad(nuevaCiudad: string) {
    setFiltroCiudad(nuevaCiudad);
    if (nuevaCiudad) {
      const pertenece = datos?.sedes.some(
        (s) => String(s.ciudad.id_ciudad) === nuevaCiudad && String(s.id_sede) === filtroSede
      );
      if (!pertenece) setFiltroSede("");
    }
  }

  // Limpiar todos los filtros a sus valores por defecto
  function limpiarFiltros() {
    setFiltroPelicula("");
    setFiltroCiudad("");
    setFiltroSede("");
    if (datos?.dias && datos.dias.length > 0) {
      setFiltroFechaIso(datos.dias[0].fechaIso);
    }
  }

  // Datos de resumen para chips de filtro
  const ciudadSeleccionada = datos?.ciudades.find((c) => String(c.id_ciudad) === filtroCiudad);
  const sedeSeleccionada = datos?.sedes.find((s) => String(s.id_sede) === filtroSede);
  const diaSeleccionado = datos?.dias.find((d) => d.fechaIso === filtroFechaIso);

  // Sincronizar el chip del navbar ("Tu sede") con la sede activa
  useEffect(() => {
    const lbl = sedeSeleccionada ? sedeSeleccionada.nombre : (ciudadSeleccionada ? ciudadSeleccionada.nombre : "Todas las sedes");
    const el = document.getElementById("sede-nav-label");
    if (el) el.textContent = lbl;
    const elMovil = document.getElementById("sede-nav-label-movil");
    if (elMovil) elMovil.textContent = lbl;
  }, [sedeSeleccionada, ciudadSeleccionada]);

  // Helper para formatear duración en horas y minutos
  function formatearDuracion(minutos: number) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }

  // Verificar si es mes de cumpleaños del socio
  const esMesCumpleanios = useMemo(() => {
    if (!socio || !socio.fecha_nacimiento) return false;
    try {
      const fechaNac = new Date(socio.fecha_nacimiento);
      const mesActual = new Date().getMonth();
      return fechaNac.getMonth() === mesActual;
    } catch {
      return false;
    }
  }, [socio]);

  return (
    <div className="transition-opacity duration-300 w-full min-h-screen" id="vista-inicio">
      {/* ── Carrusel Principal (Hero) con datos reales ── */}
      <section
        className="relative h-[70vh] min-h-[500px] md:h-[85vh] w-full bg-dark-900 overflow-hidden"
        onMouseEnter={() => { carruselPausado.current = true; }}
        onMouseLeave={() => { carruselPausado.current = false; }}
      >
        <div className="relative w-full h-full overflow-hidden" id="carrusel-principal">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            id="carrusel-slides"
            style={{ transform: `translateX(-${slideActivo * 100}%)` }}
          >
            {cargando ? (
              <div className="w-full h-full flex-shrink-0 bg-dark-950 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-20 animate-pulse">
                <div className="h-6 w-32 bg-white/10 rounded-full mb-4"></div>
                <div className="h-14 w-3/4 bg-white/20 rounded-2xl mb-4"></div>
                <div className="h-6 w-full max-w-xl bg-white/10 rounded mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-12 w-44 bg-brand-blue/50 rounded-full"></div>
                  <div className="h-12 w-40 bg-white/10 rounded-full"></div>
                </div>
              </div>
            ) : datos?.peliculasBanner && datos.peliculasBanner.length > 0 ? (
              datos.peliculasBanner.map((peli) => {
                return (
                  <div
                    key={peli.id_pelicula}
                    className="w-full h-full flex-shrink-0 relative overflow-hidden select-none"
                    style={{ minWidth: "100%", width: "100%", height: "100%", position: "relative" }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${peli.url_banner || peli.url_poster}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full w-max uppercase tracking-wider shadow-md shadow-blue-500/20">
                          {peli.tipo_lanzamiento || "En Cartelera"}
                        </span>
                        <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                          {peli.clasificacion}
                        </span>
                        {peli.formatos && peli.formatos.length > 0 && (
                          <span className="bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow px-2 py-1 rounded text-xs font-bold">
                            {peli.formatos.join(" • ")}
                          </span>
                        )}
                      </div>
                      <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-xl">
                        {peli.titulo}
                      </h1>
                      <p className="text-slate-300 text-base md:text-xl mb-6 max-w-2xl line-clamp-3 drop-shadow">
                        {peli.sinopsis}
                      </p>
                      <div className="flex flex-wrap gap-4 items-center">
                        <button
                          className="bg-brand-blue hover:bg-brand-dark-blue text-white shadow-blue-500/40 px-8 py-3.5 rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
                          onClick={() => {
                            abrirDetallePelicula(peli.id_pelicula, "cartelera");
                          }}
                        >
                          <i className="fa-solid fa-ticket"></i>
                          Ver funciones
                        </button>
                        {peli.trailer_url && (
                          <button
                            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3.5 rounded-full font-bold text-lg border border-white/20 transition-all flex items-center gap-2 transform hover:scale-105"
                            onClick={() => {
                              abrirModalTrailer(peli.trailer_url, peli.titulo);
                            }}
                          >
                            <i className="fa-solid fa-play"></i>
                            Ver Tráiler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : null}
          </div>

          {/* Flechas de navegación del carrusel */}
          {datos?.peliculasBanner && datos.peliculasBanner.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-brand-blue text-white backdrop-blur-md border border-white/15 transition-all shadow-lg hover:scale-110 active:scale-95"
                id="slide-anterior"
                aria-label="Película anterior"
                onClick={() => {
                  setSlideActivo((prev) =>
                    prev === 0 ? datos.peliculasBanner.length - 1 : prev - 1
                  );
                }}
              >
                <i className="fa-solid fa-chevron-left text-lg"></i>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-brand-blue text-white backdrop-blur-md border border-white/15 transition-all shadow-lg hover:scale-110 active:scale-95"
                id="slide-siguiente"
                aria-label="Película siguiente"
                onClick={() => {
                  setSlideActivo((prev) => (prev + 1) % datos.peliculasBanner.length);
                }}
              >
                <i className="fa-solid fa-chevron-right text-lg"></i>
              </button>

              {/* Indicadores / Dots de posición */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                {datos.peliculasBanner.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideActivo(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === slideActivo
                        ? "w-8 h-2.5 bg-brand-blue shadow-lg shadow-blue-500/50"
                        : "w-2.5 h-2.5 bg-white/40 hover:bg-white/75"
                    }`}
                    aria-label={`Ir al slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Banner mes de cumpleaños (Beneficio Socio Náutica) ── */}
      {esMesCumpleanios && (
        <div
          className="cursor-pointer bg-gradient-to-r from-brand-yellow to-yellow-500 text-black px-6 py-3 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg"
          id="banner-cumpleanos-socio"
          onClick={() => {
            intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), "vista-beneficios"));
          }}
        >
          <i className="fa-solid fa-cake-candles text-lg"></i>
          ¡Es tu mes de cumpleaños, {usuario?.nombre}! Tienes 1 entrada gratis para disfrutar en CineNáutica.
        </div>
      )}

      {/* ── Barra de Filtros Interactiva ── */}
      <section className="relative z-30 mt-6 md:mt-8 px-4 md:px-12 max-w-[1600px] mx-auto" id="barra-filtros-inicio">
        <div className="filtro-barra rounded-3xl p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,.6)] bg-dark-800/80 backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white font-bold flex items-center gap-2">
              <i className="fa-solid fa-sliders text-brand-yellow"></i>
              Encuentra tu función
            </p>
            <button
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>

          {/* Grid de 3 Selectores: Película, Ciudad, Sede */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* 1. Selector Película */}
            <div className="filtro-campo">
              <label>Película</label>
              <i className="fa-solid fa-film"></i>
              <select
                className="filtro-select"
                id="f-peli"
                value={filtroPelicula}
                onChange={(e) => setFiltroPelicula(e.target.value)}
              >
                <option value="">Todas las películas</option>
                {datos?.peliculasCartelera.map((peli) => (
                  <option key={peli.id_pelicula} value={peli.id_pelicula}>
                    {peli.titulo}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Selector Ciudad */}
            <div className="filtro-campo">
              <label>Ciudad</label>
              <i className="fa-solid fa-city"></i>
              <select
                className="filtro-select"
                id="f-ciudad"
                value={filtroCiudad}
                onChange={(e) => manejarCambioCiudad(e.target.value)}
              >
                <option value="">Todas las ciudades</option>
                {datos?.ciudades.map((ciu) => (
                  <option key={ciu.id_ciudad} value={String(ciu.id_ciudad)}>
                    {ciu.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Selector Sede */}
            <div className="filtro-campo">
              <label>Sede</label>
              <i className="fa-solid fa-location-dot"></i>
              <select
                className="filtro-select"
                id="f-sede"
                value={filtroSede}
                onChange={(e) => setFiltroSede(e.target.value)}
              >
                <option value="">Todas las sedes</option>
                {sedesOpciones.map((s) => (
                  <option key={s.id_sede} value={String(s.id_sede)}>
                    {s.nombre} ({s.ciudad.nombre})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de Fechas (7 días) */}
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
              <i className="fa-regular fa-calendar mr-1 text-brand-blue"></i>
              Fecha
            </p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {datos?.dias.map((d) => {
                const activo = d.fechaIso === filtroFechaIso;
                return (
                  <button
                    key={d.codigo}
                    className={`chip-fecha ${activo ? "activo" : ""}`}
                    type="button"
                    onClick={() => setFiltroFechaIso(d.fechaIso)}
                  >
                    <b>{d.esHoy ? "Hoy" : d.codigo === "d1" ? "Mañana" : d.diaSemanaCorto}</b>
                    <span>{d.diaMes}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen de Filtros Activos */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2" id="resumen-filtros">
            <span className="text-xs text-slate-500 mr-1">Mostrando:</span>
            <span className="chip-filtro" id="rf-cant">
              <i className="fa-solid fa-film"></i>
              {peliculasFiltradas.length} película{peliculasFiltradas.length === 1 ? "" : "s"}
            </span>

            {ciudadSeleccionada && (
              <span className="chip-filtro" id="rf-ciudad">
                <i className="fa-solid fa-city"></i>
                {ciudadSeleccionada.nombre}
              </span>
            )}

            {sedeSeleccionada && (
              <span className="chip-filtro" id="rf-sede">
                <i className="fa-solid fa-location-dot"></i>
                {sedeSeleccionada.nombre}
              </span>
            )}

            {diaSeleccionado && (
              <span className="chip-filtro" id="rf-fecha">
                <i className="fa-regular fa-calendar"></i>
                {diaSeleccionado.labelCorto}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Sección Principal: Grid de Cartelera ── */}
      <main className="px-6 md:px-12 max-w-[1600px] mx-auto bg-dark-900 pt-10 md:pt-14 pb-12 md:pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Películas en Cartelera
            </h2>
            <div className="h-1 w-20 bg-brand-blue rounded-full"></div>
          </div>
        </div>

        {/* Estado de error si falla la conexión */}
        {errorCarga && (
          <div className="p-6 mb-12 bg-red-900/30 border border-red-500/40 rounded-2xl text-center">
            <i className="fa-solid fa-triangle-exclamation text-brand-red text-2xl mb-2"></i>
            <p className="text-white font-semibold">{errorCarga}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-full text-sm font-bold"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Skeletons durante la carga */}
        {cargando && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 mb-20">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <PeliculaCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Grid de Películas Reales */}
        {!cargando && peliculasFiltradas.length > 0 && (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 mb-20"
            id="grid-cartelera"
          >
            {peliculasFiltradas.map((peli) => {
              const numSedes = peli.sedes_disponibles.length;
              return (
                <article
                  key={peli.id_pelicula}
                  className="movie-card group cursor-pointer flex flex-col h-full relative"
                  data-peli={peli.id_pelicula}
                  onClick={() => abrirDetallePelicula(peli.id_pelicula, "cartelera")}
                >
                  {/* Badge de clasificación */}
                  <div className="absolute top-2 left-2 z-20 bg-black/80 border-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                    {peli.clasificacion}
                  </div>

                  {/* Badge si es Pre-Estreno */}
                  {peli.tipo_lanzamiento === "Pre_Estreno" && (
                    <div className="absolute top-2 right-2 z-20 bg-brand-yellow text-black font-extrabold text-[10px] uppercase px-2 py-1 rounded shadow-md">
                      Pre-Estreno
                    </div>
                  )}

                  {/* Contenedor del póster con overlay interactivo */}
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                    <img
                      alt={peli.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={peli.url_poster}
                      onError={(e) => {
                        // Imagen de respaldo si el enlace externo falla
                        (e.currentTarget as HTMLImageElement).src = "/img/poster-fallback.jpg";
                      }}
                    />
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirDetallePelicula(peli.id_pelicula, "cartelera");
                        }}
                      >
                        <i className="fa-solid fa-ticket"></i>
                        Ver funciones
                      </button>
                      {peli.trailer_url && (
                        <button
                          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2"
                          onClick={(event) => {
                            event.stopPropagation();
                            abrirModalTrailer(peli.trailer_url, peli.titulo);
                          }}
                        >
                          <i className="fa-solid fa-play"></i>
                          Tráiler
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadatos de la película */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors line-clamp-1">
                      {peli.titulo}
                    </h3>
                    <p className="text-slate-400 text-sm mb-1 line-clamp-1">
                      {peli.generos.length > 0 ? peli.generos.join(" / ") : "Cine"} • {formatearDuracion(peli.duracion_min)}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-auto pt-1">
                      <span>
                        <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                        {numSedes} {numSedes === 1 ? "sede" : "sedes"}
                      </span>
                      {peli.formatos && peli.formatos.length > 0 && (
                        <div className="flex gap-1">
                          {peli.formatos.map((fmt) => (
                            <span
                              key={fmt}
                              className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Estado Vacío cuando ningún resultado coincide con los filtros */}
        {!cargando && peliculasFiltradas.length === 0 && (
          <div
            className="text-center py-16 bg-dark-800/60 border border-dashed border-white/10 rounded-3xl mb-20"
            id="cartelera-vacia"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-4">
              <i className="fa-solid fa-film text-2xl text-brand-blue"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No hay funciones con estos filtros
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">
              Prueba con otra fecha, otra sede o quita algún filtro para ver qué hay disponible.
            </p>
            <button
              className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* ── Sección de Próximos Estrenos ── */}
        <div className="mt-12">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Próximos Estrenos
            </h2>
            <div className="h-1 w-20 bg-brand-yellow rounded-full"></div>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
            id="grid-estrenos"
          >
            {proximosEstrenos.length > 0 ? (
              proximosEstrenos.map((peli) => (
                <article
                  key={peli.id_pelicula}
                  className="movie-card group cursor-pointer flex flex-col h-full relative"
                  onClick={() => abrirDetallePelicula(peli.id_pelicula, "estreno")}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                    <img
                      alt={peli.titulo}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                      src={peli.url_poster}
                    />
                    <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                      PRONTO
                    </div>
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                      {peli.trailer_url && (
                        <button
                          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2"
                          onClick={(event) => {
                            event.stopPropagation();
                            abrirModalTrailer(peli.trailer_url, peli.titulo);
                          }}
                        >
                          <i className="fa-solid fa-play"></i>
                          Ver Tráiler
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors line-clamp-1">
                      {peli.titulo}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      {peli.generos.join(" / ") || "Próximamente"}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              // Tarjetas de muestra estilizadas de próximos lanzamientos esperados
              <>
                <article
                  className="movie-card group cursor-pointer flex flex-col h-full relative"
                  onClick={() => abrirDetallePelicula("doomsday", "estreno")}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                    <img
                      alt="Avengers: Doomsday"
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                      src="https://m.media-amazon.com/images/M/MV5BNGEwYWZkN2UtOTQ5Mi00MGQzLWEzNjYtMWMyNDBkMTkzMWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                    />
                    <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                      PRONTO
                    </div>
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                      <button
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirModalTrailer("doomsday");
                        }}
                      >
                        <i className="fa-solid fa-play"></i>
                        Ver Tráiler
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                      Avengers: Doomsday
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">Acción / Superhéroes</p>
                  </div>
                </article>

                <article
                  className="movie-card group cursor-pointer flex flex-col h-full relative"
                  onClick={() => abrirDetallePelicula("godzilla-minus-one", "estreno")}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                    <img
                      alt="Godzilla Minus One"
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                      src="https://metalcorrosivo.com/wp-content/uploads/2026/09/1790563661955.jpg"
                    />
                    <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                      PRONTO
                    </div>
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                      <button
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirModalTrailer("godzilla-minus-one");
                        }}
                      >
                        <i className="fa-solid fa-play"></i>
                        Ver Tráiler
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                      Godzilla Minus One
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">Ciencia Ficción / Kaiju</p>
                  </div>
                </article>

                <article
                  className="movie-card group cursor-pointer flex flex-col h-full relative"
                  onClick={() => abrirDetallePelicula("street-fighter", "estreno")}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                    <img
                      alt="Street Fighter"
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                      src="https://m.media-amazon.com/images/M/MV5BYjhlN2EyNGUtY2U4YS00ZTQ3LTg0NTgtNGIxZmVhMDlmMjIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                    />
                    <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                      PRONTO
                    </div>
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                      <button
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirModalTrailer("street-fighter");
                        }}
                      >
                        <i className="fa-solid fa-play"></i>
                        Ver Tráiler
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                      Street Fighter
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">Acción / Aventura</p>
                  </div>
                </article>

                <article
                  className="movie-card group cursor-pointer flex flex-col h-full relative"
                  onClick={() => abrirDetallePelicula("juegos-hambre-cosecha", "estreno")}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                    <img
                      alt="Los Juegos del Hambre: Amanecer en la Cosecha"
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-uPV6Sz1kBFP1ECzxe3cyNSfC5lxngoH4H19DkQZ_9jJkiGKxPqeeHxM&s=10"
                    />
                    <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                      PRONTO
                    </div>
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                      <button
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirModalTrailer("juegos-hambre-cosecha");
                        }}
                      >
                        <i className="fa-solid fa-play"></i>
                        Ver Tráiler
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                      Los Juegos del Hambre
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">Ciencia Ficción</p>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
