import { z } from "zod";
import { userBaseSchema } from "../../models/user.model";

// Esquemas de Zod
export const validateLoginSchema = z.object({
  email: userBaseSchema.shape.email
    .email("El email no es válido")
    .toLowerCase()
    .trim(),
  password: userBaseSchema.shape.password
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
});

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

// Types inferidos
export type ValidateLoginInput = z.infer<typeof validateLoginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
