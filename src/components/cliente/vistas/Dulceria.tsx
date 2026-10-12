"use client";

import { filtrarDulceria } from "@/src/lib/ui/cliente";
import { cambiarCantidad } from "@/src/lib/ui/common";
import { cambiarVista, irAPago } from "@/src/lib/ui/nav";

export default function Dulceria() {
  return (
    <>
      <div className="w-full bg-dark-900 min-h-screen pb-40 transition-opacity duration-300 absolute top-0 left-0 z-30 pt-36" id="vista-dulceria">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8 flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3">
            <button className="text-white/60 hover:text-white mb-6 flex items-center gap-2 transition-colors" id="btn-volver-asientos-dulceria" onClick={(event) => { cambiarVista('vista-dulceria', 'vista-asientos'); }}>
              <i className="fa-solid fa-arrow-left"></i>
              {" "}
              Volver a Asientos
            </button>
            {" "}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-bowl-food text-3xl text-brand-yellow"></i>
                {" "}
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Dulcería Náutica
                </h2>
              </div>
              <p className="hidden text-slate-400 text-sm mt-2" id="subtitulo-sede-dulceria">
                <i className="fa-solid fa-location-dot text-brand-yellow mr-1"></i>
                <span id="nombre-sede-dulceria"></span>
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 border-b border-white/10 pb-2" id="categorias-dulceria">
              <button className="cat-btn px-4 py-2 font-semibold whitespace-nowrap border-b-2 text-brand-yellow border-brand-yellow" onClick={(event) => { filtrarDulceria(event.currentTarget, 'all'); }}>
                Todos
              </button>
              <button className="cat-btn px-4 py-2 text-slate-400 font-semibold hover:text-white whitespace-nowrap border-b-2 border-transparent" onClick={(event) => { filtrarDulceria(event.currentTarget, 'combo'); }}>
                Combos Populares
              </button>
              <button className="cat-btn px-4 py-2 text-slate-400 font-semibold hover:text-white whitespace-nowrap border-b-2 border-transparent" onClick={(event) => { filtrarDulceria(event.currentTarget, 'cancha'); }}>
                Cancha (Popcorn)
              </button>
              <button className="cat-btn px-4 py-2 text-slate-400 font-semibold hover:text-white whitespace-nowrap border-b-2 border-transparent" onClick={(event) => { filtrarDulceria(event.currentTarget, 'bebida'); }}>
                Bebidas
              </button>
              <button className="cat-btn px-4 py-2 text-slate-400 font-semibold hover:text-white whitespace-nowrap border-b-2 border-transparent" onClick={(event) => { filtrarDulceria(event.currentTarget, 'snack'); }}>
                Snacks &amp; Dulces
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="grid-productos">
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="combo">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-box-open"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Combo Mega Familiar
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      2 Canchas Gigantes + 4 Bebidas Grandes + 1 Nachos
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 65.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="combo">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Combo Dúo
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      1 Cancha Gigante + 2 Bebidas Grandes
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 40.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        1
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="combo">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Combo Personal
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      1 Cancha Mediana + 1 Bebida Mediana
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 25.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="cancha">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-bowl-food"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Cancha Gigante
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Sabor Mantequilla, Salada o Mixta
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 22.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="cancha">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-bowl-food"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Cancha Mediana
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Sabor Mantequilla o Salada
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 16.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="bebida">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-glass-water"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Gaseosa Grande
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Coca-Cola, Inca Kola, Sprite (32oz)
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 12.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="bebida">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-glass-water"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Gaseosa Mediana
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Coca-Cola, Inca Kola, Sprite (21oz)
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 9.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="bebida">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-bottle-water"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Agua Mineral
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Con o sin gas (500ml)
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 6.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="snack">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-cheese"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Nachos con Queso
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Porción personal de nachos crocantes con salsa de queso cheddar calientita
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 15.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="snack">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-hotdog"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Hot Dog Jumbo
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Salchicha de res con pan artesanal y cremas a elección
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 12.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="snack">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-candy-cane"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      M&amp;M's
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Paquete grande M&amp;M's Chocolate o Maní
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 8.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-colors shadow-lg" data-cat="snack">
                <div className="w-20 h-20 bg-dark-900 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-yellow text-3xl overflow-hidden">
                  <i className="fa-solid fa-cookie"></i>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight mb-1">
                      Snickers
                    </h4>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">
                      Barra de chocolate grande
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="font-bold text-white text-lg">
                      S/ 6.00
                    </span>
                    {" "}
                    <div className="flex items-center gap-3 bg-dark-900 rounded-full px-2 py-1 border border-white/10">
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-blue transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, -1); }}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      {" "}
                      <span className="text-white font-bold text-sm w-4 text-center">
                        0
                      </span>
                      {" "}
                      <button className="w-6 h-6 rounded-full bg-dark-700 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-colors" onClick={(event) => { cambiarCantidad(event.currentTarget, 1); }}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-dark-800 p-6 rounded-2xl border border-white/5 sticky top-28 shadow-xl flex flex-col max-h-[80vh]">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-4" id="titulo-pedido-dulceria">
                Tu Pedido Final
              </h3>
              <div className="overflow-y-auto hide-scrollbar flex-grow pr-2">
                <div className="mb-4" id="bloque-entradas-resumen-dulceria">
                  <h4 className="text-sm text-slate-400 font-bold uppercase mb-2">
                    Entradas
                  </h4>
                  <div className="space-y-2" id="lista-final-asientos">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        <i className="fa-solid fa-chair text-brand-yellow mr-2"></i>
                        D5
                      </span>
                      <span className="text-white">
                        S/ 18.00
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        <i className="fa-solid fa-chair text-brand-yellow mr-2"></i>
                        D6
                      </span>
                      <span className="text-white">
                        S/ 18.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 border-t border-white/10 pt-4">
                  <h4 className="text-sm text-slate-400 font-bold uppercase mb-2">
                    Dulcería
                  </h4>
                  <div className="space-y-2" id="lista-final-dulces">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        1x Combo Dúo
                      </span>
                      <span className="text-white">
                        S/ 40.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-brand-blue pt-4 mt-4">
                <div className="flex justify-between items-center mb-2" id="fila-total-entradas-dulceria">
                  <span className="text-slate-400">
                    Entradas:
                  </span>
                  {" "}
                  <span className="text-white" id="total-entradas">
                    S/ 36.00
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">
                    Dulcería:
                  </span>
                  {" "}
                  <span className="text-white" id="total-dulces">
                    S/ 40.00
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6 bg-dark-900 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-300 font-bold">
                    TOTAL A PAGAR:
                  </span>
                  {" "}
                  <span className="text-3xl font-bold text-brand-yellow" id="total-general-dulceria">
                    S/ 76.00
                  </span>
                </div>
                {" "}
                <button className="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg shadow-lg shadow-yellow-500/20" onClick={(event) => { irAPago(); }}>
                  Ir a Pagar
                  {" "}
                  <i className="fa-solid fa-credit-card"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
