const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 98 },
  description: { type: String },
  category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
