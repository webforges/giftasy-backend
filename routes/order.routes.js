import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Create a new order
router.post("/", protect, createOrder);

// ✅ Get all orders of logged-in user
router.get("/", protect, getMyOrders);

// ✅ Get a single order by ID
router.get("/:id", protect, getOrderById);

// ✅ Update order (e.g., status) - user can only update allowed fields
router.put("/:id", protect, updateOrder);

export default router;
