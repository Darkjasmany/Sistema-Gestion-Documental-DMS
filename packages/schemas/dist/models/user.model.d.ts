import { z } from "zod";
/**
 * Schema BASE del modelo Usuario (representa la tabla en BD)
 * Este schema refleja TODOS los campos de la tabla
 */
export declare const userBaseSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    rol: string;
    token: string | null;
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
    password: string;
    rol: string;
    token: string | null;
    departamento_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    confirmado?: boolean | undefined;
    estado?: boolean | undefined;
}>;
export type UserBase = z.infer<typeof userBaseSchema>;
/**
 * Schema SIN campos autogenerados (para inserts)
 */
export declare const userInsertSchema: z.ZodObject<Omit<{
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
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    rol: string;
    token: string | null;
    confirmado: boolean;
    estado: boolean;
    departamento_id: number | null;
}, {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    rol: string;
    token: string | null;
    departamento_id: number | null;
    confirmado?: boolean | undefined;
    estado?: boolean | undefined;
}>;
export type UserInsert = z.infer<typeof userInsertSchema>;
