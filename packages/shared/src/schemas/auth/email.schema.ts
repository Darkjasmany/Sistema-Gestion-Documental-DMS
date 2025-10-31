import { z } from "zod";
import { validateLoginSchema } from "./login.schema";

export const validateEmailSchema = validateLoginSchema.pick({
  email: true,
});

// Types inferidos
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
