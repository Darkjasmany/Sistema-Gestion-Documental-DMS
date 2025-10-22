import nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from "./env.js";

const config = () => {
  return {
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  };
};

export const transporter = nodemailer.createTransport(config());
