import { Op } from "sequelize";
import { Tarea } from "../models/Tarea.js";

export const agregarTarea = async (req, res) => {
  // console.log(req.body);
  const { asunto, descripcion, numeroTramite, remitente, usuarioId } = req.body;

  // Buscar por campos metodo findOne. Buscar si el número de trámite ya existe, sin importar mayúsculas/minúsculas
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
      usuarioId,
    });
    res.json(tramiteGuardado); // Envio los datos al cliente
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.findAll();
    res.json(tareas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerTareasUsuarios = async (req, res) => {
  try {
    // Consulta filtrando las tareas por usuarioLogueado
    const tareas = await Tarea.findAll({
      where: {
        usuarioId: req.usuarioId,
      },
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerTarea = async (req, res) => {
  console.log(req.params); // obtener lo que se envia por la URL
  const { id } = req.params;

  const tarea = await Tarea.findOne({
    where: {
      id,
    },
  });

  // const { usuarioId } = req.body;
  // // const tareas = await Tarea.findAll(); // Todas las tareas
  // const tareas = await Tarea.findAll({
  //   where: {
  //     // usuarioId: usuarioId,
  //     usuarioId,
  //   },
  // }); // Todas las tareas de 1 usuario en especifico

  res.send("Obtener Tarea");
};

export const actualizarTarea = (req, res) => {
  const { id } = req.params;
  const { asunto, descripcion, numeroTramite, remitente } = req.body;

  console.log(id);
  console.log(req.body);

  try {
    await Tarea.findByPk()
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.send("Actualiza Tarea");
};

export const eliminarTarea = async (req, res) => {
  const { id } = req.params; // obtener ID que se envia por la URL
  const tarea = await Tarea.findByPk(id); // Busco la tarea en la BD por el id que se envia en la URL

  if (!tarea) {
    // Si la tarea no existe, devolvemos un error 404
    return res.status(404).json({ message: "No Encontrado" });
  }
  /*
  // Verificamos si la tarea pertenece al usuario que está intentando eliminarlo
  if (tarea.usuarioId.toString() !== req.usuarioId.toString()) {
    // Si no pertenecen al mismo veterinario, devolvemos un mensaje de acción no válida
    return res.status(403).json({ msg: "Acción no válida" });
  }
*/
  try {
    // Metodo para buscar y eliminar al mismo tiempo
    await Tarea.destroy({
      where: {
        // id: id,
        id,
      },
    });

    res.json({ message: "Tarea Eliminada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
