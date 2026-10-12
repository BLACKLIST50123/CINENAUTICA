"use client";

import { usePathname } from "next/navigation";


export default function BadgeTemporizador() {
  const pathname = usePathname();
  if (!["/asientos", "/dulceria", "/pago"].includes(pathname)) return null;
  return (
    <>
      <div className="fixed top-40 right-4 z-[60] bg-dark-800/95 border border-brand-yellow/40 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold backdrop-blur-sm" id="badge-temporizador-compra">
        <i className="fa-regular fa-clock text-brand-yellow"></i>
        {" "}
        <span id="badge-temporizador-texto">
          05:00
        </span>
      </div>
    </>
  );
}
