import { z } from "zod";
import { loginSchema } from "./login.schema";

export const validateEmailSchema = loginSchema.pick({
  email: true,
});

export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
