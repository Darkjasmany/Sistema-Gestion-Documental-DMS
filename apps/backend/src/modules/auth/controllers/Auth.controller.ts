import type { Request, Response } from "express";

import type {
  EmailInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  TokenInput,
  TokenParams,
} from "@selnic/shared";
import { Role } from "src/models/Role.js";
import { UserRole } from "src/models/UserRole.js";
import { getUserPermissionsAndModules } from "src/modules/administration/services/permissions.service.js";
import { User } from "../../../models/User.js";
import { checkPassword } from "../../../utils/auth.js";
import { generarJWT } from "../../../utils/generarJWT.js";
import { generateToken } from "../../../utils/token.js";
import { EmailService } from "../services/email.services.js";

export class AuthController {
  static createAccount = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    const { email } = req.body;
    const transaction = await User.sequelize!.transaction();

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      await transaction.rollback();
      const error = new Error("Usuario ya registrado");
      return res.status(409).json({ error: error.message });
    }
    try {
      const user = new User(req.body);
      const token = generateToken();
      user.token = token;
      await user.save({ transaction });
      await transaction.commit();

      EmailService.emailConfirmation({
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        token: user.token,
      });
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      await transaction.rollback();

      console.log(error);
      return res.status(500).json({
        error: "Error al registrar el usuario.",
      });
    }
  };

  static confirmAccount = async (req: Request<{}, {}, TokenInput>, res: Response) => {
    const { token } = req.body;
    const transaction = await User.sequelize!.transaction();
    const userExists = await User.findOne({ where: { token } });
    if (!userExists) {
      await transaction.rollback();
      const error = new Error("Token no válido");
      return res.status(409).json({ error: error.message });
    }

    try {
      userExists.token = " ";
      userExists.confirmado = true;
      userExists.estado = true;

      await userExists.save({ transaction });

      // Definir el rol USUARIO por defecto al confirmar la cuenta
      const rol = await Role.findOne({ where: { nombre: "USUARIO" } });
      if (rol) {
        await UserRole.create({ usuario_id: userExists.id, rol_id: rol.id }, { transaction });
      }

      await transaction.commit();

      res
        .status(200)
        .send(
          "Cuenta confirmada correctamente, comuniquese con el departamento de Tecnología para que le asigne sus permisos de acceso y departamento"
        );
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).json({
        error: "Error al confirmar el usuario.",
      });
    }
  };

  static login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;
    const transaction = await User.sequelize!.transaction();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await transaction.rollback();
      const error = new Error("Credenciales inválidas");
      return res.status(404).json({ error: error.message });
    }

    if (!user.confirmado) {
      const token = generateToken();
      user.token = token;
      await user.save({ transaction });
      await transaction.commit();

      EmailService.emailConfirmation({
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        token: user.token,
      });

      const error = new Error(
        "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación"
      );
      return res.status(401).json({ error: error.message });
    }

    if (user.departamento_id === null) {
      const error = new Error(
        "El usuario no tiene asignado ningún departamento, comunicate con el departamento de Tecnología"
      );
      return res.status(500).json({
        error: error.message,
      });
    }

    try {
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Credenciales inválidas");
        return res.status(401).json({ error: error.message });
      }

      const jwt = generarJWT({ id: user.id });

      const { permissions, modules } = await getUserPermissionsAndModules(user.id);
      res.json({
        user: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          rol: user.rol, //!este rol es provisional porque lo voy a manejar desde otra tabla
          departamento_id: user.departamento_id,
        },
        jwt,
        permissions,
        modules,
      });
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request<{}, {}, EmailInput>, res: Response) => {
    const { email } = req.body;
    const transaction = await User.sequelize!.transaction();
    const user = await User.findOne({ where: { email } });
    if (!user) {
      await transaction.rollback();
      const error = new Error("El Usuario no esta registrado");
      return res.status(404).json({ error: error.message });
    }

    try {
      const token = generateToken();
      user.token = token;
      await user.save({ transaction });
      await transaction.commit();

      EmailService.emailResetPassword({
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        token: user.token,
      });

      res.send("Revisa tu email para instrucciones");
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).json({
        error: "Error al restaurar el password.",
      });
    }
  };

  static validateToken = async (req: Request<{}, {}, TokenInput>, res: Response) => {
    try {
      const { token } = req.body;
      console.log(token);

      const tokenExists = await User.findOne({ where: { token } });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      res.send("Token válido, Define tu nuevo password");
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Error al validar el token.",
      });
    }
  };

  static updatePasswordWithToken = async (
    req: Request<TokenParams, {}, ResetPasswordInput>,
    res: Response
  ) => {
    // token viene en params (/:token), el body contiene password y passwordConfirmation (ya validados por Zod)
    const { token } = req.params;
    const { password } = req.body;
    const transaction = await User.sequelize!.transaction();
    try {
      const userExists = await User.findOne({
        where: { token, confirmado: true, estado: true },
      });
      if (!userExists) {
        await transaction.rollback();
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      userExists.password = password;
      userExists.token = "";

      await userExists.save({ transaction });
      await transaction.commit();

      return res.send("Password actualizado correctamente");
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).json({
        error: "Error al actualizar el password.",
      });
    }
  };
}
