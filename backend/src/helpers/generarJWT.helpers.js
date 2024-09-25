import jsonwebtoken from "jsonwebtoken";

export const generarJWT = (id) => {
  return (
    jsonwebtoken.sign({ id }, process.env.JWT_SECRET), { expiresIn: "30d" }
  );
};

//.sign(crear el JWT) -> Nombre, palabra secreta, tiempo en expirar
