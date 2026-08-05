import { Award, Users, Shield, Heart } from 'lucide-react';
import ServicePackages from '../components/ServicePackages';

const About = () => {
  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Treks Completed' },
    { value: '10,000+', label: 'Happy Trekkers' },
    { value: '50+', label: 'Destinations' }
  ];

  const values = [
    { icon: Shield, title: 'Safety First', description: 'Your safety is our top priority. We maintain the highest safety standards with certified guides and comprehensive protocols.' },
    { icon: Award, title: 'Premium Quality', description: 'From accommodations to equipment, we ensure premium quality at every step of your journey.' },
    { icon: Users, title: 'Expert Team', description: 'Our team of certified mountaineers and local guides bring years of experience and deep regional knowledge.' },
    { icon: Heart, title: 'Sustainable Travel', description: 'We are committed to eco-friendly practices and supporting local communities in the mountains.' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Hero Banner */}
      <div className="relative h-[30vh] min-h-[200px] sm:min-h-[240px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" alt="About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 container-custom">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1.5">About Arya Holidays</h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl">Turning Travel Dreams into Trusted Journeys Since 2016</p>
        </div>
      </div>

      <div className="container-custom py-6 sm:py-10">
        {/* Story + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 sm:mb-12">
          <div>
            <span className="text-[#F5B301] font-semibold mb-2 block text-xs uppercase tracking-wider">Our Story</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-4">Where Adventure Meets Excellence</h2>
            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed mb-3">
              Arya Holidays was established in 2016 in Sambhaji Nagar with a vision to provide reliable and personalized travel solutions. From a humble beginning, we have grown steadily by focusing on customer satisfaction, trust, and quality service.
            </p>
            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed mb-3">
              Today, Arya Holidays operates from two offices located in Sambhaji Nagar and Pune, serving clients across different regions.
            </p>
            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed mb-3">
              We specialize in offering tour packages across India and popular Asian countries such as Thailand, Dubai (UAE), Singapore, Malaysia, Bali (Indonesia), Vietnam, Maldives, Azerbaijan, Kazakhstan, and Uzbekistan. We provide complete travel solutions including hotel bookings, transportation, and customized holiday planning.
            </p>
            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed mb-3">
              Whether it’s a family vacation, honeymoon, group tour, or pilgrimage journey, we ensure a smooth, comfortable, and memorable travel experience.
            </p>
            <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
              At Arya Holidays, our mission is to deliver trusted service, best pricing, and hassle-free journeys to every customer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-[#EEEEEE] shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-[#F5B301] mb-0.5">{stat.value}</div>
                <div className="text-[#555555] text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[#F5B301] font-semibold mb-2 block text-xs uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-[#EEEEEE] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#F5B301]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#F5B301]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">{value.title}</h3>
                <p className="text-[#555555] text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        {/* <div className="bg-white rounded-3xl p-10 border border-[#EEEEEE] shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#111111] mb-3">Meet Our Leadership</h2>
            <p className="text-[#555555] max-w-xl mx-auto">The experienced team behind Arya Holidays's success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Arjun Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Priya Patel', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
              { name: 'Vikram Singh', role: 'Chief Guide', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' }
            ].map((member, i) => (
              <div key={i} className="text-center">
                <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-[#F5B301]/20" />
                <h3 className="text-lg font-semibold text-[#111111]">{member.name}</h3>
                <p className="text-[#F5B301] text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      <ServicePackages />
    </div>
  );
};

export default About;
