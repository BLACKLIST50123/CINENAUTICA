'use client';
// Modales de autenticación con lógica real de Supabase.
// Patrón: Service Layer — este componente llama a useSesion() (que llama al service de auth).
// Reemplaza las funciones demo manejarLogin() y manejarRegistro() de cliente.ts.
//
// Incluye:
//   - modal-login: inicio de sesión real
//   - modal-registro: registro de cliente + creación de socio
//   - modal-perfil: datos reales del usuario con SesionContext
//   - modal-carnet-socio: carnet con datos del socio en tiempo real

import { useState, useRef, FormEvent } from 'react';
import { useSesion } from '@/src/context/SesionContext';
import { cerrarModal, cerrarModalesAuth, cerrarModalPerfil, cerrarCarnetSocio, mostrarToast } from '@/src/lib/ui/common';
import { cambiarVista, intentarSalirDelFlujoDeCompra, vistaActual } from '@/src/lib/ui/nav';
import { abrirModalLegal } from '@/src/lib/ui/cliente';

// ---------- Validaciones (doble capa: AGENTS.md §Convenciones) ----------

const REGEX_NOMBRE   = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,60}$/;
const REGEX_DNI      = /^\d{8}$/;
const REGEX_CELULAR  = /^9\d{8}$/;
const REGEX_PASS     = /^.{6,}$/;

function validarRegistro(datos: {
  nombre: string; apellido: string; dni: string;
  celular: string; contrasena: string; fechaNac: string; aceptaPrivacidad: boolean;
}): string | null {
  if (!REGEX_NOMBRE.test(datos.nombre)) return 'Nombre inválido (solo letras, 2-60 caracteres).';
  if (!REGEX_NOMBRE.test(datos.apellido)) return 'Apellido inválido (solo letras, 2-60 caracteres).';
  if (!REGEX_DNI.test(datos.dni)) return 'DNI debe tener exactamente 8 dígitos.';
  if (datos.celular && !REGEX_CELULAR.test(datos.celular)) return 'Celular debe tener 9 dígitos iniciando con 9.';
  if (!REGEX_PASS.test(datos.contrasena)) return 'La contraseña debe tener mínimo 6 caracteres.';
  if (!datos.fechaNac) return 'La fecha de nacimiento es requerida.';
  if (!datos.aceptaPrivacidad) return 'Debes aceptar las Políticas de Privacidad.';
  // Validar mayoría de edad (18+)
  const hoy = new Date();
  const nac = new Date(datos.fechaNac);
  const edad = hoy.getFullYear() - nac.getFullYear() -
    (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate()) ? 1 : 0);
  if (edad < 18) return 'Debes tener al menos 18 años para registrarte.';
  return null;
}

// ---------- Modal Login ----------

export function ModalLogin() {
  const { login } = useSesion();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const correoRef = useRef<HTMLInputElement>(null);
  const contraRef = useRef<HTMLInputElement>(null);

  async function manejarLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    const resultado = await login(
      correoRef.current!.value.trim(),
      contraRef.current!.value
    );
    setCargando(false);
    if (!resultado.ok) {
      // Normalizar mensajes de error de Supabase al español
      setError('Correo o contraseña incorrectos. Intenta nuevamente.');
    } else {
      cerrarModalesAuth();
      mostrarToast('¡Bienvenido de vuelta!', 'exito');
    }
  }

  return (
    <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200" id="modal-login">
      <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-200" id="login-contenido">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => cerrarModalesAuth()}>
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h3>
        <form className="space-y-4" id="formulario-login" onSubmit={manejarLogin}>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Correo Electrónico</label>
            <input ref={correoRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="login-correo" required type="email" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Contraseña</label>
            <input ref={contraRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="login-contrasena" required type="password" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            className="w-full bg-brand-blue hover:bg-brand-dark-blue disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-colors mt-4 flex items-center justify-center gap-2"
            type="submit" disabled={cargando}
          >
            {cargando ? <><i className="fa-solid fa-spinner fa-spin"></i> Ingresando...</> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------- Modal Registro ----------

export function ModalRegistro() {
  const { registro } = useSesion();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  // Refs de cada campo
  const nombreRef     = useRef<HTMLInputElement>(null);
  const apellidoRef   = useRef<HTMLInputElement>(null);
  const dniRef        = useRef<HTMLInputElement>(null);
  const celularRef    = useRef<HTMLInputElement>(null);
  const correoRef     = useRef<HTMLInputElement>(null);
  const contraRef     = useRef<HTMLInputElement>(null);
  const fechaRef      = useRef<HTMLInputElement>(null);
  const privacidadRef = useRef<HTMLInputElement>(null);

  async function manejarRegistro(e: FormEvent) {
    e.preventDefault();
    setError('');

    const datos = {
      nombre: nombreRef.current!.value.trim(),
      apellido: apellidoRef.current!.value.trim(),
      dni: dniRef.current!.value.trim(),
      celular: celularRef.current!.value.trim(),
      contrasena: contraRef.current!.value,
      fechaNac: fechaRef.current!.value,
      aceptaPrivacidad: privacidadRef.current!.checked,
    };

    const validacion = validarRegistro(datos);
    if (validacion) { setError(validacion); return; }

    setCargando(true);
    const resultado = await registro({
      nombre: datos.nombre,
      apellido: datos.apellido,
      correo: correoRef.current!.value.trim(),
      contrasena: datos.contrasena,
      dni: datos.dni,
      celular: datos.celular,
      fecha_nacimiento: datos.fechaNac,
    });
    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? 'Error al registrarse. Intenta nuevamente.');
    } else {
      setExito(true);
      // Supabase envía email de confirmación — informar al usuario
      mostrarToast('¡Cuenta creada! Revisa tu correo para confirmarla.', 'exito');
      setTimeout(() => {
        setExito(false);
        cerrarModalesAuth();
      }, 3000);
    }
  }

  return (
    <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200" id="modal-registro">
      <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar" id="registro-contenido">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => cerrarModalesAuth()}>
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Crea tu Cuenta</h3>

        {exito ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-circle-check text-green-400 text-5xl mb-4"></i>
            <p className="text-white font-bold text-lg">¡Cuenta creada!</p>
            <p className="text-slate-400 text-sm mt-2">Revisa tu correo para confirmar tu cuenta antes de ingresar.</p>
          </div>
        ) : (
          <form className="space-y-4" id="formulario-registro" onSubmit={manejarRegistro}>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Nombres</label>
              <input ref={nombreRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-nombre" required type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Apellidos</label>
              <input ref={apellidoRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-apellido" required type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">DNI (Documento de Identidad)</label>
              <input ref={dniRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-dni" maxLength={8} pattern="[0-9]{8}" required type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Celular <span className="text-slate-500 text-xs">(9 dígitos, empieza con 9)</span></label>
              <input ref={celularRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-celular" maxLength={9} pattern="9[0-9]{8}" type="text" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Correo Electrónico</label>
              <input ref={correoRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-correo" required type="email" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Contraseña <span className="text-slate-500 text-xs">(mínimo 6 caracteres)</span></label>
              <input ref={contraRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-contrasena" required type="password" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Fecha de Nacimiento <span className="text-xs text-slate-500">(mayor de 18 años)</span>
              </label>
              <input ref={fechaRef} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="reg-fecha-nacimiento" required type="date" />
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input ref={privacidadRef} className="mt-0.5 accent-brand-blue w-4 h-4 flex-shrink-0" id="check-privacidad-registro" type="checkbox" />
              <span>
                Acepto las{' '}
                <a className="text-brand-yellow hover:underline" href="#" onClick={(e) => { abrirModalLegal('privacidad'); e.preventDefault(); }}>
                  Políticas de Privacidad
                </a>{' '}
                (Ley N° 29733).
              </span>
            </label>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              className="w-full bg-brand-yellow hover:bg-yellow-400 disabled:opacity-60 text-black py-3 rounded-xl font-bold transition-colors mt-4 flex items-center justify-center gap-2"
              type="submit" disabled={cargando}
            >
              {cargando ? <><i className="fa-solid fa-spinner fa-spin"></i> Registrando...</> : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ---------- Modal Perfil ----------

export function ModalPerfil() {
  const { usuario, socio } = useSesion();

  // Formatear fecha de nacimiento
  const fechaNac = socio?.fecha_nacimiento
    ? new Date(socio.fecha_nacimiento + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  return (
    <div className="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200" id="modal-perfil">
      <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-200" id="perfil-contenido">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => cerrarModalPerfil()}>
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-dark-900 border-2 border-brand-blue flex items-center justify-center mb-3">
            <i className="fa-solid fa-user text-brand-yellow text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white">Mi Perfil</h3>
        </div>
        <div className="bg-dark-900 rounded-xl p-4 mb-6 space-y-2 border border-white/5">
          <p className="text-slate-400 text-xs uppercase font-bold">Nombre</p>
          <p className="text-white font-semibold mb-2" id="perfil-nombre">
            {usuario ? `${usuario.nombre} ${usuario.apellido}` : '—'}
          </p>
          <p className="text-slate-400 text-xs uppercase font-bold">Correo</p>
          <p className="text-white font-semibold" id="perfil-correo">
            {usuario?.correo ?? '—'}
          </p>
          <p className="text-slate-400 text-xs uppercase font-bold mt-2">Fecha de Nacimiento</p>
          <p className="text-white font-semibold" id="perfil-nacimiento">{fechaNac}</p>
        </div>

        {/* Bloque de socio: solo visible si tiene datos de socio */}
        {socio && (
          <div id="perfil-bloque-socio">
            <div className="flex items-center justify-between bg-dark-900/60 rounded-xl px-4 py-2 mb-3 border border-white/5">
              <span className="text-slate-400 text-xs font-mono" id="perfil-codigo-socio">
                {socio.codigo_socio}
              </span>
              <button
                className="text-slate-400 hover:text-brand-yellow transition-colors text-sm"
                title="Copiar código de socio"
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(socio.codigo_socio);
                  mostrarToast('Código copiado al portapapeles.', 'exito');
                }}
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>
            <button
              className="w-full bg-dark-900 hover:bg-dark-700 rounded-xl p-4 mb-6 border border-white/5 flex items-center justify-between transition-colors text-left"
              onClick={() => { cerrarModalPerfil(); intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), 'vista-beneficios')); }}
            >
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Socio Náutica — {socio.nombre_nivel}</p>
                <p className="text-brand-yellow font-bold" id="perfil-puntos-resumen">{socio.puntos} puntos</p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-500"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Modal Carnet Socio ----------

// Mapa de colores por nivel
const COLORES_NIVEL: Record<string, string> = {
  Bronce: '#CD7F32',
  Plata:  '#C0C0C0',
  Oro:    '#FFD700',
};

export function ModalCarnetSocio() {
  const { usuario, socio } = useSesion();
  const color = COLORES_NIVEL[socio?.nombre_nivel ?? 'Bronce'] ?? '#CD7F32';

  return (
    <div
      className="hidden fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 opacity-0 transition-opacity duration-200"
      id="modal-carnet-socio"
      onClick={(e) => { if (e.target === e.currentTarget) cerrarCarnetSocio(); }}
    >
      <button aria-label="Cerrar carnet" className="absolute top-4 right-4 text-slate-300 hover:text-white text-3xl" type="button" onClick={() => cerrarCarnetSocio()}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <div
        className="w-full max-w-md rounded-3xl border-2 bg-gradient-to-br from-dark-700 to-dark-900 overflow-hidden text-center shadow-2xl transform scale-95 transition-transform duration-200"
        id="carnet-socio-tarjeta"
        style={{ borderColor: color }}
      >
        <div className="h-3 w-full" id="carnet-socio-franja" style={{ background: color }}></div>
        <div className="p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 flex items-center justify-center bg-brand-blue rounded-lg">
              <i className="fa-solid fa-film text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">CINE<span className="text-brand-blue">NÁUTICA</span></span>
          </div>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Socio Náutica</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 break-words" id="carnet-socio-nombre">
            {usuario ? `${usuario.nombre} ${usuario.apellido}` : '—'}
          </h2>
          <span
            className="inline-block px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6"
            id="carnet-socio-nivel"
            style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {socio?.nombre_nivel ?? 'Bronce'}
          </span>
          <div className="bg-black/40 rounded-2xl py-6 px-2 mb-6 border border-white/10">
            <p className="text-slate-400 text-xs uppercase font-bold mb-2">Código de socio</p>
            <p className="font-mono text-4xl md:text-5xl font-bold tracking-widest text-white break-all" id="carnet-socio-codigo">
              {socio?.codigo_socio ?? '—'}
            </p>
          </div>
          <p className="text-slate-400 text-xs uppercase font-bold">Puntos disponibles</p>
          <p className="text-5xl font-bold text-brand-yellow" id="carnet-socio-puntos">{socio?.puntos ?? 0}</p>
          <p className="text-slate-500 text-xs mt-6">Muestra esta pantalla en counter para que te identifiquen, canjeen tus puntos y validen tus beneficios.</p>
        </div>
      </div>
    </div>
  );
}
