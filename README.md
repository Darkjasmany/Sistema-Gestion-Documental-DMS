# Sistema de Gestión Documental (DMS)

Este proyecto es un sistema de gestión documental desarrollado con Node.js para el backend y React con TailwindCSS para el frontend.

## 📂 Backend

### 🚀 Instalación y Ejecución

1. Clona el repositorio:
   ```sh
   git clone https://github.com/Darkjasmany/Sistema-Gestion-Documental-DMS.git
   cd Sistema-Gestion-Documental-DMS/backend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```sh
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_secret_key
   ```
4. Ejecuta en modo desarrollo:
   ```sh
   npm run dev
   ```
5. Para producción, usa:
   ```sh
   npm start
   ```

### 📦 Dependencias y Uso

- `express`: Framework para manejar rutas y middleware.
- `sequelize`: ORM para manejar la base de datos.
- `bcryptjs`: Para encriptar contraseñas.
- `jsonwebtoken`: Para autenticación basada en tokens.
- `dotenv`: Manejo de variables de entorno.
- `multer`: Para la gestión de archivos.

## 🎨 Frontend

### 🚀 Instalación y Ejecución

1. Ve a la carpeta del frontend:
   ```sh
   cd ../frontend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```sh
   VITE_API_URL=http://localhost:5000
   ```
4. Ejecuta en modo desarrollo:
   ```sh
   npm run dev
   ```

### 📦 Dependencias y Uso

- `react`: Librería principal para la interfaz de usuario.
- `react-router-dom`: Manejo de rutas en la aplicación.
- `axios`: Para hacer peticiones HTTP al backend.
- `tailwindcss`: Para el diseño y estilos.
- `exceljs` `file-saver`: Para exportar a Excel.
- `jspdf` `jspdf-autotable`: Para exportar a PDF.

---

💡 **Notas**: Asegúrate de que el backend esté corriendo antes de iniciar el frontend. ¡Listo para desarrollar! 🚀

