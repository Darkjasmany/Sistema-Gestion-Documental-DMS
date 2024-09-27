import { enviarEmail } from "./enviarEmail";

export const emailRegistro = async (datos) => {
  const { email, nombres, apellidos, token } = datos;
  const subject = "Comprueba tu cuenta en DMS";
  const html = `<p>Hola: ${nombres} ${apellidos}, comprueba tu cuenta en DMS.</p>
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a> </p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>`;

  return await enviarEmail({ email, subject, html });
};
