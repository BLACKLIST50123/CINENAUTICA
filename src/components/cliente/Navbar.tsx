"use client";

// Navbar con estado real de sesión desde useSesion() (Supabase Auth).
// - Menú invitado / menú usuario se renderizan condicionalmente en React (no con display:hidden vía JS).
// - Muestra nombre real del socio en el avatar y el menú.
// - Cierre de sesión real via Supabase.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { abrirModalLegal, toggleMenuMovil } from "@/src/lib/ui/cliente";
import { abrirModal, abrirModalLogin, abrirModalRegistro } from "@/src/lib/ui/common";
import { abrirMisCompras, abrirVistaPromociones, abrirVistaUbicacion, cambiarVista, intentarSalirDelFlujoDeCompra, irAVistaContacto, pedirSedeParaDulceria, vistaActual } from "@/src/lib/ui/nav";
import { useSesion } from "@/src/context/SesionContext";

export default function Navbar() {
  const router = useRouter();
  const { usuario, socio, cargando, logout } = useSesion();
  const [scrolled, setScrolled] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    function handleScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determinar si hay sesión activa y si es un cliente (no personal).
  // montado asegura que SSR e hidratación inicial en cliente coincidan al 100% sin mismatch.
  const haySesion = montado && !!usuario && !cargando;
  const esCliente = haySesion && usuario?.codigo_rol === 'cliente';

  async function manejarCerrarSesion() {
    await logout();
    cambiarVista(null, 'vista-inicio');
  }

  // Nombre para mostrar en el navbar
  const nombreCorto = usuario ? usuario.nombre : '';
  const inicialesAvatar = usuario
    ? `${usuario.nombre[0] ?? ''}${usuario.apellido[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 flex justify-between items-center ${
          scrolled
            ? "navbar-scrolled bg-[#050B14]/92 backdrop-blur-md shadow-xl border-b border-white/10"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
        id="barra-navegacion"
      >
        <a className="flex items-center gap-2 group cursor-pointer" href="#" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), 'vista-inicio')); event.preventDefault(); }}>
          <img alt="Logo" className="h-12 w-auto object-contain drop-shadow-md" src="/img/logo/logocinenautica.png" />
          <span className="text-2xl font-bold tracking-tighter text-white">
            CINE<span className="text-brand-blue">NÁUTICA</span>
          </span>
        </a>

        <button className="hidden lg:flex items-center gap-2 ml-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full pl-3 pr-4 py-1.5 text-left transition-colors cursor-pointer" id="chip-sede-nav" title="Cambiar de sede" onClick={() => abrirModal('modal-sede')}>
          <i className="fa-solid fa-location-dot text-cyan-400"></i>
          <span className="leading-tight">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Tu sede</span>
            <span className="block text-xs font-bold text-white" id="sede-nav-label">Todas las sedes</span>
          </span>
          <i className="fa-solid fa-chevron-down text-[9px] text-slate-400"></i>
        </button>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <a className="text-white hover:text-cyan-400 transition-colors cursor-pointer" href="#" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), 'vista-inicio')); event.preventDefault(); }}>Inicio</a>
          <a className="text-white hover:text-cyan-400 transition-colors cursor-pointer" href="#" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => abrirVistaPromociones()); event.preventDefault(); }}>Promociones</a>
          <a className="text-white hover:text-cyan-400 transition-colors cursor-pointer" href="#" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => pedirSedeParaDulceria()); event.preventDefault(); }}>Dulcería</a>
          <a className="text-white hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-colors font-bold cursor-pointer" href="#" id="link-nav-socio" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => router.push("/socio")); event.preventDefault(); }}>Socio Náutica</a>
          <a className="text-white hover:text-cyan-400 transition-colors cursor-pointer" href="#" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => abrirVistaUbicacion()); event.preventDefault(); }}>Ubicación</a>
          <a className="text-white hover:text-cyan-400 transition-colors cursor-pointer" href="#" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => irAVistaContacto()); event.preventDefault(); }}>Contáctenos</a>
        </nav>

        {/* ── Menú de usuario (desktop) ── */}
        <div className="hidden md:flex items-center gap-4">
          {!haySesion ? (
            <div className="flex items-center gap-4" id="menu-invitado">
              <button className="text-white hover:text-cyan-400 transition-colors font-semibold text-sm cursor-pointer" onClick={() => abrirModalLogin()}>
                Ingresar
              </button>
              <button className="bg-[#0284C7] hover:bg-[#0369A1] text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all transform hover:scale-105 cursor-pointer" onClick={() => abrirModalRegistro()}>
                Únete
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4" id="menu-usuario">
              {esCliente && socio && (
                <span className="hidden lg:flex items-center gap-1.5 text-cyan-400 text-sm font-bold">
                  <i className="fa-solid fa-star text-xs"></i>
                  {socio.puntos} pts
                </span>
              )}
              <button className="text-white hover:text-cyan-400 transition-colors font-semibold text-sm flex items-center gap-2 cursor-pointer" id="btn-mis-compras" onClick={() => intentarSalirDelFlujoDeCompra(() => router.push("/socio?tab=compras"))}>
                <i className="fa-solid fa-receipt"></i>
                Mis Compras
              </button>
              <div className="relative group cursor-pointer" title={`Mi perfil — ${nombreCorto}`} onClick={() => abrirModal('modal-perfil')}>
                <div className="w-10 h-10 rounded-full bg-dark-800 border-2 border-cyan-500 flex items-center justify-center overflow-hidden" id="avatar-navbar-usuario">
                  {inicialesAvatar ? (
                    <span className="text-cyan-400 font-bold text-sm">{inicialesAvatar}</span>
                  ) : (
                    <i className="fa-solid fa-user text-cyan-400"></i>
                  )}
                </div>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors text-xl ml-2 cursor-pointer" title="Cerrar Sesión" onClick={manejarCerrarSesion}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          )}
        </div>

        <button className="md:hidden text-white text-2xl focus:outline-none cursor-pointer" id="btn-menu-movil" onClick={() => toggleMenuMovil()}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </header>

      {/* Botón de libro de reclamaciones */}
      <button aria-label="Libro de Reclamaciones" className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#193582] hover:bg-[#0f2461] text-white py-3 px-2.5 rounded-r-xl shadow-2xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer" title="Libro de Reclamaciones" onClick={() => abrirModalLegal('reclamaciones')}>
        <i className="fa-solid fa-book text-lg"></i>
        <span className="text-[9px] font-bold leading-tight [writing-mode:vertical-rl] rotate-180 tracking-wide">LIBRO DE RECLAMACIONES</span>
      </button>

      {/* Overlay + drawer menú móvil */}
      <div className="hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] opacity-0 transition-opacity duration-300" id="overlay-menu-movil" onClick={() => toggleMenuMovil(false)}></div>
      <aside className="fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-dark-800 border-l border-white/10 z-[60] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col" id="drawer-menu-movil">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <span className="text-xl font-bold tracking-tighter text-white">CINE<span className="text-brand-blue">NÁUTICA</span></span>
          <button className="text-slate-400 hover:text-white text-xl cursor-pointer" onClick={() => toggleMenuMovil(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <nav className="flex flex-col p-6 gap-1 font-semibold text-white overflow-y-auto">
          <a className="py-3 mb-1 border-b border-cyan-500/30 text-cyan-400 font-bold cursor-pointer flex items-center" href="#" onClick={(event) => { toggleMenuMovil(false); abrirModal('modal-sede'); event.preventDefault(); }}>
            <i className="fa-solid fa-location-dot w-6"></i>
            <span id="sede-nav-label-movil">Elegir sede</span>
          </a>
          <a className="py-3 border-b border-white/5 hover:text-cyan-400 transition-colors cursor-pointer flex items-center" href="#" onClick={(event) => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), 'vista-inicio')); event.preventDefault(); }}>
            <i className="fa-solid fa-house w-6"></i> Inicio
          </a>
          <a className="py-3 border-b border-white/5 hover:text-cyan-400 transition-colors cursor-pointer flex items-center" href="#" onClick={(event) => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => abrirVistaPromociones()); event.preventDefault(); }}>
            <i className="fa-solid fa-tags w-6"></i> Promociones
          </a>
          <a className="py-3 border-b border-white/5 hover:text-cyan-400 transition-colors cursor-pointer flex items-center" href="#" onClick={(event) => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => pedirSedeParaDulceria()); event.preventDefault(); }}>
            <i className="fa-solid fa-bowl-food w-6"></i> Dulcería
          </a>
          <a className="py-3 border-b border-white/5 hover:text-cyan-400 transition-colors cursor-pointer flex items-center" href="#" id="link-nav-socio-movil" onClick={(event) => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => router.push("/socio")); event.preventDefault(); }}>
            <i className="fa-solid fa-star w-6"></i> Socio Náutica
          </a>
          <a className="py-3 border-b border-white/5 hover:text-cyan-400 transition-colors cursor-pointer flex items-center" href="#" onClick={(event) => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => abrirVistaUbicacion()); event.preventDefault(); }}>
            <i className="fa-solid fa-location-dot w-6"></i> Ubicación
          </a>
          <a className="py-3 border-b border-white/5 hover:text-cyan-400 transition-colors cursor-pointer flex items-center" href="#" onClick={(event) => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => irAVistaContacto()); event.preventDefault(); }}>
            <i className="fa-solid fa-envelope w-6"></i> Contáctenos
          </a>
        </nav>

        {/* Menú de sesión móvil — condicional en React */}
        <div className="mt-auto p-6 border-t border-white/10 flex flex-col gap-3">
          {!haySesion ? (
            <div className="flex flex-col gap-3" id="menu-invitado-movil">
              <button className="w-full text-center text-white border border-white/20 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-white/5 transition-colors" onClick={() => { toggleMenuMovil(false); abrirModalLogin(); }}>
                Ingresar
              </button>
              <button className="w-full text-center bg-[#0284C7] hover:bg-[#0369A1] text-white py-2.5 rounded-full font-bold text-sm cursor-pointer shadow-lg shadow-cyan-900/40 transition-colors" onClick={() => { toggleMenuMovil(false); abrirModalRegistro(); }}>
                Únete
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3" id="menu-usuario-movil">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-dark-900 border-2 border-cyan-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 font-bold text-sm">{inicialesAvatar}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{usuario?.nombre} {usuario?.apellido}</p>
                  {esCliente && socio && (
                    <p className="text-cyan-400 text-xs"><i className="fa-solid fa-star text-xs mr-1"></i>{socio.puntos} puntos</p>
                  )}
                </div>
              </div>
              <button className="w-full text-center text-white border border-white/20 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-white/5 transition-colors" id="btn-mis-compras-movil" onClick={() => { toggleMenuMovil(false); intentarSalirDelFlujoDeCompra(() => router.push("/socio?tab=compras")); }}>
                <i className="fa-solid fa-receipt mr-2"></i>Mis Compras
              </button>
              <button className="w-full text-center text-slate-400 border border-white/10 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:text-white hover:border-white/20 transition-colors" onClick={() => { toggleMenuMovil(false); manejarCerrarSesion(); }}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
