import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToTestimonials } from '../firebase';
import { testimonialVariants, easings, viewportConfig } from './animations';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((data) => { setTestimonials(data); setLoading(false); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const scrollAmount = window.innerWidth < 640 ? (window.innerWidth * 0.82) + 16 : 340;

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [loading, isPaused]);

  const scrollLeftNav = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightNav = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const activeTestimonials = testimonials.filter(t => t.status === 'active' || !t.status);

  if (loading) {
    return (
      <section className="py-10" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(245,179,1,0.07) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
        <div className="container-custom flex items-center justify-center min-h-[240px]">
          <Loader2 className="w-10 h-10 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 md:py-12" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(245,179,1,0.07) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
      <div className="container-custom">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-[#F5B301]/10 text-[#F5B301] rounded-full text-xs font-semibold mb-2">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">What Our Clients <span className="text-gradient">Say</span></h2>
          </div>
          {/* Scroll navigation arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollLeftNav}
              className="w-9 h-9 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center text-[#111111] hover:bg-[#F5B301] hover:text-white transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRightNav}
              className="w-9 h-9 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center text-[#111111] hover:bg-[#F5B301] hover:text-white transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <motion.div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex overflow-x-auto pb-2 pt-1 px-1 -mx-1 sm:px-0 sm:-mx-0 snap-x snap-mandatory gap-3 sm:gap-5 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          variants={testimonialVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            .scroll-smooth::-webkit-scrollbar { display: none; }
          `}} />
          {activeTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={testimonialVariants.card}
              whileHover={{ y: -4, scale: 1.01, transition: { type: "spring", stiffness: 150, damping: 15 } }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EEEEEE] hover:border-[#F5B301]/30 transition-all duration-300 flex-none w-[82vw] sm:w-[310px] md:w-[330px] snap-center flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-[#F5B301]/10 flex items-center justify-center mb-3">
                  <Quote className="w-4 h-4 text-[#F5B301]" />
                </div>
                <p className="text-black font-medium leading-relaxed mb-3 line-clamp-4 text-xs sm:text-sm">
                  {testimonial.text || testimonial.message || testimonial.content || 'Great experience!'}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < (testimonial.rating || 5) ? 'text-[#F5B301] fill-[#F5B301]' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-[#EEEEEE] mt-auto">
                {(testimonial.image || testimonial.avatar)
                  ? (<img src={testimonial.image || testimonial.avatar} alt={testimonial.name} className="w-8 h-8 rounded-full object-cover" />)
                  : (<div className="w-8 h-8 rounded-full bg-[#F5B301]/20 flex items-center justify-center"><span className="text-[#F5B301] font-bold text-xs">{testimonial.name?.charAt(0) || 'A'}</span></div>)
                }
                <div>
                  <h4 className="font-bold text-black text-xs sm:text-sm">{testimonial.name || 'Anonymous'}</h4>
                  {testimonial.location && <p className="text-[#777777] text-[11px]">{testimonial.location}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;