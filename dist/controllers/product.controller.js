import { findAllProducts, addProduct, } from "../repositories/product.repository.js";
export async function getProduct(_req, res) {
    try {
        const products = await findAllProducts();
        res
            .status(200)
            .json({ status: "OK", count: products.length, data: products });
    }
    catch (err) {
        console.error("[products] Failed to fetch products:", err);
        res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
    }
}
export async function postProduct(req, res) {
    try {
        const { sku, name, description } = req.body;
        if (!sku || !name) {
            return res
                .status(400)
                .json({ status: "ERROR", message: "`sku` and `name` are required" });
        }
        const product = await addProduct(sku, name, description);
        res.status(201).json({ status: "OK", data: product });
    }
    catch (err) {
        console.error("[products] Failed to add product:", err);
        if (err?.code === "23505") {
            return res.status(409).json({
                status: "ERROR",
                message: "Product with that SKU already exists",
            });
        }
        res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
    }
}
