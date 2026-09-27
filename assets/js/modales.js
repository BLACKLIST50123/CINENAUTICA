/* ============================================================================
   CINE NÁUTICA — MODALES.JS — Componente reutilizable de confirmación / alerta
   ------------------------------------------------------------------------
   Parte de la arquitectura modular de la app (Módulo 1 — infraestructura).
   Reemplaza alert() y confirm() nativos por modales con la estética de la
   app. Se inyecta una única vez en el DOM (no requiere tocar index.html)
   y se reutiliza en todos los módulos siguientes.

   Uso:
     const ok = await confirmarAccion({
         titulo: '¿Eliminar producto?',
         mensaje: 'Esta acción no se puede deshacer.',
         tipo: 'peligro',              // 'peligro' | 'advertencia' | 'info'
         textoConfirmar: 'Eliminar',
         textoCancelar: 'Cancelar'
     });
     if (ok) { ... }

     await alertaBonita({ titulo: 'Listo', mensaje: 'Cambios guardados.', tipo: 'info' });
   ============================================================================ */

function crearModalConfirmacionSiNoExiste() {
    if (document.getElementById('modal-confirmacion-global')) return;

    const div = document.createElement('div');
    div.id = 'modal-confirmacion-global';
    div.className = 'hidden fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4';
    div.innerHTML = `
        <div class="bg-dark-800 p-6 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full transform scale-95 transition-transform duration-200" id="confirmacion-global-contenido">
            <div id="confirmacion-global-icono-wrap" class="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i id="confirmacion-global-icono" class="fa-solid text-2xl"></i>
            </div>
            <h3 id="confirmacion-global-titulo" class="text-white font-bold text-lg text-center mb-2"></h3>
            <p id="confirmacion-global-mensaje" class="text-slate-400 text-sm text-center mb-6 leading-relaxed whitespace-pre-line"></p>
            <div id="confirmacion-global-barra-tiempo-track" class="hidden w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6 -mt-3">
                <div id="confirmacion-global-barra-tiempo" class="h-full bg-brand-yellow rounded-full" style="width:100%"></div>
            </div>
            <div class="flex gap-3">
                <button id="confirmacion-global-btn-cancelar" type="button" class="flex-1 bg-dark-900 hover:bg-dark-700 border border-white/10 text-white py-2.5 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
                <button id="confirmacion-global-btn-confirmar" type="button" class="flex-1 bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-xl font-bold text-sm transition-colors">Confirmar</button>
            </div>
        </div>`;
    document.body.appendChild(div);
}

const ESTILOS_MODAL_CONFIRMACION = {
    peligro: { bg: 'bg-brand-blue/15', color: 'text-brand-blue', icono: 'fa-triangle-exclamation', btn: 'bg-brand-blue hover:bg-brand-dark-blue' },
    advertencia: { bg: 'bg-brand-yellow/15', color: 'text-brand-yellow', icono: 'fa-circle-exclamation', btn: 'bg-brand-yellow hover:bg-yellow-400 text-black' },
    info: { bg: 'bg-blue-500/15', color: 'text-blue-400', icono: 'fa-circle-info', btn: 'bg-blue-600 hover:bg-blue-700' }
};

/**
 * Reemplazo estilizado de window.confirm(). Devuelve una Promise<boolean>
 * (true si el usuario confirma, false si cancela o cierra el modal).
 */
window.confirmarAccion = ({
    titulo = '¿Estás seguro?',
    mensaje = '',
    tipo = 'peligro',
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    soloConfirmar = false,
    tiempoLimiteMs = null // Módulo 2: si se define, el modal se auto-cierra como "cancelado" al agotarse (ej. modal de permanencia)
} = {}) => {
    crearModalConfirmacionSiNoExiste();

    return new Promise((resolve) => {
        const modal = document.getElementById('modal-confirmacion-global');
        const contenido = document.getElementById('confirmacion-global-contenido');
        const iconoWrap = document.getElementById('confirmacion-global-icono-wrap');
        const icono = document.getElementById('confirmacion-global-icono');
        const btnConfirmar = document.getElementById('confirmacion-global-btn-confirmar');
        const btnCancelar = document.getElementById('confirmacion-global-btn-cancelar');
        const trackTiempo = document.getElementById('confirmacion-global-barra-tiempo-track');
        const barraTiempo = document.getElementById('confirmacion-global-barra-tiempo');

        // PREVENCIÓN DE SOLAPAMIENTO: si hay otra promesa de confirmación activa, la cancelamos y limpiamos
        if (window._confirmacionCerrarActual) {
            window._confirmacionCerrarActual(false, true); // true = solapado
        }
        if (window._timeoutOcultarConfirmacion) {
            clearTimeout(window._timeoutOcultarConfirmacion);
        }

        document.getElementById('confirmacion-global-titulo').textContent = titulo;
        document.getElementById('confirmacion-global-mensaje').textContent = mensaje;

        const estilo = ESTILOS_MODAL_CONFIRMACION[tipo] || ESTILOS_MODAL_CONFIRMACION.peligro;
        iconoWrap.className = `w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${estilo.bg}`;
        icono.className = `fa-solid ${estilo.icono} text-2xl ${estilo.color}`;

        btnConfirmar.textContent = textoConfirmar;
        btnConfirmar.className = `flex-1 text-white py-2.5 rounded-xl font-bold text-sm transition-colors ${estilo.btn}`;
        btnCancelar.textContent = textoCancelar;
        btnCancelar.classList.toggle('hidden', soloConfirmar);

        let idTimeoutLimite = null;

        const cerrar = (resultado, solapado = false) => {
            window._confirmacionCerrarActual = null;
            btnConfirmar.removeEventListener('click', onConfirmar);
            btnCancelar.removeEventListener('click', onCancelar);
            document.removeEventListener('keydown', onEscape);
            if (idTimeoutLimite) clearTimeout(idTimeoutLimite);
            
            if (!solapado) {
                modal.classList.add('opacity-0');
                contenido.classList.add('scale-95');
                window._timeoutOcultarConfirmacion = setTimeout(() => modal.classList.add('hidden'), 200);
            }
            resolve(resultado);
        };
        window._confirmacionCerrarActual = cerrar;

        const onConfirmar = () => cerrar(true);
        const onCancelar = () => cerrar(false);
        const onEscape = (ev) => { if (ev.key === 'Escape') cerrar(false); };

        btnConfirmar.addEventListener('click', onConfirmar);
        btnCancelar.addEventListener('click', onCancelar);
        document.addEventListener('keydown', onEscape);

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            contenido.classList.remove('scale-95');
        }, 10);

        if (tiempoLimiteMs) {
            trackTiempo.classList.remove('hidden');
            barraTiempo.style.transition = 'none';
            barraTiempo.style.width = '100%';
            // Doble rAF: fuerza al navegador a pintar el 100% antes de animar a 0, si no la transición no se ve.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                barraTiempo.style.transition = `width ${tiempoLimiteMs}ms linear`;
                barraTiempo.style.width = '0%';
            }));
            idTimeoutLimite = setTimeout(() => cerrar(false), tiempoLimiteMs);
        } else {
            trackTiempo.classList.add('hidden');
        }
    });
};

/**
 * Reemplazo estilizado de window.alert(). Devuelve una Promise<void>
 * que se resuelve cuando el usuario cierra el aviso.
 */
window.alertaBonita = ({ titulo = 'Aviso', mensaje = '', tipo = 'info' } = {}) => {
    return window.confirmarAccion({
        titulo,
        mensaje,
        tipo,
        textoConfirmar: 'Entendido',
        soloConfirmar: true
    }).then(() => {});
};

window.solicitarMotivoContingencia = ({
    titulo = 'Motivo de Contingencia',
    tipoOperacion = 'reubicacion' // 'reubicacion' | 'reembolso'
} = {}) => {
    return new Promise((resolve) => {
        const idModal = 'modal-contingencia';
        let div = document.getElementById(idModal);
        if (!div) {
            div = document.createElement('div');
            div.id = idModal;
            div.className = 'hidden fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200 p-4';
            document.body.appendChild(div);
        }

        const opcionesMotivo = tipoOperacion === 'reubicacion' 
            ? ['Reubicación por mantenimiento de sala', 'Reubicación por cambio de horario', 'Deseo del cliente (excepción)', 'Error en compra inicial']
            : ['Cancelación de función', 'Emergencia de sala', 'Deseo del cliente (excepción)', 'Error en compra inicial', 'Duplicidad de cobro'];

        div.innerHTML = `
            <div class="bg-dark-800 p-6 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full transform scale-95 transition-transform duration-200" id="${idModal}-contenido">
                <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto bg-brand-yellow/15 text-brand-yellow">
                    <i class="fa-solid fa-clipboard-question text-2xl"></i>
                </div>
                <h3 class="text-white font-bold text-lg text-center mb-4">${titulo}</h3>
                
                <div class="mb-4 text-left">
                    <label class="block text-slate-400 text-xs font-bold mb-1">Motivo</label>
                    <select id="${idModal}-motivo" class="w-full bg-dark-900 border border-white/10 text-white rounded-lg p-2.5 focus:border-brand-yellow outline-none transition-colors">
                        ${opcionesMotivo.map(m => `<option value="${m}">${m}</option>`).join('')}
                        <option value="Otro">Otro...</option>
                    </select>
                </div>
                
                <div class="mb-6 text-left">
                    <label class="block text-slate-400 text-xs font-bold mb-1">Observaciones (Opcional)</label>
                    <textarea id="${idModal}-obs" rows="2" placeholder="Detalles adicionales..." class="w-full bg-dark-900 border border-white/10 text-white rounded-lg p-2.5 focus:border-brand-yellow outline-none transition-colors resize-none"></textarea>
                </div>

                <div class="flex gap-3">
                    <button id="${idModal}-btn-cancelar" type="button" class="flex-1 bg-dark-900 hover:bg-dark-700 border border-white/10 text-white py-2.5 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
                    <button id="${idModal}-btn-confirmar" type="button" class="flex-1 bg-brand-yellow hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-sm transition-colors">Confirmar</button>
                </div>
            </div>`;

        div.classList.remove('hidden');
        setTimeout(() => { div.classList.remove('opacity-0'); document.getElementById(`${idModal}-contenido`).classList.remove('scale-95'); }, 10);

        const btnConfirmar = document.getElementById(`${idModal}-btn-confirmar`);
        const btnCancelar = document.getElementById(`${idModal}-btn-cancelar`);

        const cerrar = (resultado) => {
            div.classList.add('opacity-0');
            document.getElementById(`${idModal}-contenido`).classList.add('scale-95');
            setTimeout(() => div.classList.add('hidden'), 200);
            resolve(resultado);
        };

        btnConfirmar.onclick = () => {
            const motivo = document.getElementById(`${idModal}-motivo`).value;
            const obs = document.getElementById(`${idModal}-obs`).value.trim();
            cerrar({ motivo, obs });
        };
        btnCancelar.onclick = () => cerrar(null);
    });
};
