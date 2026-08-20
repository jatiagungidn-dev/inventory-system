import { z } from "zod";

export const createProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, "SKU is required")
    .max(30, "SKU is maximum 30 characters")
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(100, "Name is maximum 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description is maximum 500 characters")
    .optional(),
});

export const productIdParamsSchema = z.object({
  id: z.string().uuid("Invalid product ID format (Must be UUID)"),
});

export const getProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type GetProductQuerySchema = z.infer<typeof getProductQuerySchema>;
