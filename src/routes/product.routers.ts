import { Router } from "express";
import {
  getProduct,
  getById,
  postProduct,
  putProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProduct);
router.get("/:id", getById);
router.post("/", postProduct);
router.put("/:id", putProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

export default router;
