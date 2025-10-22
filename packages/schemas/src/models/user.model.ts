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
  token: z.string().nullable(),
  confirmado: z.boolean().default(false),
  estado: z.boolean().default(true),
  departamento_id: z.number().int().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Exporta el tipo inferido para usarlo en el backend (modelos/repositorios)
export type UserBase = z.infer<typeof userBaseSchema>;

/**
 * Schema SIN campos autogenerados (para inserts)
 */
export const userInsertSchema = userBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserInsert = z.infer<typeof userInsertSchema>;
