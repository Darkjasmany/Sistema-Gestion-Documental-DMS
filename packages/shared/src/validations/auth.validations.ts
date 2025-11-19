import { z } from "zod";
import { userBaseSchema } from "../models/user.model";

// Validación de Email
export const emailValidation = userBaseSchema.shape.email
  .email("El email no es válido")
  .toLowerCase()
  .trim();

// Validación de Password
export const passwordValidation = userBaseSchema.shape.password
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(50, "La contraseña no puede exceder 50 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "La contraseña debe contener mayúsculas, minúsculas y números"
  );

// Validación de Current Password
export const currentPasswordValidation = z
  .string()
  .min(1, "La contraseña actual es obligatoria")
  .max(50, "La contraseña no puede exceder 50 caracteres");

// Validación de Nombres/Apellidos
export const nameValidation = (field: string) =>
  z
    .string()
    .min(1, `El ${field} es obligatorio`)
    .max(100, `El ${field} no puede exceder 100 caracteres`)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, `El ${field} solo puede contener letras`);

// Validación de Token (schema de cadena de 6 dígitos)
export const tokenValidation = userBaseSchema.shape.token
  .length(6, "El token debe tener exactamente 6 caracteres")
  .regex(/^[0-9]+$/, "El token solo puede contener números");

// Validación del Schema reutilizable para la lógica de "password + confirmación"
export const passwordMatchSchema = z
  .object({
    password: passwordValidation,
    password_confirmation: z
      .string({
        message: "La confirmación de contraseña es obligatoria",
      })
      .min(1, "La confirmación de contraseña es obligatoria"),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });
