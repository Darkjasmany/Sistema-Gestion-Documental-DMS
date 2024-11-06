import { TramiteArchivo } from "../models/TramiteArchivo.model.js";

export const validarCantidadArchivos = async (req, res, next) => {
  const { id } = req.params;

  // Busca todos los archivos asociados al trámite
  const archivosExistentes = await TramiteArchivo.findAll({
    where: { tramite_id: id },
  });

  // Si ya tiene 3 archivos, no permite subir más
  if (archivosExistentes.length > 3) {
    return res.status(400).json({
      message: "Ya tienes 3 archivos subidos, no puedes agregar más.",
    });
  }

  next(); // Continúa hacia la subida de archivos si pasa la validación
};
