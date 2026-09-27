const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://order-db:27017/orderDB";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [VM 3] MongoDB Connected (Order DB): ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ [VM 3] DB Error: ${err.message}`);
  }
};

module.exports = connectDB;
