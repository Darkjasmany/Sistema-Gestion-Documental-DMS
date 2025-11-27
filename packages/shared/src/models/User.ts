import { z } from "zod";

/**
 * Schema BASE del modelo Usuario (representa la tabla en BD)
 * Este schema refleja TODOS los campos de la tabla
 */

export const userBaseSchema = z.object({
  id: z.number().int().positive(),
  nombres: z.string(),
  apellidos: z.string(),
  email: z.string().email(),
  password: z.string(),
  //   rol: z.enum(["admin", "user", "guest"]),
  rol: z.string(),
  // token: z.string().nullable(),
  token: z.string(),
  confirmado: z.boolean().default(false),
  estado: z.boolean().default(true),
  departamento_id: z.number().int().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Export type inferido
export type UserBase = z.infer<typeof userBaseSchema>;

// Interface para usuario loggeado
export interface IUserLogged {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
  departamento_id: number | null;
}
