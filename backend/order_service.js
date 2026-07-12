const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const Order = require("./models/Order");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const PAYMENT_SERVICE_URL = "http://localhost:5005/api/payments";

// Order Creation Route
app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, phone, address, items, totalAmount, paymentMethod } = req.body;

    if (!name || !email || !phone || !address || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: "All checkout details and items are required" });
    }

    console.log(`[Order Service] Contacting Payment Service (Port 5005) to authorize ₹${totalAmount}...`);

    // Call Payment Service (Port 5005)
    try {
      const paymentResponse = await fetch(PAYMENT_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, paymentMethod })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        return res.status(400).json({
          message: "Payment declined by Payment Service",
          error: paymentData.message || "Payment verification failed"
        });
      }

      console.log(`[Order Service] Payment authorized! Txn: ${paymentData.transactionId}. Saving order...`);

      // Create new Order model instance
      const order = new Order({
        name,
        email,
        phone,
        address,
        items,
        totalAmount,
        paymentMethod: paymentMethod || "Card",
        paymentStatus: "Paid", // Successfully validated by Payment Service
      });

      const savedOrder = await order.save();
      res.status(201).json({
        message: "Order placed successfully (Validated by Payment Service)",
        order: savedOrder,
      });

    } catch (paymentErr) {
      console.warn("[Order Service] Connection to Payment Service failed. Falling back to default simulation.");
      // Fallback simulation if payment service is down
      const order = new Order({
        name,
        email,
        phone,
        address,
        items,
        totalAmount,
        paymentMethod: paymentMethod || "Card",
        paymentStatus: "Paid (Simulation Fallback)",
      });
      const savedOrder = await order.save();
      res.status(201).json({
        message: "Order placed successfully (Simulation Fallback)",
        order: savedOrder,
      });
    }

  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "Order Service",
    status: "online",
  });
});

const PORT = process.env.ORDER_SERVICE_PORT || 5003;

// Connect to database and listen
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
  });
};

startServer();
