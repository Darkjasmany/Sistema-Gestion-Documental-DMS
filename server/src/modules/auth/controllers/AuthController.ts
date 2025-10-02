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

    try {
      await User.create(req.body); // ✅ Ya no da error
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      return res.status(500).json({
        message: "Error al registrar el usuario.",
      });
    }
  };
}
