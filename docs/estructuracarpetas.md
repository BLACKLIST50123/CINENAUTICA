# Estructura del Proyecto CineNáutica

A continuación se detalla la estructura de directorios y archivos principales del proyecto, seguido de la explicación de cada componente para el informe.

## 1. Diagrama de Estructura de Carpetas

```text
cinenautica_next/
├── src/                                  # Código fuente principal de la aplicación
│   ├── app/                              # Rutas, páginas y layouts (Next.js App Router)
│   │   ├── (cliente)/                    # Portal web público y flujo de compra del espectador
│   │   ├── acceso/                       # Vistas de autenticación (login y registro)
│   │   ├── admin_general/                # Panel de administración global de la cadena
│   │   ├── admin_sede/                   # Panel de gestión operativa para administradores de sede
│   │   ├── api/                          # Endpoints del backend (Route Handlers)
│   │   └── counter/                      # Módulo de punto de venta físico (taquilla y dulcería)
│   ├── components/                       # Componentes visuales reutilizables (UI)
│   │   ├── admin_general/                # Tablas y formularios de administración general
│   │   ├── admin_sede/                   # Controles operativos de sede
│   │   ├── cliente/                      # Cartelera, butacas, modales y vista de compra
│   │   └── counter/                      # Interfaz táctil de cobro y despacho en sede
│   ├── context/                          # Estado global de React (manejo de sesión activa)
│   ├── daos/                             # Capa de Acceso a Datos (consultas a Supabase)
│   ├── dtos/                             # Modelos y contratos de datos tipados (TypeScript)
│   ├── lib/                              # Librerías auxiliares y clientes compartidos
│   │   ├── supabase/                     # Clientes de conexión y autenticación de Supabase
│   │   └── ui/                           # Configuración visual, menús y helpers de interfaz
│   └── services/                         # Capa de Lógica de Negocio (reglas y cálculos)
├── supabase/                             # Configuración y base de datos
│   └── migrations/                       # Scripts SQL versionados (tablas, funciones y políticas RLS)
├── .env.local                            # Variables de entorno y credenciales locales (privado)
├── .gitignore                            # Reglas de exclusión para el repositorio Git
├── package.json                          # Dependencias instaladas y scripts de ejecución
└── tsconfig.json                         # Configuración del compilador de TypeScript y alias (@/*)
```

---

## 2. Explicación de Cada Elemento

### 2.1. Archivos Raíz del Proyecto

* **`.env.local`**: Almacena las variables de entorno privadas en el entorno local (claves maestras de Supabase, URLs de API y credenciales de conexión). Nunca se sube al repositorio de control de versiones.
* **`.gitignore`**: Define los patrones de exclusión para Git, asegurando que directorios pesados o sensibles (`node_modules/`, `.next/`, `.env.local`) no sean rastreados ni enviados a GitHub.
* **`package.json`**: Manifiesto del proyecto donde se registran todas las dependencias y librerías utilizadas (Next.js, React, Supabase Client, Vitest, Lucide Icons, etc.), además de los scripts de ejecución como `dev`, `build` y `test`.
* **`tsconfig.json`**: Archivo de configuración de TypeScript que establece el modo estricto de tipado y el alias `@/*` que apunta a `src/*` para simplificar las importaciones en el código.

---

### 2.2. Carpeta `supabase/` (Base de Datos)

Centraliza la infraestructura de datos y control de cambios en la base de datos PostgreSQL alojada en Supabase:

* **`supabase/migrations/`**: Contiene los archivos SQL versionados de migración. Aquí se define la creación de tablas (películas, sedes, funciones, asientos, pedidos, socios), tipos enumerados, funciones almacenadas (*stored procedures*), triggers y políticas de seguridad por fila (*Row Level Security* - RLS).

---

### 2.3. Carpeta `src/` (Código Fuente de la Aplicación)

La aplicación sigue una **arquitectura por capas** desacoplada que separa la presentación, la lógica de negocio, el acceso a datos y los contratos de transferencia:

#### A. `src/app/` (Enrutamiento y Vistas - Next.js App Router)
Controla las rutas web accesibles desde el navegador mediante el sistema de carpetas de Next.js:
* **`(cliente)/`**: Grupo de rutas orientado al usuario final o espectador. Contiene la página principal de cartelera, detalle de sinopsis, selector interactivo de butacas, dulcería en línea, pasarela de pago y perfil del socio.
* **`acceso/`**: Vistas de autenticación unificadas (inicio de sesión y registro) tanto para clientes como para colaboradores del cine.
* **`admin_general/`**: Interfaz de alta dirección encargada de la administración global de toda la cadena de cines (gestión de películas, alta de sedes, promociones globales y reportes consolidados).
* **`admin_sede/`**: Panel administrativo enfocado en la operativa de una sede física específica (programación de funciones, salas, precios locales y control de stock).
* **`counter/`**: Sistema de punto de venta (POS) y caja rápida diseñado para el personal de taquilla física y mostrador de dulcería.
* **`api/`**: Rutas de backend del servidor (*Route Handlers*) para procesamiento de peticiones HTTP, validaciones críticas del lado del servidor o integraciones.

#### B. `src/components/` (Componentes de Interfaz de Usuario)
Elementos modulares de React reutilizables dentro de las páginas, organizados por el área a la que dan servicio:
* **`cliente/`**: Tarjetas de películas, carruseles de estrenos, cuadrículas interactivas de asientos y resúmenes de compra.
* **`counter/`**: Teclados numéricos de venta rápida, modales de cobro en efectivo/tarjeta y listados de despacho.
* **`admin_general/` y `admin_sede/`**: Tablas de datos con paginación, modales de creación/edición, filtros de búsqueda y gráficos de estado.

#### C. `src/context/` (Gestión de Estado Global)
* Mantiene el estado compartido en el navegador sin necesidad de pasar propiedades manualmente de un componente a otro. Destaca el contexto de sesión (`SesionContext.tsx`), que almacena en memoria el usuario autenticado, su rol (cliente, counter, admin de sede, admin general) y la sede asignada.

#### D. `src/services/` (Lógica de Negocio)
Es el núcleo funcional del sistema. Contiene las reglas operativas, cálculos matemáticos y validaciones previas a interactuar con la base de datos (por ejemplo: validación de cupos disponibles, aplicación de descuentos de socio, reglas de compra de entradas y emisión de boletos).

#### E. `src/daos/` (Data Access Objects - Acceso a Datos)
Clases encargadas únicamente de la persistencia de datos. Contienen las consultas directas (SELECT, INSERT, UPDATE, DELETE) hacia las tablas de Supabase/PostgreSQL. Ninguna otra capa interactúa directamente con la base de datos sin pasar por los DAOs.

#### F. `src/dtos/` (Data Transfer Objects - Contratos de Datos)
Definiciones de tipos e interfaces de TypeScript que establecen el formato exacto de los datos intercambiados entre la interfaz de usuario, los servicios y los DAOs. Aseguran la integridad y evitan errores en tiempo de compilación.

#### G. `src/lib/` (Librerías y Utilidades Compartidas)
* **`lib/supabase/`**: Configuración de los clientes oficiales de Supabase (cliente para el navegador, cliente para el servidor con manejo de cookies seguras y helpers de autenticación).
* **`lib/ui/`**: Funciones auxiliares de formato (fechas, monedas en soles PEN), esquemas de navegación y constantes de diseño visual.