import { Tramite } from "../models/Tramite.model.js";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";

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
        departamentoUsuarioId: req.usuario.departamentoId,
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

export const obtenerTramiteRevisor = async (req, res) => {};
export const actualizarTramiteRevisor = async (req, res) => {};
