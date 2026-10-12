"use client";

import { abrirModalLegal } from "@/src/lib/ui/cliente";
import { cambiarVista, vistaActual } from "@/src/lib/ui/nav";

export default function Footer() {
  return (
    <>
      <footer className="bg-black py-12 border-t border-white/10 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold tracking-tighter text-white mb-4 block">
              CINE
              <span className="text-brand-blue">
                NÁUTICA
              </span>
            </span>
            {" "}
            <p className="text-slate-400 text-sm">
              Tu mejor experiencia de cine en Chimbote. Disfruta de la mejor cartelera y dulcería con nosotros.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">
              Nosotros
            </h4>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>
                <a className="hover:text-brand-yellow transition-colors" href="#" onClick={(event) => { abrirModalLegal('quienes-somos'); event.preventDefault(); }}>
                  ¿Quiénes somos?
                </a>
              </li>
              <li id="link-footer-socio">
                <a className="hover:text-brand-yellow transition-colors" href="#" onClick={(event) => { cambiarVista(vistaActual(), 'vista-beneficios'); event.preventDefault(); }}>
                  Socio Náutica
                </a>
              </li>
              <li>
                <a className="hover:text-brand-yellow transition-colors" href="#" onClick={(event) => { abrirModalLegal('trabaja-con-nosotros'); event.preventDefault(); }}>
                  Trabaja con nosotros
                </a>
              </li>
              <li>
                <a className="hover:text-brand-yellow transition-colors" href="/acceso">
                  <i className="fa-solid fa-lock text-[10px] mr-1"></i>
                  Acceso personal
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">
              Legales
            </h4>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>
                <a className="hover:text-brand-yellow transition-colors" href="#" onClick={(event) => { abrirModalLegal('terminos'); event.preventDefault(); }}>
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a className="hover:text-brand-yellow transition-colors" href="#" onClick={(event) => { abrirModalLegal('privacidad'); event.preventDefault(); }}>
                  Políticas de Privacidad
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-white hover:bg-brand-blue transition-all" href="#" target="_blank">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              {" "}
              <a className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-white hover:bg-brand-blue transition-all" href="https://www.instagram.com/megaplazaoficial/?hl=es" target="_blank">
                <i className="fa-brands fa-instagram"></i>
              </a>
              {" "}
              <a className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-white hover:bg-brand-blue transition-all" href="https://www.tiktok.com/@megaplazaoficial?lang=es" target="_blank">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
