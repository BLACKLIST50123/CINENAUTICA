/* ============================================================================
   CINE NÁUTICA — cliente.js (solo diseño)
   Navegación entre vistas + filtros de PRUEBA (ocultan/muestran elementos del HTML).
   No hay estado de negocio, ni localStorage, ni cálculos.
   ============================================================================ */
let vistaActualVisible = 'vista-inicio';
let vistaAnteriorAContacto = 'vista-inicio';
let dulceriaDirectaActiva = false;
const SEL = { peli: 'spiderman', sede: 's1', fecha: 'd0', formato: '2D Doblada', hora: '19:00', sala: 1 };
const FECHA_LARGA = { d0: 'Sáb, 10 Oct', d1: 'Dom, 11 Oct', d2: 'Lun, 12 Oct', d3: 'Mar, 13 Oct', d4: 'Mié, 14 Oct', d5: 'Jue, 15 Oct', d6: 'Vie, 16 Oct' };
const FECHA_CORTA = { d0: 'Hoy · Sáb 10', d1: 'Mañana · Dom 11', d2: 'Lun 12 Oct', d3: 'Mar 13 Oct', d4: 'Mié 14 Oct', d5: 'Jue 15 Oct', d6: 'Vie 16 Oct' };

/* ---------- Stepper de compra ---------- */
const PASOS = [
    { vista: 'vista-detalle-pelicula', label: 'Función', icono: 'fa-clock' },
    { vista: 'vista-asientos', label: 'Asientos', icono: 'fa-chair' },
    { vista: 'vista-dulceria', label: 'Dulcería', icono: 'fa-bowl-food' },
    { vista: 'vista-pago', label: 'Pago', icono: 'fa-credit-card' },
    { vista: 'vista-ticket', label: 'Listo', icono: 'fa-ticket' }
];
function pintarStepper(idVista) {
    const cont = $('stepper-compra'), pasosEl = $('stepper-compra-pasos');
    const pasos = dulceriaDirectaActiva
        ? PASOS.filter(p => p.vista !== 'vista-detalle-pelicula' && p.vista !== 'vista-asientos')
        : PASOS;
    const actual = pasos.findIndex(p => p.vista === idVista);
    if (actual === -1) { cont.classList.add('hidden'); return; }
    cont.classList.remove('hidden');
    pasosEl.innerHTML = pasos.map((p, i) => {
        const hecho = i < actual, ahora = i === actual;
        const txt = hecho ? 'text-brand-yellow' : ahora ? 'text-white' : 'text-slate-600';
        const circ = hecho ? 'bg-brand-yellow text-black' : ahora ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(10,126,177,0.6)]' : 'bg-dark-700 text-slate-500 border border-white/10';
        const ico = hecho ? '<i class="fa-solid fa-check text-[11px] md:text-xs"></i>' : `<i class="fa-solid ${p.icono} text-[11px] md:text-xs"></i>`;
        return `<div class="flex items-center ${i < pasos.length - 1 ? 'flex-1' : ''}">
            <div class="flex flex-col items-center gap-1 flex-shrink-0">
                <div class="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold ${circ}">${ico}</div>
                <span class="text-[10px] md:text-xs font-semibold ${txt} hidden sm:block whitespace-nowrap">${p.label}</span></div>
            ${i < pasos.length - 1 ? `<div class="flex-1 h-0.5 mx-2 md:mx-3 ${hecho ? 'bg-brand-yellow' : 'bg-dark-700'}"></div>` : ''}</div>`;
    }).join('');
}
const VISTAS_CON_TEMPORIZADOR = ['vista-asientos', 'vista-dulceria', 'vista-pago'];
let observadorAlturaVista;

function ajustarAltura(idVista) {
    const c = $('contenedor-vistas'), v = $(idVista);
    const actualizarAltura = () => { c.style.minHeight = `${v.scrollHeight}px`; };
    actualizarAltura();
    if (!observadorAlturaVista) {
        observadorAlturaVista = new ResizeObserver(() => {
            const vistaActiva = $(vistaActualVisible);
            if (vistaActiva && !vistaActiva.classList.contains('hidden')) {
                c.style.minHeight = `${vistaActiva.scrollHeight}px`;
            }
        });
    }
    observadorAlturaVista.disconnect();
    observadorAlturaVista.observe(v);
}

/* ---------- Navegación entre vistas ---------- */
function cambiarVista(idDesde, idHacia) {
    const desde = $(idDesde || vistaActualVisible), hacia = $(idHacia);
    if (!hacia) return;
    if (desde && desde !== hacia) { desde.classList.add('opacity-0'); setTimeout(() => desde.classList.add('hidden'), 300); }
    setTimeout(() => {
        $$('#contenedor-vistas > div[id^="vista-"]').forEach(v => { if (v.id !== idHacia) v.classList.add('hidden', 'opacity-0'); });
        hacia.classList.remove('hidden');
        requestAnimationFrame(() => hacia.classList.remove('opacity-0'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        vistaActualVisible = idHacia;
        pintarStepper(idHacia);
        $('badge-temporizador-compra').classList.toggle('hidden', !VISTAS_CON_TEMPORIZADOR.includes(idHacia));
        if (idHacia !== 'vista-detalle-pelicula') {
            $$('#contenido-detalle iframe').forEach(f => { if (f.src) { f.dataset.src = f.dataset.src || f.src; } f.src = ''; });
            $('barra-confirmacion-horario').classList.add('translate-y-full');
        }
        ajustarAltura(idHacia);
    }, desde && desde !== hacia ? 300 : 0);
}
const intentarSalirDelFlujoDeCompra = (a) => a();
const abrirVistaPromociones = () => cambiarVista(vistaActualVisible, 'vista-promociones');
function limpiarCantidadesDulceria() {
    $$('#grid-productos [data-cat] .rounded-full > span').forEach(cantidad => { cantidad.textContent = '0'; });
}
function actualizarResumenDulceria() {
    const productos = $$('#grid-productos [data-cat]').map(card => ({
        nombre: card.querySelector('h4')?.textContent.trim() || '',
        precio: Number((card.querySelector('.font-bold.text-white.text-lg')?.textContent || '').replace(/[^\d.]/g, '')) || 0,
        cantidad: Number.parseInt(card.querySelector('.rounded-full > span')?.textContent || '0', 10) || 0
    })).filter(producto => producto.cantidad > 0);
    const totalDulces = productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    const asientos = $$('#grid-asientos .seat.selected').map(asiento => asiento.dataset.id);
    const totalEntradas = dulceriaDirectaActiva ? 0 : asientos.length * 18;
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
    $('bloque-entradas-resumen-dulceria').classList.toggle('hidden', dulceriaDirectaActiva);
    $('fila-total-entradas-dulceria').classList.toggle('hidden', dulceriaDirectaActiva);
    $('bloque-pelicula-pago').classList.toggle('hidden', dulceriaDirectaActiva);
    $('bloque-entradas-resumen-pago').classList.toggle('hidden', dulceriaDirectaActiva);
    $('titulo-pedido-dulceria').textContent = dulceriaDirectaActiva ? 'Pedido de Dulcería' : 'Tu Pedido Final';
    $('total-dulces').textContent = `S/ ${totalDulces.toFixed(2)}`;
    $('total-general-dulceria').textContent = `S/ ${(totalEntradas + totalDulces).toFixed(2)}`;
    $('pago-total-dulces').textContent = `S/ ${totalDulces.toFixed(2)}`;
    $('pago-total-general').textContent = `S/ ${(totalEntradas + totalDulces).toFixed(2)}`;
}
function pintarSedeDulceria() {
    const sub = $('subtitulo-sede-dulceria');
    const sd = SEDES[SEL.sede];
    if (!sd) { sub.classList.add('hidden'); return; }
    sub.classList.remove('hidden');
    $('nombre-sede-dulceria').textContent = `${sd.nombre} · ${sd.ciudad}`;
}
function pedirSedeParaDulceria() {
    const ciu = $('dulceria-ciudad'), sed = $('dulceria-sede');
    ciu.value = $('f-ciudad').value || '';
    alCambiarCiudadDulceria();
    const sedeActual = $('f-sede').value;
    if (sedeActual && [...sed.options].some(o => o.value === sedeActual && !o.hidden)) sed.value = sedeActual;
    validarSedeDulceria();
    abrirModal('modal-dulceria-sede');
}
function alCambiarCiudadDulceria() {
    const c = $('dulceria-ciudad').value, sed = $('dulceria-sede');
    sed.disabled = !c;
    [...sed.options].forEach(o => { o.hidden = o.value && o.dataset.ciudad !== c; });
    if (!c || (sed.selectedOptions[0] && sed.selectedOptions[0].hidden)) sed.value = '';
    validarSedeDulceria();
}
function validarSedeDulceria() {
    $('btn-confirmar-sede-dulceria').disabled = !$('dulceria-ciudad').value || !$('dulceria-sede').value;
}
function confirmarSedeDulceria() {
    const id = $('dulceria-sede').value;
    if (!id) return;
    cerrarModal('modal-dulceria-sede');
    const sd = SEDES[id];
    $('f-ciudad').value = sd.ciudad;
    alCambiarCiudadInicio();
    $('f-sede').value = id;
    aplicarFiltroInicio();
    SEL.sede = id;
    abrirDulceriaDirecta();
}
const abrirDulceriaDirecta = () => {
    dulceriaDirectaActiva = true;
    limpiarCantidadesDulceria();
    $('btn-volver-asientos-dulceria').classList.add('hidden');
    pintarSedeDulceria();
    actualizarResumenDulceria();
    cambiarVista(vistaActualVisible, 'vista-dulceria');
};
const irAVistaContacto = () => { vistaAnteriorAContacto = vistaActualVisible; cambiarVista(vistaActualVisible, 'vista-contacto'); };
const abrirMisCompras = () => cambiarVista(vistaActualVisible, 'vista-historial');
const abrirVistaUbicacion = () => { cambiarVista(vistaActualVisible, 'vista-ubicacion'); setTimeout(iniciarMapa, 400); };

/* ---------- Detalle de película ---------- */
function abrirDetallePelicula(id) {
    dulceriaDirectaActiva = false;
    limpiarCantidadesDulceria();
    actualizarResumenDulceria();
    SEL.peli = id;
    $$('#contenido-detalle [data-peli]').forEach(b => {
        const on = b.dataset.peli === id;
        b.style.display = on ? '' : 'none';
        const f = b.querySelector('iframe');
        if (f) f.src = on ? (f.dataset.src || f.src) : '';
    });
    $('barra-confirmacion-horario').classList.add('translate-y-full');
    // Si ya hay filtros elegidos en la cartelera, el detalle los hereda
    const bloque = document.querySelector(`#contenido-detalle [data-peli="${id}"]`);
    const ciu = bloque.querySelector('.js-det-ciudad'), sed = bloque.querySelector('.js-det-sede');
    if (ciu) {
        ciu.value = $('f-ciudad').value;
        alCambiarCiudadDetalle(ciu, true);
        if ($('f-sede').value && [...sed.options].some(o => o.value === $('f-sede').value)) sed.value = $('f-sede').value;
        const f = $$('#barra-filtros-inicio .chip-fecha.activo')[0];
        const fecha = f ? ($$('#barra-filtros-inicio .chip-fecha').indexOf(f)) : 0;
        elegirFechaDetalle($$('.js-det-fechas .chip-fecha', bloque)[fecha], 'd' + fecha, true);
        aplicarFiltroDetalle(sed);
    }
    cambiarVista(vistaActualVisible, 'vista-detalle-pelicula');
}

/* Filtro del detalle: Ciudad -> Sede -> Fecha (oculta/muestra tarjetas de sede) */
function alCambiarCiudadDetalle(selCiudad, silencioso) {
    const bloque = selCiudad.closest('[data-peli]'), sed = bloque.querySelector('.js-det-sede');
    [...sed.options].forEach(o => { o.hidden = o.value && selCiudad.value && o.dataset.ciudad !== selCiudad.value; });
    if (sed.selectedOptions[0] && sed.selectedOptions[0].hidden) sed.value = '';
    if (!silencioso) aplicarFiltroDetalle(sed);
}
function elegirFechaDetalle(btn, fecha, silencioso) {
    if (!btn) return;
    const bloque = btn.closest('[data-peli]');
    $$('.js-det-fechas .chip-fecha', bloque).forEach(b => b.classList.toggle('activo', b === btn));
    bloque.dataset.fecha = fecha;
    if (!silencioso) aplicarFiltroDetalle(btn);
}
function aplicarFiltroDetalle(el) {
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
function accTodoDetalle(btn) {
    const cards = $$('.js-lista-sedes > .acc', btn.closest('[data-peli]')).filter(c => c.style.display !== 'none');
    const abrir = cards.some(c => !c.classList.contains('open'));
    cards.forEach(c => c.classList.toggle('open', abrir));
}
function seleccionarFuncion(btn, sede, fecha, formato, hora, sala) {
    $$('.time-btn').forEach(b => { b.classList.remove('bg-brand-blue', 'border-brand-blue'); b.classList.add('bg-dark-900', 'border-slate-600'); });
    btn.classList.remove('bg-dark-900', 'border-slate-600'); btn.classList.add('bg-brand-blue', 'border-brand-blue');
    Object.assign(SEL, { sede, fecha, formato, hora, sala });
    $('fh-sede').textContent = SEDES[sede].nombre; $('fh-fecha').textContent = FECHA_LARGA[fecha];
    $('fh-formato').textContent = formato; $('fh-hora').textContent = hora;
    $('barra-confirmacion-horario').classList.remove('translate-y-full');
}

/* ---------- Flujo: asientos -> dulcería -> pago -> ticket ---------- */
function irAAsientos() {
    const sd = SEDES[SEL.sede];
    $$('[data-bind]').forEach(el => {
        const k = el.dataset.bind;
        if (k === 'detalle') el.textContent = `${FECHA_LARGA[SEL.fecha]} • ${SEL.hora} • ${SEL.formato}`;
        if (k === 'cine') el.textContent = `${sd.nombre} — Sala ${SEL.sala}`;
        if (k === 'sededir') el.textContent = sd.dir;
        if (k === 'fecha') el.textContent = FECHA_LARGA[SEL.fecha];
        if (k === 'hora') el.textContent = SEL.hora;
        if (k === 'formato') el.textContent = SEL.formato;
        if (k === 'titulo') el.textContent = TITULOS[SEL.peli];
    });
    $$('#info-pelicula-asientos [data-peli]').forEach(b => { b.style.display = b.dataset.peli === SEL.peli ? '' : 'none'; });
    cambiarVista('vista-detalle-pelicula', 'vista-asientos');
}
const irADulceria = () => {
    dulceriaDirectaActiva = false;
    $('btn-volver-asientos-dulceria').classList.remove('hidden');
    pintarSedeDulceria();
    actualizarResumenDulceria();
    cambiarVista('vista-asientos', 'vista-dulceria');
};
const irAPago = () => { actualizarResumenDulceria(); cambiarVista('vista-dulceria', 'vista-pago'); };
function prepararTicketDulceriaDirecta() {
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
function restaurarTicketCompraRegular() {
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
const procesarPago = () => {
    if (dulceriaDirectaActiva) prepararTicketDulceriaDirecta();
    else restaurarTicketCompraRegular();
    cambiarVista('vista-pago', 'vista-ticket');
};
const clickAsiento = (b) => clickAsientoGenerico(b, 'grid-asientos', 'resumen-contenedor-asientos', 'resumen-total');
function filtrarDulceria(btn, cat) {
    $$('#categorias-dulceria .cat-btn').forEach(b => { b.classList.remove('text-brand-yellow', 'border-brand-yellow'); b.classList.add('text-slate-400', 'border-transparent'); });
    btn.classList.remove('text-slate-400', 'border-transparent'); btn.classList.add('text-brand-yellow', 'border-brand-yellow');
    $$('#grid-productos [data-cat]').forEach(p => { p.style.display = (cat === 'all' || p.dataset.cat === cat) ? '' : 'none'; });
}
document.addEventListener('cantidad-producto-cambiada', event => {
    if (event.target.closest('#grid-productos')) actualizarResumenDulceria();
});
function toggleTipoDocumento() {
    const f = document.querySelector('input[name="comprobante"]:checked').value === 'factura';
    $('campo-dni').classList.toggle('hidden', f); $('campo-ruc').classList.toggle('hidden', !f);
}
function toggleMetodoPago() {
    const y = document.querySelector('input[name="paymethod"]:checked').value === 'yape';
    $('formulario-tarjeta').classList.toggle('hidden', y); $('formulario-yape').classList.toggle('hidden', !y);
}

/* ---------- Filtros de la cartelera: Película -> Ciudad -> Sede -> Fecha (lógica de prueba) ---------- */
let fechaInicio = 'd0';
function alCambiarCiudadInicio() {
    const c = $('f-ciudad').value, sed = $('f-sede');
    [...sed.options].forEach(o => { o.hidden = o.value && c && o.dataset.ciudad !== c; });
    if (sed.selectedOptions[0] && sed.selectedOptions[0].hidden) sed.value = '';
    aplicarFiltroInicio();
}
function elegirFechaInicio(btn, fecha) {
    $$('#barra-filtros-inicio .chip-fecha').forEach(b => b.classList.toggle('activo', b === btn));
    fechaInicio = fecha; aplicarFiltroInicio();
}
function aplicarFiltroInicio() {
    const peli = $('f-peli').value, ciudad = $('f-ciudad').value, sede = $('f-sede').value;
    const sedesDeCiudad = ciudad ? Object.values(SEDES).filter(s => s.ciudad === ciudad).map(s => s.id) : null;
    let n = 0;
    $$('#grid-cartelera [data-peli]').forEach(c => {
        const pares = c.dataset.sf.split(' ');
        const ok = (!peli || c.dataset.peli === peli) && pares.some(p => {
            const [s, d] = p.split(':');
            return d === fechaInicio && (!sede || s === sede) && (!sedesDeCiudad || sedesDeCiudad.includes(s));
        });
        c.style.display = ok ? '' : 'none'; if (ok) n++;
    });
    $('cartelera-vacia').classList.toggle('hidden', n > 0);
    $('rf-cant').innerHTML = `<i class="fa-solid fa-film"></i> ${n} película${n === 1 ? '' : 's'}`;
    const rc = $('rf-ciudad'), rs = $('rf-sede');
    rc.classList.toggle('hidden', !ciudad); rc.innerHTML = `<i class="fa-solid fa-city"></i> ${ciudad}`;
    rs.classList.toggle('hidden', !sede); rs.innerHTML = sede ? `<i class="fa-solid fa-location-dot"></i> ${SEDES[sede].nombre}` : '';
    $('rf-fecha').innerHTML = `<i class="fa-regular fa-calendar"></i> ${FECHA_CORTA[fechaInicio]}`;
    const lbl = sede ? SEDES[sede].nombre : (ciudad || 'Todas las sedes');
    $('sede-nav-label').textContent = lbl; $('sede-nav-label-movil').textContent = lbl;
}
function limpiarFiltrosInicio() {
    $('f-peli').value = ''; $('f-ciudad').value = ''; $('f-sede').value = '';
    alCambiarCiudadInicio();
    elegirFechaInicio($$('#barra-filtros-inicio .chip-fecha')[0], 'd0');
}
function elegirSedeNav(id) {
    cerrarModal('modal-sede');
    if (id) { $('f-ciudad').value = SEDES[id].ciudad; alCambiarCiudadInicio(); $('f-sede').value = id; } else { $('f-ciudad').value = ''; alCambiarCiudadInicio(); $('f-sede').value = ''; }
    aplicarFiltroInicio();
    cambiarVista(vistaActualVisible, 'vista-inicio');
    setTimeout(() => $('barra-filtros-inicio').scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
}

/* ---------- Carrusel ---------- */
let slideActivo = 0;
function moverCarrusel(dir) {
    const s = $$('#carrusel-slides .carousel-item'); if (!s.length) return;
    s[slideActivo].classList.remove('active'); slideActivo = (slideActivo + dir + s.length) % s.length; s[slideActivo].classList.add('active');
}
setInterval(() => { if (vistaActualVisible === 'vista-inicio') moverCarrusel(1); }, 6000);

/* ---------- Menú móvil ---------- */
function toggleMenuMovil(abrir) {
    const d = $('drawer-menu-movil'), o = $('overlay-menu-movil');
    const abierto = !d.classList.contains('translate-x-full');
    const ahora = typeof abrir === 'boolean' ? abrir : !abierto;
    d.classList.toggle('translate-x-full', !ahora);
    if (ahora) { o.classList.remove('hidden'); requestAnimationFrame(() => o.classList.remove('opacity-0')); } else { o.classList.add('opacity-0'); setTimeout(() => o.classList.add('hidden'), 300); }
}

/* ---------- Modales con contenido ---------- */
const toggleUserProfile = () => abrirModal('modal-perfil');
const cerrarModalTrailer = () => { cerrarModal('modal-trailer'); setTimeout(() => { $('trailer-iframe').src = ''; }, 200); };
function abrirModalTrailer(id) {
    const t = TRAILERS[id] || TRAILERS.spiderman;
    $('trailer-titulo').textContent = `Tráiler - ${t.titulo}`; $('trailer-iframe').src = t.url; abrirModal('modal-trailer');
}
function abrirModalLegal(k) {
    const i = LEGAL[k]; if (!i) return;
    $('legal-titulo').textContent = i.titulo;
    $('legal-icono').innerHTML = `<i class="fa-solid ${i.icono} text-2xl text-brand-blue"></i>`;
    $('legal-texto').innerHTML = i.texto.map(p => `<p>${p}</p>`).join('');
    abrirModal('modal-legal');
}

/* ---------- Sesión simulada ---------- */
function setSesion(activa) {
    ['menu-invitado', 'menu-invitado-movil'].forEach(id => $(id).classList.toggle('hidden', activa));
    ['menu-usuario', 'menu-usuario-movil'].forEach(id => { const e = $(id); e.classList.toggle('hidden', !activa); e.classList.toggle('flex', activa); });
    $('panel-socio-beneficios').classList.toggle('hidden', !activa);
    $('panel-historial-beneficios').classList.toggle('hidden', !activa);
}
const manejarLogin = (e) => { e.preventDefault(); cerrarModalesAuth(); setSesion(true); mostrarToast('Sesión iniciada (demostración).', 'exito'); };
const manejarRegistro = (e) => { e.preventDefault(); cerrarModalesAuth(); setSesion(true); mostrarToast('Cuenta creada (demostración).', 'exito'); };
const cerrarSesionCliente = () => { setSesion(false); cambiarVista(vistaActualVisible, 'vista-inicio'); };
const manejarFormularioContacto = (e) => { e.preventDefault(); mostrarToast('Mensaje enviado (demostración).', 'exito'); cambiarVista('vista-contacto', vistaAnteriorAContacto); };

/* ---------- Mapa de sedes ---------- */
let mapa = null, marcador = null, sedeMapa = 's1';
function pintarInfoSede(id) {
    const s = SEDES[id]; sedeMapa = id;
    $('ub-nombre').textContent = s.nombre; $('ub-dir').textContent = s.dir; $('ub-horario').textContent = `Todos los días, ${s.horario}`;
    $('ub-tel').textContent = s.tel; $('ub-salas').textContent = `${s.salas} salas · Estacionamiento disponible`;
    $$('[data-sede-btn]').forEach(b => { b.classList.toggle('border-brand-yellow', b.dataset.sedeBtn === id); b.classList.toggle('border-white/5', b.dataset.sedeBtn !== id); });
}
function seleccionarSedeMapa(id) {
    pintarInfoSede(id);
    if (mapa) { const c = SEDES[id].coords; mapa.flyTo(c, 16); marcador.setLatLng(c).bindPopup(`<strong>${SEDES[id].nombre}</strong>`).openPopup(); }
}
const elegirSedeDesdeMapa = () => elegirSedeNav(sedeMapa);
function iniciarMapa() {
    pintarInfoSede(sedeMapa);
    if (typeof L === 'undefined') return;
    if (mapa) { setTimeout(() => mapa.invalidateSize(), 200); return; }
    const c = SEDES[sedeMapa].coords;
    mapa = L.map('mapa-ubicacion').setView(c, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
    marcador = L.marker(c).addTo(mapa).bindPopup(`<strong>${SEDES[sedeMapa].nombre}</strong>`).openPopup();
    setTimeout(() => mapa.invalidateSize(), 200);
}

/* ---------- Navegador de pantallas ---------- */
function irAPantalla(id) {
    toggleNavegadorPantallas();
    if (id === 'detalle') return abrirDetallePelicula('spiderman');
    if (id === 'vista-asientos') { abrirDetallePelicula('spiderman'); setTimeout(irAAsientos, 400); return; }
    if (id === 'vista-ubicacion') return abrirVistaUbicacion();
    if (id === 'vista-dulceria') { $('btn-volver-asientos-dulceria').classList.remove('hidden'); pintarSedeDulceria(); }
    if (['vista-beneficios', 'vista-historial', 'modal-perfil', 'modal-carnet-socio'].includes(id)) setSesion(true);
    if (id.startsWith('modal-')) return abrirModal(id);
    cambiarVista(vistaActualVisible, id);
}

document.addEventListener('DOMContentLoaded', () => {
    const sedeDef = 's1';
    $('f-ciudad').value = ''; aplicarFiltroInicio();
    ajustarAltura('vista-inicio');
    pintarInfoSede(sedeDef);
    // El enlace "Cerrar sesión" del cliente no debe llevar al acceso de personal
    window.cerrarSesion = cerrarSesionCliente;
});
