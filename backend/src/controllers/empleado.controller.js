import { Op } from "sequelize";
import { Empleado } from "../models/Empleado.model.js";
import { Departamento } from "../models/Departamento.model.js";

export const agregarEmpleado = async (req, res) => {
  const { cedula, nombres, apellidos, email, departamentoId } = req.body;

  if (!cedula || !nombres || !apellidos || !email || !departamentoId)
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

  if (cedula.length !== 10) {
    return res
      .status(400)
      .json({ message: "La cedula debe contener 10 caracteres " });
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(email))
    return res.status(400).json({ message: "Email inválido" });

  const empleadoExiste = await Empleado.findOne({
    where: {
      cedula: cedula, // Igualdad directa en lugar de ILIKE
    },
  });
  if (empleadoExiste)
    return res.status(400).json({ message: "Empleado ya registrado" });

  const emailRegistrado = await Empleado.findOne({
    where: {
      email: {
        [Op.iLike]: email,
      },
    },
  });
  if (emailRegistrado)
    return res.status(400).json({ message: "El email ya está registrado" });

  const departamento = await Departamento.findByPk(departamentoId);
  if (!departamento)
    return res.status(400).json({ message: "Departamento no válido" });

  try {
    const empleadoCreado = await Empleado.create({
      cedula,
      nombres,
      apellidos,
      email,
      departamento_id: departamentoId,
    });

    res.status(201).json(empleadoCreado);
  } catch (error) {
    console.error(`Error al registrar el empleado: ${error.message}`);
    return res.status(500).json({
      message: "Error al registrar el empleado.",
    });
  }
};

export const cargarEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      where: {
        activo: true,
      },
      attributes: [
        "id",
        "cedula",
        "nombres",
        "apellidos",
        "email",
        "departamento_id",
      ], // Asegúrate de incluir los campos necesarios
      include: [
        {
          model: Departamento,
          attributes: ["nombre"], // Incluye el nombre del departamento
        },
      ],
    });
    res.json(empleados);
  } catch (error) {
    console.error(`Error al cargar empleados: ${error.message}`);
    return res.status(500).json({ message: "Error al cargar empleados." });
  }
};

export const obtenerEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id);
    if (!empleado)
      return res.status(400).json({ message: "Empleado no válido" });

    res.json(empleado);
  } catch (error) {
    console.error(`Error al cargar el empleado: ${error.message}`);
    return res.status(500).json({
      message: "Error al cargar el empleado.",
    });
  }
};

export const obtenerEmpleadoPorDepartamento = async (req, res) => {
  try {
    const { departamentoId } = req.params;

    const empleados = await Empleado.findAll({
      where: {
        departamento_id: departamentoId,
        activo: true,
      },
      attributes: ["id", "cedula", "nombres", "apellidos", "email"],
    });

    if (empleados.length === 0)
      return res.status(404).json({
        message:
          "No se encontraron empleados para el departamento seleccionado",
      });

    return res.json(empleados);
  } catch (error) {
    console.error(
      `Error al cargar los empleados del departamento seleccionado: ${error.message}`
    );
    return res.status(500).json({
      message: "Error al cargar los empleados del departamento seleccionado",
    });
  }
};

export const actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { cedula, nombres, apellidos, email, departamentoId } = req.body;

  if (!cedula || !nombres || !apellidos || !email || !departamentoId)
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado)
      return res.status(404).json({ message: "Empleado no encontrado" });

    await empleado.update({
      cedula,
      nombres,
      apellidos,
      email,
      departamento_id: departamentoId,
    });

    res.json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    console.error(`Error al actualizar el empleado: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Error al actualizar el empleado." });
  }
};

export const eliminarEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado)
      return res.status(404).json({ message: "Empleado no encontrado" });

    await empleado.update({ activo: false });

    res.json({ message: "Empleado desactivado correctamente" });
  } catch (error) {
    console.error(`Error al eliminar el empleado: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Error al desactivar el empleado." });
  }
};
