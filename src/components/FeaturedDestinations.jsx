import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { subscribeToTrips } from '../firebase';
import TripCard from './TripCard';

const FeaturedDestinations = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTrips((data) => {
      const featured = data.filter(t => t.featured).slice(0, 6);
      setTrips(featured);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="section-padding" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,179,1,0.09) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
        <div className="container-custom flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (trips.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,179,1,0.09) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F8 100%)' }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="container-custom relative">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block px-3.5 py-1.5 bg-[#F5B301]/10 text-[#F5B301] rounded-full text-xs font-semibold mb-3">Featured Destinations</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-2">Discover Your Next<span className="block text-gradient">Adventure</span></h2>
          <p className="text-[#555555] max-w-2xl mx-auto text-xs sm:text-sm">Handpicked destinations that promise unforgettable experiences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {trips.map((trip) => (<TripCard key={trip.id} trip={trip} />))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/trips" className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base py-3 px-6">View All Destinations <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;