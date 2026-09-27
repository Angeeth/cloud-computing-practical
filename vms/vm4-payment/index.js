const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/payments", async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Transaction amount required" });
    }

    console.log(`💳 [VM 4 Payment Service] Authorizing payment of ₹${amount} via ${paymentMethod || "Card"}...`);
    const txnId = `TXN-VM4-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      message: "Payment authorized successfully by VM 4 Payment Service",
      transactionId: txnId,
      amount,
      paymentMethod: paymentMethod || "Card"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    node: "VM 4",
    role: "Payment Gateway Microservice (Private VM)",
    db: "Payment DB (Mongo Container)"
  });
});

const PORT = process.env.PORT || 5005;
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 [VM 4] Payment Service running on port ${PORT}`));
};
start();
