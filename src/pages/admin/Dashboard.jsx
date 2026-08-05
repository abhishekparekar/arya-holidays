import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Calendar, Users, Star, TrendingUp, DollarSign, Activity, Loader2, ArrowRight } from 'lucide-react';
import { subscribeToTrips, subscribeToBookings, subscribeToTestimonials } from '../../firebase';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      {trend && (
        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-0.5">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="text-2xl sm:text-3xl font-extrabold text-white mb-0.5">{value}</div>
    <div className="text-gray-400 text-xs font-medium">{label}</div>
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
    
    const timer = setTimeout(() => setLoading(false), 600);
    
    return () => {
      unsubTrips();
      unsubBookings();
      unsubTestimonials();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F5B301] animate-spin" />
      </div>
    );
  }

  const activeTrips = trips.filter(t => t.status === 'active' || !t.status).length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || b.price || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-6 border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage trips, bookings, services and analytics</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5B301] text-[#111111] rounded-xl text-xs font-bold self-start sm:self-auto hover:bg-[#ffc107] transition-all"
        >
          <span>View Public Site</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard 
          icon={Mountain} 
          label="Total Trips" 
          value={trips.length} 
          color="bg-gradient-to-br from-[#F5B301] to-amber-600"
        />
        <StatCard 
          icon={Calendar} 
          label="Pending Bookings" 
          value={pendingBookings} 
          trend="Live"
          color="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard 
          icon={Users} 
          label="Testimonials" 
          value={testimonials.length} 
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Bookings Vol." 
          value={`₹${totalRevenue.toLocaleString()}`} 
          trend="Updated"
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#222222]">
              <h3 className="text-sm font-bold text-white">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-[#F5B301] text-xs font-bold hover:underline">View All</Link>
            </div>
            <div className="space-y-2.5">
              {bookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 text-xs">
                  <div>
                    <div className="text-white font-bold">{booking.name || 'Guest'}</div>
                    <div className="text-gray-400 text-[11px] truncate max-w-[150px]">{booking.tripName || booking.tripId}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                    booking.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {booking.status || 'Pending'}
                  </span>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-gray-500 text-xs text-center py-4">No bookings recorded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Trips */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#222222]">
              <h3 className="text-sm font-bold text-white">Active Packages</h3>
              <Link to="/admin/trips" className="text-[#F5B301] text-xs font-bold hover:underline">Manage</Link>
            </div>
            <div className="space-y-2.5">
              {trips.slice(0, 4).map((trip) => (
                <div key={trip.id} className="flex items-center gap-2.5 py-1.5 border-b border-white/5 last:border-0 text-xs">
                  <img src={trip.images?.[0] || '/placeholder.jpg'} alt={trip.title} className="w-10 h-8 rounded-lg object-cover bg-gray-800" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold truncate">{trip.title}</div>
                    <div className="text-[#F5B301] text-[11px] font-semibold">₹{trip.price?.toLocaleString()}</div>
                  </div>
                  {trip.featured && <span className="text-xs">⭐</span>}
                </div>
              ))}
              {trips.length === 0 && (
                <p className="text-gray-500 text-xs text-center py-4">No trips added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Testimonials */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#222222]">
              <h3 className="text-sm font-bold text-white">Client Reviews</h3>
              <Link to="/admin/testimonials" className="text-[#F5B301] text-xs font-bold hover:underline">Manage</Link>
            </div>
            <div className="space-y-2.5">
              {testimonials.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-2.5 py-1.5 border-b border-white/5 last:border-0 text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#F5B301]/20 flex items-center justify-center text-[#F5B301] font-bold flex-shrink-0">
                    {t.name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold truncate">{t.name}</div>
                    <div className="text-gray-400 text-[11px] truncate">{t.text || t.message}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={10} className="text-[#F5B301] fill-[#F5B301]" />
                    ))}
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <p className="text-gray-500 text-xs text-center py-4">No reviews submitted</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222]">
        <h3 className="text-sm font-bold text-white mb-3">Admin Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <Link to="/admin/trips" className="flex flex-col items-center gap-2 p-3 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors border border-white/5">
            <Mountain className="w-5 h-5 text-[#F5B301]" />
            <span className="text-gray-300 text-xs font-semibold">Trips</span>
          </Link>
          <Link to="/admin/bookings" className="flex flex-col items-center gap-2 p-3 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors border border-white/5">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span className="text-gray-300 text-xs font-semibold">Bookings</span>
          </Link>
          <Link to="/admin/gallery" className="flex flex-col items-center gap-2 p-3 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors border border-white/5">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300 text-xs font-semibold">Gallery</span>
          </Link>
          <Link to="/admin/queries" className="flex flex-col items-center gap-2 p-3 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors border border-white/5">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-xs font-semibold">Queries</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
