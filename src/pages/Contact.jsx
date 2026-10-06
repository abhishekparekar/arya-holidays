import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { subscribeToContactInfo, addContactQuery } from '../firebase';

const defaultContact = {
  branches: [
    { label: 'Pune', address: 'Shop No. 109, ARV Royale, Handewadi Road, Hadapsar, Pune - 411028 - Maharashtra' },
    { label: 'Chh. Sambhajinagar', address: 'Shop No. 24, Bhagrathi Heights, Chate School Road, Satara Parisar, Chh. Sambhajinagar 431010 - Maharashtra' }
  ],
  phones: ['+91 7972475007', '+91 9673982555', '+91 9637476999'],
  emails: ['info@aryaholidays.com', 'santosh@aryaholidays.com'],
  workingHours: 'Mon - Sat: 9AM - 8PM | Sunday: 10AM - 6PM'
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    const unsub = subscribeToContactInfo(info => {
      setContact(prev => ({ ...prev, ...info }));
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addContactQuery(formData);
      setIsSubmitted(true);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#F8F9FB] border border-[#EEEEEE] rounded-xl px-4 py-3 text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5B301] transition-colors";

  // Build contact info cards from dynamic data
  const contactCards = [
    ...( contact.branches?.map(b => ({ icon: MapPin, title: b.label ? `${b.label} Branch` : 'Branch', details: [b.address] })) || [] ),
    { icon: Phone, title: 'Call Us', details: contact.phones || [] },
    { icon: Mail, title: 'Email Us', details: contact.emails || [] },
    ...(contact.workingHours ? [{ icon: Clock, title: 'Working Hours', details: contact.workingHours.split('|').map(s => s.trim()) }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="bg-white border-b border-[#EEEEEE] pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="container-custom text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-2">Get In Touch</h1>
          <p className="text-[#555555] text-xs sm:text-sm max-w-xl mx-auto">Have questions? Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <div className="container-custom py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#EEEEEE] shadow-sm">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#111111] mb-3">Message Sent!</h2>
                <p className="text-[#555555]">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#EEEEEE] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[#555555] text-sm font-medium mb-2">Your Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-[#555555] text-sm font-medium mb-2">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="Enter your email address" />
                  </div>
                  <div>
                    <label className="block text-[#555555] text-sm font-medium mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Enter your mobile number" />
                  </div>
                  <div>
                    <label className="block text-[#555555] text-sm font-medium mb-2">Subject *</label>
                    <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className={inputClass} placeholder="Enter enquiry subject" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-[#555555] text-sm font-medium mb-2">Message *</label>
                  <textarea name="message" required value={formData.message} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} placeholder="Enter your message or travel plans..." />
                </div>
      <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-[#F5B301] text-[#111111] font-semibold py-3 rounded-xl hover:bg-[#e0a500] transition-colors disabled:opacity-60">
                  {isSubmitting ? 'Sending...' : <> Send Message <Send size={16} /> </>}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-sm flex items-center gap-4">
              <img src="/arya-logo-transparent.png" alt="Arya Holidays" className="h-14 sm:h-16 w-auto object-contain" />
              <div>
                <h3 className="font-bold text-[#111111] text-base">Arya Holidays</h3>
                <p className="text-[#F5B301] text-xs font-semibold">Reliable Travel Solutions</p>
                <p className="text-gray-500 text-[11px] mt-0.5">Affordable Adventure, Priceless Memories</p>
              </div>
            </div>
            {contactCards.map((info, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#EEEEEE] shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5B301]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-[#F5B301]" />
                  </div>
                  <div>
                    <h3 className="text-[#111111] font-semibold mb-1 text-sm">{info.title}</h3>
                    {info.details.map((detail, j) => (
                      <p key={j} className="text-[#555555] text-sm">{detail}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
