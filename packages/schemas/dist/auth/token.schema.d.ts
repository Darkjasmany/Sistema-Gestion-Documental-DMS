import { z } from "zod";
export declare const validateTokenSchema: z.ZodObject<{
    token: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    token?: unknown;
}, {
    [x: string]: any;
    token?: unknown;
}>;
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;
