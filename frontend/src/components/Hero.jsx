import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="relative bg-gradient-to-br from-[#111625] via-[#0f1424] to-[#1a1b3c] rounded-[2.5rem] overflow-hidden border border-slate-800/60 shadow-2xl">
          {/* Glowing Background Blobs */}
          <div className="absolute top-[-20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[20%] w-[25rem] h-[25rem] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 items-stretch relative z-10">
            
            {/* Content Column */}
            <div className="p-8 sm:p-12 lg:p-20 text-left">
              
              {/* Tag */}
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 tracking-wider uppercase mb-6">
                New Collection
              </span>
              
              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide text-white leading-[1.2] lg:leading-[1.25]">
                Discover Your <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>
              
              {/* Paragraph */}
              <p className="text-slate-300 text-base sm:text-lg mt-8 mb-8 leading-relaxed max-w-lg">
                Explore the latest collection of premium products with amazing prices and fast delivery.
              </p>
              
              {/* Call to Action */}
              <div className="mt-2">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all duration-300 group cursor-pointer"
                >
                  Shop Now
                  <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>

              {/* Banner Pagination dots */}
              <div className="flex gap-2 mt-16">
                <span className="w-8 h-2 rounded-full bg-violet-500" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
              
            </div>
            
            {/* Visual Column */}
            <div className="relative overflow-hidden h-64 sm:h-80 lg:h-auto min-h-[250px] lg:min-h-[450px]">
              <img
                src="/hero_products.png"
                alt="Premium Products Display"
                className="absolute inset-0 w-full h-full object-cover transform hover:scale-102 transition duration-700 pointer-events-none select-none"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;