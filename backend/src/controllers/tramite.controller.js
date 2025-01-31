import { Tramite } from "../models/Tramite.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Departamento } from "../models/Departamento.model.js";
import { Sequelize, Op } from "sequelize";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import path from "path"; // módulo path es parte de la API estándar de Node.js y se utiliza para manejar y transformar rutas de archivos y directorios.
import { fileURLToPath } from "url";
import { borrarArchivosTemporales } from "../utils/borrarArchivosTemporales.js";
import { borrarArchivos } from "../utils/borrarArchivos.js";
import { registrarHistorialEstado } from "../utils/registrarHistorialEstado.js";
import { TramiteEliminacion } from "../models/TramiteEliminacion.model.js";
import { config } from "../config/parametros.config.js";
import { Usuario } from "../models/Usuario.model.js";

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const agregarTramite = async (req, res) => {
  // console.log(req.body); // Verifica los datos del formulario
  // console.log(req.files); // Verifica los archivos recibidos

  const {
    oficioRemitente,
    asunto,
    referenciaTramite,
    fechaDocumento,
    departamentoRemitenteId,
    remitenteId,
    prioridad,
    descripcion,
    tramiteExterno,
  } = req.body;

  // CONFIG es un objeto con los parámetros del sistema. '!'config verifica que config no sea null o undefined, Object.keys(config).length === 0 verifica que el objeto config tenga al menos una propiedad. Si el objeto está vacío, esta condición devolverá true.
  if (!config || Object.keys(config).length === 0) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "Parámetros del sistema no cargados, comunícate con Sistemas",
    });
  }
  // const extensionesPermitidas = config.EXTENSIONES_PERMITIDAS.split(",");
  // console.log(extensionesPermitidas);

  // Validar campos requeridos
  if (
    !asunto ||
    asunto.trim() === "" ||
    !oficioRemitente ||
    oficioRemitente.trim() === "" ||
    !descripcion ||
    descripcion.trim() === "" ||
    !departamentoRemitenteId ||
    !remitenteId ||
    !fechaDocumento ||
    fechaDocumento.trim() === "" ||
    !req.files ||
    req.files.length === 0
  ) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message:
        "Todos los campos son obligatorios y debes subir al menos un archivo",
      // error: true,
    });
  }

  const archivosNuevos = req.files ? req.files.length : 0;
  if (archivosNuevos > config.MAX_UPLOAD_FILES) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: `Solo puedes subir hasta ${config.MAX_UPLOAD_FILES} archivo`,
      // error: true,
    });
  }

  //Validar que el numero de refencia existe
  if (referenciaTramite) {
    const tramiteExistente = await Tramite.findOne({
      where: { numero_tramite: referenciaTramite },
    });

    if (!tramiteExistente) {
      borrarArchivosTemporales(req.files);
      return res.status(400).json({
        message:
          "La referencia proporcionada no existe, por favor ingrese una nueva referencia.",
      });
    }
  }

  // Validar si el departamento remitente y el empleado remitente existen
  const departamentoExiste = await Departamento.findByPk(
    departamentoRemitenteId
  );
  if (!departamentoExiste) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "Departamento del remitente no encontrado",
      // error: true,
    });
  }

  const empleadoExiste = await Empleado.findOne({
    where: {
      id: remitenteId,
      departamento_id: departamentoRemitenteId,
    },
  });
  if (!empleadoExiste) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "No existe ese empleado o no está asignado a ese departamento",
      // error: true,
    });
  }

  const oficioRemitenteExiste = await Tramite.findOne({
    where: {
      numero_oficio_remitente: {
        [Op.iLike]: `%${oficioRemitente}%`,
        // Buscar oficio que contenga el número proporcionado
      },
    },
  });
  if (oficioRemitenteExiste) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "El número de Memo|Oficio ya se encuentra registrado",
      // error: true,
    });
  }

  try {
    // Crear el nuevo trámite
    const tramiteGuardado = await Tramite.create({
      asunto,
      descripcion,
      numero_oficio_remitente: oficioRemitente,
      departamento_remitente: departamentoRemitenteId,
      remitente_id: remitenteId,
      prioridad: prioridad || undefined,
      fecha_documento: fechaDocumento,
      referencia_tramite: referenciaTramite || null,
      usuario_creacion: req.usuario.id,
      departamento_tramite: req.usuario.departamento_id,
      externo: tramiteExterno,
    });

    await Promise.all(
      req.files.map(async (file) => {
        await TramiteArchivo.create({
          file_name: file.filename,
          original_name: file.originalname,
          ruta: file.path,
          tipo: file.mimetype.split("/")[1], // Tomar solo la parte después de "/" Elimina "application/"
          size: file.size, // Guardar en bytes (número entero)
          tramite_id: tramiteGuardado.id,
          usuario_creacion: req.usuario.id,
        });
      })
    );

    // res.json(tramiteGuardado);

    res.status(201).json({
      error: false,
      message: "Trámite creado correctamente",
      data: tramiteGuardado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listarTramitesUsuario = async (req, res) => {
  try {
    const tramites = await Tramite.findAll({
      where: {
        usuario_creacion: req.usuario.id,
        estado: "INGRESADO",
        activo: true,
      },
      attributes: [
        "id",
        "numero_tramite",
        "numero_oficio_remitente",
        "asunto",
        "referencia_tramite",
        "fecha_documento",
        "prioridad",
        "descripcion",
        "externo",
        "createdAt",
        // [
        //   // Conteo de archivos de cada trámite
        //   Sequelize.literal(
        //     `(SELECT COUNT(*) FROM "tramite_archivo" WHERE "tramite_archivo"."tramite_id" = "tramite"."id")`
        //   ),
        //   "totalArchivosCargados",
        // ],
      ],
      include: [
        {
          model: Departamento,
          as: "departamentoRemitente", // Alias
          attributes: ["id", "nombre"], // Atributos del departamento remitente
        },
        {
          model: Empleado,
          as: "remitente", // Alias
          attributes: [
            "id",
            [
              Sequelize.literal("CONCAT(nombres, ' ',  apellidos)"),
              "nombreCompleto",
            ],
            // "cedula",
          ],
        },
        {
          model: TramiteArchivo,
          as: "tramiteArchivos",
          attributes: ["id", "original_name", "ruta"],
        },
      ],

      // order: [["numero_tramite", "DESC"]],
      order: [["id", "DESC"]],
    });

    // Modificar la ruta antes de enviarla al frontend
    const tramitesConRutas = tramites.map((tramite) => {
      const archivosConRutas = tramite.tramiteArchivos.map((archivo) => ({
        ...archivo.toJSON(),
        ruta: `${archivo.ruta.replace(/\\/g, "/")}`,
      }));

      return {
        ...tramite.toJSON(),
        tramiteArchivos: archivosConRutas,
      };
    });

    // console.log(tramitesConRutas);
    res.json(tramitesConRutas);
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
      tramite.usuario_creacion.toString() !== req.usuario.id.toString() ||
      tramite.departamento_tramite.toString() !==
        req.usuario.departamento_id.toString()
    )
      return res
        .status(403)
        .json({ message: "El trámite seleccionado no te pertenece" });

    const archivos = await TramiteArchivo.findAll({
      where: { tramite_id: id },
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

  const { id } = req.params;
  const {
    oficioRemitente,
    asunto,
    descripcion,
    departamentoRemitenteId,
    remitenteId,
    prioridad,
    fechaDocumento,
    referenciaTramite,
    tramiteExterno,
    archivos,
    archivosEliminar,
  } = req.body;

  if (
    !oficioRemitente ||
    oficioRemitente.trim() === "" ||
    !asunto ||
    asunto.trim() === "" ||
    !descripcion ||
    descripcion.trim() === "" ||
    !departamentoRemitenteId ||
    !remitenteId ||
    !fechaDocumento ||
    fechaDocumento.trim() === ""
    //|| !req.files ||
    // req.files.length === 0
  ) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message:
        "Todos los campos son obligatorios y se debe mantener al menos un archivo",
    });
  }

  if (!req.files) {
    borrarArchivosTemporales(req.files);
  }

  const tramite = await Tramite.findOne(
    {
      where: { id, estado: "INGRESADO", activo: true },
    },
    transaction
  );
  if (!tramite) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (
    tramite.usuario_creacion.toString() !== req.usuario.id.toString() ||
    tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
  ) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res.status(403).json({ message: "Acción no válida" });
  }

  const departamentoExiste = await Departamento.findByPk(
    departamentoRemitenteId
  );
  if (!departamentoExiste) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res
      .status(400)
      .json({ message: "Departamento del remitente no encontrado" });
  }

  const remitenteExiste = await Empleado.findOne({
    where: {
      id: remitenteId,
      departamento_id: departamentoRemitenteId,
    },
  });
  if (!remitenteExiste) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "No existe ese empleado o no está asignado a ese departamento",
    });
  }

  const archivosExistentes = await TramiteArchivo.findAll({
    where: {
      tramite_id: id,
    },
  });

  const archivosNuevos = req.files ? req.files.length : 0;

  if (archivosExistentes.length + archivosNuevos === 0) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res.status(400).json({ error: "No se subieron archivos" });
  }

  if (archivosExistentes.length + archivosNuevos > config.MAX_UPLOAD_FILES) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      error: `Solo puedes subir hasta ${config.MAX_UPLOAD_FILES} archivos`,
    });
  }

  // Filtrar los valores vacíos o inválidos (null, undefined, NaN)
  let nuevoArrayEliminar = [];
  if (archivosEliminar) {
    nuevoArrayEliminar = JSON.parse(archivosEliminar)
      .filter((id) => id != null) // Filtrar valores no nulos
      .map((id) => parseInt(id)) // Convertir los valores restantes a enteros
      .filter((id) => !isNaN(id)); // Filtrar los valores NaN
  }

  // Buscar los archivos a eliminar en la base de datos
  const archivosAEliminar = await TramiteArchivo.findAll({
    where: { tramite_id: id, id: nuevoArrayEliminar },
  });

  // ** Validar si la cantidad de archivos supera el límite permitido
  const totalArchivos =
    archivosExistentes.length - nuevoArrayEliminar.length + archivosNuevos;

  console.log(totalArchivos);
  if (totalArchivos > config.MAX_UPLOAD_FILES) {
    await transaction.rollback();
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: `Solo puedes subir hasta ${config.MAX_UPLOAD_FILES} archivos`,
    });
  }

  const oficioRemitenteExiste = await Tramite.findOne({
    where: {
      numero_oficio_remitente: {
        [Op.iLike]: `%${oficioRemitente}%`, // Buscar oficio que contenga el número proporcionado
      },
      id: {
        [Op.not]: id, // Excluir el ID del trámite que estás editando
      },
    },
  });
  if (oficioRemitenteExiste) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: "El número de Memo|Oficio ya se encuentra registrado",
      // error: true,
    });
  }

  //Validar que el numero de refencia existe
  if (referenciaTramite) {
    const tramiteExistente = await Tramite.findOne({
      where: { numero_tramite: referenciaTramite },
    });

    if (!tramiteExistente) {
      borrarArchivosTemporales(req.files);
      return res.status(400).json({
        message:
          "La referencia proporcionada no existe, por favor ingrese una nueva referencia.",
      });
    }
  }

  try {
    // Actualización de los campos del trámite
    tramite.numero_oficio_remitente = oficioRemitente;
    tramite.asunto = asunto;
    tramite.descripcion = descripcion;
    tramite.departamento_remitente = departamentoRemitenteId;
    tramite.remitente_id = remitenteId;
    tramite.prioridad = prioridad || tramite.prioridad;
    tramite.fecha_documento = fechaDocumento || tramite.fecha_documento;
    tramite.referencia_tramite =
      referenciaTramite || tramite.referencia_tramite;
    tramite.usuario_actualizacion = req.usuario.id;
    tramite.externo = tramiteExterno || tramite.externo;

    // Guardar cambios
    await tramite.save({ transaction });

    // Si hay archivos para eliminar
    if (archivosEliminar) {
      await TramiteArchivo.destroy({ where: { id: nuevoArrayEliminar } });
      borrarArchivos(archivosAEliminar);
    }

    // Subir archivos si hay archivos en la solicitud
    if (req.files && req.files.length > 0) {
      // Cargar archivos nuevos
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

    // Confirmar la transacción
    await transaction.commit();

    res.status(201).json({
      //  error: false,
      message: "Trámite Actualizado",
      data: tramite,
    });
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
    where: { id, estado: "INGRESADO", activo: true },
  });
  if (!tramite) {
    borrarArchivosTemporales(req.files);
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (
    tramite.usuario_creacion.toString() !== req.usuario.id.toString() ||
    tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
  ) {
    borrarArchivosTemporales(req.files);
    return res.status(403).json({ message: "Acción no válida" });
  }

  const archivosExistentes = await TramiteArchivo.findAll({
    where: { tramite_id: id },
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

  if (
    tramite.usuario_creacion.toString() !== req.usuario.id.toString() ||
    tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
  )
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
    where: { tramite_id: id, id: nuevoArrayEliminar },
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

    if (tramite.usuario_creacion.toString() !== req.usuario.id.toString())
      return res.status(403).json({ msg: "Acción no válida" });

    const tramiteArchivos = await TramiteArchivo.findAll({
      where: { tramite_id: id },
    });

    // Eliminar el trámite y los archivos en la base de datos
    await Tramite.destroy({ where: { id } });

    await TramiteArchivo.destroy({ where: { tramite_id: id } });

    // Eliminar los archivos físicamente
    borrarArchivos(tramiteArchivos);

    res.status(200).json({ message: "Trámite eliminado" });
  } catch (error) {
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({ message: "Error al eliminar el trámite." });
  }
};

export const eliminadoLogicoTramite = async (req, res) => {
  const transaction = await Tramite.sequelize.transaction();

  try {
    const { id } = req.params;
    const { observacion } = req.body;

    const tramite = await Tramite.findOne(
      {
        where: { id, estado: "INGRESADO", activo: true },
      },
      transaction
    );
    if (!tramite) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

    if (
      tramite.usuario_creacion.toString() !== req.usuario.id.toString() ||
      tramite.departamento_tramite.toString() !==
        req.usuario.departamento_id.toString()
    ) {
      await transaction.rollback();
      return res.status(403).json({ msg: "Acción no válida" });
    }

    if (!observacion || observacion.trim() === "") {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Debes escribir una Razón de Eliminación" });
    }

    const estadoAnterior = tramite.estado;

    await TramiteEliminacion.create(
      {
        tramite_id: id,
        usuario_eliminacion: req.usuario.id,
        motivo_eliminacion: observacion,
        fecha_eliminacion: Date.now(),
      },
      {
        transaction,
      }
    );

    // Campos a Actualizar
    tramite.estado = "RECHAZADO";
    await tramite.save({ transaction });

    // Actualizar registros en la BD

    // Registrar Historial Estado
    await registrarHistorialEstado(
      id,
      estadoAnterior,
      tramite.estado,
      req.usuario.id,
      transaction
    );

    await transaction.commit();

    res.status(200).json({ message: "Trámite eliminado" });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al eliminar el trámite: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar el trámite.",
    });
  }
};

export const buscarTramites = async (req, res) => {
  const {
    numeroTramite,
    oficioRemitente,
    asunto,
    fechaInicio,
    fechaFin,
    departamentoRemitenteId,
    remitenteId,
    prioridad,
    descripcion,
    tramiteExterno,
  } = req.query;

  if (
    [
      numeroTramite,
      oficioRemitente,
      asunto,
      fechaInicio,
      fechaFin,
      departamentoRemitenteId,
      remitenteId,
      prioridad,
      descripcion,
      tramiteExterno,
    ].every((valor) => !valor) // Verifica si todos son falsi
  ) {
    return res.status(400).json({
      message: "Al memos debes enviar un parametro de busqueda",
      // error: true,
    });
  }

  const where = {};

  if (numeroTramite) {
    if (!isNaN(numeroTramite)) {
      where.numero_tramite = numeroTramite;
    } else {
      where[Sequelize.literal('CAST("numero_tramite" AS TEXT)')] = {
        [Op.iLike]: `%${numeroTramite}%`,
      };
    }
  }

  if (oficioRemitente)
    where.numero_oficio_remitente = { [Op.iLike]: `%${oficioRemitente}%` };

  if (asunto) where.asunto = { [Op.iLike]: `%${asunto}%` };

  if (departamentoRemitenteId)
    where.departamento_remitente = departamentoRemitenteId;

  if (remitenteId) where.remitente_id = remitenteId;

  if (prioridad) where.prioridad = prioridad;

  if (descripcion) where.descripcion = { [Op.iLike]: `%${descripcion}%` };

  if (tramiteExterno) where.externo = tramiteExterno;

  if (fechaInicio && fechaFin) {
    where.fecha_documento = {
      [Op.between]: [fechaInicio, fechaFin],
    };
  } else if (fechaInicio) {
    where.fecha_documento = { [Op.gte]: fechaInicio }; // >=
  } else if (fechaFin) {
    where.fecha_documento = { [Op.lte]: fechaFin }; //<=
  }

  try {
    const tramites = await Tramite.findAll({
      where,
      attributes: [
        "id",
        "numero_tramite",
        "numero_oficio_remitente",
        "asunto",
        "referencia_tramite",
        "fecha_documento",
        "prioridad",
        "descripcion",
        "externo",
        "createdAt",
        "fecha_contestacion",
        "fecha_despacho",
        "numero_oficio",
        "estado",
        [
          // Concatenar nombres de departamentos destinatarios
          Sequelize.literal(`
        (
         SELECT STRING_AGG(
            CONCAT(e.nombres, ' ', e.apellidos , ', ', d."nombre"), 
            ' - '
        ) 
        FROM tramite_destinatario td
        INNER JOIN empleado e ON e.id = td.destinatario_id
        INNER JOIN departamento d ON d.id = td.departamento_destinatario
        WHERE td.tramite_id = tramite.id
        )
      `),
          "departamentosDestinatarios",
        ],
      ],
      include: [
        {
          model: Departamento,
          as: "departamentoRemitente", // Alias
          attributes: ["id", "nombre"], // Atributos del departamento remitente
        },
        {
          model: Empleado,
          as: "remitente", // Alias
          attributes: [
            "id",
            [
              Sequelize.literal(
                '"remitente"."nombres" || \' \' || "remitente"."apellidos"'
              ),
              "nombreCompleto",
            ],
            // "cedula",
          ],
        },
        {
          model: TramiteArchivo,
          as: "tramiteArchivos",
          attributes: ["id", "original_name", "ruta"],
        },
        {
          model: Usuario,
          as: "usuarioRevisor",
          attributes: [
            [
              Sequelize.literal(
                '"usuarioRevisor"."nombres" || \' \' || "usuarioRevisor"."apellidos"'
              ),
              "UsuarioRevisor",
            ],
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    // Modificar la ruta antes de enviarla al frontend
    const tramitesConRutas = tramites.map((tramite) => {
      const archivosConRutas = tramite.tramiteArchivos.map((archivo) => ({
        ...archivo.toJSON(),
        ruta: `${archivo.ruta.replace(/\\/g, "/")}`,
      }));

      return {
        ...tramite.toJSON(),
        tramiteArchivos: archivosConRutas,
      };
    });

    // console.log(tramitesConRutas);
    res.json(tramitesConRutas);

    // res.json(tramites);
  } catch (error) {
    console.error(`Error al buscar los trámites: ${error.message}`);
    res.status(500).json({ message: "Error al buscar los trámites" });
  }
};
