export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Manejo de errores de Multer
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Manejo de otros errores
    return res.status(500).json({ error: "Error en el servidor." });
  }
  next();
};
