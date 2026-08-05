import { useState, useEffect } from 'react';
import { Search, Filter, X, Loader2, CheckCircle, Clock, AlertCircle, Phone, Mail, Calendar } from 'lucide-react';
import { subscribeToBookings, updateBookingStatus } from '../../firebase';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Admin Bookings: Setting up subscription...');
    const unsubscribe = subscribeToBookings((data) => {
      console.log('Admin Bookings: Bookings loaded:', data.length);
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
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: AlertCircle
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
          <p className="text-gray-400">{bookings.length} bookings total</p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-dark-800 rounded-2xl">
          <div className="p-6 border-b border-dark-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, phone or trip..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500" 
                />
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-dark-700">
                  <th className="p-6 font-medium">Customer</th>
                  <th className="p-6 font-medium">Contact</th>
                  <th className="p-6 font-medium">Trip</th>
                  <th className="p-6 font-medium">Travelers</th>
                  <th className="p-6 font-medium">Date</th>
                  <th className="p-6 font-medium">Amount</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusIcons[booking.status] || Clock;
                  return (
                    <tr key={booking.id} className="border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors">
                      <td className="p-6">
                        <div className="text-white font-medium">{booking.name}</div>
                        <div className="text-gray-500 text-sm">{booking.email}</div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-gray-400 text-sm">
                            <Phone size={14} /> {booking.phone}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-white font-medium">{booking.tripName || 'N/A'}</div>
                        <div className="text-gray-500 text-sm">{booking.selectedDate}</div>
                      </td>
                      <td className="p-6 text-gray-300">{booking.travelers}</td>
                      <td className="p-6 text-gray-300">{booking.bookingDate || 'N/A'}</td>
                      <td className="p-6 text-white font-semibold">₹{booking.amount?.toLocaleString() || 0}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusColors[booking.status]}`}>
                          <StatusIcon size={14} />
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </td>
                      <td className="p-6">
                        <select 
                          value={booking.status} 
                          onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
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
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
