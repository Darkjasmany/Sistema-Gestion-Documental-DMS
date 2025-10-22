import { z } from "zod";

// userBaseSchema es la forma base de los datos de un usuario en tu BBDD
export const userBaseSchema = z.object({
  nombres: z.string().min(1, "Los nombres son obligatorios"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.string(),
  token: z
    .string()
    .length(6, "El token no puede ir vacio o tener más de 6 caracteres"),
  confirmado: z.boolean(),
  estado: z.boolean(),
  departamento_id: z.number(),
});

// Exporta el tipo inferido para usarlo en el backend (modelos/repositorios)
export type UserBase = z.infer<typeof userBaseSchema>;
