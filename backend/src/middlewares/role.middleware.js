export const checkRole = (role) => (req, res, next) => {
  try {
    if (req.usuario.rol !== role)
      return res.status(403).json({
        message: "Acceso denegado. No tienes los permisos necesarios.",
      });

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error de autenticación o autorización." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.usuario.rol === "admin") return next();
  return res
    .status(403)
    .json({ message: "Acceso denegado para usuarios no admin." });
};
