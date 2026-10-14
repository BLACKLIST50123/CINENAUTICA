// @ts-nocheck
/* Migrado desde assets/js/cliente.js — lógica de interfaz (solo diseño). Se reemplazará por estado React / Supabase más adelante. */
import { $, $$, mostrarToast, abrirModal, cerrarModal, cerrarModalesAuth, clickAsientoGenerico } from "./common";
import { SEL, S, vistaActual, cambiarVista, irAAsientos, elegirSedeNav } from "./nav";
import { SEDES, TITULOS, TRAILERS, LEGAL } from "./data";
declare const L: any;

/* ============================================================================
   CINE NÁUTICA — cliente.js (solo diseño)
   Navegación entre vistas + filtros de PRUEBA (ocultan/muestran elementos del HTML).
   No hay estado de negocio, ni localStorage, ni cálculos.
   ============================================================================ */
export const FECHA_LARGA = { d0: 'Sáb, 10 Oct', d1: 'Dom, 11 Oct', d2: 'Lun, 12 Oct', d3: 'Mar, 13 Oct', d4: 'Mié, 14 Oct', d5: 'Jue, 15 Oct', d6: 'Vie, 16 Oct' };
export const FECHA_CORTA = { d0: 'Hoy · Sáb 10', d1: 'Mañana · Dom 11', d2: 'Lun 12 Oct', d3: 'Mar 13 Oct', d4: 'Mié 14 Oct', d5: 'Jue 15 Oct', d6: 'Vie 16 Oct' };

/* ---------- Stepper de compra ---------- */
let observadorAlturaVista;

/* ---------- Navegación entre vistas ---------- */
export function limpiarCantidadesDulceria(..._x: any[]) {
    $$('#grid-productos [data-cat] .rounded-full > span').forEach(cantidad => { cantidad.textContent = '0'; });
}
export function actualizarResumenDulceria(..._x: any[]) {
    const productos = $$('#grid-productos [data-cat]').map(card => ({
        nombre: card.querySelector('h4')?.textContent.trim() || '',
        precio: Number((card.querySelector('.font-bold.text-white.text-lg')?.textContent || '').replace(/[^\d.]/g, '')) || 0,
        cantidad: Number.parseInt(card.querySelector('.rounded-full > span')?.textContent || '0', 10) || 0
    })).filter(producto => producto.cantidad > 0);
    const totalDulces = productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    const asientos = $$('#grid-asientos .seat.selected').map(asiento => asiento.dataset.id);
    const totalEntradas = S.dulceria ? 0 : asientos.length * 18;
    $('total-entradas').textContent = `S/ ${totalEntradas.toFixed(2)}`;
    $('pago-total-entradas').textContent = `S/ ${totalEntradas.toFixed(2)}`;
    const listaAsientos = $('lista-final-asientos');
    listaAsientos.replaceChildren();
    asientos.forEach(asiento => {
        const fila = document.createElement('div');
        fila.className = 'flex justify-between text-sm';
        const nombre = document.createElement('span');
        nombre.className = 'text-slate-300';
        nombre.innerHTML = `<i class="fa-solid fa-chair text-brand-yellow mr-2"></i>${asiento}`;
        const precio = document.createElement('span');
        precio.className = 'text-white';
        precio.textContent = 'S/ 18.00';
        fila.append(nombre, precio);
        listaAsientos.appendChild(fila);
    });
    const lista = $('lista-final-dulces');
    lista.replaceChildren();
    if (!productos.length) {
        const vacio = document.createElement('p');
        vacio.className = 'text-slate-500 text-sm';
        vacio.textContent = 'Aún no seleccionas productos.';
        lista.appendChild(vacio);
    } else {
        productos.forEach(producto => {
            const fila = document.createElement('div');
            fila.className = 'flex justify-between text-sm gap-3';
            const nombre = document.createElement('span');
            nombre.className = 'text-slate-300 min-w-0';
            nombre.textContent = `${producto.cantidad}x ${producto.nombre}`;
            const precio = document.createElement('span');
            precio.className = 'text-white flex-shrink-0';
            precio.textContent = `S/ ${(producto.precio * producto.cantidad).toFixed(2)}`;
            fila.append(nombre, precio);
            lista.appendChild(fila);
        });
    }
    $('bloque-entradas-resumen-dulceria').classList.toggle('hidden', S.dulceria);
    $('fila-total-entradas-dulceria').classList.toggle('hidden', S.dulceria);
    $('bloque-pelicula-pago').classList.toggle('hidden', S.dulceria);
    $('bloque-entradas-resumen-pago').classList.toggle('hidden', S.dulceria);
    $('titulo-pedido-dulceria').textContent = S.dulceria ? 'Pedido de Dulcería' : 'Tu Pedido Final';
    $('total-dulces').textContent = `S/ ${totalDulces.toFixed(2)}`;
    $('total-general-dulceria').textContent = `S/ ${(totalEntradas + totalDulces).toFixed(2)}`;
    $('pago-total-dulces').textContent = `S/ ${totalDulces.toFixed(2)}`;
    $('pago-total-general').textContent = `S/ ${(totalEntradas + totalDulces).toFixed(2)}`;
}
export function pintarSedeDulceria(..._x: any[]) {
    const sub = $('subtitulo-sede-dulceria');
    const sd = SEDES[SEL.sede];
    if (!sd) { sub.classList.add('hidden'); return; }
    sub.classList.remove('hidden');
    $('nombre-sede-dulceria').textContent = `${sd.nombre} · ${sd.ciudad}`;
}
export function alCambiarCiudadDulceria(..._x: any[]) {
    const c = $('dulceria-ciudad').value, sed = $('dulceria-sede');
    sed.disabled = !c;
    [...sed.options].forEach(o => { o.hidden = o.value && o.dataset.ciudad !== c; });
    if (!c || (sed.selectedOptions[0] && sed.selectedOptions[0].hidden)) sed.value = '';
    validarSedeDulceria();
}
export function validarSedeDulceria(..._x: any[]) {
    $('btn-confirmar-sede-dulceria').disabled = !$('dulceria-ciudad').value || !$('dulceria-sede').value;
}
/* ---------- Detalle de película ---------- */
/* Filtro del detalle: Ciudad -> Sede -> Fecha (oculta/muestra tarjetas de sede) */
export function alCambiarCiudadDetalle(selCiudad?, silencioso?, ..._x: any[]) {
    const bloque = selCiudad.closest('[data-peli]'), sed = bloque.querySelector('.js-det-sede');
    [...sed.options].forEach(o => { o.hidden = o.value && selCiudad.value && o.dataset.ciudad !== selCiudad.value; });
    if (sed.selectedOptions[0] && sed.selectedOptions[0].hidden) sed.value = '';
    if (!silencioso) aplicarFiltroDetalle(sed);
}
export function elegirFechaDetalle(btn?, fecha?, silencioso?, ..._x: any[]) {
    if (!btn) return;
    const bloque = btn.closest('[data-peli]');
    $$('.js-det-fechas .chip-fecha', bloque).forEach(b => b.classList.toggle('activo', b === btn));
    bloque.dataset.fecha = fecha;
    if (!silencioso) aplicarFiltroDetalle(btn);
}
export function aplicarFiltroDetalle(el?, ..._x: any[]) {
    const bloque = el.closest('[data-peli]');
    const ciudad = bloque.querySelector('.js-det-ciudad').value, sede = bloque.querySelector('.js-det-sede').value;
    const fecha = bloque.dataset.fecha || 'd0';
    let visibles = 0;
    $$('.js-lista-sedes > .acc', bloque).forEach(card => {
        const tieneFecha = !!card.querySelector(`[data-fecha="${fecha}"]`);
        const ok = tieneFecha && (!ciudad || card.dataset.ciudad === ciudad) && (!sede || card.dataset.sede === sede);
        card.style.display = ok ? '' : 'none';
        if (ok) visibles++;
        $$('[data-fecha]', card).forEach(g => {
            if (g.classList.contains('head-info')) g.style.display = g.dataset.fecha === fecha ? 'flex' : 'none';
            else g.style.display = g.dataset.fecha === fecha ? 'block' : 'none';
        });
    });
    bloque.querySelector('.js-vacio').classList.toggle('hidden', visibles > 0);
    if (visibles === 1) $$('.js-lista-sedes > .acc', bloque).find(c => c.style.display !== 'none').classList.add('open');
    $('barra-confirmacion-horario').classList.add('translate-y-full');
}
export function accTodoDetalle(btn?, ..._x: any[]) {
    const cards = $$('.js-lista-sedes > .acc', btn.closest('[data-peli]')).filter(c => c.style.display !== 'none');
    const abrir = cards.some(c => !c.classList.contains('open'));
    cards.forEach(c => c.classList.toggle('open', abrir));
}
export function seleccionarFuncion(btn?, sede?, fecha?, formato?, hora?, sala?, ..._x: any[]) {
    $$('.time-btn').forEach(b => { b.classList.remove('bg-brand-blue', 'border-brand-blue'); b.classList.add('bg-dark-900', 'border-slate-600'); });
    btn.classList.remove('bg-dark-900', 'border-slate-600'); btn.classList.add('bg-brand-blue', 'border-brand-blue');
    Object.assign(SEL, { sede, fecha, formato, hora, sala });
    $('fh-sede').textContent = SEDES[sede].nombre; $('fh-fecha').textContent = FECHA_LARGA[fecha];
    $('fh-formato').textContent = formato; $('fh-hora').textContent = hora;
    $('barra-confirmacion-horario').classList.remove('translate-y-full');
}

/* ---------- Flujo: asientos -> dulcería -> pago -> ticket ---------- */
export function prepararTicketDulceriaDirecta(..._x: any[]) {
    const productos = $$('#grid-productos [data-cat]').map(card => ({
        nombre: card.querySelector('h4')?.textContent.trim() || '',
        precio: Number((card.querySelector('.font-bold.text-white.text-lg')?.textContent || '').replace(/[^\d.]/g, '')) || 0,
        cantidad: Number.parseInt(card.querySelector('.rounded-full > span')?.textContent || '0', 10) || 0
    })).filter(producto => producto.cantidad > 0);
    const total = productos.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
    const fecha = new Date();
    const productosLista = $('pdf-dulces');
    productosLista.replaceChildren();
    productos.forEach(producto => {
        const item = document.createElement('li');
        item.textContent = `${producto.cantidad}x ${producto.nombre}`;
        productosLista.appendChild(item);
    });
    $('pdf-titulo-pelicula').textContent = 'PEDIDO DE DULCERÍA';
    $('pdf-formato').textContent = 'RETIRO EN BARRA';
    $('pdf-fecha').textContent = new Intl.DateTimeFormat('es-PE').format(fecha);
    $('pdf-hora').textContent = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' }).format(fecha);
    $('pdf-cine').textContent = SEDES[SEL.sede]?.nombre || 'Cine Náutica';
    $('pdf-asientos').textContent = '—';
    $('pdf-direccion-fila').classList.add('hidden');
    $('pdf-instruccion-ticket').textContent = 'Muestra este código al recoger tu pedido en dulcería.';
    $('ticket-puntos-ganados').classList.add('hidden');
    $('pdf-nombre-cliente').textContent = $('campo-nombre').value.trim() || 'Consumidor final';
    $('pdf-documento-cliente').textContent = $('campo-ruc').classList.contains('hidden')
        ? ($('campo-dni').value.trim() || '—')
        : ($('campo-ruc').value.trim() || '—');
    const items = $('pdf-items-comprobante');
    items.replaceChildren();
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        const detalle = document.createElement('td');
        detalle.className = 'py-1';
        detalle.textContent = `${producto.cantidad}x ${producto.nombre}`;
        const importe = document.createElement('td');
        importe.className = 'text-right';
        importe.textContent = `S/ ${(producto.precio * producto.cantidad).toFixed(2)}`;
        fila.append(detalle, importe);
        items.appendChild(fila);
    });
    const subtotal = total / 1.18;
    $('pdf-subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    $('pdf-igv').textContent = `S/ ${(total - subtotal).toFixed(2)}`;
    $('pdf-total-comprobante').textContent = `S/ ${total.toFixed(2)}`;
}
export function restaurarTicketCompraRegular(..._x: any[]) {
    $('pdf-titulo-pelicula').textContent = TITULOS[SEL.peli];
    $('pdf-formato').textContent = SEL.formato.toUpperCase();
    $('pdf-fecha').textContent = FECHA_LARGA[SEL.fecha];
    $('pdf-hora').textContent = SEL.hora;
    $('pdf-cine').textContent = `${SEDES[SEL.sede].nombre} — Sala ${SEL.sala}`;
    const asientos = $$('#grid-asientos .seat.selected').map(asiento => asiento.dataset.id);
    $('pdf-asientos').textContent = asientos.join(', ') || '—';
    $('pdf-direccion-fila').classList.remove('hidden');
    $('pdf-instruccion-ticket').textContent = 'Presenta este código QR o impreso para ingresar a la sala.';
    $('ticket-puntos-ganados').classList.remove('hidden');
    const productos = $$('#grid-productos [data-cat]').map(card => ({
        nombre: card.querySelector('h4')?.textContent.trim() || '',
        precio: Number((card.querySelector('.font-bold.text-white.text-lg')?.textContent || '').replace(/[^\d.]/g, '')) || 0,
        cantidad: Number.parseInt(card.querySelector('.rounded-full > span')?.textContent || '0', 10) || 0
    })).filter(producto => producto.cantidad > 0);
    const dulcesPdf = $('pdf-dulces');
    dulcesPdf.replaceChildren();
    productos.forEach(producto => {
        const item = document.createElement('li');
        item.textContent = `${producto.cantidad}x ${producto.nombre}`;
        dulcesPdf.appendChild(item);
    });
    const items = $('pdf-items-comprobante');
    items.replaceChildren();
    const totalEntradas = Number($('pago-total-entradas').textContent.replace(/[^\d.]/g, '')) || 0;
    const totalDulces = Number($('pago-total-dulces').textContent.replace(/[^\d.]/g, '')) || 0;
    if (asientos.length) {
        const fila = document.createElement('tr');
        const detalle = document.createElement('td');
        detalle.className = 'py-1';
        detalle.textContent = `${asientos.length}x Entrada General`;
        const importe = document.createElement('td');
        importe.className = 'text-right';
        importe.textContent = `S/ ${totalEntradas.toFixed(2)}`;
        fila.append(detalle, importe);
        items.appendChild(fila);
    }
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        const detalle = document.createElement('td');
        detalle.className = 'py-1';
        detalle.textContent = `${producto.cantidad}x ${producto.nombre}`;
        const importe = document.createElement('td');
        importe.className = 'text-right';
        importe.textContent = `S/ ${(producto.precio * producto.cantidad).toFixed(2)}`;
        fila.append(detalle, importe);
        items.appendChild(fila);
    });
    const total = Number($('pago-total-general').textContent.replace(/[^\d.]/g, '')) || totalEntradas + totalDulces;
    const subtotal = total / 1.18;
    $('pdf-subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    $('pdf-igv').textContent = `S/ ${(total - subtotal).toFixed(2)}`;
    $('pdf-total-comprobante').textContent = `S/ ${total.toFixed(2)}`;
    actualizarResumenDulceria();
}
export const clickAsiento = (b?, ..._x: any[]) => clickAsientoGenerico(b, 'grid-asientos', 'resumen-contenedor-asientos', 'resumen-total');
export function filtrarDulceria(btn?, cat?, ..._x: any[]) {
    $$('#categorias-dulceria .cat-btn').forEach(b => { b.classList.remove('text-brand-yellow', 'border-brand-yellow'); b.classList.add('text-slate-400', 'border-transparent'); });
    btn.classList.remove('text-slate-400', 'border-transparent'); btn.classList.add('text-brand-yellow', 'border-brand-yellow');
    $$('#grid-productos [data-cat]').forEach(p => { p.style.display = (cat === 'all' || p.dataset.cat === cat) ? '' : 'none'; });
}
export function toggleTipoDocumento(..._x: any[]) {
    const f = document.querySelector('input[name="comprobante"]:checked').value === 'factura';
    $('campo-dni').classList.toggle('hidden', f); $('campo-ruc').classList.toggle('hidden', !f);
    /* En factura el nombre del comprobante es la razón social (comprobante.nombre_cliente) */
    $('campo-nombre').placeholder = f ? 'Razón Social' : 'Nombres y Apellidos';
}
export function toggleMetodoPago(..._x: any[]) {
    const y = document.querySelector('input[name="paymethod"]:checked').value === 'yape';
    $('formulario-tarjeta').classList.toggle('hidden', y); $('formulario-yape').classList.toggle('hidden', !y);
}

/* ---------- Filtros de la cartelera — MIGRADO A ESTADO REACT EN Inicio.tsx ---------- */
// El filtrado, selección de ciudad, sede y fechas ahora lo maneja Inicio.tsx de forma reactiva.
// Se dejan como stubs para no romper llamadas externas pendientes.
export let fechaInicio = 'd0';
export function alCambiarCiudadInicio(..._x: any[]) {}
export function elegirFechaInicio(btn?: any, fecha?: any, ..._x: any[]) {}
export function aplicarFiltroInicio(..._x: any[]) {}
export function limpiarFiltrosInicio(..._x: any[]) {}
/* ---------- Carrusel ---------- */
export let slideActivo = 0;
export function moverCarrusel(dir?, ..._x: any[]) {
    const s = $$('#carrusel-slides .carousel-item'); if (!s.length) return;
    s[slideActivo].classList.remove('active'); slideActivo = (slideActivo + dir + s.length) % s.length; s[slideActivo].classList.add('active');
}
/* ---------- Menú móvil ---------- */
export function toggleMenuMovil(abrir?, ..._x: any[]) {
    const d = $('drawer-menu-movil'), o = $('overlay-menu-movil');
    const abierto = !d.classList.contains('translate-x-full');
    const ahora = typeof abrir === 'boolean' ? abrir : !abierto;
    d.classList.toggle('translate-x-full', !ahora);
    if (ahora) { o.classList.remove('hidden'); requestAnimationFrame(() => o.classList.remove('opacity-0')); } else { o.classList.add('opacity-0'); setTimeout(() => o.classList.add('hidden'), 300); }
}

/* ---------- Modales con contenido ---------- */
export const toggleUserProfile = (..._x: any[]) => abrirModal('modal-perfil');
export const cerrarModalTrailer = (..._x: any[]) => { cerrarModal('modal-trailer'); setTimeout(() => { $('trailer-iframe').src = ''; }, 200); };
export function abrirModalTrailer(idOrUrl?: string, titulo?: string, ..._x: any[]) {
    let url = "";
    let title = titulo || "Tráiler";

    if (idOrUrl && (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://"))) {
        if (idOrUrl.includes("watch?v=")) {
            url = idOrUrl.replace("watch?v=", "embed/") + (idOrUrl.includes("?") ? "&" : "?") + "autoplay=1";
        } else if (idOrUrl.includes("youtu.be/")) {
            url = idOrUrl.replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1";
        } else {
            url = idOrUrl;
        }
    } else {
        const t = TRAILERS[idOrUrl || ""] || TRAILERS.spiderman;
        url = t.url;
        title = t.titulo;
    }

    const elTit = $('trailer-titulo');
    const elIfr = $('trailer-iframe') as HTMLIFrameElement | null;
    if (elTit) elTit.textContent = `Tráiler - ${title}`;
    if (elIfr) elIfr.src = url;
    abrirModal('modal-trailer');
}
export function abrirModalLegal(k?, ..._x: any[]) {
    const i = LEGAL[k]; if (!i) return;
    $('legal-titulo').textContent = i.titulo;
    $('legal-icono').innerHTML = `<i class="fa-solid ${i.icono} text-2xl text-brand-blue"></i>`;
    $('legal-texto').innerHTML = i.texto.map(p => `<p>${p}</p>`).join('');
    abrirModal('modal-legal');
}

/* ---------- Sesión — REEMPLAZADA POR useSesion() + ModalesAuth.tsx ---------- */
// setSesion, manejarLogin y manejarRegistro ya no manipulan el DOM.
// El estado de sesión lo maneja SesionContext (useSesion()) con Supabase Auth.
// Se conservan como stubs vacíos para no romper llamadas pendientes de migrar.
export function setSesion(_activa?: any, ..._x: any[]) { /* gestionado por SesionContext */ }
export const manejarLogin = (_e?: any, ..._x: any[]) => { _e?.preventDefault?.(); };
export const manejarRegistro = (_e?: any, ..._x: any[]) => { _e?.preventDefault?.(); };
/* ---------- Mapa de sedes ---------- */
export let mapa = null, marcador = null, sedeMapa = 's1';
export function pintarInfoSede(id?, ..._x: any[]) {
    const s = SEDES[id]; sedeMapa = id;
    $('ub-nombre').textContent = s.nombre; $('ub-dir').textContent = s.dir; $('ub-horario').textContent = `Todos los días, ${s.horario}`;
    $('ub-tel').textContent = s.tel; $('ub-salas').textContent = `${s.salas} salas · Estacionamiento disponible`;
    $$('[data-sede-btn]').forEach(b => { b.classList.toggle('border-brand-yellow', b.dataset.sedeBtn === id); b.classList.toggle('border-white/5', b.dataset.sedeBtn !== id); });
}
export function seleccionarSedeMapa(id?, ..._x: any[]) {
    pintarInfoSede(id);
    if (mapa) { const c = SEDES[id].coords; mapa.flyTo(c, 16); marcador.setLatLng(c).bindPopup(`<strong>${SEDES[id].nombre}</strong>`).openPopup(); }
}
export const elegirSedeDesdeMapa = (..._x: any[]) => elegirSedeNav(sedeMapa);
export function iniciarMapa(..._x: any[]) {
    pintarInfoSede(sedeMapa);
    if (typeof L === 'undefined') { cargarLeaflet().then(iniciarMapa); return; }
    if (mapa) { setTimeout(() => mapa.invalidateSize(), 200); return; }
    const c = SEDES[sedeMapa].coords;
    mapa = L.map('mapa-ubicacion').setView(c, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
    marcador = L.marker(c).addTo(mapa).bindPopup(`<strong>${SEDES[sedeMapa].nombre}</strong>`).openPopup();
    setTimeout(() => mapa.invalidateSize(), 200);
}

let __inited = false;
export function init() {
    if (__inited || typeof document === "undefined") return;
    __inited = true;
    document.addEventListener('cantidad-producto-cambiada', event => {
        if (event.target.closest('#grid-productos')) actualizarResumenDulceria();
    });
    setInterval(() => { if (vistaActual() === 'vista-inicio') moverCarrusel(1); }, 6000);
    
}

/* ---------- Leaflet (mapa de Ubicación) se carga solo cuando se necesita ---------- */
export function cargarLeaflet() {
    return new Promise<void>((res) => {
        if (typeof L !== 'undefined') return res();
        const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css);
        const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = () => res(); document.body.appendChild(s);
    });
}

/* ---------- Lo que antes hacían cambiarVista()/irAAsientos()/etc. al "entrar" a una vista ---------- */
export function aplicarVistaActual() {
    const p = window.location.pathname;
    setSesion(S.sesion);
    if (p === '/') {
        // La vista de inicio ahora se controla reactivamente por Inicio.tsx
    } else if (p.startsWith('/pelicula/')) {
        $$('#contenido-detalle iframe').forEach((f) => { if (f.dataset.src) f.src = f.dataset.src; });
    } else if (p === '/asientos') {
        // La vista de asientos ahora se gestiona reactivamente por Asientos.tsx
    } else if (p === '/dulceria') {
        $('btn-volver-asientos-dulceria').classList.toggle('hidden', !!S.dulceria);
        pintarSedeDulceria(); actualizarResumenDulceria();
    } else if (p === '/pago') {
        actualizarResumenDulceria();
    } else if (p === '/ubicacion') {
        if (mapa) { try { mapa.remove(); } catch (e) { } mapa = null; marcador = null; }
        pintarInfoSede(sedeMapa); iniciarMapa();
    }
}

export function onMount() { aplicarVistaActual(); }
