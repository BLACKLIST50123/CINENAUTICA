"use client"; // Le decimos a Next.js que este componente usará interactividad (clics, estados)

import { useState } from "react";
import Link from "next/link"; // <-- ¡NUEVO CONCEPTO!

export default function Navbar() {
    // useState es la forma en que React "recuerda" cosas. 
    // Aquí recordamos si el menú del celular está abierto (true) o cerrado (false).
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent py-4 px-6 md:px-12 flex justify-between items-center">
            {/* 
        En P-Nativo usabas <a href="..."> para navegar. 
        En Next.js usamos <Link href="...">. Esto hace que la página cambie AL INSTANTE
        sin recargar el navegador (como si fuera una app de celular).
      */}
            <Link href="/" className="flex items-center gap-2 group">
                <img alt="Logo" className="h-12 w-auto object-contain drop-shadow-md" src="/img/logo/logocinenautica.png" />
                <span className="text-2xl font-bold tracking-tighter text-white">
                    CINE<span className="text-brand-blue">NÁUTICA</span>
                </span>
            </Link>

            {/* Menú de PC */}
            <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
                <Link href="/" className="text-white hover:text-brand-yellow transition-colors">Inicio</Link>
                <Link href="/promociones" className="text-white hover:text-brand-yellow transition-colors">Promociones</Link>
                <Link href="/dulceria" className="text-white hover:text-brand-yellow transition-colors">Dulcería</Link>
                <Link href="/socio" className="drop-shadow-[0_0_8px_rgba(252,194,82,0.8)] text-white hover:text-brand-yellow transition-colors font-bold">
                    Socio Náutica
                </Link>
            </nav>

            {/* Botones de Login */}
            <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-4">
                    {/* Por ahora estos botones no hacen nada, luego les daremos vida */}
                    <button className="text-white hover:text-brand-yellow transition-colors font-semibold text-sm">
                        Ingresar
                    </button>
                    <button className="bg-brand-blue hover:bg-brand-dark-blue text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">
                        Únete
                    </button>
                </div>
            </div>

            {/* Botón Menú Móvil (Hamburguesa) */}
            <button
                className="md:hidden text-white text-2xl focus:outline-none"
                onClick={() => setMenuMovilAbierto(!menuMovilAbierto)} // Al hacer clic, cambiamos el estado al revés de lo que estaba
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            {/* 
        Drawer (Menú lateral de móvil). 
        En P-Nativo usabas JS para cambiar clases. Aquí en React usamos un operador ternario:
        Si menuMovilAbierto es TRUE, le ponemos la clase "translate-x-0" (visible). 
        Si es FALSE, "translate-x-full" (escondido).
      */}
            <aside className={`fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-dark-800 border-l border-white/10 z-[60] shadow-2xl transform transition-transform duration-300 flex flex-col ${menuMovilAbierto ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <span className="text-xl font-bold tracking-tighter text-white">
                        CINE<span className="text-brand-blue">NÁUTICA</span>
                    </span>
                    <button className="text-slate-400 hover:text-white text-xl" onClick={() => setMenuMovilAbierto(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <nav className="flex flex-col p-6 gap-1 font-semibold text-white overflow-y-auto">
                    <Link href="/" className="py-3 border-b border-white/5 hover:text-brand-yellow transition-colors" onClick={() => setMenuMovilAbierto(false)}>
                        <i className="fa-solid fa-house w-6"></i> Inicio
                    </Link>
                    <Link href="/dulceria" className="py-3 border-b border-white/5 hover:text-brand-yellow transition-colors" onClick={() => setMenuMovilAbierto(false)}>
                        <i className="fa-solid fa-bowl-food w-6"></i> Dulcería
                    </Link>
                </nav>
            </aside>

            {/* Fondo oscuro cuando el menú móvil está abierto */}
            {menuMovilAbierto && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[55]" onClick={() => setMenuMovilAbierto(false)}></div>
            )}
        </header>
    );
}