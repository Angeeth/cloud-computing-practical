const Product = require("./models/Product");

const seedProducts = [
  {
    name: "Wireless Headphones",
    price: 2999,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    rating: 4.6,
    reviewsCount: 128,
    description: "Premium wireless headphones with active noise cancellation and crystal clear audio.",
    category: "Electronics",
  },
  {
    name: "Running Shoes",
    price: 3999,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    rating: 4.7,
    reviewsCount: 98,
    description: "Lightweight and durable running shoes designed for ultimate speed and comfort.",
    category: "Footwear",
  },
  {
    name: "Smart Watch",
    price: 4999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    rating: 4.5,
    reviewsCount: 76,
    description: "Elegant smartwatch with real-time heart rate monitoring, fitness tracking, and cellular connectivity.",
    category: "Electronics",
  },
  {
    name: "Backpack",
    price: 1499,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    rating: 4.4,
    reviewsCount: 62,
    description: "Spacious, water-resistant daily commute backpack with dedicated laptop sleeve.",
    category: "Accessories",
  },
];

const seedDB = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      console.log("✅ [VM 1 DB] Product DB Seeded Successfully");
    }
  } catch (error) {
    console.error("❌ [VM 1 DB] Seeding failed:", error.message);
  }
};

module.exports = seedDB;
