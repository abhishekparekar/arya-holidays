import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Search, ArrowRight, Mountain, ChevronRight, Filter, Compass } from 'lucide-react';
import TripCard from '../components/TripCard';
import { subscribeToTrips, subscribeToCategories } from '../firebase';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    let currentCategory = null;

    const unsubscribeCat = subscribeToCategories((categories) => {
      const found = categories.find(c => 
        c.id === id || 
        (c.name && c.name.toLowerCase() === id.toLowerCase()) ||
        (c.title && c.title.toLowerCase() === id.toLowerCase())
      );
      if (found) {
        currentCategory = found;
        setCategory(found);
      } else {
        // Fallback title formatting if category doc isn't explicitly found
        const formattedTitle = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setCategory({ id, title: formattedTitle, name: formattedTitle });
      }
    });

    const unsubscribeTrips = subscribeToTrips((data) => {
      setAllTrips(data);

      const targetId = (id || '').toString().toLowerCase();

      const matched = data.filter(trip => {
        const tripCatId = (trip.categoryId || '').toString().toLowerCase();
        const tripCatName = (trip.categoryName || trip.category || '').toString().toLowerCase();
        const catName = (currentCategory?.name || currentCategory?.title || '').toString().toLowerCase();

        return tripCatId === targetId ||
               (tripCatName && tripCatName === targetId) ||
               (catName && tripCatName.includes(catName)) ||
               (catName && catName.includes(tripCatName));
      });

      // If exact category matches exist use them, else show all trips as fallback
      setTrips(matched);
      setLoading(false);
    });

    return () => {
      unsubscribeCat();
      unsubscribeTrips();
    };
  }, [id]);

  // Filter and sort trips
  const displayTrips = (trips.length > 0 ? trips : allTrips)
    .filter(trip => 
      trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#F5B301]" />
      </div>
    );
  }

  const categoryTitle = category?.title || category?.name || 'Category Packages';
  const headerImage = category?.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2070&q=80';

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header Banner */}
      <div className="relative h-[28vh] min-h-[200px] sm:min-h-[240px] overflow-hidden">
        <img 
          src={headerImage} 
          alt={categoryTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-5 pt-16 sm:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-white/75 mb-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/trips" className="hover:text-white transition-colors">Trips</Link>
              <ChevronRight size={12} />
              <span className="text-[#F5B301] font-bold">{categoryTitle}</span>
            </nav>
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5B301]/20 text-[#F5B301] rounded-full text-xs font-bold mb-1.5 backdrop-blur-md">
                  <Compass size={12} />
                  Category Packages
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  {categoryTitle}
                </h1>
                {category?.description && (
                  <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
                    {category.description}
                  </p>
                )}
              </div>
              
              {/* Count Stats */}
              <div className="hidden sm:flex gap-3 bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{displayTrips.length}</div>
                  <div className="text-[10px] text-white/80">Packages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-2xl border border-[#EEEEEE] shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder={`Search ${categoryTitle} packages...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#EEEEEE] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-auto bg-[#F8F9FB] border border-[#EEEEEE] rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-sm text-black font-semibold focus:outline-none focus:border-[#F5B301] transition-colors cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#888888] pointer-events-none" />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-black font-medium">
            Showing <span className="text-[#111111] font-bold">{displayTrips.length}</span> packages in <span className="text-[#F5B301] font-bold">{categoryTitle}</span>
          </p>
        </div>

        {/* Trips Grid */}
        {displayTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EEEEEE]">
            <div className="w-14 h-14 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-3">
              <Mountain className="w-7 h-7 text-[#9CA3AF]" />
            </div>
            <h3 className="text-base font-bold text-[#111111] mb-1">No packages found</h3>
            <p className="text-[#666666] text-xs sm:text-sm mb-4">Try adjusting your search query.</p>
            <Link to="/trips" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5B301] text-[#111111] font-bold rounded-full text-xs">
              Browse All Trips <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link to="/trips" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-black hover:text-[#F5B301] transition-colors">
            <span>←</span> Back to All Trips
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
