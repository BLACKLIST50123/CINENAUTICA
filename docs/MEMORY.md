# MEMORY.md — Cine Náutica (MVP Plataforma Multisede)
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual del Proyecto
- **Fases 0 a 10 — Plataforma Cliente MVP (Cartelera, Butacas, Dulcería, Pagos, Tickets, Perfil, Historial): ✅ COMPLETADAS**
- **Fase 11 — Módulo Counter POS (Boletería, Dulcería, Mixto & Hub Admin Sede): ✅ COMPLETADA**
- **Fases 12 y 13 — Acceso Corporativo Seguro y Admin de Sede (9 Tabs Modulares con Datos Reales): ✅ COMPLETADAS**
- **Fase 14 — Admin General (Modularización + Datos Reales Supabase + Rediseño Visual): ✅ COMPLETADA** (2026-10-21)
  - Fase 14.1 — Scaffolding (DTOs, DAO, Container, Header, NavBar, page.tsx): ✅ COMPLETADA
  - Fase 14.2 — Dashboard General (8 KPIs, gráfico barras pico, Donut SVG % attach, matriz 7x7 mapa ocupación, ranking sedes, top películas): ✅ COMPLETADA
  - Fase 14.3 — Datos Globales (Películas con formatos y trailer, Dulcería con tarjetas Admin_Sede, Tarifas en 3 secciones, Descuentos): ✅ COMPLETADA
  - Fase 14.4 — Gestión de Sedes (acordeón desplegable por ciudad con drill-down a Admin_Sede): ✅ COMPLETADA
  - Fase 14.5 — Suite de Pruebas y Limpieza (0 errores 400/404, 56 tests verdes, TS 0 errores): ✅ COMPLETADA
  - Fase 14.6 — Modales de Confirmación CRUD Centralizados (Portal) y Validaciones Inline Robustas en todos los formularios: ✅ COMPLETADA

## Suite de Pruebas y Cobertura
- **56 de 56 pruebas unitarias e integración pasando en verde** (`npx vitest run` en 12 suites de pruebas).
- **TypeScript 0 errores** (`npx tsc --noEmit`).
- Todas las rutas activas y operativas en HTTP 200 OK (`/`, `/asientos`, `/dulceria`, `/pago`, `/ticket`, `/socio`, `/historial`, `/promociones`, `/ubicacion`, `/contacto`, `/acceso`, `/counter`, `/counter/boleteria`, `/counter/dulceria`, `/counter/mixto`, `/admin_sede`, `/admin_general`).

## Archivos clave de Fases 11 a 13
- `src/services/adminSedeService.ts`, `counterService.ts`, `ticketService.ts`, `socioService.ts`
- `src/daos/AdminSedeDao.ts` (23 métodos Supabase), `OrdenDao.ts`, `SocioDao.ts`, `CuponDao.ts`
- `src/components/admin_sede/` (modular: `tabs/` 9 módulos, `modales/` 7 modales, `comun/ModalConfirmacion.tsx`)
- `src/daos/SocioDao.ts`, `OrdenDao.ts`, `CuponDao.ts`, `ContactoDao.ts` — DAOs conectados a Supabase
- `src/components/cliente/vistas/` (`Ticket.tsx`, `Socio.tsx`, `Historial.tsx`, `Promociones.tsx`, `Ubicacion.tsx`, `Contacto.tsx`)
- `src/components/counter/` (`boleteria/BoleteriaView.tsx`, `dulceria/DulceriaView.tsx`, `mixto/MixtoView.tsx`, `comun/`)
- `supabase/migrations/20261014_007_roles_counter.sql` — Roles `counter_boleteria`, `counter_dulceria`, `counter_mixto`

## PATRONES USADOS EN EL PROYECTO, RAZON Y UBICACION (No borrar, excluir de la longitud maxima de MEMORY )
- **DAO Pattern (Data Access Object):**
  - *Ubicación:* `src/daos/` (`AdminGeneralDao.ts`, `AdminSedeDao.ts`, `PeliculaDao.ts`, `SedeDao.ts`, `FuncionDao.ts`, `TarifaDao.ts`, `AsientoDao.ts`, `ProductoDao.ts`, `CuponDao.ts`, `OrdenDao.ts`, `SocioDao.ts`, `ContactoDao.ts`).
  - *Razón:* Desacopla y encapsula todas las consultas directas a Supabase PostgREST, abstrayendo la persistencia del resto del sistema.
- **Service Layer Pattern:**
  - *Ubicación:* `src/services/` (`carteleraService.ts`, `funcionService.ts`, `asientoService.ts`, `dulceriaService.ts`, `pagoService.ts`, `ticketService.ts`, `socioService.ts`, `historialService.ts`).
  - *Razón:* Centraliza las reglas de negocio complejas (tarifas en 3 capas, expiración de bloqueos, canje de puntos, validación SUNAT) comprobables con Vitest.
- **DTO Pattern (Data Transfer Object):**
  - *Ubicación:* `src/dtos/` (`adminGeneral.ts`, `adminSede.ts`, `cartelera.ts`, `funcion.ts`, `asiento.ts`, `producto.ts`, `orden.ts`, `socio.ts`).
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