import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "src/models/User";
import { JWT_SECRET } from "../config/env.js";

// Interfaz para el contenido desencriptado del Token
interface JwtPayload {
  id: number; // o string, dependiendo de tu ID
  iat: number;
  exp: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No Autorizado: Falta token" });
    }

    // Extraer el token del formato "Bearer"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    // Verificar  el token
    // 'decoded' tendrá la info que guardaste al hacer login (id, email, etc.)
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Buscamos el usuario en la BD
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ message: "Token válido, pero el usuario ya no existe" });
    }

    // Adjuntar usuario a Request
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token Inválido o Expirado" });
  }
};
