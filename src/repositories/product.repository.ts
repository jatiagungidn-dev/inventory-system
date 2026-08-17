import { pool } from "../db/index.js";

export interface Product {
  id: string;
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

export async function getProductById(id: string) {
  const query = `
    SELECT id, sku, name, description, created_at, updated_at
    FROM products
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function addProduct(
  sku: string,
  name: string,
  description?: string,
): Promise<Product> {
  const query = `
    INSERT INTO products (sku, name, description) 
    VALUES ($1, $2, $3) 
    RETURNING id, sku, name, description, created_at, updated_at
  `;

  const result = await pool.query<Product>(query, [
    sku,
    name,
    description ?? null,
  ]);

  return result.rows[0];
}

export async function updateProductById(
  id: string,
  sku: string,
  name: string,
  description: string,
) {
  const query = `
    UPDATE products
    SET 
      sku = $1
      name = $2
      description = $3
      updated_at = NOW()
    WHERE id = $4
    RETURNING id, sku, name, description, created_at, updated_at
  `;

  const result = await pool.query(query, [sku, name, description, id]);
  return result.rows[0];
}

export async function deleteProductById(id: string) {
  const query = `
    DELETE FROM products
    WHERE id = $1
    RETURNING id
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
}
