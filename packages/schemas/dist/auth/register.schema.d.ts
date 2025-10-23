import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    nombres: z.ZodString;
    apellidos: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
}, {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
/**
 * Schema de respuesta (sin password)
 */
export declare const createUserResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    user: z.ZodObject<Omit<{
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
    }, "password" | "token">, "strip", z.ZodTypeAny, {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        confirmado: boolean;
        estado: boolean;
        departamento_id: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        departamento_id: number | null;
        createdAt: Date;
        updatedAt: Date;
        confirmado?: boolean | undefined;
        estado?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    message: string;
    success: boolean;
    user: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        confirmado: boolean;
        estado: boolean;
        departamento_id: number | null;
        createdAt: Date;
        updatedAt: Date;
    };
}, {
    message: string;
    success: boolean;
    user: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        departamento_id: number | null;
        createdAt: Date;
        updatedAt: Date;
        confirmado?: boolean | undefined;
        estado?: boolean | undefined;
    };
}>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
