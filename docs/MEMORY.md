# MEMORY.md — Diario de Estudio
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.

## Estado actual
- MVP legacy funcionando: flujo de compra (horarios, asientos, dulcería, checkout, ticket), programa de socios y panel admin de **una sola sede**. HTML + JS clásico + Tailwind CDN.
- Datos 100 % en `localStorage` (claves `cinerama_*`); todo es mock, no hay datos reales que migrar.
- Hecho: auditoría del código y `master_plan_multisede.md` v1.0 (modelo BD con 45 tablas en DBML, RLS, RPC, arquitectura Angular, ML, roadmap, 15 decisiones abiertas).
- Pendiente: proyecto Angular y proyectos Supabase aún **no creados** (Fase 0).

## Decisiones (y por qué)
- Multisede desde la Fase 1 con RLS desde la Fase 2: añadirlo después con datos cargados es doloroso.
- `sede` (y `region`, `ciudad`) con id `INT`; el resto UUID: permite el `sede_id = 1` de la Fase 3 y índices pequeños.
- Stack: Angular + TypeScript estricto + Supabase.
- Auth con Supabase Auth; se elimina `contrasena_hash`. `usuario.id_usuario = auth.users.id`.
- 4 roles: `super_admin`, `admin_sede`, `counter`, `cliente` (counter ya existía en el código).
- Impersonación: `sedeId` en la URL (`/super/sedes/:sedeId/**`), reutiliza las rutas de Admin Sede; RLS autoriza, bitácora audita.
- Precio calculado al comprar y congelado en `detalle_entrada`; se elimina `funcion.precio_base` y `asiento_funcion.precio`.
- Compra atómica en `rpc_crear_orden`; bloqueo de asientos con `rpc_bloquear_asientos` + Realtime + `pg_cron`.
- "Eliminar" = baja lógica en catálogo.
- Puntos de socio globales para toda la cadena (recomendación D-1, por confirmar).
- ML solo por lotes en Python, escribiendo en `ml_prediccion`; Angular lo lee como cualquier otro DAO.

## Aprendizajes y errores a evitar
- El diccionario de datos no incluía `tipo_entrada`, `formato_proyeccion` ni canje de puntos; el código sí los usaba. Contrastar siempre diccionario vs. código.
- Los datos mock tenían `imax` en películas pero no en el catálogo de formatos.
- El dashboard viejo parseaba `"2x Popcorn"` con regex: no repetir; usar tablas normalizadas.
- Un DBML con enums en una sola línea no compila en dbdiagram; usar formato multilínea.
- Un `UNIQUE` simple en `detalle_entrada.id_asiento_funcion` impide revender tras reembolso: usar índice parcial.

## Próximos pasos
- [ ] Cerrar decisiones D-1 a D-6 con negocio (puntos globales, cupones, feriados, compra sin cuenta, rango de tarifas).
- [ ] Fase 0: repo nuevo, Supabase CLI, proyectos `dev`/`staging`, workspace Angular + Tailwind, ESLint de límites, CI.
- [ ] Pegar DBML en dbdiagram.io y exportar a `migrations/0001_init.sql`.
- [ ] Escribir pruebas pgTAP de aislamiento entre sedes antes de las políticas RLS finales.
- [ ] Extraer a `domain/` las reglas de precios, puntos, niveles y canje, con pruebas.
- [ ] Preparar `seed.sql` de la Sede 1 (incluye IMAX, 4 roles, funciones de 14 días).
