import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Users, Shield, CheckCircle, ArrowRight, Calendar, X, Share2, Heart, ChevronRight, Loader2, Mountain, ArrowRightCircle } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import { getTripById, getTrips } from '../firebase';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('highlights');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrekkers, setSelectedTrekkers] = useState(1);
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [relatedTrips, setRelatedTrips] = useState([]);
  const bookingRef = useRef(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripData = await getTripById(id);
        if (tripData) setTrip(tripData);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTrip();
  }, [id]);

  useEffect(() => {
    const fetchRelatedTrips = async () => {
      if (!trip) return;
      try {
        const allTrips = await getTrips();
        const filtered = allTrips.filter(t => t.id !== trip.id);
        const sameCategory = filtered.filter(t => t.categoryId === trip.categoryId || t.categoryName === trip.categoryName);
        const otherTrips = filtered.filter(t => t.categoryId !== trip.categoryId && t.categoryName !== trip.categoryName);
        setRelatedTrips([...sameCategory.slice(0, 3), ...otherTrips.slice(0, 3)]);
      } catch (error) {
        console.error('Error fetching related trips:', error);
      }
    };
    if (trip) fetchRelatedTrips();
  }, [trip]);

  const handleBooking = () => {
    const params = new URLSearchParams();
    if (selectedDate) params.append('date', selectedDate);
    if (selectedTrekkers > 1) params.append('trekkers', selectedTrekkers);
    const queryString = params.toString();
    navigate(`/booking/${id}${queryString ? `?${queryString}` : ''}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#F5B301] animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Trip not found</h2>
          <Link to="/trips" className="btn-primary">Back to Trips</Link>
        </div>
      </div>
    );
  }

  const allDepartureDates = [
    ...(trip.availableDates || []).map(d => ({ date: d, type: 'available', pickupLocation: null, address: null })),
    ...(trip.pickupLocations || []).filter(p => p.date).map(p => ({
      date: p.date, type: 'pickup', pickupLocation: p.location, address: p.address, time: p.time
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const tabs = [
    { id: 'highlights', label: 'Highlights' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'things', label: 'Things' },
    { id: 'policy', label: 'Policies' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <div className="relative pt-16 md:pt-20">
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[75vh] bg-black">
          {trip.images?.length > 0 ? (
            <ImageSlider images={trip.images} autoPlay={true} interval={5000} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
              <Mountain className="w-20 h-20 text-gray-700 mb-4" />
              <span className="text-gray-500 font-medium">No Images Available</span>
            </div>
          )}
          
          {/* Gradients to protect the overlay text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
        {/* Breadcrumb & Actions overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container-custom px-4 pt-4 md:pt-6 flex items-center justify-between">
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90 drop-shadow-md">
              <Link to="/" className="hover:text-[#F5B301] transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/trips" className="hover:text-[#F5B301] transition-colors">Trips</Link>
              <ChevronRight size={12} />
              <span className="text-white font-medium line-clamp-1">{trip.title}</span>
            </nav>
            <div className="flex gap-2">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#F5B301] transition-all border border-white/20">
                <Share2 size={16} />
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all border border-white/20">
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Info Pills */}
        <div className="absolute bottom-4 md:bottom-6 left-0 right-0 z-20">
          <div className="container-custom px-4">
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 rounded-lg text-xs sm:text-sm font-medium text-[#444]">
                <MapPin size={14} className="text-[#F5B301]" />{trip.location}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 rounded-lg text-xs sm:text-sm font-medium text-[#444]">
                <Clock size={14} className="text-[#F5B301]" />{trip.nights}N / {trip.days}D
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 rounded-lg text-xs sm:text-sm font-medium text-[#444]">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />{trip.rating}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 rounded-lg text-xs sm:text-sm font-medium text-[#444]">
                <Users size={14} className="text-[#F5B301]" />Max {trip.maxGroupSize}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8 md:py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Category */}
            <div>
              <span className="text-[#F5B301] font-semibold uppercase tracking-wider text-xs md:text-sm">{trip.categoryName || trip.categoryId}</span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mt-2 mb-3">{trip.title}</h1>
              <p className="text-[#555555] text-sm md:text-base leading-relaxed">{trip.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] shadow-sm">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-[#EEEEEE]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'text-[#F5B301] border-b-2 border-[#F5B301] bg-[#F5B301]/5'
                        : 'text-[#555] hover:text-[#111]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 md:p-6">
                {/* Highlights */}
                {activeTab === 'highlights' && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#111111]">Trip Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(trip.highlights || []).map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-[#EEEEEE]">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-[#444] text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itinerary */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#111111]">Day-wise Itinerary</h3>
                    <div className="space-y-3">
                      {(trip.itinerary || []).map((day, i) => (
                        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4 border border-[#EEEEEE]">
                          <div className="w-10 h-10 bg-[#F5B301] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">D{day.day}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#111111] mb-1">{day.title}</h4>
                            <p className="text-[#666] text-xs">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inclusions */}
                {activeTab === 'inclusions' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-base font-bold text-green-600 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Included
                        </h3>
                        <ul className="space-y-1.5">
                          {(trip.inclusions || []).map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-[#444] text-xs">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-red-500 mb-3 flex items-center gap-2">
                          <X className="w-4 h-4" /> Excluded
                        </h3>
                        <ul className="space-y-1.5">
                          {(trip.exclusions || []).map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-[#444] text-xs">
                              <X className="w-3 h-3 text-red-400 flex-shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates */}
                {activeTab === 'dates' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#111111]">Available Departures</h3>
                    {allDepartureDates.length > 0 ? (
                      <div className="space-y-3">
                        {allDepartureDates.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(item.date)}
                            className={`w-full text-left rounded-xl p-4 border transition-all ${
                              selectedDate === item.date
                                ? 'bg-[#F5B301]/10 border-[#F5B301]'
                                : 'bg-gray-50 border-[#EEEEEE] hover:border-[#F5B301]/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedDate === item.date ? 'bg-[#F5B301]' : 'bg-gray-100'}`}>
                                <Calendar className={`w-6 h-6 ${selectedDate === item.date ? 'text-white' : 'text-[#F5B301]'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold text-sm ${selectedDate === item.date ? 'text-[#111]' : 'text-[#333]'}`}>
                                    {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                  {selectedDate === item.date && (
                                    <span className="px-2 py-0.5 bg-[#F5B301] text-white text-[10px] rounded-full font-medium">Selected</span>
                                  )}
                                </div>
                                {item.pickupLocation && (
                                  <div className="flex items-center gap-2 mt-1 text-[#666]">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-sm">{item.pickupLocation}</span>
                                    {item.address && <span className="text-xs opacity-70">- {item.address}</span>}
                                  </div>
                                )}
                                {item.time && (
                                  <div className="flex items-center gap-2 mt-1 text-[#666]">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-sm">{item.time}</span>
                                  </div>
                                )}
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDate === item.date ? 'border-[#F5B301] bg-[#F5B301]' : 'border-gray-300'}`}>
                                {selectedDate === item.date && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6 text-center border border-[#EEEEEE]">
                        <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-[#666] text-sm">No departure dates available</p>
                        <p className="text-[#888] text-xs mt-1">Contact us for custom dates</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Things to Carry */}
                {activeTab === 'things' && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#111111]">Things to Carry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {(trip.thingsToCarry || []).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[#444] bg-gray-50 rounded-lg p-2.5 text-xs border border-[#EEEEEE]">
                          <CheckCircle className="w-3 h-3 text-[#F5B301] flex-shrink-0" />{item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Policies */}
                {activeTab === 'policy' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-[#111111] mb-2">Cancellation Policy</h3>
                      <ul className="space-y-1.5">
                        {(trip.cancellationPolicy || []).map((policy, i) => (
                          <li key={i} className="text-[#444] flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 bg-[#F5B301] rounded-full" />{policy}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111111] mb-2">Trip Rules</h3>
                      <ul className="space-y-1.5">
                        {(trip.rules || []).map((rule, i) => (
                          <li key={i} className="text-[#444] flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />{rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div ref={bookingRef} className="sticky top-24 bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-md">
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#111111]">₹{trip.price?.toLocaleString() || 0}</span>
                <span className="text-[#888] text-sm">/person</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-[#EEEEEE]">
                  <Clock className="w-4 h-4 text-[#F5B301] mx-auto mb-1" />
                  <div className="text-[#111] text-xs font-medium">{trip.nights} Nights</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-[#EEEEEE]">
                  <Users className="w-4 h-4 text-[#F5B301] mx-auto mb-1" />
                  <div className="text-[#111] text-xs font-medium">Max {trip.maxGroupSize}</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[#666] text-xs mb-1.5">Travelers</label>
                <select
                  value={selectedTrekkers}
                  onChange={(e) => setSelectedTrekkers(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-[#EEEEEE] rounded-xl px-3 py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#F5B301]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleBooking} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3.5 mb-3">
                Book Now <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-4 text-[#888] text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />Secure
                </div>
                <span className="text-gray-200">|</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />Free Cancel
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#EEEEEE]">
                <h4 className="text-[#111] font-semibold text-sm mb-3">Pickup Points</h4>
                {(trip.pickupLocations && trip.pickupLocations.length > 0) ? (
                  <div className="space-y-3">
                    {trip.pickupLocations.map((loc, index) => (
                      <div key={loc.id || index} className="bg-gray-50 rounded-xl p-3 border border-[#EEEEEE]">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#F5B301] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-[#111] text-sm font-medium">{loc.location}</p>
                            {loc.address && <p className="text-[#666] text-xs mt-0.5">{loc.address}</p>}
                            <div className="flex items-center gap-3 mt-2">
                              {loc.date && (
                                <span className="inline-flex items-center gap-1 text-xs text-[#555] bg-white border border-[#EEEEEE] px-2 py-1 rounded-lg">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(loc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              )}
                              {loc.time && (
                                <span className="inline-flex items-center gap-1 text-xs text-[#555] bg-white border border-[#EEEEEE] px-2 py-1 rounded-lg">
                                  <Clock className="w-3 h-3" />{loc.time}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-[#666] text-xs">{trip.pickupLocation || 'To be announced'}</p>
                    <p className="text-[#F5B301] text-xs mt-1">{trip.pickupTime || 'Contact for details'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Trips */}
        {relatedTrips.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#EEEEEE]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111111]">You May Also Like</h2>
              <Link to="/trips" className="text-[#F5B301] hover:text-[#e0a500] text-sm font-medium flex items-center gap-1">
                View All <ArrowRightCircle size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTrips.slice(0, 3).map((relatedTrip) => (
                <Link
                  key={relatedTrip.id}
                  to={`/trip/${relatedTrip.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] hover:border-[#F5B301]/50 hover:shadow-md transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedTrip.images?.[0] || '/placeholder.jpg'}
                      alt={relatedTrip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {relatedTrip.featured && (
                      <span className="absolute top-3 left-3 bg-yellow-400 text-[#111] text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</span>
                    )}
                    <span className="absolute top-3 right-3 bg-[#F5B301] text-white text-xs font-medium px-2 py-1 rounded-full">
                      {relatedTrip.categoryName || relatedTrip.categoryId}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={12} className="text-[#F5B301]" />
                      <span className="text-[#666] text-xs">{relatedTrip.location}</span>
                    </div>
                    <h3 className="text-[#111] font-semibold text-lg mb-2 line-clamp-1">{relatedTrip.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#888] mb-3">
                      <span className="flex items-center gap-1"><Clock size={12} />{relatedTrip.nights}N/{relatedTrip.days ?? (relatedTrip.nights + 1)}D</span>
                      <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{relatedTrip.rating || '4.5'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#111]">₹{relatedTrip.price?.toLocaleString()}</span>
                        <span className="text-[#888] text-sm">/person</span>
                      </div>
                      <span className="text-[#F5B301] text-sm font-medium group-hover:translate-x-1 transition-transform">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
