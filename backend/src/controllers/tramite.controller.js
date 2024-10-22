import { Tramite } from "../models/Tramite.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Departamento } from "../models/Departamento.model.js";
import { Sequelize } from "sequelize";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import path from "path"; // módulo path es parte de la API estándar de Node.js y se utiliza para manejar y transformar rutas de archivos y directorios.
import { fileURLToPath } from "url";
import { borrarArchivosTemporales } from "../utils/borrarArchivosTemporales.js";
import { borrarArchivos } from "../utils/borrarArchivos.js";

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  ) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message:
        "Todos los campos son obligatorios y debes subir al menos un archivo",
    });
  }

  const archivosNuevos = req.files ? req.files.length : 0;
  if (archivosNuevos > process.env.MAX_UPLOAD_FILES)
    return res
      .status(400)
      .json({ message: "Solo puedes tener 3 archivos subidos" });

  const departamentoExiste = await Departamento.findByPk(
    departamentoRemitenteId
  );
  if (!departamentoExiste) {
    borrarArchivosTemporales(req.files);
    return res
      .status(400)
      .json({ message: "Departamento del remitente no encontrado" });
  }

  const empleadoExiste = await Empleado.findOne({
    where: {
      id: remitenteId,
      departamentoId: departamentoRemitenteId,
    },
  });
  if (!empleadoExiste) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "No existe ese empleado o no está asignado a ese departamento",
    });
  }

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

    await Promise.all(
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

    res.json(tramiteGuardado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listarTramitesUsuario = async (req, res) => {
  try {
    const tramites = await Tramite.findAll({
      where: {
        usuarioCreacionId: req.usuario.id,
        estado: "INGRESADO",
        activo: true,
      },
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

    const tramite = await Tramite.findOne({
      where: { id, estado: "INGRESADO", activo: true },
    });
    if (!tramite) return res.status(404).json({ message: "No encontrado" });

    if (
      tramite.usuarioCreacionId.toString() !== req.usuario.id.toString() ||
      tramite.departamentoUsuarioId.toString() !==
        req.usuario.departamentoId.toString()
    )
      return res
        .status(403)
        .json({ message: "El trámite seleccionado no te pertenece" });

    const archivos = await TramiteArchivo.findAll({
      where: { tramiteId: id },
    });

    res.json({
      tramite,
      archivos,
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
  // Inicia la transacción
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
    } = req.body;

    if (
      !asunto ||
      !descripcion ||
      !departamentoRemitenteId ||
      !remitenteId ||
      !fechaDocumento
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Campos obligatorios : Asunto | Descripción | Remitente y su departamento | Fecha del Documento ",
      });
    }

    const tramiteActualizado = await Tramite.findOne(
      {
        where: { id, estado: "INGRESADO" },
      },
      transaction
    );
    if (!tramiteActualizado) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

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

export const subirArchivos = async (req, res) => {
  const { id } = req.params;

  const tramite = await Tramite.findOne({
    where: { id, estado: "INGRESADO" },
  });

  if (!tramite) {
    borrarArchivosTemporales(req.files);
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (tramite.usuarioCreacionId.toString() !== req.usuario.id.toString()) {
    borrarArchivosTemporales(req.files);
    return res.status(403).json({ message: "Acción no válida" });
  }

  const archivosExistentes = await TramiteArchivo.findAll({
    where: { tramiteId: id },
  });

  const archivosNuevos = req.files ? req.files.length : 0;
  if (archivosExistentes.length + archivosNuevos > 3) {
    borrarArchivosTemporales(req.files);
    return res
      .status(400)
      .json({ message: "Solo puedes tener 3 archivos subidos" });
  }

  // Subir archivos si hay archivos en la solicitud
  if (req.files && req.files.length > 0) {
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

  return res.status(200).json({ message: "Archivos subidos correctamente." });
};

export const eliminarArchivos = async (req, res) => {
  const { id } = req.params;
  const { eliminarArchivos } = req.body; // Recibe un array con los IDs de los archivos a eliminar

  const tramite = await Tramite.findOne({
    where: { id, estado: "INGRESADO" },
  });

  if (!tramite)
    return res.status(404).json({ message: "Trámite no encontrado" });

  if (tramite.usuarioCreacionId.toString() !== req.usuario.id.toString())
    return res.status(403).json({ message: "Acción no válida" });

  // Validar que haya archivos para eliminar
  if (!eliminarArchivos || eliminarArchivos.length === 0)
    return res
      .status(400)
      .json({ message: "No se enviaron archivos para eliminar" });

  // Filtrar los valores vacíos o inválidos (null, undefined, NaN)
  const nuevoArrayEliminar = eliminarArchivos
    .filter((id) => id != null) // Filtrar valores no nulos
    .map((id) => parseInt(id)) // Convertir los valores restantes a enteros
    .filter((id) => !isNaN(id)); // Filtrar los valores NaN

  if (nuevoArrayEliminar.length === 0)
    return res
      .status(400)
      .json({ message: "Los archivos enviados no son válidos" });

  // Buscar los archivos a eliminar en la base de datos
  const archivosAEliminar = await TramiteArchivo.findAll({
    where: { tramiteId: id, id: nuevoArrayEliminar },
  });
  if (archivosAEliminar.length === 0)
    return res.status(400).json({ message: "Archivos no encontrados" });

  // Eliminar físicamente los archivos del sistema de archivos
  borrarArchivos(archivosAEliminar);

  // Eliminar registros de la base de datos
  await TramiteArchivo.destroy({ where: { id: nuevoArrayEliminar } });

  return res
    .status(200)
    .json({ message: "Archivos eliminados correctamente." });
};

export const eliminarTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findOne({
      where: { id, estado: "INGRESADO" },
    });
    if (!tramite)
      return res.status(404).json({ message: "Trámite no encontrado" });

    if (tramite.usuarioCreacionId.toString() !== req.usuario.id.toString())
      return res.status(403).json({ msg: "Acción no válida" });

    const tramiteArchivos = await TramiteArchivo.findAll({
      where: { tramiteId: id },
    });

    // Eliminar el trámite y los archivos en la base de datos
    await Tramite.destroy({ where: { id } });
    await TramiteArchivo.destroy({ where: { tramiteId: id } });

    // Eliminar los archivos físicamente
    borrarArchivos(tramiteArchivos);

    res.status(200).json({ message: "Trámite eliminado" });
  } catch (error) {
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({ message: "Error al eliminar el trámite." });
  }
};
