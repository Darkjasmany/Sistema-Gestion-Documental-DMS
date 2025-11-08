import { z } from "zod";
import { userBaseSchema } from "../../models/user.model";

/**
 * ============================================
 * VALIDACIONES DE AUTENTICACIÓN
 * ============================================
 */

// Validación para registro de usuario
export const registerValidationSchema = z
  .object({
    nombres: userBaseSchema.shape.nombres
      .min(1, "Los nombres son obligatorios")
      .max(100, "Los nombres no pueden exceder 100 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los nombres solo pueden contener letras"),

    apellidos: userBaseSchema.shape.apellidos
      .min(1, "Los apellidos son obligatorios")
      .max(100, "Los apellidos no pueden exceder 100 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los apellidos solo pueden contener letras"),

    email: userBaseSchema.shape.email.email("El email no es válido").toLowerCase().trim(),

    password: userBaseSchema.shape.password
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña no puede exceder 50 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener mayúsculas, minúsculas y números"
      ),

    password_confirmation: z.string(),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

export type RegisterInput = z.infer<typeof registerValidationSchema>;

// Validación para login de usuario
export const loginValidationSchema = z.object({
  email: userBaseSchema.shape.email.email("El email no es válido").toLowerCase().trim(),
  password: userBaseSchema.shape.password
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
});

export type LoginInput = z.infer<typeof loginValidationSchema>;

// Validación para token de autenticación
export const tokenValidationSchema = z.object({
  token: userBaseSchema.shape.token
    .length(6, "El token debe tener exactamente 6 caracteres")
    .regex(/^[0-9]+$/, "El token solo puede contener números"),
});

export type TokenInput = z.infer<typeof tokenValidationSchema>;

// Validación para actualizar el password
export const resetPassordValidationSchema = registerValidationSchema
  .pick({
    password: true,
    password_confirmation: true,
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

export type ResetPasswordInput = z.infer<typeof resetPassordValidationSchema>;

// Validación para actualizar el password
export const updatePasswordValidationSchema = registerValidationSchema
  .pick({
    password: true,
    password_confirmation: true,
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  })
  .extend({
    current_password: z
      .string()
      .min(1, "La contraseña actual es obligatoria")
      .max(50, "La contraseña no puede exceder 50 caracteres"),
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordValidationSchema>;

export const validateEmailSchema = loginValidationSchema.pick({
  email: true,
});

// Types inferidos
export type EmailInput = z.infer<typeof validateEmailSchema>;
