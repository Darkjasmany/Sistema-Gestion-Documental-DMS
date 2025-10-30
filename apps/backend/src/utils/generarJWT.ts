import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

type UserPayload = {
  id: number;
};

export const generarJWT = (payload: UserPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
  });
};

//.sign(crear el JWT) -> recibe como parametro {}.Nombre, palabra secreta, tiempo en expirar
