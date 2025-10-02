import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
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
