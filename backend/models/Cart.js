const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: "guest_user",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Cart", cartItemSchema);
