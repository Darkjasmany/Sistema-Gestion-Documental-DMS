import { z } from "zod";
import { userBaseSchema } from "../models/user.model";

// Esquema de Zod
export const loginSchema = z.object({
  email: userBaseSchema.shape.email
    .email("El email no es válido")
    .toLowerCase()
    .trim(),
  password: userBaseSchema.shape.password
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
});
// Exportar todos los tipos de entrada (Input Types)
export type ValidateLoginInput = z.infer<typeof loginSchema>;

/**
 * Schema de respuesta del login
 */
export const loginResponseSchema = z.object({
  success: z.boolean(),
  token: z.string(),
  user: userBaseSchema.pick({
    id: true,
    nombres: true,
    apellidos: true,
    email: true,
    rol: true,
    confirmado: true,
    estado: true,
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
