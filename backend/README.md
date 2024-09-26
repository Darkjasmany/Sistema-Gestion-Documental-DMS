# Explicacion de las carpetas y archivos 
/my-project
│
├── /src
│   ├── /config
│   │   └── db.js               # Configuración de la base de datos (conexión)
│   │
│   ├── /controllers
│   │   └── usuario.controller.js  # Controlador para usuarios
│   │   └── tarea.controller.js    # Controlador para tareas
│   │
│   ├── /middlewares
│   │   └── auth.middleware.js     # Middleware de autenticación
│   │   └── error.middleware.js    # Middleware para manejo de errores
│   │
│   ├── /models
│   │   └── Usuario.model.js       # Modelo de Usuario
│   │   └── Tarea.model.js         # Modelo de Tarea
│   │
│   ├── /routes
│   │   └── usuario.routes.js      # Rutas para usuarios
│   │   └── tarea.routes.js        # Rutas para tareas
│   │
│   ├── /services
│   │   └── usuario.service.js     # Lógica de negocio para usuarios
│   │   └── tarea.service.js       # Lógica de negocio para tareas
│   │
│   ├── /utils
│   │   └── helpers.js             # Funciones de ayuda/utilidades
│   │   └── logger.js              # Función de logging personalizada
│   │
│   ├── /validators
│   │   └── usuario.validator.js   # Validación de datos de usuario
│   │   └── tarea.validator.js     # Validación de datos de tarea
│   │
│   └── app.js                    # Configuración de Express (inicia middleware, rutas)
│
├── /public                        # Archivos estáticos como imágenes, CSS, etc.
│
├── .env                           # Variables de entorno
├── .gitignore                     # Archivos y carpetas a ignorar en Git
├── package.json                   # Información del proyecto y dependencias
├── README.md                      # Descripción del proyecto
└── index.js                       # Punto de entrada principal (conexión a la BD y arranque del servidor)


# Sincronización del modelo
User.sync()- Esto crea la tabla si no existe (y no hace nada si ya existe)

User.sync({ force: true })- Esto crea la tabla, dejándola primero si ya existía

User.sync({ alter: true })- Esto comprueba cuál es el estado actual de la tabla en la base de datos (que las columnas tiene, cuáles son sus tipos de datos, etc.), y luego realiza los cambios necesarios en la tabla para que coincido con el modelo.

# Errores
400 Petición mala
500 Internal Server Error

https://developer.mozilla.org/es/docs/Web/HTTP/Status

# Códigos de estado de respuesta HTTP

Los códigos de estado de respuesta HTTP indican si se ha completado satisfactoriamente una solicitud HTTP específica. Las respuestas se agrupan en cinco clases:

    - Respuestas informativas (100–199),
    - Respuestas satisfactorias (200–299),
    - Redirecciones (300–399),
    - Errores de los clientes (400–499),
    - Errores de los servidores (500–599).

