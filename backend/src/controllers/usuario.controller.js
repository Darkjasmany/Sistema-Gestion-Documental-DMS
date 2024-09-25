import bcrypt from "bcrypt";
import { Tarea } from "../models/Tarea.js";
import { Usuario } from "../models/Usuario.js";
import { generarJWT } from "../helpers/generarJWT.helpers.js";

export const registrar = async (req, res) => {
  // TODO leer datos enviados de un formulario con req.body
  const { nombres, apellidos, email, password } = req.body;

  // TODO: Validar que los campos obligatorios no estén vacíos
  if (!nombres || !apellidos || !email || !password)
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

  // TODO: Verificar si el email tiene un formato válido
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(email))
    return res.status(400).json({ message: "Email inválido" });

  // TODO: Validar que la contraseña tenga una longitud mínima
  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "La constraseña debe tener al menos 6 caracteres " });

  // TODO: Prevenir usuarios duplicados, en el model Usuario ya esta definido el campo unique: true, para el email, pero se hara una verificación complementaria
  const usuarioExiste = await Usuario.findOne({ where: { email } });
  if (usuarioExiste)
    return res.status(400).json({ message: "Usuario ya registrado" });

  // TODO: Guardar nuevo Usuario
  try {
    // Guardar usuario directamente con req.body
    // const usuarioGuardado = await Usuario.create(req.body);
    // Filtrar campos importantes para mayor seguridad y claridad
    const usuarioGuardado = await Usuario.create({
      nombres,
      apellidos,
      email,
      password,
    });

    return res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error(`Error al registrar el Usuario: ${error.message}`);
    return res.status(500).json({
      message: `Error al registrar el usuario: ${error.message}`,
    });
  }
};

export const perfil = (req, res) => {
  res.json({ msg: "Mostrando Perfil ..." });
};

export const confirmar = async (req, res) => {
  // TODO: token es lo que enviamos en la url
  const { token } = req.params;

  try {
    const usuarioConfirmar = await Usuario.findOne({ where: { token } });

    // TODO: Verificar si existe el token
    if (!usuarioConfirmar)
      return res.status(404).json({ message: "Token no válido" });

    // TODO: Actualizamos los datos del usuario
    usuarioConfirmar.set({
      token: null,
      confirmado: true,
      estado: true,
    });

    // TODO: Guardamos los cambios en la base de datos
    await usuarioConfirmar.save();

    res.status(200).json({ message: "Cuenta confirmada exitosamente" });
  } catch (error) {
    console.error(`Error al confirmar el usuario: ${error.message}`);
    return res.status(500).json({
      message: `Error al confirmar el usuario: ${error.message}`,
    });
  }
};

export const autenticar = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(404).json({ message: "Usuario no existe" });

    if (!usuario.confirmado)
      return res.status(403).json({ message: "El usuario no esta confirmado" });

    if (!usuario.estado)
      return res.status(403).json({ message: "El usuario esta suspendido" });

    // Comparar la contraseña ingresada con la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (passwordMatch) {
      res.status(200).json({
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        token: generarJWT(usuario.id),
      });
    } else {
      res.status(401).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.log(`Error al autenticar: ${error.message}`);
    return res.status(500).json({
      message: "Error al autenticar el usuario, intente nuevamente más tarde.",
    });
  }
};

export const obtenerTareas = async (req, res) => {
  const { id } = req.params;
  try {
    const tareas = await Tarea.findAll({
      where: { usuarioId: id },
    });
    res.status(200).json(tareas);
  } catch (error) {
    console.error(`Error al obtener las tareas del usuario : ${error.message}`);
    return res.status(500).json({
      message: `Error al obtener las tareas del usuario : ${error.message}`,
    });
  }
};
