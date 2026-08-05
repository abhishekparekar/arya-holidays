import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToTestimonials } from '../firebase';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    return subscribeToTestimonials((data) => { setTestimonials(data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.85 : 364;

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [loading]);

  const active = testimonials.filter(t => t.status === 'active' || !t.status);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center pt-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#F5B301]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#EEEEEE] pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-[#888888] mb-2">
            <Link to="/" className="hover:text-[#F5B301] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Testimonials</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-1.5">What Our <span className="text-[#F5B301]">Clients Say</span></h1>
          <p className="text-[#555555] text-xs sm:text-sm">Real stories from real travelers who traveled with Arya Holidays</p>
        </div>
      </div>

      <div className="container-custom py-6 sm:py-8">
        {active.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EEEEEE]">
            <Quote className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-[#555555]">No testimonials yet.</p>
          </div>
        ) : (
          <motion.div
            ref={scrollRef}
            className="flex overflow-x-auto pb-10 pt-4 px-4 -mx-4 sm:px-0 sm:-mx-0 snap-x snap-mandatory gap-6 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              .scroll-smooth::-webkit-scrollbar { display: none; }
            `}} />
            {active.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (Math.min(i, 5)) * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-[#EEEEEE] shadow-sm hover:shadow-md transition-all flex-none w-[85vw] sm:w-[320px] md:w-[340px] snap-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#F5B301]/10 flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-[#F5B301]" />
                  </div>
                  <p className="text-[#555555] leading-relaxed mb-4 text-sm">{t.text || t.message || t.content || 'Great experience!'}</p>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className={j < (t.rating || 5) ? 'text-[#F5B301] fill-[#F5B301]' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[#EEEEEE] mt-auto">
                  {(t.image || t.avatar)
                    ? <img src={t.image || t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    : <div className="w-10 h-10 rounded-full bg-[#F5B301]/20 flex items-center justify-center"><span className="text-[#F5B301] font-bold text-sm">{t.name?.charAt(0) || 'A'}</span></div>
                  }
                  <div>
                    <p className="font-semibold text-[#111111] text-sm">{t.name || 'Anonymous'}</p>
                    {t.location && <p className="text-[#888888] text-xs">{t.location}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
