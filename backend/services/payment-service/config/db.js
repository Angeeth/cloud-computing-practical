const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) return;
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected (Payment Service): ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
  }
};

module.exports = connectDB;
