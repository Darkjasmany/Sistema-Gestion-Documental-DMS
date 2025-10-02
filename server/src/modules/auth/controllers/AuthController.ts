import type { Request, Response } from "express";
import type { CreateUserInput } from "../../administration/types/schemas/userSchema.js";
import { User } from "../../administration/models/User.js";

export class AuthController {
  static createAccount = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response
  ) => {
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(409).json({ message: "Usuario ya registrado" });
    res.send("Cuenta creada, revisa tu email para confirmarla");
    try {
      await User.create(req.body);
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error al registrar el usuario.",
      });
    }
  };
}
