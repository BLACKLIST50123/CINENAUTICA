"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FuncionService } from "@/src/services/funcionService";
import type {
  DetallePeliculaResultadoDTO,
  FuncionItemDTO,
  SedeFuncionesGrupoDTO,
} from "@/src/dtos/funcion";
import { SEL, S, go } from "@/src/lib/ui/nav";
import { AsientoService } from "@/src/services/asientoService";

interface DetallePeliculaProps {
  idPelicula: string;
}

export default function DetallePelicula({ idPelicula }: DetallePeliculaProps) {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [datos, setDatos] = useState<DetallePeliculaResultadoDTO | null>(null);

  // Filtros interactivos
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  const [filtroCiudad, setFiltroCiudad] = useState<string>("");
  const [filtroSede, setFiltroSede] = useState<string>("");

  // Sedes abiertas en acordeón (Set de id_sede)
  const [sedesAbiertas, setSedesAbiertas] = useState<Set<number>>(new Set());

  // Función activa seleccionada para la compra
  const [funcionSeleccionada, setFuncionSeleccionada] = useState<FuncionItemDTO | null>(null);

  // Cargar datos completos de la película y funciones desde Supabase
  useEffect(() => {
    let montado = true;
    async function cargar() {
      try {
        setCargando(true);
        setErrorCarga(null);
        const res = await FuncionService.obtenerDetalleCompleto(idPelicula);
        if (!montado) return;

        if (!res) {
          setErrorCarga("No se encontró la película solicitada.");
          return;
        }

        setDatos(res);

        // Limpiar residuos de funciones anteriores si no corresponden a esta película
        try {
          const raw = sessionStorage.getItem("cinenautica_seleccion_funcion");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.id_pelicula && parsed.id_pelicula !== res.pelicula.id_pelicula) {
              sessionStorage.removeItem("cinenautica_seleccion_funcion");
              sessionStorage.removeItem("cinenautica_asientos_seleccionados");
              delete SEL.id_funcion;
              delete SEL.id_sala;
              SEL.asientos = [];
              SEL.total_asientos = 0;
            }
          }
        } catch {}

        // Preseleccionar la fecha de hoy
        if (res.dias.length > 0) {
          setFechaSeleccionada(res.dias[0].fechaIso);
        }

        // Si el usuario ya venía con una sede seleccionada desde el Navbar/Inicio
        const sedePrevia = S.sedeNav || SEL.sede;
        if (sedePrevia) {
          const sedeEncontrada = res.sedes.find(
            (s) => String(s.id_sede) === String(sedePrevia) || `s${s.id_sede}` === String(sedePrevia)
          );
          if (sedeEncontrada) {
            setFiltroCiudad(String(sedeEncontrada.id_ciudad));
            setFiltroSede(String(sedeEncontrada.id_sede));
            setSedesAbiertas(new Set([sedeEncontrada.id_sede]));
          }
        }
      } catch (err: any) {
        if (!montado) return;
        console.error("Error al cargar detalle de película:", err);
        setErrorCarga("Error al conectar con la base de datos de CineNáutica.");
      } finally {
        if (montado) setCargando(false);
      }
    }

    cargar();
    return () => {
      montado = false;
    };
  }, [idPelicula]);

  // Sedes filtradas por ciudad para el <select>
  const sedesDisponibles = useMemo(() => {
    if (!datos?.sedes) return [];
    if (!filtroCiudad) return datos.sedes;
    return datos.sedes.filter((s) => String(s.id_ciudad) === filtroCiudad);
  }, [datos?.sedes, filtroCiudad]);

  // Cambiar ciudad: resetear sede si no corresponde a la nueva ciudad
  function manejarCambioCiudad(nuevaCiudad: string) {
    setFiltroCiudad(nuevaCiudad);
    if (nuevaCiudad) {
      const pertenece = datos?.sedes.some(
        (s) => String(s.id_ciudad) === nuevaCiudad && String(s.id_sede) === filtroSede
      );
      if (!pertenece) setFiltroSede("");
    }
  }

  // Grupos de sedes con funciones filtradas para la fecha activa
  const sedesConFunciones = useMemo<SedeFuncionesGrupoDTO[]>(() => {
    if (!datos?.funciones || !fechaSeleccionada) return [];
    return FuncionService.agruparPorSedeYFormato(datos.funciones, {
      fechaIso: fechaSeleccionada,
      idCiudad: filtroCiudad ? Number(filtroCiudad) : undefined,
      idSede: filtroSede ? Number(filtroSede) : undefined,
    });
  }, [datos?.funciones, fechaSeleccionada, filtroCiudad, filtroSede]);

  // Abrir la primera sede por defecto si no hay ninguna abierta
  useEffect(() => {
    if (sedesConFunciones.length > 0 && sedesAbiertas.size === 0) {
      setSedesAbiertas(new Set([sedesConFunciones[0].id_sede]));
    }
  }, [sedesConFunciones]);

  // Toggle de un acordeón de sede
  function toggleSede(idSede: number) {
    setSedesAbiertas((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(idSede)) nuevo.delete(idSede);
      else nuevo.add(idSede);
      return nuevo;
    });
  }

  // Expandir o contraer todas las sedes
  function toggleTodasLasSedes() {
    if (sedesAbiertas.size === sedesConFunciones.length) {
      setSedesAbiertas(new Set());
    } else {
      setSedesAbiertas(new Set(sedesConFunciones.map((s) => s.id_sede)));
    }
  }

  // Formatear duración en horas y minutos
  function formatearDuracion(minutos: number) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }

  // Formatear URL de trailer a embed seguro de YouTube
  function formatearUrlEmbed(url?: string | null): string | null {
    if (!url) return null;
    try {
      if (url.includes("watch?v=")) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}?autoplay=0`;
      }
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=0`;
      }
      if (url.includes("/embed/")) {
        const base = url.split("?")[0].split("&")[0];
        return `${base}?autoplay=0`;
      }
      return url;
    } catch {
      return url;
    }
  }

  // Etiqueta del día seleccionado (ej. "Hoy · Mar 13")
  const diaActivo = useMemo(() => {
    return datos?.dias.find((d) => d.fechaIso === fechaSeleccionada);
  }, [datos?.dias, fechaSeleccionada]);

  // Manejar selección de horario de función
  function manejarSeleccionarFuncion(f: FuncionItemDTO) {
    setFuncionSeleccionada(f);

    if (datos?.pelicula) {
      const UUID_A_SLUG: Record<string, string> = {
        "a0000000-0000-0000-0000-000000000001": "endgame-bonus",
        "a0000000-0000-0000-0000-000000000002": "spiderman",
        "a0000000-0000-0000-0000-000000000003": "demonio",
      };
      const slug = UUID_A_SLUG[datos.pelicula.id_pelicula] || datos.pelicula.id_pelicula;

      // Guardar en el objeto global SEL para retrocompatibilidad con las vistas de Asientos y Pago
      SEL.peli = slug;
      SEL.id_funcion = f.id_funcion;
      SEL.id_pelicula = f.id_pelicula;
      SEL.titulo = datos.pelicula.titulo;
      SEL.url_poster = datos.pelicula.url_poster;
      SEL.sede = `s${f.id_sede}`; // "s1", "s2", etc.
      SEL.nombre_sede = f.sede_nombre;
      SEL.id_sede = f.id_sede;
      SEL.id_sala = f.id_sala;
      SEL.sala = f.numero_sala;
      SEL.nombre_sala = f.nombre_sala;
      SEL.fecha = f.fecha;
      SEL.dia_label = diaActivo?.labelCorto || f.fecha;
      SEL.hora = f.hora_inicio;
      SEL.formato = f.formato_completo;
      SEL.idioma_audio = f.idioma_audio;
      SEL.asientos = [];
      SEL.total_asientos = 0;

      // Limpiar selección de asientos previa de otra función y liberar en BD
      try {
        const sid = sessionStorage.getItem("cinenautica_session_id");
        if (sid) {
          AsientoService.liberarTodosLosAsientos(sid).catch(() => {});
        }
        sessionStorage.removeItem("cinenautica_asientos_seleccionados");
        sessionStorage.setItem("cinenautica_seleccion_funcion", JSON.stringify(SEL));
      } catch {}
    }
  }

  // Confirmar y avanzar al paso de selección de asientos
  function continuarAAsientos() {
    if (!funcionSeleccionada) return;
    router.push(`/asientos?funcion=${funcionSeleccionada.id_funcion}`);
  }

  if (cargando) {
    return (
      <div className="w-full bg-dark-900 min-h-screen text-white pt-24 pb-40 px-6 max-w-[1200px] mx-auto animate-pulse">
        <div className="h-[40vh] bg-white/5 rounded-3xl mb-8"></div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-48 h-72 bg-white/10 rounded-2xl flex-shrink-0"></div>
          <div className="flex-1 w-full space-y-4">
            <div className="h-6 w-40 bg-white/10 rounded-full"></div>
            <div className="h-12 w-3/4 bg-white/20 rounded-xl"></div>
            <div className="h-20 w-full bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorCarga || !datos) {
    return (
      <div className="w-full bg-dark-900 min-h-screen text-white pt-32 pb-40 px-6 text-center">
        <i className="fa-solid fa-triangle-exclamation text-brand-yellow text-5xl mb-4"></i>
        <h1 className="text-2xl font-bold mb-2">Película no disponible</h1>
        <p className="text-slate-400 mb-6">{errorCarga || "No se pudo cargar la información."}</p>
        <button
          className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-3 rounded-full font-bold transition-colors"
          onClick={() => router.push("/")}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Volver a la cartelera
        </button>
      </div>
    );
  }

  const { pelicula, dias, ciudades } = datos;
  const embedUrl = formatearUrlEmbed(pelicula.trailer_url);

  return (
    <div className="w-full bg-dark-900 min-h-screen text-white pb-44" id="vista-detalle-pelicula">
      {/* ── Hero Backdrop con Banner ── */}
      <div className="relative w-full h-[45vh] min-h-[380px] md:h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${pelicula.url_banner || pelicula.url_poster}')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-dark-900/40 to-transparent"></div>

      </div>

      {/* ── Contenedor Principal de Información ── */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 -mt-32 md:-mt-44 relative z-20">
        {/* Botón Volver a Cartelera a la altura del póster */}
        <div className="mb-4">
          <button
            className="text-white hover:text-brand-yellow bg-black/60 hover:bg-black/90 px-4 py-2 rounded-full backdrop-blur-md transition-all inline-flex items-center gap-2 border border-white/10 shadow-lg cursor-pointer text-sm font-semibold group"
            onClick={() => router.push("/")}
            aria-label="Volver a la cartelera"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span>Volver a Cartelera</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-52 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <img
              alt={pelicula.titulo}
              className="w-full rounded-2xl shadow-2xl shadow-black/90 border-2 border-white/10 object-cover"
              src={pelicula.url_poster}
            />
          </div>

          {/* Ficha técnica y sinopsis */}
          <div className="flex-grow pt-2">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="bg-brand-blue text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {pelicula.tipo_lanzamiento || "En Cartelera"}
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-md text-xs font-bold text-white">
                {pelicula.clasificacion}
              </span>
              {pelicula.generos.length > 0 && (
                <span className="text-slate-300 font-semibold text-sm">
                  {pelicula.generos.join(" / ")}
                </span>
              )}
              {pelicula.duracion_min > 0 && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-semibold text-sm flex items-center gap-1">
                    <i className="fa-regular fa-clock text-xs text-brand-yellow"></i>
                    {formatearDuracion(pelicula.duracion_min)}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {pelicula.titulo}
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 max-w-3xl drop-shadow">
              {pelicula.sinopsis}
            </p>

            {/* Tráiler Oficial Embebido */}
            {embedUrl && (
              <div className="mt-6 mb-4 max-w-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <i className="fa-brands fa-youtube text-red-500 text-lg"></i>
                  Tráiler Oficial
                </h3>
                <div className="relative w-full pb-[56.25%] bg-black/60 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={embedUrl}
                    title={`Tráiler de ${pelicula.titulo}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sección de Funciones y Horarios ── */}
        <div className="mt-14 pt-8 border-t border-white/10" id="seccion-horarios">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <i className="fa-solid fa-calendar-days text-brand-yellow"></i>
                Funciones disponibles
              </h2>
              <div className="h-1 w-20 bg-brand-blue rounded-full mt-2"></div>
            </div>

            {sedesConFunciones.length > 1 && (
              <button
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
                onClick={toggleTodasLasSedes}
              >
                {sedesAbiertas.size === sedesConFunciones.length
                  ? "Contraer todas las sedes"
                  : "Expandir todas las sedes"}
              </button>
            )}
          </div>

          {/* Barra de Filtros: Ciudad y Sede */}
          <div className="filtro-barra rounded-2xl p-4 md:p-5 mb-6 bg-dark-800/80 border border-white/10 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="filtro-campo">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1 block">
                  Ciudad
                </label>
                <div className="relative">
                  <i className="fa-solid fa-city absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue"></i>
                  <select
                    className="filtro-select w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white font-medium focus:border-brand-blue outline-none transition-colors"
                    value={filtroCiudad}
                    onChange={(e) => manejarCambioCiudad(e.target.value)}
                  >
                    <option value="">Todas las ciudades</option>
                    {ciudades.map((c) => (
                      <option key={c.id_ciudad} value={String(c.id_ciudad)}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filtro-campo">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1 block">
                  Sede
                </label>
                <div className="relative">
                  <i className="fa-solid fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-yellow"></i>
                  <select
                    className="filtro-select w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white font-medium focus:border-brand-blue outline-none transition-colors"
                    value={filtroSede}
                    onChange={(e) => setFiltroSede(e.target.value)}
                  >
                    <option value="">Todas las sedes</option>
                    {sedesDisponibles.map((s) => (
                      <option key={s.id_sede} value={String(s.id_sede)}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Fechas (7 días de la semana) */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <i className="fa-regular fa-calendar text-brand-yellow"></i>
              Selecciona una fecha
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {dias.map((d) => {
                const activo = d.fechaIso === fechaSeleccionada;
                return (
                  <button
                    key={d.codigo}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all duration-200 border flex flex-col items-center gap-0.5 min-w-[100px] ${
                      activo
                        ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-blue-500/30 scale-105"
                        : "bg-dark-800 text-slate-400 border-white/10 hover:border-white/25 hover:text-white"
                    }`}
                    onClick={() => {
                      setFechaSeleccionada(d.fechaIso);
                      setFuncionSeleccionada(null); // Resetear función si cambia fecha
                    }}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                      {d.esHoy ? "Hoy" : d.diaSemanaCorto}
                    </span>
                    <span className="text-sm font-bold text-white">{d.diaMes}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acordeón de Sedes y Horarios */}
          <div className="space-y-4">
            {sedesConFunciones.length === 0 ? (
              <div className="bg-dark-800/60 border border-white/5 rounded-2xl p-8 text-center text-slate-400">
                <i className="fa-solid fa-film text-3xl text-slate-600 mb-3 block"></i>
                <p className="font-semibold text-base text-slate-300">
                  No hay funciones programadas para esta fecha
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Intenta seleccionando otro día o cambiando los filtros de ciudad y sede.
                </p>
              </div>
            ) : (
              sedesConFunciones.map((sede) => {
                const abierta = sedesAbiertas.has(sede.id_sede);
                return (
                  <div
                    key={sede.id_sede}
                    className="border border-white/10 rounded-2xl overflow-hidden bg-dark-800/80 backdrop-blur-sm transition-all"
                  >
                    {/* Header del acordeón */}
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      onClick={() => toggleSede(sede.id_sede)}
                      aria-expanded={abierta}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base md:text-lg">
                            {sede.nombre_sede}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {sede.nombre_ciudad}
                            {sede.direccion && ` • ${sede.direccion}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          {sede.formatos.reduce((acc, f) => acc + f.horarios.length, 0)} funciones
                        </span>
                        <i
                          className={`fa-solid fa-chevron-down text-slate-400 transition-transform duration-300 ${
                            abierta ? "rotate-180 text-brand-yellow" : ""
                          }`}
                        ></i>
                      </div>
                    </button>

                    {/* Contenido expandible del acordeón */}
                    {abierta && (
                      <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-6">
                        {sede.formatos.map((fmt) => (
                          <div key={fmt.formato_completo} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-bold px-2.5 py-0.5 rounded">
                                {fmt.nombre_formato}
                              </span>
                              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                                {fmt.idioma_audio}
                              </span>
                            </div>

                            {/* Chips de Horarios */}
                            <div className="flex flex-wrap gap-2.5">
                              {fmt.horarios.map((fn) => {
                                const seleccionada =
                                  funcionSeleccionada?.id_funcion === fn.id_funcion;
                                return (
                                  <button
                                    key={fn.id_funcion}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 border flex flex-col items-center min-w-[76px] ${
                                      seleccionada
                                        ? "bg-brand-blue border-brand-blue text-white shadow-lg shadow-blue-500/50 scale-105"
                                        : "bg-dark-900 border-white/10 text-slate-200 hover:border-brand-blue/50 hover:bg-dark-700 hover:text-white"
                                    }`}
                                    onClick={() => manejarSeleccionarFuncion(fn)}
                                  >
                                    <span>{fn.hora_inicio}</span>
                                    <span className="text-[10px] font-normal opacity-70">
                                      {fn.nombre_sala}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Barra Flotante de Confirmación de Horario ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-xl border-t border-white/15 p-4 md:p-5 z-50 transition-transform duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] ${
          funcionSeleccionada ? "translate-y-0" : "translate-y-full"
        }`}
        id="barra-confirmacion-horario"
      >
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-bold flex items-center justify-center sm:justify-start gap-1">
              <i className="fa-solid fa-location-dot text-brand-yellow"></i>
              <span id="fh-sede">{funcionSeleccionada?.sede_nombre}</span>
              <span>—</span>
              <span>{funcionSeleccionada?.nombre_sala}</span>
            </span>
            <div className="font-semibold text-base md:text-lg mt-0.5">
              <span className="text-brand-yellow" id="fh-fecha">
                {diaActivo?.labelCorto || funcionSeleccionada?.fecha}
              </span>
              <span className="mx-2 opacity-50">•</span>
              <span id="fh-formato">{funcionSeleccionada?.formato_completo}</span>
              <span className="mx-2 opacity-50">•</span>
              <span className="font-bold text-white text-xl" id="fh-hora">
                {funcionSeleccionada?.hora_inicio}
              </span>
            </div>
          </div>

          <button
            className="w-full sm:w-auto bg-brand-blue hover:bg-brand-dark-blue text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/40 transition-all flex items-center justify-center gap-2 text-base md:text-lg transform hover:scale-105 active:scale-95 cursor-pointer"
            onClick={continuarAAsientos}
          >
            <span>Elegir Asientos</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
