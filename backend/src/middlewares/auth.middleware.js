import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.model.js";
import { Departamento } from "../models/Departamento.model.js";

export const checkAuth = async (req, res, next) => {
  // TODO: lo estás asignando al objeto req en la propiedad usuario. Esto hace que el usuario autenticado esté disponible en todo el ciclo de vida de la solicitud (request), lo que te permite acceder a los datos del usuario desde cualquier otro middleware o controlador que venga después
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(403).json({ msg: "Token no Válido o Inexistente" });
  }

  const token = authorization.split(" ")[1]; // Separar el token cuando haya 1 espacio y devuelve un arreglo BEarer [0]: Token [1], aparece el token sin el Bearer

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // recibe el token, y la palabra reservada

    // * Almacenar al objeto req la propiedad del usuario almacenado en la BD
    req.usuario = await Usuario.findByPk(decoded.id, {
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
          model: Departamento,
          attributes: ["nombre", "coordinador_id"],
        },
      ],
    });

    // ** Después de la consulta, puedes renombrar el campo, esto se debe a una convención común en JavaScript y React para nombrar variables y propiedades
    if (req.usuario && req.usuario.departamento_id) {
      req.usuario.departamentoId = req.usuario.departamento_id;
      // delete req.usuario.Departamento.departamento_id; // Opcional: Eliminar el campo original
    }
    /*
    if (req.usuario && req.usuario.Departamento) {
      req.usuario.departamentoId = req.usuario.Departamento.departamento_id;
      delete req.usuario.Departamento.departamento_id; // Opcional: Eliminar el campo original
    }
*/
    // console.log(req.usuario);
    return next(); // Pasamos al siguiente middleware
  } catch (error) {
    console.log(`Token no Válido: ${error.message}`);
    return res.status(403).json({ msg: `Token no Válido: ${error.message}` });
  }
};
