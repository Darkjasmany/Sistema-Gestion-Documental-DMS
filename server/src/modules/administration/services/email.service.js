// * Servicio para enviar correos electrónicos
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarEmail = async ({ email, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: "Sistema de Gestión Documental - DMS",
      to: email,
      subject,
      html,
    });
    console.log("Mensaje enviado: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error al enviar el correo: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const emailRegistro = async (datos) => {
  const { email, nombres, apellidos, token } = datos;
  const subject = "Comprueba tu cuenta en DMS";
  const html = `<p>Hola: ${nombres} ${apellidos}, comprueba tu cuenta en DMS.</p>
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a> </p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>`;

  return await enviarEmail({ email, subject, html });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombres, apellidos, token } = datos;
  const subject = "Comprueba tu cuenta en DMS";
  const html = `<p>Hola: ${nombres} ${apellidos}, has solicitado restablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>
        <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>`;

  return await enviarEmail({ email, subject, html });
};
