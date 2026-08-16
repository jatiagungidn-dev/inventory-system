import { pool } from "../db/index.js";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export async function findAllProducts(): Promise<Product[]> {
  const result = await pool.query<Product>(
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

export async function addProduct(
  sku: string,
  name: string,
  description?: string,
): Promise<Product> {
  const query = `INSERT INTO products (sku, name, description) VALUES ($1, $2, $3) RETURNING id, sku, name, description, created_at, updated_at`;

  const result = await pool.query<Product>(query, [
    sku,
    name,
    description ?? null,
  ]);

  return result.rows[0];
}
