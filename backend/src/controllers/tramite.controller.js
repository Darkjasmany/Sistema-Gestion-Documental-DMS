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
    referenciaTramite,
    prioridad,
  } = req.body;

  if (
    !departamentoRemitenteId ||
    !remitenteId ||
    !asunto ||
    !descripcion ||
    !numeroTramite
  )
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

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
      referenciaTramite,
      prioridad: prioridad || undefined,
      usuarioCreacionId: req.usuario.id,
      departamentoUsuarioId: req.usuario.departamentoId,
    });

    res.json(tramiteGuardado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listarTramitesUsuario = async (req, res) => {
  try {
    const tramites = await Tramite.findAll({
      where: { usuarioCreacionId: req.usuario.id, estado: "INGRESADO" },
      attributes: ["numeroTramite", "asunto", "descripcion", "prioridad"],
      include: [
        {
          model: Departamento,
          as: "departamentoRemitente", // Alias
          attributes: ["nombre"], // Atributos del departamento remitente
        },
        {
          model: Empleado,
          as: "remitente", // Alias
          attributes: ["nombres", "apellidos", "cedula"], // Atributos del remitente
        },
      ],
    });

    res.json(tramites);
  } catch (error) {
    console.error(
      `Error al obtener las trámites del usuario : ${error.message}`
    );
    return res.status(500).json({
      message:
        "Error al obtener las trámites del usuario, intente nuevamente más tarde.",
    });
  }
};

export const obtenerTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findByPk(id);
    if (!tramite) return res.status(404).json({ message: "No encontrado" });

    res.json(tramite);
  } catch (error) {
    console.error(`Error al obtener la tarea seleccionada: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener la tarea seleccionada, intente nuevamente más tarde.",
    });
  }
};

export const actualizarTramite = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction(); // Inicia la transacción

  try {
    const { id } = req.params;

    const {
      departamentoRemitenteId,
      remitenteId,
      asunto,
      descripcion,
      numeroTramite,
      referenciaTramite,
      prioridad,
    } = req.body;

    if (
      !departamentoRemitenteId ||
      !remitenteId ||
      !asunto ||
      !descripcion ||
      !numeroTramite
    ) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const tramiteActualizado = await Tramite.findByPk(id, { transaction });
    if (!tramiteActualizado) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

    if (
      tramiteActualizado.usuarioCreacionId.toString() !==
      req.usuario.id.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({ msg: "Acción no válida" });
    }

    const departamentoExiste = await Departamento.findByPk(
      departamentoRemitenteId
    );
    if (!departamentoExiste) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Departamento del remitente no encontrado" });
    }

    const remitenteExiste = await Empleado.findOne({
      where: {
        id: remitenteId,
        departamentoId: departamentoRemitenteId,
      },
    });
    if (!remitenteExiste) {
      await transaction.rollback();
      return res.status(400).json({
        message: "No existe ese empleado o no está asignado a ese departamento",
      });
    }

    const tramiteExiste = await Tramite.findOne({
      where: {
        numeroTramite: {
          [Op.iLike]: numeroTramite, // Compara de forma insensible a mayúsculas/minúsculas
        },
        id: {
          [Op.ne]: id, // Excluir el trámite que se está actualizando
        },
      },
    });
    if (tramiteExiste) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Número de Trámite ya Ingresado" });
    }

    // Actualización de los campos del trámite
    tramiteActualizado.departamentoRemitenteId = departamentoRemitenteId;
    tramiteActualizado.remitenteId = remitenteId;
    tramiteActualizado.asunto = asunto;
    tramiteActualizado.descripcion = descripcion;
    tramiteActualizado.numeroTramite = numeroTramite;
    tramiteActualizado.referenciaTramite =
      referenciaTramite || tramiteActualizado.referenciaTramite;
    tramiteActualizado.prioridad = prioridad || tramiteActualizado.prioridad;

    // Guardar cambios dentro de la transacción
    await tramiteActualizado.save({ transaction });

    // Confirmar la transacción
    await transaction.commit();

    res.status(200).json(tramiteActualizado);
  } catch (error) {
    await transaction.rollback(); // Deshacer transacción en caso de error
    console.error(`Error al actualizar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al actualizar el trámite.",
    });
  }
};

export const eliminarTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findByPk(id);
    if (!tramite)
      return res.status(404).json({ message: "Trámite no encontrado" });

    if (tramite.usuarioCreacionId.toString() !== req.usuario.id.toString())
      return res.status(403).json({ msg: "Acción no válida" });

    // Metodo para buscar y eliminar al mismo tiempo
    await Tramite.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Tramite eliminado" });
  } catch (error) {
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar el trámite.",
    });
  }
};
