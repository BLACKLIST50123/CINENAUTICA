# Plan Maestro MVP: CineNáutica Multisede

## 1. Contexto y Directrices Estrictas para la IA
Migración de un sistema de cine unisede (HTML/JS/Tailwind con `localStorage`) a una plataforma **multisede** real.
- **El código legacy (v1) es SOLO de referencia.** El agente de IA lo leerá para entender el flujo de negocio (compra, asientos, dulcería, reglas de precios), pero el código nuevo se escribirá desde cero en el nuevo stack.
- **Nivel del proyecto:** MVP Universitario. Se prioriza funcionalidad, código limpio, separación de roles y escalabilidad básica sobre infraestructuras empresariales hipercomplejas.

## 2. Stack Tecnológico y Arquitectura
- **Frontend:** Angular (Standalone components, Signals nativos para estado), TypeScript estricto, Tailwind CSS.
- **Backend / BD:** Supabase (PostgreSQL, Auth, Storage, Row Level Security - RLS).
- **Machine Learning:** Script externo en Python (Pandas, Scikit-learn).
- **Arquitectura UI:** Patrón DAO para conexión aislada con Supabase, DTOs para tipado de datos entre BD y Vistas, e inyección de dependencias (SOLID). Componentes "tontos" en la UI y lógica en los servicios.

## 3. Arquitectura de Roles y Diseño de Interfaz (Admin)
La seguridad se maneja en Supabase (RLS), pero la interfaz (UI) de administración se divide estrictamente según el rol.

### 3.1. Interfaz "Super_Admin" (Gestión Global)
Si el usuario es `super_admin`, se renderiza una barra de navegación superior (Macro-tabs) junto al botón "Volver al inicio":

*   🌍 **Gestionar Datos Globales:** Oculta el selector de sedes. Otorga poder CRUD completo sobre el catálogo maestro.
    *   *Pestañas Visibles:* Cartelera, Dulcería, Tarifas, Descuentos, Socios, Personal.
    *   *Pestañas Ocultas:* Horarios, Salas, Dashboard (son de gestión local).
    *   *Lógica:* Puede crear, editar y eliminar. En las tarjetas de películas se oculta el botón "Editar Horarios".
*   🏬 **Gestionar Sede:** Muestra una vista de "Cuadrícula de Sedes". Al elegir una tarjeta, el Super Admin "impersona" a esa sede y su panel se comporta **exactamente como el de un Admin Sede**.
*   📊 **Dashboard Corporativo:** Vista macro con filtros por Región, Ciudad y Fechas.
    *   *KPIs:* Ingresos Totales, Tickets Vendidos, Combos/Dulces Vendidos, Socios Registrados.
    *   *Gráficos:* Ingresos en el tiempo (Líneas/Barras), Distribución Taquilla vs Dulcería (Circular).
    *   *Rankings (Top 5):* Sedes con mayor recaudación, Películas más taquilleras, Productos más vendidos.

### 3.2. Interfaz "Admin_Sede" (Gestión Local)
Su catálogo es de **solo lectura**. El diseño utilizará **Sub-tabs horizontales en la parte superior** de cada sección para evitar modales intrusivos al gestionar catálogos largos.

*   *Pestañas Visibles:* Cartelera, Horarios, Dulcería, Salas, Tarifas, Descuentos, Personal, Dashboard local.
*   **Cartelera:** Oculta el modal de "Nueva Película". Usa 3 Sub-tabs horizontales:
    1. *Películas Globales:* Lista con *toggles* para habilitar/deshabilitar en su sede.
    2. *Películas Activas:* Películas habilitadas para gestión menor.
    3. *Banners Principales:* Selector de películas activas para el carrusel del inicio.
*   **Dulcería:** Oculta modales de "Nueva Categoría/Producto". Usa 2 Sub-tabs horizontales:
    1. *Catálogo Global:* Buscador/filtro y *toggles* para habilitar productos.
    2. *Productos Locales:* Lista habilitada para editar precio local y activar *toggle* de control de stock.
*   **Tarifas:** Edición normal solo para "Tarifa Base por Día". "Formatos" y "Tipos de Entrada" son de solo lectura (sin botones de editar/crear).
*   **Descuentos:** Oculta modal de "Nuevo Cupón". Usa 2 Sub-tabs horizontales: *Cupones Globales* (toggles para activar) y *Cupones Activos*.
*   **Operativa Local (Salas, Horarios, Personal, Dashboard):** Mantienen el diseño estándar, operando estrictamente sobre el `sedeId` actual.

### 3.3. Interfaces Adicionales
*   **Counter:** Empleado de caja de una sede. Vende entradas/dulces y vincula compras a socios.
*   **Cliente (Público):** Pantalla inicial con filtro de Región, Ciudad y Sede para cargar dinámicamente la cartelera.

## 4. Machine Learning Universitario (Fase 5)
Implementación de un modelo predictivo para el Dashboard Global del Super Admin.
- **Enfoque MVP (Desacoplado):** Se desarrollará un script independiente en **Python** (usando `pandas` para limpieza de datos y `scikit-learn` para el modelo). 
- **Flujo:** El script de Python se conectará a PostgreSQL (Supabase), extraerá el histórico de ventas (`orden`, `detalle_entrada`), entrenará una **Regresión Lineal** para proyectar la demanda (asistencia) de los próximos 7 días, y guardará los resultados en la tabla `ml_prediccion`.
- **Angular:** El frontend no ejecuta Machine Learning. Simplemente consumirá la tabla `ml_prediccion` a través de un DAO y mostrará la gráfica de proyección en el Dashboard.

## 5. Fases de Desarrollo Paso a Paso para la IA

*   **Fase 1: Base de Datos.** El usuario ya habrá creado en Supabase el esquema multisede. El agente generará/consumirá los tipos de TypeScript basados en este esquema.
*   **Fase 2: Arquitectura Angular.** Setup de Tailwind, Supabase Client, y estructura de carpetas (DAO, DTO, Mappers, Servicios).
*   **Fase 3: Migración Core (MVP Sede 1).** Construir el flujo de reserva (asientos, carrito, checkout) apuntando a un `sede_id = 1` estático para validar la conexión Angular+Supabase antes de añadir los roles.
*   **Fase 4: Roles y Vistas.** Implementar Guards, Layouts y las interfaces descritas en la Sección 3 (Macro-tabs del Super Admin, Sub-tabs horizontales del Admin Sede, Impersonación).
*   **Fase 5: Dashboard y ML.** Construir las vistas de gráficos en Angular. Posteriormente, se solicitará la creación del script en Python para poblar las predicciones en la base de datos.

## 6. Patrones de Diseño a Implementar
El Agente deberá estructurar el código aplicando los siguientes Patrones de Diseño de Software para asegurar escalabilidad y cumplir con los principios SOLID:

*   **Facade (Fachada):**
    *   *¿Para qué?* Para desacoplar los componentes visuales de la lógica de negocio compleja.
    *   *Aplicación:* Los componentes de Angular solo deben invocar métodos de un `FacadeService`. Este Facade internamente orquestará llamadas a múltiples DAOs y manejará el estado, dejando los componentes de UI limpios.
*   **Strategy (Estrategia):**
    *   *¿Para qué?* Para evitar bloques masivos de `if/else` en lógicas que pueden crecer en el futuro.
    *   *Aplicación:* Ideal para el **cálculo del precio final de la entrada**. Se usarán estrategias intercambiables para calcular el recargo por formato, la tarifa del día y la aplicación de cupones de descuento.
*   **Adapter / Mapper:**
    *   *¿Para qué?* Para proteger el frontend de cambios en la base de datos.
    *   *Aplicación:* Transformar los datos crudos obtenidos de Supabase (en `snake_case`) hacia los DTOs y modelos de negocio en Angular (en `camelCase`).
*   **Observer (Reactividad):**
    *   *¿Para qué?* Para mantener partes del sistema sincronizadas en tiempo real.
    *   *Aplicación:* Se utilizará mediante los **Signals** nativos de Angular para el Carrito de Compras y para el Mapa de Butacas, apoyándose en Supabase Realtime.
*   **Singleton (vía Inyección de Dependencias):**
    *   *¿Para qué?* Para tener instancias únicas de servicios críticos en toda la aplicación.
    *   *Aplicación:* Para el manejo de sesión del usuario (Auth), el contexto de la sede actual (`SedeContextStore`), y la instancia única de conexión a Supabase.