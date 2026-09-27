const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

const dbHost = process.env.DB_HOST || "cart-sql-db";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASSWORD || "secretpassword";
const dbName = process.env.DB_NAME || "cart_sqldb";

// Initialize Sequelize SQL Connection (MySQL Container)
let sequelize;
if (process.env.DB_HOST) {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: "mysql",
    logging: false,
    retry: { max: 5 }
  });
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./cart_sql.db",
    logging: false
  });
}

// SQL Table Schema: CartItems
const CartItem = sequelize.define("CartItem", {
  userId: { type: DataTypes.STRING, defaultValue: "guest_user" },
  productId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  image: { type: DataTypes.STRING, allowNull: false }
});

const USER_ID = "guest_user";

app.get("/api/cart", async (req, res) => {
  try {
    const items = await CartItem.findAll({ where: { userId: USER_ID } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;
    let item = await CartItem.findOne({ where: { userId: USER_ID, productId: String(productId) } });
    
    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = await CartItem.create({
        userId: USER_ID,
        productId: String(productId),
        name,
        price,
        image,
        quantity: 1
      });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart/clear", async (req, res) => {
  try {
    await CartItem.destroy({ where: { userId: USER_ID } });
    console.log("🔄 [VM 2 SQL DB Sync] Cart SQL DB cleared via Inter-DB Sync from VM 3 Order DB");
    res.json({ success: true, message: "Cart SQL DB cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    node: "VM 2",
    role: "Cart Microservice (Private VM)",
    db: "Cart SQL Database (MySQL Docker Container)"
  });
});

const PORT = process.env.PORT || 5004;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ [VM 2] Connected to Mini SQL Database (MySQL Container)");
  } catch (e) {
    console.log("⚠️ [VM 2 SQL DB] Connecting to SQL DB...", e.message);
  }
  app.listen(PORT, () => console.log(`🚀 [VM 2] Cart Service running on port ${PORT}`));
};

start();
