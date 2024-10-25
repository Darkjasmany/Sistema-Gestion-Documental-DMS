import { Tramite } from "../models/Tramite.model.js";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";
import { validarFecha } from "../utils/validarFecha.js";

export const listarTramitesRevisor = async (req, res) => {
  const { estado } = req.query;
  if (!estado)
    return res.status(400).json({ message: "El estado es requerido" });

  try {
    const config = await getConfiguracionPorEstado(estado);
    if (!config)
      return res.status(400).json({
        message: `No se encontró una configuración válida para el estado: ${estado}`,
      });

    const tramite = await Tramite.findAll({
      where: {
        departamentoTramiteId: req.usuario.departamentoId,
        usuarioRevisorId: req.usuario.id,
        estado,
        activo: true,
      },
      attributes: config.attributes,
      include: config.include,
      order: [
        ["prioridad", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    res.json(tramite);
  } catch (error) {
    console.error(
      `Error al obtener los trámites con estado: ${estado}: ${error.message}`
    );
    return res.status(500).json({
      message: `Error al obtener los trámites con estado: ${estado}, intente nuevamente más tarde.`,
    });
  }
};

export const obtenerTramiteRevisor = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findOne({
      where: { id, estado: "PENDIENTE", activo: true },
    });
    if (!tramite) return res.status(404).json({ message: "No encontrado" });

    if (
      tramite.usuarioRevisorId.toString() !== req.usuario.id.toString() ||
      tramite.departamentoTramiteId.toString() !==
        req.usuario.departamentoId.toString()
    )
      return res
        .status(404)
        .json({ message: "El trámite seleccionado no te pertenece" });

    const archivos = await TramiteArchivo.findAll({ where: { tramiteId: id } });

    res.json({ tramite, archivos });
  } catch (error) {
    console.error(`Error al obtener el trámite seleccionado: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener el trámite seleccionado, intente nuevamente más tarde.",
    });
  }
};
export const actualizarTramiteRevisor = async (req, res) => {
  const { id } = req.params;

  const {
    numeroOficioDespacho,
    departamentoDestinatarioId,
    destinatarioId,
    referenciaTramite,
    fechaDespacho,
    observacion,
  } = req.body;

  if (
    !numeroOficioDespacho ||
    numeroOficioDespacho.trim() === "" ||
    !departamentoDestinatarioId ||
    !destinatarioId ||
    !observacion ||
    observacion.trim() === ""
  ) {
    return res.status(400).json({
      message: "Todos los campos obligatorios",
    });
  }

  const tramite = await Tramite.findOne({
    where: { id, estado: "PENDIENTE", activo: true },
  });

  if (!tramite) {
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (
    tramite.usuarioRevisorId.toString() !== req.usuario.id.toString() ||
    tramite.departamentoTramiteId.toString() !==
      req.usuario.departamentoId.toString()
  ) {
    return res
      .status(404)
      .json({ message: "El trámite seleccionado no te pertenece" });
  }

  const { valido, mensaje } = validarFecha(fechaDespacho);
  if (!valido) {
    return res.status(400).json({ error: mensaje });
  }

  console.log(req.body);
};
