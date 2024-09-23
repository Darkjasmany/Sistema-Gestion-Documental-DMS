import { Op } from "sequelize";
import { Tarea } from "../models/Tarea.js";

export const agregarTarea = async (req, res) => {
  // console.log(req.body);
  const { asunto, descripcion, numeroTramite, remitente } = req.body;

  // Buscar si el número de trámite ya existe, sin importar mayúsculas/minúsculas
  const tramiteExiste = await Tarea.findOne({
    where: {
      numeroTramite: {
        [Op.iLike]: numeroTramite, // Compara de forma insensible a mayúsculas/minúsculas
      },
    },
  });

  if (tramiteExiste) {
    const error = new Error("Número de Trámite ya Ingresado");
    return res.status(400).json({ msg: error.message });
  }
  // Guardar tramite
  try {
    const tramiteGuardado = await Tarea.create({
      asunto,
      descripcion,
      numeroTramite,
      remitente,
    });
    res.json(tramiteGuardado);
  } catch (error) {
    console.error(`Error al registrar el Trámite: ${error}`);
  }
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
