const Product = require("../models/Product");

// Get all products (with optional search query)
const getProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};

    if (q) {
      filter = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get single product details
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
