"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useSesion } from "@/src/context/SesionContext";
import { SocioService } from "@/src/services/socioService";
import { HistorialService } from "@/src/services/historialService";
import type { PerfilSocioCompletoDTO } from "@/src/dtos/socio";
import type { OrdenCompletaDTO } from "@/src/dtos/orden";
import { abrirModalLogin, abrirModalRegistro, mostrarToast } from "@/src/lib/ui/common";

export default function Socio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { usuario, esSocio, cargando: cargandoSesion, actualizarPerfilLocal } = useSesion();

  const [perfil, setPerfil] = useState<PerfilSocioCompletoDTO | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState<boolean>(false);
  const [mostrarModalCarnet, setMostrarModalCarnet] = useState<boolean>(false);

  // Subtabs horizontales
  const [subtabActivo, setSubtabActivo] = useState<"compras" | "proximamente" | "datos">("compras");
  const [ordenes, setOrdenes] = useState<OrdenCompletaDTO[]>([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState<boolean>(false);

  // Formulario Mis Datos
  const [formNombre, setFormNombre] = useState<string>("");
  const [formApellido, setFormApellido] = useState<string>("");
  const [formCorreo, setFormCorreo] = useState<string>("");
  const [formTelefono, setFormTelefono] = useState<string>("");
  const [formContrasena, setFormContrasena] = useState<string>("");
  const [mostrarPass, setMostrarPass] = useState<boolean>(false);

  // Modal confirmación y guardado
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState<boolean>(false);
  const [guardandoDatos, setGuardandoDatos] = useState<boolean>(false);

  // Cargar perfil del socio
  useEffect(() => {
    if (usuario && esSocio) {
      setCargandoPerfil(true);
      SocioService.obtenerPerfilCompleto(usuario.id_usuario)
        .then((data) => {
          if (data) setPerfil(data);
        })
        .catch((err) => {
          console.error("Error al cargar perfil de socio:", err);
        })
        .finally(() => {
          setCargandoPerfil(false);
        });

      // Cargar historial de compras del socio
      setCargandoOrdenes(true);
      HistorialService.obtenerHistorial(usuario.id_usuario, usuario.correo)
        .then((res) => {
          setOrdenes(res);
        })
        .catch((err) => {
          console.error("Error al cargar compras del socio:", err);
        })
        .finally(() => {
          setCargandoOrdenes(false);
        });
    } else {
      setPerfil(null);
      setOrdenes([]);
    }
  }, [usuario, esSocio]);

  // Sincronizar campos de edición de datos con el usuario actual
  useEffect(() => {
    if (usuario) {
      setFormNombre(usuario.nombre || "");
      setFormApellido(usuario.apellido || "");
      setFormCorreo(usuario.correo || "");
      setFormTelefono(usuario.telefono || perfil?.telefono || "");
    }
  }, [usuario, perfil]);

  // Si viene con parámetro ?tab=compras o ?tab=datos, activar y bajar al subtab
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "compras" || tab === "datos" || tab === "proximamente") {
      setSubtabActivo(tab as any);
      setTimeout(() => {
        const el = document.getElementById("seccion-subtabs");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [searchParams]);

  const manejarCambioNombre = (val: string) => {
    const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    if (val !== soloLetras) {
      mostrarToast("El nombre solo debe contener letras.", "error");
    }
    setFormNombre(soloLetras);
  };

  const manejarCambioApellido = (val: string) => {
    const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    if (val !== soloLetras) {
      mostrarToast("El apellido solo debe contener letras.", "error");
    }
    setFormApellido(soloLetras);
  };

  const manejarCambioTelefono = (val: string) => {
    const soloNum = val.replace(/\D/g, "").slice(0, 9);
    if (val.replace(/\D/g, "") !== val) {
      mostrarToast("El teléfono solo debe contener números.", "error");
    }
    setFormTelefono(soloNum);
  };

  const restablecerFormulario = () => {
    if (usuario) {
      setFormNombre(usuario.nombre || "");
      setFormApellido(usuario.apellido || "");
      setFormCorreo(usuario.correo || "");
      setFormTelefono(usuario.telefono || perfil?.telefono || "");
      setFormContrasena("");
      mostrarToast("Formulario restablecido a los valores actuales.", "info");
    }
  };

  const solicitarConfirmacionGuardado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    if (!formNombre.trim()) {
      mostrarToast("Por favor, ingresa tus nombres.", "error");
      return;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(formNombre)) {
      mostrarToast("El nombre solo debe contener letras.", "error");
      return;
    }

    if (!formApellido.trim()) {
      mostrarToast("Por favor, ingresa tus apellidos.", "error");
      return;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(formApellido)) {
      mostrarToast("El apellido solo debe contener letras.", "error");
      return;
    }

    if (!formCorreo.trim()) {
      mostrarToast("Por favor, ingresa tu correo electrónico.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formCorreo.trim())) {
      mostrarToast("Por favor, ingresa un correo electrónico válido.", "error");
      return;
    }

    if (formTelefono.trim() && formTelefono.trim().length !== 9) {
      mostrarToast("El teléfono debe contener exactamente 9 dígitos.", "error");
      return;
    }

    if (formContrasena && formContrasena.length < 6) {
      mostrarToast("La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    // Comprobar si hubo cambios reales
    const cambioNombre = formNombre.trim() !== (usuario.nombre || "").trim();
    const cambioApellido = formApellido.trim() !== (usuario.apellido || "").trim();
    const cambioCorreo = formCorreo.trim().toLowerCase() !== (usuario.correo || "").trim().toLowerCase();
    const cambioTelefono = formTelefono.trim() !== (usuario.telefono || perfil?.telefono || "").trim();
    const cambioContrasena = Boolean(formContrasena);

    if (!cambioNombre && !cambioApellido && !cambioCorreo && !cambioTelefono && !cambioContrasena) {
      mostrarToast("No has realizado ninguna modificación en tus datos.", "info");
      return;
    }

    setMostrarModalConfirmacion(true);
  };

  const confirmarYGuardarDatos = async () => {
    if (!usuario) return;

    setGuardandoDatos(true);
    try {
      // Simular un tiempo breve de espera para feedback visual y seguridad de concurrencia
      await new Promise((resolve) => setTimeout(resolve, 600));

      const res = await SocioService.actualizarDatosSocio(usuario.id_usuario, {
        nombre: formNombre.trim(),
        apellido: formApellido.trim(),
        correo: formCorreo.trim().toLowerCase(),
        telefono: formTelefono.trim() || undefined,
        contrasena: formContrasena.trim() || undefined,
      });

      if (!res.ok) {
        throw new Error(res.error || "No se pudo actualizar los datos.");
      }

      // Sincronizar contexto global y estado de la vista
      actualizarPerfilLocal({
        nombre: formNombre.trim(),
        apellido: formApellido.trim(),
        correo: formCorreo.trim().toLowerCase(),
        telefono: formTelefono.trim() || null,
      });

      setPerfil((prev) =>
        prev
          ? {
              ...prev,
              nombre: formNombre.trim(),
              apellido: formApellido.trim(),
              correo: formCorreo.trim().toLowerCase(),
              telefono: formTelefono.trim() || null,
            }
          : null
      );

      setFormContrasena("");
      setMostrarModalConfirmacion(false);
      mostrarToast("¡Tus datos se actualizaron correctamente!", "exito");
    } catch (err: any) {
      console.error("Error al actualizar datos:", err);
      mostrarToast(err.message || "Error al actualizar tus datos.", "error");
    } finally {
      setGuardandoDatos(false);
    }
  };

  const copiarCodigo = () => {
    if (!perfil?.codigo_socio) return;
    navigator.clipboard.writeText(perfil.codigo_socio);
    mostrarToast("¡Código de socio copiado al portapapeles!", "exito");
  };

  return (
    <div className="w-full bg-dark-900 min-h-screen pb-32 pt-24 text-white" id="vista-beneficios">
      
      {/* ── HERO BANNER ── */}
      <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-gradient-to-b from-brand-dark-blue/40 via-dark-900 to-dark-900">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')",
          }}
        ></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-brand-yellow text-black text-xs font-black rounded-full uppercase tracking-wider inline-block mb-4 shadow-lg shadow-yellow-500/20">
            Programa de Lealtad
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Socio <span className="text-brand-blue">Náutica</span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl font-light">
            Vive el cine como nunca antes. Acumula puntos en cada función y dulcería para disfrutar de beneficios exclusivos.
          </p>
        </div>
      </section>

      {/* ── PANEL DE SOCIO (USUARIO LOGUEADO) ── */}
      {usuario && esSocio && (
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-8 relative z-20 mb-12">
          {cargandoPerfil ? (
            <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
              <i className="fa-solid fa-circle-notch fa-spin text-brand-yellow text-3xl mb-3"></i>
              <p className="text-slate-400 text-sm">Cargando datos de tu membresía...</p>
            </div>
          ) : perfil ? (
            <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Columna Izquierda: Nivel y Puntos */}
              <div className="md:col-span-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                <span
                  className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-md"
                  style={{
                    background: `${perfil.nivel.color_hex}22`,
                    color: perfil.nivel.color_hex,
                    border: `1px solid ${perfil.nivel.color_hex}66`,
                  }}
                >
                  Nivel {perfil.nivel.nombre}
                </span>

                <p className="text-5xl md:text-6xl font-black text-white tracking-tight">
                  {perfil.puntos}
                </p>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mt-1">
                  Puntos Disponibles
                </p>

                {/* Código de Socio */}
                <div className="mt-4 flex items-center gap-2 bg-dark-900/80 px-3.5 py-1.5 rounded-xl border border-white/5">
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {perfil.codigo_socio}
                  </span>
                  <button
                    className="text-slate-500 hover:text-brand-yellow transition-colors cursor-pointer p-1"
                    title="Copiar código de socio"
                    type="button"
                    onClick={copiarCodigo}
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                </div>

                {/* Botón Abrir Carnet */}
                <button
                  className="mt-5 w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 px-5 rounded-xl font-black text-xs md:text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                  onClick={() => setMostrarModalCarnet(true)}
                >
                  <i className="fa-solid fa-id-card text-base"></i>
                  Mostrar mi Carnet Digital
                </button>
              </div>

              {/* Columna Derecha: Progresión y Beneficios Activos */}
              <div className="md:col-span-2 flex flex-col justify-center gap-6">
                {/* Barra de Progreso hacia el siguiente nivel */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-2 font-semibold">
                    <span>Nivel {perfil.progreso.nivel_actual}</span>
                    <span className="text-brand-yellow">
                      {perfil.progreso.siguiente_nivel
                        ? `${perfil.progreso.puntos_faltantes} pts para ${perfil.progreso.siguiente_nivel}`
                        : "¡Has alcanzado el nivel máximo! 🏆"}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-brand-yellow to-yellow-300 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${perfil.progreso.porcentaje_progreso}%` }}
                    ></div>
                  </div>
                </div>

                {/* Badges de Beneficios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs md:text-sm">
                  {/* Beneficio Cumpleaños */}
                  <div
                    className={`rounded-xl p-3.5 flex items-center gap-3 border ${
                      perfil.estado_cumpleanos.disponible
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                        : "bg-dark-900 border-white/5 text-slate-300"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400 text-lg">
                      <i className="fa-solid fa-cake-candles"></i>
                    </div>
                    <div>
                      <p className="font-bold leading-tight">Beneficio Cumpleaños</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {perfil.estado_cumpleanos.mensaje}
                      </p>
                    </div>
                  </div>

                  {/* Fila Preferencial */}
                  <div
                    className={`rounded-xl p-3.5 flex items-center gap-3 border ${
                      perfil.nivel.fila_preferencial
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
                        : "bg-dark-900 border-white/5 text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-lg ${
                        perfil.nivel.fila_preferencial
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/5 text-slate-500"
                      }`}
                    >
                      <i className="fa-solid fa-people-line"></i>
                    </div>
                    <div>
                      <p className="font-bold leading-tight">
                        Fila Preferencial en Counter
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {perfil.nivel.fila_preferencial
                          ? "Activa con atención preferente en salas y dulcería."
                          : "Disponible a partir de nivel Plata."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <i className="fa-solid fa-circle-info text-brand-yellow"></i>
                  <span>
                    Multiplicador activo:{" "}
                    <strong className="text-slate-300">
                      x{perfil.nivel.multiplicador} puntos
                    </strong>{" "}
                    por cada sol gastado.
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* ── SUBTABS HORIZONTALES: MIS COMPRAS & PRÓXIMAMENTE ── */}
      {usuario && esSocio && (
        <section id="seccion-subtabs" className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16 scroll-mt-28">
          {/* Header de Tabs */}
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4 mb-8">
            <button
              type="button"
              onClick={() => setSubtabActivo("compras")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                subtabActivo === "compras"
                  ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                  : "bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700"
              }`}
            >
              <i className="fa-solid fa-receipt"></i>
              Mis Compras
              {ordenes.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs bg-white/20 rounded-full font-mono">
                  {ordenes.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSubtabActivo("datos")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                subtabActivo === "datos"
                  ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                  : "bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700"
              }`}
            >
              <i className="fa-solid fa-user-pen"></i>
              Mis Datos
            </button>

            <button
              type="button"
              onClick={() => setSubtabActivo("proximamente")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                subtabActivo === "proximamente"
                  ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                  : "bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700"
              }`}
            >
              <i className="fa-solid fa-sparkles text-brand-yellow"></i>
              Próximamente
            </button>
          </div>

          {/* Contenido según Tab */}
          {subtabActivo === "compras" ? (
            cargandoOrdenes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-dark-800/60 rounded-2xl border border-white/5 p-5 animate-pulse h-64"></div>
                ))}
              </div>
            ) : ordenes.length === 0 ? (
              <div className="bg-dark-800/40 rounded-3xl border border-white/5 p-12 text-center max-w-lg mx-auto shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-500 text-2xl mb-4">
                  <i className="fa-solid fa-ticket-simple"></i>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Aún no tienes compras registradas</h4>
                <p className="text-slate-400 text-xs mb-6">
                  Tus entradas de cine y pedidos de dulcería aparecerán listados aquí con sus comprobantes y códigos QR.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-xs cursor-pointer inline-flex items-center gap-2 shadow-md"
                >
                  <i className="fa-solid fa-film"></i>
                  Explorar Cartelera
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ordenes.map((ord) => {
                  const estadoVis = HistorialService.formatearEstado(ord.estado);
                  const fechaFmt = HistorialService.formatearFecha(ord.fecha_creacion);
                  const resumenAsientos = HistorialService.obtenerResumenAsientos(ord.entradas);
                  const resumenProductos = HistorialService.obtenerResumenProductos(ord.productos);

                  return (
                    <div
                      key={ord.id_orden}
                      className="bg-dark-800/90 rounded-2xl border border-white/10 p-5 shadow-xl hover:border-brand-blue/50 transition-all flex flex-col justify-between backdrop-blur-sm"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2.5 py-1 rounded-lg border border-brand-blue/30 font-mono">
                            {ord.codigo_orden}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${estadoVis.badgeClase}`}>
                            <i className={estadoVis.icono}></i>
                            {estadoVis.label}
                          </span>
                        </div>

                        <p className="text-slate-500 text-xs mb-3 flex items-center gap-1.5">
                          <i className="fa-regular fa-clock"></i>
                          {fechaFmt}
                        </p>

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
                              <h4 className="text-white font-bold text-sm leading-tight truncate">
                                {ord.pelicula.titulo}
                              </h4>
                              <p className="text-slate-400 text-xs mt-1">
                                {ord.pelicula.fecha} • {ord.pelicula.hora} •{" "}
                                <span className="text-brand-blue font-semibold">{ord.pelicula.formato}</span>
                              </p>
                              <p className="text-slate-500 text-[11px] truncate">
                                {ord.pelicula.sala} • {ord.nombre_sede}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3">
                            <h4 className="text-white font-bold text-sm flex items-center gap-2">
                              <i className="fa-solid fa-popcorn text-brand-yellow"></i>
                              Compra de Dulcería
                            </h4>
                            <p className="text-slate-500 text-xs mt-1">{ord.nombre_sede}</p>
                          </div>
                        )}

                        {ord.entradas && ord.entradas.length > 0 && (
                          <p className="text-xs text-slate-300 mb-2 flex items-center gap-2 bg-dark-900/60 p-2 rounded-lg border border-white/5">
                            <i className="fa-solid fa-chair text-brand-red"></i>
                            <span className="font-semibold text-white truncate">{resumenAsientos}</span>
                          </p>
                        )}

                        {resumenProductos && (
                          <p className="text-xs text-slate-300 mb-3 flex items-start gap-2 bg-dark-900/60 p-2 rounded-lg border border-white/5">
                            <i className="fa-solid fa-bowl-food text-brand-yellow mt-0.5"></i>
                            <span className="truncate">{resumenProductos}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="border-t border-white/10 pt-3 flex justify-between items-center mb-3">
                          <span className="text-slate-400 text-xs">Total pagado</span>
                          <span className="text-brand-yellow font-bold text-lg">
                            S/ {ord.total.toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => router.push(`/ticket?orden=${ord.id_orden}`)}
                          className="w-full bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-white font-bold text-xs py-2.5 rounded-xl border border-brand-blue/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <i className="fa-solid fa-qrcode"></i>
                          Ver Ticket y Boleta
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : subtabActivo === "datos" ? (
            /* Subtab Mis Datos */
            <div className="bg-dark-800/90 border border-white/10 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue text-xl shadow-lg shrink-0">
                  <i className="fa-solid fa-user-pen"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Actualizar Mis Datos
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Modifica tus datos de contacto y credenciales de acceso para tu cuenta de socio.
                  </p>
                </div>
              </div>

              <form onSubmit={solicitarConfirmacionGuardado} className="space-y-5" noValidate>
                {/* DNI si existe (identificador inmutable) */}
                {usuario?.dni && (
                  <div className="bg-dark-900/60 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                        Documento Nacional de Identidad (DNI)
                      </span>
                      <span className="font-mono text-sm font-bold text-white tracking-widest">
                        {usuario.dni}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <i className="fa-solid fa-lock text-[10px] text-brand-blue"></i> No modificable
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                      Nombres <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={formNombre}
                      onChange={(e) => manejarCambioNombre(e.target.value)}
                      placeholder="Tus nombres"
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                      Apellidos <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={formApellido}
                      onChange={(e) => manejarCambioApellido(e.target.value)}
                      placeholder="Tus apellidos"
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                    Correo Electrónico <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="email"
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-blue transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Se utilizará para iniciar sesión y para el envío de tus boletas y entradas digitales.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                    Teléfono Celular <span className="text-slate-500 font-normal">(9 dígitos)</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    value={formTelefono}
                    onChange={(e) => manejarCambioTelefono(e.target.value)}
                    placeholder="Ej. 987654321"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-brand-blue transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                    Nueva Contraseña <span className="text-slate-500 font-normal">(opcional, mín. 6 caracteres)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarPass ? "text" : "password"}
                      value={formContrasena}
                      onChange={(e) => setFormContrasena(e.target.value)}
                      placeholder="Dejar en blanco si no deseas cambiarla"
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm pr-12 outline-none focus:border-brand-blue transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPass(!mostrarPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-sm cursor-pointer"
                    >
                      <i className={`fa-solid ${mostrarPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={restablecerFormulario}
                    className="bg-white/5 hover:bg-white/10 text-slate-300 px-5 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-white/5"
                  >
                    Restablecer
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-blue hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-floppy-disk"></i>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Subtab Próximamente */
            <div className="bg-dark-800/60 border border-white/10 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 mx-auto flex items-center justify-center text-brand-yellow text-3xl mb-4 shadow-lg">
                <i className="fa-solid fa-sparkles"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Próximamente en Socio Náutica
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Estamos preparando nuevas funciones y beneficios exclusivos para nuestros socios:
                canje de combos y productos de dulcería directamente con tus puntos acumulados, cupones sorpresa y preventas con mejores butacas reservadas.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-4 py-2 rounded-full">
                <i className="fa-regular fa-clock"></i>
                Nuevas ventajas muy pronto
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── MODAL DE CONFIRMACIÓN DE CAMBIOS EN DATOS ── */}
      {mostrarModalConfirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-white animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 mx-auto flex items-center justify-center text-brand-blue text-2xl shadow-lg mb-4">
              <i className="fa-solid fa-user-check"></i>
            </div>

            <h3 className="text-xl font-bold text-center mb-1.5">
              Confirmar Actualización de Datos
            </h3>
            <p className="text-slate-400 text-xs text-center mb-5">
              ¿Estás seguro de que deseas guardar las siguientes modificaciones en tu cuenta de socio?
            </p>

            {/* Resumen de cambios */}
            <div className="bg-dark-900/80 rounded-2xl p-4 border border-white/5 text-xs space-y-2 mb-5">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Nombres:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{formNombre}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Apellidos:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{formApellido}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Correo Electrónico:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{formCorreo}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Teléfono:</span>
                <span className="font-semibold text-white">{formTelefono || "(Sin teléfono)"}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Contraseña:</span>
                <span className={`font-semibold ${formContrasena ? "text-brand-yellow font-mono" : "text-slate-500"}`}>
                  {formContrasena ? "•••••••• (Se actualizará)" : "Sin cambios"}
                </span>
              </div>
            </div>

            {(formCorreo !== usuario?.correo || Boolean(formContrasena)) && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] mb-5 flex items-start gap-2">
                <i className="fa-solid fa-triangle-exclamation shrink-0 mt-0.5"></i>
                <span>
                  Al modificar tu correo o contraseña, deberás utilizar tus nuevas credenciales para tus próximos inicios de sesión.
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                disabled={guardandoDatos}
                onClick={() => setMostrarModalConfirmacion(false)}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={guardandoDatos}
                onClick={confirmarYGuardarDatos}
                className="flex-1 bg-brand-blue hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {guardandoDatos ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    Sí, Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CARNET DIGITAL ── */}
      {mostrarModalCarnet && perfil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 transform transition-all">
            
            {/* Tarjeta Visual de Carnet */}
            <div
              className="p-7 relative text-white flex flex-col justify-between min-h-[380px]"
              style={{
                background:
                  perfil.nivel.codigo === "ORO"
                    ? "linear-gradient(135deg, #74511d 0%, #291c0a 100%)"
                    : perfil.nivel.codigo === "PLATA"
                    ? "linear-gradient(135deg, #475569 0%, #0f172a 100%)"
                    : "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
              }}
            >
              <div className="absolute right-4 top-4 text-white/5 text-8xl font-black pointer-events-none select-none">
                <i className="fa-solid fa-film"></i>
              </div>

              {/* Encabezado Carnet */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="font-black tracking-widest text-lg block leading-none">
                    CINE NÁUTICA
                  </span>
                  <span className="text-[10px] text-brand-yellow uppercase tracking-wider font-bold">
                    MEMBRESÍA EXCLUSIVA
                  </span>
                </div>
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow"
                  style={{
                    background: `${perfil.nivel.color_hex}33`,
                    color: perfil.nivel.color_hex,
                    border: `1px solid ${perfil.nivel.color_hex}`,
                  }}
                >
                  {perfil.nivel.nombre}
                </span>
              </div>

              {/* QR Code Central */}
              <div className="my-6 flex flex-col items-center justify-center relative z-10">
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  <QRCodeSVG level="M" size={130} value={perfil.codigo_socio} />
                </div>
                <span className="mt-2 font-mono font-black text-sm tracking-widest text-brand-yellow">
                  {perfil.codigo_socio}
                </span>
              </div>

              {/* Pie Carnet */}
              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Titular</p>
                  <p className="font-bold text-sm tracking-wide">
                    {perfil.nombre} {perfil.apellido}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Saldo</p>
                  <p className="font-mono font-black text-base text-brand-yellow">
                    {perfil.puntos} pts
                  </p>
                </div>
              </div>
            </div>

            {/* Botón Cerrar */}
            <button
              aria-label="Cerrar carnet"
              className="w-full bg-dark-900 hover:bg-dark-950 text-white py-3 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border-t border-white/10"
              type="button"
              onClick={() => setMostrarModalCarnet(false)}
            >
              Cerrar Carnet
            </button>
          </div>
        </div>
      )}

      {/* ── HISTORIAL DE MOVIMIENTOS DE PUNTOS (SI HAY DATOS) ── */}
      {usuario && esSocio && perfil && perfil.movimientos.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2.5">
            <i className="fa-solid fa-clock-rotate-left text-brand-blue"></i>
            Historial de Movimientos de Puntos
          </h3>

          <div className="bg-dark-800 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden shadow-xl">
            {perfil.movimientos.map((m) => (
              <div
                key={m.id_historial_puntos}
                className="p-4 md:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-white font-semibold text-sm">{m.descripcion}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {new Date(m.fecha_hora).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm md:text-base ${
                      m.puntos >= 0 ? "text-emerald-400" : "text-brand-red"
                    }`}
                  >
                    {m.puntos >= 0 ? `+${m.puntos}` : m.puntos} pts
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Saldo: {m.saldo_resultante} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CARDS DE BENEFICIOS DEL PROGRAMA ── */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 text-center shadow-xl hover:border-brand-blue/30 transition-all">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-6">
            <i className="fa-solid fa-star text-3xl text-brand-blue"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Acumula Puntos</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gana puntos automáticamente por cada entrada y combo de dulcería que compres, canjeables por descuentos directos en tus futuras compras.
          </p>
        </div>

        <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 text-center shadow-xl hover:border-brand-yellow/30 transition-all">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-6">
            <i className="fa-solid fa-cake-candles text-3xl text-brand-yellow"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Entrada Gratis en tu Cumpleaños</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Durante todo el mes de tu onomástico, reclama en la taquilla de tu sede favorita una entrada 2D de cortesía para cualquier película de cartelera.
          </p>
        </div>

        <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 text-center shadow-xl hover:border-green-500/30 transition-all">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
            <i className="fa-solid fa-people-line text-3xl text-green-400"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Fila Preferencial</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            A partir del nivel Plata, evita las colas con atención ágil y prioritaria tanto en taquilla física como en la barra de confitería.
          </p>
        </div>
      </section>

      {/* ── CTA INVITADO (SI NO HA INICIADO SESIÓN O NO ES SOCIO) ── */}
      {(!usuario || !esSocio) && !cargandoSesion && (
        <section className="text-center pt-8 pb-16 px-4">
          <div className="max-w-xl mx-auto bg-gradient-to-r from-dark-800 to-dark-800/80 p-8 rounded-3xl border border-brand-blue/30 shadow-2xl">
            <h3 className="text-2xl font-black mb-2">¿Aún no eres Socio Náutica?</h3>
            <p className="text-slate-300 text-sm mb-6">
              Regístrate gratis hoy mismo y comienza a disfrutar de entradas de cumpleaños, preventas exclusivas y puntos con cada visita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                type="button"
                onClick={() => abrirModalRegistro()}
              >
                Crear Cuenta Gratis
              </button>
              <button
                className="bg-dark-900 hover:bg-dark-950 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-bold text-sm border border-white/10 transition-colors cursor-pointer"
                type="button"
                onClick={() => abrirModalLogin()}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
