import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../modules/administration/models/User.js";
import { JWT_SECRET } from "../config/env.js";
import { Department } from "../modules/administration/models/Department.js";
import type { UserWithDepartment } from "../modules/administration/types/IUserDTO.js";

declare global {
  namespace Express {
    interface Request {
      //   user?: IUser;
      user?: UserWithDepartment;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization; // Obtenemos el token

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No Autorizado: Token ausente o mal formado" });
  }

  const token = bearer.split(" ")[1]; //const [, token] = bearer.split(" "); // desestructuración con fallback: Separar el token cuando haya 1 espacio y devuelve un arreglo Bearer [0]: Token [1], aparece el token sin el Bearer
  if (!token) {
    return res
      .status(401)
      .json({ error: "No Autorizado: Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded && typeof decoded === "object" && "id" in decoded) {
      if (typeof decoded === "object" && decoded.id) {
        const user = await User.findByPk(decoded.id, {
          attributes: [
            "id",
            "nombres",
            "apellidos",
            "email",
            "rol",
            "departamento_id",
          ],
          include: [
            {
              model: Department,
              attributes: ["nombre", "coordinador_id"],
            },
          ],
        });
        if (!user) {
          res.status(500).json({ error: "Token no Válido" });
        }
        req.user = user!;
      }
    }
  } catch (error) {
    res.status(403).json({ error: "Token no Válido" });
  }

  return next();
};
