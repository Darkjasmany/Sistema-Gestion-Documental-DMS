import { Tramite } from "../models/Tramite.model.js";

export const obtenerTramitesPorEstado = async (req, res) => {
  const { estado } = req.query; // envio como parametro en la URL
  console.log(estado);

  const tramites = await Tramite.findAll({
    where: {
      estado: estado,
    },
  });

  res.json(tramites);
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
