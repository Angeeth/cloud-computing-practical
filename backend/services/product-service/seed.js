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
  {
    name: "Gaming Mouse",
    price: 1999,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    rating: 4.8,
    reviewsCount: 114,
    description: "High-precision wireless gaming mouse with custom RGB lighting and programmable buttons.",
    category: "Electronics",
  },
  {
    name: "Mechanical Keyboard",
    price: 4499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600",
    rating: 4.9,
    reviewsCount: 85,
    description: "Tactile mechanical keyboard with hot-swappable switches and dual-mode connection.",
    category: "Electronics",
  },
  {
    name: "DSLR Camera",
    price: 25999,
    originalPrice: 32999,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    rating: 4.7,
    reviewsCount: 43,
    description: "Professional-grade DSLR camera with 24.2 MP sensor and high-definition video recording.",
    category: "Electronics",
  },
  {
    name: "Premium Laptop",
    price: 59999,
    originalPrice: 74999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    rating: 4.8,
    reviewsCount: 210,
    description: "Ultra-slim high-performance laptop with 16GB RAM, 512GB SSD, and stunning display.",
    category: "Electronics",
  },
];

const seedDB = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      console.log("✅ Database Seeded Successfully with products");
    } else {
      console.log("ℹ️  Database already contains products. Skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Seeding database failed:", error.message);
  }
};

module.exports = seedDB;
