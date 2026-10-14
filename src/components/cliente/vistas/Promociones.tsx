"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CuponDao } from "@/src/daos/CuponDao";
import type { CuponDTO } from "@/src/dtos/orden";
import { useSesion } from "@/src/context/SesionContext";
import { mostrarToast, abrirModalRegistro } from "@/src/lib/ui/common";

export default function Promociones() {
  const router = useRouter();
  const { esSocio } = useSesion();

  const [cupones, setCupones] = useState<CuponDTO[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cuponCopiado, setCuponCopiado] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarCupones() {
      try {
        const res = await CuponDao.obtenerCuponesActivos();
        if (activo) setCupones(res);
      } catch (e) {
        console.error("Error al cargar promociones y cupones:", e);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarCupones();

    return () => {
      activo = false;
    };
  }, []);

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCuponCopiado(codigo);
    mostrarToast(`¡Código ${codigo} copiado al portapapeles!`, "exito");
    setTimeout(() => {
      setCuponCopiado(null);
    }, 2500);
  };

  return (
    <div
      className="w-full bg-dark-900 min-h-screen pb-32 transition-opacity duration-300 relative z-10 pt-20"
      id="vista-promociones"
    >
      {/* Hero de Promociones */}
      <section className="relative py-16 px-6 md:px-12 text-center overflow-hidden bg-gradient-to-b from-brand-blue/20 via-dark-900 to-dark-900 border-b border-white/5">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-brand-blue/20 text-brand-blue border border-brand-blue/30 text-xs font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-sparkles"></i>
            Ofertas y Beneficios
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-3 tracking-tight">
            Promociones <span className="text-brand-yellow">CineNáutica</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto">
            Disfruta del mejor cine con descuentos exclusivos en entradas, combos de dulcería y cupones de temporada.
          </p>
        </div>
      </section>

      {/* Grid de Promociones */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="grid-promociones">
          {/* Card Especial: Beneficio Socio */}
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-brand-yellow/30 rounded-3xl overflow-hidden shadow-2xl hover:border-brand-yellow/60 transition-all flex flex-col group">
            <div className="h-40 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent flex items-center justify-center relative overflow-hidden border-b border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-yellow/20 via-transparent to-transparent"></div>
              <i className="fa-solid fa-crown text-6xl text-brand-yellow drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:scale-110 transition-transform"></i>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="inline-block w-max px-3 py-1 bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30 text-xs font-bold rounded-full uppercase mb-3">
                Programa de Lealtad
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Beneficios Exclusivos Socio Náutica
              </h3>
              <p className="text-slate-400 text-sm flex-grow mb-4 leading-relaxed">
                Acumula puntos en cada compra de entradas y combos, canjéalos por descuentos, entra en filas preferenciales y recibe una entrada gratis por tu cumpleaños.
              </p>
              {esSocio ? (
                <button
                  type="button"
                  onClick={() => router.push("/socio")}
                  className="w-full bg-brand-yellow hover:bg-yellow-400 text-dark-900 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-id-card"></i>
                  Ver Mi Perfil Socio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => abrirModalRegistro()}
                  className="w-full bg-brand-yellow hover:bg-yellow-400 text-dark-900 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  Únete Gratis a Socio Náutica
                </button>
              )}
            </div>
          </div>

          {/* Cupones cargados desde Supabase */}
          {cargando ? (
            [1, 2].map((n) => (
              <div
                key={n}
                className="bg-dark-800 rounded-3xl border border-white/5 p-6 animate-pulse h-80 flex flex-col justify-between"
              >
                <div className="h-32 bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-white/10 rounded-xl"></div>
              </div>
            ))
          ) : (
            cupones.map((cup) => {
              const esPorcentaje = cup.tipo_descuento === "Porcentaje";
              const textoDescuento = esPorcentaje
                ? `${cup.valor}% DCTO.`
                : `S/ ${cup.valor.toFixed(2)} DCTO.`;
              const copiado = cuponCopiado === cup.codigo;

              return (
                <div
                  key={cup.id_cupon}
                  className="bg-dark-800/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-brand-blue/50 transition-all flex flex-col group backdrop-blur-sm"
                >
                  <div className="h-40 bg-gradient-to-br from-brand-blue/20 via-blue-900/10 to-transparent flex items-center justify-center border-b border-white/5 relative">
                    <i className="fa-solid fa-ticket text-6xl text-brand-blue/70 group-hover:scale-110 transition-transform"></i>
                    <div className="absolute top-4 right-4 bg-brand-blue/20 border border-brand-blue/40 text-brand-blue font-extrabold text-xs px-2.5 py-1 rounded-full">
                      {textoDescuento}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-2.5 py-0.5 bg-brand-blue/15 text-brand-blue border border-brand-blue/30 text-[11px] font-bold rounded-lg uppercase">
                          Cupón Web
                        </span>
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-[10px]"></i>
                          Vigente
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-wider font-mono mb-1">
                        {cup.codigo}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {cup.descripcion || `Aplica ${textoDescuento} en tu orden online.`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copiarCodigo(cup.codigo)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        copiado
                          ? "bg-emerald-500 text-white"
                          : "bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/30"
                      }`}
                    >
                      {copiado ? (
                        <>
                          <i className="fa-solid fa-check"></i>
                          ¡Código Copiado!
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-copy"></i>
                          Copiar Código
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
