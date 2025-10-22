import { z } from "zod";

export const departmentSchema = z.object({
  nombre: z.string(),
  coordinador_id: z.number(),
});
