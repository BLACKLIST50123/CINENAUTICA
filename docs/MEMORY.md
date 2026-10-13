# MEMORY.md — Cine Náutica (MVP Plataforma Multisede)
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual del Proyecto
- **Fase 0 — Infraestructura Base: ✅ COMPLETADA** (2026-10-12)
- Frontend demo completo, sin lógica real aún.
- Supabase SDK instalado: `@supabase/supabase-js` + `@supabase/ssr`.
- Vitest instalado (v2.1.8, compatible con @types/node@20).
- **Próximo:** Fase 1 — Autenticación real (modal login/registro).

## Archivos creados en Fase 0
- `src/lib/supabase/types.ts` — Tipos TS generados desde BD real.
- `src/lib/supabase/cliente.ts` — Cliente browser (Singleton).
- `src/lib/supabase/servidor.ts` — Cliente server (Factory, con crearClienteAdmin).
- `src/lib/supabase/auth.ts` — Funciones de auth real (login, registro, logout).
- `src/context/SesionContext.tsx` — Context + Observer con Supabase onAuthStateChange.
- `src/middleware.ts` — Middleware Next.js para refresh de token SSR.
- `vitest.config.ts` — Configuración de tests.
- `supabase/migrations/20261012_001_seed_nivel_socio.sql` — Seed de nivel_socio.

## Decisiones (y por qué)
- **SesionContext reemplaza S/SEL de nav.ts** para la sesión. SEL quedará como estado del flujo de compra.
- **ROL cliente UUID:** `44444444-4444-4444-4444-444444444444` (hardcoded en auth.ts, no cambia).
- **nivel_socio Bronce = id_nivel:1, Plata=2, Oro=3** (seeded en BD y migración).
- **Invitado permitido:** El cliente puede comprar sin registrarse (sin beneficios de socio).
- **Pago simulado** por ahora (sin Culqi real, guardamos orden en BD normalmente).
- **RLS:** Se activa por flujo al terminar cada módulo, no todo al final ni todo al inicio.
- **Vitest excluido del tsconfig** principal (`vitest.config.ts` en exclude) para evitar conflicto de tipos postcss entre Vite/Next.
- **Cambios en BD → registrar en `supabase/migrations/` comentado.**

## UUIDs de Roles (fijos en BD)
- admin_general: `11111111-1111-1111-1111-111111111111`
- admin_sede:    `22222222-2222-2222-2222-222222222222`
- counter:       `33333333-3333-3333-3333-333333333333`
- cliente:       `44444444-4444-4444-4444-444444444444`

## Aprendizajes y errores a evitar
- Los tipos en `.next/types/validator.ts` tienen errores pre-existentes del generador de Next 16 — son inofensivos, ignorar.
- Al hacer `tsc --noEmit`, filtrar con `| Select-String "src/"` para ver solo errores propios.
- `fecha_nacimiento` es el nombre de columna en `socio` (no `fecha_nac`).

## Próximos Pasos
1. **Fase 1:** Conectar modales de Login/Registro en `ModalesGlobales.tsx` con `useSesion()`.
2. Navbar: mostrar nombre real del socio cuando hay sesión activa.
3. Redirigir rutas protegidas (`/socio`, `/historial`) si no hay sesión.

## Patrones de diseño en uso
- **Context Pattern** → SesionContext
- **Observer Pattern** → onAuthStateChange de Supabase
- **DAO Pattern** → (próximo, en Fase 2+)
- **Service Layer** → (próximo, en Fase 2+)
- **Strategy Pattern** → Motor de tarifas (Fase 4)