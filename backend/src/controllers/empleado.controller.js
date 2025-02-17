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
      attributes: ["id", "cedula", "nombres", "apellidos", "email"],
    });
    res.json(empleados);
  } catch (error) {
    console.error(`Error al cargar los empleados: ${error.message}`);
    return res.status(500).json({
      message: "Error al cargar los empleados.",
    });
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
  try {
    const { id } = req.params;
    const { cedula, nombres, apellidos, email, departamentoId } = req.body;

    const empleadoActualizar = await Empleado.findByPk(id);
    if (!empleadoActualizar)
      return res.status(400).json({ message: "Empleado no válido" });

    empleadoActualizar.cedula = cedula || empleadoActualizar.cedula;
    empleadoActualizar.nombres = nombres || empleadoActualizar.nombres;
    empleadoActualizar.apellidos = apellidos || empleadoActualizar.apellidos;
    empleadoActualizar.email = email || empleadoActualizar.email;
    empleadoActualizar.departamento_id =
      departamentoId || empleadoActualizar.departamento_id;

    await empleadoActualizar.save();

    res.json(empleadoActualizar);
  } catch (error) {
    console.error(`Error al actualizar el empleado: ${error.message}`);
    return res.status(500).json({
      message: "Error al actualizar el empleado.",
    });
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id);
    if (!empleado)
      return res.status(400).json({ message: "Empleado no válido" });

    await Empleado.destroy({ where: { id } });
  } catch (error) {
    console.error(`Error al eliminar el empleado: ${error.message}`);
    return res.status(500).json({
      message: "Error al eliminar el empleado.",
    });
  }
};
