"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/cliente";

type RolPersonalSel =
  | "admin_general"
  | "admin_sede"
  | "counter_boleteria"
  | "counter_dulceria"
  | "counter_mixto";

interface ModalEstado {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  tipo: "error" | "alerta";
  esCliente?: boolean;
}

export default function AccesoPage() {
  const router = useRouter();

  // Estados del formulario
  const [rolSel, setRolSel] = useState<RolPersonalSel>("counter_boleteria");
  const [correo, setCorreo] = useState("boleteria@cinenautica.pe");
  const [password, setPassword] = useState("Cinenautica2026!");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estado del Modal Emergente de Error / Seguridad
  const [modal, setModal] = useState<ModalEstado>({
    abierto: false,
    titulo: "",
    mensaje: "",
    tipo: "error",
  });

  // Botones de selección rápida (atajos de prueba para desarrollo)
  const cambiarRol = (rol: RolPersonalSel) => {
    setRolSel(rol);
    const correosDemo: Record<RolPersonalSel, string> = {
      admin_general: "admin@cinenautica.pe",
      admin_sede: "sede@cinenautica.pe",
      counter_boleteria: "boleteria@cinenautica.pe",
      counter_dulceria: "dulceria@cinenautica.pe",
      counter_mixto: "mixto@cinenautica.pe",
    };

    setCorreo(correosDemo[rol]);
    setPassword("Cinenautica2026!");
  };

  // Enviar formulario con manejo controlado de errores sin romper Turbopack
  const ingresar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      const correoLimpio = correo.trim().toLowerCase();

      // 1. Autenticación con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: correoLimpio,
        password: password,
      });

      // Manejo controlado de credenciales incorrectas (sin lanzar throw ni console.error)
      if (authError || !authData.user) {
        setCargando(false);
        setModal({
          abierto: true,
          titulo: "Credenciales Incorrectas",
          mensaje:
            "El correo o la contraseña ingresada no coinciden con ningún colaborador corporativo registrado. Por favor verifica tus credenciales e intenta nuevamente.",
          tipo: "error",
        });
        return;
      }

      // 2. Consultar perfil en tabla 'usuario' con su rol asignado
      let { data: usuarioData } = await supabase
        .from("usuario")
        .select("id_usuario, nombre, apellido, correo, activo, rol:id_rol (id_rol, codigo, nombre_rol)")
        .eq("id_usuario", authData.user.id)
        .maybeSingle();

      if (!usuarioData) {
        const { data: usuarioPorCorreo } = await supabase
          .from("usuario")
          .select("id_usuario, nombre, apellido, correo, activo, rol:id_rol (id_rol, codigo, nombre_rol)")
          .eq("correo", correoLimpio)
          .maybeSingle();

        usuarioData = usuarioPorCorreo;
      }

      if (!usuarioData) {
        await supabase.auth.signOut();
        setCargando(false);
        setModal({
          abierto: true,
          titulo: "Colaborador No Encontrado",
          mensaje:
            "No se encontró la ficha de personal asociada a este usuario en la base de datos.",
          tipo: "error",
        });
        return;
      }

      // 3. SEGURIDAD: Validar cuenta activa
      if (usuarioData.activo === false) {
        await supabase.auth.signOut();
        setCargando(false);
        setModal({
          abierto: true,
          titulo: "Cuenta Deshabilitada",
          mensaje:
            "Tu cuenta corporativa se encuentra inactiva. Comunícate con el Administrador General para solicitar la reactivación de tu acceso.",
          tipo: "error",
        });
        return;
      }

      const rolCodigo = (usuarioData.rol as any)?.codigo || "cliente";

      // 4. SEGURIDAD: Bloquear acceso si es una cuenta de cliente
      if (rolCodigo === "cliente") {
        await supabase.auth.signOut();
        setCargando(false);
        setModal({
          abierto: true,
          titulo: "Acceso Exclusivo para Colaboradores",
          mensaje:
            "Esta puerta de acceso es exclusivamente para el personal corporativo de Cine Náutica. Si deseas consultar tus puntos de Socio o adquirir entradas, ingresa desde la web pública.",
          tipo: "alerta",
          esCliente: true,
        });
        return;
      }

      // 5. Guardar sesión y datos operativos en localStorage para carga instantánea
      try {
        localStorage.setItem("cinenautica_rol_personal", rolCodigo);
        localStorage.setItem("cinenautica_usuario_id", usuarioData.id_usuario);
        const nombreDisplay = `${usuarioData.nombre || ""} ${usuarioData.apellido || ""}`.trim() || usuarioData.correo;
        localStorage.setItem("cinenautica_usuario_nombre", nombreDisplay);
      } catch {}

      // 6. Redirecciones seguras según rol corporativo
      const DESTINOS: Record<string, string> = {
        admin_general: "/admin_general",
        admin_sede: "/counter", // Hub de Admin de Sede
        counter_boleteria: "/counter/boleteria",
        counter_dulceria: "/counter/dulceria",
        counter_mixto: "/counter/mixto",
      };

      const rutaDestino = DESTINOS[rolCodigo] || "/counter";
      router.push(rutaDestino);
    } catch {
      setCargando(false);
      setModal({
        abierto: true,
        titulo: "Error de Conexión",
        mensaje:
          "Ocurrió un problema de comunicación con el servidor de autenticación. Intenta de nuevo en unos segundos.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-950 text-white flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Fondo ambiental oscuro con suave degradado azul Cine Náutica */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.18),rgba(10,15,30,0))] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Contenedor Centrado */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Cabecera Centrada: Logo y Marca */}
        <div className="text-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-4 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/5"
          >
            <i className="fa-solid fa-arrow-left text-[11px]"></i>
            <span>Volver al sitio público</span>
          </button>

          <div className="flex justify-center mb-3">
            <img
              src="/img/logo/logocinenautica.png"
              className="h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              alt="Logo Cine Náutica"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1 text-white">
            CINE<span className="text-brand-blue">NÁUTICA</span>
          </h1>
          <p className="text-xs text-slate-400">Portal Corporativo · Acceso de Personal</p>
        </div>

        {/* Tarjeta del Formulario (Glassmorphism centrado) */}
        <div className="bg-dark-900/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <form id="form-acceso" onSubmit={ingresar} className="space-y-4">
            {/* Campo Correo */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Correo Corporativo
              </label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="username"
                  placeholder="usuario@cinenautica.pe"
                  className="w-full bg-dark-800/90 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11 text-sm font-mono transition-colors"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Contraseña
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Dev: Cinenautica2026!</span>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-dark-800/90 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11 pr-11 text-sm font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <i className={`fa-solid ${mostrarPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                </button>
              </div>
            </div>

            {/* Atajos Rápidos de Cuentas (Dev Shortcuts) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Atajos de Prueba <span className="text-brand-yellow font-normal">(Auto-llenado)</span>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => cambiarRol("counter_boleteria")}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    rolSel === "counter_boleteria"
                      ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "bg-dark-800/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <i className="fa-solid fa-ticket block text-blue-400 mb-1 text-sm"></i>
                  <b className="block text-[11px]">Boletería</b>
                  <small className="text-[9px] text-slate-500">Taquilla</small>
                </button>

                <button
                  type="button"
                  onClick={() => cambiarRol("counter_dulceria")}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    rolSel === "counter_dulceria"
                      ? "bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "bg-dark-800/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <i className="fa-solid fa-bowl-food block text-amber-400 mb-1 text-sm"></i>
                  <b className="block text-[11px]">Dulcería</b>
                  <small className="text-[9px] text-slate-500">Snacks</small>
                </button>

                <button
                  type="button"
                  onClick={() => cambiarRol("counter_mixto")}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    rolSel === "counter_mixto"
                      ? "bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-dark-800/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <i className="fa-solid fa-cash-register block text-emerald-400 mb-1 text-sm"></i>
                  <b className="block text-[11px]">Mixto</b>
                  <small className="text-[9px] text-slate-500">Integral</small>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cambiarRol("admin_sede")}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    rolSel === "admin_sede"
                      ? "bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/20"
                      : "bg-dark-800/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <i className="fa-solid fa-store block text-purple-400 mb-1 text-sm"></i>
                  <b className="block text-[11px]">Admin Sede</b>
                  <small className="text-[9px] text-slate-500">Hub / Cajas</small>
                </button>

                <button
                  type="button"
                  onClick={() => cambiarRol("admin_general")}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    rolSel === "admin_general"
                      ? "bg-yellow-600/20 border-yellow-500 text-white shadow-md shadow-yellow-500/20"
                      : "bg-dark-800/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <i className="fa-solid fa-crown block text-yellow-400 mb-1 text-sm"></i>
                  <b className="block text-[11px]">Admin General</b>
                  <small className="text-[9px] text-slate-500">Global</small>
                </button>
              </div>
            </div>

            {/* Botón de Ingreso */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-brand-yellow hover:bg-yellow-400 disabled:opacity-50 text-black py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-yellow-500/20 mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              {cargando ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-base"></i>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer simple centrado */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          © 2026 Cine Náutica · Sistema Operativo Interno
        </p>
      </div>

      {/* ── MODAL EMERGENTE DE ERROR / ALERTA DE SEGURIDAD ── */}
      {modal.abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-dark-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl shadow-black relative transform scale-100 transition-transform">
            {/* Ícono animado */}
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 ${
                modal.tipo === "error"
                  ? "bg-red-500/10 text-brand-red border border-red-500/30"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              }`}
            >
              <i
                className={`fa-solid ${
                  modal.tipo === "error" ? "fa-circle-xmark" : "fa-shield-halved"
                }`}
              ></i>
            </div>

            <h3 className="text-xl font-black text-white mb-2 tracking-tight">
              {modal.titulo}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {modal.mensaje}
            </p>

            <div className="flex flex-col gap-2.5">
              {modal.esCliente ? (
                <>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full bg-brand-blue hover:bg-sky-400 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ir a la web principal</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ ...modal, abierto: false })}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold py-2.5 rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setModal({ ...modal, abierto: false })}
                  className="w-full bg-brand-yellow hover:bg-yellow-400 text-black font-black py-3 rounded-2xl text-xs transition-colors shadow-lg shadow-yellow-500/20 cursor-pointer"
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}