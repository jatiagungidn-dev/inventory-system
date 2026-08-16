import { pool } from "../db/index.js";

export async function findAllProducts() {
  const result = await pool.query(
    `
        SELECT
            id,
            sku,
            name,
            description,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC
        `,
  );

  return result.rows;
}
