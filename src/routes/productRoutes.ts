import express from "express";
import { createProduct, getProduct, updateProduct } from "../controllers/productController";

const router = express.Router();

router.post("/create", createProduct);
router.get("/getProduct", getProduct);
router.put("/updateProduct", updateProduct);

export default router;
