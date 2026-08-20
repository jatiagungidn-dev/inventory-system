import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-errors.js";
import { env } from "../config/env.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: "fail", message: err.message });
    return;
  }

  if (err.code === "23505") {
    res.status(409).json({
      status: "fail",
      message: "Duplicate entry. Value already exists in database",
    });
    return;
  }

  if (err.code === "22P02") {
    res.status(400).json({
      status: "fail",
      message: "Invalid ID format or input syntax for database query",
    });
    return;
  }

  console.error("[global error]:", err);

  res.status(statusCode).json({
    status: "error",
    message: env.NODE_ENV === "production" ? "Internal Server Error" : message,
  });
};
