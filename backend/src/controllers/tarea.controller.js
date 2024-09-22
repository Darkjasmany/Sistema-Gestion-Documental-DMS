import { Tarea } from "../models/Tarea.js";

export const agregarTarea = (req, res) => {
  res.send("Nueva Tarea");
};

export const obtenerTareas = (req, res) => {
  res.send("Obteniendo Tareas");
};

export const obtenerTarea = (req, res) => {
  res.send("Obtener Tarea");
};

export const actualizarTarea = (req, res) => {
  res.send("Actualiza Tarea");
};

export const eliminarTarea = (req, res) => {
  res.send("eliminar Tarea");
};
