/**
 * Schema BASE del modelo Rol (representa la tabla en BD)
 * Este schema refleja TODOS los campos de la tabla
 */

import { z } from "zod";

export const roleBaseSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  estado: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleBase = z.infer<typeof roleBaseSchema>;
