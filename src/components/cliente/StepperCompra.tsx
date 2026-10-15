"use client";

/* Barra de progreso de la compra (antes pintarStepper() en cliente.js).
   Ahora se deduce de la ruta: /pelicula/* -> /asientos -> /dulceria -> /pago -> /ticket */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { S } from "@/src/lib/ui/nav";

const PASOS_PELICULA = [
  { ruta: "/pelicula", label: "Función", icono: "fa-clock" },
  { ruta: "/asientos", label: "Asientos", icono: "fa-chair" },
  { ruta: "/dulceria", label: "Dulcería", icono: "fa-bowl-food" },
  { ruta: "/pago", label: "Pago", icono: "fa-credit-card" },
  { ruta: "/ticket", label: "Ticket", icono: "fa-ticket" },
];

const PASOS_DULCERIA = [
  { ruta: "/dulceria", label: "Dulcería", icono: "fa-bowl-food" },
  { ruta: "/pago", label: "Pago", icono: "fa-credit-card" },
  { ruta: "/ticket", label: "Comprobante", icono: "fa-receipt" },
];

export default function StepperCompra() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [esDulceriaDirecta, setEsDulceriaDirecta] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function actualizarFlujo() {
      if (typeof window !== "undefined") {
        const directo =
          sessionStorage.getItem("cinenautica_flujo_dulceria_directo") === "true";
        setEsDulceriaDirecta(directo || Boolean(S.dulceria));
      }
    }
    actualizarFlujo();
    window.addEventListener("storage", actualizarFlujo);
    window.addEventListener("cambio-flujo-compra", actualizarFlujo);
    return () => {
      window.removeEventListener("storage", actualizarFlujo);
      window.removeEventListener("cambio-flujo-compra", actualizarFlujo);
    };
  }, [pathname]);

  const pasos = esDulceriaDirecta ? PASOS_DULCERIA : PASOS_PELICULA;
  const actual = pasos.findIndex(
    (p) => pathname === p.ruta || pathname.startsWith(p.ruta + "/")
  );
  if (actual === -1) return null;

  return (
    <div
      className={`fixed top-20 left-0 w-full z-40 transition-all duration-300 py-3 px-4 ${
        scrolled
          ? "stepper-scrolled bg-[#050B14]/92 backdrop-blur-md shadow-xl border-b border-white/10"
          : "bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
      id="stepper-compra"
    >
      <div className="max-w-xl mx-auto flex items-center" id="stepper-compra-pasos">
        {pasos.map((p, i) => {
          const hecho = i < actual,
            ahora = i === actual;
          const txt = hecho
            ? "text-brand-yellow"
            : ahora
            ? "text-white"
            : "text-slate-600";
          const circ = hecho
            ? "bg-brand-yellow text-black"
            : ahora
            ? "bg-brand-blue text-white shadow-[0_0_10px_rgba(10,126,177,0.6)]"
            : "bg-dark-700 text-slate-500 border border-white/10";
          return (
            <div
              key={p.ruta}
              className={`flex items-center ${i < pasos.length - 1 ? "flex-1" : ""}`}
            >
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold ${circ}`}
                >
                  <i
                    className={`fa-solid ${
                      hecho ? "fa-check" : p.icono
                    } text-[11px] md:text-xs`}
                  ></i>
                </div>
                <span
                  className={`text-[10px] md:text-xs font-semibold ${txt} hidden sm:block whitespace-nowrap`}
                >
                  {p.label}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 md:mx-3 ${
                    hecho ? "bg-brand-yellow" : "bg-dark-700"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
