export const validarFecha = (fechaEnviada) => {
  // Obtenemos la fecha de hoy y la reseteamos a las 00:00:00
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Convertimos la fecha enviada a un objeto Date
  const fecha = new Date(fechaEnviada);

  // Si la fecha no es válida
  if (isNaN(fecha.getTime())) {
    return { valido: false, mensaje: "Fecha inválida" };
  }

  // Si la fecha enviada es anterior a hoy
  if (fecha < hoy) {
    return { valido: false, mensaje: "La fecha no puede ser anterior a hoy" };
  }

  // Si la fecha es válida
  return { valido: true };
};
