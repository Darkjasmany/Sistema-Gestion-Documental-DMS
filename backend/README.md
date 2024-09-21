# Sincronización del modelo
User.sync()- Esto crea la tabla si no existe (y no hace nada si ya existe)

User.sync({ force: true })- Esto crea la mesa, dejándola primero si ya existía

User.sync({ alter: true })- Esto comprueba cuál es el estado actual de la tabla en la base de datos (que las columnas tiene, cuáles son sus tipos de datos, etc.), y luego realiza los cambios necesarios en la tabla para que coincido con el modelo.
