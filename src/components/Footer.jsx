import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { subscribeToContactInfo } from '../firebase';

const defaultContact = {
  branches: [
    { label: 'Pune', address: 'Shop No. 109, ARV Royale, Handewadi Road, Hadapsar, Pune - 411028 - Maharashtra' },
    { label: 'Chh. Sambhajinagar', address: 'Shop No. 24, Bhagrathi Heights, Chate School Road, Satara Parisar, Chh. Sambhajinagar 431010 - Maharashtra' }
  ],
  phones: ['+91 7972475007', '+91 9673982555', '+91 9637476999'],
  emails: ['info@aryaholidays.com', 'santosh@aryaholidays.com'],
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
    <footer className="relative overflow-hidden" style={{ background: '#ffffff', borderTop: '1px solid #EEEEEE' }}>

      {/* Decorative top border */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #F5B301, transparent)' }} />

      <div className="container-custom pt-14 pb-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <Link to="/" className="flex flex-col items-start w-fit">
              <div className="flex flex-col items-center">
                <img src="/arya.png" alt="Arya Holidays" className="h-16 w-auto object-contain" />
                <span className="text-[9.5px] font-bold tracking-wide whitespace-nowrap mt-[2px] text-[#111111]">
                  Reliable Travel Solutions
                </span>
              </div>
            </Link>
            <p className="text-[#555555] font-poppins font-medium text-[14.5px] leading-relaxed">
              Your premium travel partner crafting unforgettable journeys through spectacular destinations worldwide.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#F5B301] transition-all duration-300 border border-[#EEEEEE] hover:border-[#F5B301]">
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-lg font-extrabold font-poppins text-[#111111] mb-6 tracking-wide flex items-center gap-3">
              <span className="w-8 h-[3px] drop-shadow-[0_2px_4px_rgba(245,179,1,0.4)] bg-[#F5B301] rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {allPages.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-[#555555] hover:text-[#F5B301] transition-all duration-300 text-[14.5px] font-poppins font-semibold flex items-center gap-2.5 group">
                    <span className="w-1.5 h-1.5 bg-[#F5B301]/40 rounded-full group-hover:bg-[#F5B301] transition-colors flex-shrink-0" />
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-extrabold font-poppins text-[#111111] mb-6 tracking-wide flex items-center gap-3">
              <span className="w-8 h-[3px] drop-shadow-[0_2px_4px_rgba(245,179,1,0.4)] bg-[#F5B301] rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contact.branches?.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5B301]/10 border border-[#F5B301]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#F5B301]" />
                  </div>
                  <div>
                    {b.label && <div className="text-[#F5B301] text-[13px] tracking-wide font-extrabold font-poppins uppercase mb-1">{b.label}</div>}
                    <div className="text-[#555555] text-[14.5px] font-poppins font-medium leading-relaxed">{b.address}</div>
                  </div>
                </li>
              ))}

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F5B301]/10 border border-[#F5B301]/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#F5B301]" />
                </div>
                <div className="flex flex-col gap-1">
                  {contact.phones?.map((p, i) => (
                    <a key={i} href={`tel:${p.replace(/\s/g, '')}`}
                      className="text-[#555555] hover:text-[#F5B301] font-poppins font-semibold transition-colors text-[14.5px]">{p}</a>
                  ))}
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F5B301]/10 border border-[#F5B301]/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#F5B301]" />
                </div>
                <div className="flex flex-col gap-1">
                  {contact.emails?.map((e, i) => (
                    <a key={i} href={`mailto:${e}`}
                      className="text-[#555555] hover:text-[#F5B301] font-poppins font-semibold transition-colors text-[14.5px]">{e}</a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-[#EEEEEE] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#888888] text-sm">© {currentYear} Arya Holidays. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-[#888888] hover:text-[#F5B301] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#888888] hover:text-[#F5B301] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
