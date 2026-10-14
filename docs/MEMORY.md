# MEMORY.md — Cine Náutica (MVP Plataforma Multisede)
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual del Proyecto
- **Fase 0 — Infraestructura Base: ✅ COMPLETADA**
- **Fase 1 — Autenticación Real: ✅ COMPLETADA** (2026-10-13)
- **Fase 2 — Cartelera e Inicio: ✅ COMPLETADA** (2026-10-13)
- **Fase 3 — Detalle de Película y Selección de Función: ✅ COMPLETADA** (2026-10-14)
- **Fase 4 — Mapa de Asientos y Motor de Tarifas: ✅ COMPLETADA** (2026-10-14)
- **Próximo:** Fase 5 — Dulcería (Productos, combos, stock por sede)

## Archivos creados / modificados en Fase 3 y 4
- `src/dtos/funcion.ts` y `src/dtos/asiento.ts` — DTOs para funciones, salas, matrices, tarifas y selecciones
- `src/daos/FuncionDao.ts` — DAO para horarios, salas y agrupamiento por sede
- `src/daos/TarifaDao.ts` — DAO para tarifas base, tarifas por sede, tipos de entrada y feriados
- `src/daos/AsientoDao.ts` — DAO para mapa físico de asientos, asientos por función y bloqueos temporales
- `src/services/funcionService.ts` — Normalización de formatos, filtros y horarios de función
- `src/services/asientoService.ts` — Motor de precios (3 capas: día/pre-estreno + formato - tipo), límite 8 asientos, 5 min reserva y 30s gracia
- `src/services/__tests__/asientoService.test.ts` — Tests unitarios e integración con Supabase (16 tests totales ok)
- `src/components/cliente/vistas/DetallePelicula.tsx` — Detalle dinámico con tráiler de YouTube seguro y selección de horario
- `src/components/cliente/vistas/Asientos.tsx` — Mapa dinámico con Supabase Realtime, pantalla curva, modales de accesible y gracia, resumen en vivo
- `src/components/cliente/BadgeTemporizador.tsx` — Sincronizado reactivamente con el temporizador de 5 minutos y alerta de urgencia
- `supabase/migrations/20261014_004_realtime_asientos.sql` — Habilita Realtime en `bloqueo_temporal` y `asiento_funcion`

## Decisiones clave
- **Bloqueos temporales:** vinculados a `id_sesion` UUID aislado por pestaña en `sessionStorage`
- **Temporizador:** 5 minutos con broadcast de evento `temporizador-compra-tick` al badge global; gracia de 30s con opción de renovación o cancelación inmediata
- **Sincronización:** Supabase Realtime suscrito a `bloqueo_temporal` para refrescar asientos de inmediato si otro usuario reserva
- **Next.js 16 con cacheComponents:** `await params` envuelto dentro de componente asíncrono hijo dentro de `<Suspense>` para evitar bloqueos de prerender

## Aprendizajes y errores a evitar
- No usar `export const dynamic = "force-dynamic"` en rutas dinámicas de Next.js 16 con `cacheComponents` activado; usar `<Suspense>`
- En PostgREST/Supabase, `funcion` no tiene FK directa simple con `pelicula` sino compuesta vía `pelicula_sede`, por lo que joins directos tipo `pelicula(...)` en `funcion` fallan con error de relación de esquema; consultar `pelicula` por `id_pelicula` directamente.
- En `Asientos.tsx`: usar `useSearchParams()` y un único ciclo de vida atómico para resolver función + sala + matriz en un solo paso, previniendo condiciones de carrera y mezclas de sala entre películas.
- En tablas con FK a `asiento_funcion`, verificar que exista la fila antes de insertar en `bloqueo_temporal` (con `asegurarAsientoFuncion`)
- `pasillos` en `sala` puede ser `null` o `number[]`
- Al salir del flujo de compra: usar `limpiarEstadoCompraGlobal()` (limpia asientos, función, sala y sessionStorages) y navegación absoluta explícita (`router.push`) en vez de `router.back()` para evitar atascarse en duplicados de historial popstate.

## Próximos Pasos — Fase 5
1. Crear `src/dtos/producto.ts` y `src/daos/ProductoDao.ts` (productos, combos y stock por sede)
2. Crear `src/services/dulceriaService.ts`
3. Conectar `src/components/cliente/vistas/Dulceria.tsx` con productos y categorías reales

## PATRONES USADOS EN EL PROYECTO, RAZON Y UBICACION (No borrar excluir de la longitud maxima de MEMORY)
- **DAO Pattern (Data Access Object):**
  - *Ubicación:* `src/daos/` (`PeliculaDao.ts`, `SedeDao.ts`, `FuncionDao.ts`, `TarifaDao.ts`, `AsientoDao.ts`).
  - *Razón:* Desacopla y encapsula todas las consultas directas a Supabase PostgREST, abstrayendo la persistencia del resto del sistema.
- **Service Layer Pattern:**
  - *Ubicación:* `src/services/` (`carteleraService.ts`, `funcionService.ts`, `asientoService.ts`).
  - *Razón:* Centraliza las reglas de negocio complejas (motor de tarifas en 3 capas, expiración de bloqueos temporales, límite de 8 asientos, rangos de fechas) haciéndolas reutilizables y comprobables con Vitest.
- **DTO Pattern (Data Transfer Object):**
  - *Ubicación:* `src/dtos/` (`cartelera.ts`, `funcion.ts`, `asiento.ts`).
  - *Razón:* Define contratos inmutables de datos entre la base de datos, servicios y componentes React, previniendo acoplamiento a tablas crudas.
- **Observer / Pub-Sub Pattern:**
  - *Ubicación:* `bloqueo_temporal` en Supabase Realtime (`Asientos.tsx`) y eventos del temporizador (`temporizador-compra-tick`).
  - *Razón:* Sincronización concurrentemente de estados de butacas entre clientes sin polling y comunicación desacoplada con el badge global.
- **Optimistic UI Pattern:**
  - *Ubicación:* `src/components/cliente/vistas/Asientos.tsx`.
  - *Razón:* Brinda feedback visual inmediato (0ms de retraso) al seleccionar o deseleccionar butacas, sincronizando el bloqueo en Supabase en segundo plano y revirtiendo en caso de conflicto.
- **Context Pattern:**
  - *Ubicación:* `src/context/SesionContext.tsx`.
  - *Razón:* Provee acceso global al estado de autenticación (usuario, socio, login/logout) en todo el árbol de componentes.
- **Singleton Pattern:**
  - *Ubicación:* `src/lib/supabase/cliente.ts`.
  - *Razón:* Mantiene una única instancia del cliente de Supabase para evitar conexiones redundantes.