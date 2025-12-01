/**
 * Schema BASE del modelo Permiso (representa la tabla en BD)
 * Este schema refleja TODOS los campos de la tabla
 */

import { z } from "zod";

export const permissionBaseSchema = z.object({
  id: z.number().int().positive(),
  codigo: z.string(),
  descripcion: z.string().nullable(),
  modulo_id: z.number().int().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PermissionBase = z.infer<typeof permissionBaseSchema>;
