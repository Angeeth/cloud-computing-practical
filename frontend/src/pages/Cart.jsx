import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(AppContext);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Free shipping

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-800/40 p-6 rounded-full text-slate-500 border border-slate-800/50 mb-6">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our premium catalog to find your style.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/15 transition duration-300 cursor-pointer"
        >
          <span>Explore Catalog</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
      
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your items and proceed to secure checkout
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-[#111625] rounded-2xl p-4 sm:p-5 border border-slate-800/60 flex items-center justify-between gap-4 sm:gap-6 hover:border-slate-800 transition duration-300"
            >
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {item.name}
                  </h2>
                  <p className="text-sm font-semibold text-violet-400 mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                  
                  {/* Quantity Controls for Mobile */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 rounded-md bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 rounded-md bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action column (Delete & Item Price total) */}
              <div className="flex flex-col items-end gap-3 justify-between self-stretch h-full py-1">
                <span className="text-base font-extrabold text-white">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
                
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 rounded-lg bg-slate-950/20 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="bg-[#111625] rounded-3xl p-6 border border-slate-800/60">
          <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-semibold">Free</span>
            </div>
            <div className="flex justify-between text-slate-400 border-b border-slate-800/60 pb-4">
              <span>Taxes</span>
              <span className="text-white">Included</span>
            </div>
            <div className="flex justify-between text-base font-extrabold pt-2">
              <span className="text-white">Total</span>
              <span className="text-violet-400">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/payment"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl flex justify-center items-center gap-2 transition duration-300 shadow-md shadow-violet-600/10 cursor-pointer text-center text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Cart;