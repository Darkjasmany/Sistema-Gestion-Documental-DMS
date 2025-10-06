import { z } from "zod";

export const userSchema = z.object({
  nombres: z.string(),
  apellidos: z.string(),
  email: z.string(),
  password: z.string(),
  rol: z.string(),
  token: z.string(),
  confirmado: z.boolean(),
  estado: z.boolean(),
  departamento_id: z.number(),
});
