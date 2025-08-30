import express from "express";
import {
  initiatePayment,
  confirmPayment,
  refundPayment,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Initiate payment for an order
router.post("/initiate", protect, initiatePayment);

// ✅ Confirm payment (callback or webhook)
router.post("/confirm", protect, confirmPayment);

// ✅ Refund payment
router.post("/refund", protect, refundPayment);

export default router;
