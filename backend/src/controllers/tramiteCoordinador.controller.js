import { Tramite } from "../models/Tramite.model.js";

export const obtenerTramitesPorEstado = async (req, res) => {
  try {
    const { estado } = req.query; // envio como parametro en la URL
    if (!estado)
      return res.status(400).json({ message: "El estado es requerido" });

    const { departamentoId } = req.usuario;

    const tramites = await Tramite.findAll({
      where: {
        estado: estado,
        departamentoUsuarioId: departamentoId,
      },
    });

    res.json(tramites);
  } catch (error) {
    console.error(`Error al obtener los trámites ${estado}: ${error.message}`);
    return res.status(500).json({
      message: `Error al obtener los trámites ${estado}, intente nuevamente más tarde.`,
    });
  }
};

export const obtenerTramite = async (req, res) => {
  res.send("Desde obtenerTramite1 ");
};

export const actualizarTramite = async (req, res) => {
  res.send("Desde actualizarTramite");
};

export const asignarRevisor = async (req, res) => {
  res.send("Desde asignarRevisor");
};

export const eliminarTramite = async (req, res) => {
  res.send("Desde eliminarTramite");
};
