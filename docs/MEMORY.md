# MEMORY.md — Cine Náutica (MVP Plataforma Multisede)
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual del Proyecto
- **Fase 0 — Infraestructura Base: ✅ COMPLETADA**
- **Fase 1 — Autenticación Real: ✅ COMPLETADA** (2026-10-13)
- **Próximo:** Fase 2 — Cartelera e Inicio (datos reales desde BD)

## Archivos creados / modificados en Fase 1
- `src/components/cliente/ModalesAuth.tsx` — ModalLogin, ModalRegistro, ModalPerfil, ModalCarnetSocio (reales)
- `src/components/cliente/ModalesGlobales.tsx` — Importa ModalesAuth; resto de modales intactos
- `src/components/cliente/Navbar.tsx` — Usa useSesion(): menús condicionales React, iniciales avatar, puntos
- `src/lib/ui/cliente.ts` — setSesion/manejarLogin/manejarRegistro → stubs vacíos (migrado a SesionContext)

## Decisiones clave
- **ROL cliente UUID:** `44444444-4444-4444-4444-444444444444`
- **nivel_socio:** Bronce=1, Plata=2, Oro=3 (seeded en BD)
- **Invitado permitido:** compra sin registro, sin beneficios de socio
- **Pago simulado** (sin Culqi real aún)
- **RLS:** se activa por flujo al terminar cada módulo; esquema `public` con grants a `anon` y `authenticated` (migración `20261013_002`)
- **Cambios en BD → registrar en `supabase/migrations/` comentado**
- **Vitest excluido del tsconfig** para evitar conflicto postcss/Vite vs Next
- **Playwright no disponible** en el entorno → verificación manual en browser

## UUIDs de Roles (fijos en BD)
- admin_general: `11111111-1111-1111-1111-111111111111`
- admin_sede:    `22222222-2222-2222-2222-222222222222`
- counter:       `33333333-3333-3333-3333-333333333333`
- cliente:       `44444444-4444-4444-4444-444444444444`

## Aprendizajes y errores a evitar
- `tsc --noEmit | Select-String "src/"` para ver solo errores propios
- `fecha_nacimiento` en tabla `socio` (no `fecha_nac`)
- Los errores de `.next/types/validator.ts` son inofensivos del generador de Next 16
- `rol` tiene columna `codigo` (no `nombre`) y `nombre_rol` para el label

## Próximos Pasos — Fase 2
1. Crear `src/daos/SedeDao.ts` → obtener sedes con ciudad desde BD
2. Crear `src/daos/PeliculaDao.ts` → cartelera real filtrada por sede/fecha
3. Actualizar `Inicio.tsx` para cargar datos reales (reemplazar SEDES hardcodeado)
4. Actualizar `data.ts` → reemplazar SEDES por fetch a BD, o eliminar donde ya no sea necesario

## Patrones de diseño en uso
- **Context Pattern** → SesionContext
- **Observer Pattern** → onAuthStateChange de Supabase
- **DAO Pattern** → (iniciando Fase 2)
- **Service Layer** → (iniciando Fase 2)
- **Strategy Pattern** → Motor de tarifas (Fase 4)