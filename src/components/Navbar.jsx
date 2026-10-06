import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Show navbar if scrolling UP or near the top of the page (< 50px) or if mobile menu is open
      // Hide navbar if scrolling DOWN past 50px
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50 || isMobileMenuOpen;

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isMobileMenuOpen]);

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

  const isActive = (path) => {
    const [p, q] = path.split('?');
    if (q) {
      return location.pathname === p && location.search === `?${q}`;
    }
    return location.pathname === path;
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      window.location.reload();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EEEEEE] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[74px] md:h-[80px]">

          {/* Logo — Clicks to refresh if on home */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center flex-shrink-0 cursor-pointer py-1"
            title="Arya Holidays - Refresh Home"
          >
            <img
              src="/arya-logo-transparent.png"
              alt="Arya Holidays"
              className="h-12 sm:h-14 md:h-[62px] w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={`relative text-[13px] xl:text-[14px] font-semibold font-inter transition-colors duration-200 whitespace-nowrap tracking-wide py-1 ${
                  isActive(link.path)
                    ? 'text-[#F5B301]'
                    : 'text-[#333333] hover:text-[#F5B301]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F5B301] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Book Now Button */}
          <Link
            to="/trips"
            onClick={handleNavClick}
            className="hidden lg:inline-flex items-center justify-center bg-[#F5B301] text-[#111111] font-bold font-inter tracking-wide px-5 py-2.5 rounded-full text-xs xl:text-sm hover:bg-[#ffc107] hover:shadow-[0_4px_15px_rgba(245,179,1,0.4)] transition-all duration-200"
          >
            Book Now
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#111111] hover:text-[#F5B301] cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-[#EEEEEE] ${
          isMobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 overflow-y-auto max-h-[80vh] pb-6">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
            <img src="/arya-logo-transparent.png" alt="Arya Holidays" className="h-11 w-auto object-contain" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Explore Tours</span>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleNavClick}
              className={`block text-sm font-semibold font-inter py-2.5 px-4 rounded-xl transition-colors ${
                isActive(link.path)
                  ? 'bg-[#F5B301]/10 text-[#F5B301]'
                  : 'text-[#333333] hover:bg-gray-50 hover:text-[#111111]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 pb-2">
            <Link
              to="/trips"
              onClick={handleNavClick}
              className="flex w-full items-center justify-center bg-[#F5B301] text-[#111111] font-bold font-inter tracking-wide py-2.5 rounded-xl text-sm shadow-sm active:scale-95 transition-all"
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
