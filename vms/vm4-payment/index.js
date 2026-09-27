const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

const dbHost = process.env.DB_HOST || "payment-sql-db";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASSWORD || "secretpassword";
const dbName = process.env.DB_NAME || "payment_sqldb";

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
    storage: "./payment_sql.db",
    logging: false
  });
}

// SQL Table Schema: Payments
const PaymentRecord = sequelize.define("PaymentRecord", {
  transactionId: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, defaultValue: "Card" },
  status: { type: DataTypes.STRING, defaultValue: "AUTHORIZED" }
});

app.post("/api/payments", async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Transaction amount required" });
    }

    console.log(`💳 [VM 4 Payment Service] Authorizing payment of ₹${amount} via ${paymentMethod || "Card"}...`);
    const txnId = `TXN-VM4-${Math.floor(100000 + Math.random() * 900000)}`;

    // Save transaction log into VM 4 Payment SQL DB Table
    const record = await PaymentRecord.create({
      transactionId: txnId,
      amount,
      paymentMethod: paymentMethod || "Card",
      status: "AUTHORIZED"
    });

    res.json({
      success: true,
      message: "Payment authorized successfully & recorded in VM 4 Payment SQL DB",
      transactionId: txnId,
      amount,
      paymentMethod: paymentMethod || "Card",
      record
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    node: "VM 4",
    role: "Payment Gateway Microservice (Private VM)",
    db: "Payment SQL Database (MySQL Docker Container)"
  });
});

const PORT = process.env.PORT || 5005;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ [VM 4] Connected to Mini SQL Database (MySQL Container)");
  } catch (e) {
    console.log("⚠️ [VM 4 SQL DB] Connecting to SQL DB...", e.message);
  }
  app.listen(PORT, () => console.log(`🚀 [VM 4] Payment Service running on port ${PORT}`));
};

start();
