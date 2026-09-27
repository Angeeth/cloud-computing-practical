const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  
  if (!uri || uri.includes("YOUR_USERNAME")) {
    console.log("\n========================================================");
    console.log("⚠️  Warning: MONGO_URI in environment is not configured.");
    console.log("========================================================\n");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
  }
};

module.exports = connectDB;
