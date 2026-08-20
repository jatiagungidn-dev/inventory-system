import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = "body",
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res
        .status(400)
        .json({ status: "fail", message: result.error.flatten().fieldErrors });
      return;
    }

    if (target === "body") {
      req.body = Object.assign(req.body, result.data);
    } else if (target === "params") {
      req.params = result.data as any;
    } else if (target === "query") {
      req.query = result.data as any;
    }

    next();
  };
};
