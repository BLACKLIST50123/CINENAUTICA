/* ============================================================================
   CINE NÁUTICA — nav.ts
   Navegación del cliente (reemplaza a cambiarVista() del proyecto nativo).
   Antes: una sola página con vistas ocultas/mostradas por JS.
   Ahora: cada vista es una RUTA de Next.js y se navega con el router.
   ============================================================================ */
import { $, abrirModal, cerrarModal, mostrarToast } from "./common";

type RouterLike = { push: (href: string) => void };
let _router: RouterLike | null = null;
export const setRouter = (r: RouterLike) => { _router = r; };
export const go = (href: string) => {
    if (_router) _router.push(href);
    else if (typeof window !== "undefined") window.location.href = href;
};

/* id de vista (proyecto nativo)  ->  ruta de Next.js */
export const RUTAS: Record<string, string> = {
    "vista-inicio": "/",
    "vista-asientos": "/asientos",
    "vista-dulceria": "/dulceria",
    "vista-pago": "/pago",
    "vista-ticket": "/ticket",
    "vista-historial": "/historial",
    "vista-beneficios": "/socio",
    "vista-promociones": "/promociones",
    "vista-ubicacion": "/ubicacion",
    "vista-contacto": "/contacto",
};

/* Estado de navegación que sobrevive entre rutas (vive en memoria mientras no se recargue) */
export const SEL: any = { peli: "spiderman", sede: "s1", fecha: "d0", formato: "2D Doblada", hora: "19:00", sala: 1 };
export const S: any = { dulceria: false, contactoPrev: "/", sesion: false, sedeNav: undefined as string | undefined };

export function rutaDe(vista: string): string {
    if (vista === "vista-detalle-pelicula") return `/pelicula/${SEL.peli}`;
    return RUTAS[vista] ?? "/";
}
/* equivalente a la antigua variable vistaActualVisible */
export function vistaActual(): string {
    if (typeof window === "undefined") return "vista-inicio";
    const p = window.location.pathname;
    if (p.startsWith("/pelicula/")) return "vista-detalle-pelicula";
    const hit = Object.entries(RUTAS).find(([, r]) => r === p);
    return hit ? hit[0] : "vista-inicio";
}

export function cambiarVista(_desde: string | null, hacia: string) { go(rutaDe(hacia)); }

let _accionSalirPendiente: (() => void) | null = null;

export function tieneCompraActiva(): boolean {
    if (typeof window === "undefined") return false;
    // Si la ruta es /ticket, la compra ya finalizó y no debe advertir de salida
    if (window.location.pathname.startsWith("/ticket")) return false;

    // 1. Asientos seleccionados (flujo de cine)
    if ((window as any).__tieneAsientosSeleccionados) return true;
    try {
        const rawAsientos = sessionStorage.getItem("cinenautica_asientos_seleccionados");
        if (rawAsientos) {
            const data = JSON.parse(rawAsientos);
            if (data.asientos && data.asientos.length > 0) return true;
        }
        if (SEL.asientos && SEL.asientos.length > 0) return true;
    } catch {}

    // 2. Productos de dulcería seleccionados (flujo directo de dulcería o carrito con snacks)
    if ((window as any).__tieneProductosDulceriaSeleccionados) return true;
    try {
        const rawDulces = sessionStorage.getItem("cinenautica_dulceria_seleccion");
        if (rawDulces) {
            const data = JSON.parse(rawDulces);
            if (Array.isArray(data.items) && data.items.length > 0) return true;
            if (Number(data.total_productos) > 0) return true;
        }
        if (Array.isArray(SEL.dulces) && SEL.dulces.length > 0) return true;
    } catch {}

    return false;
}

export function intentarSalirDelFlujoDeCompra(accion: () => void) {
    if (tieneCompraActiva()) {
        _accionSalirPendiente = accion;
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("solicitar-confirmacion-salir-compra"));
        }
    } else {
        accion();
    }
}

export function ejecutarSalirDelFlujoDeCompra() {
    const cb = _accionSalirPendiente;
    _accionSalirPendiente = null;
    if (cb) cb();
    else go("/");
}

export function limpiarEstadoCompraGlobal() {
    if (typeof window !== "undefined") {
        try {
            sessionStorage.removeItem("cinenautica_asientos_seleccionados");
            sessionStorage.removeItem("cinenautica_seleccion_funcion");
            sessionStorage.removeItem("cinenautica_dulceria_seleccion");
            sessionStorage.removeItem("cinenautica_flujo_dulceria_directo");
            sessionStorage.removeItem("cinenautica_sede_id");
            sessionStorage.removeItem("cinenautica_sede_nombre");
        } catch {}
        (window as any).__tieneAsientosSeleccionados = false;
        (window as any).__tieneProductosDulceriaSeleccionados = false;
        window.dispatchEvent(new CustomEvent("asientos-liberados-sesion"));
        window.dispatchEvent(new CustomEvent("cambio-flujo-compra"));
    }
    S.dulceria = false;
    SEL.asientos = [];
    SEL.total_asientos = 0;
    SEL.dulces = [];
    SEL.total_dulces = 0;
    delete SEL.id_funcion;
    delete SEL.id_sala;
    delete SEL.sala;
    delete SEL.nombre_sala;
    delete SEL.hora;
    delete SEL.formato;
    delete SEL.dia_label;
    delete SEL.id_sede;
    delete SEL.nombre_sede;
    delete SEL.peli;
}

export function cancelarSalirDelFlujoDeCompra() {
    _accionSalirPendiente = null;
    if (typeof window !== "undefined" && tieneCompraActiva()) {
        window.history.pushState({ cinenauticaCompraActiva: true }, "", window.location.href);
    }
}

export const abrirVistaPromociones = () => go("/promociones");
export const abrirVistaUbicacion = () => go("/ubicacion");
export const abrirMisCompras = () => {
    let sesionActiva = false;
    if (typeof window !== "undefined") {
        try {
            const raw = localStorage.getItem("cinenautica_usuario") || sessionStorage.getItem("cinenautica_usuario");
            if (raw) sesionActiva = true;
        } catch {}
    }
    go(sesionActiva ? "/socio?tab=compras" : "/historial");
};
export const irAVistaContacto = () => { S.contactoPrev = window.location.pathname; go("/contacto"); };
export const manejarFormularioContacto = (e: any) => {
    e.preventDefault(); mostrarToast("Mensaje enviado (demostración).", "exito"); go(S.contactoPrev || "/");
};

export function abrirDetallePelicula(id: string, _origen?: string) { S.dulceria = false; SEL.peli = id; go(`/pelicula/${id}`); }
export const irAAsientos = (id?: string) => go(id ? `/asientos?funcion=${id}` : (SEL.id_funcion ? `/asientos?funcion=${SEL.id_funcion}` : "/asientos"));
export const irADulceria = () => { S.dulceria = false; go("/dulceria"); };
export const irAPago = () => go("/pago");
export const procesarPago = () => go("/ticket");
export const abrirDulceriaDirecta = (idSede?: string, nombreSede?: string) => {
    S.dulceria = true;
    if (typeof window !== "undefined") {
        try {
            sessionStorage.setItem("cinenautica_flujo_dulceria_directo", "true");
            if (idSede) sessionStorage.setItem("cinenautica_sede_id", idSede);
            if (nombreSede) sessionStorage.setItem("cinenautica_sede_nombre", nombreSede);
            sessionStorage.removeItem("cinenautica_asientos_seleccionados");
            sessionStorage.removeItem("cinenautica_seleccion_funcion");
            window.dispatchEvent(new CustomEvent("cambio-flujo-compra"));
        } catch {}
    }
    go(idSede ? `/dulceria?sede=${idSede}` : "/dulceria");
};

/* Dulcería directa: el modal pide sede y luego entra a /dulceria */
export function pedirSedeParaDulceria() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("abrir-modal-dulceria-sede"));
    }
    abrirModal("modal-dulceria-sede");
}
export function confirmarSedeDulceria(idSede?: string, nombreSede?: string) {
    cerrarModal("modal-dulceria-sede");
    const id = idSede || (($("dulceria-sede") as HTMLSelectElement)?.value);
    if (!id) return;
    SEL.sede = id; S.sedeNav = id;
    if (nombreSede) SEL.nombre_sede = nombreSede;
    abrirDulceriaDirecta(id, nombreSede);
}

/* Cambiar de sede desde el modal del navbar / mapa: vuelve al inicio con el filtro aplicado */
export function elegirSedeNav(id?: string) {
    cerrarModal("modal-sede");
    S.sedeNav = id || "";
    if (id) SEL.sede = id;
    go("/");
}
export const cerrarSesionCliente = () => { S.sesion = false; go("/"); };
/* Cerrar sesión: staff vuelve a /acceso, cliente a inicio */
export function cerrarSesion() {
    const p = typeof window !== "undefined" ? window.location.pathname : "/";
    if (p.startsWith("/admin") || p.startsWith("/counter")) go("/acceso");
    else cerrarSesionCliente();
}
