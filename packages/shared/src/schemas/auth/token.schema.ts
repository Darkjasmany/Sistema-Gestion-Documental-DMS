import { z } from "zod";
import { userBaseSchema } from "../../models/user.model";

export const validateTokenSchema = z.object({
  token: userBaseSchema.shape.token
    .length(6, "El token debe tener exactamente 6 caracteres")
    .regex(/^[0-9]+$/, "El token solo puede contener números"),
});

// Types inferidos
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;
