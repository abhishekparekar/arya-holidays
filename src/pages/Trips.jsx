import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, MapPin, ChevronRight, Mountain, Globe, LayoutGrid, Filter } from 'lucide-react';
import TripCard from '../components/TripCard';
import { subscribeToTrips, subscribeToCategories } from '../firebase';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedType = searchParams.get('type') || 'all';
  const selectedCategory = searchParams.get('category') || 'all';

  const setType = (t) => setSearchParams(p => { 
    const n = new URLSearchParams(p); 
    if (t === 'all') {
      n.delete('type');
    } else {
      n.set('type', t);
    }
    return n; 
  });

  const setCategory = (c) => setSearchParams(p => { 
    const n = new URLSearchParams(p); 
    if (c === 'all') {
      n.delete('category');
    } else {
      n.set('category', c);
    }
    return n; 
  });

  useEffect(() => {
    const unsubscribeTrips = subscribeToTrips((data) => {
      setTrips(data);
      setLoading(false);
    });
    const unsubscribeCategories = subscribeToCategories((data) => {
      // Filter out duplicate "All" or "Domestic"/"International" category entries to avoid repeating filter buttons
      const filtered = data
        .filter(cat => {
          const name = (cat.name || cat.title || '').trim().toLowerCase();
          return name !== 'all' && name !== 'all trips' && name !== 'domestic' && name !== 'international';
        })
        .map(cat => ({ id: cat.id, title: cat.name || cat.title }));

      setCategories(filtered);
    });
    return () => { unsubscribeTrips(); unsubscribeCategories(); };
  }, []);

  const filteredTrips = trips.filter(trip => {
    const matchesType = selectedType === 'all' || trip.tripType === selectedType;
    const matchesCategory = selectedCategory === 'all' || trip.categoryId === selectedCategory;
    return matchesType && matchesCategory;
  });

  const domesticCount = trips.filter(t => t.tripType === 'domestic').length;
  const internationalCount = trips.filter(t => t.tripType === 'international').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#F5B301]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Hero Banner */}
      <div className="relative h-[26vh] min-h-[180px] sm:min-h-[220px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2070&q=80"
          alt="Adventures"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end pb-4 pt-16 sm:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <nav className="flex items-center gap-1.5 text-[11px] text-white/70 mb-1.5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={11} />
              <span className="text-white">Trips</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F5B301]/20 text-[#F5B301] rounded-full text-[10px] sm:text-xs font-bold mb-1 backdrop-blur-sm">
                  <LayoutGrid size={10} />
                  Featured Adventures
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Explore Our <span className="text-[#F5B301]">Trips</span>
                </h1>
              </div>
              {/* Stats pill */}
              <div className="hidden sm:flex gap-3 bg-white/15 backdrop-blur-md rounded-xl px-3.5 py-1.5 border border-white/20">
                <div className="text-center">
                  <div className="text-base font-bold text-white">{trips.length}</div>
                  <div className="text-[10px] text-white/80">Total</div>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-base font-bold text-emerald-400">{domesticCount}</div>
                  <div className="text-[10px] text-white/80">Domestic</div>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-base font-bold text-blue-400">{internationalCount}</div>
                  <div className="text-[10px] text-white/80">International</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Non-repeating Filter Bar */}
      <div className="sticky top-16 lg:top-[76px] z-40 bg-white border-b border-[#EEEEEE] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            
            {/* Trip Type Filter Group */}
            <div className="flex items-center gap-1.5 flex-shrink-0 bg-gray-100 p-1 rounded-full border border-gray-200">
              <button
                onClick={() => setType('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedType === 'all'
                    ? 'bg-[#F5B301] text-[#111111] shadow-sm'
                    : 'text-black hover:text-[#F5B301]'
                }`}
              >
                All ({trips.length})
              </button>

              <button
                onClick={() => setType('domestic')}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                  selectedType === 'domestic'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-black hover:text-emerald-600'
                }`}
              >
                <MapPin size={11} />
                Domestic ({domesticCount})
              </button>

              <button
                onClick={() => setType('international')}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                  selectedType === 'international'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-black hover:text-blue-600'
                }`}
              >
                <Globe size={11} />
                International ({internationalCount})
              </button>
            </div>

            {/* Separator Divider */}
            {categories.length > 0 && (
              <div className="w-px h-5 bg-gray-300 mx-1 flex-shrink-0" />
            )}

            {/* Category Filter Buttons (Non-Repeating) */}
            {categories.length > 0 && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#111111] text-[#F5B301]'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-[#111111] text-[#F5B301]'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Trip Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm text-black font-medium">
            Showing <span className="text-[#111111] font-bold">{filteredTrips.length}</span> adventures
          </p>
          {(selectedType !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => { setType('all'); setCategory('all'); }}
              className="text-xs text-[#F5B301] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EEEEEE]">
            <div className="w-14 h-14 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-3">
              <Mountain className="w-7 h-7 text-[#9CA3AF]" />
            </div>
            <h3 className="text-base font-bold text-[#111111] mb-1">No trips found</h3>
            <p className="text-[#666666] text-xs sm:text-sm">Try resetting or selecting another filter category.</p>
            <button
              onClick={() => { setType('all'); setCategory('all'); }}
              className="mt-4 px-4 py-2 bg-[#F5B301] text-[#111111] text-xs font-bold rounded-full"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
