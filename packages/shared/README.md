# 📦 @selnic/shared

Este paquete contiene el código y las definiciones que son **compartidas y reutilizables** entre todas las aplicaciones del monorepo (`@selnic/backend` y `@selnic/frontend`).

Su propósito principal es establecer una **fuente única de verdad (Single Source of Truth)** para los tipos y las reglas de validación de datos.

## 🎯 Propósito y Uso

1.  **Validación de Schemas (Zod):** Contiene todas las definiciones de _schemas_ Zod (por ejemplo, `CreateUserInput`). Esto garantiza que los datos enviados por el frontend y los datos recibidos por el backend se adhieran exactamente a las mismas reglas de negocio.
2.  **Tipado Global (TypeScript):** Exporta todos los tipos e _interfaces_ esenciales derivados de los _schemas_ Zod, asegurando una compatibilidad estricta entre todas las capas.

## ➡️ Documentación Completa

Para la instalación, comandos de _build_ y la guía de ejecución del monorepo, por favor, consulta el **[README.md principal de SelNic](../../README.md)**.
