import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.model.js";
import { Departamento } from "../models/Departamento.model.js";

export const checkAuth = async (req, res, next) => {
  // TODO: lo estás asignando al objeto req en la propiedad usuario. Esto hace que el usuario autenticado esté disponible en todo el ciclo de vida de la solicitud (request), lo que te permite acceder a los datos del usuario desde cualquier otro middleware o controlador que venga después
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(403).json({ msg: "Token no Válido o Inexistente" });
  }

  try {
    const token = authorization.split(" ")[1]; // Separar el token cuando haya 1 espacio y devuelve un arreglo BEarer [0]: Token [1], aparece el token sin el Bearer
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // recibe el token, y la palabra reservada

    // * Almacenar al objeto req la propiedad del usuario almacenado en la BD
    req.usuario = await Usuario.findByPk(decoded.id, {
      attributes: [
        "id",
        "nombres",
        "apellidos",
        "email",
        "telefono",
        "rol",
        "departamentoId",
      ],
      include: [
        {
          model: Departamento,
          attributes: ["nombre", "coordinadorId"],
        },
      ],
    });

    return next(); // Pasamos al siguiente middleware
  } catch (error) {
    console.log(`Token no Válido: ${error.message}`);
    return res.status(403).json({ msg: `Token no Válido: ${error.message}` });
  }
};

export const checkRole = (req, res, next) => {
  console.log(req.usuario);

  return next();
};
