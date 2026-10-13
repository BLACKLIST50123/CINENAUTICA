"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccesoPage() {
    // Estado para controlar el rol seleccionado
    const [rolSel, setRolSel] = useState<"admin_general" | "admin_sede" | "counter">("admin_sede");
    const router = useRouter();

    // Función tipada que maneja el envío del formulario
    const ingresar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Diccionario de rutas según el rol
        const DESTINO = {
            admin_general: "/admin_general",
            admin_sede: "/admin_sede",
            counter: "/counter",
        };

        // En un proyecto real aquí validarías con Supabase Auth antes de redirigir
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
                        Gestiona sedes, cartelera, ventas en el local y todo lo que mueve a Cine Náutica.
                    </p>
                    <div className="space-y-4 text-sm text-slate-300">
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-crown text-purple-300 w-5"></i>Admin General  — visión global de todas las sedes
                        </p>
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-store text-brand-yellow w-5"></i>Admin de sede — programación, salas y equipo local
                        </p>
                        <p className="flex items-center gap-3">
                            <i className="fa-solid fa-cash-register text-green-300 w-5"></i>Counter — punto de venta en el cine
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
                                    autoComplete="username"
                                    placeholder="correo@cinenautica.pe"
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11"
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
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow pl-11"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[11px] text-slate-500">
                                    Rol <span className="text-slate-600">(solo demostración)</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRolSel('admin_general')}
                                    className={`rol-opcion ${rolSel === 'admin_general' ? 'activo' : ''}`}
                                >
                                    <i className="fa-solid fa-crown"></i>
                                    <b>Admin General</b>
                                    <small>Global</small>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRolSel('admin_sede')}
                                    className={`rol-opcion ${rolSel === 'admin_sede' ? 'activo' : ''}`}
                                >
                                    <i className="fa-solid fa-store"></i>
                                    <b>Admin de sede</b>
                                    <small>Una sede</small>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRolSel('counter')}
                                    className={`rol-opcion ${rolSel === 'counter' ? 'activo' : ''}`}
                                >
                                    <i className="fa-solid fa-cash-register"></i>
                                    <b>Counter</b>
                                    <small>Ventas en local</small>
                                </button>
                            </div>
                        </div>

                        {/* Renderizado condicional (Reemplaza a style="display: none") */}
                        {rolSel !== 'admin_general' && (
                            <div id="campo-sede">
                                <label className="text-[11px] text-slate-500 mb-1 block">
                                    Sede asignada <span className="text-slate-600">(demostración)</span>
                                </label>
                                <select className="filtro-select !pl-4 w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white">
                                    <option value="s1">Náutica Megaplaza — Chimbote</option>
                                    <option value="s2">Náutica Costa Azul — Chimbote</option>
                                    <option value="s3">Náutica Nuevo Chimbote — Nuevo Chimbote</option>
                                    <option value="s4">Náutica Trujillo Centro — Trujillo</option>
                                    <option value="s5">Náutica Mall Trujillo — Trujillo</option>
                                    <option value="s6">Náutica Lima Norte — Lima Metropolitana</option>
                                    <option value="s7">Náutica Miraflores — Lima Metropolitana</option>
                                    <option value="s8">Náutica San Miguel — Lima Metropolitana</option>
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-yellow-500/20 mt-2"
                        >
                            Ingresar <i className="fa-solid fa-arrow-right ml-1"></i>
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}