import { ParametroSistema } from "../models/SystemParameter.model.js";
import { Op } from "sequelize";

// Tramites
export const listarTodosLosTramites = async (req, res) => {
  return res.send("Desde Lista Tramites ADMIN");
};

// Departamentos
export const listarTodosLosDepartamentos = async (req, res) => {
  return res.send("Desde Lista Departamentos ADMIN");
};

// Empleados
export const listarTodosLosEmpleados = async (req, res) => {
  return res.send("Desde Lista Empleados ADMIN");
};

// Todo: hacer las funcionalidades
export const asignarDepartamento = async (req, res) => {
  return res.send("Desde asignar Departamento ADMIN");
};

export const agregarParametros = async (req, res) => {
  const { clave, valor, descripcion } = req.body;
  if (
    !clave ||
    clave.trim() === "" ||
    !valor ||
    valor.trim() === "" ||
    !descripcion ||
    descripcion.trim() === ""
  )
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });

  const claveExiste = await ParametroSistema.findOne({
    where: {
      clave: {
        [Op.iLike]: clave,
      },
    },
  });

  if (claveExiste) return res.status(400).json({ message: "Clave Existente" });

  try {
    await ParametroSistema.create({
      clave,
      valor,
      descripcion,
      usuarioCreacionId: req.usuario.id,
    });

    res.json({ message: "Parametro agregado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listarParametros = async (req, res) => {
  try {
    const parametros = await ParametroSistema.findAll();
    res.json(parametros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarParametros = async (req, res) => {
  return res.send("Desde Actualizar Parametros ADMIN");
};

export const eliminarParametros = async (req, res) => {
  return res.send("Desde eliminar Parametros ADMIN");
};
