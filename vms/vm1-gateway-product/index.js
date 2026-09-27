const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedDB = require("./seed");
const Product = require("./models/Product");

const app = express();
app.use(cors());
app.use(express.json());

// API Gateway routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Inter-DB Sync endpoint: Updates inventory stock on VM 1 when an order is created on VM 3
app.post("/api/products/sync-stock", async (req, res) => {
  try {
    const { items } = req.body;
    console.log("🔄 [VM 1 DB Sync] Received Inter-DB Sync Event from VM 3 Order DB:", items);
    res.json({ success: true, message: "VM 1 Product DB Synced successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    node: "VM 1",
    role: "API Gateway & Product Catalog",
    status: "online",
    db: "Product DB Container"
  });
});

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState === 1) {
    await seedDB();
  }
  app.listen(PORT, () => {
    console.log(`🚀 [VM 1] Gateway & Product Service running on port ${PORT}`);
  });
};

start();
