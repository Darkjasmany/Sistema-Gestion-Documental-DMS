import { z } from "zod";
export declare const validateLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type ValidateLoginInput = z.infer<typeof validateLoginSchema>;
/**
 * Schema de respuesta del login
 */
export declare const loginResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    token: z.ZodString;
    user: z.ZodObject<Pick<{
        id: z.ZodNumber;
        nombres: z.ZodString;
        apellidos: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        rol: z.ZodString;
        token: z.ZodNullable<z.ZodString>;
        confirmado: z.ZodDefault<z.ZodBoolean>;
        estado: z.ZodDefault<z.ZodBoolean>;
        departamento_id: z.ZodNullable<z.ZodNumber>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "id" | "nombres" | "apellidos" | "email" | "rol" | "confirmado" | "estado">, "strip", z.ZodTypeAny, {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        confirmado: boolean;
        estado: boolean;
    }, {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        confirmado?: boolean | undefined;
        estado?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    token: string;
    success: boolean;
    user: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        confirmado: boolean;
        estado: boolean;
    };
}, {
    token: string;
    success: boolean;
    user: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        confirmado?: boolean | undefined;
        estado?: boolean | undefined;
    };
}>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
