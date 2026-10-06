import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { subscribeToContactInfo } from '../firebase';

const defaultContact = {
  branches: [
    { label: 'Pune', address: 'Shop 109, ARV Royale, Handewadi Rd, Hadapsar, Pune - 411028' },
    { label: 'Chh. Sambhajinagar', address: 'Shop 24, Bhagrathi Heights, Satara Parisar - 431010' }
  ],
  phones: ['+91 7972475007', '+91 9673982555'],
  emails: ['info@aryaholidays.com'],
  facebook: '#', instagram: '#', twitter: '#', youtube: '#'
};

const allPages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Domestic Trips', path: '/trips?type=domestic' },
  { name: 'International Trips', path: '/trips?type=international' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    const unsub = subscribeToContactInfo(info => {
      setContact(prev => ({ ...prev, ...info }));
    });
    return () => unsub();
  }, []);

  const socialLinks = [
    { icon: Facebook, href: contact.facebook, label: 'Facebook' },
    { icon: Instagram, href: contact.instagram, label: 'Instagram' },
    { icon: Twitter, href: contact.twitter, label: 'Twitter' },
    { icon: Youtube, href: contact.youtube, label: 'YouTube' },
  ];

  return (
    <footer
      className="relative overflow-hidden text-white border-t border-white/10"
      style={{
        background: 'radial-gradient(ellipse at 20% 0%, rgba(245,179,1,0.12) 0%, transparent 45%), radial-gradient(ellipse at 80% 100%, rgba(16,185,129,0.10) 0%, transparent 45%), linear-gradient(180deg, #0a2d28 0%, #061c19 100%)'
      }}
    >
      {/* Top Gold Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#F5B301] to-transparent" />

      <div className="container-custom pt-8 sm:pt-10 pb-6 sm:pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">

          {/* Brand & Description (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <Link to="/" className="inline-block transition-transform duration-200 hover:scale-105" title="Arya Holidays - Reliable Travel Solutions">
              <img
                src="/arya-logo-white.png"
                alt="Arya Holidays"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed max-w-sm">
              Your premium travel partner crafting unforgettable domestic & international holidays, trekking adventures, and complete travel services.
            </p>
            <div className="flex gap-2 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 bg-white/10 hover:bg-[#F5B301] hover:text-[#111111] transition-all duration-200 border border-white/15"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (4 cols - 2 column grid on mobile) */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold font-poppins text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#F5B301] rounded-full" />
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {allPages.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/80 hover:text-[#F5B301] transition-colors text-xs font-semibold flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 bg-[#F5B301] rounded-full group-hover:scale-125 transition-transform" />
                  <span className="truncate">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold font-poppins text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#F5B301] rounded-full" />
              Contact Us
            </h4>
            
            <div className="space-y-2.5 text-xs">
              {contact.branches?.slice(0, 2).map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-white/80">
                  <MapPin className="w-3.5 h-3.5 text-[#F5B301] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#F5B301]">{b.label}: </span>
                    <span>{b.address}</span>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 text-white/80 pt-1">
                <Phone className="w-3.5 h-3.5 text-[#F5B301] flex-shrink-0" />
                <div className="flex flex-wrap gap-x-3 gap-y-1 font-semibold">
                  {contact.phones?.map((p, i) => (
                    <a key={i} href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-[#F5B301] transition-colors">
                      {p}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <Mail className="w-3.5 h-3.5 text-[#F5B301] flex-shrink-0" />
                <a
                  href={`mailto:${contact.emails?.[0] || 'info@aryaholidays.com'}`}
                  className="hover:text-[#F5B301] font-semibold transition-colors"
                >
                  {contact.emails?.[0] || 'info@aryaholidays.com'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {currentYear} Arya Holidays. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#F5B301] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#F5B301] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
