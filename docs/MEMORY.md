# MEMORY.md — Cine Náutica (MVP Plataforma Multisede)
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual del Proyecto
- **Fase 0 — Infraestructura Base: ✅ COMPLETADA**
- **Fase 1 — Autenticación Real: ✅ COMPLETADA** (2026-10-13)
- **Fase 2 — Cartelera e Inicio: ✅ COMPLETADA** (2026-10-13)
- **Fase 3 — Detalle de Película y Selección de Función: ✅ COMPLETADA** (2026-10-14)
- **Fase 4 — Mapa de Asientos y Motor de Tarifas: ✅ COMPLETADA** (2026-10-14)
- **Fase 5 — Dulcería (Productos, Combos, Stock y Precios Locales): ✅ COMPLETADA** (2026-10-14)
- **Fase 6 — Pago y Comprobante (Pasarela, Cupones, Puntos, Boleta/Factura): ✅ COMPLETADA** (2026-10-14)
- **Fase 7 — Ticket / Boleta (QR, Desglose SUNAT 18% IGV, Impresión Térmica): ✅ COMPLETADA** (2026-10-14)
- **Fase 8 — Perfil Socio (Nivel, Puntos, Beneficio Cumpleaños, Carnet Digital): ✅ COMPLETADA** (2026-10-14)
- **Fase 9 — Historial de Compras (Órdenes, Invitados, Detalles Expandibles, Tickets): ✅ COMPLETADA** (2026-10-14)
- **Fase 10 — Vistas Estáticas con Datos Reales (Ubicación, Promociones, Contacto): ✅ COMPLETADA** (2026-10-14)

## Suite de Pruebas y Cobertura
- **38 de 38 pruebas unitarias e integración pasando en verde** (`npx vitest run` en 9 suites de pruebas).
- **TypeScript 0 errores** (`npx tsc --noEmit`).
- Todas las rutas activas y operativas en HTTP 200 OK (`/`, `/asientos`, `/dulceria`, `/pago`, `/ticket`, `/socio`, `/historial`, `/promociones`, `/ubicacion`, `/contacto`).

## Archivos clave de Fases 7 a 10
- `src/services/ticketService.ts`, `socioService.ts`, `historialService.ts` — Servicios de ticket, fidelización e historial
- `src/daos/SocioDao.ts`, `OrdenDao.ts`, `CuponDao.ts`, `ContactoDao.ts` — DAOs conectados a Supabase
- `src/components/cliente/vistas/` (`Ticket.tsx`, `Socio.tsx`, `Historial.tsx`, `Promociones.tsx`, `Ubicacion.tsx`, `Contacto.tsx`)
- `supabase/migrations/20261014_006_contacto.sql` — Tabla `mensaje_contacto` con RLS habilitada

## PATRONES USADOS EN EL PROYECTO, RAZON Y UBICACION (No borrar excluir de la longitud maxima de MEMORY)
- **DAO Pattern (Data Access Object):**
  - *Ubicación:* `src/daos/` (`PeliculaDao.ts`, `SedeDao.ts`, `FuncionDao.ts`, `TarifaDao.ts`, `AsientoDao.ts`, `ProductoDao.ts`, `CuponDao.ts`, `OrdenDao.ts`, `SocioDao.ts`, `ContactoDao.ts`).
  - *Razón:* Desacopla y encapsula todas las consultas directas a Supabase PostgREST, abstrayendo la persistencia del resto del sistema.
- **Service Layer Pattern:**
  - *Ubicación:* `src/services/` (`carteleraService.ts`, `funcionService.ts`, `asientoService.ts`, `dulceriaService.ts`, `pagoService.ts`, `ticketService.ts`, `socioService.ts`, `historialService.ts`).
  - *Razón:* Centraliza las reglas de negocio complejas (tarifas en 3 capas, expiración de bloqueos, canje de puntos, validación SUNAT) comprobables con Vitest.
- **DTO Pattern (Data Transfer Object):**
  - *Ubicación:* `src/dtos/` (`cartelera.ts`, `funcion.ts`, `asiento.ts`, `producto.ts`, `orden.ts`, `socio.ts`).
  - *Razón:* Define contratos inmutables de datos entre la base de datos, servicios y componentes React, previniendo acoplamiento a tablas crudas.
- **Observer / Pub-Sub Pattern:**
  - *Ubicación:* `bloqueo_temporal` en Supabase Realtime (`Asientos.tsx`) y eventos del temporizador (`temporizador-compra-tick`).
  - *Razón:* Sincronización concurrentemente de estados de butacas entre clientes sin polling y comunicación desacoplada con el badge global.
- **Optimistic UI Pattern:**
  - *Ubicación:* `src/components/cliente/vistas/Asientos.tsx` y `Dulceria.tsx`.
  - *Razón:* Brinda feedback visual inmediato (0ms de retraso) al seleccionar o deseleccionar butacas y productos.
- **Context Pattern:**
  - *Ubicación:* `src/context/SesionContext.tsx`.
  - *Razón:* Provee acceso global al estado de autenticación (usuario, socio, login/logout) en todo el árbol de componentes.
- **Singleton Pattern:**
  - *Ubicación:* `src/lib/supabase/cliente.ts`.
  - *Razón:* Mantiene una única instancia del cliente de Supabase para evitar conexiones redundantes.