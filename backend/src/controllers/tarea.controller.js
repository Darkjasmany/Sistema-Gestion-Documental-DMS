// import { Tarea } from "../routes/tarea.routes.js";

const obtenerTareas = (req, res) => {
  res.send("Obteniendo Tareas");
};

const agregarTarea = (req, res) => {
  res.send("Nueva Tareas");
};

export { obtenerTareas, agregarTarea };
