import type { Request, Response, NextFunction } from "express";
import {
  findAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  patchProductById,
  deleteProductById,
} from "../repositories/product.repository.js";
import { AppError } from "../utils/app-errors.js";

export async function getProduct(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const products = await findAllProducts();

    res
      .status(200)
      .json({ status: "success", count: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return next(new AppError("Product not found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function postProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { sku, name, description } = req.body;

    const product = await addProduct(sku, name, description);

    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    next(err);
  }
}

export async function putProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { sku, name, description } = req.body;

    const updated = await updateProductById(id, sku, name, description);

    if (!updated) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function patchProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { sku, name, description } = req.body;

    const patched = await patchProductById(id, sku, name, description);

    if (!patched) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: patched,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
