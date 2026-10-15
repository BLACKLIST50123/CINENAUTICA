"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccesoPage() {
    // Estado para controlar el rol seleccionado
    const [rolSel, setRolSel] = useState<
        "admin_general" | "admin_sede" | "counter_boleteria" | "counter_dulceria" | "counter_mixto"
    >("counter_boleteria");
    const [correo, setCorreo] = useState("boleteria@cinenautica.pe");
    const [password, setPassword] = useState("••••••••");
    const router = useRouter();

    const cambiarRol = (rol: typeof rolSel) => {
        setRolSel(rol);
        const correosDemo: Record<typeof rolSel, string> = {
            admin_general: "admin@cinenautica.pe",
            admin_sede: "sede@cinenautica.pe",
            counter_boleteria: "boleteria@cinenautica.pe",
            counter_dulceria: "dulceria@cinenautica.pe",
            counter_mixto: "mixto@cinenautica.pe",
        };
        setCorreo(correosDemo[rol]);
    };

    // Función que maneja el envío del formulario
    const ingresar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Diccionario de rutas según el rol
        const DESTINO: Record<typeof rolSel, string> = {
            admin_general: "/admin_general",
            admin_sede: "/admin_sede",
            counter_boleteria: "/counter/boleteria",
            counter_dulceria: "/counter/dulceria",
            counter_mixto: "/counter/mixto",
        };

        try {
            localStorage.setItem("cinenautica_rol_personal", rolSel);
        } catch {}

        router.push(DESTINO[rolSel]);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* SECCIÓN IZQUIERDA (Banner) */}
            <section className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: "url('https://images7.alphacoders.com/141/thumb-1920-1411911.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-900/85 to-brand-blue/30"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <img src="/img/logo/logocinenautica.png" className="h-12" alt="Logo" />
                    <span className="text-2xl font-bold tracking-tighter">
                        CINE<span className="text-brand-blue">NÁUTICA</span>
                    </span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-5xl font-bold leading-tight mb-5">
                        Portal del <span className="text-brand-yellow">personal</span>
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">
                        Gestiona sedes, cartelera, ventas en ventanilla y todo lo que mueve a Cine Náutica.
                    </p>
                    <div className="space-y-4 text-sm text-slate-300">
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-crown text-purple-300 w-5"></i>Admin General — visión global de todas las sedes
                        </p>
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-store text-brand-yellow w-5"></i>Admin de Sede — hub de supervisión y gestión local
                        </p>
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-ticket text-blue-400 w-5"></i>Boletería — emisión de entradas y sala
                        </p>
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-bowl-food text-amber-400 w-5"></i>Dulcería — despacho de snacks y combos
                        </p>
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-cash-register text-green-300 w-5"></i>Caja Mixta — punto de venta integral
                        </p>
                    </div>
                </div>
                <p className="relative z-10 text-xs text-slate-500">© 2026 Cine Náutica · Uso interno</p>
            </section>

            {/* SECCIÓN DERECHA (Formulario) */}
            <section className="flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md fade-in">
                    <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-8">
                        <i className="fa-solid fa-arrow-left"></i> Volver al sitio
                    </button>

                    <h2 className="text-3xl font-bold mb-1">Acceso del personal</h2>
                    <p className="text-slate-400 text-sm mb-8">
                        Ingresa con tu cuenta corporativa. Te llevaremos a tu pantalla según tu rol.
                    </p>

                    <form id="form-acceso" onSubmit={ingresar} className="space-y-4">
                        <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">Correo</label>
                            <div className="relative">
                                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                                <input
                                    type="email"
                                    required
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    autoComplete="username"
                                    placeholder="correo@cinenautica.pe"
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11 text-sm font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-500 mb-1 block">Contraseña</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11 text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* SELECTOR DE ROL PARA DEMOSTRACIÓN */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    Rol Corporativo <span className="text-brand-yellow font-normal">(Selección Rápida)</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => cambiarRol('counter_boleteria')}
                                    className={`p-2.5 rounded-xl border text-center transition-all ${
                                        rolSel === 'counter_boleteria'
                                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-dark-900 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fa-solid fa-ticket block text-blue-400 mb-1 text-base"></i>
                                    <b className="block text-xs">Boletería</b>
                                    <small className="text-[10px] text-slate-500">Taquilla</small>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => cambiarRol('counter_dulceria')}
                                    className={`p-2.5 rounded-xl border text-center transition-all ${
                                        rolSel === 'counter_dulceria'
                                            ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                                            : 'bg-dark-900 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fa-solid fa-bowl-food block text-amber-400 mb-1 text-base"></i>
                                    <b className="block text-xs">Dulcería</b>
                                    <small className="text-[10px] text-slate-500">Confitería</small>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => cambiarRol('counter_mixto')}
                                    className={`p-2.5 rounded-xl border text-center transition-all ${
                                        rolSel === 'counter_mixto'
                                            ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-dark-900 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fa-solid fa-cash-register block text-emerald-400 mb-1 text-base"></i>
                                    <b className="block text-xs">Caja Mixta</b>
                                    <small className="text-[10px] text-slate-500">Integral</small>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => cambiarRol('admin_sede')}
                                    className={`p-2.5 rounded-xl border text-center transition-all ${
                                        rolSel === 'admin_sede'
                                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-dark-900 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fa-solid fa-store block text-purple-400 mb-1 text-base"></i>
                                    <b className="block text-xs">Admin Sede</b>
                                    <small className="text-[10px] text-slate-500">Supervisión</small>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => cambiarRol('admin_general')}
                                    className={`p-2.5 rounded-xl border text-center transition-all col-span-2 sm:col-span-1 ${
                                        rolSel === 'admin_general'
                                            ? 'bg-yellow-600/20 border-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                                            : 'bg-dark-900 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fa-solid fa-crown block text-yellow-400 mb-1 text-base"></i>
                                    <b className="block text-xs">Admin General</b>
                                    <small className="text-[10px] text-slate-500">Global</small>
                                </button>
                            </div>
                        </div>

                        {rolSel !== 'admin_general' && (
                            <div id="campo-sede">
                                <label className="text-[11px] text-slate-500 mb-1 block">
                                    Sede de Operación
                                </label>
                                <select className="filtro-select !pl-4 w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs">
                                    <option value="1">CineNáutica Chimbote — Megaplaza</option>
                                    <option value="2">CineNáutica Costa Azul — Chimbote</option>
                                    <option value="3">CineNáutica Nuevo Chimbote — Plaza Mayor</option>
                                    <option value="6">CineNáutica Lima Norte — Lima</option>
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg shadow-yellow-500/20 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Ingresar al Sistema</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}