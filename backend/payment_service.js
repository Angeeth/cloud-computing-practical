const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Simulated payment verification endpoint
app.post("/api/payments", async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Transaction amount is required" });
    }

    console.log(`[Payment Service] Processing simulated payment for amount: ₹${amount} via ${paymentMethod || "Card"}...`);

    // Simulate payment transaction validation
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      message: "Payment authorized successfully",
      transactionId: txnId,
      amount,
      paymentMethod: paymentMethod || "Card"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error simulating payment", error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "Payment Service",
    status: "online",
  });
});

const PORT = process.env.PAYMENT_SERVICE_PORT || 5005;

// Connect to database and listen
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Payment Service running on port ${PORT}`);
  });
};

startServer();
