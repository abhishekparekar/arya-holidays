import { motion } from 'framer-motion';
import { Shield, Award, Users, Clock, Headphones, Map, Sparkles, Heart, Star } from 'lucide-react';
import { easings, viewportConfig } from './animations';

const features = [
  { icon: Shield, title: 'Safety First', description: 'Certified guides and comprehensive safety protocols for every adventure.', color: 'emerald' },
  { icon: Award, title: 'Expert Guides', description: 'Experienced professionals who know the trails inside out.', color: 'gold' },
  { icon: Users, title: 'Small Groups', description: 'Intimate group sizes ensuring personalized attention.', color: 'blue' },
  { icon: Clock, title: 'Flexible Booking', description: 'Easy rescheduling and cancellation policies.', color: 'purple' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock assistance during your journey.', color: 'cyan' },
  { icon: Map, title: 'Curated Routes', description: 'Handpicked trails for the best experiences.', color: 'orange' }
];

const colorMap = {
  emerald: { bg: 'bg-emerald-50', border: 'hover:border-emerald-300', icon: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-600' },
  gold: { bg: 'bg-amber-50', border: 'hover:border-amber-300', icon: 'text-amber-500', badge: 'bg-amber-50 text-amber-600' },
  blue: { bg: 'bg-blue-50', border: 'hover:border-blue-300', icon: 'text-blue-500', badge: 'bg-blue-50 text-blue-600' },
  purple: { bg: 'bg-purple-50', border: 'hover:border-purple-300', icon: 'text-purple-500', badge: 'bg-purple-50 text-purple-600' },
  cyan: { bg: 'bg-cyan-50', border: 'hover:border-cyan-300', icon: 'text-cyan-500', badge: 'bg-cyan-50 text-cyan-600' },
  orange: { bg: 'bg-orange-50', border: 'hover:border-orange-300', icon: 'text-orange-500', badge: 'bg-orange-50 text-orange-600' }
};

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,179,1,0.09) 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(139,92,246,0.07) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F2F2F7 100%)' }}>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F5B301]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <motion.div className="text-center mb-12 md:mb-16 px-4" initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={viewportConfig} transition={{ duration: 0.7, ease: easings.premium }}>
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#F5B301]/50" />
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5B301] animate-pulse" />
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#F5B301]/50" />
          </div>
          <span className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-white border border-[#EEEEEE] rounded-full text-xs sm:text-sm font-medium text-[#555555] mb-4 sm:mb-6 shadow-sm">Why Arya Holidays</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mb-4 sm:mb-6 tracking-tight leading-tight">The <span className="text-[#F5B301]">Premium</span> Experience</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-8 md:gap-y-12 lg:gap-y-16 px-2 sm:px-0">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: easings.premium }}
                className="group flex flex-row gap-4 sm:gap-5 items-start hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm border border-black/5`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#111111] mb-1.5 sm:mb-2 group-hover:text-[#F5B301] transition-colors duration-300 leading-snug">{feature.title}</h3>
                  <p className="text-[#666666] leading-relaxed text-xs sm:text-sm md:text-base">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-[#EEEEEE]/60 flex flex-wrap justify-center items-center gap-5 sm:gap-8 md:gap-12" initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={viewportConfig} transition={{ duration: 0.6, delay: 0.4, ease: easings.premium }}>
          {[{ icon: Shield, text: 'Licensed & Insured' }, { icon: Heart, text: '5-Star Reviews' }, { icon: Award, text: 'Award Winning' }, { icon: Users, text: '10K+ Happy Clients' }].map((badge, i) => (
            <motion.div key={i} className="flex items-center gap-2 sm:gap-3 text-[#555555]" whileHover={{ scale: 1.05, color: '#F5B301' }} transition={{ duration: 0.2 }}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-[#EEEEEE] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex-shrink-0"><badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5B301]" /></div>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;