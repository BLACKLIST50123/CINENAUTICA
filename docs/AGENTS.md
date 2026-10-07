# AGENTS.md — CineNáutica (plataforma multisede)

Sistema web de cine: compra de entradas, dulcería y panel de administración. Está migrando de un MVP de una sola sede (HTML + JS + `localStorage`) a una plataforma **multisede** con **Angular + Supabase (PostgreSQL)**. Plan completo en `master_plan_multisede.md` (es la fuente de verdad; si algo aquí lo contradice, gana el plan).

## Stack y estructura

**Hoy (MVP legacy, solo se lee como referencia de reglas de negocio):**
- HTML + JavaScript clásico (scripts globales, sin módulos, `onclick` inline) + Tailwind por CDN + Font Awesome.
- `index.html` (~2 800 líneas): todas las vistas, cliente y admin.
- `assets/js/estado.js`: estado global, constantes, tarifas, formatos, tipos de entrada, datos mock.
- `assets/js/cliente.js`: flujo de compra (horarios, asientos, dulcería, checkout, ticket).
- `assets/js/admin.js`: panel admin (cartelera, horarios, dulcería, salas, tarifas, descuentos, socios, personal, dashboard).
- `assets/js/socios.js`: puntos, niveles y cuentas de personal. `utilidades.js`: validaciones, salas, bloqueos de butacas, ventas.
- Persistencia simulada en `localStorage` (claves `cinerama_*`).

**Destino (en construcción):**
- **TypeScript en modo estricto** (`strict: true`, sin `any`; usar `unknown` + validación cuando el tipo sea incierto).
- Angular estable vigente (standalone, Signals, `inject()`), Tailwind integrado al build, NgRx SignalStore para estado compartido.
- Supabase: Auth, Postgres con RLS, Storage, Realtime, Edge Functions, `pg_cron`.
- Capas: `core/` · `domain/` (TS puro) · `data-access/` (dao, rpc, dto, mappers, repositories) · `features/` (public, counter, admin-sede, super-admin) · `shared/`. Detalle en §7 del plan.
- `supabase/`: `migrations/`, `functions/`, `tests/` (pgTAP), `seed.sql`.

## Comandos

MVP legacy (sin build): abrir `index.html` directamente (funciona con `file://`).

Proyecto nuevo (cuando exista; confirmar en `package.json` antes de asumir):
```bash
npm install
npx supabase start            # Supabase local
npx supabase db reset         # aplica migraciones + seed
npx supabase test db          # pruebas pgTAP (RLS y RPC)
npx supabase gen types typescript --local > src/app/data-access/database.types.ts
ng serve                      # desarrollo
ng test                       # pruebas unitarias
ng lint                       # incluye límites de capas
ng build                      # compilación
```

## Convenciones

- **Idioma:** textos de UI, comentarios y documentación en español. Identificadores de negocio en español, como el código actual (`pelicula`, `funcion`, `sala`, `orden`); términos técnicos en inglés (`Repository`, `Facade`, `Store`).
- **BD:** `snake_case`, claves `id_<entidad>`. **UI/TS:** `camelCase` para propiedades, `PascalCase` para clases.
- **Flujo de capas:** Componente → Facade → Store / Domain / Repository (clase abstracta) → implementación Supabase → DAO → Mapper. Referencia: `CarteleraRepository` / `SupabaseCarteleraRepository` / `PeliculaSedeDao` (§7.5 del plan).
- Los tipos de filas vienen de `database.types.ts` (generado, **no se escribe a mano**). DTOs solo para entrada/salida hacia la UI.
- TypeScript: tipar siempre parámetros y retornos públicos; `interface`/`type` para DTOs y modelos, `readonly` en lo inmutable; evitar `as` salvo en mappers; nada de `@ts-ignore` sin comentario que lo justifique.
- Promesas + Signals por defecto; RxJS solo para Realtime, debounce y temporizadores.
- Componentes "tontos"; la lógica de negocio vive en `domain/` y se prueba sin TestBed.

## Reglas de dominio / trampas conocidas

- **Precio de entrada** = tarifa base + recargo del formato − descuento del tipo de entrada, redondeado a 2 decimales.
  - Tarifa base: Pre-Estreno → Alta; Jue–Dom → Alta (18); Lun y Mié → Media (13); Mar → Económica (12). Feriado: pendiente de decisión (D-4).
  - Recargos: 2D 0, 3D 5, 4DX 15, XD 8, VIP 20, D-BOX 15 (+ IMAX, falta en el catálogo mock).
  - Descuentos: General 0 %, Niño 30 %, Adulto Mayor 20 %, CONADIS 20 % (no deshabilitable por sede).
- **Funciones:** 30 min de limpieza obligatorios entre funciones de una misma sala (también puede cruzar medianoche).
- **Compra:** máx. 8 asientos; bloqueo y temporizador de 5 min (la verdad es `fecha_hora_expiracion`, el contador de UI es solo visual); un carrito nunca mezcla sedes.
- **Socios:** 1 punto por S/ 1 × multiplicador (Bronce 1.00, Plata 1.10 desde 300, Oro 1.25 desde 800). Canje: mínimo 50 pts, S/ 0.10 por punto, máx. 50 % del subtotal. Counter y admin **no** son socios; en venta de counter los puntos van al socio vinculado.
- **Multisede:** catálogo global lo escribe solo `super_admin`; la sede solo usa pivotes (`pelicula_sede`, `producto_sede`, `cupon_sede`, `tipo_entrada_sede`, `tarifa_sede`). El Admin de Sede edita únicamente tarifas `Dia_Semana`, precio local y stock; el resto es solo lectura.
- **Impersonación:** el `sedeId` del frontend es contexto de UI; **RLS autoriza** con `puede_gestionar_sede()`. En modo sede se bloquean las rutas globales y se audita en `bitacora` (`impersonando = true`).
- **"Eliminar" = baja lógica** (`eliminado_en` / `activo`) en catálogo y entidades con historial. Nunca `DELETE` físico.
- **Precios, stock, cupones y puntos se calculan en el servidor** (`rpc_crear_orden`). El cliente solo muestra. La regla de precio existe en TS y SQL: deben coincidir (prueba de contrato).
- Un toggle de sede impide **nuevas** funciones/ventas, pero no destruye lo ya vendido.
- No parsear textos como `"2x Popcorn"` para métricas; usar `detalle_entrada` / `detalle_producto`.
- Roles: `super_admin`, `admin_sede`, `counter`, `cliente`. El rol nunca se guarda en `user_metadata`.

## Forma de trabajar

- Planificar primero (breve, con archivos a tocar) si el cambio toca BD, RLS, RPC o más de 3 archivos.
- Cambios pequeños y revisables; una fase o módulo a la vez (orden en §10 del plan).
- Al migrar un módulo de `admin.js`/`cliente.js`: primero extraer la regla a `domain/` con pruebas, luego construir la pantalla.
- Al terminar, explicar: qué cambió, por qué, cómo se verificó y qué queda pendiente.
- Consultar `MEMORY.md` al empezar y actualizarlo al terminar.

## Memoria
- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones
tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su
porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de
dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales). 

## Límites

- ✅ **Siempre:** exigir `sedeId` en métodos operativos; activar RLS en tablas nuevas; escribir pruebas del dominio y de RLS; usar migraciones versionadas; texto de UI en español.
- ✅ Siempre: actualizar `MEMORY.md` al terminar cada tarea. 
- ⚠️ **Preguntar antes:** dependencias nuevas; archivos o carpetas nuevas fuera de la estructura del plan; cambios de esquema o de reglas de negocio (ver decisiones abiertas D-1…D-15); cambios en el formato de datos o en políticas RLS.
- 🚫 **Nunca:** usar `any` o desactivar `strict`; llamar a `supabase.from(...)` desde componentes; confiar en el `sede_id` enviado por el cliente; calcular el precio cobrado en el navegador; usar `service_role` en el frontend; guardar contraseñas o tarjetas; `DELETE` físico en catálogo; commitear claves o `.env`; usar `localStorage` como base de datos en el proyecto nuevo; editar `database.types.ts` a mano.
- 🚫 **Nunca:** intentar programar algoritmos de Machine Learning, importar librerías de IA en el package.json o mezclar Python en este repositorio. El Machine Learning (Fase 5) será un script externo; el frontend solo leerá los datos de la base de datos.

## Verificación

1. `ng lint` y `ng test` en verde (incluye límites de capas).
2. `supabase test db` en verde: un usuario de la sede A no ve ni escribe datos de la sede B.
3. Precios de TS = `fn_tarifa_base` (casos de §2.2 del plan).
4. Flujo manual: elegir sede → asientos → dulcería → pago → ticket; dos navegadores sobre el mismo asiento: solo uno compra.
5. Si hay UI de admin: probar como `admin_sede` y como `super_admin` en modo sede.
