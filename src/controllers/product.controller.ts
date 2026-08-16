import type { Request, Response } from "express";
import { findAllProducts } from "../repositories/product.repository.js";

export async function getProduct(_req: Request, res: Response) {
  try {
    const products = await findAllProducts();

    res.status(200).json({ status: "OK", data: products });
  } catch (err) {
    console.error("[products] Failed to fetch products:", err);

    res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
  }
}
