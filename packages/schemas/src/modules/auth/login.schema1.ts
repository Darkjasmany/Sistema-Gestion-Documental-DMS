import { z } from "zod";
import { userBaseSchema } from "../../models/user.model";

// Esquema de Zod
export const createUserSchema = z.object({
  nombres: userBaseSchema.shape.nombres
    .min(1, "Los nombres son obligatorios")
    .max(100, "Los nombres no pueden exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "Los nombres solo pueden contener letras"
    ),

  apellidos: userBaseSchema.shape.apellidos
    .min(1, "Los apellidos son obligatorios")
    .max(100, "Los apellidos no pueden exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "Los apellidos solo pueden contener letras"
    ),

  email: userBaseSchema.shape.email
    .email("El email no es válido")
    .toLowerCase()
    .trim(),

  password: userBaseSchema.shape.password
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener mayúsculas, minúsculas y números"
    ),
});
// Exportar todos los tipos de entrada (Input Types)
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const validateTokenSchema = z.object({
  token: userBaseSchema.shape.token
    .length(6, "El token debe tener exactamente 6 caracteres")
    .regex(/^[0-9]+$/, "El token solo puede contener números"),
});
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;

export const loginSchema = z.object({
  email: userBaseSchema.shape.email
    .email("El email no es válido")
    .toLowerCase()
    .trim(),
  password: userBaseSchema.shape.password
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
});
export type ValidateLoginInput = z.infer<typeof loginSchema>;

export const validateEmailSchema = loginSchema.pick({
  email: true,
});
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;

export const validateUpdatePasswordSchema = z
  .object({
    password: userBaseSchema.shape.password
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña no puede exceder 50 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener mayúsculas, minúsculas y números"
      ),

    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

export type ValidateUpdatePasswordInput = z.infer<
  typeof validateUpdatePasswordSchema
>;
