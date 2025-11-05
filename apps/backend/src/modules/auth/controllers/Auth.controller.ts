import type { Request, Response } from "express";

import { User } from "../../administration/models/User.js";
import { EmailService } from "../services/email.service.js";
import { generateToken } from "../../../utils/token.js";
import { checkPassword } from "../../../utils/auth.js";
import { generarJWT } from "../../../utils/generarJWT.js";
import type {
  CreateUserInput,
  ValidateEmailInput,
  ValidateLoginInput,
  ValidateTokenInput,
  UpdatePasswordInput,
} from "@selnic/shared";

export class AuthController {
  static createAccount = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
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

  static confirmAccount = async (req: Request<{}, {}, ValidateTokenInput>, res: Response) => {
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
      await transaction.commit();
      res.send(
        "Cuenta confirmada correctamente, comuniquese con el departamento de Tecnología para que le asigne su rol y departamento"
      );
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).json({
        error: "Error al confirmar el usuario.",
      });
    }
  };

  static login = async (req: Request<{}, {}, ValidateLoginInput>, res: Response) => {
    const { email, password } = req.body;
    const transaction = await User.sequelize!.transaction();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await transaction.rollback();
      const error = new Error("Usuario no encontrado");
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
        const error = new Error("Contraseña incorrecta");
        return res.status(401).json({ error: error.message });
      }

      const jwt = generarJWT({ id: user.id });
      res.send({
        jwt,
        user,
      });
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request<{}, {}, ValidateEmailInput>, res: Response) => {
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

  static validateToken = async (req: Request<{}, {}, ValidateTokenInput>, res: Response) => {
    const { token } = req.body;

    try {
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
    req: Request<ValidateTokenInput, {}, UpdatePasswordInput>,
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
