# Credenciales de Usuarios del Sistema (Cine Náutica)

Este documento contiene la relación completa de cuentas activas en la base de datos de Cine Náutica para pruebas de desarrollo, auditoría y control de accesos.

---

## 1. Cuentas de Personal Corporativo (Acceso vía `/acceso`)

Todas las cuentas corporativas comparten la misma contraseña estándar de desarrollo. Al iniciar sesión en `/acceso`, el sistema valida su rol en tiempo real y los redirige de manera segura a sus pantallas de trabajo correspondientes.

> **Contraseña estándar de desarrollo:** `Cinenautica2026!`

| Rol en BD | Nombre | Correo Corporativo | DNI | Destino tras Login | Descripción de Acceso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `admin_general` | Roberto General | `admin@cinenautica.pe` | `10000000` | `/admin_general` | **Super Administrador:** Visión global, sedes, catálogo general y reportes ejecutivos. |
| `admin_sede` | Rosa Medina | `sede@cinenautica.pe` | `10000004` | `/counter` *(Hub)* | **Administrador de Sede:** Acceso al Hub donde elige entre su **Panel de Sede** (`/admin_sede`) o las **3 Cajas POS**. |
| `counter_boleteria` | Ana Boletería | `boleteria@cinenautica.pe` | `10000001` | `/counter/boleteria` | **Taquilla Exclusiva:** Selección de sala, funciones y emisión de entradas de cine. |
| `counter_dulceria` | Carlos Dulcería | `dulceria@cinenautica.pe` | `10000002` | `/counter/dulceria` | **Candy Bar:** Venta rápida de snacks, combos, pop corn y bebidas con ticket térmico. |
| `counter_mixto` | Marcos Caja Mixta | `mixto@cinenautica.pe` | `10000003` | `/counter/mixto` | **Punto de Venta Integral:** Venta combinada de entradas y dulcería en una sola orden. |

---

## 2. Hub Exclusivo del Administrador de Sede (`/counter`)

El rol `admin_sede` cuenta con una terminal unificada de supervisión en `/counter` que le permite:
1. **Acceder al Panel de Gestión de Sede (`/admin_sede`):** Para modificar precios, cartelera, salas, personal y contingencias locales.
2. **Supervisar / Operar cualquiera de las 3 Cajas POS:**
   - 🎟️ *Counter Boletería* (`/counter/boleteria`)
   - 🍿 *Counter Dulcería* (`/counter/dulceria`)
   - 💳 *Counter Mixto* (`/counter/mixto`)
3. **Alternar de Sede Operativa:** Selector dinámico conectado a la tabla `sede` de la BD (Megaplaza Chimbote, Plaza Mayor Nuevo Chimbote, Jockey Plaza Lima).

> *Nota:* El rol `admin_general` **NO** usa este Hub, ya que administra a nivel multisistema desde `/admin_general`.

---

## 3. Cuentas de Clientes / Socios Náutica (Acceso vía Web `/`)

Estas cuentas corresponden a usuarios finales web. Pueden iniciar sesión desde el botón "Ingresar" del Navbar para acumular puntos, canjear beneficios y consultar su historial.

> ⚠️ **Regla de Seguridad:** Si una cuenta de tipo `cliente` intenta ingresar por la puerta de personal `/acceso`, el sistema **rechazará el acceso** y mostrará una alerta indicando que ese portal es exclusivo para colaboradores.

| Nombre | Correo | DNI / Teléfono | Nivel Socio | Puntos Náutica | Código Socio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Luis Rodríguez | `luis@gmail.com` | `60123456` / `912345678` | **Plata** | 1,420 pts | `CIN-PLATA01` |
| Erick Mendiz | `erickkleider@gmail.com` | No asignado | **Bronce** | 0 pts | `CIN-BRONC01` |
| Jose Martines | `jose@gmail.com` | No asignado | **Bronce** | 0 pts | `CIN-BRONC02` |
| Pedro Torres | `pedro@gmail.com` | No asignado | **Bronce** | 0 pts | `CIN-BRONC03` |

---

## 4. Sedes Registradas en Base de Datos

| ID Sede | Código | Nombre Comercial | Dirección | Serie Boleta | Serie Factura |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `CHI-01` | CineNáutica Chimbote | Megaplaza Chimbote | `B001` | `F001` |
| `2` | `NCH-01` | CineNáutica Nvo Chimbote | Plaza Mayor Nvo Chimbote | `B002` | `F002` |
| `3` | `LIM-01` | CineNáutica Lima | Jockey Plaza | `B003` | `F003` |
