import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Tramite } from "../models/Tramite.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { TramiteAsignacion } from "../models/TramiteAsignacion.model.js";
import { Op } from "sequelize";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";

export const obtenerTramitesPorEstado = async (req, res) => {
  const { estado } = req.query; // envio como parametro adicional en la URL
  // const { estado, limit = 10, offset = 0 } = req.query; // Limitar resultados y offset para paginación
  if (!estado)
    return res.status(400).json({ message: "El estado es requerido" });

  try {
    const config = getConfiguracionPorEstado(estado);
    if (!config)
      return res.status(400).json({
        message: `No se encontró una configuración válida para el estado: ${estado}`,
      });

    const tramites = await Tramite.findAll({
      where: { estado, departamentoUsuarioId: req.usuario.departamentoId },
      attributes: config.attributes,
      include: config.include,
      order: [
        ["prioridad", "ASC"],
        ["createdAt", "ASC"],
      ],
      // limit: parseInt(limit, 10),
      // offset: parseInt(offset, 10),
    });

    res.json(tramites);
  } catch (error) {
    console.error(
      `Error al obtener los trámites con estado: ${estado}: ${error.message}`
    );
    return res.status(500).json({
      message: `Error al obtener los trámites con estado: ${estado}, intente nuevamente más tarde.`,
    });
  }
};

export const obtenerTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const tramiteUsuario = await Tramite.findByPk(id);
    if (!tramiteUsuario)
      return res.status(404).json({ message: "No encontrado" });

    if (
      tramiteUsuario.departamentoUsuarioId.toString() !==
      req.usuario.departamentoId.toString()
    )
      return res.status(403).json({
        message: "Acción no válida",
      });

    res.json(tramiteUsuario);
  } catch (error) {
    console.log(`Error al obtener el trámite seleccionado: ${error.message} `);
    res.status(500).json({
      message:
        "Error al obtener el trámite seleccionado, intente nuevamente más tarde",
    });
  }
};

export const actualizarTramite = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction();

  try {
    const { id } = req.params;

    const {
      asunto,
      descripcion,
      departamentoRemitenteId,
      remitenteId,
      prioridad,
      fechaDocumento,
      referenciaTramite,
      numeroOficioDespacho,
      departamentoDestinatarioId,
      destinatarioId,
      fechaMaximaContestacion,
      usuarioRevisorId,
      observacionRevisor,
      numeroTramiteModificado,
    } = req.body;

    if (
      !asunto ||
      !descripcion ||
      !departamentoRemitenteId ||
      !remitenteId ||
      !fechaDocumento ||
      !fechaMaximaContestacion
    ) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Buscar el trámite por ID
    const tramiteActualizar = await Tramite.findByPk(id);
    if (!tramiteActualizar) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

    // Validación de permisos de actualización
    if (
      tramiteActualizar.departamentoUsuarioId.toString() !==
      req.usuario.departamentoId.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({
        message: "Acción no válida",
      });
    }

    // Realizar consultas de validaciones en paralelo
    const [
      departamentoRemitente,
      remitenteExiste,
      departamentoDestinatario,
      destinatarioExiste,
      tramiteModificadoExiste,
      tramiteDespachoExiste,
    ] = await Promise.all([
      Departamento.findByPk(departamentoRemitenteId),
      Empleado.findOne({
        where: { id: remitenteId, departamentoId: departamentoRemitenteId },
      }),
      Departamento.findByPk(departamentoDestinatarioId),
      Empleado.findOne({
        where: {
          id: destinatarioId,
          departamentoId: departamentoDestinatarioId,
        },
      }),
      Tramite.findOne({
        where: {
          [Op.or]: [
            numeroTramiteModificado
              ? { numeroTramite: numeroTramiteModificado }
              : {},
            numeroTramiteModificado
              ? { numeroTramiteModificado: numeroTramiteModificado }
              : {},
          ],
          id: { [Op.ne]: id },
        },
      }),
      Tramite.findOne({
        where: {
          numeroOficioDespacho: { [Op.like]: numeroOficioDespacho },
          id: { [Op.ne]: id },
        },
      }),
    ]);

    // Validación de existencia de departamento remitente y destinatario
    if (!departamentoRemitente) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Departamento del remitente no encontrado" });
    }

    if (!remitenteExiste) {
      await transaction.rollback();
      return res.status(400).json({
        message: "No existe el remitente o no está asignado a ese departamento",
      });
    }

    if (!departamentoDestinatario) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Departamento del destinatario no encontrado" });
    }

    if (!destinatarioExiste) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "No existe el destinatario o no está asignado a ese departamento",
      });
    }

    // Validación de números duplicados de trámite y despacho
    if (tramiteModificadoExiste) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Número de Trámite ya Ingresado" });
    }

    if (tramiteDespachoExiste) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Número de Despacho ya Ingresado" });
    }

    // Actualizar los datos
    tramiteActualizar.asunto = asunto || tramiteActualizar.asunto;
    tramiteActualizar.descripcion =
      descripcion || tramiteActualizar.descripcion;
    tramiteActualizar.departamentoRemitenteId =
      departamentoRemitenteId || tramiteActualizar.departamentoRemitenteId;
    tramiteActualizar.remitenteId =
      remitenteId || tramiteActualizar.remitenteId;
    tramiteActualizar.prioridad = prioridad || tramiteActualizar.prioridad;
    tramiteActualizar.fechaDocumento =
      fechaDocumento || tramiteActualizar.fechaDocumento;
    tramiteActualizar.referenciaTramite =
      referenciaTramite || tramiteActualizar.referenciaTramite;
    tramiteActualizar.numeroOficioDespacho =
      numeroOficioDespacho || tramiteActualizar.numeroOficioDespacho;
    tramiteActualizar.departamentoDestinatarioId =
      departamentoDestinatarioId ||
      tramiteActualizar.departamentoDestinatarioId;
    tramiteActualizar.destinatarioId =
      destinatarioId || tramiteActualizar.destinatarioId;
    tramiteActualizar.fechaMaximaContestacion =
      fechaMaximaContestacion || tramiteActualizar.fechaMaximaContestacion;
    tramiteActualizar.numeroTramiteModificado =
      numeroTramiteModificado || tramiteActualizar.numeroTramiteModificado;

    // Asignar usuario revisor si está presente
    if (usuarioRevisorId) {
      const existeUsuarioRevisor = await Usuario.findOne({
        where: {
          id: usuarioRevisorId,
          departamentoId: req.usuario.departamentoId,
          rol: "REVISOR",
        },
      });
      if (!existeUsuarioRevisor) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "Usuario Revisor no encontrado" });
      }

      await TramiteAsignacion.create({
        tramiteId: id,
        usuarioRevisorId: usuarioRevisorId,
        descripcion: observacionRevisor,
      });

      tramiteActualizar.estado = "PENDIENTE";
    }

    await tramiteActualizar.save();

    await transaction.commit();

    res.status(200).json(tramiteActualizar);
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al actualizar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al actualizar el trámite.",
    });
  }
};

export const eliminarTramite = async (req, res) => {
  res.send("Desde eliminarTramite");
};
