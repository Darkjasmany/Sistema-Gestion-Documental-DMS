import { Op } from "sequelize";
import { Tarea } from "../models/Tarea.js";

export const agregarTarea = async (req, res) => {
  // console.log(req.body);
  const { asunto, descripcion, numeroTramite, remitente, usuario_id } =
    req.body;

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
    return res.status(400).json({ message: error.message });
  }
  // Guardar tramite
  try {
    const tramiteGuardado = await Tarea.create({
      asunto,
      descripcion,
      numeroTramite,
      remitente,
      usuario_id,
    });
    res.json(tramiteGuardado); // Envio los datos al cliente
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const obtenerTareas = async (req, res) => {
  try {
    const { usuario_id } = req.body;
    // const tareas = await Tarea.findAll(); // Todas las tareas
    const tareas = await Tarea.find().where("usuario_id").equals(usuario_id);
    res.json(tareas);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
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
