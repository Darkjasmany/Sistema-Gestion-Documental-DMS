import { z } from "zod";
import { userBaseSchema } from "../models/user.model";

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
// Nota: ¡Este esquema aún no tiene la validación de coincidencia!

// 2. **Crear updatePasswordSchema aplicando el refine al esquema base**
export const updatePasswordSchema = updatePasswordBaseSchema.refine(
  (data) => data.password === data.passwordConfirmation,
  {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  }
);

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

/**
 * Schema para cambio de contraseña (requiere contraseña actual)
 * Extiende el ZodObject base ANTES de aplicar el refine.
 */
export const changePasswordSchema = updatePasswordBaseSchema
  .extend({
    // 3. Extender el esquema base con el nuevo campo
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  })
  // 4. Aplicar el refine DESPUÉS de extender para validar la coincidencia
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
