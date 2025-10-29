import { z } from "zod";
export declare const updatePasswordBaseSchema: z.ZodObject<{
    password: z.ZodString;
    passwordConfirmation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    passwordConfirmation: string;
}, {
    password: string;
    passwordConfirmation: string;
}>;
export declare const updatePasswordSchema: z.ZodEffects<z.ZodObject<{
    password: z.ZodString;
    passwordConfirmation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    passwordConfirmation: string;
}, {
    password: string;
    passwordConfirmation: string;
}>, {
    password: string;
    passwordConfirmation: string;
}, {
    password: string;
    passwordConfirmation: string;
}>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
/**
 * Schema para cambio de contraseña (requiere contraseña actual)
 * Extiende el ZodObject base ANTES de aplicar el refine.
 */
export declare const changePasswordSchema: z.ZodEffects<z.ZodObject<{
    password: z.ZodString;
    passwordConfirmation: z.ZodString;
} & {
    currentPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    passwordConfirmation: string;
    currentPassword: string;
}, {
    password: string;
    passwordConfirmation: string;
    currentPassword: string;
}>, {
    password: string;
    passwordConfirmation: string;
    currentPassword: string;
}, {
    password: string;
    passwordConfirmation: string;
    currentPassword: string;
}>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
//# sourceMappingURL=password.schema.d.ts.map