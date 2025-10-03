import { transporter } from "../../../config/nodemailer.js";
import { FRONTEND_URL } from "../../../config/env.js";

interface IEmail {
  email: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static sendEmail = async (data: IEmail) => {
    const info = await transporter.sendMail({
      from: "Sistema Estratégico para la Logística y la Gestión de Negocios Inteligentes - SELNIC",
      to: data.email,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });
    console.log("Mensaje enviado", info.messageId);
  };

  static emailConfirmation = async (datos: {
    email: string;
    nombres: string;
    apellidos: string;
    token: string;
  }) => {
    const { email, nombres, apellidos, token } = datos;

    const subject = "SELNIC - Confirma tu cuenta";
    const html = `<p>Hola: ${nombres} ${apellidos}, has creado tu cuenta en SELNIC, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `;
    return await this.sendEmail({ email, subject, html });
  };

  static emailResetPassword = async (datos: {
    email: string;
    nombres: string;
    apellidos: string;
    token: string;
  }) => {
    const { email, nombres, apellidos, token } = datos;

    const subject = "SELNIC - Recuperar contraseña";
    const html = `<p>Hola: ${nombres} ${apellidos}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `;

    await this.sendEmail({ email, subject, html });
  };
}
