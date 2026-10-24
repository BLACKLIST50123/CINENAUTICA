// @ts-nocheck
/* Migrado desde assets/js/common.js — lógica de interfaz (solo diseño). Se reemplazará por estado React / Supabase más adelante. */
import { S } from "./nav";
declare const L: any;

/* ============================================================================
   CINE NÁUTICA — common.js
   Utilidades de interfaz compartidas por todas las páginas.
   SOLO DISEÑO: sin localStorage, sin validaciones, sin cálculos de negocio.
   ============================================================================ */
export const $ = (id?, ..._x: any[]) => document.getElementById(id) ?? document.createElement('select'); // si el elemento no existe en esta ruta, devuelve uno 'fantasma' (evita errores)
export const $$ = (sel?, root = document, ..._x: any[]) => Array.from(root.querySelectorAll(sel));

/* ---------- Toast ---------- */
export function mostrarToast(msg?, tipo = 'info', ..._x: any[]) {
    let cont = $('contenedor-toasts');
    if (!cont) { cont = document.createElement('div'); cont.id = 'contenedor-toasts'; document.body.appendChild(cont); }
    const t = document.createElement('div');
    t.className = `toast-cinerama toast-${tipo}`;
    t.textContent = msg;
    cont.appendChild(t);
    setTimeout(() => t.classList.add('toast-saliendo'), 2200);
    setTimeout(() => t.remove(), 2600);
}
export const demo = (..._x: any[]) => mostrarToast('Acción de demostración (sin lógica).', 'info');

/* ---------- Modales ---------- */
export function abrirModal(id?, ..._x: any[]) {
    const m = $(id); if (!m) return;
    m.classList.remove('hidden');
    requestAnimationFrame(() => {
        m.classList.remove('opacity-0');
        $$('.transform', m).forEach(e => e.classList.remove('scale-95'));
    });
}
export function cerrarModal(id?, ..._x: any[]) {
    const m = $(id); if (!m) return;
    m.classList.add('opacity-0');
    $$('.transform', m).forEach(e => e.classList.add('scale-95'));
    setTimeout(() => m.classList.add('hidden'), 200);
}
/* clic en el fondo oscuro cierra el modal */
/* Atajos con los nombres que usa el HTML heredado */
export const abrirModalLogin = (..._x: any[]) => abrirModal('modal-login');
export const abrirModalRegistro = (..._x: any[]) => abrirModal('modal-registro');
export const cerrarModalesAuth = (..._x: any[]) => { cerrarModal('modal-login'); cerrarModal('modal-registro'); };
export const cerrarModalPerfil = (..._x: any[]) => cerrarModal('modal-perfil');
export const abrirCarnetSocio = (..._x: any[]) => abrirModal('modal-carnet-socio');
export const cerrarCarnetSocio = (..._x: any[]) => cerrarModal('modal-carnet-socio');
export const abrirModalFuncion = (..._x: any[]) => abrirModal('modal-funcion');
export const cerrarModalFuncion = (..._x: any[]) => cerrarModal('modal-funcion');
export const abrirModalFuncionDesdeGrid = (..._x: any[]) => abrirModal('modal-funcion');
export const abrirModalPersonal = (..._x: any[]) => abrirModal('modal-personal');
export const cerrarModalPersonal = (..._x: any[]) => cerrarModal('modal-personal');
export const abrirFichaPersonal = (..._x: any[]) => abrirModal('modal-ficha-personal');
export const cerrarFichaPersonal = (..._x: any[]) => cerrarModal('modal-ficha-personal');
export const abrirModalAtencionCliente = (..._x: any[]) => abrirModal('modal-atencion-cliente');
export const cerrarModalAtencionCliente = (..._x: any[]) => cerrarModal('modal-atencion-cliente');
export const abrirModalEditarPelicula = (..._x: any[]) => abrirModal('modal-editar-pelicula');
export const cerrarModalEditarPelicula = (..._x: any[]) => cerrarModal('modal-editar-pelicula');
export const abrirModalEditarDulce = (..._x: any[]) => abrirModal('modal-editar-dulce');
export const cerrarModalEditarDulce = (..._x: any[]) => cerrarModal('modal-editar-dulce');
export const cerrarModalPromoBanner = (..._x: any[]) => cerrarModal('modal-promo-banner');
export const cerrarModalLegal = (..._x: any[]) => cerrarModal('modal-legal');
/* ---------- Acordeones (tarjetas desplegables) ---------- */
export function toggleAcc(head?, ..._x: any[]) {
    const acc = head.closest('.acc');
    acc.classList.toggle('open');
    head.setAttribute('aria-expanded', acc.classList.contains('open'));
}
export function accTodo(contenedorId?, abrir?, ..._x: any[]) {
    $$('.acc', $(contenedorId)).forEach(a => a.classList.toggle('open', abrir));
}

/* ---------- Pestañas genéricas: botones [data-tab="grupo:nombre"], paneles [data-panel="grupo:nombre"] ---------- */
export function cambiarTab(grupo?, nombre?, ..._x: any[]) {
    $$(`[data-panel^="${grupo}:"]`).forEach(p => p.classList.toggle('hidden', p.dataset.panel !== `${grupo}:${nombre}`));
    $$(`[data-tab^="${grupo}:"]`).forEach(b => b.classList.toggle('activo', b.dataset.tab === `${grupo}:${nombre}`));
    const bc = document.querySelector(`[data-breadcrumb="${grupo}"]`);
    const btn = document.querySelector(`[data-tab="${grupo}:${nombre}"]`);
    if (bc && btn) bc.textContent = btn.dataset.label || btn.textContent.trim();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Chips (géneros / formatos): solo alternan color ---------- */
/* ---------- Segmentados genéricos: [data-seg="grupo"] con botones [data-val] ---------- */
export function segmento(btn?, ..._x: any[]) {
    const grupo = btn.closest('[data-seg]');
    $$('.seg-btn', grupo).forEach(b => b.classList.toggle('activo', b === btn));
}

/* ---------- Asientos: marca y redibuja el resumen (solo visual) ---------- */
export function resumenAsientos(gridId?, contId?, totalId?, precio = 18, ..._x: any[]) {
    const sel = $$(`#${gridId} .seat.selected`);
    $(contId).innerHTML = sel.length
        ? sel.map(s => `<div class="flex justify-between text-sm text-slate-300 mb-2"><span><i class="fa-solid fa-chair text-brand-yellow mr-2"></i>${s.dataset.id} <span class="text-slate-500">· General</span></span><span class="text-white font-semibold">S/ ${precio.toFixed(2)}</span></div>`).join('')
        : '<p class="text-slate-500 text-sm text-center italic mt-4">Aún no has seleccionado asientos.</p>';
    if (totalId) $(totalId).textContent = `S/ ${(sel.length * precio).toFixed(2)}`;
}
export function clickAsientoGenerico(btn?, gridId?, contId?, totalId?, ..._x: any[]) {
    btn.classList.toggle('selected'); btn.classList.toggle('bg-green-600');
    resumenAsientos(gridId, contId, totalId);
}

/* ---------- Cantidad (+/-) ---------- */
export function cambiarCantidad(btn?, d?, ..._x: any[]) {
    const span = btn.parentElement.querySelector('span');
    span.textContent = Math.max(0, (parseInt(span.textContent, 10) || 0) + d);
    btn.dispatchEvent(new CustomEvent('cantidad-producto-cambiada', { bubbles: true }));
}


/* ---------- Stubs: botones de "demostración" sin lógica detrás ---------- */
/* ---------- Menú de usuario del personal ---------- */
export function toggleMenuUsuario(..._x: any[]) { $('menu-usuario-dd').classList.toggle('hidden'); }
/* ---------- Stubs: botones de "demostración" sin lógica detrás ---------- */
export function stubDemo(n: string) {
    return (...a: any[]) => {
        const ev = a.find((x) => x && x.preventDefault); if (ev) ev.preventDefault();
        if (n === 'guardarFuncionAdmin') cerrarModalFuncion();
        if (n === 'guardarPersonalAdmin') cerrarModalPersonal();
        if (n === 'guardarEdicionPeliculaAdmin') cerrarModalEditarPelicula();
        if (n === 'guardarEdicionDulceAdmin') cerrarModalEditarDulce();
        if (n === 'guardarPrecioSede') cerrarModal('modal-precio-dulce');
        if (n === 'guardarSede') cerrarModal('modal-nueva-sede');
        if (n === 'guardarCuponSede') cerrarModal('modal-cupon-sede');
        if (n === 'guardarTarifaEspecial') cerrarModal('modal-tarifa-especial');
        demo();
    };
}
export const copiarCodigoSocio = stubDemo('copiarCodigoSocio');
export const aplicarCupon = stubDemo('aplicarCupon');
export const aplicarPuntosSocio = stubDemo('aplicarPuntosSocio');
export const aplicarCumpleanosSocio = stubDemo('aplicarCumpleanosSocio');
export const descargarPDF = stubDemo('descargarPDF');
export const guardarProductoDulceriaAdmin = stubDemo('guardarProductoDulceriaAdmin');
export const guardarFuncionAdmin = stubDemo('guardarFuncionAdmin');
export const guardarEdicionPeliculaAdmin = stubDemo('guardarEdicionPeliculaAdmin');
export const guardarEdicionDulceAdmin = stubDemo('guardarEdicionDulceAdmin');
export const guardarPersonalAdmin = stubDemo('guardarPersonalAdmin');
export const crearCuponAdmin = stubDemo('crearCuponAdmin');
export const crearPeliculaAdmin = stubDemo('crearPeliculaAdmin');
export const crearCategoriaDulceriaAdmin = stubDemo('crearCategoriaDulceriaAdmin');
export const guardarCambiosSala = stubDemo('guardarCambiosSala');
export const restablecerCambiosSala = stubDemo('restablecerCambiosSala');
export const generarMatriz = stubDemo('generarMatriz');
export const agregarFormatoAdmin = stubDemo('agregarFormatoAdmin');
export const agregarTipoEntradaAdmin = stubDemo('agregarTipoEntradaAdmin');
export const buscarOrdenAtencionCliente = stubDemo('buscarOrdenAtencionCliente');
export const generarContrasenaPersonalAdmin = stubDemo('generarContrasenaPersonalAdmin');
export const actualizarCategoriasDulceriaAdmin = stubDemo('actualizarCategoriasDulceriaAdmin');
export const abrirHorariosDesdeEdicion = stubDemo('abrirHorariosDesdeEdicion');
export const validarCumpleanosAdmin = stubDemo('validarCumpleanosAdmin');
export const guardarPrecioSede = stubDemo('guardarPrecioSede');
export const guardarSede = stubDemo('guardarSede');
export const guardarCuponSede = stubDemo('guardarCuponSede');
export const guardarTarifaEspecial = stubDemo('guardarTarifaEspecial');
export const imprimirTicket = stubDemo('imprimirTicket');
export const restringirSoloNumeros = (..._a: any[]) => { };
export const formatearNumeroTarjetaEnVivo = (..._a: any[]) => { };
export const formatearVencimientoTarjetaEnVivo = (..._a: any[]) => { };
export const actualizarPreviewImagenAdmin = (..._a: any[]) => { };
export const actualizarPreviewImagenArchivo = (..._a: any[]) => { };
export const filtrarListaSociosAdmin = (..._a: any[]) => { };
export const renderizarAdminPersonal = (..._a: any[]) => { };
export const renderizarAdminDulceria = (..._a: any[]) => { };
export const renderizarAdminCartelera = (..._a: any[]) => { };
export const datepickerCambiarMes = (..._a: any[]) => { };
export const clickMatrizEstructura = (..._a: any[]) => { };
export const alCambiarDatosFuncion = (..._a: any[]) => { };
export const alCambiarPeliculaFuncion = (..._a: any[]) => { };
export const cambiarSalaMantenimiento = (..._a: any[]) => { };
export const actualizarLanzamientoVisibleEdicion = (..._a: any[]) => { };
export const renderDashboardData = (..._a: any[]) => { };

let __inited = false;
export function init() {
    if (__inited || typeof document === "undefined") return;
    __inited = true;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $$('[id^="modal-"]:not(.hidden)').forEach(m => {
                if (m.id === 'modal-trailer') {
                    const iframe = document.getElementById('trailer-iframe') as HTMLIFrameElement | null;
                    if (iframe) iframe.src = '';
                }
                cerrarModal(m.id);
            });
        }
    });
    document.addEventListener('mousedown', (e) => {
        if (e.target.id && e.target.id.startsWith('modal-') && e.target.classList.contains('fixed')) {
            // El trailer solo se cierra con la 'X' para evitar cierres accidentales y fuga de audio
            if (e.target.id === 'modal-trailer') return;
            cerrarModal(e.target.id);
        }
    });
    
    document.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip-selector');
        if (chip) chip.classList.toggle('chip-selector-activo');
    });
    
    document.addEventListener('click', (e) => {
        const dd = $('menu-usuario-dd');
        if (dd && !dd.classList.contains('hidden') && !e.target.closest('#menu-usuario-dd') && !e.target.closest('[onclick="toggleMenuUsuario()"]')) dd.classList.add('hidden');
    });
    
    
}

export function onMount() {

}
