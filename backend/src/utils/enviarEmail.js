import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarEmail = async ({ email, subject, html }) => {
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
