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

/**
 * Schema de respuesta (sin password)
 */
export const createUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userBaseSchema.omit({ password: true, token: true }), // No devolver password ni token
});

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
