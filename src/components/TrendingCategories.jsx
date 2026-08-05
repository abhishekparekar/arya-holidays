import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Mountain, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToCategories } from '../firebase';
import { categoryVariants, easings, viewportConfig } from './animations';

const TrendingCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categoryColors = [
    { bg: 'bg-emerald-500', text: 'text-emerald-500' },
    { bg: 'bg-blue-500', text: 'text-blue-500' },
    { bg: 'bg-amber-500', text: 'text-amber-500' },
    { bg: 'bg-red-500', text: 'text-red-500' },
    { bg: 'bg-purple-500', text: 'text-purple-500' },
    { bg: 'bg-cyan-500', text: 'text-cyan-500' },
    { bg: 'bg-green-500', text: 'text-green-500' },
    { bg: 'bg-pink-500', text: 'text-pink-500' }
  ];

  const scrollLeftNav = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRightNav = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container-custom flex items-center justify-center min-h-[220px]">
          <Loader2 className="w-9 h-9 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white via-[#F8F9FB] to-white border-y border-[#EEEEEE]">
      <div className="container-custom">

        {/* Heading Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5B301]/10 text-[#F5B301] rounded-full text-xs font-bold mb-2">
              <Sparkles size={12} />
              <span>Explore Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              Featured <span className="text-[#F5B301]">Trending Categories</span>
            </h2>
          </div>

          {/* Desktop Arrow Nav */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollLeftNav}
              className="w-9 h-9 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center text-[#111111] hover:bg-[#F5B301] hover:text-white transition-colors shadow-sm cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRightNav}
              className="w-9 h-9 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center text-[#111111] hover:bg-[#F5B301] hover:text-white transition-colors shadow-sm cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Category Scroll Bar (Mobile & Desktop) */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 pt-1 gap-3 sm:gap-5 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#F5B301 #E5E7EB',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {categories.map((category, index) => {
            const color = categoryColors[index % categoryColors.length];
            const categoryTitle = category.title || category.name || 'Adventure';
            return (
              <motion.div
                key={category.id}
                custom={index}
                variants={categoryVariants.card}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex-none w-[70vw] sm:w-[260px] md:w-[280px] snap-start"
              >
                <Link
                  to={`/category/${category.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] hover:border-[#F5B301]/60 transition-all duration-300 shadow-sm hover:shadow-md h-full"
                >
                  {/* Category Image Header */}
                  <div className="relative h-32 sm:h-36 overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={categoryTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F8F9FB] to-white flex items-center justify-center">
                        <Mountain className={`w-12 h-12 ${color.text} opacity-30`} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md ${color.bg} text-white shadow-sm`}>
                      #{index + 1} Trending
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-3.5 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-black group-hover:text-[#F5B301] transition-colors line-clamp-1 mb-1">
                      {categoryTitle}
                    </h3>
                    
                    {category.description && (
                      <p className="text-black font-medium text-xs line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE] mt-auto">
                      <div className="flex items-center gap-1 text-black font-semibold text-xs">
                        <MapPin size={12} className="text-[#F5B301] flex-shrink-0" />
                        <span className="line-clamp-1">{category.location || 'Explore Packages'}</span>
                      </div>
                      
                      <div className="flex items-center gap-0.5 text-[#F5B301] text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Bar Hint for Mobile */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] text-[#777777] font-semibold mt-2">
          <span>Swipe to explore categories</span>
          <ArrowRight size={11} className="text-[#F5B301]" />
        </div>

      </div>
    </section>
  );
};

export default TrendingCategories;