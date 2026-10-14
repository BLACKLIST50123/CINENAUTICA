"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function BadgeTemporizador() {
  const pathname = usePathname();
  const [texto, setTexto] = useState("05:00");
  const [esUrgente, setEsUrgente] = useState(false);

  useEffect(() => {
    function manejarTick(e: any) {
      if (e?.detail) {
        setTexto(e.detail.formateado || "05:00");
        setEsUrgente(Boolean(e.detail.segundos <= 60));
      }
    }

    window.addEventListener("temporizador-compra-tick", manejarTick);
    return () => {
      window.removeEventListener("temporizador-compra-tick", manejarTick);
    };
  }, []);

  if (!["/asientos", "/dulceria", "/pago"].includes(pathname)) return null;

  return (
    <div
      className={`fixed top-40 right-4 z-[60] bg-dark-800/95 border border-brand-yellow/40 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold backdrop-blur-sm transition-all ${
        esUrgente ? "badge-temporizador-urgente" : ""
      }`}
      id="badge-temporizador-compra"
    >
      <i className="fa-regular fa-clock text-brand-yellow"></i>
      <span id="badge-temporizador-texto">{texto}</span>
    </div>
  );
}
