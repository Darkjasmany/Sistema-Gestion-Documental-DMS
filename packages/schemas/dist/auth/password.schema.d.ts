import { z } from "zod";
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
 */
export declare const changePasswordSchema: any;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
