const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const seedDB = require("./seed");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes - Mount existing product endpoints under /api/products
app.use("/api/products", productRoutes);

// Base route for health check
app.get("/", (req, res) => {
  res.json({
    service: "Product/Catalog Service",
    status: "online",
  });
});

const PORT = process.env.PRODUCT_SERVICE_PORT || 5001;

// Connect to database, seed, and listen
const startServer = async () => {
  await connectDB();
  
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState === 1) {
    await seedDB();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
  });
};

startServer();
