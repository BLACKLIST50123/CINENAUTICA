# MEMORY.md — Cine Náutica (MVP Plataforma Multisede)
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual del Proyecto
- **Fase 0 — Infraestructura Base: ✅ COMPLETADA**
- **Fase 1 — Autenticación Real: ✅ COMPLETADA** (2026-10-13)
- **Fase 2 — Cartelera e Inicio: ✅ COMPLETADA** (2026-10-13)
- **Próximo:** Fase 3 — Detalle de Película y Selección de Función

## Archivos creados / modificados en Fase 2
- `src/dtos/cartelera.ts` — SedeDTO, PeliculaCarteleraDTO, FuncionResumenDTO, DiaCarteleraDTO
- `src/daos/SedeDao.ts` — DAO para sedes con ciudad y región desde Supabase
- `src/daos/PeliculaDao.ts` — DAO para cartelera, géneros, formatos y funciones
- `src/services/carteleraService.ts` — Fechas reales (7 días), agrupación y filtrado en memoria
- `src/services/__tests__/carteleraService.test.ts` — Tests unitarios e integración con Supabase (5 tests ok)
- `src/components/cliente/vistas/Inicio.tsx` — Conectado a Supabase: carrusel hero, filtros y tarjetas reales
- `src/components/cliente/ModalesGlobales.tsx` — `modal-sede` y `modal-dulceria-sede` dinámicos desde BD
- `src/components/cliente/Navbar.tsx` — Chip de sede sincronizado y fondo con blur al scrollear
- `src/lib/ui/cliente.ts` — Stubs de filtros para evitar mutación DOM; trailer soporta URLs de YouTube
- `supabase/migrations/20261013_003_seed_funciones_cartelera.sql` — Seed de funciones semana actual

## Decisiones clave
- **UUID cliente:** `44444444-4444-4444-4444-444444444444` | Bronce=1, Plata=2, Oro=3
- **Invitado permitido:** compra sin registro | Pago simulado provisional
- **Migración 20261013_003:** funciones desplazadas al rango actual (2026-10-13+) y sedes 2 y 3 habilitadas
- **Vitest:** carga `.env.local` nativamente sin dependencias ESM
- **Detalle temporal:** `pelicula/[id]` acepta tanto UUIDs como slugs previos

## Aprendizajes y errores a evitar
- PostgREST joins: usar `sala(...)` y `formato_proyeccion(...)` sin alias de columna en FK
- No mutar DOM con `innerHTML` en elementos gestionados por React (evita `removeChild` error)
- `fecha_nacimiento` vive en tabla `socio`, no en `usuario`

## Próximos Pasos — Fase 3
1. Crear `src/daos/FuncionDao.ts` (funciones agrupadas por sede, formato y fecha)
2. Crear `src/services/funcionService.ts` (lógica de selección de función y horarios)
3. Crear componente dinámico `DetallePelicula.tsx` que reciba `id` (UUID o slug) y cargue de BD
4. Reemplazar los 10 archivos estáticos en `src/components/cliente/detalle/`

## Patrones de diseño en uso
- **Context + Observer** → SesionContext + onAuthStateChange
- **DAO Pattern** → SedeDao, PeliculaDao
- **Service Layer** → CarteleraService
- **Singleton Pattern** → cliente Supabase