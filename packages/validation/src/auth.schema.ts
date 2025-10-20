import { userBaseSchema } from "./user.schema";

import { z } from "zod";

// Esquema de Zod
export const createUserSchema = z.object({
  nombres: userBaseSchema.shape.nombres,
  apellidos: userBaseSchema.shape.apellidos,
  email: userBaseSchema.shape.email,
  password: userBaseSchema.shape.password,
});

export const validateTokenSchema = z.object({
  token: userBaseSchema.shape.token,
});

export const validateLoginSchema = z.object({
  email: userBaseSchema.shape.email,
  password: userBaseSchema.shape.password.nonempty(
    "La contraseña no puede ir vacia"
  ),
});

export const validateEmailSchema = validateLoginSchema.pick({
  email: true,
});

export const validateUpdatePasswordSchema = z
  .object({
    password: userBaseSchema.shape.password.min(
      8,
      "La constraseña debe tener al menos 8 caracteres"
    ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las constraseñas no coinciden",
    path: ["passwordConfirmation"], // el error se asigna a este campo
  });

// Exportar todos los tipos de entrada (Input Types)

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;
export type ValidateLoginInput = z.infer<typeof validateLoginSchema>;
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
export type ValidateUpdatePasswordInput = z.infer<
  typeof validateUpdatePasswordSchema
>;
