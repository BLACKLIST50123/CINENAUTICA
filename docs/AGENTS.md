# AGENTS.md — CineNáutica (MVP Plataforma Multisede)

Sistema web de cine Multiswde: compra de entradas, dulcería y paneles de administración. Con Next.js y Supabase(PostgrestSQL). 

## Stack y estructura (MVP Universitario)


**Tecnologías:**
- **Frontend:** Next.js, TypeScript estricto, Tailwind CSS.
- **Backend:** Supabase (Auth, PostgreSQL, Storage, RLS).
- **Machine Learning (AL FINAL DE TODO):** Script externo en Python (Pandas, Scikit-learn). El frontend solo lee resultados.

**Estructura de Carpetas**


## Convenciones
- **Moneda e Importes:**
  - Soles peruanos (`S/ 0.00`). Todo precio, descuento o recargo se redondea a 2 decimales.
- **Nomenclatura de Identificadores:**
  - Asientos: Fila en letra mayúscula + Columna numérica (ej. `A1`, `D6`, `G12`).
  - Cupones: Códigos en mayúsculas sin espacios (ej. `VERANO20`, `NAUTICA10`).
- **Validaciones de Entrada (Doble Capa):**
  - Todo dato se valida primero en el formulario del cliente y se revalida de forma estricta en la capa de procesamiento previa a la persistencia.
  - Nombres, Apellidos: Solo letras y espacios (2 a 60 caracteres).
  - Correo electrónico: Formato estándar regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
  - Contraseñas: Mínimo 6 caracteres. 
  - DNI (Perú): Exactamente 8 dígitos numéricos.
  - RUC (Perú): Exactamente 11 dígitos numéricos.
  - Celular: Exactamente 9 dígitos numéricos iniciando con `9`.
- **Idioma del Código:** 
  - Nombres de variables de negocio, funciones y comentarios en español claro, organizados por números de fase y módulos.
  - Lo que son nombres de estandar de desarrollo como funciones de librerias externas, referencia a patrones, daos, solid o frameworks se deja en ingles.
 
## Reglas de Negocio

### 1. Flujo de Compra y Ciclo de Vida de la Sesión
- **Recorrido Guiado (Stepper):** La compra de entradas sigue una secuencia obligatoria: `Cartelera` → `Horarios` → `Asientos` → `Dulcería` → `Pago (Checkout)` → `Ticket / Boleta`.
- **Temporizador de Reserva (5 Minutos):** Al ingresar al mapa de asientos, inicia una cuenta regresiva de **5 minutos**. Al cambiar de paso, el temporizador se renueva.
- **Gracia de Permanencia (30 Segundos):** Si el tiempo llega a cero, se dispara un modal interactivo con 30 segundos de gracia. Si el cliente no confirma que continúa, el pedido se cancela, los asientos se liberan inmediatamente y se redirige a la vista de inicio.
- **Prevención de Fuga:** Si el cliente intenta salir del flujo (haciendo clic en el logo, promociones, navegacion, etc) teniendo asientos o productos seleccionados, el sistema exige confirmación explícita advirtiendo la pérdida de la reserva.
- **Límite de Asientos:** Máximo **8 asientos por transacción**.
- **Dulcería Directa (Sin Función):** Los clientes pueden comprar combos y productos de dulcería de forma independiente mediante el boton del navbar, generando una orden de "Retiro en barra" sin requerir película ni sala.

### 2. Gestión de Salas, Butacas y Bloqueos de Proyección
- **Configuración Multisala:** Se cargara la cantidad de salas desde la base de datos (Supabase)
- **Tipos y Estados de Butaca:**
 ## Asiento_Funcion
  - `Disponible`: Asiento libre para selección.
  - `Reservado`: Asiento reservado para una función.
  - `Ocupado`: Asiento ocupado por una función.
 ## Asiento (configuración de salas) 
  - `Mantenimiento`: Butaca deshabilitada por configuración (no seleccionable en flujo de compra).
  - `Pasadizo`: Espacio vacío estructural para circulación. (no seleccionable en flujo de compra).
  - `Accesible`: Espacio adaptado para personas con movilidad reducida o silla de ruedas. Su selección requiere la confirmación explícita del cliente.
- **Aislamiento de Asientos por Función Real:** La ocupación de un asiento queda estrictamente asociada a `(sede, sala, fecha, hora)`. Una butaca vendida para una función queda liberada y disponible para cualquier otra función o fecha distinta en la misma sala y sede.
- **Bloqueo Concurrente Temporal:** Al hacer clic en un asiento disponible, se genera una reserva temporal asociada a la sesión de la pestaña. Dicho asiento se bloquea visualmente para otros clientes en tiempo real.

### 3. Motor de Tarifas Dinámicas y Precios de Entrada
El costo final de cada entrada se calcula aplicando tres capas jerárquicas:
1. **Tarifa Base por Día de la Semana:**
   - **Martes:** *Tarifa Económica*.
   - **Lunes y Miércoles:** *Tarifa Media*.
   - **Jueves, Viernes, Sábado y Domingo:** *Tarifa Alta*.
   - **Pre-Estrenos:** Aplican siempre *Tarifa Alta*, sin importar el día de exhibición.
2. **Recargo por Formato de Proyección:**
   - Suma un importe adicional según la tecnología de la sala:
     - `2D`: S/ 0.00 (Formato base protegido, no eliminable).
     - `3D`: +S/ 5.00. Ejemplo 
     - `XD`: +S/ 8.00.  Ejemplo
     - `4DX`: +S/ 15.00.  Ejemplo
     - `D-BOX`: +S/ 15.00.  Ejemplo
     - `VIP`: +S/ 20.00.  Ejemplo
   - *Precio Base Entrada = Tarifa Base del Día + Recargo del Formato*.
3. **Descuento por Tipo de Entrada:**
   - Se aplica como un porcentaje de descuento sobre el precio base calculado:
     - `General / Adulto`: 0% de descuento (Tipo base protegido).
     - `Niño`: 30% de descuento.  
     - `Adulto Mayor`: 20% de descuento. 
     - `CONADIS`: 20% de descuento (amparado en Ley N° 29973 de Perú). Requiere presentar carnet físico obligatorio al ingresar a sala.
   - *Precio Final Asiento = Precio Base Entrada × (1 - % Descuento del Tipo)*.

### 4. Programa de Lealtad "Socio Náutica"
- **Elegibilidad y Exclusividad de Rol:**
  - El rol `'cliente'` es el **único** que participa en el programa de lealtad (acumula puntos, tiene nivel, carnet y código `CIN-XXXXXX` Ejemplo).
  - Las cuentas de personal (`'counter_boleteria'`, `'counter_dulceria'`, `'counter_mixto'`, `'admin_general'` y `'admin_sede'`) **nunca** son socios ni acumulan puntos.
- **Acumulación de Puntos:**
  - Se otorga **1 punto por cada S/ 1.00** efectivamente pagado (redondeado hacia abajo).
  - Se aplica un multiplicador de ganancia según el nivel alcanzado:
    - **Nivel Bronce** (0 a 299 pts): Multiplicador 1.0×. Ejemplo
    - **Nivel Plata** (300 a 799 pts): Multiplicador 1.10× (+10% pts ganados), acceso a Fila Preferencial.
    - **Nivel Oro** (800+ pts): Multiplicador 1.25× (+25% pts ganados), acceso a Fila Preferencial.
- **Canje de Puntos por Descuento en Dinero:**
  - Saldo mínimo requerido para canjear: **50 puntos**.
  - Valor de conversión: **1 punto = S/ 0.10** de descuento directo.
  - Tope de cobertura: Los puntos pueden cubrir como máximo el **50% del subtotal** de la compra.
  - Deducción efectiva: Los puntos se debitan del saldo real únicamente tras la confirmación exitosa del pago.
- **Beneficio de Entrada de Cumpleaños:**
  - Aplica exclusivamente durante el **mes de cumpleaños** registrado en el perfil del socio.
  - Otorga **1 entrada gratuita (100% de descuento en el asiento más económico)**.
  - Válido únicamente para funciones en **formato 2D**.
  - Limitado a **1 reclamo por año calendario**.
- **Preventa Exclusiva:**
  - Acceso prioritario a películas en categoría `Pre-Venta` exclusivo para usuarios con sesión de socio activa. **(Falta agregar en interfaz WEB una cola de venta para peliculas en Pre-Venta)**

### 5. Venta Presencial en Counter (Módulo de Caja "Ahora son 3 tipos Boleteria/Dulceria/Mixto, luego edito el flujo pero seria el mismo solo que cada uno con sus funciones correspondiente.)
- El personal con rol `'counter'` dispone de acceso directo para ventas presenciales en mostrador físico.
- **Vinculación Opcional de Socio:** El cajero puede buscar al cliente por Código de Socio, DNI o Correo. Si existe, la venta acumula puntos al socio y permite aplicar sus beneficios (canjes o cumpleaños). Si no es socio, la venta se emite como invitado sin vincular puntos a la cuenta del cajero.
- **Protección y Limpieza de Terminal:** Tras procesar la venta, el formulario de pago se limpia por completo para evitar que queden expuestos datos personales del cliente anterior.

### 6. Reubicación de Tickets y Gestión de Contingencias
- El sistema permite reprogramar o reubicar Ordenes de compra pagadas/activas ante eventualidades:
  - **Mismo Formato Obligatorio:** Solo se puede reubicar a una función con el formato original (ej. 2D a 2D).
  - **Equivalencia de Butacas:** Es obligatorio seleccionar la misma cantidad y tipos de asientos de la Orden de compra original.
  - **Auditoría de Contingencia:** Exige ingresar el motivo de la contingencia (ej. falla eléctrica, desperfecto de proyector, fuerza mayor) y observaciones del operador.
  - **Sin Sobrecosto:** Libera los asientos antiguos y bloquea los nuevos sin generar cobro adicional ni alterar la numeración de la Orden de compra original.

### 7. Programación de Funciones y Margen de Limpieza (Admin)
- **Margen de Limpieza Obligatorio (30 Minutos):**
  - Cada función ocupa en la sala un bloque ininterrumpido:  
    `Hora Inicio + Duración de la Película + 30 minutos de limpieza obligatoria`.
- **Detección Estricta de Colisiones:** El sistema impide agendar o mover una función en una sala si se solapa con el bloque de otra proyección existente.
- **Validación de Formatos por Sala:** Una película solo puede programarse en formatos que la sala tenga explícitamente habilitados en su configuración de mantenimiento.

### 8. Mantenimiento y Edición de Salas (Admin)
- **Patrón de Borrador en Memoria:** Cualquier ajuste a la estructura, número de filas/columnas o estado de butacas se realiza en un borrador temporal; no se persiste en almacenamiento hasta pulsar "Guardar Cambios".
- **Blindaje de Ventas Futuras:** El sistema Advierte si se intenta convertir en pasadizo o poner en mantenimiento butacas que ya tengan tickets vendidos para funciones futuras, si se confirma de todas formas la accion, la Orden de compra cambiara a estado `Contingencia` y sera apta para acciones de contingencia por el counter.

### 9. Facturación y Comprobantes Electrónicos
- **Descuentos Comerciales:** Cupones promocionales con descuento porcentual del 1% al 100% (ej. `VERANO20`).
- **Comprobantes Emitibles:**
  - *Boleta Electrónica:* Exige ingresar DNI válido (8 dígitos).
  - *Factura Electrónica:* Exige ingresar RUC válido (11 dígitos).
- **Desglose Contable:** Cálculo automático de Subtotal (valor venta sin impuestos) e IGV (18% según normativa peruana, calculado como `Total / 1.18`).
- **Ticket Impreso/PDF:** Descarga de ticket digital con ancho estandarizado de 95mm para impresoras térmicas de punto de venta.

### 10. Seguridad, Integridad y Gestión de Personal (Admin > Personal)
- Cuatro roles estrictos en el sistema: `'cliente'`, `'counter'`, `'admin_general'` y `'admin_sede'`.
- Creación de cuentas de personal exige DNI (8 dígitos) y Teléfono (9 dígitos) para trazabilidad.
- **Reglas de Integridad del Personal:**
  - Ningún usuario puede eliminarse, desactivarse ni cambiar su propio rol.
  - Siempre debe permanecer activo al menos un administrador en el sistema.
  - Si un administrador desactiva o degrada a un usuario, su sesión activa en cualquier otra pestaña se cierra de inmediato mediante un evento reactivo.
---

## Forma de trabajar
- Planificar primero (breve, con archivos a tocar) si el cambio toca BD, RLS, RPC o más de 3 archivos.
- Preguntar ante cualquier duda o recomendacion que veas a lo largo del desarrollo para darte respuesta.
- Cambios pequeños y revisables; una fase o módulo a la vez.
- Cambios pequeños y enfocados; no reescribas lo que ya funciona.
- Al terminar, explicar: qué cambió, por qué, cómo se verificó y qué queda pendiente.
- Cualquier Cambio en la BD en Supabase que hagamos registralo en "supabase/migrations" comentado porfavor.
- Consultar `MEMORY.md` al empezar y actualizarlo al terminar.

## Memoria 
- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales). 

## Límites 
- ✅ Siempre: actualizar `MEMORY.md` al terminar cada tarea. 
- ✅ Siempre: Aprovechar el MCP de supabase para acceder a la base de datos pero solo para consultas basicas y acciones que te apruebe hacer.
- 🚫 **Nunca:** Alterar tablas o la base de datos sin previo aviso argumentado, aunque sea para probar algo, siempre pregunta.
- 🚫 **Nunca:** Cambiar configuraciones de RLS, RPC u otras configuraciones avanzadas sin autorización previa.

## Verificación 
1. Después de cada cambio, verifica con el MCP de Chrome DevTools: Prueba la funcionalidad, revisa en la consola posibles errores.