"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type {
  PeliculaGlobalDTO,
  CrearPeliculaPayload,
  EditarPeliculaPayload,
  FormatoProyeccionGlobalDTO,
} from "@/src/dtos/adminGeneral";
import ModalConfirmacion from "@/src/components/admin_sede/comun/ModalConfirmacion";

interface PeliculasGlobalTabProps {
  recargarTrigger: number;
  onRecargar: () => void;
}

const CLASIFICACIONES = ["APT", "+14", "+18"];
const TIPOS_LANZAMIENTO = ["Cartelera", "Estreno", "Preventa", "Pronto"];
const GENEROS_DISPONIBLES = [
  "Acción",
  "Aventura",
  "Animación",
  "Comedia",
  "Drama",
  "Terror",
  "Ciencia Ficción",
  "Romance",
  "Suspenso",
  "Documental",
  "Fantasía",
  "Musical",
];

const FORM_VACIO: CrearPeliculaPayload = {
  titulo: "",
  sinopsis: "",
  duracion_min: 120,
  clasificacion: "APT",
  url_poster: "",
  url_banner: "",
  trailer_url: "",
  tipo_lanzamiento: "Cartelera",
  generos: ["Acción"],
  formatos: [],
  destacada_banner: false,
  fecha_estreno: "",
};

export default function PeliculasGlobalTab({ recargarTrigger, onRecargar }: PeliculasGlobalTabProps) {
  const [peliculas, setPeliculas] = useState<PeliculaGlobalDTO[]>([]);
  const [formatosDisponibles, setFormatosDisponibles] = useState<FormatoProyeccionGlobalDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("all");

  // Modal Principal de Creación/Edición
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [peliculaEditar, setPeliculaEditar] = useState<PeliculaGlobalDTO | null>(null);
  const [form, setForm] = useState<CrearPeliculaPayload>(FORM_VACIO);
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<boolean>(false);

  // Modos de entrada de imágenes (url vs file)
  const [modoPoster, setModoPoster] = useState<"url" | "archivo">("url");
  const [modoBanner, setModoBanner] = useState<"url" | "archivo">("url");

  // Modales de confirmación individuales
  const [peliculaEliminar, setPeliculaEliminar] = useState<PeliculaGlobalDTO | null>(null);
  const [confirmarGuardarPendiente, setConfirmarGuardarPendiente] = useState<boolean>(false);
  const [confirmarDescartePendiente, setConfirmarDescartePendiente] = useState<boolean>(false);

  const [toast, setToast] = useState<{ mensaje: string; tipo: "ok" | "error" } | null>(null);

  const fileInputPosterRef = useRef<HTMLInputElement>(null);
  const fileInputBannerRef = useRef<HTMLInputElement>(null);

  const hoyStr = new Date().toISOString().split("T")[0];

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    const [pelis, formatos] = await Promise.all([
      AdminGeneralDao.obtenerPeliculasCatalogo(),
      AdminGeneralDao.obtenerFormatosProyeccion(),
    ]);
    setPeliculas(pelis);
    setFormatosDisponibles(formatos);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos, recargarTrigger]);

  const mostrarToast = (mensaje: string, tipo: "ok" | "error" = "ok") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const abrirCrear = () => {
    // Por defecto marcamos 2D si existe
    const id2d = formatosDisponibles.find((f) => f.codigo === "2D")?.id_formato;
    setForm({
      ...FORM_VACIO,
      formatos: id2d ? [id2d] : [],
    });
    setPeliculaEditar(null);
    setErroresValidacion({});
    setModoPoster("url");
    setModoBanner("url");
    setModalAbierto(true);
  };

  const abrirEditar = (p: PeliculaGlobalDTO) => {
    setForm({
      titulo: p.titulo,
      sinopsis: p.sinopsis,
      duracion_min: p.duracion_min,
      clasificacion: p.clasificacion,
      url_poster: p.url_poster,
      url_banner: p.url_banner,
      trailer_url: p.trailer_url || "",
      tipo_lanzamiento: p.tipo_lanzamiento,
      generos: p.generos,
      formatos: p.formatos || [],
      destacada_banner: p.destacada_banner,
      orden_banner: p.orden_banner ?? undefined,
      fecha_estreno: p.fecha_estreno ? p.fecha_estreno.split("T")[0] : "",
    });
    setPeliculaEditar(p);
    setErroresValidacion({});
    setModoPoster(p.url_poster.startsWith("data:") ? "archivo" : "url");
    setModoBanner(p.url_banner.startsWith("data:") ? "archivo" : "url");
    setModalAbierto(true);
  };

  // Validaciones exhaustivas de formulario
  const validarFormulario = (): boolean => {
    const errores: Record<string, string> = {};

    if (!form.titulo.trim()) {
      errores.titulo = "El título es obligatorio.";
    } else if (form.titulo.trim().length < 2) {
      errores.titulo = "El título debe tener al menos 2 caracteres.";
    }

    if (!form.sinopsis.trim()) {
      errores.sinopsis = "La sinopsis es obligatoria.";
    } else if (form.sinopsis.trim().length < 10) {
      errores.sinopsis = "La sinopsis debe ser más descriptiva (mínimo 10 caracteres).";
    }

    if (!form.duracion_min || form.duracion_min < 1 || form.duracion_min > 600) {
      errores.duracion_min = "La duración debe estar entre 1 y 600 minutos.";
    }

    if (!form.url_poster.trim()) {
      errores.url_poster = "Debes ingresar una URL de póster o cargar un archivo de imagen.";
    }

    if (!form.url_banner.trim()) {
      errores.url_banner = "Debes ingresar una URL de banner o cargar un archivo de imagen.";
    }

    if (!form.formatos || form.formatos.length === 0) {
      errores.formatos = "Selecciona al menos un formato de proyección (ej. 2D).";
    }

    if (form.fecha_estreno) {
      if (form.fecha_estreno < hoyStr) {
        errores.fecha_estreno = "La fecha de estreno no puede ser en el pasado.";
      }
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  // Solicitar confirmación antes de guardar
  const solicitarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setConfirmarGuardarPendiente(true);
  };

  // Ejecutar Guardar tras confirmar
  const ejecutarGuardar = async () => {
    setGuardando(true);
    setConfirmarGuardarPendiente(false);

    let resultado;
    if (peliculaEditar) {
      resultado = await AdminGeneralDao.editarPelicula({
        ...form,
        id_pelicula: peliculaEditar.id_pelicula,
      } as EditarPeliculaPayload);
    } else {
      resultado = await AdminGeneralDao.crearPelicula(form);
    }

    setGuardando(false);
    if (resultado.ok) {
      setModalAbierto(false);
      mostrarToast(
        peliculaEditar
          ? `Película "${form.titulo}" actualizada exitosamente.`
          : `Película "${form.titulo}" registrada en el catálogo corporativo.`
      );
      onRecargar();
    } else {
      mostrarToast(resultado.error || "Ocurrió un error al guardar la película.", "error");
    }
  };

  // Cancelar / Descartar
  const solicitarCancelar = () => {
    // Si ha escrito algo, pedimos confirmación
    if (form.titulo.trim() || form.sinopsis.trim()) {
      setConfirmarDescartePendiente(true);
    } else {
      setModalAbierto(false);
    }
  };

  const confirmarDescarte = () => {
    setConfirmarDescartePendiente(false);
    setModalAbierto(false);
  };

  // Confirmar eliminación
  const ejecutarEliminar = async () => {
    if (!peliculaEliminar) return;
    setGuardando(true);
    const resultado = await AdminGeneralDao.eliminarPelicula(peliculaEliminar.id_pelicula);
    setGuardando(false);
    const titulo = peliculaEliminar.titulo;
    setPeliculaEliminar(null);

    if (resultado.ok) {
      mostrarToast(`Película "${titulo}" eliminada del catálogo.`);
      onRecargar();
    } else {
      mostrarToast(resultado.error || "No se pudo eliminar la película.", "error");
    }
  };

  // Manejador de subida de archivos locales a Data URL
  const procesarArchivoImagen = (
    e: React.ChangeEvent<HTMLInputElement>,
    campo: "url_poster" | "url_banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      mostrarToast("Por favor selecciona un archivo de imagen válido.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setForm((prev) => ({ ...prev, [campo]: dataUrl }));
      setErroresValidacion((prev) => {
        const c = { ...prev };
        delete c[campo];
        return c;
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleFormato = (idFormato: string) => {
    setForm((prev) => {
      const actuales = prev.formatos || [];
      const nuevo = actuales.includes(idFormato)
        ? actuales.filter((f) => f !== idFormato)
        : [...actuales, idFormato];
      return { ...prev, formatos: nuevo };
    });
    setErroresValidacion((prev) => {
      const c = { ...prev };
      delete c.formatos;
      return c;
    });
  };

  const toggleGenero = (g: string) => {
    setForm((prev) => ({
      ...prev,
      generos: prev.generos.includes(g)
        ? prev.generos.filter((x) => x !== g)
        : [...prev.generos, g],
    }));
  };

  const peliculasFiltradas = peliculas.filter((p) => {
    const matchBusqueda =
      !busqueda ||
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sinopsis.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo === "all" || p.tipo_lanzamiento === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[99999] px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-fadeIn ${
            toast.tipo === "ok"
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-rose-600 text-white shadow-rose-500/20"
          }`}
        >
          <i className={`fa-solid ${toast.tipo === "ok" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
          <span>{toast.mensaje}</span>
        </div>
      )}

      {/* Barra de Controles y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Catálogo de Películas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro global de títulos, formatos y configuración para las sedes de Cine Náutica
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Nueva Película</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-[#0B1528] border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="relative flex-1 min-w-[220px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            placeholder="Buscar película por título o sinopsis..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#070e1b] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-[#070e1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            {TIPOS_LANZAMIENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono ml-auto">
          {peliculasFiltradas.length} películas
        </span>
      </div>

      {/* Grilla de Películas */}
      {cargando ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-80 bg-[#0B1528] border border-white/5 rounded-2xl"></div>
          ))}
        </div>
      ) : peliculasFiltradas.length === 0 ? (
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-12 text-center">
          <i className="fa-solid fa-film text-4xl text-slate-600 mb-3 block"></i>
          <h3 className="text-base font-bold text-white mb-1">No se encontraron películas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Ajusta los términos de búsqueda o registra un nuevo título para el catálogo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {peliculasFiltradas.map((p) => (
            <div
              key={p.id_pelicula}
              className="bg-[#0B1528] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="relative aspect-[2/3] overflow-hidden bg-black/40">
                  <img
                    src={p.url_poster || "/img/poster-placeholder.jpg"}
                    alt={p.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/poster-placeholder.jpg";
                    }}
                  />

                  {/* Overlay hover con acciones */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                    <button
                      type="button"
                      onClick={() => abrirEditar(p)}
                      className="flex-1 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
                    >
                      <i className="fa-solid fa-pen text-[10px]"></i>
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeliculaEliminar(p)}
                      className="flex-1 bg-[#DC2026] hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
                    >
                      <i className="fa-solid fa-trash text-[10px]"></i>
                      <span>Eliminar</span>
                    </button>
                  </div>

                  {/* Badges superiores */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-[#070e1b]/90 backdrop-blur-sm text-cyan-400 font-black text-[10px] px-2 py-0.5 rounded-md border border-cyan-500/30">
                      {p.clasificacion}
                    </span>
                  </div>

                  <span className="absolute top-2 right-2 bg-dark-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                    {p.tipo_lanzamiento}
                  </span>
                </div>

                <div className="p-3.5">
                  <h3 className="font-bold text-white text-sm truncate leading-snug" title={p.titulo}>
                    {p.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.duracion_min} min · {p.sedes_activas} sedes
                  </p>

                  {/* Formatos badges */}
                  {p.formatos && p.formatos.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.formatos.slice(0, 3).map((fId) => {
                        const fmt = formatosDisponibles.find((x) => x.id_formato === fId);
                        return (
                          <span
                            key={fId}
                            className="text-[9px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded"
                          >
                            {fmt?.codigo || fId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-3.5 pb-3">
                <div className="flex flex-wrap gap-1">
                  {p.generos.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="text-[9px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                  {p.generos.length > 2 && (
                    <span className="text-[9px] text-slate-500 self-center">+{p.generos.length - 2}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal de Creación / Edición Completa ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0B1528] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#070e1b]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <i className={`fa-solid ${peliculaEditar ? "fa-pen-to-square" : "fa-film"}`}></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {peliculaEditar ? "Editar Película" : "Registrar Nueva Película"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configuración corporativa para exhibición y venta
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={solicitarCancelar}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={solicitarGuardar} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Alerta de errores generales */}
              {Object.keys(erroresValidacion).length > 0 && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                  <div>
                    <span className="font-bold">Por favor corrige los siguientes campos:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-200">
                      {Object.values(erroresValidacion).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Título de la Película <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Ej. Spider-Man: Un Nuevo Día"
                    className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                      erroresValidacion.titulo ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                  {erroresValidacion.titulo && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{erroresValidacion.titulo}</span>
                  )}
                </div>

                {/* Clasificación (APT, +14, +18) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Clasificación <span className="text-brand-yellow">*</span>
                  </label>
                  <select
                    value={form.clasificacion}
                    onChange={(e) => setForm({ ...form, clasificacion: e.target.value })}
                    className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    {CLASIFICACIONES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Lanzamiento */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Estado en Cartelera
                  </label>
                  <select
                    value={form.tipo_lanzamiento}
                    onChange={(e) => setForm({ ...form, tipo_lanzamiento: e.target.value })}
                    className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    {TIPOS_LANZAMIENTO.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Duración (minutos) <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={form.duracion_min}
                    onChange={(e) => setForm({ ...form, duracion_min: Number(e.target.value) })}
                    className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                      erroresValidacion.duracion_min ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                </div>

                {/* Fecha de Estreno (validación actual o futura) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Fecha de Estreno (Actual o Futura)
                  </label>
                  <input
                    type="date"
                    min={hoyStr}
                    value={form.fecha_estreno || ""}
                    onChange={(e) => setForm({ ...form, fecha_estreno: e.target.value || undefined })}
                    className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer ${
                      erroresValidacion.fecha_estreno ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                  {erroresValidacion.fecha_estreno && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{erroresValidacion.fecha_estreno}</span>
                  )}
                </div>

                {/* URL del Trailer */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    URL del Tráiler (YouTube o MP4)
                  </label>
                  <div className="relative">
                    <i className="fa-brands fa-youtube absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400 text-xs"></i>
                    <input
                      type="url"
                      value={form.trailer_url || ""}
                      onChange={(e) => setForm({ ...form, trailer_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#0B1528] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>
                </div>

                {/* Formatos de Proyección (Checkboxes) */}
                <div className="md:col-span-2 bg-[#0B1528] border border-white/10 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Formatos de Proyección Soportados <span className="text-brand-yellow">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Selecciona al menos uno</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formatosDisponibles.map((f) => {
                      const seleccionado = (form.formatos || []).includes(f.id_formato);
                      return (
                        <button
                          key={f.id_formato}
                          type="button"
                          onClick={() => toggleFormato(f.id_formato)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            seleccionado
                              ? "bg-brand-blue border-brand-blue text-white shadow-sm shadow-sky-500/20"
                              : "bg-[#070e1b] border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <i className={`fa-solid ${seleccionado ? "fa-circle-check" : "fa-circle"} text-[10px]`}></i>
                          <span>{f.nombre} ({f.codigo})</span>
                        </button>
                      );
                    })}
                  </div>
                  {erroresValidacion.formatos && (
                    <span className="text-[11px] text-rose-400 mt-2 block">{erroresValidacion.formatos}</span>
                  )}
                </div>

                {/* Sinopsis */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Sinopsis Oficial <span className="text-brand-yellow">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.sinopsis}
                    onChange={(e) => setForm({ ...form, sinopsis: e.target.value })}
                    placeholder="Descripción y argumento de la película..."
                    className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors resize-none ${
                      erroresValidacion.sinopsis ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  ></textarea>
                </div>

                {/* Póster con Toggle URL vs Archivo */}
                <div className="md:col-span-2 bg-[#0B1528] border border-white/10 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Póster Oficial (Vertical) <span className="text-brand-yellow">*</span>
                    </label>
                    <div className="flex bg-[#070e1b] p-0.5 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={() => setModoPoster("url")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          modoPoster === "url" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Poner URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoPoster("archivo")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          modoPoster === "archivo" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Cargar Archivo
                      </button>
                    </div>
                  </div>

                  {modoPoster === "url" ? (
                    <input
                      type="url"
                      value={form.url_poster}
                      onChange={(e) => setForm({ ...form, url_poster: e.target.value })}
                      placeholder="https://ejemplo.com/poster.jpg"
                      className="w-full bg-[#070e1b] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={fileInputPosterRef}
                        accept="image/*"
                        onChange={(e) => procesarArchivoImagen(e, "url_poster")}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputPosterRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/20 hover:border-brand-blue rounded-xl p-3 text-center cursor-pointer transition-colors text-xs text-slate-300 flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up text-brand-blue"></i>
                        <span>Seleccionar archivo de póster desde tu equipo</span>
                      </button>
                    </div>
                  )}

                  {/* Previsualización del póster */}
                  {form.url_poster && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={form.url_poster}
                        alt="Preview Póster"
                        className="w-12 h-16 rounded-lg object-cover shadow border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/poster-placeholder.jpg";
                        }}
                      />
                      <span className="text-[11px] text-emerald-400 font-medium">
                        <i className="fa-solid fa-check mr-1"></i> Previsualización cargada
                      </span>
                    </div>
                  )}
                  {erroresValidacion.url_poster && (
                    <span className="text-[11px] text-rose-400 block">{erroresValidacion.url_poster}</span>
                  )}
                </div>

                {/* Banner con Toggle URL vs Archivo */}
                <div className="md:col-span-2 bg-[#0B1528] border border-white/10 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Banner Promocional (Horizontal) <span className="text-brand-yellow">*</span>
                    </label>
                    <div className="flex bg-[#070e1b] p-0.5 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={() => setModoBanner("url")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          modoBanner === "url" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Poner URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoBanner("archivo")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          modoBanner === "archivo" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Cargar Archivo
                      </button>
                    </div>
                  </div>

                  {modoBanner === "url" ? (
                    <input
                      type="url"
                      value={form.url_banner}
                      onChange={(e) => setForm({ ...form, url_banner: e.target.value })}
                      placeholder="https://ejemplo.com/banner.jpg"
                      className="w-full bg-[#070e1b] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={fileInputBannerRef}
                        accept="image/*"
                        onChange={(e) => procesarArchivoImagen(e, "url_banner")}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputBannerRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/20 hover:border-brand-blue rounded-xl p-3 text-center cursor-pointer transition-colors text-xs text-slate-300 flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up text-brand-blue"></i>
                        <span>Seleccionar archivo de banner desde tu equipo</span>
                      </button>
                    </div>
                  )}

                  {/* Previsualización del banner */}
                  {form.url_banner && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={form.url_banner}
                        alt="Preview Banner"
                        className="w-24 h-12 rounded-lg object-cover shadow border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/poster-placeholder.jpg";
                        }}
                      />
                      <span className="text-[11px] text-emerald-400 font-medium">
                        <i className="fa-solid fa-check mr-1"></i> Banner cargado
                      </span>
                    </div>
                  )}
                  {erroresValidacion.url_banner && (
                    <span className="text-[11px] text-rose-400 block">{erroresValidacion.url_banner}</span>
                  )}
                </div>

                {/* Géneros */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Géneros Cinematográficos
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {GENEROS_DISPONIBLES.map((g) => {
                      const sel = form.generos.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenero(g)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            sel
                              ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                              : "bg-[#0B1528] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botones del Formulario */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={solicitarCancelar}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>{peliculaEditar ? "Guardar Cambios" : "Registrar Película"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modales de Confirmación Centrales con Backdrop Oscuro Bloqueante ── */}

      {/* Confirmar Eliminación */}
      <ModalConfirmacion
        abierto={!!peliculaEliminar}
        titulo="¿Eliminar Película?"
        mensaje={`¿Estás seguro de que deseas eliminar permanentemente "${peliculaEliminar?.titulo}" del catálogo corporativo? Esta acción removerá su disponibilidad en todas las sedes.`}
        tipo="peligro"
        textoConfirmar="Eliminar Película"
        textoCancelar="Volver"
        cargando={guardando}
        onConfirmar={ejecutarEliminar}
        onCancelar={() => setPeliculaEliminar(null)}
      />

      {/* Confirmar Guardar (Creación o Edición) */}
      <ModalConfirmacion
        abierto={confirmarGuardarPendiente}
        titulo={peliculaEditar ? "¿Guardar Cambios en Película?" : "¿Registrar Nueva Película?"}
        mensaje={
          peliculaEditar
            ? `Se actualizará la información de "${form.titulo}" en el catálogo global de Cine Náutica.`
            : `Se registrará "${form.titulo}" con ${form.formatos?.length || 0} formatos de proyección asociados.`
        }
        tipo={peliculaEditar ? "advertencia" : "exito"}
        textoConfirmar={peliculaEditar ? "Confirmar Cambios" : "Registrar Ahora"}
        textoCancelar="Revisar Datos"
        cargando={guardando}
        onConfirmar={ejecutarGuardar}
        onCancelar={() => setConfirmarGuardarPendiente(false)}
      />

      {/* Confirmar Descarte de Cambios al Cancelar */}
      <ModalConfirmacion
        abierto={confirmarDescartePendiente}
        titulo="¿Descartar Cambios?"
        mensaje="Tienes modificaciones sin guardar en el formulario. Si sales ahora, los cambios no se aplicarán."
        tipo="advertencia"
        textoConfirmar="Descartar y Salir"
        textoCancelar="Continuar Editando"
        onConfirmar={confirmarDescarte}
        onCancelar={() => setConfirmarDescartePendiente(false)}
      />
    </div>
  );
}
