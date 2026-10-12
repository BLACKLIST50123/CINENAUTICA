// @ts-nocheck
/* Migrado desde assets/js/admin.js — lógica de interfaz (solo diseño). Se reemplazará por estado React / Supabase más adelante. */
import { $, $$, mostrarToast, demo, abrirModal, cerrarModal, cerrarModalFuncion, cambiarTab, segmento } from "./common";
import { SEDES_ADMIN as SEDES } from "./data";
declare const L: any;

/* ============================================================================
   CINE NÁUTICA — admin.js (Admin de Sede + Super Admin) — solo diseño
   ============================================================================ */
/* ---------- Gestión Sede (Super Admin): lista <-> panel de sede ---------- */
export function abrirSede(id?, ..._x: any[]) {
    const s = SEDES[id];
    $('ctx-nombre').textContent = s.nombre;
    $('ctx-ruta').textContent = `Gestión Sede › ${s.region} › ${s.ciudad}`;
    $('ctx-estado').textContent = s.estado; $('ctx-salas').textContent = `${s.salas} salas`;
    $('ctx-funciones').textContent = `${s.funciones} funciones hoy`; $('ctx-ocup').textContent = `${s.ocup}% ocupación`;
    $$('.js-sede-nombre').forEach(e => e.textContent = s.nombre);
    $('gs-lista').classList.add('hidden'); $('gs-detalle').classList.remove('hidden');
    cambiarTab('sede', 'dashboard');
}
export function volverASedes(..._x: any[]) { $('gs-detalle').classList.add('hidden'); $('gs-lista').classList.remove('hidden'); window.scrollTo({ top: 0 }); }

export function alCambiarRegionGS(..._x: any[]) {
    const r = $('gs-region').value, c = $('gs-ciudad');
    [...c.options].forEach(o => { o.hidden = o.value && r && o.dataset.region !== r; });
    if (c.selectedOptions[0] && c.selectedOptions[0].hidden) c.value = '';
    filtrarSedes();
}
export function filtrarSedes(..._x: any[]) {
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
export function alCambiarRegionDash(..._x: any[]) {
    const r = $('dg-region').value, c = $('dg-ciudad');
    [...c.options].forEach(o => { o.hidden = o.value && r && o.dataset.region !== r; });
    if (c.selectedOptions[0] && c.selectedOptions[0].hidden) c.value = '';
    alCambiarCiudadDash();
}
export function alCambiarCiudadDash(..._x: any[]) {
    const c = $('dg-ciudad').value, s = $('dg-sede');
    [...s.options].forEach(o => { o.hidden = o.value && c && o.dataset.ciudad !== c; });
    if (s.selectedOptions[0] && s.selectedOptions[0].hidden) s.value = '';
    pintarAlcanceDash();
}
export function pintarAlcanceDash(..._x: any[]) {
    const r = $('dg-region').value, c = $('dg-ciudad').value, s = $('dg-sede').value;
    const txt = s || c || r || 'Todas las sedes';
    $('dg-alcance').innerHTML = `<i class="fa-solid fa-globe text-brand-blue mr-1"></i>Mostrando: <b class="text-slate-300">${txt}</b>${s ? '' : c ? ' · sedes de la ciudad' : r ? ' · sedes de la región' : ' · 8 sedes · 4 ciudades · 3 regiones'}`;
}
export function limpiarDash(..._x: any[]) { ['dg-region', 'dg-ciudad', 'dg-sede'].forEach(i => $(i).value = ''); alCambiarRegionDash(); }

/* ---------- Dulcería de sede: filtro por categoría (prueba) ---------- */
export function filtrarCatSede(btn?, cat?, ..._x: any[]) {
    $$('#chips-cat-sede button').forEach(b => { b.classList.remove('text-brand-yellow', 'border-brand-yellow'); b.classList.add('text-slate-400', 'border-transparent'); });
    btn.classList.remove('text-slate-400', 'border-transparent'); btn.classList.add('text-brand-yellow', 'border-brand-yellow');
    $$('#grid-dulceria-sede [data-cat]').forEach(p => { p.style.display = (cat === 'all' || p.dataset.cat === cat) ? '' : 'none'; });
}

/* ---------- Paneles heredados del admin original ---------- */
export function cambiarPestanaSala(p?, ..._x: any[]) {
    $('admin-panel-estructura-sala').classList.toggle('hidden', p !== 'estructura');
    $('admin-panel-estados-sala').classList.toggle('hidden', p !== 'estados');
    $('admin-grid-salas').classList.toggle('modo-estructura', p === 'estructura');
    [['estructura', 'admin-pestana-estructura'], ['estados', 'admin-pestana-estados']].forEach(([k, id]) => {
        const b = $(id), on = k === p;
        b.classList.toggle('text-brand-yellow', on); b.classList.toggle('border-brand-yellow', on);
        b.classList.toggle('text-slate-500', !on); b.classList.toggle('border-transparent', !on);
    });
}
export function generarMatriz(..._x: any[]) {
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
export function cambiarSalaMantenimiento(sala?, ..._x: any[]) {
    $('admin-grid-salas').dataset.sala = sala;
    $('admin-sala-filas').value = 7;
    $('admin-sala-columnas').value = 12;
    generarMatriz();
    mostrarToast(`Distribución base de Sala ${sala} cargada.`, 'info');
}
export function actualizarContadorSala(..._x: any[]) {
    const asientos = $$('#admin-grid-salas .butaca-matriz:not(.pasadizo)');
    const bloqueadas = asientos.filter(asiento => asiento.classList.contains('mantenimiento')).length;
    $('admin-contador-bloqueadas').textContent = `${bloqueadas} / ${asientos.length}`;
}
export function clickMatrizEstructura(event?, ..._x: any[]) {
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
/* Estado operativo de la sala: ACTIVA | MANTENIMIENTO | INACTIVA (enum estado_sala) */
export function cambiarEstadoSalaAdmin(valor?, ..._x: any[]) {
    const s = $('admin-sala-estado');
    s.classList.remove('text-green-500', 'text-brand-yellow', 'text-brand-red');
    s.classList.add(valor === 'ACTIVA' ? 'text-green-500' : valor === 'MANTENIMIENTO' ? 'text-brand-yellow' : 'text-brand-red');
}
export function guardarCambiosSala(..._x: any[]) {
    mostrarToast(`Cambios de Sala ${$('admin-select-sala').value} guardados en esta demostración.`, 'exito');
}
export function restablecerCambiosSala(..._x: any[]) {
    generarMatriz();
    mostrarToast('Distribución de asientos restablecida.', 'info');
}
/* ---------- Cancelar / reprogramar función (reprogramacion_funcion: motivo + detalle obligatorios) ---------- */
export const abrirModalCancelarFuncion = (..._x: any[]) => abrirModal('modal-cancelar-funcion');
export function modoCambioFuncion(btn?, modo?, ..._x: any[]) {
    segmento(btn);
    $('cambio-funcion-reprogramar').classList.toggle('hidden', modo !== 'reprogramar');
    $('cambio-funcion-confirmar').textContent = modo === 'reprogramar' ? 'Confirmar reprogramación' : 'Confirmar cancelación';
}
export function confirmarCambioFuncion(event?, ..._x: any[]) {
    event.preventDefault();
    cerrarModal('modal-cancelar-funcion');
    cerrarModalFuncion();
    demo();
}
/* Idioma de audio de la función: una sola opción (funcion.idioma_audio) */
export const toggleDatepickerHorarios = (..._x: any[]) => $('datepicker-dropdown').classList.toggle('visible');
export function verSocioAdmin(..._x: any[]) { const r = $('admin-socio-resultado'); r.classList.remove('hidden'); r.classList.add('flex'); r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
export function verPersonalAdmin(..._x: any[]) { const p = $('admin-personal-detalle-panel'); p.classList.remove('hidden'); p.classList.add('flex'); p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
export const alternarOrigenImagenAdmin = (k?, ..._x: any[]) => {
    const archivo = document.querySelector(`input[name="admin-${k}-origen-img"]:checked`)?.value === 'archivo';
    const url = $(k === 'pelicula' ? 'admin-pelicula-poster-url' : 'admin-dulce-imagen-url');
    const file = $(k === 'pelicula' ? 'admin-pelicula-poster-archivo' : 'admin-dulce-imagen-archivo');
    if (url && file) { url.classList.toggle('hidden', archivo); file.classList.toggle('hidden', !archivo); }
};
export const actualizarTipoPeliculaAdmin = (..._x: any[]) => {
    const e = $('admin-pelicula-es-estreno');
    if (!e) return;

    // Texto explicativo
    $('admin-pelicula-tipo-mensaje').textContent = e.checked
        ? 'PRÓXIMO ESTRENO: aún sin funciones programadas.'
        : 'EN CARTELERA: cada sede podrá programarle funciones.';

    // Tipo de lanzamiento (Regular, Pre-Estreno, etc.) solo se muestra en Cartelera (!e.checked)
    $('admin-pelicula-lanzamiento-contenedor')?.classList.toggle('hidden', e.checked);

    // Fecha de estreno solo se muestra si es Próximo Estreno (e.checked)
    $('admin-pelicula-fecha-estreno-contenedor')?.classList.toggle('hidden', !e.checked);
};

export const alternarOrigenImagenBannerAdmin = (k?, ..._x: any[]) => {
    const archivo = document.querySelector(`input[name="admin-${k}-banner-origen-img"]:checked`)?.value === 'archivo';
    const url = document.getElementById(`admin-${k}-banner-url`);
    const file = document.getElementById(`admin-${k}-banner-archivo`);
    if (url && file) {
        url.classList.toggle('hidden', archivo);
        file.classList.toggle('hidden', !archivo);
    }
};


export let cuponSedeEnEdicion = null;
export function modalEdicionCuponSede(..._x: any[]) {
    let modal = $('modal-editar-cupon-sede');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'modal-editar-cupon-sede';
    modal.className = 'hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4';
    modal.innerHTML = `<div class="bg-dark-800 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative transform scale-95 transition-transform duration-200">
        <button type="button" class="absolute top-4 right-4 text-slate-400 hover:text-white" aria-label="Cerrar" onclick="cerrarModal('modal-editar-cupon-sede')"><i class="fa-solid fa-xmark text-xl"></i></button>
        <h3 class="text-2xl font-bold text-white mb-5">Editar cupón de sede</h3>
        <form class="space-y-3" onsubmit="guardarEdicionCuponSede(event)">
            <input id="editar-cupon-codigo" class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white uppercase" placeholder="Código" maxlength="50" required>
            <input id="editar-cupon-descuento" class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white" type="number" min="1" max="100" placeholder="Porcentaje" required>
            <input id="editar-cupon-descripcion" class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white" placeholder="Descripción">
            <label class="block text-xs text-slate-400">Usos máximos<input id="editar-cupon-usos" class="mt-1 w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-white" type="number" min="1" placeholder="Ej: 100" required></label>
            <div class="grid grid-cols-2 gap-3"><label class="text-xs text-slate-400">Vigente desde<input id="editar-cupon-desde" class="mt-1 w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-white" type="date" required></label><label class="text-xs text-slate-400">Hasta<input id="editar-cupon-hasta" class="mt-1 w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-white" type="date" required></label></div>
            <button type="submit" class="w-full bg-brand-yellow hover:bg-yellow-400 text-black py-3 rounded-xl font-bold">Editar Cupón</button>
        </form>
    </div>`;
    document.body.appendChild(modal);
    return modal;
}
export function editarCuponSede(button?, ..._x: any[]) {
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
    $('editar-cupon-usos').value = cuponSedeEnEdicion.dataset.usos || 100;
    abrirModal(modal.id);
}
export function guardarEdicionCuponSede(event?, ..._x: any[]) {
    event.preventDefault();
    if (!cuponSedeEnEdicion) return;
    const codigo = $('editar-cupon-codigo').value.trim().toUpperCase();
    const descuento = Number($('editar-cupon-descuento').value);
    const descripcion = $('editar-cupon-descripcion').value.trim();
    cuponSedeEnEdicion.dataset.desde = $('editar-cupon-desde').value;
    cuponSedeEnEdicion.dataset.hasta = $('editar-cupon-hasta').value;
    cuponSedeEnEdicion.dataset.usos = $('editar-cupon-usos').value;
    cuponSedeEnEdicion.querySelector('p.text-brand-yellow').textContent = codigo;
    cuponSedeEnEdicion.querySelector('p.text-slate-500').textContent = descripcion;
    cuponSedeEnEdicion.querySelector('span.text-white.font-bold').textContent = `-${descuento}%`;
    cuponSedeEnEdicion = null;
    cerrarModal('modal-editar-cupon-sede');
    mostrarToast('Cupón de sede actualizado en esta demostración.', 'exito');
}

// Alterna entre campo de texto (URL) y botón de cargar archivo
export function alternarOrigenImgSede(tipo?, ..._x: any[]) {
    const inputUrl = document.getElementById('sede-img-url');
    const inputArchivo = document.getElementById('sede-img-archivo');
    const previewImg = document.getElementById('preview-sede-img');
    const previewIcono = document.getElementById('preview-sede-icono');

    if (tipo === 'url') {
        inputUrl.classList.remove('hidden');
        inputArchivo.classList.add('hidden');
        inputArchivo.value = ''; // resetea archivo
        actualizarPreviewSedeUrl(inputUrl.value);
    } else {
        inputUrl.classList.add('hidden');
        inputArchivo.classList.remove('hidden');
        inputUrl.value = ''; // resetea url
        previewImg.classList.add('hidden');
        previewIcono.classList.remove('hidden');
    }
}

// Vista previa cuando escribe o pega una URL
export function actualizarPreviewSedeUrl(url?, ..._x: any[]) {
    const previewImg = document.getElementById('preview-sede-img');
    const previewIcono = document.getElementById('preview-sede-icono');

    if (url && url.trim().length > 5) {
        previewImg.src = url;
        previewImg.onload = () => {
            previewImg.classList.remove('hidden');
            previewIcono.classList.add('hidden');
        };
        previewImg.onerror = () => {
            previewImg.classList.add('hidden');
            previewIcono.classList.remove('hidden');
        };
    } else {
        previewImg.classList.add('hidden');
        previewIcono.classList.remove('hidden');
    }
}

// Vista previa cuando selecciona un archivo desde su PC
export function actualizarPreviewSedeArchivo(input?, ..._x: any[]) {
    const previewImg = document.getElementById('preview-sede-img');
    const previewIcono = document.getElementById('preview-sede-icono');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove('hidden');
            previewIcono.classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        previewImg.classList.add('hidden');
        previewIcono.classList.remove('hidden');
    }
}


let __inited = false;
export function init() {
    if (__inited || typeof document === "undefined") return;
    __inited = true;
    document.addEventListener('click', event => {
        const chip = event.target.closest('#funcion-idioma-chips .chip-selector');
        if (!chip) return;
        $$('#funcion-idioma-chips .chip-selector').forEach(c => c.classList.toggle('chip-selector-activo', c === chip));
    });
    document.addEventListener('click', event => {
        const boton = event.target.closest('[data-panel="sede:descuentos"] button');
        if (!boton || !boton.querySelector('.fa-pen')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        editarCuponSede(boton);
    }, true);
    
}

export function onMount() {
    {
        $$('[data-panel^="glob:"]').forEach((p, i) => p.classList.toggle('hidden', i !== 0));
        const dashboard = document.querySelector('[data-panel="top:dash"]');
        if (dashboard) {
            const tituloTransacciones = [...dashboard.querySelectorAll('h3')].find(titulo => titulo.textContent.trim() === 'Últimas transacciones');
            const tituloTopPeliculas = [...dashboard.querySelectorAll('h3')].find(titulo => titulo.textContent.trim() === 'Top películas');
            tituloTransacciones?.closest('.bg-dark-800')?.classList.add('hidden');
            tituloTopPeliculas?.closest('.bg-dark-800')?.classList.add('xl:col-span-2');
        }
        $$('[data-panel="sede:tarifas"]').forEach(panel => {
            const bloque = [...panel.querySelectorAll('.bg-dark-800')].find(el => el.querySelector('h3')?.textContent.toLowerCase().includes('tarifas especiales'));
            if (bloque) bloque.classList.add('hidden');
        });
        $$('[id="modal-tarifa-especial"]').forEach(modal => modal.classList.add('hidden'));
        $$('#grid-dulceria-sede .toggle-stock').forEach(input => input.addEventListener('change', () => {
            const label = input.closest('label');
            const texto = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            if (texto) texto.textContent = input.checked ? 'Stock' : 'Agotado';
        }));
    }
}
