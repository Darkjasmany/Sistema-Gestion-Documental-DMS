import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { borrarArchivosTemporales } from "../utils/borrarArchivosTemporales.js";
import { config } from "../config/parametros.config.js";

export const validarCantidadArchivos = async (req, res, next) => {
  const { id } = req.params;
  const { archivosEliminar } = req.body;

  // Busca todos los archivos asociados al trámite
  const archivosExistentes = await TramiteArchivo.findAll({
    where: { tramite_id: id },
  });

  const archivosNuevos = req.files ? req.files.length : 0;

  if (archivosExistentes.length + archivosNuevos === 0) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({ error: "No se subieron archivos" });
  }

  if (archivosExistentes.length + archivosNuevos > config.MAX_UPLOAD_FILES) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      error: "Solo puedes subir hasta ${config.MAX_UPLOAD_FILES} archivos ctm",
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

  // // Buscar los archivos a eliminar en la base de datos
  // const archivosAEliminar = await TramiteArchivo.findAll({
  //   where: { tramite_id: id, id: nuevoArrayEliminar },
  // });

  // ** Validar si la cantidad de archivos supera el límite permitido
  const totalArchivos =
    archivosExistentes.length - nuevoArrayEliminar.length + archivosNuevos;

  console.log(totalArchivos);

  // Si ya tiene 3 archivos, no permite subir más
  // if (archivosExistentes.length > 3) {
  //   return res.status(400).json({
  //     message: "Ya tienes 3 archivos subidos, no puedes agregar más.",
  //   });
  // }

  console.log(totalArchivos);
  if (totalArchivos > config.MAX_UPLOAD_FILES) {
    borrarArchivosTemporales(req.files);
    return res.status(400).json({
      message: `Solo puedes subir hasta ${config.MAX_UPLOAD_FILES} archivos.-`,
    });
  }

  next(); // Continúa hacia la subida de archivos si pasa la validación
};
