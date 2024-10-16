import { Tramite } from "../models/Tramite.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Departamento } from "../models/Departamento.model.js";
import { Sequelize } from "sequelize";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import multer from "multer";

export const agregarTramite = async (req, res) => {
  const {
    asunto,
    descripcion,
    departamentoRemitenteId,
    remitenteId,
    prioridad,
    fechaDocumento,
    referenciaTramite,
  } = req.body;

  if (
    !asunto ||
    !descripcion ||
    !departamentoRemitenteId ||
    !remitenteId ||
    !fechaDocumento ||
    !req.files ||
    req.files.length === 0
  )
    return res.status(400).json({
      message:
        "Todos los campos son obligatorios y debes subir al menos un archivo",
    });

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

  try {
    const tramiteGuardado = await Tramite.create({
      asunto,
      descripcion,
      departamentoRemitenteId,
      remitenteId,
      prioridad: prioridad || undefined,
      fechaDocumento,
      referenciaTramite,
      usuarioCreacionId: req.usuario.id,
      departamentoUsuarioId: req.usuario.departamentoId,
    });

    const archivoGuardado = await Promise.all(
      req.files.map(async (file) => {
        await TramiteArchivo.create({
          fileName: file.filename,
          originalName: file.originalname,
          ruta: file.path,
          tipo: file.mimetype.split("/")[1], // Tomar solo la parte después de "/" Elimina "application/"
          size: file.size, // Guardar en bytes (número entero)
          tramiteId: tramiteGuardado.id,
          usuarioCreacionId: req.usuario.id,
        });
      })
    );

    res.json({
      tramite: tramiteGuardado,
      archivo: archivoGuardado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listarTramitesUsuario = async (req, res) => {
  try {
    const tramites = await Tramite.findAll({
      where: { usuarioCreacionId: req.usuario.id, estado: "INGRESADO" },
      attributes: [
        "numeroTramite",
        "asunto",
        "descripcion",
        "prioridad",
        "fechaDocumento",
        "referenciaTramite",
        "createdAt",
        [
          // Conteo de archivos de cada trámite
          Sequelize.literal(
            `(SELECT COUNT(*) FROM "tramiteArchivo" WHERE "tramiteArchivo"."tramiteId" = "tramite"."id")`
          ),
          "totalArchivosCargados",
        ],
      ],
      include: [
        {
          model: Departamento,
          as: "departamentoRemitente", // Alias
          attributes: ["nombre"], // Atributos del departamento remitente
        },
        {
          model: Empleado,
          as: "remitente", // Alias
          attributes: [
            [
              Sequelize.literal("CONCAT(apellidos, ' ', nombres)"),
              "nombreCompleto",
            ],
            // "cedula",
          ],
        },
      ],
      order: [["numeroTramite", "ASC"]], // Cambia 'numeroTramite' por el campo que desees
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

    if (
      tramite.usuarioCreacionId.toString() !== req.usuario.id.toString() ||
      tramite.departamentoUsuarioId.toString() !==
        req.usuario.departamentoId.toString()
    )
      return res
        .status(403)
        .json({ message: "El trámite seleccionado no te pertenece" });

    const tramiteArchivo = await TramiteArchivo.findAll({
      where: { tramiteId: id },
    });

    res.json({
      tramite,
      archivos: tramiteArchivo,
    });
  } catch (error) {
    console.error(`Error al obtener el trámite seleccionado: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener el trámite seleccionado, intente nuevamente más tarde.",
    });
  }
};

export const actualizarTramite = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction(); // Inicia la transacción

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
    } = req.body;

    if (
      !asunto ||
      !descripcion ||
      !departamentoRemitenteId ||
      !remitenteId ||
      !fechaDocumento
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

    const tramiteArchivo = await TramiteArchivo.findAll({
      where: { tramiteId: id },
    });

    if (
      tramiteActualizado.usuarioCreacionId.toString() !==
      req.usuario.id.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({ message: "Acción no válida" });
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
    // console.log(tramiteArchivo);

    // Actualización de los campos del trámite
    tramiteActualizado.asunto = asunto;
    tramiteActualizado.descripcion = descripcion;
    tramiteActualizado.departamentoRemitenteId = departamentoRemitenteId;
    tramiteActualizado.remitenteId = remitenteId;
    tramiteActualizado.prioridad = prioridad || tramiteActualizado.prioridad;
    tramiteActualizado.fechaDocumento =
      fechaDocumento || tramiteActualizado.fechaDocumento;
    tramiteActualizado.referenciaTramite =
      referenciaTramite || tramiteActualizado.referenciaTramite;

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

    await TramiteArchivo.destroy({
      where: {
        tramiteId: id,
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
