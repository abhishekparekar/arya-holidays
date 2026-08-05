import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Search, ArrowRight, Mountain, ChevronRight, Filter } from 'lucide-react';
import TripCard from '../components/TripCard';
import { subscribeToTrips, subscribeToCategories } from '../firebase';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const unsubscribeCat = subscribeToCategories((categories) => {
      const found = categories.find(c => c.id === id);
      if (found) {
        setCategory(found);
      }
    });

    const unsubscribeTrips = subscribeToTrips((allTrips) => {
      const filteredTrips = allTrips.filter(trip => trip.categoryId === id);
      setTrips(filteredTrips);
      setLoading(false);
    });

    return () => {
      unsubscribeCat();
      unsubscribeTrips();
    };
  }, [id]);

  // Filter and sort trips
  const filteredTrips = trips
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
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  const categoryTitle = category?.title || category?.name || 'Category';
  const headerImage = category?.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2070&q=80';

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Premium Header with Background Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={headerImage} 
            alt={categoryTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-dark-900/50" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        
        <div className="relative h-full flex items-center">
          <div className="container-custom w-full px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
              <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/trips" className="hover:text-primary-400 transition-colors">Trips</Link>
              <ChevronRight size={14} />
              <span className="text-white">{categoryTitle}</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="inline-block px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium mb-4 backdrop-blur-md">
                  Featured Category
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {categoryTitle}
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  {category?.description || `Explore our collection of ${categoryTitle.toLowerCase()} trips and find your perfect adventure.`}
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex gap-6 bg-dark-900/50 backdrop-blur-md rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{filteredTrips.length}</div>
                  <div className="text-sm text-gray-400">Trips</div>
                </div>
                <div className="w-px h-12 bg-dark-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {filteredTrips.filter(t => t.featured).length}
                  </div>
                  <div className="text-sm text-gray-400">Featured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom py-12 px-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${categoryTitle.toLowerCase()} trips...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredTrips.length}</span> trips in 
            <span className="text-primary-400"> {categoryTitle}</span>
          </p>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dark-700">
            <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mountain className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No trips found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms.' : 'No trips available in this category yet.'}
            </p>
            <Link to="/trips" className="btn-primary inline-flex items-center gap-2">
              Browse All Trips <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link to="/trips" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>←</span> Back to All Trips
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
