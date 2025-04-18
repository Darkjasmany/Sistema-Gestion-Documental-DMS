import { Op } from "sequelize";
import { Departamento } from "../models/Departamento.model.js";

export const agregarDepartamento = async (req, res) => {
  const { nombre, coordinadorId } = req.body;

  if (!nombre)
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

  const departamentoExiste = await Departamento.findOne({
    where: {
      nombre: {
        [Op.iLike]: nombre,
      },
    },
  });
  if (departamentoExiste)
    return res.status(400).json({ message: "Departamento ya Ingresado" });

  try {
    const departamentoGuardado = await Departamento.create({
      nombre,
      coordinador_id: coordinadorId,
    });

    res.json(departamentoGuardado);
  } catch (error) {
    console.error(`Error al crear un departamento: ${error.message}`);
    return res.status(500).json({
      message: "Error al crear un departamento.",
    });
  }
};

export const cargarDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();

    res.status(200).json(departamentos);
  } catch (error) {
    console.error(`Error al cargar los departamento: ${error.message}`);
    return res.status(500).json({
      message: "Error al cargar los departamento.",
    });
  }
};

export const obtenerDepartamento = async (req, res) => {
  try {
    const { id } = req.params;

    const departamento = await Departamento.findByPk(id);
    if (!departamento)
      return res.status(400).json({ message: "Departamento no válido" });

    res.status(200).json(departamento);
  } catch (error) {
    console.error(`Error al cargar el departamento: ${error.message}`);
    return res.status(500).json({
      message: "Error al cargar el departamento.",
    });
  }
};
export const actualizarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, coordinadorId } = req.body;

    const departamentoActualizado = await Departamento.findByPk(id);
    if (!departamentoActualizado)
      return res.status(400).json({ message: "Departamento no válido" });

    departamentoActualizado.nombre = nombre || departamentoActualizado.nombre;
    departamentoActualizado.coordinador_id =
      coordinadorId || departamentoActualizado.coordinador_id;

    await departamentoActualizado.save();

    res.status(200).json(departamentoActualizado);
  } catch (error) {
    console.error(`Error al actualizar un departamento: ${error.message}`);
    return res.status(500).json({
      message: "Error al actualizar un departamento.",
    });
  }
};

export const eliminarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;

    const departamento = await Departamento.findByPk(id);
    if (!departamento)
      return res.status(400).json({ message: "Departamento no válido" });

    await Departamento.destroy({ where: { id } });

    res.status(200).json({ message: "Departamento Eliminado" });
  } catch (error) {
    console.error(`Error al eliminar un departamento: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar un departamento.",
    });
  }
};
