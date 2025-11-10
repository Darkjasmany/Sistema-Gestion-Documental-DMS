import { z } from "zod";
import {
  currentPasswordValidation,
  emailValidation,
  nameValidation,
  passwordMatchSchema,
  tokenValidation,
} from "../../validations/auth.validations";

// Schema base para registro de usuario
export const registerBaseSchema = z
  .object({
    nombres: nameValidation("nombre"),
    apellidos: nameValidation("apellido"),
    email: emailValidation,
  })
  .merge(passwordMatchSchema);

export type RegisterInput = z.infer<typeof registerBaseSchema>;

// Schema para login de usuario
export const loginValidationSchema = z.object({
  email: emailValidation,
  password: passwordMatchSchema.shape.password,
});

export type LoginInput = z.infer<typeof loginValidationSchema>;

// Tipo simple para los parámetros de Express
export type TokenParams = {
  token: string;
};

// Schema para token de autenticación
export const tokenValidationSchema = z.object({
  token: tokenValidation,
});

export type TokenInput = z.infer<typeof tokenValidationSchema>;

// Schema para reset de contraseña
export const resetPasswordSchema = passwordMatchSchema;

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Schema para actualización de contraseña
export const updatePasswordSchema = z
  .object({
    current_password: currentPasswordValidation,
  })
  .merge(passwordMatchSchema)
  .refine(data => data.current_password !== data.password, {
    message: "La nueva contraseña debe ser diferente a la actual.",
    path: ["password"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

// Schema para validación para email
export const validateEmailSchema = z.object({
  email: emailValidation,
});

export type EmailInput = z.infer<typeof validateEmailSchema>;
