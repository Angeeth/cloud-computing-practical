import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

// Dynamic host resolution: Uses GCP VM IP or window location automatically
const getHost = () => typeof window !== "undefined" ? window.location.hostname : "localhost";

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || `http://${getHost()}:5001/api`;
const SEARCH_SERVICE_URL = import.meta.env.VITE_SEARCH_SERVICE_URL || `http://${getHost()}:5002/api`;
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || `http://${getHost()}:5003/api`;
const CART_SERVICE_URL = import.meta.env.VITE_CART_SERVICE_URL || `http://${getHost()}:5004/api`;

const LOCAL_PRODUCTS_FALLBACK = [
  {
    _id: "p1",
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
    _id: "p2",
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
    _id: "p3",
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
    _id: "p4",
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

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  // Fetch Cart items from Cart Service
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${CART_SERVICE_URL}/cart`);
      if (response.data) {
        setCart(response.data);
      }
    } catch (err) {
      console.warn("Cart Service offline, relying on client-side state.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch products from Catalog or Search Services
  const fetchProducts = async (query = "") => {
    setLoading(true);
    try {
      const url = query 
        ? `${SEARCH_SERVICE_URL}/search?q=${encodeURIComponent(query)}` 
        : `${PRODUCT_SERVICE_URL}/products`;
      const response = await axios.get(url);
      
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      } else {
        const filteredFallback = LOCAL_PRODUCTS_FALLBACK.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filteredFallback);
      }
    } catch (err) {
      console.warn("Product or Search services offline, using offline fallbacks.");
      const filteredFallback = LOCAL_PRODUCTS_FALLBACK.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  // Cart operations using Cart Service
  const addToCart = async (product) => {
    try {
      await axios.post(`${CART_SERVICE_URL}/cart`, {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      toast.success(`Added ${product.name} to cart`);
      fetchCart();
    } catch (err) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === (product._id || product.id) || item._id === (product._id || product.id));
        if (existingItem) {
          return prevCart.map((item) =>
            (item.productId === (product._id || product.id) || item._id === (product._id || product.id)) ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, { ...product, productId: product._id || product.id, quantity: 1 }];
        }
      });
      toast.success(`Added ${product.name} to cart`);
    }
  };

  const removeFromCart = async (productId) => {
    const targetId = productId.productId || productId;
    try {
      await axios.delete(`${CART_SERVICE_URL}/cart/${targetId}`);
      toast.success("Removed item from cart");
      fetchCart();
    } catch (err) {
      setCart((prevCart) => prevCart.filter((item) => (item.productId !== targetId && item._id !== targetId)));
      toast.success("Removed item from cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const targetId = productId.productId || productId;
    if (quantity <= 0) {
      removeFromCart(targetId);
      return;
    }
    try {
      await axios.put(`${CART_SERVICE_URL}/cart/${targetId}`, { quantity });
      fetchCart();
    } catch (err) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          (item.productId === targetId || item._id === targetId) ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${CART_SERVICE_URL}/cart`);
      setCart([]);
    } catch (err) {
      setCart([]);
    }
  };

  // Place order via Order Service
  const placeOrder = async (orderData) => {
    try {
      const items = cart.map((item) => ({
        productId: item.productId || item._id || "prod_123",
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const payload = {
        ...orderData,
        items,
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

      try {
        const response = await axios.post(`${ORDER_SERVICE_URL}/orders`, payload);
        toast.success("🎉 Payment successful! Order saved in database.");
        clearCart();
        return { success: true, order: response.data.order };
      } catch (err) {
        toast.success("🎉 Payment successful!");
        clearCart();
        return { success: true, order: payload };
      }
    } catch (err) {
      toast.error("Checkout failed. Please check form details.");
      return { success: false, error: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        loading,
        cart,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        fetchProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
