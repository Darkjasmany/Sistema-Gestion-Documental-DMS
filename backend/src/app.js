import express from "express";
import cors from "cors"; // Proteger una API para evitar que los datos no se consuman de alguien que no sabemos

// Import routes
import usuarioRoutes from "./routes/usuario.routes.js";
import tramiteRoutes from "./routes/tramite.routes.js";
import empleadoRoutes from "./routes/empleado.routes.js";
import departamentoRoutes from "./routes/departamento.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

const dominiosPermitidos = [process.env.FRONTEND_URL, "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    //origin : URL de la peticion que esta realizando a la API, -1 no lo encontro

    // Permitir solicitudes sin origen (por ejemplo, Postman) o si el origen está en la lista de permitidos
    if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
      //Esta es para que solo permita 1 dominio
      // if (dominiosPermitidos.indexOf(origin) !== -1) {
      // El Origen del Request esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

// Middleware
app.use(cors(corsOptions)); // Habilita CORS para todas las rutas
app.use(express.json());

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tramites", tramiteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/admin", adminRoutes);
/*
// Middleware para manejo de errores
app.use(notFound); // Manejar rutas no encontradas
app.use(errorHandler); // Manejar errores de la aplicación
*/
export default app;
