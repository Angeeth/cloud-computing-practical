const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  
  if (!uri || uri.includes("YOUR_USERNAME")) {
    console.log("\n========================================================");
    console.log("⚠️  Warning: MONGO_URI in backend/.env is not configured.");
    console.log("Please create your database named ecommerceDB in MongoDB");
    console.log("online and update backend/.env with your URI string.");
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
