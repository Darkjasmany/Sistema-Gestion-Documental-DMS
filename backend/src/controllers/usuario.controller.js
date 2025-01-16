import bcrypt from "bcrypt";
import { Usuario } from "../models/Usuario.model.js";
import { Departamento } from "../models/Departamento.model.js";
// import { IntentoFallido } from "../models/IntentoFallido.models.js";
import { generarJWT } from "../utils/generarJWT.js";
import { generarId } from "../utils/generarId.js";
import {
  emailRegistro,
  emailOlvidePassword,
} from "../services/email.service.js";

export const registrarUsuario = async (req, res) => {
  // const { nombres, apellidos, email, password, departamentoId } = req.body;
  // const departamento = await Departamento.findByPk(departamentoId);

  const { nombres, apellidos, email, password } = req.body;

  // if (!nombres || !apellidos || !email || !password || !departamentoId)
  if (!nombres || !apellidos || !email || !password)
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

  //if (!departamento)
  //return res.status(400).json({ message: "Departamento no válido" });

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
      // departamentoId,
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
  res.status(200).json(usuario);
};

export const confirmarCuenta = async (req, res) => {
  // token es lo que enviamos en la url
  const { token } = req.params;
  const transaction = await Usuario.sequelize.transaction();

  try {
    const usuario = await Usuario.findOne({ where: { token } }, transaction);

    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ message: "Token no válido" });
    }

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
    await usuario.save({ transaction });

    await transaction.commit();

    res.status(200).json({ message: "Cuenta confirmada exitosamente" });
  } catch (error) {
    await transaction.rollback();
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
      where: { id: usuario.departamento_id },
      attributes: ["nombre", "coordinador_id"],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

    if (!usuario.confirmado) {
      return res
        .status(403)
        .json({ message: "Usuario no confirmado o suspendido" });
    }

    if (!usuario.estado === 0 || !usuario.estado) {
      return res.status(403).json({ message: "Usuario suspendido" });
    }

    if (usuario.departamento_id === null)
      return res.status(500).json({
        message:
          "El usuario no tiene asignado ningún departamento, comunicate con el departamento de Tecnología",
      });

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
      departamentoId: usuario.departamento_id,
      departamento: departamento.nombre,
      coordinadorId: departamento.coordinador_id,
    });
  } catch (error) {
    console.log(`Error al autenticar: ${error.message}`);
    return res.status(500).json({
      message: "Error al autenticar el usuario, intente nuevamente más tarde.",
    });
  }
};

export const olvidePassword = async (req, res) => {
  const transaction = await Usuario.sequelize.transaction();

  const { email } = req.body;

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    // if (!email || email.length < 6) {
    return res.status(400).json({ message: "Formato de email no válido" });
  }

  try {
    const usuario = await Usuario.findOne(
      { where: { email, confirmado: true, estado: true } },
      transaction
    );
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ message: "Usuario no existe" });
    }

    await usuario.update({ token: generarId() }, transaction);

    await transaction.commit();

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
    await transaction.rollback();
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
  const transaction = await Usuario.sequelize.transaction();

  try {
    const usuario = await Usuario.findOne(
      { where: { token, confirmado: true, estado: true } },
      transaction
    );
    if (!usuario) {
      await transaction.rollback();
      return res.status(400).json({ message: "Token no válido o expirado" });
    }

    usuario.token = null;
    usuario.password = password;

    await usuario.save({ transaction });

    await transaction.commit();

    return res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al actualizar la contraseña: ${error.message}`);
    return res.status(500).json({
      message:
        "Hubo un error al actualizar la contraseña, inténtalo más tarde.",
    });
  }
};

export const actualizarPerfil = async (req, res) => {
  const { nombres, apellidos, email } = req.body;
  const { id } = req.params;
  const transaction = await Usuario.sequelize.transaction();

  const usuario = await Usuario.findOne({
    where: { id, confirmado: true, estado: true },
  });

  if (!usuario) {
    await transaction.rollback();
    return res.status(400).json({ message: "Hubo un error" });
  }

  if (usuario.email !== email) {
    const existeEmail = await Usuario.findOne({ where: { email } });

    if (existeEmail) {
      await transaction.rollback();
      return res.status(400).json({ message: "Email ya registrado" });
    }
  }

  try {
    usuario.nombres = nombres || usuario.nombre;
    usuario.apellidos = apellidos || usuario.apellidos;

    const usuarioActualizado = await usuario.save({ transaction });

    await transaction.commit();

    res.json(usuarioActualizado);

    // return res
    //   .status(200)
    //   .json({ message: "Datos Actualizados Correctamente" });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al actualizar los datos: ${error.message}`);
    return res.status(500).json({
      message: "Hubo un error al actualizar los datos, inténtalo más tarde.",
    });
  }
};

export const actualizarPassword = async (req, res) => {
  // console.log(req.veterinario);
  // console.log(req.body);

  // Leer los datos
  const { id } = req.usuario;
  const { pwd_actual, pwd_nuevo } = req.body;

  console.log(req.usuario);
  console.log(req.body);

  return;

  // Comprobar que el veterinario existe
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ message: error.message });
  }

  // Comprobar su password con el que esta en la BD
  if (await usuario.comprobarPassword(pwd_actual)) {
    // CORRECTO
    // Almacenar el nuevo password
    usuario.password = pwd_nuevo;
    await usuario.save();
    res.json({ message: "Password Almacenado Correctamente" });
  } else {
    //INCORRECTO
    const error = new Error("El Password Actual es Incorrecto");
    return res.status(400).json({ message: error.message });
  }
};
