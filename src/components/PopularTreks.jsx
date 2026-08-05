import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { subscribeToTrips } from '../firebase';
import TripCard from './TripCard';
import { cardVariants, easings, viewportConfig } from './animations';

const PopularTreks = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTrips((data) => {
      const featuredTrips = data.filter(t => t.featured).slice(0, 4);
      setTrips(featuredTrips.length > 0 ? featuredTrips : data.slice(0, 4));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="section-padding" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(245,179,1,0.08) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
        <div className="container-custom flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (trips.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 md:py-14" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(245,179,1,0.08) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
      <div className="container-custom">
        <motion.div className="text-center mb-6 sm:mb-8" initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={viewportConfig} transition={{ duration: 0.7, ease: easings.premium }}>
          <span className="inline-block px-3.5 py-1.5 bg-[#F5B301]/10 text-[#F5B301] rounded-full text-xs font-semibold mb-3">Popular Trips</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-2">Most Popular<span className="block text-gradient">Trips This Season</span></h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" variants={cardVariants.container} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          {trips.map((trip, index) => (
            <motion.div key={trip.id} variants={cardVariants.card} whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 150, damping: 15 } }} className="will-change-transform">
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularTreks;