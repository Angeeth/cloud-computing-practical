const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const seedDB = require("./seed");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Base route for API health check
app.get("/api-status", (req, res) => {
  res.json({
    message: "E-Commerce API is running successfully",
  });
});

// Serve frontend static build if running as single-container monolith
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // Express 5 compatible wildcard fallback middleware
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "E-Commerce API is running successfully",
    });
  });
}

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  
  // Try to seed the database if connection succeeded
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState === 1) {
    await seedDB();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Monolithic Server running on port ${PORT}`);
  });
};

startServer();