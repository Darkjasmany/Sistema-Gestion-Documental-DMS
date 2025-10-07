# Frontend - Gestión Documental

Este es el frontend de la aplicación de **Gestión Documental**, desarrollado con **React** y **TailwindCSS**.

## Tecnologías utilizadas

- **React**: Librería para la construcción de interfaces de usuario.
- **TailwindCSS**: Framework CSS para diseño responsivo y personalizable.
- **Axios**: Cliente HTTP para interactuar con la API.
- **React Router**: Para manejar la navegación dentro de la aplicación.

## Instalación

1. Clona este repositorio.
   ```bash
   git clone https://github.com/Darkjasmany/Sistema-Gestion-Documental-DMS.git

2. Navega a la carpeta front
   ```bash
   cd frontend
3. Intala las dependencias
   ```bash
   npm install
4. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
5. Para producción, usa:
   ```bash
   npm start

La aplicación estará disponible en http://localhost:3000

frontend/
│
├── public/           # Archivos estáticos (favicon, index.html, etc.)
├── src/              # Archivos fuente
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Páginas de la aplicación
│   ├── utils/        # Funciones y configuraciones auxiliares
│   ├── App.js        # Componente principal de la aplicación
│   └── index.js      # Entrada de la aplicación React
└── tailwind.config.js # Configuración de TailwindCSS

## Funcionalidades principales

Vista de Trámites: Permite a los usuarios ver los trámites asignados, crear nuevos trámites y ver el estado de los mismos.

Autenticación: Los usuarios pueden registrarse e iniciar sesión para acceder a la plataforma.

Interacción con Backend: Todos los datos son gestionados por la API del backend, usando Axios para las solicitudes HTTP.

Comandos útiles

- npm run build: Construye la aplicación para producción.
- npm run lint: Ejecuta el linter para revisar el código.
- npm run test: Ejecuta las pruebas unitarias.