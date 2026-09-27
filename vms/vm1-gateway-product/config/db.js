const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://product-db:27017/productDB";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [VM 1] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ [VM 1] DB Error: ${err.message}`);
  }
};

module.exports = connectDB;
