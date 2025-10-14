// packages/validation/auth.schema.ts
import { z } from "zod";
import { userSchema } from "./userSchema";

export const createUserSchema = z.object({
  nombres: userSchema.shape.nombres.min(1, "Los nombres son obligatorios"),
  apellidos: userSchema.shape.apellidos.min(
    1,
    "Los apellidos son obligatorios"
  ),
  email: userSchema.shape.email.email("El email no es válido"),
  password: userSchema.shape.password.min(
    8,
    "La contraseña debe tener al menos 8 caracteres"
  ),
});

export const validateTokenSchema = z.object({
  token: userSchema.shape.token.length(6, "El token debe tener 6 caracteres"),
});

export const validateLoginSchema = z.object({
  email: userSchema.shape.email.email("El email no es válido"),
  password: userSchema.shape.password.nonempty(
    "La contraseña no puede ir vacía"
  ),
});

export const validateEmailSchema = validateLoginSchema.pick({ email: true });

export const validateUpdatePasswordSchema = z
  .object({
    password: userSchema.shape.password.min(
      8,
      "La contraseña debe tener al menos 8 caracteres"
    ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });
