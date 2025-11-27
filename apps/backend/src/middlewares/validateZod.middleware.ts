import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodType } from "zod";

/**
 * Middleware para validar el cuerpo de la solicitud (req.body)
 * @param schema El esquema de Zod para la validación
 * Se usa ZodType para garantizar compatibilidad con todos los esquemas de Zod
 */

export const zodValidateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = Object.entries(result.error.format()).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc.push({
              field: key,
              message: value?._errors?.[0] || "Campo inválido",
            });
          }
          return acc;
        },
        [] as { field: string; message: string }[]
      );
      return res.status(400).json({ errors: formattedErrors });
    }
    req.body = result.data; // validado y tipado
    next();
  };

export const zodValidateBody1 =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // La lógica para formatear errores está bien, pero para simplificar
      // podríamos usar un enfoque más directo:
      const formattedErrors = Object.entries(result.error.format()).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc.push({
              field: key,
              message: value?._errors?.[0] || "Campo inválido",
            });
          }
          return acc;
        },
        [] as { field: string; message: string }[]
      );

      return res.status(400).json({ errors: formattedErrors });
    }

    req.body = result.data; // validado y tipado
    next();
  };

/*
Esta function convierte los errores de Zod en un array de objectos :

[
    { field: "email", message: "El email no es válido" },
    { field: "password", message: "Debe tener al menos 8 caracteres" },
  ];
  */
export const zodValidateQuery =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const formattedErrors = Object.entries(result.error.format()).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc.push({
              query: key,
              message: value?._errors?.[0] || "Consulta inválida",
            });
          }
          return acc;
        },
        [] as { query: string; message: string }[]
      );

      return res.status(400).json({ errors: formattedErrors });
    }

    // req.query = result.data;
    next();
  };

export const zodValidateParams =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const formattedErrors = Object.entries(result.error.format()).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc.push({
              param: key,
              message: value?._errors?.[0] || "Parámetro inválido",
            });
          }
          return acc;
        },
        [] as { param: string; message: string }[]
      );

      return res.status(400).json({ errors: formattedErrors });
    }

    // req.params = result.data;
    next();
  };
