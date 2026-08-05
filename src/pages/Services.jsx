import { Link } from 'react-router-dom';
import ServicePackages from '../components/ServicePackages';

const Services = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header Banner */}
      <div className="bg-white border-b border-[#EEEEEE] pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-[#888888] mb-2">
            <Link to="/" className="hover:text-[#F5B301] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Services</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-1.5">
            Our <span className="text-[#F5B301]">Travel Services</span>
          </h1>
          <p className="text-[#555555] text-xs sm:text-sm max-w-xl">
            Complete travel packages, flight tickets, railway bookings, hotel reservations, car rentals & passport assistance under one roof.
          </p>
        </div>
      </div>

      <ServicePackages />
    </div>
  );
};

export default Services;
