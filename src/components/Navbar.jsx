import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    setIsScrolled(window.scrollY > 10);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Domestic', path: '/trips?type=domestic' },
    { name: 'International', path: '/trips?type=international' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' }
  ];

  const isHome = location.pathname === '/';
  const transparent = isHome && !isScrolled;

  const isActive = (path) => {
    const [p, q] = path.split('?');
    if (q) {
      return location.pathname === p && location.search === `?${q}`;
    }
    return location.pathname === path;
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        transparent
          ? { background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }
          : { background: '#ffffff', borderBottom: '1px solid #EEEEEE', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px] sm:h-[88px] md:h-[96px] lg:h-[100px]">

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center justify-center flex-shrink-0 pt-1">
            <img
              src="/arya.png"
              alt="Arya Holidays"
              className="h-12 sm:h-[52px] md:h-[58px] lg:h-[66px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            />
            <span className={`text-[6.5px] sm:text-[7.5px] md:text-[8.5px] lg:text-[9.5px] font-bold tracking-wide whitespace-nowrap mt-[2px] transition-colors duration-300 ${transparent ? 'text-white/95' : 'text-[#111111]'}`}>
              Reliable Travel Solutions
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[13px] xl:text-[15px] font-semibold font-inter transition-colors duration-300 whitespace-nowrap tracking-wide ${isActive(link.path)
                    ? 'text-[#F5B301]'
                    : transparent
                      ? 'text-white/90 hover:text-[#F5B301]'
                      : 'text-[#444444] hover:text-[#F5B301]'
                  }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#F5B301] rounded-full drop-shadow-md" />
                )}
              </Link>
            ))}
          </div>

          {/* Book Now */}
          <Link
            to="/trips"
            className="hidden lg:inline-flex items-center justify-center bg-[#F5B301] text-[#111111] font-semibold font-inter tracking-wide px-5 xl:px-7 py-2 xl:py-2.5 rounded-full text-[13px] xl:text-[15px] hover:bg-[#ffc107] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(245,179,1,0.5)] transition-all duration-300"
          >
            Book Now
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white' : 'text-[#111]'} hover:text-[#F5B301] cursor-pointer`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — always solid white */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: '#ffffff', borderTop: '1px solid #EEEEEE' }}
      >
        <div className="px-4 py-4 space-y-1 overflow-y-auto max-h-[80vh] pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-[15px] font-semibold font-inter py-3 px-5 rounded-xl transition-all duration-300 ${isActive(link.path)
                  ? 'bg-[#F5B301]/10 text-[#F5B301]'
                  : 'text-[#444] hover:bg-gray-50 hover:text-[#111]'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 pb-6">
            <Link
              to="/trips"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center bg-[#F5B301] text-[#111111] font-semibold font-inter tracking-wide py-3 mt-2 rounded-xl text-[16px] shadow-sm active:scale-95 transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
