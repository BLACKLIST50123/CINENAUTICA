"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSesion } from "@/src/context/SesionContext";
import { PagoService } from "@/src/services/pagoService";
import type {
  TipoComprobante,
  MetodoPago,
  CrearOrdenInputDTO,
  CuponDTO,
} from "@/src/dtos/orden";
import { mostrarToast } from "@/src/lib/ui/common";
import { abrirModalLegal } from "@/src/lib/ui/cliente";

export default function Pago() {
  const router = useRouter();
  const { usuario, socio, esSocio, recargarSocio } = useSesion();

  // ── 1. Estado del Flujo y Contexto de Compra ──
  const [cargandoContexto, setCargandoContexto] = useState(true);
  const [datosFuncion, setDatosFuncion] = useState<any>(null);
  const [asientosComprados, setAsientosComprados] = useState<any[]>([]);
  const [itemsDulceria, setItemsDulceria] = useState<any[]>([]);
  const [idSede, setIdSede] = useState<number>(1);
  const [nombreSede, setNombreSede] = useState<string>("CineNáutica Chimbote");
  const [esFlujoDirecto, setEsFlujoDirecto] = useState<boolean>(false);
  const [idSesion, setIdSesion] = useState<string>("");

  // ── 2. Formulario de Comprobante y Contacto ──
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>("Boleta");
  const [numeroDocumento, setNumeroDocumento] = useState<string>("");
  const [nombreContacto, setNombreContacto] = useState<string>("");
  const [correoContacto, setCorreoContacto] = useState<string>("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState<boolean>(true);

  // ── 3. Cupones de Descuento ──
  const [codigoCuponInput, setCodigoCuponInput] = useState<string>("");
  const [cuponAplicado, setCuponAplicado] = useState<CuponDTO | null>(null);
  const [descuentoCupon, setDescuentoCupon] = useState<number>(0);
  const [validandoCupon, setValidandoCupon] = useState<boolean>(false);

  // ── 4. Canje de Puntos Socio ──
  const [puntosDeseados, setPuntosDeseados] = useState<number>(0);
  const [descuentoPuntos, setDescuentoPuntos] = useState<number>(0);

  // ── 5. Método de Pago y Campos de Pasarela Simulada ──
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("Tarjeta");
  const [numeroTarjeta, setNumeroTarjeta] = useState<string>("");
  const [vencimientoTarjeta, setVencimientoTarjeta] = useState<string>("");
  const [cvvTarjeta, setCvvTarjeta] = useState<string>("");
  const [titularTarjeta, setTitularTarjeta] = useState<string>("");
  const [codigoYape, setCodigoYape] = useState<string>("");

  // ── 6. Estado de Procesamiento ──
  const [procesandoPago, setProcesandoPago] = useState<boolean>(false);

  // Inicializar contexto desde sessionStorage
  useEffect(() => {
    try {
      const sesionToken =
        sessionStorage.getItem("cinenautica_sesion_token") ||
        sessionStorage.getItem("cinenautica_session_id") ||
        "";
      setIdSesion(sesionToken);

      // Cargar función
      const rawFn = sessionStorage.getItem("cinenautica_seleccion_funcion");
      if (rawFn) {
        const fn = JSON.parse(rawFn);
        setDatosFuncion(fn);
        if (fn.id_sede) setIdSede(Number(fn.id_sede));
        if (fn.nombre_sede) setNombreSede(fn.nombre_sede);
      }

      // Cargar asientos
      const rawAsientos = sessionStorage.getItem("cinenautica_asientos_seleccionados");
      if (rawAsientos) {
        const as = JSON.parse(rawAsientos);
        if (Array.isArray(as.asientos)) {
          setAsientosComprados(as.asientos);
        }
      }

      // Cargar dulcería
      const rawDulces = sessionStorage.getItem("cinenautica_dulceria_seleccion");
      if (rawDulces) {
        const du = JSON.parse(rawDulces);
        if (Array.isArray(du.items)) {
          setItemsDulceria(du.items);
        }
        if (du.id_sede) setIdSede(Number(du.id_sede));
      }

      // Determinar si es flujo directo
      const directo = !rawFn && !rawAsientos;
      setEsFlujoDirecto(directo);
    } catch (e) {
      console.error("Error al cargar contexto de compra en Pago:", e);
    } finally {
      setCargandoContexto(false);
    }
  }, []);

  // Pre-llenar datos si el usuario está autenticado
  useEffect(() => {
    if (usuario) {
      if (!nombreContacto) {
        setNombreContacto(`${usuario.nombre} ${usuario.apellido}`.trim());
      }
      if (!correoContacto) {
        setCorreoContacto(usuario.correo);
      }
    }
  }, [usuario, nombreContacto, correoContacto]);

  // Subtotales
  const subtotalEntradas = useMemo(() => {
    return asientosComprados.reduce(
      (sum, a) => sum + Number(a.precio_unitario || a.precio || 0),
      0
    );
  }, [asientosComprados]);

  const subtotalProductos = useMemo(() => {
    return itemsDulceria.reduce(
      (sum, p) => sum + Number(p.subtotal || p.precio_unitario * p.cantidad || 0),
      0
    );
  }, [itemsDulceria]);

  const subtotalGeneral = useMemo(() => {
    return subtotalEntradas + subtotalProductos;
  }, [subtotalEntradas, subtotalProductos]);

  // Recalcular puntos cuando cambia el subtotal o el cupón
  useEffect(() => {
    if (puntosDeseados > 0 && socio) {
      const subtotalAplicable = Math.max(0, subtotalGeneral - descuentoCupon);
      const res = PagoService.calcularDescuentoPuntos(
        puntosDeseados,
        socio.puntos,
        subtotalAplicable
      );
      setDescuentoPuntos(res.descuentoSoles);
    } else {
      setDescuentoPuntos(0);
    }
  }, [puntosDeseados, subtotalGeneral, descuentoCupon, socio]);

  // Total a pagar
  const totalPagar = useMemo(() => {
    return Math.max(
      0,
      Number((subtotalGeneral - descuentoCupon - descuentoPuntos).toFixed(2))
    );
  }, [subtotalGeneral, descuentoCupon, descuentoPuntos]);

  // Puntos que ganará en esta compra
  const puntosGanados = useMemo(() => {
    if (!esSocio || !socio) return 0;
    const mult = Number(socio.multiplicador || 1);
    return Math.floor(totalPagar * mult);
  }, [esSocio, socio, totalPagar]);

  // Verificar si es mes de cumpleaños
  const esMesCumple = useMemo(() => {
    if (!socio) return false;
    return PagoService.verificarBeneficioCumpleanos(
      socio.fecha_nacimiento,
      socio.cumple_usado_en_anio
    );
  }, [socio]);

  // ── Manejadores de Formularios ──

  const aplicarCupon = async () => {
    if (!codigoCuponInput.trim()) {
      mostrarToast("Ingresa un código de cupón.", "info");
      return;
    }

    setValidandoCupon(true);
    try {
      const res = await PagoService.validarYAplicarCupon(
        codigoCuponInput,
        idSede,
        subtotalGeneral
      );

      if (res.valido && res.cupon) {
        setCuponAplicado(res.cupon);
        setDescuentoCupon(res.montoDescuento || 0);
        mostrarToast(
          `¡Cupón ${res.cupon.codigo} aplicado! Descuento: S/ ${(res.montoDescuento || 0).toFixed(2)}`,
          "success"
        );
      } else {
        mostrarToast(res.mensaje || "Cupón inválido.", "error");
      }
    } catch {
      mostrarToast("Error al verificar el cupón.", "error");
    } finally {
      setValidandoCupon(false);
    }
  };

  const quitarCupon = () => {
    setCuponAplicado(null);
    setDescuentoCupon(0);
    setCodigoCuponInput("");
    mostrarToast("Cupón removido.", "info");
  };

  const formatearTarjeta = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, "").slice(0, 16);
    const grupos = soloNumeros.match(/.{1,4}/g);
    setNumeroTarjeta(grupos ? grupos.join(" ") : soloNumeros);
  };

  const formatearVencimiento = (valor: string) => {
    let soloNumeros = valor.replace(/\D/g, "").slice(0, 4);
    if (soloNumeros.length === 1 && parseInt(soloNumeros, 10) > 1) {
      soloNumeros = `0${soloNumeros}`;
    }
    if (soloNumeros.length >= 2) {
      const mes = parseInt(soloNumeros.slice(0, 2), 10);
      if (mes === 0) {
        mostrarToast("El mes de expiración no puede ser 00.", "error");
        setVencimientoTarjeta("");
        return;
      }
      if (mes > 12) {
        mostrarToast("El mes de expiración debe estar entre 01 y 12.", "error");
        setVencimientoTarjeta("12/");
        return;
      }
      if (soloNumeros.length >= 3) {
        setVencimientoTarjeta(`${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`);
      } else {
        setVencimientoTarjeta(`${soloNumeros.slice(0, 2)}/`);
      }
    } else {
      setVencimientoTarjeta(soloNumeros);
    }
  };

  // ── Procesar Pago ──
  const manejarPago = async () => {
    if (!aceptaPoliticas) {
      mostrarToast("Debes aceptar las políticas de privacidad para continuar.", "info");
      return;
    }

    // 1. Validar Documento
    const valDoc = PagoService.validarDocumento(tipoComprobante, numeroDocumento);
    if (!valDoc.valido) {
      mostrarToast(valDoc.mensaje || "Documento inválido.", "error");
      return;
    }

    // 2. Validar Datos de Contacto
    if (!nombreContacto.trim() || nombreContacto.trim().length < 3) {
      mostrarToast("Ingresa tu nombre y apellido completos.", "error");
      return;
    }
    if (tipoComprobante === "Boleta" && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(nombreContacto)) {
      mostrarToast("El nombre y apellido solo debe contener letras.", "error");
      return;
    }
    if (!PagoService.validarCorreo(correoContacto)) {
      mostrarToast("Ingresa un correo electrónico válido (ej: tu-correo@ejemplo.com).", "error");
      return;
    }

    // 3. Validar Pasarela según método
    if (metodoPago === "Tarjeta") {
      const rawCard = numeroTarjeta.replace(/\s/g, "");
      if (rawCard.length !== 16) {
        mostrarToast("Ingresa un número de tarjeta válido de 16 dígitos.", "error");
        return;
      }
      if (vencimientoTarjeta.length < 5) {
        mostrarToast("Ingresa una fecha de vencimiento completa (MM/AA).", "error");
        return;
      }
      const [mesStr, anioStr] = vencimientoTarjeta.split("/");
      const mesNum = parseInt(mesStr, 10);
      const anioNum = parseInt(`20${anioStr}`, 10);
      const hoy = new Date();
      const anioActual = hoy.getFullYear();
      const mesActual = hoy.getMonth() + 1;

      if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
        mostrarToast("El mes de vencimiento debe estar entre 01 y 12.", "error");
        return;
      }
      if (isNaN(anioNum) || anioNum < anioActual || (anioNum === anioActual && mesNum < mesActual)) {
        mostrarToast("La tarjeta ingresada se encuentra vencida.", "error");
        return;
      }
      if (cvvTarjeta.length !== 3) {
        mostrarToast("El código CVV debe tener exactamente 3 dígitos.", "error");
        return;
      }
      if (!titularTarjeta.trim() || titularTarjeta.trim().length < 3) {
        mostrarToast("Ingresa el nombre del titular como figura en la tarjeta.", "error");
        return;
      }
    } else if (metodoPago === "Yape") {
      if (codigoYape.length < 6) {
        mostrarToast("Ingresa el código de aprobación de Yape (6 dígitos).", "error");
        return;
      }
    }

    // 4. Preparar Payload para Checkout
    const entradasPayload = asientosComprados.map((a) => ({
      id_asiento_funcion: a.id_asiento_funcion,
      id_tipo_entrada: a.id_tipo_entrada || "e0000000-0000-0000-0000-000000000001",
      precio_lista: Number(a.precio_unitario || a.precio || 0),
      descuento: 0,
      precio_unitario: Number(a.precio_unitario || a.precio || 0),
      codigo_asiento: a.codigo,
    }));

    const productosPayload = itemsDulceria.map((p) => ({
      id_producto: p.id_producto,
      cantidad: Number(p.cantidad),
      precio_unitario: Number(p.precio_unitario),
      nombre: p.nombre,
    }));

    const checkoutInput: CrearOrdenInputDTO = {
      id_sede: idSede,
      id_usuario: usuario?.id_usuario || null,
      correo_contacto: correoContacto.trim(),
      nombre_contacto: nombreContacto.trim(),
      tipo_comprobante: tipoComprobante,
      numero_documento: numeroDocumento.trim(),
      metodo_pago: metodoPago,
      codigo_cupon: cuponAplicado?.codigo || null,
      puntos_canjeados: puntosDeseados,
      id_sesion: idSesion,
      entradas: entradasPayload,
      productos: productosPayload,
    };

    setProcesandoPago(true);
    try {
      // Llamar a Route Handler POST /api/checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutInput),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo completar la transacción.");
      }

      // Guardar orden confirmada en sesión
      sessionStorage.setItem("cinenautica_orden_confirmada", JSON.stringify(data));
      sessionStorage.removeItem("cinenautica_asientos_seleccionados");
      sessionStorage.removeItem("cinenautica_dulceria_seleccion");

      // Actualizar puntos en contexto si es socio
      if (esSocio) {
        recargarSocio();
      }

      mostrarToast("¡Pago procesado con éxito! Generando tus entradas...", "success");

      // Redirigir a la vista de Ticket
      router.push(`/ticket?orden=${data.id_orden}`);
    } catch (err: any) {
      console.error("Error al procesar pago:", err);
      mostrarToast(err?.message || "Ocurrió un error al procesar el pago.", "error");
    } finally {
      setProcesandoPago(false);
    }
  };

  if (cargandoContexto) {
    return (
      <div className="w-full bg-dark-900 min-h-screen pt-36 pb-40 px-4 flex items-center justify-center text-white">
        <div className="text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-brand-yellow text-4xl mb-3"></i>
          <p className="text-slate-400 text-sm">Cargando detalles de tu compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-900 min-h-screen pb-40 pt-32 md:pt-36 text-white" id="vista-pago">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-6">
        
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
            type="button"
            onClick={() => router.push("/dulceria")}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Volver a Dulcería
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Paso 3 de 4:</span>
            <span className="text-brand-yellow font-bold uppercase tracking-wider">
              Pago Seguro y Comprobante
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── COLUMNA IZQUIERDA: Formularios (8 cols) ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* 1. Comprobante de Pago y Datos de Facturación */}
            <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <h3 className="text-xl font-bold flex items-center gap-2.5">
                  <i className="fa-solid fa-file-invoice text-brand-blue"></i>
                  Comprobante de Pago
                </h3>
                <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Válido para SUNAT
                </span>
              </div>

              {/* Selector Boleta / Factura */}
              <div className="flex gap-4 mb-6">
                <label
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    tipoComprobante === "Boleta"
                      ? "bg-brand-blue/10 border-brand-blue text-white shadow-lg shadow-blue-500/10"
                      : "bg-dark-900 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <input
                    checked={tipoComprobante === "Boleta"}
                    className="accent-brand-blue w-4 h-4 cursor-pointer"
                    name="tipo_comprobante"
                    type="radio"
                    value="Boleta"
                    onChange={() => {
                      setTipoComprobante("Boleta");
                      setNumeroDocumento("");
                    }}
                  />
                  <div className="text-left">
                    <p className="font-bold text-sm">Boleta Electrónica</p>
                    <p className="text-[11px] text-slate-400">Para personas naturales (DNI)</p>
                  </div>
                </label>

                <label
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    tipoComprobante === "Factura"
                      ? "bg-brand-blue/10 border-brand-blue text-white shadow-lg shadow-blue-500/10"
                      : "bg-dark-900 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <input
                    checked={tipoComprobante === "Factura"}
                    className="accent-brand-blue w-4 h-4 cursor-pointer"
                    name="tipo_comprobante"
                    type="radio"
                    value="Factura"
                    onChange={() => {
                      setTipoComprobante("Factura");
                      setNumeroDocumento("");
                    }}
                  />
                  <div className="text-left">
                    <p className="font-bold text-sm">Factura Electrónica</p>
                    <p className="text-[11px] text-slate-400">Para empresas o RUC 10/20</p>
                  </div>
                </label>
              </div>

              {/* Inputs de Documento y Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {tipoComprobante === "Boleta" ? "Número de DNI (8 dígitos):" : "Número de RUC (11 dígitos):"}
                  </label>
                  <input
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors font-mono tracking-wider text-sm"
                    inputMode="numeric"
                    maxLength={tipoComprobante === "Boleta" ? 8 : 11}
                    placeholder={tipoComprobante === "Boleta" ? "Ej: 72481920" : "Ej: 20601234567"}
                    type="text"
                    value={numeroDocumento}
                    onInput={(e) => {
                      const val = e.currentTarget.value.replace(/\D/g, "");
                      setNumeroDocumento(val.slice(0, tipoComprobante === "Boleta" ? 8 : 11));
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {tipoComprobante === "Boleta" ? "Nombres y Apellidos:" : "Razón Social:"}
                  </label>
                  <input
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors text-sm"
                    placeholder={tipoComprobante === "Boleta" ? "Ej: Juan Pérez Morales" : "Ej: Cine Inversiones SAC"}
                    type="text"
                    value={nombreContacto}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (tipoComprobante === "Boleta") {
                        const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                        if (val !== soloLetras) {
                          mostrarToast("El nombre y apellido solo debe contener letras.", "error");
                        }
                        setNombreContacto(soloLetras);
                      } else {
                        setNombreContacto(val);
                      }
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Electrónico (para el envío de tus entradas digitales):
                  </label>
                  <input
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors text-sm"
                    placeholder="Ej: tu-correo@ejemplo.com"
                    type="email"
                    value={correoContacto}
                    onChange={(e) => setCorreoContacto(e.target.value)}
                  />
                </div>
              </div>

              {/* Políticas y Legal */}
              <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none mt-5">
                <input
                  checked={aceptaPoliticas}
                  className="mt-0.5 accent-brand-blue w-4 h-4 flex-shrink-0 cursor-pointer"
                  type="checkbox"
                  onChange={(e) => setAceptaPoliticas(e.target.checked)}
                />
                <span>
                  He leído y acepto las{" "}
                  <button
                    className="text-brand-yellow hover:underline font-semibold"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      abrirModalLegal("privacidad");
                    }}
                  >
                    Políticas de Privacidad
                  </button>{" "}
                  y los{" "}
                  <button
                    className="text-brand-yellow hover:underline font-semibold"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      abrirModalLegal("terminos");
                    }}
                  >
                    Términos del Servicio
                  </button>
                  .
                </span>
              </label>
            </div>

            {/* 2. Cupón de Descuento */}
            <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold flex items-center gap-2.5 mb-3">
                <i className="fa-solid fa-tag text-brand-yellow"></i>
                Cupón de Descuento
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Si cuentas con un código promocional, ingrésalo para aplicar un descuento exclusivo.
              </p>

              {cuponAplicado ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-circle-check text-emerald-400 text-xl"></i>
                    <div>
                      <p className="font-bold text-sm text-emerald-300">
                        Cupón {cuponAplicado.codigo} Aplicado
                      </p>
                      <p className="text-xs text-slate-300">
                        {cuponAplicado.descripcion} (- S/ {descuentoCupon.toFixed(2)})
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-xs text-slate-400 hover:text-brand-red bg-dark-900/60 px-3 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer"
                    type="button"
                    onClick={quitarCupon}
                  >
                    <i className="fa-solid fa-trash-can mr-1.5"></i>
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-brand-yellow transition-colors font-mono tracking-wider text-sm"
                    placeholder="Ej: VERANO20 o CINELOVER"
                    type="text"
                    value={codigoCuponInput}
                    onChange={(e) => setCodigoCuponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && aplicarCupon()}
                  />
                  <button
                    className="bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer disabled:opacity-50"
                    disabled={validandoCupon}
                    type="button"
                    onClick={aplicarCupon}
                  >
                    {validandoCupon ? (
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Beneficios Socio Náutica (si está logueado) */}
            {esSocio && socio && (
              <div className="bg-gradient-to-r from-dark-800 to-dark-800/90 p-6 md:p-8 rounded-2xl border border-brand-yellow/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-star text-brand-yellow text-xl"></i>
                    <div>
                      <h3 className="text-lg font-bold">Programa Socio Náutica</h3>
                      <p className="text-xs text-slate-400">
                        Nivel actual: <span className="text-brand-yellow font-bold">{socio.nombre_nivel}</span> (x{socio.multiplicador} pts)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Saldo Disponible</span>
                    <span className="text-xl font-black text-brand-yellow">{socio.puntos} pts</span>
                  </div>
                </div>

                {/* Banner de Cumpleaños */}
                {esMesCumple && (
                  <div className="bg-brand-yellow/10 border border-brand-yellow/30 p-3.5 rounded-xl mb-4 flex items-center gap-3">
                    <i className="fa-solid fa-cake-candles text-brand-yellow text-xl"></i>
                    <p className="text-xs text-slate-200 leading-snug">
                      <span className="font-bold text-brand-yellow block">¡Feliz mes de cumpleaños!</span>
                      Disfruta de beneficios especiales en confitería y entradas este mes.
                    </p>
                  </div>
                )}

                {/* Canje de Puntos */}
                <div className="bg-dark-900/80 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-semibold text-slate-300">Canjear puntos por descuento:</span>
                    <span className="text-slate-400">10 pts = S/ 1.00 (mínimo 50 pts)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      className="w-full accent-brand-yellow cursor-pointer"
                      max={Math.min(socio.puntos, Math.floor((subtotalGeneral * 0.5) / 0.1))}
                      min={0}
                      step={10}
                      type="range"
                      value={puntosDeseados}
                      onChange={(e) => setPuntosDeseados(Number(e.target.value))}
                    />
                    <div className="flex items-center gap-2 min-w-[130px] justify-end">
                      <span className="font-mono font-bold text-sm text-white">
                        {puntosDeseados} pts
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        (-S/ {descuentoPuntos.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {descuentoPuntos > 0 && (
                    <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1.5">
                      <i className="fa-solid fa-check"></i>
                      Descuento aplicado al total de la compra.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 4. Método de Pago y Pasarela Simulada */}
            <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold flex items-center gap-2.5 mb-6 pb-3 border-b border-white/5">
                <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                Método de Pago Seguro
              </h3>

              {/* Tabs de Selección */}
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
                    metodoPago === "Tarjeta"
                      ? "bg-brand-yellow text-black border-brand-yellow shadow-lg shadow-yellow-500/20"
                      : "bg-dark-900 text-slate-400 border-white/10 hover:text-white"
                  }`}
                  type="button"
                  onClick={() => setMetodoPago("Tarjeta")}
                >
                  <i className="fa-solid fa-credit-card"></i>
                  Tarjeta Crédito / Débito
                </button>

                <button
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
                    metodoPago === "Yape"
                      ? "bg-[#742384] text-white border-[#742384] shadow-lg shadow-purple-500/20"
                      : "bg-dark-900 text-slate-400 border-white/10 hover:text-white"
                  }`}
                  type="button"
                  onClick={() => setMetodoPago("Yape")}
                >
                  <i className="fa-solid fa-mobile-screen-button"></i>
                  Pagar con Yape
                </button>
              </div>

              {/* Formulario: Tarjeta */}
              {metodoPago === "Tarjeta" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Número de Tarjeta:
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow font-mono text-sm tracking-widest pl-12"
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="4557 1234 5678 9010"
                        type="text"
                        value={numeroTarjeta}
                        onChange={(e) => formatearTarjeta(e.target.value)}
                      />
                      <i className="fa-regular fa-credit-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Expiración (MM/AA):
                      </label>
                      <input
                        className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow font-mono text-sm tracking-widest text-center"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="12/28"
                        type="text"
                        value={vencimientoTarjeta}
                        onChange={(e) => formatearVencimiento(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        CVV / CVC (3 dígitos):
                      </label>
                      <input
                        className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow font-mono text-sm tracking-widest text-center"
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="123"
                        type="password"
                        value={cvvTarjeta}
                        onChange={(e) => {
                          const soloNums = e.target.value.replace(/\D/g, "").slice(0, 3);
                          setCvvTarjeta(soloNums);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombre del Titular:
                    </label>
                    <input
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow text-sm uppercase"
                      placeholder="COMO APARECE EN LA TARJETA"
                      type="text"
                      value={titularTarjeta}
                      onChange={(e) => {
                        const val = e.target.value;
                        const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                        if (val !== soloLetras) {
                          mostrarToast("El nombre del titular solo debe contener letras.", "error");
                        }
                        setTitularTarjeta(soloLetras.toUpperCase());
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Formulario: Yape */}
              {metodoPago === "Yape" && (
                <div className="space-y-4 animate-fade-in bg-dark-900/60 p-6 rounded-xl border border-white/5 text-center">
                  <div className="w-16 h-16 bg-[#742384] text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-purple-600/30">
                    Y
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Escanea el código QR de CineNáutica</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      O envía el monto al número <span className="text-white font-bold">948 123 456</span> a nombre de CineNáutica SAC.
                    </p>
                  </div>

                  {/* QR Box Simulado */}
                  <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-xl">
                    <i className="fa-solid fa-qrcode text-8xl text-black"></i>
                    <span className="text-[10px] text-black font-mono font-bold mt-2">
                      YAPE: S/ {totalPagar.toFixed(2)}
                    </span>
                  </div>

                  <div className="max-w-xs mx-auto text-left pt-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                      Ingresa el Código de Aprobación de tu Yape (6 dígitos):
                    </label>
                    <input
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#742384] font-mono text-center tracking-widest text-lg font-bold"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      type="text"
                      value={codigoYape}
                      onChange={(e) => setCodigoYape(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── COLUMNA DERECHA: Resumen de Compra Sticky (4 cols) ── */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-4">
            <div className="bg-dark-800 p-6 rounded-2xl border border-brand-yellow/20 shadow-2xl">
              
              <h3 className="text-lg font-bold pb-4 border-b border-white/10 flex items-center justify-between">
                <span>Resumen de tu Orden</span>
                <span className="text-xs text-brand-yellow font-bold bg-brand-yellow/10 px-2 py-0.5 rounded">
                  {nombreSede}
                </span>
              </h3>

              {/* Detalle Película (si no es dulcería directa) */}
              {!esFlujoDirecto && datosFuncion && (
                <div className="py-4 border-b border-white/5 space-y-2">
                  <div className="flex gap-3">
                    <div className="w-12 h-16 bg-dark-900 rounded-lg overflow-hidden flex-shrink-0 relative border border-white/10">
                      {datosFuncion.poster_url ? (
                        <Image
                          alt={datosFuncion.titulo_pelicula || "Película"}
                          className="object-cover"
                          fill
                          sizes="48px"
                          src={datosFuncion.poster_url}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <i className="fa-solid fa-film"></i>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white line-clamp-1">
                        {datosFuncion.titulo_pelicula || "Película"}
                      </p>
                      <p className="text-xs text-brand-yellow font-semibold">
                        {datosFuncion.formato || "2D"} • {datosFuncion.nombre_sala || "Sala"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {datosFuncion.fecha} a las {datosFuncion.hora}
                      </p>
                    </div>
                  </div>

                  {/* Asientos */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-400 mb-1">
                      Butacas ({asientosComprados.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {asientosComprados.map((a, idx) => (
                        <span
                          key={idx}
                          className="bg-brand-red/20 border border-brand-red/40 text-brand-red font-mono font-bold text-xs px-2 py-0.5 rounded"
                        >
                          {a.codigo} ({a.tipo_nombre || "General"})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Detalle Dulcería */}
              {itemsDulceria.length > 0 && (
                <div className="py-4 border-b border-white/5">
                  <p className="text-xs font-semibold text-slate-400 mb-2">
                    Productos Dulcería ({itemsDulceria.length}):
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {itemsDulceria.map((prod, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 truncate pr-2">
                          <span className="text-brand-yellow font-bold mr-1">
                            {prod.cantidad}x
                          </span>
                          {prod.nombre}
                        </span>
                        <span className="text-white font-mono whitespace-nowrap">
                          S/ {Number(prod.subtotal || prod.precio_unitario * prod.cantidad).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Desglose de Precios */}
              <div className="py-4 space-y-2 text-xs border-b border-white/10">
                {!esFlujoDirecto && (
                  <div className="flex justify-between text-slate-400">
                    <span>Entradas de Cine:</span>
                    <span className="text-white font-semibold font-mono">
                      S/ {subtotalEntradas.toFixed(2)}
                    </span>
                  </div>
                )}

                {itemsDulceria.length > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Dulcería:</span>
                    <span className="text-white font-semibold font-mono">
                      S/ {subtotalProductos.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                  <span>Subtotal:</span>
                  <span className="text-white font-semibold font-mono">
                    S/ {subtotalGeneral.toFixed(2)}
                  </span>
                </div>

                {descuentoCupon > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Cupón ({cuponAplicado?.codigo}):</span>
                    <span className="font-mono">- S/ {descuentoCupon.toFixed(2)}</span>
                  </div>
                )}

                {descuentoPuntos > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Puntos Socio ({puntosDeseados} pts):</span>
                    <span className="font-mono">- S/ {descuentoPuntos.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total Final */}
              <div className="pt-4 pb-2">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-bold text-slate-200">TOTAL A PAGAR:</span>
                  <span className="text-3xl font-black text-brand-yellow font-mono">
                    S/ {totalPagar.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 text-right">
                  Incluye IGV (18%) • Comprobante {tipoComprobante}
                </p>

                {puntosGanados > 0 && (
                  <div className="mt-3 bg-brand-yellow/10 border border-brand-yellow/20 p-2.5 rounded-xl text-center">
                    <p className="text-xs text-brand-yellow font-bold flex items-center justify-center gap-1.5">
                      <i className="fa-solid fa-gift"></i>
                      Ganarás +{puntosGanados} Puntos Náutica con esta compra
                    </p>
                  </div>
                )}
              </div>

              {/* Botón Principal de Pago */}
              <button
                className="w-full mt-4 bg-brand-yellow hover:bg-yellow-400 text-black py-4 rounded-xl font-black text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={procesandoPago || (subtotalGeneral <= 0)}
                type="button"
                onClick={manejarPago}
              >
                {procesandoPago ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>
                    <span>Procesando pago...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock text-sm"></i>
                    <span>Pagar S/ {totalPagar.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
                <i className="fa-solid fa-shield text-slate-400"></i>
                <span>Transacción encriptada con SSL 256 bits</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
