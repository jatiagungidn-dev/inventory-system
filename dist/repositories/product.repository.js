import { pool } from "../db/index.js";
export async function findAllProducts() {
    const result = await pool.query(`
        SELECT
            id,
            sku,
            name,
            description,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC
        `);
    return result.rows;
}
export async function addProduct(sku, name, description) {
    const query = `INSERT INTO products (sku, name, description) VALUES ($1, $2, $3) RETURNING id, sku, name, description, created_at, updated_at`;
    const result = await pool.query(query, [
        sku,
        name,
        description ?? null,
    ]);
    return result.rows[0];
}
