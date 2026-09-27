const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "Card" },
  paymentStatus: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
