import type { Request, Response } from "express";
import {
  findAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  patchProductById,
  deleteProductById,
} from "../repositories/product.repository.js";

export async function getProduct(_req: Request, res: Response) {
  try {
    const products = await findAllProducts();

    res
      .status(200)
      .json({ status: "success", count: products.length, data: products });
  } catch (err) {
    console.error("[products] Failed to fetch products:", err);

    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}

export async function getById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    console.error("[products] Error while fetching product:", err);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}

export async function postProduct(req: Request, res: Response) {
  try {
    const { sku, name, description } = req.body;

    if (!sku || !name) {
      res
        .status(400)
        .json({ status: "fail", message: "'sku' and 'name' are required" });
      return;
    }

    const product = await addProduct(sku, name, description);

    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    console.error("[products] Failed to add product:", err);

    if ((err as any)?.code === "23505") {
      res.status(409).json({
        status: "fail",
        message: "Product with that SKU already exists",
      });
      return;
    }

    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}

export async function putProduct(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const { sku, name, description } = req.body;

    if (!sku || !name || !description) {
      res.status(400).json({
        status: "fail",
        message: "'sku', 'name', and 'description' are required",
      });
      return;
    }

    const updated = await updateProductById(id, sku, name, description);

    if (!updated) {
      res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    console.error("[products] Error while updating product:", err);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}

export async function patchProduct(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { sku, name, description } = req.body;

    if (sku === undefined && name === undefined && description === undefined) {
      res.status(400).json({
        status: "fail",
        message: "At least one field is required to update",
      });
      return;
    }

    const patched = await patchProductById(id, sku, name, description);

    if (!patched) {
      res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: patched,
    });
  } catch (err) {
    console.error("[products] Error while patching product:", err);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}

export async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const { id } = req.params;

    await deleteProductById(id);

    res.status(204).send();
  } catch (err) {
    console.error("[products] Error while deleting product:", err);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}
