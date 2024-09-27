import { enviarEmail } from "./enviarEmail.js";

export const emailOlvidePassword = async (datos) => {
  const { email, nombres, apellidos, token } = datos;
  const subject = "Comprueba tu cuenta en DMS";
  const html = `<p>Hola: ${nombres} ${apellidos}, has solicitado restablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>
        <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>`;

  return await enviarEmail({ email, subject, html });
};
