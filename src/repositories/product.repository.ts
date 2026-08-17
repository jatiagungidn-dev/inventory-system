import { pool } from "../db/index.js";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function findAllProducts(): Promise<Product[]> {
  const query = `
  SELECT 
    id,
    name,
    sku,
    description,
    created_at,
    updated_at
  FROM products;
  `;

  const result = await pool.query<Product>(query);

  return result.rows;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const query = `
    SELECT id, sku, name, description, created_at, updated_at
    FROM products
    WHERE id = $1;
  `;

  const result = await pool.query<Product>(query, [id]);
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
    RETURNING id, sku, name, description, created_at, updated_at;
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
): Promise<Product | undefined> {
  const query = `
    UPDATE products
    SET 
      sku = $1,
      name = $2,
      description = $3,
      updated_at = NOW()
    WHERE id = $4
    RETURNING id, sku, name, description, created_at, updated_at;
  `;

  const result = await pool.query<Product>(query, [sku, name, description, id]);
  return result.rows[0];
}

export async function patchProductById(
  id: string,
  sku?: string,
  name?: string,
  description?: string,
): Promise<Product | undefined> {
  const query = `
    UPDATE products
    SET
      sku = COALESCE($1, sku),
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      updated_at = NOW()
    WHERE id = $4
    RETURNING id, sku, name, description, created_at, updated_at;
  `;

  const result = await pool.query<Product>(query, [sku, name, description, id]);
  return result.rows[0];
}

export async function deleteProductById(id: string): Promise<void> {
  const query = `
    DELETE FROM products
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);
}
