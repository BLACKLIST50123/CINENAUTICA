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
export const intentarSalirDelFlujoDeCompra = (a: () => void) => a();
export const abrirVistaPromociones = () => go("/promociones");
export const abrirVistaUbicacion = () => go("/ubicacion");
export const abrirMisCompras = () => go("/historial");
export const irAVistaContacto = () => { S.contactoPrev = window.location.pathname; go("/contacto"); };
export const manejarFormularioContacto = (e: any) => {
    e.preventDefault(); mostrarToast("Mensaje enviado (demostración).", "exito"); go(S.contactoPrev || "/");
};

export function abrirDetallePelicula(id: string, _origen?: string) { S.dulceria = false; SEL.peli = id; go(`/pelicula/${id}`); }
export const irAAsientos = () => go("/asientos");
export const irADulceria = () => { S.dulceria = false; go("/dulceria"); };
export const irAPago = () => go("/pago");
export const procesarPago = () => go("/ticket");
export const abrirDulceriaDirecta = () => { S.dulceria = true; go("/dulceria"); };

/* Dulcería directa: el modal pide sede y luego entra a /dulceria */
export function pedirSedeParaDulceria() {
    const ciu = $("dulceria-ciudad") as HTMLSelectElement, sed = $("dulceria-sede") as HTMLSelectElement;
    ciu.value = ""; sed.value = ""; sed.disabled = true;
    ([...sed.options] as HTMLOptionElement[]).forEach(o => { o.hidden = false; });
    ($("btn-confirmar-sede-dulceria") as HTMLButtonElement).disabled = true;
    abrirModal("modal-dulceria-sede");
}
export function confirmarSedeDulceria() {
    const id = ($("dulceria-sede") as HTMLSelectElement).value;
    if (!id) return;
    cerrarModal("modal-dulceria-sede");
    SEL.sede = id; S.sedeNav = id;
    abrirDulceriaDirecta();
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
