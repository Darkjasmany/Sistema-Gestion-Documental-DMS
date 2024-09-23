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
