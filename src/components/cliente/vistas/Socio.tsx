"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSesion } from "@/src/context/SesionContext";
import { SocioService } from "@/src/services/socioService";
import type { PerfilSocioCompletoDTO } from "@/src/dtos/socio";
import { abrirModalLogin, abrirModalRegistro, mostrarToast } from "@/src/lib/ui/common";

export default function Socio() {
  const { usuario, esSocio, cargando: cargandoSesion } = useSesion();

  const [perfil, setPerfil] = useState<PerfilSocioCompletoDTO | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState<boolean>(false);
  const [mostrarModalCarnet, setMostrarModalCarnet] = useState<boolean>(false);

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
    } else {
      setPerfil(null);
    }
  }, [usuario, esSocio]);

  const copiarCodigo = () => {
    if (!perfil?.codigo_socio) return;
    navigator.clipboard.writeText(perfil.codigo_socio);
    mostrarToast("¡Código de socio copiado al portapapeles!", "success");
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
              {/* Marca de agua */}
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
