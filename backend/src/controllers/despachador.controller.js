import { Op } from "sequelize";
import { Despachador } from "../models/Despachador.model.js";
import { Departamento } from "../models/Departamento.model.js";

export const agregarDespachador = async (req, res) => {
  const { nombres, apellidos, departamentoId } = req.body;

  if (!nombres || !apellidos || !departamentoId)
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

  const despachadorExiste = await Despachador.findOne({
    where: {
      apellidos: { [Op.iLike]: apellidos },
      nombres: { [Op.iLike]: nombres },
    },
  });

  if (despachadorExiste)
    return res.status(400).json({ message: "Despachador ya Ingresado" });

  try {
    const despachadorGuardado = await Despachador.create({
      nombres,
      apellidos,
      departamento_id: departamentoId,
    });

    res.json(despachadorGuardado);
  } catch (error) {
    console.error(`Error al crear un despachador: ${error.message}`);
    return res.status(500).json({
      message: "Error al crear un despachador.",
    });
  }
};

export const cargarDespachadores = async (req, res) => {
  try {
    const despachadores = await Despachador.findAll({
      where: {
        activo: true,
      },
      attributes: ["id", "nombres", "apellidos"],
    });
  } catch (error) {
    console.error(`Error al cargar los empleados: ${error.message}`);
    return res.status(500).json({
      message: "Error al cargar los empleados.",
    });
  }
};

export const obtenerDespachadorPorDepartamento = async (req, res) => {
  try {
    const { departamentoId } = req.params;

    const despachadores = await Despachador.findAll({
      where: {
        departamento_id: departamentoId,
        activo: true,
      },
      attributes: ["id", "nombres", "apellidos"],
    });

    if (despachadores.length === 0)
      return res.status(404).json({
        message:
          "No se encontraron empleados para el departamento seleccionado",
      });

    return res.json(despachadores);
  } catch (error) {
    console.error(
      `Error al cargar los despachadores del departamento seleccionado: ${error.message}`
    );
    return res.status(500).json({
      message:
        "Error al cargar los despachadores del departamento seleccionado",
    });
  }
};
