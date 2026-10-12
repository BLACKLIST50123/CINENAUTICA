// @ts-nocheck
/* Migrado desde assets/js/counter.js — lógica de interfaz (solo diseño). Se reemplazará por estado React / Supabase más adelante. */
import { $, $$, mostrarToast, cerrarModal, resumenAsientos } from "./common";
import { S } from "./nav";
declare const L: any;

/* ============================================================================
   CINE NÁUTICA — counter.js (POS del local) — solo diseño
   Navega entre pantallas de la venta y alterna paneles visuales. Sin lógica de negocio.
   ============================================================================ */
export const PELIS = {
    'spiderman': 'Spider-Man: Un Nuevo Día', 'endgame-bonus': 'Avengers: Endgame Encore', 're-noche-cero': 'Resident Evil: Noche Cero',
    'coyote-acme': 'Coyote vs. Acme', 'sombra-exorcista': 'La Sombra del Exorcista', 'demonio': 'La Noche del Demonio'
};
export const VISTAS = ['cv-inicio', 'cv-asientos', 'cv-dulceria', 'cv-pago', 'cv-ok'];
export const CTA = { 'cv-asientos': ['Continuar a dulcería', 'cv-dulceria'], 'cv-dulceria': ['Continuar al cobro', 'cv-pago'], 'cv-pago': ['Cobrar', 'cv-ok'] };
export let vistaC = 'cv-inicio';
export let ventaSoloDulceria = false;

export function productosSeleccionadosCounter(..._x: any[]) {
    return $$('#grid-prod-c [data-cat]').map(card => {
        const nombre = card.querySelector('p.text-white.font-bold.text-sm')?.textContent.trim() || '';
        const precioTexto = card.querySelector('p.text-brand-yellow.font-bold.text-sm')?.textContent || '';
        const cantidadTexto = card.querySelector('.rounded-full > span')?.textContent || '0';
        const precio = Number(precioTexto.replace(/[^\d.]/g, '')) || 0;
        const cantidad = Number.parseInt(cantidadTexto, 10) || 0;
        return { nombre, precio, cantidad };
    }).filter(producto => producto.cantidad > 0);
}
export function totalDulceriaCounter(..._x: any[]) {
    return productosSeleccionadosCounter().reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
}
export function totalVentaCounter(..._x: any[]) {
    const dulceria = totalDulceriaCounter();
    if (ventaSoloDulceria) return dulceria;
    return (Number($('c-total-entradas').textContent.replace(/[^\d.]/g, '')) || 0) + dulceria;
}
export function actualizarResumenVentaCounter(..._x: any[]) {
    const productos = productosSeleccionadosCounter();
    const lista = $('c-lista-dulceria');
    lista.replaceChildren();
    if (!productos.length) {
        const vacio = document.createElement('p');
        vacio.className = 'text-slate-500 text-sm';
        vacio.textContent = 'Aún no hay productos seleccionados.';
        lista.appendChild(vacio);
    } else {
        productos.forEach(producto => {
            const fila = document.createElement('div');
            fila.className = 'flex justify-between text-sm text-slate-300 gap-3';
            const nombre = document.createElement('span');
            nombre.className = 'min-w-0';
            nombre.textContent = `${producto.cantidad}x ${producto.nombre}`;
            const precio = document.createElement('span');
            precio.className = 'text-white font-semibold flex-shrink-0';
            precio.textContent = `S/ ${(producto.precio * producto.cantidad).toFixed(2)}`;
            fila.append(nombre, precio);
            lista.appendChild(fila);
        });
    }
    const dulceria = totalDulceriaCounter();
    $('c-total-dulceria').textContent = `S/ ${dulceria.toFixed(2)}`;
    $('c-total-general').textContent = `S/ ${totalVentaCounter().toFixed(2)}`;
    $('c-resumen-funcion').classList.toggle('hidden', ventaSoloDulceria);
    $('c-resumen-entradas').classList.toggle('hidden', ventaSoloDulceria);
    $('c-subtotal-entradas').classList.toggle('hidden', ventaSoloDulceria);
    $('titulo-panel-venta').textContent = ventaSoloDulceria ? 'Pedido de dulcería' : 'Venta en curso';
    if (vistaC === 'cv-pago') actualizarImporteCobroCounter();
}
export function reiniciarProductosCounter(..._x: any[]) {
    $$('#grid-prod-c [data-cat] .rounded-full > span').forEach(cantidad => { cantidad.textContent = '0'; });
}
export function actualizarImporteCobroCounter(..._x: any[]) {
    const total = totalVentaCounter();
    const texto = `S/ ${total.toFixed(2)}`;
    ['counter-monto-cobro', 'counter-monto-yape'].forEach(id => { if ($(id)) $(id).textContent = texto; });
    $('cta').innerHTML = `Cobrar ${texto} <i class="fa-solid fa-check"></i>`;
    if ($('monto-recibido')) calcVuelto();
}

export function irCounter(id?, ..._x: any[]) {
    VISTAS.forEach(v => $(v).classList.toggle('hidden', v !== id));
    vistaC = id;
    const hayVenta = id !== 'cv-inicio';
    $('panel-vacio').classList.toggle('hidden', hayVenta); $('panel-detalle').classList.toggle('hidden', !hayVenta);
    const cta = $('cta'), c = CTA[id];
    $('panel-detalle').querySelector('#cta').parentElement.classList.toggle('hidden', id === 'cv-ok');
    if (c) cta.innerHTML = `${c[0]} <i class="fa-solid ${id === 'cv-pago' ? 'fa-check' : 'fa-arrow-right'}"></i>`;
    cta.className = `w-full ${id === 'cv-pago' ? 'bg-green-600 hover:bg-green-500' : 'bg-brand-blue hover:bg-brand-dark-blue'} text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2`;
    actualizarResumenVentaCounter();
    if (id === 'cv-pago') actualizarImporteCobroCounter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
export const siguienteCounter = (..._x: any[]) => { const c = CTA[vistaC]; if (c) irCounter(c[1]); };
export function iniciarVenta(pid?, hora?, formato?, sala?, ..._x: any[]) {
    ventaSoloDulceria = false;
    reiniciarProductosCounter();
    $$('[data-c="titulo"]').forEach(e => e.textContent = PELIS[pid]);
    $$('[data-c="hora"]').forEach(e => e.textContent = hora);
    $$('[data-c="formato"]').forEach(e => e.textContent = formato);
    $$('[data-c="sala"]').forEach(e => e.textContent = sala);
    $('btn-volver-asientos-c').classList.remove('hidden');
    irCounter('cv-asientos');
}
export function iniciarSoloDulceria(..._x: any[]) {
    ventaSoloDulceria = true;
    reiniciarProductosCounter();
    $('btn-volver-asientos-c').classList.add('hidden');
    irCounter('cv-dulceria');
}
export const cancelarVenta = (..._x: any[]) => irCounter('cv-inicio');
export const nuevaVenta = (..._x: any[]) => irCounter('cv-inicio');

/* Funciones: vista por película / por hora y filtros de prueba */
export function vistaCounter(v?, ..._x: any[]) { $('cv-peli').classList.toggle('hidden', v !== 'peli'); $('cv-hora').classList.toggle('hidden', v !== 'hora'); }
export function filtrarFmtC(btn?, fmt?, ..._x: any[]) {
    $$('#fmt-chips button').forEach(b => { const on = b === btn; b.classList.toggle('bg-brand-blue', on); b.classList.toggle('text-white', on); b.classList.toggle('border-brand-blue', on); b.classList.toggle('bg-dark-900', !on); b.classList.toggle('text-slate-300', !on); b.classList.toggle('border-white/10', !on); });
    $$('#cv-peli article').forEach(a => { a.style.display = (fmt === 'Todos' || a.dataset.fmt.includes(fmt)) ? '' : 'none'; });
}
export function filtrarCatC(btn?, cat?, ..._x: any[]) {
    $$('#cats-c button').forEach(b => { const on = b === btn; b.classList.toggle('bg-brand-yellow', on); b.classList.toggle('text-black', on); b.classList.toggle('border-brand-yellow', on); b.classList.toggle('bg-dark-900', !on); b.classList.toggle('text-slate-300', !on); b.classList.toggle('border-white/10', !on); });
    $$('#grid-prod-c [data-cat]').forEach(p => { p.style.display = (cat === 'all' || p.dataset.cat === cat) ? '' : 'none'; });
}
export function cambiarComprobanteCounter(tipo?, ..._x: any[]) {
    const campos = {
        'counter-boleta-dni': tipo === 'boleta',
        'counter-boleta-nombre': tipo === 'boleta',
        'counter-factura-ruc': tipo === 'factura',
        'counter-factura-razon': tipo === 'factura'
    };
    Object.entries(campos).forEach(([id, visible]) => $(id).classList.toggle('hidden', !visible));
}

/* Asientos */
export function clickAsientoC(btn?, ..._x: any[]) {
    btn.classList.toggle('selected'); btn.classList.toggle('bg-green-600');
    resumenAsientos('c-grid-asientos', 'c-lista-entradas', 'c-total-entradas');
    actualizarResumenVentaCounter();
}

/* Cobro: paneles por método y vuelto (cálculo mínimo de prueba) */
export function metodoC(m?, ..._x: any[]) { ['efectivo', 'tarjeta', 'yape', 'mixto'].forEach(k => $('m-' + k).classList.toggle('hidden', k !== m)); }
export function billete(v?, ..._x: any[]) { $('monto-recibido').value = v; calcVuelto(); }
export function calcVuelto(..._x: any[]) { const v = Math.max(0, (parseFloat($('monto-recibido').value) || 0) - totalVentaCounter()); $('vuelto').textContent = `S/ ${v.toFixed(2)}`; }

/* Socio vinculado (cambia solo el aspecto) */
export function vincularSocio(..._x: any[]) {
    cerrarModal('modal-socio');
    $('chip-cliente-txt').textContent = 'Juan Pérez · Plata · 540 pts';
    $('chip-cliente').classList.add('border-brand-yellow/50');
    $('bloque-puntos').classList.remove('hidden'); $('bloque-puntos').classList.add('flex'); $('msg-sin-socio').classList.add('hidden');
    $('panel-socio-linea').classList.remove('hidden');
    mostrarToast('Socio vinculado a la venta.', 'exito');
}

let __inited = false;
export function init() {
    if (__inited || typeof document === "undefined") return;
    __inited = true;
    document.addEventListener('cantidad-producto-cambiada', event => {
        if (event.target.closest('#grid-prod-c')) actualizarResumenVentaCounter();
    });
    
    setInterval(() => { /* reloj fijo de demostración */ }, 60000);
    
}

export function onMount() {

}
