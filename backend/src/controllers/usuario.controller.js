import bcrypt from "bcrypt";
import { Tramite } from "../models/Tramite.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { Departamento } from "../models/Departamento.model.js";
// import { IntentoFallido } from "../models/IntentoFallido.models.js";
import { generarJWT } from "../utils/generarJWT.js";
import { generarId } from "../utils/generarId.js";
import { emailOlvidePassword } from "../utils/emailOlvidePassword.js";
import { emailRegistro } from "../utils/emailRegistro.js";

export const registrarUsuario = async (req, res) => {
  const { nombres, apellidos, email, password, departamentoId } = req.body;
  const departamento = await Departamento.findByPk(departamentoId);

  if (!nombres || !apellidos || !email || !password || !departamentoId)
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(email))
    return res.status(400).json({ message: "Email inválido" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "La constraseña debe tener al menos 6 caracteres " });

  // Prevenir usuarios duplicados, en el model Usuario ya esta definido el campo unique: true, para el email, pero se hara una verificación complementaria
  const usuarioExiste = await Usuario.findOne({ where: { email } });
  if (usuarioExiste)
    return res.status(400).json({ message: "Usuario ya registrado" });

  if (!departamento)
    return res.status(400).json({ message: "Departamento no válido" });

  // Guardar nuevo Usuario
  try {
    // Guardar usuario directamente con req.body
    // const usuarioGuardado = await Usuario.create(req.body);
    // Filtrar campos importantes para mayor seguridad y claridad
    const usuarioGuardado = await Usuario.create({
      nombres,
      apellidos,
      email,
      password,
      departamentoId,
    });

    emailRegistro({ email, nombres, apellidos, token: usuarioGuardado.token });

    return res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error(`Error al registrar el usuario: ${error.message}`);
    return res.status(500).json({
      message: "Error al registrar el usuario.",
    });
  }
};

export const perfilUsuario = (req, res) => {
  const { usuario } = req;
  res.status(200).json({ usuario });
};

export const confirmarCuenta = async (req, res) => {
  // token es lo que enviamos en la url
  const { token } = req.params;

  try {
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) return res.status(404).json({ message: "Token no válido" });

    // Actualizamos los datos del usuario
    /* usuario.set({
      token: null,
      confirmado: true,
      estado: true,
    });*/
    // Esto elimina el uso del SET
    usuario.token = null;
    usuario.confirmado = true;
    usuario.estado = true;

    // Guardamos los cambios en la base de datos
    await usuario.save();

    res.status(200).json({ message: "Cuenta confirmada exitosamente" });
  } catch (error) {
    console.error(`Error al confirmar el usuario: ${error.message}`);
    return res.status(500).json({
      message: "Error al confirmar el usuario",
    });
  }
};

export const autenticarUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    const departamento = await Departamento.findOne({
      where: { id: usuario.departamentoId },
      attributes: ["nombre", "coordinadorId"],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

    if (!usuario.confirmado || !usuario.estado) {
      return res
        .status(403)
        .json({ message: "Usuario no confirmado o suspendido" });
    }

    if (usuario.departamentoId === null)
      return res
        .status(500)
        .json("El usuario no tiene asignado ningún departamento");

    if (!departamento)
      return res.status(404).json("El departamento asignado no existe");

    // * Comparar la contraseña ingresada con la contraseña hasheada
    if (!(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol,
      token: generarJWT(usuario.id),
      departamentoId: usuario.departamentoId,
      departamento: departamento.nombre,
      coordinadorId: departamento.coordinadorId,
    });
  } catch (error) {
    console.log(`Error al autenticar: ${error.message}`);
    return res.status(500).json({
      message: "Error al autenticar el usuario, intente nuevamente más tarde.",
    });
  }
};

export const olvidePassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: "Formato de email no válido" });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: "Usuario no existe" });

    await usuario.update({ token: generarId() });

    await emailOlvidePassword({
      email,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      token: usuario.token,
    });

    res.status(200).json({
      message: "Se ha enviado un correo para restablecer su contraseña",
    });
  } catch (error) {
    console.log(`Error al recuperar Password: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al recuperar el password del usuario, intente nuevamente más tarde.",
    });
  }
};

export const comprobarToken = async (req, res) => {
  const { token } = req.params;

  try {
    const tokenValido = await Usuario.findOne({ where: { token } });
    if (!tokenValido)
      return res.status(400).json({ message: "Token no válido o expirado" });

    return res.status(200).json({ message: "Token válido" });
  } catch (error) {
    console.error(`Error al validar token: ${error.message}`);
    return res.status(500).json({
      message: "Hubo un error al validar el token, inténtalo más tarde.",
    });
  }
};

export const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario)
      return res.status(400).json({ message: "Token no válido o expirado" });

    usuario.token = null;
    usuario.password = password;
    await usuario.save();

    return res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(`Error al actualizar la contraseña: ${error.message}`);
    return res.status(500).json({
      message:
        "Hubo un error al actualizar la contraseña, inténtalo más tarde.",
    });
  }
};

export const obtenerTramitesUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const tramitesUsuario = await Tramite.findAll({
      where: { usuarioId: id },
      attributes: { exclude: ["createdAt", "updatedAt", "usuarioId"] },
    });

    res.status(200).json(tramitesUsuario);
  } catch (error) {
    console.error(`Error al obtener las tareas del usuario : ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener las tareas del usuario, intente nuevamente más tarde.",
    });
  }
};
