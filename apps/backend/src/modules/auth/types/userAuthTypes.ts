import { z } from "zod";
import {
  createUserSchema,
  validateTokenSchema,
  validateLoginSchema,
  validateEmailSchema,
  validateUpdatePasswordSchema,
} from "../schema/userAuthSchema";

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;
export type ValidateLoginInput = z.infer<typeof validateLoginSchema>;
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
export type ValidateUpdatePasswordInput = z.infer<
  typeof validateUpdatePasswordSchema
>;
