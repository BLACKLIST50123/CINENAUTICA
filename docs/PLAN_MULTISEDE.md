# PLAN_MULTISEDE — Cine Náutica

> Plan de migración de **una sola sede** a **multisede**, dejando el prototipo (localStorage) listo para migrar a **Supabase** sin reescribir la lógica.
> Este archivo es la fuente de verdad del plan. Si una decisión cambia, se edita aquí y se anota en la sección 12 (Registro de cambios).

---

## 0. Cómo usar este documento (leer primero, agentes)

1. Lee las secciones 1 a 5 completas antes de tocar código.
2. Trabaja **una tarea a la vez** (sección 7). Respeta el orden y las dependencias.
3. Antes de modificar cualquier función, **verifícala en el repo**: los nombres y ubicaciones de este plan salen de una revisión previa y pueden haber cambiado.
4. Cada tarea tiene **Criterios de aceptación**. No se da por terminada hasta cumplirlos y pasar el checklist de humo (sección 9).
5. No reabras las decisiones de la sección 3. Si crees que una es errónea, escríbelo en "Observaciones" al final de tu tarea; no la cambies por tu cuenta.
6. Marca como `[x]` las tareas terminadas y anota fecha y archivos tocados.

### Reglas innegociables del proyecto

- Scripts **clásicos** (no ES modules): la app debe seguir funcionando abriendo `index.html` con `file://`. Orden de carga actual: `estado.js → utilidades.js → modales.js → socios.js → cliente.js → admin.js → main.js`.
- Prototipo **sin backend**. Nada de `fetch` a servicios externos de datos hasta la Fase 7.
- Fuera de la capa de datos (`datos.js`, Fase 1) **no se usa `localStorage` directamente** (excepción: `sessionStorage` del id de sesión de compra, que es local al navegador por diseño).
- **Ningún código interpreta un id** (ejemplo prohibido: `id_sala.replace('sala_', '')`). Los ids son UUID opacos (D-12).
- Dinero siempre como número con 2 decimales (`formatearMoneda`), nunca como texto.
- Fechas de negocio siempre en **ISO** (`YYYY-MM-DD`) y horas `HH:MM`. Las etiquetas tipo `Mar, 29 Set` son solo para mostrar en pantalla.
- Todo permiso del admin pasa por **una sola función**: `puedeGestionarSede(usuario, sedeId)` / `puedeHacer(usuario, accion, sedeId)`.

---

## 1. Resumen ejecutivo

Hoy la programación (`horarios`) vive **dentro de cada película**, las fechas son etiquetas de texto, las salas se identifican por número (1–8) y no existe el concepto de sede. Pasar a multisede exige:

1. Separar **catálogo** (película, global) de **programación** (función = película + sede + sala + fecha/hora + formato).
2. Introducir `sedeId` en salas, funciones, ventas, usuarios de personal, dulcería y tarifas.
3. Un cliente que filtra **Región → Ciudad → Fecha** hasta llegar a las funciones de una sede.
4. Un admin con dos niveles: `super_admin` (todas las sedes) y `admin_sede` (solo la suya), más `counter` atado a una sede.
5. En paralelo, ordenar los datos como si ya fueran tablas, para que el salto a Supabase sea cambiar el "adaptador" de datos y no la aplicación.

---

## 2. Diagnóstico del estado actual (verificar en repo)

### 2.1 Llaves de localStorage actuales

| Llave | Contenido hoy | Destino multisede |
|---|---|---|
| `cinerama_peliculas` | `baseDatosPeliculas` (películas **con** `horarios` embebidos) | `peliculas` (sin horarios) + `funciones` |
| `cinerama_estrenos` | `baseDatosEstrenos` (próximos estrenos) | Misma tabla `peliculas` con `estado = 'proximamente'` |
| `cinerama_salas_mantenimiento` | `{ salas: [ {id_sala, nombre, estado, filas, columnas, asientos[], formatosSoportados[]} ] }` | `salas` (con `sedeId`) + `butacas` |
| `cinerama_ventas_asientos` | `{id, sala, fechaFuncion, horaFuncion, asientos[]}` | `venta_entradas` (por `funcionId`) |
| `cinerama_bloqueos_asientos_temporales` | `{sala, fechaFuncion, horaFuncion, asientoId, idSesion, expiracion}` | `bloqueos_asientos` (por `funcionId`) |
| `cinerama_butacas_bloqueadas` | Declarada, sin uso real (legado) | Eliminar |
| `cinerama_ventas_general` | Libro de ventas (dulces como texto `"2x Popcorn"`) | `ventas` + `venta_entradas` + `venta_dulces` |
| `cinerama_usuarios` | Usuarios con `compras[]`, puntos, historial embebidos; clave = correo | `usuarios` + `socios` + `puntos_movimientos` |
| `cinerama_usuario_actual` | Copia de la sesión | Sesión (Supabase Auth luego) |
| `cinerama_dulces` | `PRECIOS.dulces` (precio y `stock: true/false` globales) | `productos_dulceria` (global) + `dulceria_sede` |
| `cinerama_categorias_dulceria` | `[{id, nombre}]` | `categorias_dulceria` (global) |
| `cinerama_tarifas_dia` | `{economica, media, alta}` | `tarifas` (global) + `tarifas_sede` (override) |
| `cinerama_formatos_proyeccion` | Catálogo de formatos y recargo | `formatos` (global) |
| `cinerama_tipos_entrada` | Catálogo de tipos y descuento % | `tipos_entrada` (global) |
| `cinerama_cupones` | Cupones creados por admin (+ `CUPONES_BASE` en código) | `cupones` (con `alcance`) |
| `cinerama_banner` | IDs de película del carrusel | `banner_items` |
| `cinerama_id_sesion_compra` | (sessionStorage) id por pestaña | Se queda local |

Uso directo de `localStorage` detectado por archivo (cantidad de referencias): `cliente.js` 22, `utilidades.js` 16, `admin.js` 15, `estado.js` 13, `socios.js` 8, `main.js` 1, `modales.js` 0. **Todas** deben pasar por la capa de datos.

### 2.2 Problemas que bloquean o ensucian el multisede

1. **Programación dentro de la película**: `pelicula.horarios['Mar, 29 Set'] = [{formato, formatoId, idioma, horas:[{hora, sala, estado}]}]`.
2. **Fecha como etiqueta** (`'Mar, 29 Set'`, sin año) usada como llave y guardada así en ventas (`fechaFuncion`). Se resuelve a ISO con `resolverFechaISODeEtiqueta()` (frágil, depende del año actual).
3. **Salas por número**: `NUMERO_TOTAL_SALAS = 8`, `id_sala = 'sala_03'`, ventas con `sala: 3`. Con varias sedes, "Sala 3" se repite.
4. **Butacas vendidas/bloqueadas por `sala + fecha + hora`** (`obtenerButacasVendidas`, `obtenerButacasBloqueadasPorOtros`, etc.). Debe ser por `funcionId`.
5. **Compat. legado** en `obtenerButacasVendidas`: registros sin fecha/hora se consideran vendidos en toda la sala. Se elimina en la migración.
6. **Dulces en ventas como texto** (`"2x Cancha Gigante"`). El dashboard calcula dulcería como `total - taquilla` (con `precio || 18` de respaldo). Frágil e impreciso.
7. **Inconsistencia de formatos**: películas usan `formatosDisponibles` con ids `imax` y `premier`, pero el catálogo de formatos (`FORMATOS_PROYECCION_INICIALES`) solo tiene `2d, 3d, 4dx, xd, vip, dbox`. Con claves foráneas en Supabase esto fallaría. Resolver antes de migrar (decisión D-11, ya cerrada: se añaden al catálogo).
8. **Duplicidad de catálogo**: películas en dos objetos (`baseDatosPeliculas`, `baseDatosEstrenos`) que el admin mueve de uno a otro.
9. **Usuarios**: clave = correo; compras e historial de puntos embebidos en el usuario; contraseña en texto plano (`admin123` para el admin demo).
10. **Layout de sala global**: `LAYOUT_SALA` (7 filas × 12 columnas, pasillos en 4 y 10) es constante para todas las salas.
11. **Datos mock vencidos**: las funciones mock terminan el 2 Oct (año 2026); con filtro por fecha la cartelera queda vacía.
12. **Textos fijos de sede**: `NOMBRE_CINE`, `estadoPedido.cine`, vista de ubicación y mapa (Megaplaza Chimbote, `[-9.10216, -78.55728]`), `index.html` con dirección/teléfono, textos corporativos "líder en Chimbote".
13. **`jerarquía de roles`**: solo existen `cliente`, `counter`, `admin` (ver `socios.js`, `ROLES_PERSONAL`). `contarAdminsActivos` protege que quede al menos un admin.

---

## 3. Decisiones de diseño (cerradas — no reabrir)

| # | Decisión |
|---|---|
| D-1 | **Catálogo de películas global**; la sede no crea películas, solo las **programa** mediante funciones. |
| D-2 | La cartelera de una sede **se deriva** (películas con funciones futuras en esa sede); no se guarda. |
| D-3 | **Función** es la entidad central: `funciones(id, peliculaId, sedeId, salaId, fechaISO, hora, formatoId, idioma, estado)`. Butacas vendidas y bloqueadas se asocian a `funcionId`. |
| D-4 | Roles: `cliente`, `counter` (con `sedeId`), `admin_sede` (con `sedeId`), `super_admin` (sin `sedeId`). El rol actual `admin` migra a `super_admin`. |
| D-5 | Un solo punto de permisos: `puedeGestionarSede(usuario, sedeId)` y `puedeHacer(usuario, accion, sedeId)`. |
| D-6 | El programa de **socios/puntos es global** (válido en todas las sedes). |
| D-7 | **Formatos, tipos de entrada, banner, promociones** globales. **Funciones, salas, stock/precio local de dulcería, counters** por sede. |
| D-8 | **Tarifas**: base global; override opcional por sede. Resolución: `tarifa_sede ?? tarifa_global`. |
| D-9 | **Cupones** con `alcance`: `'global'` o un `sedeId`. |
| D-10 | Capa de datos con **API asíncrona desde el inicio** (repositorios que devuelven `Promise`); el adaptador actual envuelve localStorage. Ver sección 5. |
| D-11 | Catálogo de formatos: se **añaden `imax` y `premier`** al catálogo (confirmado por el equipo; recargos a definir en Admin > Tarifas). Ninguna película, sala o función puede referenciar un formato inexistente. |
| D-12 | **Todos los ids son UUID v4** desde el prototipo (en Supabase: columnas `uuid`). `generarId()` usa `crypto.randomUUID()` con *fallback* a `crypto.getRandomValues` (la app corre también con `file://`). Los datos semilla usan **UUID fijos definidos como constantes** en un solo archivo (`ids_semilla`), p. ej. `ID_SEDE_CHIMBOTE`; el código nunca escribe un UUID literal ni interpreta un id. Para lectura humana (URLs, depuración) las entidades de catálogo llevan además un campo `slug` único (sedes, películas, productos). |
| D-16 | **`admin_sede` gestiona, solo en su sede**: funciones, **salas (crear, editar, desactivar y mantenimiento)**, **tarifas (override de su sede)**, **cupones (alcance su sede)**, dulcería local y counters. |
| D-17 | **Alcance de cupones**: un cupón con `alcance = sedeId` solo es válido en compras (web y counter) de **esa** sede; uno `global` vale en todas. Al aplicar un cupón se valida `cupon.alcance === 'global' \|\| cupon.alcance === estadoPedido.sedeId`; si no, se rechaza con mensaje claro ("Este cupón no es válido en {Sede}"). Cambiar de sede en mitad de la compra **revalida** el cupón aplicado y lo quita si ya no corresponde. La validación vive en `DB.cupones.validar(codigo, sedeId)` y se repite al crear la venta. |
| D-18 | **Alcance de tarifas**: el override de una sede solo afecta precios de funciones de **esa** sede (`tarifa_sede ?? tarifa_global`). Un `admin_sede` no puede modificar la tarifa global ni la de otra sede. |
| D-13 | Zona horaria única: `America/Lima`. "Hoy" se calcula con hora local. |
| D-14 | Una venta guarda **snapshots** (título de película, nombre/dirección de sede, precios unitarios) para que el ticket no cambie si el catálogo cambia después. |
| D-15 | "Mi cine": la sede elegida por el cliente se persiste localmente (`preferencias`), no en la venta hasta que compra. |

---

## 4. Modelo de datos objetivo (borrador — se compara con el diagrama del equipo)

Convención: en el prototipo (JS) los campos van en **camelCase**; en Supabase irán en **snake_case**. La conversión vive en `mapeadores` (sección 5.4), nunca repartida por el código.

### 4.1 Entidades

```
sedes
  id, nombre, region, ciudad, direccion, lat, lng, horarioAtencion, telefono,
  estacionamiento (bool), estado ('activa'|'inactiva'), creadoEn

salas
  id, sedeId*, numero, nombre, filas, columnas, pasillos[], formatosSoportados[],
  estado ('activa'|'mantenimiento'|'inactiva')

butacas                      -- solo se guardan las que se salen del estándar
  salaId*, fila, columna, estado ('disponible'|'mantenimiento'|'deshabilitada')
  -- (alternativa: guardar todas las butacas; ver nota en 4.3)

peliculas
  id, titulo, sinopsis, genero, clasificacion, duracionMin, poster, banner,
  trailer, tipoLanzamiento ('Regular'|'Estreno'|'Pre-Estreno'|'Re-Estreno'),
  estado ('cartelera'|'proximamente'|'archivada'), formatosDisponibles[]

funciones
  id, peliculaId*, sedeId*, salaId*, fechaISO, hora, formatoId*, idioma
  ('Doblada'|'Subtitulada'), estado ('programada'|'cancelada'|'finalizada'),
  precioBaseOverride?  (opcional)

formatos                     id, nombre, recargo, protegido
tipos_entrada                id, nombre, descuentoPct, protegido

tarifas                      slot ('economica'|'media'|'alta'), precio
tarifas_sede                 sedeId*, slot, precio            -- override

categorias_dulceria          id, nombre
productos_dulceria           id, nombre, descripcion, icono, imagen, categoriaId*, precioBase
dulceria_sede                sedeId*, productoId*, disponible (bool), precioOverride?

cupones                      codigo, porcentaje, descripcion, alcance ('global'|sedeId), activo, venceEn?

usuarios                     id, correo, nombre, dni, telefono, rol, sedeId?, activo, creadoEn
socios                       usuarioId*, codigoSocio, puntos, nivel, fechaNacimiento, beneficioCumpleUsadoEn
puntos_movimientos           id, usuarioId*, tipo ('ganado'|'canje'|'ajuste'), puntos, motivo, ventaId?, fecha

ventas                       id, codigo, sedeId*, funcionId?, usuarioId?, vendidoPor?, canal
                             ('web'|'counter'), estado, subtotalEntradas, subtotalDulceria,
                             descuentoCupon, cuponCodigo?, descuentoPuntos, puntosCanjeados, total,
                             metodoPago, creadoEn,
                             -- snapshots:
                             peliculaTitulo, sedeNombre, formatoTexto, fechaFuncionISO, horaFuncion
venta_entradas               id, ventaId*, funcionId*, butacaId (fila+columna), tipoEntradaId*, precio
                             -- UNIQUE(funcionId, butacaId) cuando la venta está activa/pagada
venta_dulces                 id, ventaId*, productoId*, nombreSnapshot, cantidad, precioUnit

bloqueos_asientos            id, funcionId*, butacaId, idSesion, expiraEn
banner_items                 posicion, peliculaId*
auditoria                    id, usuarioId, accion, entidad, entidadId, sedeId?, detalle, fecha
```
`*` = clave foránea.

### 4.2 Cómo se obtienen los datos clave

- **Cartelera de una sede**: `peliculas` con alguna `funcion` donde `sedeId = X`, `fechaISO >= hoy` y `estado = 'programada'`.
- **Funciones de una película filtradas** (cliente): `funciones` con `peliculaId`, `sedeId ∈ sedes de la ciudad/región elegida`, `fechaISO = fecha elegida`, agrupadas por sede → formato.
- **Butacas ocupadas de una función**: `venta_entradas` (ventas `activa|pagada`) + `bloqueos_asientos` vigentes de otras sesiones + `butacas` en mantenimiento de la sala.
- **Precio de una entrada**: `(tarifa_sede ?? tarifa_global)[slot del día] + formato.recargo`, luego `× (1 - tipoEntrada.descuentoPct/100)`. Slot del día: pre-estreno o jue–dom → `alta`; lun/mié → `media`; mar → `economica` (regla actual, no cambiar).

### 4.3 Notas de modelado

- **Butacas**: hoy cada sala guarda un array de 84 objetos (7×12). Recomendado: guardar `filas`, `columnas`, `pasillos` en la sala y solo las **excepciones** en `butacas`. Si el equipo prefiere simplicidad en SQL, guardar todas; el repositorio debe ocultar esa diferencia (`repo.salas.obtenerMapa(salaId)` devuelve siempre la matriz completa).
- **Fechas/horas**: guardar `fechaISO` y `hora` por separado en el prototipo; en Postgres puede ser `date` + `time` o un `timestamptz` calculado. La capa de datos expone `inicioISO` ya calculado.
- **Funciones canceladas**: las ventas asociadas pasan a `funcion_cancelada` (comportamiento actual de `guardarFuncionAdmin`); mantener.
- **Estados de venta** (enumerar y no inventar más): `pagada`, `activa`, `reembolsada`, `cancelada`, `funcion_cancelada`. Revisar en el código cuáles se usan realmente.

---

## 5. Preparación para Supabase (aplica en todas las fases)

Objetivo: que **migrar a Supabase = reemplazar un adaptador**, y que si el diagrama de BD cambia, **el cambio se haga en un solo lugar**.

### 5.1 Capa de datos (`assets/js/datos.js`)

- Archivo nuevo, cargado justo después de `estado.js` (antes de `utilidades.js`).
- Expone un objeto global `DB` con **repositorios** por entidad, API **asíncrona**:

```js
// Ejemplo de contrato (los nombres exactos se fijan en F1-T1)
await DB.sedes.listar({ region, ciudad, soloActivas });
await DB.sedes.obtener(id);
await DB.funciones.listar({ peliculaId, sedeIds, fechaISO, desdeHoy });
await DB.funciones.crear(datos);        // valida choque de sala + margen de limpieza
await DB.ventas.crear(venta);           // atómico: cabecera + entradas + dulces
await DB.butacas.ocupadasDeFuncion(funcionId);
await DB.bloqueos.aplicar(funcionId, butacaId, idSesion);
await DB.usuarios.porCorreo(correo);
```

- **Un adaptador por backend**: `adaptadorLocal` (hoy) y `adaptadorSupabase` (Fase 7). `DB` elige el adaptador con una constante (`CONFIG.backend = 'local' | 'supabase'`). El resto de la app no sabe cuál usa.
- Los repositorios **devuelven objetos de dominio ya normalizados** (fechas ISO, números, ids opacos). Nunca devuelven la estructura cruda de localStorage.
- Las operaciones multi-paso (crear venta con entradas y dulces, cancelar función con ventas asociadas) son **una sola función del repositorio** que en Supabase será una transacción / RPC.

### 5.2 Reglas de integridad en un solo sitio

Todo lo que luego serán *constraints* de la BD se implementa y documenta en el repositorio local:

| Regla | Hoy (local) | Luego (Supabase) |
|---|---|---|
| Una butaca no se vende dos veces en la misma función | Validar en `DB.ventas.crear` | `UNIQUE(funcion_id, butaca_id)` parcial |
| Una sala no tiene dos funciones solapadas (incl. 30 min de limpieza) | Validar en `DB.funciones.crear/actualizar` | Constraint de exclusión o trigger |
| Película solo en formatos que ofrece; sala solo en formatos que soporta | Validar en `DB.funciones.*` | FK + check/trigger |
| `formatoId`, `tipoEntradaId`, `categoriaId`, `sedeId` existen | Validar | Claves foráneas |
| Siempre hay ≥1 `super_admin` activo | Validar en `DB.usuarios.*` | Trigger/RPC |
| Bloqueo temporal expira | Limpieza perezosa al leer | `expira_en` + job/consulta filtrada |

### 5.3 Esquema como documento vivo

- `docs/ESQUEMA_DB.md`: DDL borrador (SQL de Postgres) generado a partir de la sección 4. **Se actualiza en el mismo commit** que cualquier cambio de estructura de datos.
- `docs/DICCIONARIO_DATOS.md`: por entidad, cada campo con tipo, obligatoriedad, origen en el prototipo (llave de localStorage + campo JS) y destino SQL.
- `docs/COMPARATIVA_DIAGRAMA.md`: tabla para cruzar el diagrama del equipo con el prototipo (plantilla en 5.6).

### 5.4 Mapeadores (camelCase ⇄ snake_case, y renombres)

- Un único archivo/objeto `mapeadores` con dos funciones por entidad: `aFilaBD(obj)` y `deFilaBD(fila)`.
- Si el diagrama cambia un nombre de campo o separa/une tablas, **solo se edita el mapeador y el adaptador**; la UI y la lógica de negocio siguen usando el modelo de dominio.
- En el adaptador local, los mapeadores se usan igual (devuelven la misma forma de dominio), para detectar desajustes temprano.

### 5.5 Versionado y migración de datos del prototipo

- `SCHEMA_VERSION` guardado junto a los datos. Archivo `migraciones.js` con una función por versión (`v1_a_v2`, `v2_a_v3`…), idempotentes, que corren al iniciar.
- **Antes de migrar**, la app guarda un respaldo (`cinerama_backup_v{N}`), o el usuario puede exportarlo.
- `exportarSnapshot()` / `importarSnapshot(json)`: vuelca/restaura **todo** el estado del prototipo en un JSON. Sirve para: respaldos, compartir datos entre agentes/equipo, y alimentar el *seed* de Supabase.
- `scripts/seed/` (Fase 6): script que convierte el snapshot JSON en `INSERT`s SQL (o JSON para `supabase` CLI). Si el diagrama cambia, se ajusta este script + el mapeador.

### 5.6 Plantilla de comparativa prototipo ↔ diagrama

Archivo `docs/COMPARATIVA_DIAGRAMA.md`, una fila por entidad/campo:

| Entidad (diagrama) | Tabla/colección (prototipo) | Campo diagrama | Campo prototipo | Estado | Acción |
|---|---|---|---|---|---|
| `…` | `…` | `…` | `…` | coincide / difiere / falta en diagrama / falta en prototipo | `…` |

Procedimiento: (1) completar con el diagrama del equipo, (2) por cada "difiere/falta", decidir si cambia el diagrama o el prototipo, (3) reflejar el cambio en `ESQUEMA_DB.md`, el mapeador y la migración. Esta comparativa se rehace al cerrar cada fase.

### 5.7 Autenticación y seguridad (a futuro, pero preparar)

- Hoy las contraseñas están en texto plano en localStorage: aceptable **solo** en prototipo. **No migrar contraseñas a Supabase**; se usará Supabase Auth. Los usuarios se recrean/invitan.
- Separar ya `usuarios` (identidad y rol) de `socios` (puntos, nivel, cumpleaños): en Supabase `usuarios.id` = `auth.users.id`.
- Los permisos de `puedeHacer()` se traducirán a **políticas RLS** (`rol` + `sedeId` en el JWT/perfil). Documentar en `docs/PERMISOS.md` la matriz de la sección 6.3, que servirá como especificación de RLS.

### 5.8 Convenciones que ayudan a migrar

- Toda entidad tiene `id`, `creadoEn`, `actualizadoEn` (ISO UTC). Borrado lógico (`activo`/`estado`) en lugar de borrar cuando haya historial (sedes, salas, películas, productos, personal).
- Booleanos como `true/false` (no `'si'/'no'`), enumeraciones como cadenas fijas definidas en **constantes** (`ESTADOS_VENTA`, `ROLES`, `ESTADOS_FUNCION`…) en un solo archivo.
- Nada de datos calculados persistidos si se pueden derivar (ejemplo: cartelera de la sede, nivel del socio a partir de puntos).
- Imágenes: preferir **URL** o archivos en `assets/`; evitar base64 en localStorage (límite ~5 MB). En Supabase irán a Storage.

---

## 6. Diseño funcional multisede

### 6.1 Cliente

1. **Cartelera global** (`vista-inicio`): sigue mostrando todas las películas del catálogo en cartelera. Indicador opcional "Disponible en tu cine" si hay "Mi cine".
2. **Detalle de película**: el botón "Ver Horarios" lleva a `vista-horarios` con filtros.
3. **`vista-horarios` con filtros**:
   - Selector **Región → Ciudad** (dependientes; solo regiones/ciudades con sedes activas y funciones para esa película).
   - **Fecha**: tira de días (hoy en adelante) con indicador de qué días tienen funciones en la selección.
   - Resultado: **tarjetas de sede** (nombre, dirección, distancia opcional), y dentro, los grupos por formato/idioma con los botones de hora que ya existen (`seleccionarHorario`).
   - El botón "Elegir Asientos" y la barra de confirmación se mantienen; ahora muestran también la **sede**.
4. **"Mi cine"**: al elegir sede se guarda como preferencia; aparece en el navbar (con opción de cambiar). Próxima visita: filtros preseleccionados.
5. **Estados vacíos**: sin funciones en esa sede/fecha → mostrar "próxima fecha disponible" y "otras sedes de tu ciudad con funciones".
6. **Flujo de compra**: `estadoPedido` incorpora `sedeId`, `sedeNombre`, `funcionId`. Asientos, dulcería, pago y ticket usan datos de la función/sede. La **dulcería** (con película o directa) usa disponibilidad y precio de **esa sede**.
7. **Dulcería directa**: pide elegir sede primero.
8. **Cambiar de sede/función a mitad de compra** reinicia el pedido usando `intentarSalirDelFlujoDeCompra` (confirmación).
9. **Ubicación** (`vista-ubicacion`): lista de sedes con filtro por ciudad + mapa Leaflet con varios marcadores; ficha de la sede (dirección, horario, teléfono, estacionamiento).
10. **Ticket / comprobante / "Mis compras"**: muestran sede y dirección (snapshot).
11. **Textos corporativos** (`NOMBRE_CINE`, "líder en Chimbote") pasan a ser de cadena, no de una sede.

### 6.2 Counter

- Cuenta con `sedeId` obligatorio. "Nueva venta" muestra **solo funciones de su sede** (sin selector de sede).
- Atención al cliente (buscar orden, reembolso, reubicación): opera **solo sobre ventas de su sede**. Buscar una orden de otra sede muestra aviso de solo lectura.
- Reubicación: **solo dentro de la misma sede** (y mismo formato, como hoy).
- Cada venta de counter guarda `sedeId`, `vendidoPor`, `canal = 'counter'`.

### 6.3 Admin — roles y matriz de permisos

| Módulo (pestaña) | `super_admin` | `admin_sede` | Notas |
|---|---|---|---|
| **Sedes** (nueva) | Crear/editar/desactivar | Ver y editar datos de **su** sede (dirección, horario, teléfono) | Alta/baja solo super |
| **Cartelera / catálogo / banner** | Total | Solo lectura (ve qué se programa en su sede) | Catálogo global |
| **Horarios (funciones)** | Total, de cualquier sede | Total, **solo su sede** | Valida choques por sala |
| **Salas / butacas** | Total, de cualquier sede | Total, **solo su sede**: crear, editar estructura, desactivar y mantenimiento | Eliminar una sala con funciones futuras o ventas queda bloqueado (se desactiva) |
| **Dulcería** | Catálogo y categorías (global) + stock/precio de cualquier sede | Stock/precio de **su** sede | Pestaña con 2 secciones |
| **Tarifas** | Base global, formatos, tipos de entrada, override de cualquier sede | Override de **su** sede (ve la global como referencia, de solo lectura) | Formatos y tipos de entrada: solo super |
| **Descuentos (cupones)** | Globales y de cualquier sede | Cupones con alcance **su** sede (crear, editar, desactivar) | Válidos solo en compras de esa sede (D-17) |
| **Socios** | Total | Buscar, ver, validar cumpleaños | Puntos globales |
| **Personal** | Todas las cuentas | Solo `counter` de **su** sede | No puede crear admins |
| **Dashboard** | Consolidado + filtro por sede | Solo su sede | |

Reglas:
- Un `admin_sede` **nunca** ve ni puede enviar datos de otra sede, aunque manipule el DOM: la validación está en `puedeHacer()` y se repite en los repositorios (en Supabase, RLS).
- Siempre debe existir ≥1 `super_admin` activo (adaptar `contarAdminsActivos`).
- Un usuario no cambia su propio rol (regla actual, mantener).

### 6.4 Admin — experiencia

- **Super admin**: al entrar ve **tarjetas de sedes** (filtro por región/ciudad, buscador) con mini-KPI (ventas de hoy, ocupación, funciones de hoy). Opción "Resumen de la cadena" (dashboard consolidado).
- Al elegir una sede aparece la barra fija **"Gestionando: {Sede} ▾ Cambiar sede"** y las pestañas existentes quedan atadas a esa sede mediante `sedeActivaAdmin`.
- **Admin de sede**: entra directo a su sede (sin selector), solo con las pestañas que le corresponden.
- Cambiar de sede con cambios sin guardar → reutilizar `tieneCambiosAdminSinGuardar` / `descartarCambiosAdminForzado` para pedir confirmación.
- Etiquetar visiblemente la sede activa en cada modal (agregar función, editar sala, etc.) para evitar errores.

---

## 7. Plan de trabajo por fases y tareas

Leyenda: **Dep.** = depende de. **Agente** = sugerencia de reparto. Las fases 3 y 4 pueden ir en paralelo (archivos distintos) **solo después** de cerrar la Fase 2 y fijar el contrato de `DB`.

### Fase 0 — Preparación

- [ ] **F0-T1 Respaldo y línea base.** Crear rama `multisede`. Exportar el estado actual de localStorage a `docs/snapshots/snapshot_v1_inicial.json` (puede hacerse con la función de F1-T6 cuando exista; antes, manualmente). 
  - *Aceptación*: existe el snapshot y la app abre sin errores.
- [ ] **F0-T2 Checklist de humo.** Crear `docs/CHECKLIST_HUMO.md` con la sección 9 de este plan y ejecutarla sobre la versión actual; anotar fallos preexistentes.
  - *Aceptación*: lista de fallos conocidos documentada para no confundirlos con regresiones.
- [ ] **F0-T3 Limpieza de datos previa.** Resolver D-11 (formatos `imax`/`premier`), eliminar `cinerama_butacas_bloqueadas` si no se usa, listar estados de venta realmente usados.
  - *Aceptación*: ninguna película referencia un formato inexistente; lista de estados en `docs/DICCIONARIO_DATOS.md`.
- **Agente**: 1.

### Fase 1 — Capa de datos (SIN cambiar comportamiento)

> Objetivo: que todo acceso a datos pase por `DB`, manteniendo el modelo actual. Al terminar la fase, la app se comporta **igual** que antes.

- [ ] **F1-T1 Contrato de `DB`.** Definir en `docs/CONTRATO_DB.md` los repositorios y firmas (sección 5.1). Crear `datos.js` con el esqueleto y `CONFIG.backend = 'local'`.
  - *Aceptación*: documento + archivo cargado en `index.html` tras `estado.js`.
- [ ] **F1-T2 Adaptador local.** Implementar `adaptadorLocal` envolviendo las llaves de la sección 2.1 (todas las lecturas/escrituras, incluida `guardarEnLocalStorageSeguro`).
- [ ] **F1-T3 Constantes, enumeraciones e ids** en un solo lugar (`ROLES`, `ESTADOS_VENTA`, `ESTADOS_FUNCION`, `ESTADOS_SALA`, `SLOTS_TARIFA`), más `generarId()` (UUID v4 con *fallback*) y el archivo de UUID fijos para datos semilla (D-12).
  - *Aceptación*: `generarId()` devuelve UUID v4 válido también abriendo `index.html` por `file://`.
- [ ] **F1-T4 Refactor de llamadores.** Reemplazar todos los usos directos de `localStorage` en `estado.js`, `utilidades.js`, `socios.js`, `cliente.js`, `admin.js`, `main.js` por llamadas a `DB`. Convertir a `async/await` donde haga falta.
  - *Aceptación*: `grep -n "localStorage" assets/js/*.js` solo encuentra `datos.js` (y `sessionStorage` del id de sesión de compra). Checklist de humo completo pasa.
- [ ] **F1-T5 Mapeadores** (`mapeadores`) con `aFilaBD/deFilaBD` por entidad (aún sin uso real, con pruebas manuales de ida y vuelta).
- [ ] **F1-T6 Snapshot.** `exportarSnapshot()` / `importarSnapshot()` y botón (solo `super_admin`) en el admin para descargar/cargar el JSON.
- [ ] **F1-T7 Versionado.** `SCHEMA_VERSION = 1` y `migraciones.js` con el mecanismo (sin migraciones aún).
- [ ] **F1-T8 Documentación inicial.** `docs/DICCIONARIO_DATOS.md` (estado actual, columna "origen") y esqueleto de `docs/ESQUEMA_DB.md`.
- **Dep.**: F0. **Agente**: 1 solo (toca todos los archivos). No paralelizar.

### Fase 2 — Modelo multisede y migración de datos

- [ ] **F2-T1 Entidades nuevas.** Repositorios `sedes`, `salas` (con `sedeId`), `funciones`, `butacas`, `bloqueos`, `ventas` (+ `venta_entradas`, `venta_dulces`), `tarifasSede`, `dulceriaSede` según sección 4. Validaciones de la sección 5.2 dentro del repositorio.
- [ ] **F2-T2 Migración `v1 → v2`** (en `migraciones.js`, idempotente, con respaldo previo):
  1. Crear `ID_SEDE_CHIMBOTE` con los datos actuales (Megaplaza Chimbote, coordenadas, teléfono, horario del HTML).
  2. Salas existentes (`sala_01…sala_08`) → salas de `ID_SEDE_CHIMBOTE` con **UUID nuevo** (guardar el número en `numero`; mantener una tabla temporal `idAnterior → idNuevo` durante la migración para reasignar ventas y bloqueos); conservar mantenimiento de butacas y `formatosSoportados`.
  3. `pelicula.horarios` → `funciones[]` (fecha etiqueta → ISO usando el año correcto; `estado` de cada hora; `idioma`; `formatoId`). Eliminar `horarios` del objeto película.
  4. Unir `baseDatosEstrenos` en `peliculas` con `estado = 'proximamente'`.
  5. Ventas existentes: asignar `sedeId = ID_SEDE_CHIMBOTE`; resolver `funcionId` por (sala, fecha, hora) cuando se pueda, guardar snapshots; convertir `dulces` de texto a líneas estructuradas (si no se puede, guardar como línea con `nombreSnapshot` y `productoId = null`).
  6. Ventas de asientos y bloqueos → por `funcionId`. Eliminar compat. legado sin fecha/hora (marcarlos como vendidos en todas las funciones futuras de esa sala **solo** durante la migración, luego descartar).
  7. Usuarios: `admin` → `super_admin`; `counter` → `sedeId = ID_SEDE_CHIMBOTE`; separar `socios` y `puntos_movimientos`; asignar **UUID** a cada usuario (hoy la clave es el correo; `correo` pasa a campo único) y reasignar las referencias (`vendidoPor`, `usuarioId`).
  8. Cupones existentes → `alcance = 'global'`.
  9. Dulcería: crear `dulceria_sede` para `ID_SEDE_CHIMBOTE` con los `stock` actuales.
  - *Aceptación*: tras migrar, la app (con sede única) hace lo mismo que antes; el conteo de funciones, ventas y usuarios coincide con el snapshot inicial; migrar dos veces no duplica nada.
- [ ] **F2-T3 Datos semilla multisede.** Añadir 3–4 sedes de ejemplo en distintas regiones/ciudades (Chimbote, Nuevo Chimbote, Trujillo, Lima u otras que decida el equipo; **coordenadas y direcciones de ejemplo por confirmar**) con salas distintas (cantidad y formatos) y un generador `generarFuncionesDemo()` que cree funciones **relativas a la fecha actual** (hoy + N días) para que la cartelera nunca caduque.
- [ ] **F2-T4 Capa de permisos.** `puedeGestionarSede` y `puedeHacer` + roles nuevos en `socios.js` (`ROLES_PERSONAL`: `counter`, `admin_sede`, `super_admin`), `sedeId` obligatorio para `counter` y `admin_sede`.
- [ ] **F2-T5 Precio y disponibilidad por sede.** `calcularPrecio…` usa `tarifa_sede ?? tarifa_global`; dulcería lee `dulceria_sede`.
- [ ] **F2-T6 Documentación.** Actualizar `ESQUEMA_DB.md`, `DICCIONARIO_DATOS.md`, `PERMISOS.md`; generar `COMPARATIVA_DIAGRAMA.md` con las columnas del prototipo rellenas (columnas del diagrama las completa el equipo).
- **Dep.**: F1. **Agente**: 1 (modelo y migración). F2-T6 puede hacerla un segundo agente al final.
- **Fin de fase = congelar el contrato de `DB`.** Cambios posteriores al contrato requieren actualizar `CONTRATO_DB.md`.

### Fase 3 — Cliente multisede (`cliente.js`, `index.html`, estilos)

- [ ] **F3-T1 Estado.** `estadoPedido` con `sedeId`, `sedeNombre`, `funcionId`; `limpiarEstadoPedido` los reinicia. "Mi cine" en preferencias.
- [ ] **F3-T2 `vista-horarios` con filtros** (Región, Ciudad, Fecha) y tarjetas de sede con grupos por formato. Excluir fechas/horas pasadas.
- [ ] **F3-T3 Estados vacíos** (próxima fecha y otras sedes de la ciudad).
- [ ] **F3-T4 Selector de sede en navbar** ("Mi cine") y marca "Disponible en tu cine" en cartelera.
- [ ] **F3-T5 Asientos** por `funcionId` (ocupadas, bloqueos de otros, mantenimiento de sala); layout de la sala de la función.
- [ ] **F3-T6 Dulcería por sede** (con película: la de la función; directa: pedir sede primero).
- [ ] **F3-T7 Pago, ticket, PDF, "Mis compras"** con sede/dirección (snapshots); validación de cupón por sede en `aplicarCupon` y al cambiar de sede (D-17); `registrarVentaGeneral` → `DB.ventas.crear`.
- [ ] **F3-T8 Ubicación multi-sede** (lista + mapa con marcadores + filtro por ciudad) y retiro de textos fijos de Chimbote.
- [ ] **F3-T9 Counter**: nueva venta limitada a su sede; atención al cliente/reembolso/reubicación limitados a su sede.
- **Dep.**: F2. **Agente**: 1 (cliente). Puede ir en paralelo con Fase 4.

### Fase 4 — Admin multisede (`admin.js`, `index.html`)

- [ ] **F4-T1 Sesión y rol.** Reconocer `super_admin`/`admin_sede`; `abrirPanelAdministrador` según rol; `sedeActivaAdmin`.
- [ ] **F4-T2 Pantalla de sedes** (tarjetas + filtros + KPI) y barra "Gestionando: {Sede}".
- [ ] **F4-T3 Pestaña Sedes** (CRUD para super; edición limitada para `admin_sede`).
- [ ] **F4-T4 Horarios** atados a `sedeActivaAdmin`: salas de esa sede, choques solo dentro de la sede, formatos soportados por la sala.
- [ ] **F4-T5 Salas/butacas** por sede (`admin_sede` puede crear, editar, desactivar y dar mantenimiento en su sede) (reemplaza `NUMERO_TOTAL_SALAS` y `poblarSelectSalas`); contadores y ventas futuras por sala (`obtenerButacasVendidasFuturasPorSala` → por `salaId`).
- [ ] **F4-T6 Dulcería**: separar catálogo global y stock/precio por sede.
- [ ] **F4-T7 Tarifas**: global + override por sede; `admin_sede` edita solo el override de su sede (D-16, D-18).
- [ ] **F4-T8 Cupones** con `alcance`: `admin_sede` solo crea/edita cupones de su sede; en el cliente y el counter, `DB.cupones.validar(codigo, sedeId)` rechaza cupones de otra sede y revalida al cambiar de sede (D-17). `CUPONES_BASE` pasa a ser `global`.
- [ ] **F4-T9 Personal**: super gestiona todos; `admin_sede` solo counters de su sede; `sedeId` en el formulario.
- [ ] **F4-T10 Dashboard** consolidado y por sede (usando líneas estructuradas de venta, sin `total - taquilla`).
- [ ] **F4-T11 Aplicar la matriz de permisos** (ocultar pestañas/acciones **y** validar en repositorio).
- **Dep.**: F2. **Agente**: 1 (admin). Paralelo con Fase 3.

### Fase 5 — Integración y endurecimiento

- [ ] **F5-T1 Pruebas cruzadas**: dos pestañas, mismas funciones, bloqueos entre pestañas; sedes distintas con misma película; counter vs admin_sede.
- [ ] **F5-T2 Casos límite**: cancelar función con ventas, desactivar sala con funciones futuras, desactivar sede con funciones futuras, eliminar película con funciones, cambio de rol, sesión abierta de un usuario desactivado.
- [ ] **F5-T3 Rendimiento**: con 4 sedes × 8 salas × 14 días, la carga inicial y el renderizado de horarios no se degradan notablemente; revisar tamaño de localStorage (imágenes por URL).
- [ ] **F5-T4 Revisión de seguridad de prototipo**: ningún flujo del cliente permite ver/gestionar datos de admin; validación de permisos en repositorios.
- **Dep.**: F3 y F4. **Agente**: 1 (QA).

### Fase 6 — Congelación del modelo y preparación del seed

- [ ] **F6-T1 Comparativa con el diagrama.** Completar `COMPARATIVA_DIAGRAMA.md` con el equipo; decidir qué cambia en diagrama vs prototipo.
- [ ] **F6-T2 Ajustes de esquema** acordados → reflejar en `ESQUEMA_DB.md`, mapeadores, migración (`v2 → v3` si cambia el prototipo).
- [ ] **F6-T3 Script de seed**: snapshot JSON → SQL/JSON para Supabase, usando los mapeadores. Validar con datos de prueba.
- [ ] **F6-T4 Especificación RLS** a partir de `PERMISOS.md`.
- [ ] **F6-T5 Lista de RPC/transacciones** necesarias (crear venta, cancelar función con ventas, reubicar entrada, canjear puntos).
- **Dep.**: F5.

### Fase 7 — Supabase (fuera del alcance inmediato; solo bosquejo)

1. Crear proyecto y aplicar `ESQUEMA_DB.md` como migraciones SQL.
2. Implementar `adaptadorSupabase` (mismos métodos que `adaptadorLocal`), con `CONFIG.backend = 'supabase'`.
3. Auth con Supabase Auth; perfiles con `rol` y `sedeId`; RLS según `PERMISOS.md`.
4. Reemplazar bloqueo temporal por tabla `bloqueos_asientos` + expiración; realtime para refrescar butacas en vivo.
5. Imágenes a Storage.
6. Cargar datos con el seed de F6-T3; ejecutar la comparativa final prototipo ↔ BD.

---

## 8. Mapa de archivos afectados

| Archivo | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|---|---|---|---|---|
| `datos.js` (nuevo) | Crear | Ampliar | — | — |
| `migraciones.js` (nuevo) | Crear mecanismo | `v1→v2` | — | — |
| `estado.js` | Quitar acceso directo a LS; mover mock | Datos semilla, constantes | `estadoPedido` | — |
| `utilidades.js` | Reemplazar acceso a LS (ventas, bloqueos, salas) | Funciones por `funcionId` | — | — |
| `socios.js` | Reemplazar acceso a LS | Roles y `sedeId`, `usuarios/socios` | Ajustes counter | Personal por rol |
| `cliente.js` | Reemplazar acceso a LS | — | Filtros, flujo, ubicación, counter | — |
| `admin.js` | Reemplazar acceso a LS | — | — | Panel, sedes, permisos, todo |
| `main.js` | Inicialización vía `DB` | Migración al iniciar | "Mi cine" | Sesión/rol |
| `index.html` | Cargar `datos.js`, `migraciones.js` | — | Vistas horarios/ubicación/navbar | Pestañas, tarjetas de sedes |
| `style.css` | — | — | Estilos de filtros/tarjetas | Estilos panel de sedes |

---

## 9. Checklist de humo (ejecutar al cerrar cada tarea)

**Cliente**
- [ ] Cartelera carga, detalle de película y tráiler funcionan.
- [ ] (Fase 3+) Filtro Región → Ciudad → Fecha muestra solo sedes/funciones válidas; estados vacíos correctos.
- [ ] Elegir función → asientos: ocupadas/bloqueadas/mantenimiento se pintan bien; límite de 8 asientos.
- [ ] Dos pestañas: butaca elegida en una se bloquea en la otra; expira con el temporizador.
- [ ] Dulcería (con película y directa), cupón, canje de puntos, pago, ticket, PDF.
- [ ] "Mis compras" muestra la compra con sede/dirección.
- [ ] Registro, login y cierre de sesión.

**Counter**
- [ ] Nueva venta con y sin socio vinculado; puntos al socio, no al counter.
- [ ] (Fase 3+) Solo ve funciones de su sede; reembolso/reubicación solo de su sede.

**Admin**
- [ ] Crear/editar/eliminar película; banner.
- [ ] Crear/editar/eliminar función; choque de sala (con 30 min de limpieza) detectado; función con ventas → tickets pasan a `funcion_cancelada`.
- [ ] Salas: mantenimiento de butacas, activar/desactivar sala (cancela funciones futuras con aviso).
- [ ] Tarifas, formatos, tipos de entrada, cupones.
- [ ] (Fase 4+) Cupón de la Sede A: se acepta en una compra de la Sede A y se rechaza en la Sede B (web y counter); tarifa override de la Sede A no cambia precios de la Sede B.
- [ ] Personal: crear/desactivar/eliminar; siempre queda ≥1 `super_admin`.
- [ ] Dashboard coherente con las ventas.
- [ ] (Fase 4+) `admin_sede` no ve ni toca datos de otra sede; `super_admin` cambia de sede sin perder contexto.

**Datos**
- [ ] Exportar snapshot → limpiar localStorage → importar snapshot → todo igual.
- [ ] Migración corre dos veces sin duplicar.

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Migración de ventas con fecha en texto sin año | Resolver con el año de la venta (`creadoEn`) o el de las funciones; registrar las no resolubles en un informe de migración, no descartarlas. |
| Volumen en localStorage (~5 MB) | Imágenes por URL; semillas livianas; medir en F5-T3. |
| Refactor a `async` rompe flujos | Hacerlo en F1 sin cambios funcionales, con checklist tras cada archivo. |
| Varios agentes tocando el modelo a la vez | Fases 1 y 2 con un solo agente; contrato `DB` congelado antes de 3 y 4. |
| Diagrama de BD distinto al prototipo | Mapeadores + comparativa (5.4, 5.6): se ajusta en un lugar, no en la UI. |
| Permisos solo "visuales" (ocultar botones) | Validación en repositorios + futura RLS; prueba F5-T4. |
| Doble venta de butacas con varias sedes | Validación por `funcionId` en `DB.ventas.crear`; `UNIQUE` en Supabase. |
| Datos de ejemplo que parecen reales (direcciones, coordenadas) | Marcar como "ejemplo" hasta que el equipo confirme. |

---

## 11. Decisiones abiertas

Cerradas por el equipo (ya incorporadas arriba): D-11 (`imax` y `premier` se añaden al catálogo), D-12 (UUID), D-16 (alcance de `admin_sede`), D-17 (cupones por sede), D-18 (tarifas por sede).

Pendientes (valor por defecto entre paréntesis):
1. Recargos de `imax` y `premier` (proponer los valores en Admin > Tarifas al migrar; el equipo los ajusta).
2. ¿Promociones y banner solo globales o también por sede? (globales).
3. Sedes y regiones reales para los datos semilla: nombres, direcciones y coordenadas (ejemplos marcados "por confirmar").
4. ¿Se mantiene el límite de 8 asientos por compra y el temporizador de 5 min en todas las sedes? (sí).
5. ¿Un `admin_sede` puede administrar **más de una** sede? (no; una sola. Si luego se necesita, `sedeId` pasa a una tabla `usuario_sedes`).

---

## 12. Registro de cambios del plan

| Fecha | Cambio | Autor |
|---|---|---|
| (inicial) | Versión 1 del plan | — |
| v1.1 | Cerradas decisiones del equipo: `admin_sede` gestiona salas, tarifas y cupones de su sede (D-16); cupones y tarifas de sede solo valen en esa sede (D-17, D-18); se añaden `imax` y `premier` (D-11); ids pasan a UUID (D-12). Actualizados matriz de permisos, tareas F1-T3, F2-T2, F3-T7, F4-T5/T7/T8 y checklist. | — |
