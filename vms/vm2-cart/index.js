const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");

const app = express();
app.use(cors());
app.use(express.json());

const redisHost = process.env.REDIS_HOST || "cart-db";
const redisPort = process.env.REDIS_PORT || 6379;
const redis = new Redis({ host: redisHost, port: redisPort, retryStrategy: () => 1000 });

redis.on("connect", () => console.log(`✅ [VM 2] Connected to Mini Cart DB (Redis Container)`));
redis.on("error", (err) => console.log(`⚠️ [VM 2 Redis] Notice: ${err.message}`));

const CART_KEY = "cart:guest_user";

app.get("/api/cart", async (req, res) => {
  try {
    const raw = await redis.get(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const item = req.body;
    const raw = await redis.get(CART_KEY);
    let cart = raw ? JSON.parse(raw) : [];
    
    const existing = cart.find(i => i.productId === item.productId || i._id === item.productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    await redis.set(CART_KEY, JSON.stringify(cart));
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cart/clear", async (req, res) => {
  try {
    await redis.del(CART_KEY);
    console.log("🔄 [VM 2 DB Sync] Cart DB cleared via Inter-DB Sync from VM 3 Order DB");
    res.json({ success: true, message: "Cart DB cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    node: "VM 2",
    role: "Cart Microservice (Private VM)",
    db: "Cart DB (Redis Container)"
  });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 [VM 2] Cart Service running on port ${PORT}`);
});
