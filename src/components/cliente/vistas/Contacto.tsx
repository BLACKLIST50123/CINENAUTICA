"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/src/context/SesionContext";
import { ContactoDao } from "@/src/daos/ContactoDao";
import { mostrarToast } from "@/src/lib/ui/common";

export default function Contacto() {
  const router = useRouter();
  const { usuario } = useSesion();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [distrito, setDistrito] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [enviadoExito, setEnviadoExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-completar datos si el usuario tiene sesión iniciada
  useEffect(() => {
    if (usuario) {
      if (usuario.nombre) setNombres(usuario.nombre);
      if (usuario.apellido) setApellidos(usuario.apellido);
      if (usuario.correo) setCorreo(usuario.correo);
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nombres.trim() || !apellidos.trim()) {
      setErrorMsg("Por favor, ingresa tus nombres y apellidos.");
      return;
    }

    if (!correo.trim() || !/^\S+@\S+\.\S+$/.test(correo)) {
      setErrorMsg("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!mensaje.trim() || mensaje.trim().length < 10) {
      setErrorMsg("Tu mensaje debe tener al menos 10 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      const res = await ContactoDao.enviarMensaje({
        nombres,
        apellidos,
        correo,
        distrito,
        mensaje,
      });

      if (!res.ok) {
        throw new Error(res.error || "No se pudo enviar el mensaje.");
      }

      setEnviadoExito(true);
      mostrarToast("¡Mensaje enviado con éxito! Nos comunicaremos contigo a la brevedad.", "exito");
      setMensaje("");
    } catch (err: any) {
      console.error("Error al enviar mensaje:", err);
      setErrorMsg(err.message || "Ocurrió un error al enviar tu mensaje. Inténtalo nuevamente.");
      mostrarToast("Error al enviar mensaje", "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 relative z-10 pt-28"
      id="vista-contacto"
    >
      <div className="max-w-xl mx-auto px-6">
        {/* Botón Volver */}
        <button
          type="button"
          className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Volver al Inicio
        </button>

        <div className="bg-dark-800/90 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 mx-auto flex items-center justify-center text-brand-blue text-2xl shadow-lg mb-4">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Centro de Atención
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              ¿Dudas con tu compra, entradas o beneficios socio? Escríbenos y te responderemos a la brevedad.
            </p>
          </div>

          {enviadoExito ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center text-3xl">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="text-xl font-bold text-white">
                ¡Mensaje recibido!
              </h3>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                Hemos registrado tu solicitud. Te enviaremos una respuesta a{" "}
                <span className="text-brand-yellow font-medium">{correo}</span> en menos de 24 horas.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setEnviadoExito(false)}
                  className="bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="bg-brand-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  Volver a la Cartelera
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation shrink-0"></i>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                    Nombres <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Ej. Juan"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                    Apellidos <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej. Pérez"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  Correo Electrónico <span className="text-brand-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  Distrito / Ciudad
                </label>
                <select
                  value={distrito}
                  onChange={(e) => setDistrito(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue transition-colors cursor-pointer"
                >
                  <option value="">Selecciona tu distrito o sede más cercana</option>
                  <option value="Chimbote">Chimbote (Megaplaza)</option>
                  <option value="Nuevo Chimbote">Nuevo Chimbote (Plaza Mayor)</option>
                  <option value="Lima">Lima (Jockey Plaza)</option>
                  <option value="Coishco">Coishco</option>
                  <option value="Santa">Santa</option>
                  <option value="Otro">Otro lugar</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  Mensaje o Consulta <span className="text-brand-red">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Detalla tu consulta, número de orden o inconveniente..."
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold transition-all mt-4 cursor-pointer shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Enviando mensaje...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          )}

          {/* Canales alternativos */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
            <div className="bg-dark-900/60 p-3 rounded-xl border border-white/5">
              <i className="fa-brands fa-whatsapp text-emerald-400 text-lg mb-1 block"></i>
              <span className="text-[11px] text-slate-400 block">WhatsApp Soporte</span>
              <span className="text-xs font-semibold text-white">+51 987 654 321</span>
            </div>
            <div className="bg-dark-900/60 p-3 rounded-xl border border-white/5">
              <i className="fa-solid fa-clock text-brand-yellow text-lg mb-1 block"></i>
              <span className="text-[11px] text-slate-400 block">Horario de Atención</span>
              <span className="text-xs font-semibold text-white">Lun - Dom 11:00 - 23:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
