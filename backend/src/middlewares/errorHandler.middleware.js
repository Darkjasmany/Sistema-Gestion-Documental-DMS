export const notFound = (req, res, next) => {
  const urlConfirmacion = `${process.env.FRONTEND_URL}/confirmar/`;
  const urlOlvide = `${process.env.FRONTEND_URL}/olvide-password/`;
  if (!urlConfirmacion || !req.originalUrl || !urlOlvide) {
    const error = new Error(`No se encontró la ruta - ${req.originalUrl}`);
    res.status(404);
    next(error);
  }

  // const error = new Error(`No se encontró la ruta - ${req.originalUrl}`);
  // res.status(404);
  // next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
