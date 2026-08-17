import { Router } from "express";
import { getProduct, postProduct } from "../controllers/product.controller.js";
const router = Router();
router.get("/", getProduct);
router.post("/", postProduct);
export default router;
