"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminGeneralDao } from "@/src/daos/AdminGeneralDao";
import type {
  ProductoGlobalDTO,
  CategoriaProductoDTO,
  CrearProductoGlobalPayload,
  EditarProductoGlobalPayload,
} from "@/src/dtos/adminGeneral";
import { obtenerIconoProducto } from "@/src/components/counter/dulceria/DulceriaView";
import ModalConfirmacion from "@/src/components/admin_sede/comun/ModalConfirmacion";

interface DulceriaGlobalTabProps {
  recargarTrigger: number;
  onRecargar: () => void;
}

const FORM_PRODUCTO_VACIO: CrearProductoGlobalPayload = {
  nombre: "",
  descripcion: "",
  precio_base: 15.0,
  id_categoria: "",
  url_imagen: "fa-solid fa-bowl-food",
};

export default function DulceriaGlobalTab({ recargarTrigger, onRecargar }: DulceriaGlobalTabProps) {
  const [productos, setProductos] = useState<ProductoGlobalDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProductoDTO[]>([]);
  const [categoriaSel, setCategoriaSel] = useState<string>("Todas");
  const [busqueda, setBusqueda] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);

  // Modal Crear / Editar
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [productoEditar, setProductoEditar] = useState<ProductoGlobalDTO | null>(null);
  const [form, setForm] = useState<CrearProductoGlobalPayload>(FORM_PRODUCTO_VACIO);
  const [modoImagen, setModoImagen] = useState<"url" | "archivo">("url");
  const fileInputImagenRef = React.useRef<HTMLInputElement>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<boolean>(false);

  // Modales de Confirmación
  const [productoEliminar, setProductoEliminar] = useState<ProductoGlobalDTO | null>(null);
  const [productoAlternar, setProductoAlternar] = useState<ProductoGlobalDTO | null>(null);
  const [confirmarGuardarPendiente, setConfirmarGuardarPendiente] = useState<boolean>(false);
  const [confirmarCancelarPendiente, setConfirmarCancelarPendiente] = useState<boolean>(false);

  const [toast, setToast] = useState<{ mensaje: string; tipo: "ok" | "error" } | null>(null);

  const procesarArchivoImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      mostrarToast("Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      mostrarToast("La imagen excede el límite recomendado de 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setForm((prev) => ({ ...prev, url_imagen: dataUrl }));
      setErrores((prev) => {
        const c = { ...prev };
        delete c.url_imagen;
        return c;
      });
    };
    reader.readAsDataURL(file);
  };

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    const [prods, cats] = await Promise.all([
      AdminGeneralDao.obtenerProductosGlobal(),
      AdminGeneralDao.obtenerCategoriasProducto(),
    ]);
    setProductos(prods);
    setCategorias(cats);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos, recargarTrigger]);

  const mostrarToast = (mensaje: string, tipo: "ok" | "error" = "ok") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const listaCategorias = ["Todas", ...categorias.map((c) => c.nombre)];

  const productosFiltrados = productos.filter((p) => {
    const coincideCat = categoriaSel === "Todas" || p.categoria_nombre === categoriaSel;
    const coincideBusq =
      !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusq;
  });

  const abrirCrear = () => {
    const primeraCat = categorias[0]?.id_categoria || "";
    setForm({
      ...FORM_PRODUCTO_VACIO,
      id_categoria: primeraCat,
    });
    setModoImagen("url");
    setProductoEditar(null);
    setErrores({});
    setModalAbierto(true);
  };

  const abrirEditar = (p: ProductoGlobalDTO) => {
    const catId = p.id_categoria || categorias.find((c) => c.nombre === p.categoria_nombre)?.id_categoria || "";
    const imgUrl = p.url_imagen || "fa-solid fa-bowl-food";
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_base: p.precio_base,
      id_categoria: catId,
      url_imagen: imgUrl,
    });
    setModoImagen(imgUrl.startsWith("data:") ? "archivo" : "url");
    setProductoEditar(p);
    setErrores({});
    setModalAbierto(true);
  };

  const validar = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre del producto es obligatorio.";
    if (!form.descripcion.trim()) errs.descripcion = "La descripción es obligatoria.";
    if (!form.precio_base || form.precio_base <= 0) errs.precio_base = "El precio base debe ser mayor a S/ 0.00.";
    if (!form.id_categoria) errs.id_categoria = "Selecciona una categoría válida.";

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const solicitarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setConfirmarGuardarPendiente(true);
  };

  const ejecutarGuardar = async () => {
    setGuardando(true);
    setConfirmarGuardarPendiente(false);

    let res;
    if (productoEditar) {
      res = await AdminGeneralDao.editarProductoGlobal({
        id_producto: productoEditar.id_producto,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio_base: form.precio_base,
        id_categoria: form.id_categoria,
        url_imagen: form.url_imagen,
        activo: productoEditar.activo,
      });
    } else {
      res = await AdminGeneralDao.crearProductoGlobal(form);
    }

    setGuardando(false);
    if (res.ok) {
      setModalAbierto(false);
      mostrarToast(
        productoEditar
          ? `Producto "${form.nombre}" actualizado correctamente.`
          : `Producto "${form.nombre}" registrado en dulcería global.`
      );
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al procesar el producto.", "error");
    }
  };

  const solicitarCancelar = () => {
    if (form.nombre.trim() || form.descripcion.trim()) {
      setConfirmarCancelarPendiente(true);
    } else {
      setModalAbierto(false);
    }
  };

  const ejecutarEliminar = async () => {
    if (!productoEliminar) return;
    setGuardando(true);
    const res = await AdminGeneralDao.eliminarProductoGlobal(productoEliminar.id_producto);
    setGuardando(false);
    const nombre = productoEliminar.nombre;
    setProductoEliminar(null);

    if (res.ok) {
      mostrarToast(`Producto "${nombre}" eliminado del catálogo.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "No se pudo eliminar el producto.", "error");
    }
  };

  const ejecutarAlternarEstado = async () => {
    if (!productoAlternar) return;
    const nuevoEstado = !productoAlternar.activo;

    // Actualización optimista
    setProductos((prev) =>
      prev.map((p) =>
        p.id_producto === productoAlternar.id_producto ? { ...p, activo: nuevoEstado } : p
      )
    );

    const res = await AdminGeneralDao.editarProductoGlobal({
      id_producto: productoAlternar.id_producto,
      precio_base: productoAlternar.precio_base,
      activo: nuevoEstado,
    });

    const nombre = productoAlternar.nombre;
    setProductoAlternar(null);

    if (res.ok) {
      mostrarToast(`Producto "${nombre}" ${nuevoEstado ? "habilitado" : "deshabilitado"} globalmente.`);
      onRecargar();
    } else {
      mostrarToast(res.error || "Error al actualizar estado.", "error");
      cargarDatos();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[99999] px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-fadeIn ${
            toast.tipo === "ok" ? "bg-emerald-600 text-white shadow-emerald-500/20" : "bg-rose-600 text-white shadow-rose-500/20"
          }`}
        >
          <i className={`fa-solid ${toast.tipo === "ok" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
          <span>{toast.mensaje}</span>
        </div>
      )}

      {/* Cabecera y botón Nuevo Producto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Catálogo Global de Dulcería</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Definición maestra de combos, bebidas, snacks y precios base corporativos
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Buscador y Filtro de Categorías */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
          {listaCategorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaSel(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                categoriaSel === cat
                  ? "bg-[#0284C7] text-white border-[#0284C7] font-bold shadow-md shadow-cyan-500/20"
                  : "bg-[#070e1b] border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full bg-[#070e1b] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Grilla de Tarjetas (Reutilizando diseño y estilo temático de Admin_Sede) */}
      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-[#0B1528] border border-white/10 rounded-2xl"></div>
          ))}
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-10 text-center">
          <i className="fa-solid fa-bowl-food text-4xl text-slate-600 mb-3 block"></i>
          <h3 className="text-base font-bold text-white mb-1">No se encontraron productos</h3>
          <p className="text-xs text-slate-400">Prueba con otra categoría o término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosFiltrados.map((prod) => {
            const estiloIcono = obtenerIconoProducto(prod.nombre, prod.categoria_nombre);

            return (
              <div
                key={prod.id_producto}
                className={`bg-[#0B1528] border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                  prod.activo
                    ? "border-white/15 hover:border-brand-yellow/40 hover:shadow-yellow-500/5"
                    : "border-white/5 opacity-60 bg-[#070d18]"
                }`}
              >
                <div>
                  {/* Badge de Categoría y Toggle de Estado */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      {prod.categoria_nombre}
                    </span>
                    <button
                      type="button"
                      onClick={() => setProductoAlternar(prod)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        prod.activo
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          prod.activo ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                        }`}
                      ></span>
                      <span>{prod.activo ? "Habilitado" : "Deshabilitado"}</span>
                    </button>
                  </div>

                  {/* Imagen Real o Icono Temático Corporativo */}
                  {prod.url_imagen && (prod.url_imagen.startsWith("http") || prod.url_imagen.startsWith("data:image")) ? (
                    <div className="h-32 mb-3.5 rounded-xl overflow-hidden border border-white/10 bg-[#070e1b] relative group flex items-center justify-center">
                      <img
                        src={prod.url_imagen}
                        alt={prod.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`h-32 flex flex-col items-center justify-center p-3 mb-3.5 rounded-xl border bg-gradient-to-br ${estiloIcono.bgGradiente}`}
                    >
                      <i className={`${prod.url_imagen?.startsWith("fa-") ? prod.url_imagen : estiloIcono.icono} text-4xl ${estiloIcono.colorIcono} drop-shadow-md mb-1`}></i>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                        {prod.categoria_nombre}
                      </span>
                    </div>
                  )}

                  {/* Nombre y Descripción */}
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 mb-1">
                    {prod.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {prod.descripcion || "Sin descripción adicional registrada."}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  {/* Precios y Sedes con override */}
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Precio Base Global</span>
                      <span className="text-base font-extrabold text-cyan-400 font-mono tracking-tight">
                        S/ {prod.precio_base.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Precios en Sedes</span>
                      <span className="text-xs font-semibold text-slate-300">
                        {prod.sedes_con_precio_local} configuradas
                      </span>
                    </div>
                  </div>

                  {/* Botones de Acción (Editar y Borrar) */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => abrirEditar(prod)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <i className="fa-solid fa-pen text-[10px] text-sky-400"></i>
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductoEliminar(prod)}
                      className="bg-[#DC2026] hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      title="Eliminar producto"
                    >
                      <i className="fa-solid fa-trash text-[10px]"></i>
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal de Creación / Edición de Producto ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0B1528] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-white"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#070e1b]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <i className="fa-solid fa-bowl-food"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {productoEditar ? "Editar Producto" : "Nuevo Producto de Dulcería"}
                  </h3>
                  <p className="text-xs text-slate-400">Catálogo global corporativo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={solicitarCancelar}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={solicitarGuardar} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Nombre del Producto <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Combo Familiar Mega"
                  className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                    errores.nombre ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                  }`}
                />
                {errores.nombre && <span className="text-[11px] text-rose-400 mt-1 block">{errores.nombre}</span>}
              </div>

              {/* Categoría y Precio Base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Categoría <span className="text-brand-yellow">*</span>
                  </label>
                  <select
                    value={form.id_categoria}
                    onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                    className="w-full bg-[#0B1528] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    {categorias.map((c) => (
                      <option key={c.id_categoria} value={c.id_categoria}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Precio Base Global (S/) <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0.1"
                    value={form.precio_base}
                    onChange={(e) => setForm({ ...form, precio_base: parseFloat(e.target.value) || 0 })}
                    className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                      errores.precio_base ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                    }`}
                  />
                  {errores.precio_base && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errores.precio_base}</span>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Descripción del Producto <span className="text-brand-yellow">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Detalles de contenido (ej. 1 Popcorn Gigante + 2 Bebidas Grandes...)"
                  className={`w-full bg-[#0B1528] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors resize-none ${
                    errores.descripcion ? "border-rose-500" : "border-white/10 focus:border-brand-blue"
                  }`}
                ></textarea>
                {errores.descripcion && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{errores.descripcion}</span>
                )}
              </div>

              {/* Selector Dual de Imagen / Ícono con Previsualización */}
              <div className="bg-[#0B1528] border border-white/10 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-image text-brand-yellow"></i>
                    <span>Imagen del Producto</span>
                  </label>
                  <div className="flex bg-[#070e1b] p-0.5 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setModoImagen("url")}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        modoImagen === "url" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Poner URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoImagen("archivo")}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        modoImagen === "archivo" ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Cargar Archivo
                    </button>
                  </div>
                </div>

                {modoImagen === "url" ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <i className="fa-solid fa-link absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                      <input
                        type="text"
                        value={form.url_imagen || ""}
                        onChange={(e) => setForm({ ...form, url_imagen: e.target.value })}
                        placeholder="https://ejemplo.com/combo.jpg o fa-solid fa-bowl-food"
                        className="w-full bg-[#070e1b] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                    {/* Atajos de íconos temáticos rápidos */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-slate-400">Atajos de ícono:</span>
                      {[
                        { icon: "fa-solid fa-bowl-food", label: "Popcorn" },
                        { icon: "fa-solid fa-bottle-water", label: "Bebida" },
                        { icon: "fa-solid fa-hotdog", label: "HotDog" },
                        { icon: "fa-solid fa-cookie", label: "Snack" },
                        { icon: "fa-solid fa-ice-cream", label: "Helado" },
                      ].map((item) => (
                        <button
                          key={item.icon}
                          type="button"
                          onClick={() => setForm({ ...form, url_imagen: item.icon })}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                            form.url_imagen === item.icon
                              ? "bg-brand-yellow/15 border-brand-yellow/40 text-brand-yellow"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <i className={item.icon}></i>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputImagenRef}
                      accept="image/*"
                      onChange={procesarArchivoImagen}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputImagenRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/20 hover:border-brand-blue rounded-xl p-3.5 text-center cursor-pointer transition-colors text-xs text-slate-300 flex items-center justify-center gap-2 group"
                    >
                      <i className="fa-solid fa-cloud-arrow-up text-brand-blue group-hover:scale-110 transition-transform"></i>
                      <span>
                        {form.url_imagen?.startsWith("data:")
                          ? "Reemplazar imagen desde tu equipo"
                          : "Seleccionar imagen desde tu equipo (PNG, JPG, WEBP)"}
                      </span>
                    </button>
                  </div>
                )}

                {/* Previsualización de la Imagen o Ícono */}
                {form.url_imagen && (
                  <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#070e1b] border border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                      {form.url_imagen.startsWith("http") || form.url_imagen.startsWith("data:image") ? (
                        <img
                          src={form.url_imagen}
                          alt="Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-white/15 bg-dark-900 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/img/poster-placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow shrink-0">
                          <i className={`${form.url_imagen.startsWith("fa-") ? form.url_imagen : "fa-solid fa-bowl-food"} text-lg`}></i>
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-[11px] text-emerald-400 font-bold block flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-[10px]"></i> Imagen configurada
                        </span>
                        <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                          {form.url_imagen.startsWith("data:")
                            ? "Archivo local cargado (Data URL base64)"
                            : form.url_imagen}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {modoImagen === "archivo" && (
                        <button
                          type="button"
                          onClick={() => fileInputImagenRef.current?.click()}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 hover:bg-white/10 text-sky-400 border border-white/10 cursor-pointer"
                        >
                          Reemplazar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, url_imagen: "fa-solid fa-bowl-food" })}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Restablecer ícono por defecto"
                      >
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </div>
                  </div>
                )}

                {errores.url_imagen && (
                  <span className="text-[11px] text-rose-400 block">{errores.url_imagen}</span>
                )}
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={solicitarCancelar}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>{productoEditar ? "Guardar Cambios" : "Crear Producto"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modales de Confirmación Centrales con Portal ── */}

      {/* Confirmar Guardar */}
      <ModalConfirmacion
        abierto={confirmarGuardarPendiente}
        titulo={productoEditar ? "¿Guardar Cambios del Producto?" : "¿Registrar Producto?"}
        mensaje={
          productoEditar
            ? `Se actualizará la información y precio base de "${form.nombre}".`
            : `Se creará "${form.nombre}" con precio base de S/ ${form.precio_base.toFixed(2)}.`
        }
        tipo={productoEditar ? "advertencia" : "exito"}
        textoConfirmar={productoEditar ? "Confirmar Cambios" : "Crear Ahora"}
        textoCancelar="Revisar"
        cargando={guardando}
        onConfirmar={ejecutarGuardar}
        onCancelar={() => setConfirmarGuardarPendiente(false)}
      />

      {/* Confirmar Eliminación */}
      <ModalConfirmacion
        abierto={!!productoEliminar}
        titulo="¿Eliminar Producto de Dulcería?"
        mensaje={`¿Estás seguro de eliminar "${productoEliminar?.nombre}" del catálogo global? Se ocultará de la venta en todas las sedes.`}
        tipo="peligro"
        textoConfirmar="Eliminar Producto"
        textoCancelar="Volver"
        cargando={guardando}
        onConfirmar={ejecutarEliminar}
        onCancelar={() => setProductoEliminar(null)}
      />

      {/* Confirmar Alternar Estado */}
      <ModalConfirmacion
        abierto={!!productoAlternar}
        titulo={productoAlternar?.activo ? "¿Deshabilitar Producto?" : "¿Habilitar Producto?"}
        mensaje={`¿Deseas ${productoAlternar?.activo ? "deshabilitar" : "habilitar"} la venta global de "${productoAlternar?.nombre}"?`}
        tipo="advertencia"
        textoConfirmar="Confirmar"
        textoCancelar="Volver"
        onConfirmar={ejecutarAlternarEstado}
        onCancelar={() => setProductoAlternar(null)}
      />

      {/* Confirmar Cancelar / Descarte */}
      <ModalConfirmacion
        abierto={confirmarCancelarPendiente}
        titulo="¿Descartar Cambios?"
        mensaje="Tienes modificaciones pendientes en el producto. ¿Deseas salir sin guardar?"
        tipo="advertencia"
        textoConfirmar="Descartar"
        textoCancelar="Continuar Editando"
        onConfirmar={() => {
          setConfirmarCancelarPendiente(false);
          setModalAbierto(false);
        }}
        onCancelar={() => setConfirmarCancelarPendiente(false)}
      />
    </div>
  );
}
