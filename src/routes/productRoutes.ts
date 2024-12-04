import express from "express";
import { createProduct, getProduct, updateProduct } from "../controllers/productController";
import { getTotalStock } from "../controllers/getController";

const router = express.Router();

router.post("/create", createProduct);
router.get("/getProduct", getProduct);
router.put("/updateProduct", updateProduct);
router.get("/total-stock", getTotalStock);

export default router;