import { z } from "zod";

/**
 * Schema BASE del modelo Modulo (representa la tabla en BD)
 * Este schema refleja TODOS los campos de la tabla
 */

export const moduleBaseSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  icono: z.string().nullable(),
  ruta: z.string().nullable(),
  descripcion: z.string().nullable(),
  estado: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ModuleBase = z.infer<typeof moduleBaseSchema>;
