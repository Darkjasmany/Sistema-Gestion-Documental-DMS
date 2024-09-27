import bcrypt from "bcrypt";
import { Tarea } from "../models/Tarea.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { generarJWT } from "../utils/generarJWT.js";
import { generarId } from "../utils/generarId.js";
import { enviarOlvidePassword } from "../utils/enviarOlvidePassword.js";

export const registrarUsuario = async (req, res) => {
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
    console.error(`Error al registrar el usuario: ${error.message}`);
    return res.status(500).json({
      message: "Error al registrar el usuario.",
    });
  }
};

export const perfilUsuario = (req, res) => {
  const { usuario } = req;

  res.status(200).json({ usuario });
  // res.status(200).json({ perfil: usuario }); // indicar como queremos llamar al objeto
};

export const confirmarCuenta = async (req, res) => {
  // TODO: token es lo que enviamos en la url
  const { token } = req.params;

  try {
    const usuarioConfirmar = await Usuario.findOne({ where: { token } });

    // TODO: Verificar si existe el token
    if (!usuarioConfirmar)
      return res.status(404).json({ message: "Token no válido" });

    // TODO: Actualizamos los datos del usuario
    /* usuarioConfirmar.set({
      token: null,
      confirmado: true,
      estado: true,
    });*/
    // TODO: Esto elimina el uso del SET
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.estado = true;

    // TODO: Guardamos los cambios en la base de datos
    await usuarioConfirmar.save();

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
    const usuarioAutenticar = await Usuario.findOne({ where: { email } });

    if (!usuarioAutenticar)
      return res.status(404).json({ message: "Usuario no existe" });

    if (!usuarioAutenticar.confirmado)
      return res.status(403).json({ message: "El usuario no esta confirmado" });

    if (!usuarioAutenticar.estado)
      return res.status(403).json({ message: "El usuario esta suspendido" });

    // TODO: Comparar la contraseña ingresada con la contraseña hasheada
    if (!(await bcrypt.compare(password, usuarioAutenticar.password))) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      id: usuarioAutenticar.id,
      nombres: usuarioAutenticar.nombres,
      apellidos: usuarioAutenticar.apellidos,
      email: usuarioAutenticar.email,
      rol: usuarioAutenticar.rol,
      token: generarJWT(usuarioAutenticar.id),
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

  // Validar formato de email
  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: "Formato de email no válido" });
  }

  try {
    const usuarioOlvide = await Usuario.findOne({ where: { email } });
    if (!usuarioOlvide)
      return res.status(404).json({ message: "Usuario no existe" });

    // Actualizar el token del usuario
    await usuarioOlvide.update({ token: generarId() });

    enviarOlvidePassword({
      email,
      nombres: usuarioOlvide.nombres,
      apellidos: usuarioOlvide.apellidos,
      token: usuarioOlvide.token,
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
    const usuarioExiste = await Usuario.findOne({ where: { token } });
    if (!usuarioExiste)
      return res.status(400).json({ message: "Token no válido o expirado" });

    usuarioExiste.token = null;
    usuarioExiste.password = password;
    await usuarioExiste.save();

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

export const obtenerTareasUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const tareasUsuario = await Tarea.findAll({
      where: { usuarioId: id },
    });
    res.status(200).json(tareasUsuario);
  } catch (error) {
    console.error(`Error al obtener las tareas del usuario : ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener las tareas del usuario, intente nuevamente más tarde.",
    });
  }
};
