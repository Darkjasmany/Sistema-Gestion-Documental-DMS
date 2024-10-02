import { Op } from "sequelize";
import { Tramite } from "../models/Tramite.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Departamento } from "../models/Departamento.model.js";

export const agregarTramite = async (req, res) => {
  const {
    departamentoRemitenteId,
    remitenteId,
    asunto,
    descripcion,
    numeroTramite,
  } = req.body;

  const departamentoExiste = await Departamento.findByPk(
    departamentoRemitenteId
  );
  if (!departamentoExiste)
    return res
      .status(400)
      .json({ message: "Departamento del remitente no encontrado" });

  const empleadoExiste = await Empleado.findOne({
    where: {
      id: remitenteId,
      departamentoId: departamentoRemitenteId,
    },
  });
  if (!empleadoExiste)
    return res.status(400).json({
      message: "No existe ese empleado o no está asignado a ese departamento",
    });

  const tramiteExiste = await Tramite.findOne({
    where: {
      numeroTramite: {
        [Op.iLike]: numeroTramite, // Compara de forma insensible a mayúsculas/minúsculas
      },
    },
  });
  if (tramiteExiste)
    return res.status(400).json({ message: "Número de Trámite ya Ingresado" });

  try {
    const tramiteGuardado = await Tramite.create({
      numeroTramite,
      departamentoRemitenteId,
      remitenteId,
      asunto,
      descripcion,
      usuarioCreacionId: req.usuario.id,
    });

    res.json(tramiteGuardado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerAllTramites = async (req, res) => {
  try {
    const tramite = await Tramite.findAll();
    res.json(tramite);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findByPk(id);
    if (!tramite) return res.status(404).json({ message: "No encontrado" });

    res.json(tramite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarTramite = async (req, res) => {
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
    const tramiteActualizado = await Tarea.findByPk(id);

    if (!tramiteActualizado)
      return res.status(404).json({ message: "No encontrado" });

    /*
  // Verificamos si la tarea pertenece al usuario que está intentando eliminarlo
  if (tarea.usuarioId.toString() !== req.usuarioId.toString()) {
    // Si no pertenecen al mismo veterinario, devolvemos un mensaje de acción no válida
    return res.status(403).json({ msg: "Acción no válida" });
  }
*/

    // Actualizamos los datos del objeto
    tramiteActualizado.asunto = asunto || tramiteActualizado.asunto;
    tramiteActualizado.descripcion =
      descripcion || tramiteActualizado.descripcion;
    tramiteActualizado.numeroTramite =
      numeroTramite || tramiteActualizado.numeroTramite;
    tramiteActualizado.remitente = remitente || tramiteActualizado.remitente;
    tramiteActualizado.departamenteRemitente =
      departamenteRemitente || tramiteActualizado.departamenteRemitente;
    tramiteActualizado.referenciaTramite =
      referenciaTramite || tramiteActualizado.referenciaTramite;

    // Guardamos los datos actualizados del objeto
    await tramiteActualizado.save();
    res.status(200).json(tramiteActualizado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const eliminarTramite = async (req, res) => {
  const { id } = req.params; // obtener ID que se envia por la URL
  const tramite = await Tramite.findByPk(id); // Busco la tarea en la BD por el id que se envia en la URL

  // Si la tarea no existe, devolvemos un error 404
  if (!tramite) return res.status(404).json({ message: "No Encontrado" });
  /*
  // Verificamos si la tarea pertenece al usuario que está intentando eliminarlo
  if (tarea.usuarioId.toString() !== req.usuarioId.toString()) {
    // Si no pertenecen al mismo veterinario, devolvemos un mensaje de acción no válida
    return res.status(403).json({ msg: "Acción no válida" });
  }
*/
  try {
    // Metodo para buscar y eliminar al mismo tiempo
    await Tramite.destroy({
      where: {
        // id: id,
        id,
      },
    });

    res.status(200).json({ message: "Tramite Eliminada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
