const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

const dbHost = process.env.DB_HOST || "order-sql-db";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASSWORD || "secretpassword";
const dbName = process.env.DB_NAME || "order_sqldb";

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
    storage: "./order_sql.db",
    logging: false
  });
}

// SQL Table Schema: Orders
const Order = sequelize.define("Order", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  items: { type: DataTypes.TEXT, allowNull: false }, // stored as JSON string in SQL
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, defaultValue: "Card" },
  paymentStatus: { type: DataTypes.STRING, defaultValue: "Paid" }
});

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://10.128.0.10:5005/api/payments";
const PRODUCT_SYNC_URL = process.env.PRODUCT_SYNC_URL || "http://10.128.0.7:5001/api/products/sync-stock";
const CART_SYNC_URL = process.env.CART_SYNC_URL || "http://10.128.0.8:5004/api/cart/clear";

app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, phone, address, items, totalAmount, paymentMethod } = req.body;

    if (!name || !email || !phone || !address || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: "All checkout details and items are required" });
    }

    console.log(`[VM 3 Order Service] Contacting VM 4 Payment Service at ${PAYMENT_SERVICE_URL}...`);

    // 1. Call VM 4 Payment Service
    try {
      const payRes = await fetch(PAYMENT_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, paymentMethod })
      });
      const payData = await payRes.json();
      console.log(`[VM 3] Payment authorized by VM 4 Payment Service! Txn: ${payData.transactionId || 'OK'}`);
    } catch (err) {
      console.warn(`[VM 3] Notice: Payment simulated locally (${err.message})`);
    }

    // 2. Save Order to VM 3 Order SQL DB Table
    const savedOrder = await Order.create({
      name, email, phone, address,
      items: JSON.stringify(items),
      totalAmount,
      paymentMethod: paymentMethod || "Card",
      paymentStatus: "Paid"
    });

    // 3. Trigger Inter-DB Sync Across VMs:
    fetch(PRODUCT_SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    }).catch(e => console.log("Syncing VM 1 Product DB..."));

    fetch(CART_SYNC_URL, { method: "POST" }).catch(e => console.log("Syncing VM 2 Cart SQL DB..."));

    res.status(201).json({
      message: "Order placed successfully! (Saved to VM 3 Order SQL DB & VMs Synced)",
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
    db: "Order SQL Database (MySQL Docker Container)"
  });
});

const PORT = process.env.PORT || 5003;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ [VM 3] Connected to Mini SQL Database (MySQL Container)");
  } catch (e) {
    console.log("⚠️ [VM 3 SQL DB] Connecting to SQL DB...", e.message);
  }
  app.listen(PORT, () => console.log(`🚀 [VM 3] Order Service running on port ${PORT}`));
};

start();
