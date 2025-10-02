import type { Request, Response } from "express";
import { User } from "../../administration/models/User.js";
import type { CreateUserInput } from "../../administration/types/IUser.js";

export class AuthController {
  static createAccount = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response
  ) => {
    const { nombres, apellidos, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(409).json({ message: "Usuario ya registrado" });

    try {
      const user = await User.create({
        nombres,
        apellidos,
        email,
        password,
      });

      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      return res.status(500).json({
        message: "Error al registrar el usuario.",
      });
    }
  };
}
