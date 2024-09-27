import nodemailer from "nodemailer";

export const enviarOlvidePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombres, apellidos, token } = datos;

  const info = await transporter.sendMail({
    from: "Sistema de Gestión Documental - DMS",
    to: email,
    subject: "Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${nombres} ${apellidos}, has solicitado reestablecer tu password.</p>

        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};
