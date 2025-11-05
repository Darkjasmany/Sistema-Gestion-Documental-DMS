# 🚀 SelNic: Sistema Estratégico para la Logística y la Gestión de Negocios Inteligentes

Este proyecto es un **Monorepo** que consolida todas las aplicaciones y paquetes de la plataforma SelNic. Está construido sobre una arquitectura moderna y eficiente, utilizando **pnpm** para la gestión de dependencias y **Turborepo** para la optimización de tareas y el _caching_.

## ⚙️ Arquitectura del Monorepo

| Componente        | Carpeta           | Tecnologías Clave                                       | Descripción                                                                                            |
| :---------------- | :---------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------------------------- |
| **Monorepo Root** | `./`              | **pnpm**, **Turborepo**, **TypeScript**                 | Configuración centralizada de dependencias, scripts de _build_ y automatización.                       |
| **Backend API**   | `apps/backend`    | **Node.js**, **Express**, **Sequelize**, **Zod**        | Servidor API REST, lógica de negocio y ORM para PostgreSQL. Utiliza `tsx` para desarrollo en caliente. |
| **Frontend Web**  | `apps/frontend`   | **React**, **Vite**, **TailwindCSS**, **Redux Toolkit** | Interfaz de usuario, gestión de estado y experiencia web.                                              |
| **Shared Code**   | `packages/shared` | **TypeScript**, **Zod**                                 | Código reutilizable: **Esquemas de Validación (Zod)** y Tipos de Datos.                                |

---

## 🛠️ Guía de Instalación y Ejecución

Todos los comandos deben ejecutarse desde la **raíz** del monorepo (`SelNic`) utilizando **pnpm**.

### 1. Pre-requisitos

- **Node.js:** Versión 18.x o superior.
- **pnpm:** Asegúrate de tenerlo instalado globalmente (`npm install -g pnpm`).
- **Base de Datos:** PostgreSQL para la persistencia de datos.

### 2. Instalación Inicial

1.  Clonar el repositorio y navegar a la carpeta:
    ```bash
    git clone [https://github.com/Darkjasmany/SelNic.git](https://github.com/Darkjasmany/SelNic.git)
    cd SelNic
    ```
2.  Instalar todas las dependencias y configurar los _symlinks_ de `workspace:*`:
    ```bash
    pnpm install
    ```

### 3. Configuración de Entorno

Crea un archivo **`.env`** en la **raíz** del monorepo (`SelNic/`) y configura las variables de entorno necesarias para el backend (conexión a DB, secretos JWT, etc.).

---

## 💻 Comandos de Desarrollo y Tareas

Utilizamos **`turbo`** para ejecutar tareas de forma optimizada y en paralelo.

| Comando                 | Tarea de Turborepo                        | Descripción                                                                                  |
| :---------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------- |
| `pnpm **dev**`          | `turbo run dev`                           | Inicia **Backend** y **Frontend** simultáneamente en modo _watch_.                           |
| `pnpm **dev:backend**`  | `turbo run dev --filter=@selnic/backend`  | Inicia el backend en desarrollo con **`tsx`** (lectura de archivos TypeScript directamente). |
| `pnpm **dev:frontend**` | `turbo run dev --filter=@selnic/frontend` | Inicia el frontend con **`Vite`** en modo desarrollo.                                        |
| `pnpm **build**`        | `turbo run build`                         | Compila todos los proyectos para producción. (Compila `shared` -> `backend` -> `frontend`).  |
| `pnpm **type-check**`   | `turbo run type-check`                    | Ejecuta la verificación de tipos (`tsc --noEmit`) en todo el monorepo.                       |
| `pnpm **lint**`         | `turbo run lint`                          | Ejecuta el linter en todos los paquetes y aplicaciones.                                      |
| `pnpm **clean**`        | `turbo run clean`                         | Elimina las carpetas `node_modules` y `dist` de todos los paquetes.                          |

---

## 📦 Detalle de Dependencias Clave por Paquete

### `@selnic/shared` (packages/shared)

| Dependencia | Uso                                                                                   |
| :---------- | :------------------------------------------------------------------------------------ |
| `zod`       | **Validación de Schemas** para asegurar la integridad de los datos de entrada/salida. |

### `@selnic/backend` (apps/backend)

| Dependencia                 | Uso                                                            |
| :-------------------------- | :------------------------------------------------------------- |
| `@selnic/shared`            | Tipos y validación de _request body_.                          |
| `express`, `cors`, `morgan` | Servidor web y middleware.                                     |
| `sequelize`, `pg`           | ORM para la base de datos PostgreSQL.                          |
| `bcryptjs`, `jsonwebtoken`  | Autenticación y manejo de tokens.                              |
| `multer`, `nodemailer`      | Gestión de subida de archivos y envío de correos electrónicos. |

### `@selnic/frontend` (apps/frontend)

| Dependencia                              | Uso                                                             |
| :--------------------------------------- | :-------------------------------------------------------------- |
| `@selnic/shared`                         | Tipado de respuestas del servidor y esquemas de formularios.    |
| `react`, `react-router-dom`              | Interfaz de usuario y navegación.                               |
| `@reduxjs/toolkit`, `react-redux`        | Gestión de estado global.                                       |
| `@tanstack/react-query`                  | Gestión eficiente de datos asíncronos y _caching_ del servidor. |
| `react-hook-form`, `@hookform/resolvers` | Gestión de formularios y validación avanzada con Zod.           |
| `tailwindcss`, `vite`                    | Estilos y herramienta de _build_.                               |
