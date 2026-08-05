import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Mountain, MapPin } from 'lucide-react';
import { subscribeToCategories } from '../firebase';
import { categoryVariants, easings, viewportConfig } from './animations';

const TrendingCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(sorted.slice(0, 8));
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

  if (loading) {
    return (
      <section className="py-16" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(245,179,1,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.06) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
        <div className="container-custom flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 md:py-14" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(245,179,1,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.06) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
      <div className="container-custom">
        <motion.div className="text-center mb-6 sm:mb-8" initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={viewportConfig} transition={{ duration: 0.7, ease: easings.premium }}>
          <span className="inline-block px-3.5 py-1.5 bg-[#F5B301]/10 text-[#F5B301] rounded-full text-xs font-semibold mb-3">Featured</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-2">Trending<span className="block text-gradient">Categories</span></h2>
        </motion.div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6" variants={categoryVariants.container} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          {categories.map((category, index) => {
            const color = categoryColors[index % categoryColors.length];
            const categoryTitle = category.title || category.name || 'Adventure';
            return (
              <motion.div key={category.id} custom={index} variants={categoryVariants.card} whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 150, damping: 15 } }} className="will-change-transform">
                <Link to={`/category/${category.id}`} className="group block bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#EEEEEE] hover:border-[#F5B301]/50 transition-all duration-300 hover:shadow-card-hover">
                  <div className="relative h-28 sm:h-36 md:h-40 overflow-hidden">
                    {category.image ? (<img src={category.image} alt={categoryTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />) : (<div className="w-full h-full bg-gradient-to-br from-[#F8F9FB] to-white flex items-center justify-center"><Mountain className={`w-12 h-12 sm:w-16 sm:h-16 ${color.text} opacity-30`} /></div>)}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md ${color.bg} text-white`}>{category.order || index + 1}#</div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-[#111111] mb-1 group-hover:text-[#F5B301] transition-colors line-clamp-1">{categoryTitle}</h3>
                    {category.description && <p className="text-[#555555] text-xs mb-2 line-clamp-2 hidden sm:block">{category.description}</p>}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#EEEEEE]">
                      <div className="flex items-center gap-1 text-[#888888] text-[11px] sm:text-xs"><MapPin size={11} className="text-[#F5B301] flex-shrink-0" /><span className="line-clamp-1">{category.location || 'Explore'}</span></div>
                      <div className="flex items-center gap-0.5 text-[#F5B301] text-[11px] sm:text-xs font-semibold"><span>Go</span><ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" /></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingCategories;