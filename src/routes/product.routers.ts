import { Router } from "express";
import {
  getProduct,
  getById,
  postProduct,
  putProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  createProductSchema,
  productIdParamsSchema,
  getProductQuerySchema,
  updateProductSchema,
} from "../schemas/product.schemas.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", validate(getProductQuerySchema), getProduct);
router.get("/:id", validate(productIdParamsSchema, "params"), getById);
router.post("/", validate(createProductSchema), postProduct);
router.put(
  "/:id",
  validate(productIdParamsSchema, "params"),
  validate(updateProductSchema),
  putProduct,
);
router.patch(
  "/:id",
  validate(productIdParamsSchema, "params"),
  validate(updateProductSchema),
  patchProduct,
);
router.delete("/:id", validate(productIdParamsSchema, "params"), deleteProduct);

export default router;
