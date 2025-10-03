import type { Request, Response } from "express";
import type {
  CreateUserInput,
  ValidateTokenInput,
} from "../../administration/types/schemas/userSchema.js";
import { User } from "../../administration/models/User.js";
import { EmailService } from "../services/emailService.js";
import { generateToken } from "../../../utils/token.js";

export class AuthController {
  static createAccount = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response
  ) => {
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(409).json({ message: "Usuario ya registrado" });
    try {
      const user = new User(req.body);
      const token = generateToken();
      user.token = token;
      await user.save();

      EmailService.emailConfirmation({
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        token: user.token,
      });
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error al registrar el usuario.",
      });
    }
  };

  static confirmAccount = async (
    req: Request<{}, {}, ValidateTokenInput>,
    res: Response
  ) => {};
}
