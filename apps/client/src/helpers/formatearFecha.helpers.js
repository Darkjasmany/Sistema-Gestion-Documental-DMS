export const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha"; // Si es null o undefined, devuelve un texto por defecto
  const nuevaFecha = new Date(fecha);
  if (isNaN(nuevaFecha)) return "Fecha Invalida"; // Si la fecha no es válida, evita errores
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
    nuevaFecha
  );
};
