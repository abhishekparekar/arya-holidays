import { useState, useEffect } from 'react';
import { Search, Filter, X, Loader2, CheckCircle, Clock, AlertCircle, Phone, Mail, Calendar } from 'lucide-react';
import { subscribeToBookings, updateBookingStatus } from '../../firebase';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const fullName = booking.name || `${booking.firstName || ''} ${booking.lastName || ''}`.trim();
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm) ||
      booking.tripName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    confirmed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: AlertCircle
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F5B301] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Manage Bookings</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{bookings.length} total bookings recorded</p>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
        {/* Search & Status Controls */}
        <div className="p-3.5 sm:p-5 border-b border-[#222222]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by customer name, email, phone or trip..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#F5B301]" 
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F5B301] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#222222] bg-[#161616]">
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Customer</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Contact</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Trip</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Travelers</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Amount</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Status</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const StatusIcon = statusIcons[booking.status] || Clock;
                return (
                  <tr key={booking.id} className="border-b border-[#222222] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-3 sm:p-4">
                      <div className="text-white font-bold">{booking.name || 'Guest'}</div>
                      <div className="text-gray-400 text-[11px]">{booking.email || 'No Email'}</div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <a href={`tel:${booking.phone}`} className="flex items-center gap-1.5 text-gray-300 hover:text-[#F5B301] text-xs font-semibold">
                        <Phone size={12} className="text-[#F5B301]" />
                        <span>{booking.phone || 'N/A'}</span>
                      </a>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="text-white font-semibold line-clamp-1">{booking.tripName || 'N/A'}</div>
                      <div className="text-gray-400 text-[11px]">{booking.selectedDate || booking.bookingDate}</div>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-300 font-semibold">{booking.travelers || 1} Person</td>
                    <td className="p-3 sm:p-4 text-[#F5B301] font-bold">₹{(booking.amount || booking.price || 0).toLocaleString()}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${statusColors[booking.status || 'pending']}`}>
                        <StatusIcon size={12} />
                        {(booking.status || 'Pending').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <select 
                        value={booking.status || 'pending'} 
                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                        className="bg-[#222222] border border-[#333333] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#F5B301] cursor-pointer font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-xs sm:text-sm">No bookings match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
