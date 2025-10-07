import { userSchema } from "../../administration/schemas/index.js";

import { check, z } from "zod";

// Esquema de Zod
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
  token: userSchema.shape.token.length(
    6,
    "El token no puede ir vacio o tener mas de 6 caracteres"
  ),
});

export const validateLoginSchema = z.object({
  email: userSchema.shape.email.email("El email no es valido"),
  password: userSchema.shape.password.nonempty(
    "La contraseña no puede ir vacia"
  ),
});

export const validateEmailSchema = validateLoginSchema.pick({
  email: true,
});

export const validateUpdatePasswordSchema = z
  .object({
    password: userSchema.shape.password.min(
      8,
      "La constraseña debe tener al menos 8 caracteres"
    ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las constraseñas no coinciden",
    path: ["passwordConfirmation"], // el error se asigna a este campo
  });

// Tipado - tipo inferido de ese esquema
export type CreateUserInput = z.infer<typeof createUserSchema>;

export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;

export type ValidateLoginInput = z.infer<typeof validateLoginSchema>;

export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;

export type ValidateUpdatePasswordInput = z.infer<
  typeof validateUpdatePasswordSchema
>;
