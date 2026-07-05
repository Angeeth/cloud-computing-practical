const Order = require("../models/Order");

// Create a new order (checkout submission)
const createOrder = async (req, res) => {
  try {
    const { name, email, phone, address, items, totalAmount, paymentMethod } = req.body;

    if (!name || !email || !phone || !address || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: "All checkout details and items are required" });
    }

    const order = new Order({
      name,
      email,
      phone,
      address,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "Card",
      paymentStatus: "Paid", // Automatically marked paid for this simulation
    });

    const savedOrder = await order.save();
    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

module.exports = {
  createOrder,
};
