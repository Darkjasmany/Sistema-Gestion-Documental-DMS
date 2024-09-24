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

  if (tramiteExiste)
    return res.status(400).json({ message: "Número de Trámite ya Ingresado" });

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

export const obtenerAllTareas = async (req, res) => {
  try {
    const tareas = await Tarea.findAll();
    res.json(tareas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerTareas = async (req, res) => {
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
  try {
    const { id } = req.params;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) return res.status(404).json({ message: "No encontrado" });

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      asunto,
      descripcion,
      numeroTramite,
      remitente,
      departamenteRemitente,
      referenciaTramite,
    } = req.body;

    // Obtenemos 1 objeto de la consulta
    const tareaActualizada = await Tarea.findByPk(id);

    if (!tareaActualizada)
      return res.status(404).json({ message: "No encontrado" });

    /*
  // Verificamos si la tarea pertenece al usuario que está intentando eliminarlo
  if (tarea.usuarioId.toString() !== req.usuarioId.toString()) {
    // Si no pertenecen al mismo veterinario, devolvemos un mensaje de acción no válida
    return res.status(403).json({ msg: "Acción no válida" });
  }
*/

    // Actualizamos los datos del objeto
    tareaActualizada.asunto = asunto || tareaActualizada.asunto;
    tareaActualizada.descripcion = descripcion || tareaActualizada.descripcion;
    tareaActualizada.numeroTramite =
      numeroTramite || tareaActualizada.numeroTramite;
    tareaActualizada.remitente = remitente || tareaActualizada.remitente;
    tareaActualizada.departamenteRemitente =
      departamenteRemitente || tareaActualizada.departamenteRemitente;
    tareaActualizada.referenciaTramite =
      referenciaTramite || tareaActualizada.referenciaTramite;

    // Guardamos los datos actualizados del objeto
    await tareaActualizada.save();
    res.status(200).json(tareaActualizada);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const eliminarTarea = async (req, res) => {
  const { id } = req.params; // obtener ID que se envia por la URL
  const tarea = await Tarea.findByPk(id); // Busco la tarea en la BD por el id que se envia en la URL

  // Si la tarea no existe, devolvemos un error 404
  if (!tarea) return res.status(404).json({ message: "No Encontrado" });
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

    res.status(200).json({ message: "Tarea Eliminada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
