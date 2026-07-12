const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const Cart = require("./models/Cart");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const USER_ID = "guest_user";

// GET /api/cart - Retrieve all items in cart
app.get("/api/cart", async (req, res) => {
  try {
    const items = await Cart.find({ userId: USER_ID });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error: error.message });
  }
});

// POST /api/cart - Add item to cart (increments quantity if exists)
app.post("/api/cart", async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    if (!productId || !name || !price || !image) {
      return res.status(400).json({ message: "Product details are required" });
    }

    let item = await Cart.findOne({ userId: USER_ID, productId });

    if (item) {
      item.quantity += 1;
      await item.save();
      res.json({ message: "Product quantity incremented in database", item });
    } else {
      item = new Cart({
        userId: USER_ID,
        productId,
        name,
        price,
        image,
        quantity: 1
      });
      await item.save();
      res.status(201).json({ message: "Product added to cart in database", item });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error: error.message });
  }
});

// PUT /api/cart/:productId - Update item quantity
app.put("/api/cart/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    if (quantity <= 0) {
      await Cart.deleteOne({ userId: USER_ID, productId });
      return res.json({ message: "Product removed from cart since quantity <= 0" });
    }

    const item = await Cart.findOne({ userId: USER_ID, productId });
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;
    await item.save();
    res.json({ message: "Cart quantity updated in database", item });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart quantity", error: error.message });
  }
});

// DELETE /api/cart/:productId - Delete single item from cart
app.delete("/api/cart/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await Cart.deleteOne({ userId: USER_ID, productId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing product from cart", error: error.message });
  }
});

// DELETE /api/cart - Clear cart
app.delete("/api/cart", async (req, res) => {
  try {
    await Cart.deleteMany({ userId: USER_ID });
    res.json({ message: "All cart items cleared from database" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "Cart Service",
    status: "online",
  });
});

const PORT = process.env.CART_SERVICE_PORT || 5004;

// Connect to database and listen
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Cart Service running on port ${PORT}`);
  });
};

startServer();
