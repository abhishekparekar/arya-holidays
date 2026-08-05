import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, PhoneCall, Sparkles } from 'lucide-react';
import { easings } from './animations';

const Hero = () => {
  return (
    <section className="relative w-full flex flex-col justify-between overflow-hidden min-h-[82vh] sm:min-h-[88vh] lg:min-h-[640px]" style={{ background: '#0a0a0a' }}>

      {/* Background image — fills entire section */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=2070&q=80')",
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      />

      {/* Overlay — dark gradient for crystal clear text readability */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.80) 75%, rgba(0,0,0,0.92) 100%)',
        transform: 'translateZ(0)'
      }} />

      {/* Hero content — centered vertically */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-8 sm:pb-12 max-w-5xl mx-auto w-full">

        {/* Frosted Glass Content Card on Mobile */}
        <div className="bg-black/35 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-5 sm:p-0 rounded-3xl border border-white/10 sm:border-none shadow-2xl sm:shadow-none w-full max-w-xl sm:max-w-none mx-auto">
          
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easings.premium }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-[#F5B301]/20 text-[#F5B301] border border-[#F5B301]/30 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md"
          >
            <Sparkles size={11} />
            <span>Trusted by Travelers</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: easings.premium }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug sm:leading-[1.1] tracking-tight mb-2.5 sm:mb-4"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.7)' }}
          >
            Arya Holidays Makes{' '}
            <span className="text-[#F5B301]">Every Journey</span>{' '}
            Reliable
          </motion.h1>

          {/* Decorative Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: easings.premium }}
            className="h-1 w-16 sm:w-20 bg-[#F5B301] rounded-full mx-auto mb-3 sm:mb-5"
            style={{ boxShadow: '0 2px 10px rgba(245, 179, 1, 0.4)' }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: easings.premium }}
            className="text-white/95 text-xs sm:text-base md:text-lg max-w-md sm:max-w-2xl mx-auto mb-5 sm:mb-8 leading-relaxed font-inter font-medium"
          >
            Discover extraordinary domestic & international travel packages, trekking adventures, and personalized holiday solutions.
          </motion.p>

          {/* Action Buttons — Full width buttons stacked on mobile for thumb usability */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.65, ease: easings.premium }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-[260px] sm:max-w-none mx-auto"
          >
            <Link
              to="/trips"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5B301] text-[#111111] font-bold font-inter tracking-wide px-6 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-base hover:bg-[#ffc107] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(245,179,1,0.5)] active:scale-95 transition-all duration-300"
            >
              <Compass className="w-4 h-4 text-[#111111]" />
              <span>Explore Trips</span>
            </Link>
            
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold font-inter tracking-wide px-6 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-base backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/60 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4 text-[#F5B301]" />
              <span>Contact Us</span>
            </Link>
          </motion.div>
        </div>

      </div>

      {/* Stats bar — Glassmorphic bar pinned at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: easings.premium }}
        className="relative z-10 w-full"
      >
        <div
          className="grid grid-cols-3 sm:flex items-center justify-items-center justify-center sm:justify-around gap-1 sm:gap-0 px-3 sm:px-8 py-3 sm:py-4"
          style={{ background: 'linear-gradient(90deg, rgba(9,36,32,0.96) 0%, rgba(12,51,46,0.96) 50%, rgba(9,36,32,0.96) 100%)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.12)' }}
        >
          {/* Google Reviews */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow">
              <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-extrabold text-xs sm:text-base leading-tight">100+</div>
              <div className="text-white/75 text-[9px] sm:text-[11px] font-semibold whitespace-nowrap">Google Reviews</div>
            </div>
          </div>

          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />

          {/* Instagram Followers */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
              <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-extrabold text-xs sm:text-base leading-tight">500k+</div>
              <div className="text-white/75 text-[9px] sm:text-[11px] font-semibold whitespace-nowrap">Instagram</div>
            </div>
          </div>

          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />

          {/* Happy Customers */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#F5B301] flex items-center justify-center flex-shrink-0 shadow">
              <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-extrabold text-xs sm:text-base leading-tight">5k+</div>
              <div className="text-white/75 text-[9px] sm:text-[11px] font-semibold whitespace-nowrap">Happy Clients</div>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;
