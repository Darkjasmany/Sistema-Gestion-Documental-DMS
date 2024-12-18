import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Tramite } from "../models/Tramite.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { TramiteAsignacion } from "../models/TramiteAsignacion.model.js";
import { TramiteHistorialEstado } from "../models/TramiteHistorialEstado.model.js";
import { Op } from "sequelize";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";
import { registrarHistorialEstado } from "../utils/registrarHistorialEstado.js";
import { borrarArchivosTemporales } from "../utils/borrarArchivosTemporales.js";
import { borrarArchivos } from "../utils/borrarArchivos.js";
import { validarFecha } from "../utils/validarFecha.js";
import { TramiteObservacion } from "../models/TramiteObservacion.model.js";
import { TramiteEliminacion } from "../models/TramiteEliminacion.model.js";

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
        departamento_tramite: req.usuario.departamento_id,
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
      tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
    )
      return res.status(403).json({
        message: "Acción no válida",
      });

    const archivos = await TramiteArchivo.findAll({
      where: { tramite_id: id },
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
      observacionRevisor,
      numeroTramiteModificado,
    } = req.body;

    if (
      !asunto ||
      asunto.trim() === "" ||
      !descripcion ||
      descripcion.trim() === "" ||
      !departamentoRemitenteId ||
      !remitenteId ||
      !fechaDocumento ||
      fechaDocumento.trim() === "" ||
      !fechaMaximaContestacion ||
      fechaMaximaContestacion.trim() === ""
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Campos obligatorios : Asunto | Descripción | Remitente y su departamento | Fecha del documento | Fecha de contestación",
      });
    }

    const tramiteActualizar = await Tramite.findOne({
      where: { id, activo: true },
    });
    if (!tramiteActualizar) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

    if (
      tramiteActualizar.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
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
        where: { id: remitenteId, departamento_id: departamentoRemitenteId },
      }),
      Departamento.findByPk(departamentoDestinatarioId),
      Empleado.findOne({
        where: {
          id: destinatarioId,
          departamento_id: departamentoDestinatarioId,
        },
      }),
      Tramite.findOne({
        where: {
          [Op.or]: [
            numeroTramiteModificado
              ? { numero_tramite: numeroTramiteModificado }
              : {},
            numeroTramiteModificado
              ? { numero_tramite_modificado: numeroTramiteModificado }
              : {},
          ],
          id: { [Op.ne]: id },
        },
      }),
      Tramite.findOne({
        where: {
          numero_oficio: { [Op.like]: numeroOficioDespacho },
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
    tramiteActualizar.departamento_remitente =
      departamentoRemitenteId || tramiteActualizar.departamento_remitente;
    tramiteActualizar.remitente_id =
      remitenteId || tramiteActualizar.remitente_id;
    tramiteActualizar.prioridad = prioridad || tramiteActualizar.prioridad;
    tramiteActualizar.fecha_documento =
      fechaDocumento || tramiteActualizar.fecha_documento;
    tramiteActualizar.referencia_tramite =
      referenciaTramite || tramiteActualizar.referencia_tramite;
    tramiteActualizar.numero_oficio =
      numeroOficioDespacho || tramiteActualizar.numero_oficio;
    // tramiteActualizar.departamentoDestinatarioId =
    //   departamentoDestinatarioId ||
    //   tramiteActualizar.departamentoDestinatarioId;
    // tramiteActualizar.destinatarioId =
    //   destinatarioId || tramiteActualizar.destinatarioId;
    tramiteActualizar.fecha_contestacion =
      fechaMaximaContestacion || tramiteActualizar.fecha_contestacion;
    // tramiteActualizar.observacionRevisor =
    //   observacionRevisor || tramiteActualizar.observacionRevisor;
    tramiteActualizar.numero_tramite_modificado =
      numeroTramiteModificado || tramiteActualizar.numero_tramite_modificado;
    tramiteActualizar.usuario_actualizacion = req.usuario.id;

    // Guarda el trámite actualizado
    await tramiteActualizar.save({ transaction });

    // Registrar el cambio de estado en el historial
    await registrarHistorialEstado(
      id,
      estadoAnterior,
      tramiteActualizar.estado,
      req.usuario.id,
      transaction
    );

    await transaction.commit(); // Confirmar la transacción

    res.status(200).json({ message: "Trámite actualizado" });
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

  const tramite = await Tramite.findOne({
    where: { id, activo: true },
  });
  if (!tramite) {
    borrarArchivosTemporales(req.files);
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (
    tramite.departamento_tramite.toString() !==
    req.usuario.departamento_id.toString()
  ) {
    borrarArchivosTemporales(req.files);
    return res.status(403).json({
      message: "Acción no válida",
    });
  }

  const archivoExistentes = await TramiteArchivo.findAll({
    where: { tramite_id: id },
  });

  const archivosNuevos = req.files ? req.files.length() : 0;
  if (archivoExistentes.length + archivosNuevos > 6) {
    borrarArchivosTemporales(req.files);
    return res
      .status(400)
      .json({ message: "Solo puedes tener 6 archivos subidos" });
  }

  // Subir archivos si hay archivos en la solicitud
  if (req.files && req.files > 0) {
    await Promise.all(
      req.files.map(async (file) => {
        await TramiteArchivo.create({
          file_name: file.filename,
          original_name: file.originalname,
          ruta: file.path,
          tipo: file.mimetype.split("/")[1],
          size: file.size,
          tramite_id: tramite.id,
          usuario_creacion: req.usuario.id,
        });
      })
    );
  }

  return res.status(200).json({ message: "Archivos subidos correctamente" });
};

export const eliminarArchivos = async (req, res) => {
  const { id } = req.params;
  const { eliminarArchivos } = req.body;

  const tramite = await Tramite.findOne({ where: { id, activo: true } });
  if (!tramite)
    return res.status(404).json({ message: "Trámite no encontrado" });

  if (
    tramite.departamento_tramite.toString() !==
    req.usuario.departamento_id.toString()
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
    where: { tramite_id: id, id: nuevoArrayEliminar },
  });
  if (archivosAEliminar.length === 0)
    return res.status(400).json({ message: "Archivos no encontrados" });

  borrarArchivos(archivosAEliminar);

  await TramiteArchivo.destroy({ where: { id: nuevoArrayEliminar } });

  return res
    .status(200)
    .json({ message: "Archivos eliminados correctamente." });
};

export const eliminarTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findOne({ where: { id, activo: true } });
    if (!tramite) return res.status(400).json({ message: "Accion no valida" });

    if (
      tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
    )
      return res.status(403).json({
        message: "Acción no válida",
      });

    const tramiteArchivos = await TramiteArchivo.findAll({
      where: { tramite_id: id },
    });

    await TramiteHistorialEstado.destroy({ where: { tramite_id: id } });

    await TramiteAsignacion.destroy({ where: { tramiteId: id } });

    await TramiteArchivo.destroy({ where: { tramite_id: id } });

    await Tramite.destroy({ where: { id } });

    borrarArchivos(tramiteArchivos);

    res.status(200).json({ message: "Tramite eliminado" });
  } catch (error) {
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar el trámite.",
    });
  }
};

export const eliminadoLogicoTramite = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction();
  try {
    const { id } = req.params;
    const { observacion } = req.body;

    const tramite = await Tramite.findOne(
      {
        where: { id, activo: true },
      },
      transaction
    );
    if (!tramite) {
      await transaction.rollback();
      return res.status(400).json({ message: "Accion no valida" });
    }

    if (
      tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({
        message: "Acción no válida",
      });
    }

    if (!observacion || observacion.trim() === "") {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Debes escribir una Razón de Eliminación" });
    }

    const estadoAnterior = tramite.estado;

    // Actualizar el estado
    tramite.estado = "RECHAZADO";
    await tramite.save({ transaction });

    await TramiteEliminacion.create(
      {
        tramite_id: id,
        usuario_eliminacion: req.usuario.id,
        motivo_eliminacion: observacion,
        fecha_eliminacion: Date.now(),
      },
      { transaction }
    );

    // Registrar Historial Estado
    await registrarHistorialEstado(
      id,
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

    const existeUsuarioRevisor = await Usuario.findOne({
      where: {
        id: usuarioRevisorId,
        rol: "REVISOR",
        departamento_id: req.usuario.departamento_id,
      },
    });

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
      tramiteAsignar.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({
        message: "Acción no válida",
      });
    }

    // Validamos la fecha usando la función de utils
    const { valido, mensaje } = validarFecha(fechaMaximaContestacion);
    if (!valido) {
      return res.status(400).json({ error: mensaje });
    }

    const estadoAnterior = tramiteAsignar.estado;
    const revisorAnterior = tramiteAsignar.usuario_revisor;
    let sms;

    // Asignar Revisor
    if (tramiteAsignar.estado === "INGRESADO" && !revisorAnterior) {
      tramiteAsignar.usuario_revisor =
        usuarioRevisorId || tramiteAsignar.usuario_revisor;
      tramiteAsignar.prioridad = prioridad || tramiteAsignar.prioridad;
      tramiteAsignar.referencia_tramite =
        referenciaTramite || tramiteAsignar.referencia_tramite;
      tramiteAsignar.fecha_contestacion =
        fechaMaximaContestacion || tramiteAsignar.fecha_contestacion;
      tramiteAsignar.estado = "PENDIENTE";
      tramiteAsignar.usuario_actualizacion = req.usuario.id;

      await TramiteAsignacion.create(
        {
          tramite_id: id,
          usuario_revisor: usuarioRevisorId,
          fecha_asignacion: new Date(),
        },
        { transaction }
      );

      await TramiteObservacion.create(
        {
          tramite_id: id,
          observacion: observacionRevisor,
          usuario_creacion: req.usuario.id,
          fecha_creacion: new Date(),
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

      sms = "asignado";
    }
    // Resignar Revisor
    else if (tramiteAsignar.estado === "PENDIENTE" && revisorAnterior) {
      if (
        tramiteAsignar.usuario_revisor.toString() ===
        usuarioRevisorId.toString()
      ) {
        return res.status(400).json({
          message: "El usuario revisor es el mismo, no se puede reasignar.",
        });
      }

      tramiteAsignar.usuario_revisor =
        usuarioRevisorId || tramiteAsignar.usuario_revisor;
      tramiteAsignar.prioridad = prioridad || tramiteAsignar.prioridad;
      tramiteAsignar.referencia_tramite =
        referenciaTramite || tramiteAsignar.referencia_tramite;
      tramiteAsignar.fecha_contestacion =
        fechaMaximaContestacion || tramiteAsignar.fecha_contestacion;
      tramiteAsignar.usuario_actualizacion = req.usuario.id;

      await TramiteAsignacion.create(
        {
          tramite_id: id,
          usuario_revisor: usuarioRevisorId,
          fecha_asignacion: new Date(),
        },
        { transaction }
      );

      await TramiteObservacion.create(
        {
          tramite_id: id,
          observacion: observacionRevisor,
          usuario_creacion: req.usuario.id,
          fecha_creacion: new Date(),
        },
        { transaction }
      );
      sms = "reasignado";
    }

    await tramiteAsignar.save({ transaction });
    await transaction.commit();

    res.json({
      // message: "Revisor asignado/reasignado correctamente",
      message: `Revisor ${sms} correctamente`,
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
