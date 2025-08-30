import Order from "../models/Order.js";
import User from "../models/User.js";

/**
 * Initiate payment (create order with pending payment)
 */
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    // ⚡ Here you can call external payment gateway APIs
    // Example: Razorpay/Stripe/Instamojo integration
    // For now, just mock a payment initiation response
    const paymentSession = {
      id: `PAY_${Date.now()}`,
      method: paymentMethod || "cod",
      amount: order.totalPrice,
      currency: "INR",
      status: "initiated",
    };

    // Attach payment session to order
    order.paymentInfo = paymentSession;
    await order.save();

    res.json({ message: "Payment initiated", paymentSession });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Verify/Confirm payment (called after gateway response/webhook)
 */
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, success, transactionId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (success) {
      order.paymentStatus = "paid";
      order.paymentInfo = {
        ...order.paymentInfo,
        status: "success",
        transactionId,
      };
      order.orderStatus = "confirmed";
    } else {
      order.paymentStatus = "failed";
      order.paymentInfo = {
        ...order.paymentInfo,
        status: "failed",
        transactionId,
      };
    }

    await order.save();

    res.json({ message: "Payment status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Refund/Cancel payment (for admins or disputes)
 */
export const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ message: "No completed payment to refund" });
    }

    // ⚡ Integrate refund API with gateway here
    order.paymentStatus = "refunded";
    order.paymentInfo = {
      ...order.paymentInfo,
      status: "refunded",
    };
    order.orderStatus = "cancelled";

    await order.save();

    res.json({ message: "Payment refunded successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//import crypto from "crypto"; import Order from "../models/Order.js"; import razorpay from "../config/razorpay.js"; /** * 1️⃣ Initiate Payment (Create Razorpay Order) */ export const initiatePayment = async (req, res) => { try { const { orderId } = req.body; const order = await Order.findById(orderId); if (!order) return res.status(404).json({ message: "Order not found" }); if (order.paymentStatus === "paid") { return res.status(400).json({ message: "Payment already completed" }); } const options = { amount: Math.round(order.totalPrice * 100), // amount in paise currency: "INR", receipt: order_rcpt_${order._id}, }; const paymentOrder = await razorpay.orders.create(options); order.paymentInfo = { razorpay_order_id: paymentOrder.id, status: "initiated", }; await order.save(); res.json({ message: "Payment initiated", paymentOrder }); } catch (error) { res.status(500).json({ message: "Payment initiation failed", error: error.message }); } }; /** * 2️⃣ Confirm Payment (Verify Razorpay signature) */ export const confirmPayment = async (req, res) => { try { const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body; const order = await Order.findById(orderId); if (!order) return res.status(404).json({ message: "Order not found" }); // Verify signature const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET); hmac.update(razorpay_order_id + "|" + razorpay_payment_id); const generatedSignature = hmac.digest("hex"); if (generatedSignature !== razorpay_signature) { return res.status(400).json({ message: "Payment verification failed" }); } order.paymentStatus = "paid"; order.orderStatus = "confirmed"; order.paymentInfo = { ...order.paymentInfo, razorpay_payment_id, status: "success", }; await order.save(); res.json({ message: "Payment verified successfully", order }); } catch (error) { res.status(500).json({ message: "Payment confirmation failed", error: error.message }); } }; /** * 3️⃣ Refund Payment (for admin/disputes) */ export const refundPayment = async (req, res) => { try { const { orderId } = req.params; const order = await Order.findById(orderId); if (!order) return res.status(404).json({ message: "Order not found" }); if (order.paymentStatus !== "paid") { return res.status(400).json({ message: "No completed payment to refund" }); } const refund = await razorpay.payments.refund(order.paymentInfo.razorpay_payment_id); order.paymentStatus = "refunded"; order.orderStatus = "cancelled"; order.paymentInfo = { ...order.paymentInfo, status: "refunded", }; await order.save(); res.json({ message: "Payment refunded successfully", refund, order }); } catch (error) { res.status(500).json({ message: "Refund failed", error: error.message }); } }
