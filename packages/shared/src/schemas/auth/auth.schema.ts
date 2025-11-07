import { z } from "zod";
import { userBaseSchema } from "../../models";

const authSchema = userBaseSchema.pick({
  nombres: true,
  apellidos: true,
  email: true,
  password: true,
});

export const authSchemaResponse = authSchema
  .extend({
    password_confirmation: z.string(),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

// Export type inferido
export type UserRegistrationForm = z.infer<typeof authSchemaResponse>;
