import { Departamento } from "../models/Departamento.model.js";

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

    res.status(400).json(departamento);
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
    departamentoActualizado.coordinadorId =
      coordinadorId || departamentoActualizado.coordinadorId;

    await tramiteActualizado.save();

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
