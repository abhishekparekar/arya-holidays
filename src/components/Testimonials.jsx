import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Loader2 } from 'lucide-react';
import { subscribeToTestimonials } from '../firebase';
import { testimonialVariants, easings, viewportConfig } from './animations';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((data) => { setTestimonials(data); setLoading(false); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const scrollAmount = window.innerWidth < 640 ? (window.innerWidth * 0.85) + 24 : 364; // +24px for gap-6

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [loading]);

  const activeTestimonials = testimonials.filter(t => t.status === 'active' || !t.status);

  if (loading) {
    return (
      <section className="py-16" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(245,179,1,0.07) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
        <div className="container-custom flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-24" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(245,179,1,0.07) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
      <div className="container-custom">
        <motion.div className="text-center mb-16" initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={viewportConfig} transition={{ duration: 0.7, ease: easings.premium }}>
          <span className="inline-block px-4 py-2 bg-[#F5B301]/10 text-[#F5B301] rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-6">What Our Clients<span className="block text-gradient">Say About Us</span></h2>
        </motion.div>

        <motion.div
          ref={scrollRef}
          className="flex overflow-x-auto pb-10 pt-4 px-4 -mx-4 sm:px-0 sm:-mx-0 snap-x snap-mandatory gap-6 scroll-smooth"
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
            <motion.div key={testimonial.id} variants={testimonialVariants.card} whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 150, damping: 15 } }} className="bg-white rounded-2xl p-6 border border-[#EEEEEE] hover:border-[#F5B301]/30 transition-all duration-300 will-change-transform flex-none w-[85vw] sm:w-[320px] md:w-[340px] snap-center flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F5B301]/10 flex items-center justify-center mb-4"><Quote className="w-5 h-5 text-[#F5B301]" /></div>
                <p className="text-[#555555] leading-relaxed mb-4 line-clamp-4">{testimonial.text || testimonial.message || testimonial.content || 'Great experience!'}</p>
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={14} className={i < (testimonial.rating || 5) ? 'text-[#F5B301] fill-[#F5B301]' : 'text-gray-300'} />))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-auto">
                {(testimonial.image || testimonial.avatar) ? (<img src={testimonial.image || testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />) : (<div className="w-10 h-10 rounded-full bg-[#F5B301]/20 flex items-center justify-center"><span className="text-[#F5B301] font-semibold text-sm">{testimonial.name?.charAt(0) || 'A'}</span></div>)}
                <div>
                  <h4 className="font-semibold text-[#111111] text-sm">{testimonial.name || 'Anonymous'}</h4>
                  {testimonial.location && <p className="text-[#888888] text-xs">{testimonial.location}</p>}
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