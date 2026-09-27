const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Search API Route
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};

    if (q) {
      filter = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products", error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "Search Service",
    status: "online",
  });
});

const PORT = process.env.SEARCH_SERVICE_PORT || 5002;

// Connect to database and listen
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Search Service running on port ${PORT}`);
  });
};

startServer();
