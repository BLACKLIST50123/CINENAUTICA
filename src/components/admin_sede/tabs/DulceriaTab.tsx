"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSedeDao } from "@/src/daos/AdminSedeDao";
import type { ProductoDulceriaSedeDTO } from "@/src/dtos/adminSede";
import ModalConfirmacion from "../comun/ModalConfirmacion";

interface DulceriaTabProps {
  idSede: number;
  onEditarProducto: (producto: ProductoDulceriaSedeDTO) => void;
  recargarTrigger: number;
}

export default function DulceriaTab({
  idSede,
  onEditarProducto,
  recargarTrigger,
}: DulceriaTabProps) {
  const [productos, setProductos] = useState<ProductoDulceriaSedeDTO[]>([]);
  const [categoriaSel, setCategoriaSel] = useState<string>("Todas");
  const [busqueda, setBusqueda] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [productoAlternar, setProductoAlternar] = useState<ProductoDulceriaSedeDTO | null>(null);

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    const data = await AdminSedeDao.obtenerProductosDulceriaSede(idSede);
    setProductos(data);
    setCargando(false);
  }, [idSede, recargarTrigger]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const categorias = ["Todas", ...Array.from(new Set(productos.map((p) => p.categoria_nombre)))];

  const productosFiltrados = productos.filter((p) => {
    const coincideCat = categoriaSel === "Todas" || p.categoria_nombre === categoriaSel;
    const coincideBusq =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusq;
  });

  const confirmarAlternarVisibilidad = async () => {
    if (!productoAlternar) return;
    const nuevoEstado = !productoAlternar.habilitado;

    // Actualización optimista
    setProductos((prev) =>
      prev.map((p) =>
        p.id_producto === productoAlternar.id_producto ? { ...p, habilitado: nuevoEstado } : p
      )
    );

    await AdminSedeDao.actualizarVisibilidadYPrecioDulce(
      idSede,
      productoAlternar.id_producto,
      nuevoEstado
    );
    setProductoAlternar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Catálogo de Dulcería</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Control de visibilidad y personalización de precios de venta en esta sede
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto o combo..."
            className="w-full bg-dark-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow transition-colors"
          />
        </div>
      </div>

      {/* Categorías Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoriaSel(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              categoriaSel === cat
                ? "bg-brand-yellow text-dark-950 border-brand-yellow font-bold shadow-md shadow-yellow-500/10"
                : "bg-dark-900 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de Productos */}
      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          <div className="h-64 bg-dark-900 rounded-2xl"></div>
          <div className="h-64 bg-dark-900 rounded-2xl"></div>
          <div className="h-64 bg-dark-900 rounded-2xl"></div>
          <div className="h-64 bg-dark-900 rounded-2xl"></div>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-10 text-center">
          <i className="fa-solid fa-bowl-food text-3xl text-slate-600 mb-2"></i>
          <p className="text-slate-400 text-sm">No se encontraron productos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosFiltrados.map((prod) => {
            const tienePrecioPersonalizado = Math.abs(prod.precio_local - prod.precio_base) > 0.01;

            return (
              <div
                key={prod.id_producto}
                className={`bg-dark-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all ${
                  prod.habilitado ? "border-white/10 hover:border-white/20" : "border-white/5 opacity-60 bg-dark-950/40"
                }`}
              >
                <div>
                  {/* Badge de visibilidad y Categoría */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-dark-800 border border-white/10 px-2 py-0.5 rounded">
                      {prod.categoria_nombre}
                    </span>
                    <button
                      type="button"
                      onClick={() => setProductoAlternar(prod)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                        prod.habilitado
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${prod.habilitado ? "bg-emerald-400" : "bg-slate-500"}`}></span>
                      <span>{prod.habilitado ? "Visible" : "Oculto"}</span>
                    </button>
                  </div>

                  {/* Imagen */}
                  <div className="h-32 flex items-center justify-center p-2 mb-3 bg-dark-800/40 rounded-xl">
                    <img
                      src={prod.url_imagen}
                      alt={prod.nombre}
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/dulceria/combo1.png";
                      }}
                    />
                  </div>

                  {/* Nombre y Descripción */}
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 mb-1">
                    {prod.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {prod.descripcion || "Sin descripción adicional."}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  {/* Precios: Base vs Local */}
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Precio en Sede</span>
                      <span className="text-base font-bold text-brand-yellow font-mono">
                        S/ {prod.precio_local.toFixed(2)}
                      </span>
                    </div>
                    {tienePrecioPersonalizado && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Precio base</span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          S/ {prod.precio_base.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botón Configurar */}
                  <button
                    type="button"
                    onClick={() => onEditarProducto(prod)}
                    className="w-full py-2 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl text-xs transition-colors border border-white/10 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <i className="fa-solid fa-sliders text-brand-blue text-[10px]"></i>
                    <span>Configurar Producto</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación para alternar visibilidad */}
      <ModalConfirmacion
        abierto={!!productoAlternar}
        titulo={
          productoAlternar?.habilitado
            ? "¿Ocultar Producto de la Sede?"
            : "¿Habilitar Producto en la Sede?"
        }
        mensaje={
          productoAlternar?.habilitado
            ? `'${productoAlternar?.nombre}' ya no se mostrará para compras de dulcería en los counters ni en la web de esta sede.`
            : `'${productoAlternar?.nombre}' volverá a estar disponible para compra inmediata en esta sede.`
        }
        tipo={productoAlternar?.habilitado ? "advertencia" : "info"}
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarAlternarVisibilidad}
        onCancelar={() => setProductoAlternar(null)}
      />
    </div>
  );
}
