import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, ShoppingBag } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setSearchQuery } = useContext(AppContext);
  const [localSearch, setLocalSearch] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate("/search");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a0e1a]/95 backdrop-blur-md border-b border-slate-800/80 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6 md:px-8 gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white select-none">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-violet-500/20">
            <ShoppingBag size={22} className="animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            Ecommerce
          </span>
        </Link>

        {/* Center Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-8">
          <input
            type="text"
            placeholder="Search for products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-[#111625] text-slate-100 placeholder-slate-400 text-sm border border-slate-800/80 focus:border-violet-500/60 rounded-xl py-3 pl-5 pr-12 outline-none transition duration-300"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md shadow-violet-500/10"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`relative py-2 text-slate-300 hover:text-white transition duration-200 ${
              isActive("/") ? "text-white font-bold" : ""
            }`}
          >
            Home
            {isActive("/") && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
            )}
          </Link>

          <Link
            to="/cart"
            className={`relative flex items-center gap-2 py-2 text-slate-300 hover:text-white transition duration-200 ${
              isActive("/cart") ? "text-white font-bold" : ""
            }`}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0e1a]">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
            {isActive("/cart") && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
            )}
          </Link>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;