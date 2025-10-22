export const generarHora = () => {
  const now = new Date(); // Crear una nueva instancia de Date
  return now.toTimeString().split(" ")[0]; // Obtener la hora en formato HH:MM:SS
};

/*toTimeString(): Este método devuelve la parte de tiempo de la fecha como una cadena, por ejemplo, "05:10:00 GMT-0500". Al dividir la cadena por espacio (split(" ")), tomamos la primera parte, que es "HH:MM:SS". */
