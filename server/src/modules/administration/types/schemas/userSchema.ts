import { z } from "zod";

// Esquema de Zod
export const createUserSchema = z.object({
  nombres: z.string().min(1, "Los nombres son obligatorios"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

// Tipado - tipo inferido de ese esquema
export type CreateUserInput = z.infer<typeof createUserSchema>;
