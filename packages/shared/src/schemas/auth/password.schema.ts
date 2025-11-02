import { z } from "zod";
import { userBaseSchema } from "../../models/user.model";

export const updatePasswordBaseSchema = z.object({
  password: userBaseSchema.shape.password
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener mayúsculas, minúsculas y números"
    ),
  passwordConfirmation: z.string(),
});

// Crear updatePasswordSchema aplicando el refine al esquema base
export const updatePasswordSchema = updatePasswordBaseSchema.refine(
  data => data.password === data.passwordConfirmation,
  {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  }
);

/**
 * Schema para cambio de contraseña (requiere contraseña actual)
 * Extiende el ZodObject base ANTES de aplicar el refine.
 */
export const changePasswordSchema = updatePasswordBaseSchema
  .extend({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

// Types inferidos
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
