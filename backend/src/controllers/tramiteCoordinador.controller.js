import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Tramite } from "../models/Tramite.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { TramiteAsignacion } from "../models/TramiteAsignacion.model.js";
import { Op, Transaction } from "sequelize";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";
import { registrarHistorialEstado } from "../utils/registrarHistorialEstado.js";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { borrarArchivosTemporales } from "../utils/borrarArchivosTemporales.js";
import { borrarArchivos } from "../utils/borrarArchivos.js";

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
      where: {
        estado,
        departamentoUsuarioId: req.usuario.departamentoId,
        activo: true,
      },
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

    const tramite = await Tramite.findByPk(id);
    if (!tramite) return res.status(404).json({ message: "No encontrado" });

    if (
      tramite.departamentoUsuarioId.toString() !==
      req.usuario.departamentoId.toString()
    )
      return res.status(403).json({
        message: "Acción no válida",
      });

    const archivos = await TramiteArchivo.findAll({
      where: { tramiteId: id },
    });

    res.json({ tramite, archivos });
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

    const estadoAnterior = tramiteActualizar.estado;

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

      await TramiteAsignacion.create(
        {
          tramiteId: id,
          usuarioRevisorId: usuarioRevisorId,
          descripcion: observacionRevisor,
        },
        { transaction }
      );

      //  tramiteActualizar.estado = "PENDIENTE";
    }

    // Guarda el trámite actualizado
    await tramiteActualizar.save({ transaction });

    // Registrar el cambio de estado en el historial
    await registrarHistorialEstado(
      tramiteActualizar.id,
      estadoAnterior,
      tramiteActualizar.estado,
      req.usuario.id,
      transaction // Pasamos la transacción para incluir el registro del historial en ella
    );

    await transaction.commit(); // Confirmar la transacción

    res.status(200).json(tramiteActualizar);
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al actualizar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al actualizar el trámite.",
    });
  }
};

export const subirArchivos = async (req, res) => {
  const { id } = req.params;

  const { estado } = req.query;
  if (!estado) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({ message: "El estado es requerido" });
  }

  const tramite = await Tramite.findOne({ where: { id, estado } });
  if (!tramite) {
    borrarArchivosTemporales(req.files);
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (
    tramite.departamentoUsuarioId.toString() !==
    req.usuario.departamentoId.toString()
  ) {
    borrarArchivosTemporales(req.files);
    return res.status(403).json({
      message: "Acción no válida",
    });
  }

  const archivoExistentes = await TramiteArchivo.findAll({
    where: { tramiteId: id },
  });

  const archivosNuevos = req.files ? req.files.length() : 0;
  if (archivoExistentes.length + archivosNuevos > 6) {
    borrarArchivosTemporales(req.files);
    return res
      .status(400)
      .json({ message: "Solo puedes tener 3 archivos subidos" });
  }

  // Subir Archivos
  if (req.files && req.files > 0) {
    await Promise.all(
      req.files.map(async (file) => {
        await TramiteArchivo.create({
          fileName: file.filename,
          originalName: file.originalname,
          ruta: file.path,
          tipo: file.mimetype.split("/")[1],
          size: file.size,
          tramiteId: tramite.id,
          usuarioCreacionId: req.usuario.id,
        });
      })
    );
  }

  return res.status(200).json({ message: "Archivos subidos correctamente" });
};

export const eliminarArchivos = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.query;
  const { eliminarArchivos } = req.body;

  const tramite = await Tramite.findOne({ where: { id, estado } });
  if (!tramite)
    return res.status(404).json({ message: "Trámite no encontrado" });

  if (
    tramite.departamentoUsuarioId.toString() !==
    req.usuario.departamentoId.toString()
  )
    return res.status(403).json({
      message: "Acción no válida",
    });

  if (!eliminarArchivos || eliminarArchivos.length === 0)
    return res
      .status(400)
      .json({ message: "No se enviaron archivos para eliminar" });

  const nuevoArrayEliminar = eliminarArchivos
    .filter((id) => id !== null)
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id));

  if (nuevoArrayEliminar.length === 0)
    return res
      .status(400)
      .json({ message: "Los archivos enviados no son válidos" });

  const archivosAEliminar = await TramiteArchivo.findAll({
    where: { tramiteId: id, id: nuevoArrayEliminar },
  });
  if (archivosAEliminar.length === 0)
    return res.status(400).json({ message: "Archivos no encontrados" });

  borrarArchivos(archivosAEliminar);
};

export const eliminarTramite1 = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findByPk(id);
    if (!tramite) return res.status(400).json({ message: "Accion no valida" });

    if (
      tramite.departamentoUsuarioId.toString() !==
      req.usuario.departamentoId.toString()
    )
      return res.status(403).json({
        message: "Acción no válida",
      });

    const tramiteArchivos = await TramiteArchivo.findAll({
      where: { tramiteId: id },
    });

    await Tramite.destroy({ where: id });
    await TramiteArchivo.destroy({ where: { tramiteId: id } });

    borrarArchivos(tramiteArchivos);

    res.status(200).json({ message: "Tramite eliminado" });
  } catch (error) {
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar el trámite.",
    });
  }
};

// export const eliminadoLogicoTramite = async (req, res) => {
export const eliminarTramite = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction();
  try {
    const { id } = req.params;

    // const { estado } = req.body;
    // if (!estado)
    //   return res.status(400).json({ message: "El estado es requerido" });

    const tramite = await Tramite.findByPk(id);
    if (!tramite) {
      await transaction.rollback();
      return res.status(400).json({ message: "Accion no valida" });
    }

    if (
      tramite.departamentoUsuarioId.toString() !==
      req.usuario.departamentoId.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({
        message: "Acción no válida",
      });
    }

    const estadoAnterior = tramite.estado;

    // Actualizar el estado
    tramite.estado = "RECHAZADO";

    await tramite.save({ transaction });

    await registrarHistorialEstado(
      tramite.id,
      estadoAnterior,
      tramite.estado,
      req.usuario.id,
      transaction
    );

    await transaction.commit();
    res.status(200).json({ message: "Tramite eliminado" });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar el trámite.",
    });
  }
};

export const asignarOReasignarRevisor = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction();

  try {
    const { id } = req.params;

    const {
      usuarioRevisorId,
      fechaMaximaContestacion,
      observacionRevisor,
      prioridad,
      referenciaTramite,
    } = req.body;

    if (!usuarioRevisorId || !fechaMaximaContestacion || !observacionRevisor) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const existeUsuarioRevisor = await Usuario.findByPk(id);
    if (!existeUsuarioRevisor) {
      await transaction.rollback();
      return res.status(404).json({ message: "Usuario Revisor no encontrado" });
    }

    const tramiteAsignar = await Tramite.findByPk(id);
    if (!tramiteAsignar) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

    if (
      tramiteAsignar.departamentoUsuarioId.toString() !==
      req.usuario.departamentoId.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({
        message: "Acción no válida",
      });
    }

    const estadoAnterior = tramiteAsignar.estado;
    const revisorAnterior = tramiteAsignar.usuarioRevisorId;

    // Asignar Revisor
    if (tramiteAsignar.estado === "INGRESADO" && !revisorAnterior) {
      tramiteAsignar.usuarioRevisorId =
        usuarioRevisorId || tramiteAsignar.usuarioRevisorId;
      tramiteAsignar.prioridad = prioridad || tramiteAsignar.prioridad;
      tramiteAsignar.referenciaTramite =
        referenciaTramite || tramiteAsignar.referenciaTramite;
      tramiteAsignar.fechaMaximaContestacion =
        fechaMaximaContestacion || tramiteAsignar.fechaMaximaContestacion;
      tramiteAsignar.estado = "PENDIENTE";

      await TramiteAsignacion.create(
        {
          tramiteId: id,
          usuarioRevisorId: usuarioRevisorId,
          descripcion: observacionRevisor,
        },
        { transaction }
      );

      await registrarHistorialEstado(
        tramiteAsignar.id,
        estadoAnterior,
        tramiteAsignar.estado,
        req.usuario.id,
        transaction
      );
    }
    // Resignar Revisor
    else if (tramiteAsignar.estado === "PENDIENTE" && revisorAnterior) {
      if (
        tramiteAsignar.usuarioRevisorId.toString() ===
        usuarioRevisorId.toString()
      ) {
        return res.status(400).json({
          message: "El usuario revisor es el mismo, no se puede reasignar.",
        });
      }

      tramiteAsignar.usuarioRevisorId =
        usuarioRevisorId || tramiteAsignar.usuarioRevisorId;
      tramiteAsignar.prioridad = prioridad || tramiteAsignar.prioridad;
      tramiteAsignar.referenciaTramite =
        referenciaTramite || tramiteAsignar.referenciaTramite;
      tramiteAsignar.fechaMaximaContestacion =
        fechaMaximaContestacion || tramiteAsignar.fechaMaximaContestacion;

      await TramiteAsignacion.create(
        {
          tramiteId: id,
          usuarioRevisorId: usuarioRevisorId,
          descripcion: observacionRevisor,
        },
        { transaction }
      );
    }

    await tramiteAsignar.save({ transaction });
    await transaction.commit();

    res.json({
      message: "Revisor asignado/reasignado correctamente",
      tramite: tramiteAsignar,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al asignar/reasignar el trámite: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al asignar/reasignar el trámite, intente nuevamente más tarde",
    });
  }
};

export const completarTramite = (req, res) => {
  res.send("Desde completar Revisor");
};
