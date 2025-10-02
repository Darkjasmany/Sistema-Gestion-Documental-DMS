import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateBody =
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

/*
Esta function convierte los errores de Zod en un array de objectos :

[
    { field: "email", message: "El email no es válido" },
    { field: "password", message: "Debe tener al menos 8 caracteres" },
  ];
  */
