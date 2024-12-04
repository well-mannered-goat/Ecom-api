import { Router } from "express";
import { bookOrder, successOrder, failedOrder, updateOrder, cancelOrder } from "../controllers/orderController";
import { getRecentOrders, getUserOrders, getUsersByProduct } from "../controllers/getController";

const router = Router();

router.post("/book", bookOrder);
router.put("/success", successOrder);
router.put("/failed", failedOrder);
router.put("/update", updateOrder);
router.put("/cancel", cancelOrder);
router.get("/recent", getRecentOrders);
router.get("/user-orders", getUserOrders);
router.get("/users-by-product", getUsersByProduct);

export default router;
