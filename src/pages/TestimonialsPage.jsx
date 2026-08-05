import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToTestimonials } from '../firebase';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToTestimonials((data) => { 
      setTestimonials(data); 
      setLoading(false); 
    });
  }, []);

  const active = testimonials.filter(t => t.status === 'active' || !t.status);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center pt-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#F5B301]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#EEEEEE] pt-20 sm:pt-24 pb-5 sm:pb-6">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-[#888888] mb-2">
            <Link to="/" className="hover:text-[#F5B301] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Testimonials</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-1.5">
            What Our <span className="text-[#F5B301]">Clients Say</span>
          </h1>
          <p className="text-[#555555] text-xs sm:text-sm">
            Real stories from real travelers who traveled with Arya Holidays
          </p>
        </div>
      </div>

      {/* Testimonials Grid — Compact padding for mobile */}
      <div className="container-custom pt-4 sm:pt-6 pb-4 sm:pb-8">
        {active.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EEEEEE]">
            <Quote className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-[#555555]">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {active.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (Math.min(i, 6)) * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-[#F5B301]/10 flex items-center justify-center mb-3">
                    <Quote className="w-4 h-4 text-[#F5B301]" />
                  </div>
                  <p className="text-black font-medium leading-relaxed mb-3 text-xs sm:text-sm">
                    {t.text || t.message || t.content || 'Great experience!'}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className={j < (t.rating || 5) ? 'text-[#F5B301] fill-[#F5B301]' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#EEEEEE] mt-auto">
                  {(t.image || t.avatar)
                    ? <img src={t.image || t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                    : <div className="w-9 h-9 rounded-full bg-[#F5B301]/20 flex items-center justify-center"><span className="text-[#F5B301] font-bold text-xs">{t.name?.charAt(0) || 'A'}</span></div>
                  }
                  <div>
                    <p className="font-bold text-black text-xs sm:text-sm">{t.name || 'Anonymous'}</p>
                    {t.location && <p className="text-[#777777] text-[11px]">{t.location}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
