import { ShoppingCart, Star, Heart } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(AppContext);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group bg-[#111625] rounded-3xl overflow-hidden border border-slate-800/60 shadow-lg hover:shadow-violet-600/10 hover:border-slate-700/80 transition-all duration-300 flex flex-col h-full relative">
      
      {/* Heart / Wishlist Icon */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/5 hover:bg-slate-900 text-slate-300 hover:text-rose-500 transition duration-300 cursor-pointer"
      >
        <Heart size={16} fill={isLiked ? "#f43f5e" : "transparent"} className={isLiked ? "text-rose-500 scale-110" : ""} />
      </button>

      {/* Product Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900/40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-108 transition duration-500"
        />
      </div>

      {/* Info details */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Rating and reviews */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-white font-medium">{product.rating || "4.5"}</span>
          <span>({product.reviewsCount || "98"})</span>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-white tracking-tight line-clamp-1 group-hover:text-violet-400 transition duration-300">
          {product.name}
        </h2>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-extrabold text-violet-400">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-5 pt-2 flex-grow flex items-end">
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl flex justify-center items-center gap-2 transition duration-300 shadow-md shadow-violet-600/10 cursor-pointer active:scale-98"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default ProductCard;