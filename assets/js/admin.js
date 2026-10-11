/* ============================================================================
   CINE NÁUTICA — admin.js (Admin de Sede + Super Admin) — solo diseño
   ============================================================================ */
/* ---------- Gestión Sede (Super Admin): lista <-> panel de sede ---------- */
function abrirSede(id) {
    const s = SEDES[id];
    $('ctx-nombre').textContent = s.nombre;
    $('ctx-ruta').textContent = `Gestión Sede › ${s.region} › ${s.ciudad}`;
    $('ctx-estado').textContent = s.estado; $('ctx-salas').textContent = `${s.salas} salas`;
    $('ctx-funciones').textContent = `${s.funciones} funciones hoy`; $('ctx-ocup').textContent = `${s.ocup}% ocupación`;
    $$('.js-sede-nombre').forEach(e => e.textContent = s.nombre);
    $('gs-lista').classList.add('hidden'); $('gs-detalle').classList.remove('hidden');
    cambiarTab('sede', 'dashboard');
}
function volverASedes() { $('gs-detalle').classList.add('hidden'); $('gs-lista').classList.remove('hidden'); window.scrollTo({ top: 0 }); }

function alCambiarRegionGS() {
    const r = $('gs-region').value, c = $('gs-ciudad');
    [...c.options].forEach(o => { o.hidden = o.value && r && o.dataset.region !== r; });
    if (c.selectedOptions[0] && c.selectedOptions[0].hidden) c.value = '';
    filtrarSedes();
}
function filtrarSedes() {
    const q = $('gs-buscar').value.trim().toLowerCase(), r = $('gs-region').value, c = $('gs-ciudad').value;
    let nSedes = 0, nCiudades = 0;
    $$('#gs-resultados .acc').forEach(acc => {
        let visibles = 0;
        $$('.sede-card', acc).forEach(card => {
            const ok = (!q || card.dataset.nombre.includes(q)) && (!r || acc.dataset.region === r) && (!c || acc.dataset.ciudad === c);
            card.style.display = ok ? '' : 'none'; if (ok) visibles++;
        });
        acc.style.display = visibles ? '' : 'none';
        if (visibles) { nSedes += visibles; nCiudades++; if (q) acc.classList.add('open'); }
    });
    $$('#gs-resultados [data-region-bloque]').forEach(b => { b.style.display = $$('.acc', b).some(a => a.style.display !== 'none') ? '' : 'none'; });
    $('gs-contador').textContent = `${nSedes} ${nSedes === 1 ? 'sede' : 'sedes'} en ${nCiudades} ${nCiudades === 1 ? 'ciudad' : 'ciudades'}`;
    $('gs-vacio').classList.toggle('hidden', nSedes > 0);
}

/* ---------- Dashboard General: filtros en cascada (solo cambia el texto de alcance) ---------- */
function alCambiarRegionDash() {
    const r = $('dg-region').value, c = $('dg-ciudad');
    [...c.options].forEach(o => { o.hidden = o.value && r && o.dataset.region !== r; });
    if (c.selectedOptions[0] && c.selectedOptions[0].hidden) c.value = '';
    alCambiarCiudadDash();
}
function alCambiarCiudadDash() {
    const c = $('dg-ciudad').value, s = $('dg-sede');
    [...s.options].forEach(o => { o.hidden = o.value && c && o.dataset.ciudad !== c; });
    if (s.selectedOptions[0] && s.selectedOptions[0].hidden) s.value = '';
    pintarAlcanceDash();
}
function pintarAlcanceDash() {
    const r = $('dg-region').value, c = $('dg-ciudad').value, s = $('dg-sede').value;
    const txt = s || c || r || 'Todas las sedes';
    $('dg-alcance').innerHTML = `<i class="fa-solid fa-globe text-brand-blue mr-1"></i>Mostrando: <b class="text-slate-300">${txt}</b>${s ? '' : c ? ' · sedes de la ciudad' : r ? ' · sedes de la región' : ' · 8 sedes · 4 ciudades · 3 regiones'}`;
}
function limpiarDash() { ['dg-region', 'dg-ciudad', 'dg-sede'].forEach(i => $(i).value = ''); alCambiarRegionDash(); }

/* ---------- Dulcería de sede: filtro por categoría (prueba) ---------- */
function filtrarCatSede(btn, cat) {
    $$('#chips-cat-sede button').forEach(b => { b.classList.remove('text-brand-yellow', 'border-brand-yellow'); b.classList.add('text-slate-400', 'border-transparent'); });
    btn.classList.remove('text-slate-400', 'border-transparent'); btn.classList.add('text-brand-yellow', 'border-brand-yellow');
    $$('#grid-dulceria-sede [data-cat]').forEach(p => { p.style.display = (cat === 'all' || p.dataset.cat === cat) ? '' : 'none'; });
}

/* ---------- Paneles heredados del admin original ---------- */
function cambiarPestanaSala(p) {
    $('admin-panel-estructura-sala').classList.toggle('hidden', p !== 'estructura');
    $('admin-panel-estados-sala').classList.toggle('hidden', p !== 'estados');
    $('admin-grid-salas').classList.toggle('modo-estructura', p === 'estructura');
    [['estructura', 'admin-pestana-estructura'], ['estados', 'admin-pestana-estados']].forEach(([k, id]) => {
        const b = $(id), on = k === p;
        b.classList.toggle('text-brand-yellow', on); b.classList.toggle('border-brand-yellow', on);
        b.classList.toggle('text-slate-500', !on); b.classList.toggle('border-transparent', !on);
    });
}
function generarMatriz() {
    const filas = Math.min(26, Math.max(1, Number.parseInt($('admin-sala-filas').value, 10) || 1));
    const columnas = Math.min(30, Math.max(1, Number.parseInt($('admin-sala-columnas').value, 10) || 1));
    const grid = $('admin-grid-salas');
    const fragment = document.createDocumentFragment();
    grid.style.setProperty('--columnas-sala', columnas);
    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 1; columna <= columnas; columna++) {
            const codigo = `${String.fromCharCode(65 + fila)}${columna}`;
            const asiento = document.createElement('button');
            asiento.type = 'button';
            asiento.className = 'butaca-matriz disponible';
            asiento.dataset.codigo = codigo;
            asiento.title = codigo;
            asiento.textContent = codigo;
            fragment.appendChild(asiento);
        }
    }
    grid.replaceChildren(fragment);
    actualizarContadorSala();
}
function cambiarSalaMantenimiento(sala) {
    $('admin-grid-salas').dataset.sala = sala;
    $('admin-sala-filas').value = 7;
    $('admin-sala-columnas').value = 12;
    generarMatriz();
    mostrarToast(`Distribución base de Sala ${sala} cargada.`, 'info');
}
function actualizarContadorSala() {
    const asientos = $$('#admin-grid-salas .butaca-matriz:not(.pasadizo)');
    const bloqueadas = asientos.filter(asiento => asiento.classList.contains('mantenimiento')).length;
    $('admin-contador-bloqueadas').textContent = `${bloqueadas} / ${asientos.length}`;
}
function clickMatrizEstructura(event) {
    const asiento = event.target.closest('.butaca-matriz');
    if (!asiento) return;
    const estructura = !$('admin-panel-estructura-sala').classList.contains('hidden');
    if (estructura) {
        if (asiento.classList.contains('pasadizo')) {
            const codigo = asiento.dataset.codigo || '';
            asiento.className = 'butaca-matriz disponible';
            asiento.textContent = codigo;
            asiento.title = codigo;
        } else {
            asiento.dataset.codigo = asiento.dataset.codigo || asiento.textContent || asiento.title;
            asiento.className = 'butaca-matriz pasadizo';
            asiento.textContent = '';
            asiento.title = 'Pasadizo';
        }
    } else {
        if (asiento.classList.contains('pasadizo')) return;
        const estados = ['disponible', 'mantenimiento', 'accesible'];
        const actual = estados.findIndex(estado => asiento.classList.contains(estado));
        asiento.classList.remove(...estados);
        asiento.classList.add(estados[(actual + 1) % estados.length]);
    }
    actualizarContadorSala();
}
function toggleEstadoSalaAdmin(activa) {
    $('admin-sala-estado-texto').textContent = activa ? 'Activa' : 'Inactiva';
    $('admin-sala-estado-texto').classList.toggle('text-green-500', activa);
    $('admin-sala-estado-texto').classList.toggle('text-brand-red', !activa);
}
function guardarCambiosSala() {
    mostrarToast(`Cambios de Sala ${$('admin-select-sala').value} guardados en esta demostración.`, 'exito');
}
function restablecerCambiosSala() {
    generarMatriz();
    mostrarToast('Distribución de asientos restablecida.', 'info');
}
const toggleDatepickerHorarios = () => $('datepicker-dropdown').classList.toggle('visible');
function verSocioAdmin() { const r = $('admin-socio-resultado'); r.classList.remove('hidden'); r.classList.add('flex'); r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function verPersonalAdmin() { const p = $('admin-personal-detalle-panel'); p.classList.remove('hidden'); p.classList.add('flex'); p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
const alternarOrigenImagenAdmin = (k) => {
    const archivo = document.querySelector(`input[name="admin-${k}-origen-img"]:checked`)?.value === 'archivo';
    const url = $(k === 'pelicula' ? 'admin-pelicula-poster-url' : 'admin-dulce-imagen-url');
    const file = $(k === 'pelicula' ? 'admin-pelicula-poster-archivo' : 'admin-dulce-imagen-archivo');
    if (url && file) { url.classList.toggle('hidden', archivo); file.classList.toggle('hidden', !archivo); }
};
const actualizarTipoPeliculaAdmin = () => {
    const e = $('admin-pelicula-es-estreno'); if (!e) return;
    $('admin-pelicula-tipo-mensaje').textContent = e.checked ? 'PRÓXIMO ESTRENO: aún sin funciones programadas.' : 'EN CARTELERA: cada sede podrá programarle funciones.';
    $('admin-pelicula-lanzamiento-contenedor').classList.toggle('hidden', e.checked);
};
const alternarOrigenImagenBannerAdmin = () => { };

/* ---------- Navegador de pantallas ---------- */
function irAPantalla(js) { toggleNavegadorPantallas(); (new Function(js))(); }

let cuponSedeEnEdicion = null;
function modalEdicionCuponSede() {
    let modal = $('modal-editar-cupon-sede');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'modal-editar-cupon-sede';
    modal.className = 'hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4';
    modal.innerHTML = `<div class="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200">
        <button type="button" class="absolute top-4 right-4 text-slate-400 hover:text-white" aria-label="Cerrar" onclick="cerrarModal('modal-editar-cupon-sede')"><i class="fa-solid fa-xmark text-xl"></i></button>
        <h3 class="text-2xl font-bold text-white mb-5">Editar cupón de sede</h3>
        <form class="space-y-3" onsubmit="guardarEdicionCuponSede(event)">
            <input id="editar-cupon-codigo" class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white uppercase" placeholder="Código" required>
            <input id="editar-cupon-descuento" class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white" type="number" min="1" max="100" placeholder="Porcentaje" required>
            <input id="editar-cupon-descripcion" class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white" placeholder="Descripción">
            <div class="grid grid-cols-2 gap-3"><label class="text-xs text-slate-400">Vigente desde<input id="editar-cupon-desde" class="mt-1 w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-white" type="date"></label><label class="text-xs text-slate-400">Hasta<input id="editar-cupon-hasta" class="mt-1 w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-white" type="date"></label></div>
            <button type="submit" class="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold">Editar Cupón</button>
        </form>
    </div>`;
    document.body.appendChild(modal);
    return modal;
}
function editarCuponSede(button) {
    cuponSedeEnEdicion = button.closest('.flex.items-center.justify-between.bg-dark-900');
    if (!cuponSedeEnEdicion) return;
    const modal = modalEdicionCuponSede();
    const codigo = cuponSedeEnEdicion.querySelector('p.text-brand-yellow').textContent.trim();
    const fechasDemo = {
        CHIMBOTE15: ['2026-10-01', '2026-10-31'],
        FAMILIA25: ['2026-10-01', '2026-12-31']
    }[codigo] || ['', ''];
    $('editar-cupon-codigo').value = codigo;
    $('editar-cupon-descuento').value = cuponSedeEnEdicion.querySelector('span.text-white.font-bold').textContent.match(/[\d.]+/)[0];
    $('editar-cupon-descripcion').value = cuponSedeEnEdicion.querySelector('p.text-slate-500').textContent.trim();
    $('editar-cupon-desde').value = cuponSedeEnEdicion.dataset.desde || fechasDemo[0];
    $('editar-cupon-hasta').value = cuponSedeEnEdicion.dataset.hasta || fechasDemo[1];
    abrirModal(modal.id);
}
function guardarEdicionCuponSede(event) {
    event.preventDefault();
    if (!cuponSedeEnEdicion) return;
    const codigo = $('editar-cupon-codigo').value.trim().toUpperCase();
    const descuento = Number($('editar-cupon-descuento').value);
    const descripcion = $('editar-cupon-descripcion').value.trim();
    cuponSedeEnEdicion.dataset.desde = $('editar-cupon-desde').value;
    cuponSedeEnEdicion.dataset.hasta = $('editar-cupon-hasta').value;
    cuponSedeEnEdicion.querySelector('p.text-brand-yellow').textContent = codigo;
    cuponSedeEnEdicion.querySelector('p.text-slate-500').textContent = descripcion;
    cuponSedeEnEdicion.querySelector('span.text-white.font-bold').textContent = `-${descuento}%`;
    cuponSedeEnEdicion = null;
    cerrarModal('modal-editar-cupon-sede');
    mostrarToast('Cupón de sede actualizado en esta demostración.', 'exito');
}

document.addEventListener('click', event => {
    const boton = event.target.closest('[data-panel="sede:descuentos"] button');
    if (!boton || !boton.querySelector('.fa-pen')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    editarCuponSede(boton);
}, true);

document.addEventListener('DOMContentLoaded', () => {
    $$('[data-panel^="glob:"]').forEach((p, i) => p.classList.toggle('hidden', i !== 0));
    const dashboard = document.querySelector('[data-panel="top:dash"]');
    if (dashboard) {
        const tituloTransacciones = [...dashboard.querySelectorAll('h3')].find(titulo => titulo.textContent.trim() === 'Últimas transacciones');
        const tituloTopPeliculas = [...dashboard.querySelectorAll('h3')].find(titulo => titulo.textContent.trim() === 'Top películas');
        tituloTransacciones?.closest('.bg-dark-800')?.remove();
        tituloTopPeliculas?.closest('.bg-dark-800')?.classList.add('xl:col-span-2');
    }
    $$('[data-panel="sede:cartelera"] label').forEach(label => {
        if (label.textContent.trim().startsWith('En sede')) label.remove();
    });
    $$('[data-panel="sede:tarifas"]').forEach(panel => {
        const bloque = [...panel.querySelectorAll('.bg-dark-800')].find(el => el.querySelector('h3')?.textContent.toLowerCase().includes('tarifas especiales'));
        if (bloque) bloque.remove();
    });
    $$('[id="modal-tarifa-especial"]').forEach(modal => modal.remove());
    $$('#navegador-pantallas button.nav-pant').filter(button => button.textContent.trim() === 'Tarifa especial').forEach(button => button.remove());
    $$('#grid-dulceria-sede .toggle-stock').forEach(input => input.addEventListener('change', () => {
        const label = input.closest('label');
        const texto = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (texto) texto.textContent = input.checked ? 'Stock' : 'Agotado';
    }));
});
