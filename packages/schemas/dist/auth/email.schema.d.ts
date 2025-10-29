import { z } from "zod";
export declare const validateEmailSchema: z.ZodObject<Pick<{
    email: z.ZodString;
    password: z.ZodString;
}, "email">, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
//# sourceMappingURL=email.schema.d.ts.map