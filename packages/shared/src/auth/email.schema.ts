import { z } from "zod";
import { validateLoginSchema } from "./login.schema";

export const validateEmailSchema = validateLoginSchema.pick({
  email: true,
});

export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
