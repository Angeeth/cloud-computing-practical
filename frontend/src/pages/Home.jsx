import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  const { products, loading } = useContext(AppContext);

  return (
    <div className="pb-16">
      <Hero />

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Featured Products
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full mt-2" />
          </div>
          <Link
            to="/search"
            className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition duration-200 group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Loader2 className="text-violet-500 animate-spin" size={40} />
            <p className="text-slate-400 text-sm animate-pulse">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">No products found. Please ensure the database is online.</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;