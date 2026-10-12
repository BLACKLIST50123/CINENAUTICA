"use client";

import { abrirModalLegal, alCambiarCiudadDulceria, cerrarModalTrailer, manejarLogin, manejarRegistro, validarSedeDulceria } from "@/src/lib/ui/cliente";
import { cerrarCarnetSocio, cerrarModal, cerrarModalLegal, cerrarModalPerfil, cerrarModalPromoBanner, cerrarModalesAuth, copiarCodigoSocio } from "@/src/lib/ui/common";
import { abrirDetallePelicula, cambiarVista, confirmarSedeDulceria, elegirSedeNav, intentarSalirDelFlujoDeCompra, vistaActual } from "@/src/lib/ui/nav";

export default function ModalesGlobales() {
  return (
    <>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200" id="modal-login">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-200" id="login-contenido">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModalesAuth(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Iniciar Sesión
          </h3>
          <form className="space-y-4" id="formulario-login" onSubmit={(event) => { manejarLogin(event); }}>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Correo Electrónico
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="login-correo" required type="email" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Contraseña
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="login-contrasena" required type="password" />
            </div>
            <p className="text-red-500 text-sm hidden text-center" id="login-error">
              Credenciales incorrectas.
            </p>
            {" "}
            <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-3 rounded-xl font-bold transition-colors mt-4" type="submit">
              Ingresar
            </button>
          </form>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200" id="modal-registro">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-200" id="registro-contenido">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModalesAuth(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Crea tu Cuenta
          </h3>
          <form className="space-y-4" id="formulario-registro" onSubmit={(event) => { manejarRegistro(event); }}>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Nombres
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-nombre" required type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Apellidos
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-apellido" required type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                DNI (Documento de Identidad)
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-dni" maxLength={8} pattern={"[0-9]{8}"} required type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Correo Electrónico
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-correo" required type="email" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Contraseña
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-contrasena" required type="password" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Fecha de Nacimiento
                {" "}
                <span className="text-xs text-slate-500">
                  (Debes ser mayor de 18 años)
                </span>
              </label>
              {" "}
              <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-fecha-nacimiento" required type="date" />
            </div>
            {" "}
            <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input className="mt-0.5 accent-brand-blue w-4 h-4 flex-shrink-0" id="check-privacidad-registro" type="checkbox" />
              {" "}
              <span>
                Acepto las
                {" "}
                <a className="text-brand-yellow hover:underline" href="#" onClick={(event) => { abrirModalLegal('privacidad'); event.preventDefault(); }}>
                  Políticas de Privacidad
                </a>
                {" "}
                (Ley N° 29733).
              </span>
            </label>
            {" "}
            <button className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-colors mt-4" type="submit">
              Registrarse
            </button>
          </form>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200" id="modal-perfil">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-200" id="perfil-contenido">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModalPerfil(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-dark-900 border-2 border-brand-blue flex items-center justify-center mb-3">
              <i className="fa-solid fa-user text-brand-yellow text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Mi Perfil
            </h3>
          </div>
          <div className="bg-dark-900 rounded-xl p-4 mb-6 space-y-2 border border-white/5">
            <p className="text-slate-400 text-xs uppercase font-bold">
              Nombre
            </p>
            <p className="text-white font-semibold mb-2" id="perfil-nombre">
              Juan Pérez
            </p>
            <p className="text-slate-400 text-xs uppercase font-bold">
              Correo
            </p>
            <p className="text-white font-semibold" id="perfil-correo">
              juan.perez@correo.com
            </p>
            <p className="text-slate-400 text-xs uppercase font-bold mt-2">
              DNI
            </p>
            <p className="text-white font-semibold mb-2" id="perfil-dni">
              12345678
            </p>
            <p className="text-slate-400 text-xs uppercase font-bold">
              Fecha de Nacimiento
            </p>
            <p className="text-white font-semibold" id="perfil-nacimiento">
              14/11/1995
            </p>
          </div>
          <div id="perfil-bloque-socio">
            <div className="flex items-center justify-between bg-dark-900/60 rounded-xl px-4 py-2 mb-3 border border-white/5">
              <span className="text-slate-400 text-xs font-mono" id="perfil-codigo-socio">
                CIN-482913
              </span>
              {" "}
              <button className="text-slate-400 hover:text-brand-yellow transition-colors text-sm" title="Copiar código de socio" type="button" onClick={(event) => { copiarCodigoSocio(); }}>
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>
            {" "}
            {" "}
            <button className="w-full bg-dark-900 hover:bg-dark-700 rounded-xl p-4 mb-6 border border-white/5 flex items-center justify-between transition-colors text-left" onClick={(event) => { cerrarModalPerfil(); intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), 'vista-beneficios')); }}>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold">
                  Socio Náutica
                </p>
                <p className="text-brand-yellow font-bold" id="perfil-puntos-resumen">
                  540 puntos
                </p>
              </div>
              {" "}
              <i className="fa-solid fa-chevron-right text-slate-500"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 opacity-0 transition-opacity duration-200" id="modal-carnet-socio" onClick={(event) => { if (event.target === event.currentTarget) cerrarCarnetSocio(); }}>
        <button aria-label="Cerrar carnet" className="absolute top-4 right-4 text-slate-300 hover:text-white text-3xl" type="button" onClick={(event) => { cerrarCarnetSocio(); }}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {" "}
        <div className="w-full max-w-md rounded-3xl border-2 bg-gradient-to-br from-dark-700 to-dark-900 overflow-hidden text-center shadow-2xl transform scale-95 transition-transform duration-200" id="carnet-socio-tarjeta" style={{ borderColor: "#C0C0C0" }}>
          <div className="h-3 w-full" id="carnet-socio-franja" style={{ background: "#C0C0C0" }}></div>
          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 flex items-center justify-center bg-brand-blue rounded-lg">
                <i className="fa-solid fa-film text-white text-sm"></i>
              </div>
              {" "}
              <span className="text-xl font-bold tracking-tighter text-white">
                CINE
                <span className="text-brand-blue">
                  NÁUTICA
                </span>
              </span>
            </div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">
              Socio Náutica
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 break-words" id="carnet-socio-nombre">
              Juan Pérez
            </h2>
            {" "}
            <span className="inline-block px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6" id="carnet-socio-nivel" style={{ background: "#C0C0C022", color: "#C0C0C0", border: "1px solid #C0C0C055" }}>
              Plata
            </span>
            {" "}
            <div className="bg-black/40 rounded-2xl py-6 px-2 mb-6 border border-white/10">
              <p className="text-slate-400 text-xs uppercase font-bold mb-2">
                Código de socio
              </p>
              <p className="font-mono text-4xl md:text-5xl font-bold tracking-widest text-white break-all" id="carnet-socio-codigo">
                CIN-482913
              </p>
            </div>
            <p className="text-slate-400 text-xs uppercase font-bold">
              Puntos disponibles
            </p>
            <p className="text-5xl font-bold text-brand-yellow" id="carnet-socio-puntos">
              540
            </p>
            <p className="text-slate-500 text-xs mt-6">
              Muestra esta pantalla en counter para que te identifiquen, canjeen tus puntos y validen tus beneficios.
            </p>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-trailer">
        <div className="max-w-3xl w-full relative transform scale-95 transition-transform duration-200" id="trailer-contenido">
          <button className="absolute -top-10 right-0 text-white/70 hover:text-white" onClick={(event) => { cerrarModalTrailer(); }}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
          {" "}
          <h3 className="text-white font-bold text-lg mb-3" id="trailer-titulo"></h3>
          <div className="video-container bg-black rounded-2xl border border-white/10 overflow-hidden">
            <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0" frameBorder="0" id="trailer-iframe"></iframe>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-legal">
        <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200 max-h-[85vh] overflow-y-auto hide-scrollbar" id="legal-contenido">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModalLegal(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <div className="w-14 h-14 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-4" id="legal-icono">
            <i className="fa-solid fa-file-lines text-2xl text-brand-blue"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4" id="legal-titulo">
            Información
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed space-y-3" id="legal-texto"></div>
          {" "}
          <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-3 rounded-xl font-bold transition-colors mt-6" onClick={(event) => { cerrarModalLegal(); }}>
            Entendido
          </button>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center opacity-0 transition-opacity duration-300 p-4" id="modal-promo-banner">
        <div className="relative w-[98vw] max-w-[1400px] aspect-[16/9] md:aspect-[21/9] bg-dark-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(10,126,177,0.3)] transform scale-95 transition-transform duration-300 flex border border-white/10 group" id="promo-banner-contenido">
          <button className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-brand-red text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors border border-white/20 shadow-lg" onClick={(event) => { cerrarModalPromoBanner(); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          {" "}
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" id="promo-banner-bg" style={{ backgroundImage: "url('https://i0.wp.com/www.lacosacine.com/wp-content/uploads/2026/04/La-Noche-del-Demonio-Banner-1.jpg?resize=1200%2C720&ssl=1')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent md:hidden"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-between p-8 md:p-16">
            <div className="flex flex-col justify-center h-full w-full md:w-1/2">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-block px-4 py-1.5 bg-brand-yellow text-black font-bold text-xs md:text-sm tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(220,158,63,0.5)] animate-pulse" id="promo-banner-etiqueta-exclusiva">
                  ¡Promoción Exclusiva!
                </span>
                {" "}
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-xs md:text-sm rounded uppercase" id="promo-banner-tipo-lanzamiento">
                  Pre-Estreno
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-2 drop-shadow-2xl uppercase tracking-tighter" id="promo-banner-titulo">
                La Noche del Demonio
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="text-brand-blue text-lg md:text-xl font-bold tracking-widest uppercase drop-shadow-lg" id="promo-banner-genero">
                  TERROR / SUSPENSO | 1h 46m
                </p>
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block"></span>
                {" "}
                <div className="hidden md:flex gap-2">
                  <span className="px-2 py-0.5 border border-white/20 text-white/80 text-xs font-bold rounded uppercase" id="promo-banner-formato">
                    D-BOX
                  </span>
                  {" "}
                  <span className="px-2 py-0.5 border border-brand-red/50 text-brand-red text-xs font-bold rounded uppercase" id="promo-banner-clasificacion">
                    +14
                  </span>
                </div>
              </div>
              <p className="text-brand-yellow text-lg md:text-2xl font-black italic uppercase tracking-wider mb-8 drop-shadow-md" id="promo-banner-fomo">
                "¡Mírala hoy, solo en cines!"
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button className="bg-brand-blue hover:bg-brand-dark-blue text-white px-8 py-4 rounded-xl font-bold text-lg md:text-xl transition-all shadow-[0_0_20px_rgba(10,126,177,0.4)] hover:shadow-[0_0_30px_rgba(10,126,177,0.6)] transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-max" id="promo-banner-btn-comprar" onClick={(event) => { cerrarModalPromoBanner(); abrirDetallePelicula('demonio','cartelera'); }}>
                  <i className="fa-solid fa-ticket-simple"></i>
                  {" "}
                  Comprar Entradas
                </button>
                {" "}
                <button className="text-white/60 hover:text-white font-semibold text-sm underline transition-colors px-4 py-2 text-center" onClick={(event) => { cerrarModalPromoBanner(); }}>
                  Quizás más tarde
                </button>
              </div>
              <div className="mt-6 flex items-start sm:items-center gap-2 text-xs text-white/50">
                <i className="fa-solid fa-star text-brand-yellow mt-0.5 sm:mt-0"></i>
                {" "}
                <span id="promo-banner-texto-socios">
                  Socios CineNáutica acumulan
                  {" "}
                  <strong className="text-white/90">
                    doble puntaje
                  </strong>
                  {" "}
                  con esta función.
                </span>
              </div>
            </div>
            <div className="hidden md:flex flex-col justify-center items-end h-full w-1/2 pl-8">
              <div className="w-full max-w-md lg:max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50">
                  <i className="fa-solid fa-circle-notch fa-spin text-white text-3xl"></i>
                </div>
                <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="relative z-10 w-full h-full" frameBorder="0" id="promo-banner-trailer"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-sede">
        <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200 max-h-[88vh] flex flex-col">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModal('modal-sede'); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <div className="w-14 h-14 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-4">
            <i className="fa-solid fa-location-dot text-2xl text-brand-yellow"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            ¿En qué sede quieres ver cine?
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            Te mostraremos la cartelera y las funciones de esa sede.
          </p>
          <div className="overflow-y-auto hide-scrollbar pr-1 -mr-1 flex-grow">
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors" type="button" onClick={(event) => { elegirSedeNav(''); }}>
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                <i className="fa-solid fa-globe text-slate-400 text-sm"></i>
              </div>
              <span className="text-white font-semibold text-sm">
                Ver todas las sedes
              </span>
            </button>
            {" "}
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2">
              Áncash · Chimbote
            </p>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s1'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Megaplaza
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. Principal 123, Megaplaza Chimbote
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s2'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Costa Azul
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. Pardo 1450, Chimbote
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            {" "}
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2">
              Áncash · Nuevo Chimbote
            </p>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s3'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Nuevo Chimbote
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. Universitaria 880, Nuevo Chimbote
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            {" "}
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2">
              La Libertad · Trujillo
            </p>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s4'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Trujillo Centro
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Jr. Pizarro 540, Trujillo
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s5'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Mall Trujillo
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. Mansiche 2100, Trujillo
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            {" "}
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2">
              Lima · Lima Metropolitana
            </p>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s6'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Lima Norte
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. Alfredo Mendiola 3698, Los Olivos
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s7'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica Miraflores
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. Larco 812, Miraflores
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
            <button className="w-full text-left bg-dark-900 hover:bg-dark-700 border border-white/5 hover:border-brand-yellow rounded-xl p-3 flex items-center gap-3 transition-colors mb-2" type="button" onClick={(event) => { elegirSedeNav('s8'); }}>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm"></i>
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-white font-semibold text-sm truncate">
                  Náutica San Miguel
                </p>
                <p className="text-slate-500 text-xs truncate">
                  Av. La Marina 2355, San Miguel
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4" id="modal-dulceria-sede">
        <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative transform scale-95 transition-transform duration-200">
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={(event) => { cerrarModal('modal-dulceria-sede'); }}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          {" "}
          <div className="w-14 h-14 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-4">
            <i className="fa-solid fa-bowl-food text-2xl text-brand-yellow"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            ¿Dónde recojo mi pedido?
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Elige ciudad y sede para abrir la dulcería de ese cine.
          </p>
          <div className="space-y-5">
            <div className="filtro-campo">
              <label>
                Ciudad
              </label>
              <i className="fa-solid fa-city"></i>
              <select className="filtro-select" id="dulceria-ciudad" onChange={(event) => { alCambiarCiudadDulceria(); }}>
                <option value="">
                  Selecciona una ciudad
                </option>
                <option value="Chimbote">
                  Chimbote
                </option>
                <option value="Nuevo Chimbote">
                  Nuevo Chimbote
                </option>
                <option value="Trujillo">
                  Trujillo
                </option>
                <option value="Lima Metropolitana">
                  Lima Metropolitana
                </option>
              </select>
            </div>
            <div className="filtro-campo">
              <label>
                Sede
              </label>
              <i className="fa-solid fa-location-dot"></i>
              <select className="filtro-select" disabled id="dulceria-sede" onChange={(event) => { validarSedeDulceria(); }}>
                <option value="">
                  Selecciona una sede
                </option>
                <option data-ciudad="Chimbote" value="s1">
                  Náutica Megaplaza
                </option>
                <option data-ciudad="Chimbote" value="s2">
                  Náutica Costa Azul
                </option>
                <option data-ciudad="Nuevo Chimbote" value="s3">
                  Náutica Nuevo Chimbote
                </option>
                <option data-ciudad="Trujillo" value="s4">
                  Náutica Trujillo Centro
                </option>
                <option data-ciudad="Trujillo" value="s5">
                  Náutica Mall Trujillo
                </option>
                <option data-ciudad="Lima Metropolitana" value="s6">
                  Náutica Lima Norte
                </option>
                <option data-ciudad="Lima Metropolitana" value="s7">
                  Náutica Miraflores
                </option>
                <option data-ciudad="Lima Metropolitana" value="s8">
                  Náutica San Miguel
                </option>
              </select>
            </div>
          </div>
          {" "}
          <button className="w-full mt-6 bg-brand-yellow hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:hover:bg-slate-700 text-black py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2" disabled id="btn-confirmar-sede-dulceria" type="button" onClick={(event) => { confirmarSedeDulceria(); }}>
            Continuar a Dulcería
            {" "}
            <i className="fa-solid fa-bowl-food"></i>
          </button>
        </div>
      </div>
      <div id="overlay-carga-vista">
        <div className="spinner-Cine Náutica"></div>
      </div>
      <div id="contenedor-toasts"></div>
    </>
  );
}
