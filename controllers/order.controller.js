import Order from "../models/Order.js";

// Create new order (user checkout)
export const createOrder = async (req, res) => {
  try {
    const { userId, products, address, paymentStatus, orderStatus } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const newOrder = new Order({
      userId,
      products,
      address,
      paymentStatus,
      orderStatus: orderStatus || "Pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

// Get all orders of logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get single order details
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

// Update order or cancel (only if pending)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be updated or cancelled" });
    }

    const { products, address, paymentStatus, status } = req.body;

    if (products) order.products = products;
    if (address) order.address = address;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Allow user to cancel order by setting status to "Cancelled"
    if (status && status === "Cancelled") {
      order.orderStatus = "Cancelled";
    }

    await order.save();
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
};
