import { z } from "zod";
export declare const validateTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;
//# sourceMappingURL=token.schema.d.ts.map