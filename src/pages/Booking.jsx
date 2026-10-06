import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { addBooking, getTripById } from '../firebase';

const inputClass = "w-full bg-[#F8F9FB] border border-[#EEEEEE] rounded-xl px-4 py-3 text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5B301] transition-colors text-sm";

const Booking = () => {
  const { tripId } = useParams();
  const [searchParams] = useSearchParams();
  const [trip, setTrip] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    trekkers: 1, emergencyName: '', emergencyPhone: '',
    message: '', agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const trekkersParam = searchParams.get('trekkers');
    if (trekkersParam) setFormData(prev => ({ ...prev, trekkers: parseInt(trekkersParam) }));
    if (tripId) getTripById(tripId).then(t => { if (t) setTrip(t); });
  }, [tripId, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBooking({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        travelers: parseInt(formData.trekkers),
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        message: formData.message,
        tripId: tripId || '',
        tripName: trip?.title || '',
        amount: (trip?.price || 0) * parseInt(formData.trekkers),
        bookingDate: new Date().toLocaleDateString('en-IN'),
        status: 'pending'
      });
      setIsSubmitted(true);
    } catch (err) {
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] pt-28 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 max-w-md text-center border border-[#EEEEEE] shadow-sm">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#111111] mb-3">Booking Submitted!</h2>
          <p className="text-[#555555] mb-6">Thank you! We'll contact you within 24 hours to confirm your booking.</p>
          <Link to="/trips" className="inline-flex items-center gap-2 bg-[#F5B301] text-[#111111] font-semibold px-6 py-3 rounded-xl hover:bg-[#e0a500] transition-colors">
            Browse More Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-28 pb-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded-2xl border border-[#EEEEEE] shadow-sm w-fit">
            <img src="/arya-logo-transparent.png" alt="Arya Holidays" className="h-11 sm:h-12 w-auto object-contain" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5B301] block">Official Booking</span>
              <span className="text-xs font-semibold text-[#111111]">Arya Holidays Travel Desk</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111111] mb-1">Book Your Tour</h1>
          {trip && <p className="text-[#F5B301] font-medium mb-1">{trip.title}</p>}
          <p className="text-[#666] mb-8 text-sm">Fill in the details below to reserve your spot.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEE] shadow-sm">
              <h2 className="text-lg font-semibold text-[#111111] mb-5">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">First Name *</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">Last Name *</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Enter your last name" />
                </div>
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="Enter your email address" />
                </div>
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">Phone *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Enter your mobile number" />
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEE] shadow-sm">
              <h2 className="text-lg font-semibold text-[#111111] mb-5">Tour Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">Number of Persons *</label>
                  <select name="trekkers" value={formData.trekkers} onChange={handleChange} className={inputClass}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>)}
                  </select>
                </div>
                {trip && (
                  <div>
                    <label className="block text-[#555] text-sm font-medium mb-1.5">Total Amount</label>
                    <div className={`${inputClass} bg-[#F5B301]/5 border-[#F5B301]/30 font-semibold text-[#111]`}>
                      ₹{((trip.price || 0) * formData.trekkers).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEE] shadow-sm">
              <h2 className="text-lg font-semibold text-[#111111] mb-5">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">Contact Name</label>
                  <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className={inputClass} placeholder="Enter emergency contact name" />
                </div>
                <div>
                  <label className="block text-[#555] text-sm font-medium mb-1.5">Contact Phone</label>
                  <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className={inputClass} placeholder="Enter emergency mobile number" />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEE] shadow-sm">
              <h2 className="text-lg font-semibold text-[#111111] mb-5">Additional Information</h2>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                placeholder="Enter any special requirements, notes or questions..."
                className={`${inputClass} resize-none`} />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange}
                className="w-5 h-5 mt-0.5 rounded accent-[#F5B301]" required />
              <label className="text-[#666] text-sm">
                I agree to the <a href="#" className="text-[#F5B301] hover:underline">Terms of Service</a> and <a href="#" className="text-[#F5B301] hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#F5B301] text-[#111111] font-semibold py-4 rounded-xl text-base hover:bg-[#e0a500] transition-colors disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
