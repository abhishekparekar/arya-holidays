import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Calendar, Users, Star, TrendingUp, DollarSign, Activity, Loader2 } from 'lucide-react';
import { subscribeToTrips, subscribeToBookings, subscribeToTestimonials } from '../../firebase';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="text-green-400 text-sm font-medium flex items-center gap-1">
          <TrendingUp size={14} /> {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubTrips = subscribeToTrips((data) => setTrips(data));
    const unsubBookings = subscribeToBookings((data) => setBookings(data));
    const unsubTestimonials = subscribeToTestimonials((data) => setTestimonials(data));
    
    // Set loading to false after subscriptions are set up
    const timer = setTimeout(() => setLoading(false), 1000);
    
    return () => {
      unsubTrips();
      unsubBookings();
      unsubTestimonials();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const activeTrips = trips.filter(t => t.status === 'active').length;
  const featuredTrips = trips.filter(t => t.featured).length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div>
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to Arya Cline Admin Panel</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Mountain} 
            label="Total Trips" 
            value={trips.length} 
            color="bg-gradient-to-br from-primary-500 to-primary-600"
          />
          <StatCard 
            icon={Calendar} 
            label="Pending Bookings" 
            value={pendingBookings} 
            trend="+12%"
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
          />
          <StatCard 
            icon={Users} 
            label="Testimonials" 
            value={testimonials.length} 
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <StatCard 
            icon={DollarSign} 
            label="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            trend="+8%"
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-primary-400 text-sm hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                  <div>
                    <div className="text-white font-medium">{booking.name || 'Guest'}</div>
                    <div className="text-gray-500 text-sm">{booking.tripName || booking.tripId}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-gray-500 text-center py-4">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Active Trips */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Trips</h3>
              <Link to="/admin/trips" className="text-primary-400 text-sm hover:underline">Manage</Link>
            </div>
            <div className="space-y-3">
              {trips.filter(t => t.status === 'active').slice(0, 5).map((trip) => (
                <div key={trip.id} className="flex items-center gap-3 py-2 border-b border-dark-700 last:border-0">
                  <img src={trip.images?.[0]} alt={trip.title} className="w-12 h-10 rounded-lg object-cover bg-dark-700" />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{trip.title}</div>
                    <div className="text-gray-500 text-xs">₹{trip.price?.toLocaleString()}</div>
                  </div>
                  {trip.featured && <span className="text-yellow-400 text-sm">⭐</span>}
                </div>
              ))}
              {activeTrips === 0 && (
                <p className="text-gray-500 text-center py-4">No active trips</p>
              )}
            </div>
          </div>

          {/* Recent Testimonials */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Reviews</h3>
              <Link to="/admin/testimonials" className="text-primary-400 text-sm hover:underline">Manage</Link>
            </div>
            <div className="space-y-3">
              {testimonials.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-dark-700 last:border-0">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-dark-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-primary-400 font-bold">
                      {t.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs line-clamp-1">{t.text}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <p className="text-gray-500 text-center py-4">No testimonials yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/trips" className="flex flex-col items-center gap-2 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-colors">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-gray-300 text-sm">Manage Trips</span>
            </Link>
            <Link to="/admin/bookings" className="flex flex-col items-center gap-2 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-colors">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-gray-300 text-sm">View Bookings</span>
            </Link>
            <Link to="/admin/gallery" className="flex flex-col items-center gap-2 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-gray-300 text-sm">Update Gallery</span>
            </Link>
            <Link to="/" className="flex flex-col items-center gap-2 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-gray-300 text-sm">View Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
