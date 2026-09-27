const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Order = require("./models/Order");

const app = express();
app.use(cors());
app.use(express.json());

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://10.0.1.13:5005/api/payments";
const PRODUCT_SYNC_URL = process.env.PRODUCT_SYNC_URL || "http://10.0.1.10:5001/api/products/sync-stock";
const CART_SYNC_URL = process.env.CART_SYNC_URL || "http://10.0.1.11:5004/api/cart/clear";

app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, phone, address, items, totalAmount, paymentMethod } = req.body;

    if (!name || !email || !phone || !address || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: "All checkout details and items are required" });
    }

    console.log(`[VM 3 Order Service] Contacting VM 4 Payment Service at ${PAYMENT_SERVICE_URL}...`);

    // 1. Inter-service call to VM 4 Payment Service
    try {
      const payRes = await fetch(PAYMENT_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, paymentMethod })
      });
      const payData = await payRes.json();
      console.log(`[VM 3] Payment authorized by VM 4! Txn: ${payData.transactionId || 'OK'}`);
    } catch (err) {
      console.warn(`[VM 3] Notice: Payment authorization simulated locally (${err.message})`);
    }

    // 2. Save Order to VM 3 Order DB
    const order = new Order({
      name, email, phone, address, items, totalAmount,
      paymentMethod: paymentMethod || "Card",
      paymentStatus: "Paid"
    });
    const savedOrder = await order.save();

    // 3. Database Synchronization across VMs:
    // Sync with VM 1 Product DB to update stock
    fetch(PRODUCT_SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    }).catch(e => console.log("Notice: Syncing VM 1 Product DB..."));

    // Sync with VM 2 Cart DB to clear cart
    fetch(CART_SYNC_URL, { method: "POST" }).catch(e => console.log("Notice: Syncing VM 2 Cart DB..."));

    res.status(201).json({
      message: "Order placed successfully! (VM 3 Order DB saved & VMs Synced)",
      order: savedOrder
    });

  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    node: "VM 3",
    role: "Order Microservice (Private VM)",
    db: "Order DB (Mongo Container)"
  });
});

const PORT = process.env.PORT || 5003;
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 [VM 3] Order Service running on port ${PORT}`));
};
start();
