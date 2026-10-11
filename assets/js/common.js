/* ============================================================================
   CINE NÁUTICA — common.js
   Utilidades de interfaz compartidas por todas las páginas.
   SOLO DISEÑO: sin localStorage, sin validaciones, sin cálculos de negocio.
   ============================================================================ */
const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Toast ---------- */
function mostrarToast(msg, tipo = 'info') {
    let cont = $('contenedor-toasts');
    if (!cont) { cont = document.createElement('div'); cont.id = 'contenedor-toasts'; document.body.appendChild(cont); }
    const t = document.createElement('div');
    t.className = `toast-cinerama toast-${tipo}`;
    t.textContent = msg;
    cont.appendChild(t);
    setTimeout(() => t.classList.add('toast-saliendo'), 2200);
    setTimeout(() => t.remove(), 2600);
}
const demo = () => mostrarToast('Acción de demostración (sin lógica).', 'info');

/* ---------- Modales ---------- */
function abrirModal(id) {
    const m = $(id); if (!m) return;
    m.classList.remove('hidden');
    requestAnimationFrame(() => {
        m.classList.remove('opacity-0');
        $$('.transform', m).forEach(e => e.classList.remove('scale-95'));
    });
}
function cerrarModal(id) {
    const m = $(id); if (!m) return;
    m.classList.add('opacity-0');
    $$('.transform', m).forEach(e => e.classList.add('scale-95'));
    setTimeout(() => m.classList.add('hidden'), 200);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $$('[id^="modal-"]:not(.hidden)').forEach(m => cerrarModal(m.id));
});
/* clic en el fondo oscuro cierra el modal */
document.addEventListener('mousedown', (e) => {
    if (e.target.id && e.target.id.startsWith('modal-') && e.target.classList.contains('fixed')) cerrarModal(e.target.id);
});

/* Atajos con los nombres que usa el HTML heredado */
const abrirModalLogin = () => abrirModal('modal-login');
const abrirModalRegistro = () => abrirModal('modal-registro');
const cerrarModalesAuth = () => { cerrarModal('modal-login'); cerrarModal('modal-registro'); };
const cerrarModalPerfil = () => cerrarModal('modal-perfil');
const abrirCarnetSocio = () => abrirModal('modal-carnet-socio');
const cerrarCarnetSocio = () => cerrarModal('modal-carnet-socio');
const abrirModalFuncion = () => abrirModal('modal-funcion');
const cerrarModalFuncion = () => cerrarModal('modal-funcion');
const abrirModalFuncionDesdeGrid = () => abrirModal('modal-funcion');
const abrirModalPersonal = () => abrirModal('modal-personal');
const cerrarModalPersonal = () => cerrarModal('modal-personal');
const abrirFichaPersonal = () => abrirModal('modal-ficha-personal');
const cerrarFichaPersonal = () => cerrarModal('modal-ficha-personal');
const abrirModalAtencionCliente = () => abrirModal('modal-atencion-cliente');
const cerrarModalAtencionCliente = () => cerrarModal('modal-atencion-cliente');
const abrirModalEditarPelicula = () => abrirModal('modal-editar-pelicula');
const cerrarModalEditarPelicula = () => cerrarModal('modal-editar-pelicula');
const abrirModalEditarDulce = () => abrirModal('modal-editar-dulce');
const cerrarModalEditarDulce = () => cerrarModal('modal-editar-dulce');
const cerrarModalPromoBanner = () => cerrarModal('modal-promo-banner');
const cerrarModalLegal = () => cerrarModal('modal-legal');
function cerrarSesion() { window.location.href = 'acceso.html'; }

/* ---------- Acordeones (tarjetas desplegables) ---------- */
function toggleAcc(head) {
    const acc = head.closest('.acc');
    acc.classList.toggle('open');
    head.setAttribute('aria-expanded', acc.classList.contains('open'));
}
function accTodo(contenedorId, abrir) {
    $$('.acc', $(contenedorId)).forEach(a => a.classList.toggle('open', abrir));
}

/* ---------- Pestañas genéricas: botones [data-tab="grupo:nombre"], paneles [data-panel="grupo:nombre"] ---------- */
function cambiarTab(grupo, nombre) {
    $$(`[data-panel^="${grupo}:"]`).forEach(p => p.classList.toggle('hidden', p.dataset.panel !== `${grupo}:${nombre}`));
    $$(`[data-tab^="${grupo}:"]`).forEach(b => b.classList.toggle('activo', b.dataset.tab === `${grupo}:${nombre}`));
    const bc = document.querySelector(`[data-breadcrumb="${grupo}"]`);
    const btn = document.querySelector(`[data-tab="${grupo}:${nombre}"]`);
    if (bc && btn) bc.textContent = btn.dataset.label || btn.textContent.trim();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Chips (géneros / formatos): solo alternan color ---------- */
document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-selector');
    if (chip) chip.classList.toggle('chip-selector-activo');
});

/* ---------- Segmentados genéricos: [data-seg="grupo"] con botones [data-val] ---------- */
function segmento(btn) {
    const grupo = btn.closest('[data-seg]');
    $$('.seg-btn', grupo).forEach(b => b.classList.toggle('activo', b === btn));
}

/* ---------- Asientos: marca y redibuja el resumen (solo visual) ---------- */
function resumenAsientos(gridId, contId, totalId, precio = 18) {
    const sel = $$(`#${gridId} .seat.selected`);
    $(contId).innerHTML = sel.length
        ? sel.map(s => `<div class="flex justify-between text-sm text-slate-300 mb-2"><span><i class="fa-solid fa-chair text-brand-yellow mr-2"></i>${s.dataset.id} <span class="text-slate-500">· General</span></span><span class="text-white font-semibold">S/ ${precio.toFixed(2)}</span></div>`).join('')
        : '<p class="text-slate-500 text-sm text-center italic mt-4">Aún no has seleccionado asientos.</p>';
    if (totalId) $(totalId).textContent = `S/ ${(sel.length * precio).toFixed(2)}`;
}
function clickAsientoGenerico(btn, gridId, contId, totalId) {
    btn.classList.toggle('selected'); btn.classList.toggle('bg-green-600');
    resumenAsientos(gridId, contId, totalId);
}

/* ---------- Cantidad (+/-) ---------- */
function cambiarCantidad(btn, d) {
    const span = btn.parentElement.querySelector('span');
    span.textContent = Math.max(0, (parseInt(span.textContent, 10) || 0) + d);
    btn.dispatchEvent(new CustomEvent('cantidad-producto-cambiada', { bubbles: true }));
}

/* ---------- Navegador de pantallas (ayuda de revisión de diseño) ---------- */
function toggleNavegadorPantallas() { $('navegador-pantallas').classList.toggle('translate-x-full'); }

/* ---------- Stubs: botones de "demostración" sin lógica detrás ---------- */
['copiarCodigoSocio', 'aplicarCupon', 'aplicarPuntosSocio', 'aplicarCumpleanosSocio', 'guardarMetodoPago', 'descargarPDF',
    'guardarProductoDulceriaAdmin', 'guardarFuncionAdmin', 'guardarEdicionPeliculaAdmin', 'guardarEdicionDulceAdmin',
    'guardarPersonalAdmin', 'crearCuponAdmin', 'crearPeliculaAdmin', 'crearCategoriaDulceriaAdmin', 'guardarCambiosSala', 'restablecerCambiosSala',
    'generarMatriz', 'agregarFormatoAdmin', 'agregarTipoEntradaAdmin', 'eliminarFuncionAdminActual', 'buscarOrdenAtencionCliente',
    'generarContrasenaPersonalAdmin', 'alternarVerContrasenaFicha', 'actualizarCategoriasDulceriaAdmin', 'abrirHorariosDesdeEdicion',
    'validarCumpleanosAdmin', 'guardarPrecioSede', 'guardarSede', 'guardarCuponSede', 'guardarTarifaEspecial', 'imprimirTicket'
].forEach(n => {
    if (typeof window[n] === 'undefined') {
        window[n] = (...a) => {
            const ev = a.find(x => x && x.preventDefault); if (ev) ev.preventDefault();
            if (n === 'guardarFuncionAdmin' || n === 'eliminarFuncionAdminActual') cerrarModalFuncion();
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
});
['restringirSoloNumeros', 'formatearNumeroTarjetaEnVivo', 'formatearVencimientoTarjetaEnVivo', 'actualizarPreviewImagenAdmin',
    'actualizarPreviewImagenArchivo', 'filtrarListaSociosAdmin', 'renderizarAdminPersonal', 'renderizarAdminDulceria', 'renderizarAdminCartelera',
    'datepickerCambiarMes', 'clickMatrizEstructura', 'alCambiarDatosFuncion', 'alCambiarPeliculaFuncion', 'cambiarSalaMantenimiento',
    'toggleEstadoSalaAdmin', 'actualizarLanzamientoVisibleEdicion', 'renderDashboardData'
].forEach(n => { if (typeof window[n] === 'undefined') window[n] = () => { }; });

/* ---------- Menú de usuario del personal ---------- */
function toggleMenuUsuario() { $('menu-usuario-dd').classList.toggle('hidden'); }
document.addEventListener('click', (e) => {
    const dd = $('menu-usuario-dd');
    if (dd && !dd.classList.contains('hidden') && !e.target.closest('#menu-usuario-dd') && !e.target.closest('[onclick="toggleMenuUsuario()"]')) dd.classList.add('hidden');
});

