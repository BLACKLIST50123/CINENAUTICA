"use client";

import { S, cambiarVista, manejarFormularioContacto } from "@/src/lib/ui/nav";

export default function Contacto() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-32" id="vista-contacto">
        <div className="max-w-lg mx-auto px-6">
          <button className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors w-max" onClick={(event) => { cambiarVista('vista-contacto', S.contactoPrev); }}>
            <i className="fa-solid fa-arrow-left"></i>
            {" "}
            Volver
          </button>
          {" "}
          <div className="bg-dark-800 p-8 rounded-2xl border border-white/10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              Contáctenos
            </h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              Escríbenos y te responderemos a la brevedad.
            </p>
            <form className="space-y-4" id="formulario-contacto" onSubmit={(event) => { manejarFormularioContacto(event); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Nombres
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="contacto-nombres" type="text" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Apellidos
                  </label>
                  {" "}
                  <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="contacto-apellidos" type="text" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  Correo Electrónico
                </label>
                {" "}
                <input className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="contacto-correo" type="email" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  Distrito
                </label>
                {" "}
                <select className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue" id="contacto-distrito">
                  <option value="">
                    Selecciona tu distrito
                  </option>
                  <option value="Chimbote">
                    Chimbote
                  </option>
                  <option value="Nuevo Chimbote">
                    Nuevo Chimbote
                  </option>
                  <option value="Coishco">
                    Coishco
                  </option>
                  <option value="Santa">
                    Santa
                  </option>
                  <option value="Otro">
                    Otro
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  Mensaje
                </label>
                {" "}
                <textarea className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-blue resize-none" id="contacto-mensaje" rows={4} />
              </div>
              {" "}
              <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-3 rounded-xl font-bold transition-colors mt-2" type="submit">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
