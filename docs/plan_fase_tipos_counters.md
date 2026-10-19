# COMPLETADO ✅ (2026-10-15)

# Plan de Implementación — Módulo Counter: 3 Roles Especializados (Boletería, Dulcería y Mixto)

## 1. Visión General del Proyecto
Implementamos una arquitectura POS modular basada en **3 roles operativos** y un **Hub de supervisión para Administrador de Sede**, reutilizando la interfaz y estilos existentes en `CounterView.tsx` y la lógica de negocio probada de Cliente:

1. **`counter_boleteria` (`/counter/boleteria`):**
   - **Propósito:** Taquilla presencial para venta exclusiva de entradas de cine.
   - **Componentes reutilizados:** Cartelera de funciones (`cv-inicio`, por película / por hora), selección de sala y butacas (`cv-asientos`, tarifas General/Niño/Adulto Mayor) y módulo de cobro POS (`cv-pago`).
   - **Panel lateral:** Resumen exclusivo de función, sala, entradas y subtotal de boletería.
   - **Comprobante:** Boleta/Factura térmica con tickets de sala y código QR de acceso (ancho estandarizado de 80mm-95mm idéntico a Cliente).

2. **`counter_dulceria` (`/counter/dulceria`):**
   - **Propósito:** Confitería / Candy Bar para venta directa y despacho de alimentos y bebidas.
   - **Componentes reutilizados:** Catálogo de confitería (`cv-dulceria`, combos, canchitas, bebidas, golosinas) y módulo de cobro POS (`cv-pago`).
   - **Panel lateral:** Carrito de productos con selectores de cantidad `+` / `-` y total dulcería.
   - **Comprobante:** Boleta/Factura térmica con ticket de entrega en barra.

3. **`counter_mixto` (`/counter/mixto`):**
   - **Propósito:** Caja integral y multifuncional donde el cajero puede vender entradas de cine, dulcería o ambas en una misma orden (con el botón rápido "Solo dulcería").
   - **Componentes reutilizados:** Flujo integral completo (`cv-inicio` → `cv-asientos` → `cv-dulceria` → `cv-pago` → `cv-ok`).
   - **Panel lateral:** Resumen combinado (Función + Entradas + Dulcería).
   - **Comprobante:** Comprobante integral y desglose de tickets para sala y barra.

4. **Hub de Supervisión en `/counter` (Exclusivo para `admin_sede`):**
   - Si ingresa un cajero (`counter_boleteria`, `counter_dulceria` o `counter_mixto`), se le redirige automáticamente a su pantalla sin pasar por el Hub.
   - Si ingresa un **`admin_sede`**, `/counter` despliega un panel de supervisión con tarjetas para acceder a cualquiera de las 3 ventanillas (`Boletería`, `Dulcería` o `Mixto`), además de regresar a su panel de administración.
   - En modo desarrollo/demostración, permite seleccionar a qué ventanilla entrar.

---

## 2. Reglas de Negocio Aprobadas

> [!IMPORTANT]
> - **Bloqueo en Tiempo Real sin Temporizador Expulsor:**
>   - En Counter **no hay cronómetro de 5 minutos** que interrumpa o expulse la atención al cliente físico.
>   - Sin embargo, las butacas seleccionadas **sí se bloquean temporalmente en Supabase (`estado = 'Bloqueado'`)** en tiempo real con un `id_sesion_bloqueo` del POS, protegiendo las butacas frente a compras en web u otras cajas.
>   - Al deseleccionar, la butaca se libera al instante.
>   - Al completar la venta, pasa a `Ocupado`.
> - **Modal de Advertencia de Salida y Limpieza Total:**
>   - Si el cajero pulsa "Cancelar venta", cambia de sede o intenta salir/cerrar sesión mientras tiene asientos o snacks seleccionados, aparece el modal de confirmación de salida. Al aceptar salir, se liberan todas las butacas en Supabase y se limpia el carrito de dulcería, dejando cero rastros ni bloqueos huérfanos.
> - **Gestión de Sede (Solo para Pruebas):**
>   - Por defecto toma la sede del empleado (`personal_sede` en BD, ej. Sede 1 - Chimbote).
>   - En la cabecera hay un selector rápido solo en frontend para pruebas (sin alterar tablas ni estructuras de BD) para cargar funciones y stock de otras sedes fácilmente.
> - **Acciones de Contingencia en `ModalBuscarOrden` (según `AGENTS.md`):**
>   - Búsqueda por código de orden (`ORD-...`) o DNI del cliente.
>   - **Reimprimir:** 100% operativo con vista/impresión de ticket térmico y QR.
>   - **Reembolsar:** 100% operativo. Cambia el estado a `Reembolsada` en Supabase (`estado_orden`), libera las butacas a `Disponible` y emite toast de confirmación.
>   - **Reubicar:** Botón presente con toast informativo: *"Próximamente: Módulo de reubicación por contingencia de sala (Disponible en Fase Admin)"*.
> - **Formato de Ticket Térmico:**
>   - Mismo tamaño físico (80mm - 95mm) y reglas `@media print` de `src/components/cliente/vistas/Ticket.tsx`.
> - **Modal de Afiliación Exprés de Socio:**
>   - Búsqueda por DNI/código y pestaña de registro rápido de socio en ventanilla (DNI, Nombres, Apellidos, Teléfono, Correo).

---

## 3. Estado de la Base de Datos (Supabase)

1. **Roles en `public.rol`:**
   - `33333333-1111-3333-3333-333333333333` → `counter_boleteria`
   - `33333333-2222-3333-3333-333333333333` → `counter_dulceria`
   - `33333333-3333-3333-3333-333333333333` → `counter_mixto`
   *(Migración guardada en `supabase/migrations/20261014_007_roles_counter.sql`)*.
2. **Usuarios de Demostración configurados en `public.usuario`:**
   - `boleteria@cinenautica.pe` → Ana Boletería (`counter_boleteria`, Sede 1)
   - `dulceria@cinenautica.pe` → Carlos Dulcería (`counter_dulceria`, Sede 1)
   - `mixto@cinenautica.pe` → Marcos Caja Mixta (`counter_mixto`, Sede 1)
3. **Registro de Ventas en `public.orden`:**
   - `canal`: `'Counter'`
   - `id_vendedor`: `id_usuario` del cajero
   - `estado`: `'Pagada'`

---

## 4. Fases de Ejecución

### Fase 1: Capa de Tipos y Servicio POS (`counterService.ts`)
- `src/dtos/counter.ts`: Modelos de datos para transacciones POS, items de entrada, items de dulcería, estado de contingencia y búsqueda de órdenes.
- `src/services/counterService.ts`:
  - `obtenerSedesActivas()`
  - `obtenerFuncionesPorSedeYFecha()`
  - `obtenerMapaAsientos(idFuncion)`
  - `bloquearAsientosCounter(idFuncion, asientos, sesionId)` (sin temporizador regresivo de 5 min)
  - `liberarAsientosCounter(idFuncion, asientos, sesionId)`
  - `obtenerProductosPorSede(idSede)`
  - `buscarSocio(dniOCodigo)` y `registrarSocioRapido(datos)`
  - `procesarVentaCounter(datos)`: Inserción de orden con canal `'Counter'`, vendedor, detalles, comprobante (Boleta/Factura), deducción/acumulación de puntos y marcación de asientos a `Ocupado`.
  - `buscarOrdenPorCodigoODni(criterio)`
  - `reembolsarOrdenContingencia(idOrden, motivo)`: Marca `Reembolsada` y libera asientos a `Disponible`.

### Fase 2: Componentes Modulares Compartidos (`src/components/counter/comun/`)
- `CounterHeader.tsx`: Reloj en vivo, selector temporal de sede para pruebas, chip de socio, botón "Buscar orden", badge del rol y menú cajero.
- `ModuloPagoPOS.tsx`: Cobro con Efectivo (botones de billetes S/20, S/50, S/100, S/200, cálculo de vuelto), Tarjeta POS física, Yape/Plin, y emisión de Boleta (DNI) / Factura (RUC).
- `ModalVincularSocio.tsx`: Pestaña 1 (Búsqueda DNI/código) + Pestaña 2 (Afiliación rápida en ventanilla).
- `ModalBuscarOrden.tsx`: Búsqueda por orden o DNI con acciones: Reimprimir, Reembolsar y Reubicar (toast).
- `TicketTermicoPOS.tsx`: Comprobante con formato exacto de 80-95mm para impresora térmica (con `@media print` de Cliente).
- `ModalConfirmarSalidaCounter.tsx`: Modal para advertir si hay butacas o snacks en curso antes de cancelar o abandonar la venta.

### Fase 3: Vistas Especializadas
- `src/components/counter/boleteria/BoleteriaView.tsx`: Taquilla pura (funciones → sala/butacas → cobro → ticket).
- `src/components/counter/dulceria/DulceriaView.tsx`: Confitería pura (catálogo snacks → cobro → ticket).
- `src/components/counter/mixto/MixtoView.tsx`: Flujo integral completo adaptado a React con botón "Solo dulcería".
- `src/components/counter/comun/CounterHubView.tsx`: Pantalla Hub para `admin_sede` con tarjetas de acceso a las 3 cajas.

### Fase 4: Enrutamiento y Páginas Next.js
- `src/app/counter/page.tsx`: Hub para `admin_sede` o redirección automática si es cajero.
- `src/app/counter/boleteria/page.tsx`: Monta `BoleteriaView`.
- `src/app/counter/dulceria/page.tsx`: Monta `DulceriaView`.
- `src/app/counter/mixto/page.tsx`: Monta `MixtoView`.
- `src/app/acceso/page.tsx`: Actualizado con los 3 roles de counter con sus credenciales demo.

### Fase 5: Pruebas y Verificación
- Pruebas unitarias en Vitest para `counterService.ts` (`npm run test`).
- Pruebas en navegador con subagente para validar cada flujo, bloqueo de asientos, cálculo de vuelto, emisión de ticket térmico e impresión.
