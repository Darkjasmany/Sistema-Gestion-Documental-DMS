import { Tarea } from "../models/Tarea.js";
import { Usuario } from "../models/Usuario.js";

export const registrar = async (req, res) => {
  // TODO leer datos de un formulario req.body
  // console.log(req.body); // Cuando se envian datos accedemos a ellos con req.body
  const { nombres, apellidos, email } = req.body;

  // TODO: Prevenir usuarios duplicados
  // En el model Usuario ya esta definido el campo unique: true, para el email, pero se hara una verificación
  const usuarioExiste = await Usuario.findOne({ email });
  if (usuarioExiste) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  // TODO: Guardar Nuevo Usuario
  try {
    const usuarioGuardado = await Usuario.create({
      nombres,
      apellidos,
      email,
    });

    res.json(usuarioGuardado);
  } catch (error) {
    console.error(`Error al registrar el Usuario: ${error}`);
  }
};

export const perfil = (req, res) => {
  res.json({ msg: "Mostrando Perfil ..." });
};

export const obtenerTareas = async (req, res) => {
  try {
    const { id } = req.params;
    const tareas = await Tarea.findAll({
      where: {
        usuarioId: id,
      },
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
