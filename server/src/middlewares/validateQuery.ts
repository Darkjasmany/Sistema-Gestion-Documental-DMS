import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
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
