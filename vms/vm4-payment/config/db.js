const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://payment-db:27017/paymentDB";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [VM 4] MongoDB Connected (Payment DB): ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ [VM 4] DB Error: ${err.message}`);
  }
};

module.exports = connectDB;
