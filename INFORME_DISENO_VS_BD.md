# Cine Náutica — Informe Diseño vs Base de Datos

## A. Cambios aplicados (reversibles con git)
**Limpieza:** eliminado el "Navegador de pantallas" (botón + panel) de las 4 vistas y su JS/CSS; eliminada la línea pública "Demo admin: admin@… / admin123" del login del cliente; `acceso.html` ya no trae correo/contraseña precargados (el selector de rol/sede queda entre `<!-- DEMO-INICIO -->` y `<!-- DEMO-FIN -->` para borrarlo al conectar Auth).
**Bugs:** `counter.js` mostraba "El Demonio Vuelve" en vez de "La Noche del Demonio"; switch de estado de sala decía "Activa" pero estaba apagado; ficha de personal vacía ("—") → con datos de ejemplo; fechas de funciones anteriores a la compra en Mis Compras/Socios; en Factura el campo "Nombres y Apellidos" ahora pasa a "Razón Social"; "Idioma" de la función ahora es de opción única; faltaba IMAX en todas las listas de formatos (se agregó, recargo de ejemplo S/ 12 → ajústalo).
**Adaptaciones por BD:** ver sección B (marcadas ✅).

## B. Validación diseño ↔ BD
### Diseño pide algo que la BD no tiene
| Diseño | Problema | Acción |
|---|---|---|
| Perfil cliente: "Método de pago guardado" | No hay tabla; además nunca se guarda un PAN | ✅ Bloque eliminado |
| Sede: Apertura / Cierre (modal nueva sede, mapa cliente) | `sede` no tiene horario | ⚠️ Decidir: 2 columnas nuevas o claves en `parametro_sede` |  ** ELIMINADO ** 
| Counter: "Caja 02", "Turno mañana" | Sin tabla de caja/turno | ⚠️ Quitar o crear tabla | ** ELIMINADO **
| Counter: comprobante "Ticket simple" | `comprobante.tipo` solo Boleta/Factura | ⚠️ Decisión legal (SUNAT) |
| Tarifas "Económica/Media/Alta" | `tarifa` es por día, sin nombre | ⚠️ Un tier = varias filas (Económica=Mar; Media=Lun+Mié; Alta=Jue–Dom + fila Prestreno). Opcional: columna `nombre` |
| Cupones "de la sede" vs "globales" | `cupon` no indica dueño | ⚠️ Sugerido: `cupon.id_sede_propietaria` (NULL=global) |
| Promociones: "Combo Pareja" | No es cupón ni producto | ⚠️ Definir dónde vive |
| Contáctenos / Libro de reclamaciones | Sin tabla | ⚠️ Tabla nueva o envío por correo |
| Ficha personal: ver contraseña | Supabase Auth no la expone | ✅ Reemplazado por "Restablecer contraseña" |
| Quitar "Eliminar función" | Con ventas, borrar rompe FKs; BD exige motivo | ✅ Nuevo modal Cancelar/Reprogramar |
| Estado sala solo Activa/Inactiva | Enum tiene MANTENIMIENTO | ✅ Select de 3 estados |
| Idioma solo Doblada/Subtitulada | Falta Original | ✅ Agregado |

### BD exige y el diseño no mostraba (NOT NULL)
✅ Registro cliente: faltaba **Apellidos** (`usuario.apellido`) · Nueva cuenta de personal, admin inicial de sede y registro rápido del counter: nombre y apellido separados · Cupones: **fecha_inicio, fecha_fin, usos_maximos** (global y sede) · Nueva sede: **código** y series boleta/factura · `required` en campos NOT NULL de película/dulce/función/cupón · ✅ Fecha de estreno (opcional) en película.
⚠️ `pelicula.url_banner` es NOT NULL pero el diseño dice "Banner (opcional)": usa el póster como respaldo en el código, o haz la columna nullable.

### Para la fase de lógica
- Duración "2h 15m" → `duracion_min` (parsear). Formato + idioma se muestran juntos ("2D Doblada") pero son `id_formato` + `idioma_audio`. Unificar nombre "XD" vs "SALA XD" al sembrar `formato_proyeccion`.
- IGV 18 %, S/ 0.10 por punto, S/ 18 por asiento y 5:00 min están fijos en el código: leer de `parametro_sistema`.
- Pasadizo: el diseño lo marca por butaca (`asiento.tipo_asiento='Pasadizo'`); `sala.pasillos` queda sin uso.
- Datos de tarjeta del checkout: solo a la pasarela, nunca a Supabase. Crear usuarios de personal requiere service role / Edge Function.
- Cartelera sede: se **restauró** el toggle "En sede" (`pelicula_sede.habilitada`) que un script borraba al cargar; para volver, reinserta ese bloque en `admin.js`.

### Tablas sin pantalla (decidir si hacen falta)
`bitacora`, `parametro_sistema/sede`, `feriado` (+ tarifa Feriado), `nivel_socio`, `tipo_entrada_sede`, `caso_atencion_cliente` / `reasignacion_asiento`, `evento_embudo`, `ml_prediccion`; y `producto.disponible`, stock numérico y `stock_minimo` (el diseño solo tiene switch Stock/Agotado).
