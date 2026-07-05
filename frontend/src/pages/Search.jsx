import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Search, Loader2, RefreshCw } from "lucide-react";

function SearchPage() {
  const { products, loading, searchQuery, setSearchQuery } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
      
      {/* Page Title & Status */}
      <div className="mb-10 border-b border-slate-900/60 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Search Catalog
        </h1>
        <p className="text-slate-400 text-sm mt-1.5">
          {searchQuery ? (
            <>
              Showing results for <strong className="text-violet-400">"{searchQuery}"</strong>
            </>
          ) : (
            "Browse all available products in our store"
          )}
        </p>
      </div>

      {/* Loading & Grid Rendering */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-3">
          <Loader2 className="text-violet-500 animate-spin" size={40} />
          <p className="text-slate-400 text-sm animate-pulse">Filtering catalog...</p>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-800/40 p-5 rounded-full text-slate-500 border border-slate-800/50 mb-5">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
            We couldn't find any products matching your query. Try resetting your search.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="inline-flex items-center gap-2 bg-[#111625] hover:bg-[#151b2d] text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold px-6 py-3 rounded-xl transition duration-300 cursor-pointer text-sm"
          >
            <RefreshCw size={14} />
            <span>Reset Search Query</span>
          </button>
        </div>
      ) : (
        /* Catalog Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}

export default SearchPage;