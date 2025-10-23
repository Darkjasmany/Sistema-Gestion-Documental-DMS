import { z } from "zod";
import { userBaseSchema } from "../models/user.model";

export const updatePasswordSchema = z
  .object({
    password: userBaseSchema.shape.password
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña no puede exceder 50 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener mayúsculas, minúsculas y números"
      ),

    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

/**
 * Schema para cambio de contraseña (requiere contraseña actual)
 */
export const changePasswordSchema = updatePasswordSchema.extend({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
