import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, ArrowRight, Heart, Mountain, Clock, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

const TripCard = ({ trip }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    title,
    location,
    price,
    days,
    nights,
    rating = 4.8,
    images = [],
    maxGroupSize = 12,
    difficulty = 'Moderate',
    featured = false,
    tripType = 'domestic',
    categoryName = 'Adventure',
    phone,
    highlights = []
  } = trip;

  const mainImage = !imageError && images[0] ? images[0] : PLACEHOLDER_IMAGE;
  // Use saved values directly — no more -1 math
  const tripNights = nights ?? (days != null ? days - 1 : 0);
  const tripDays = days ?? (nights != null ? nights + 1 : 1);

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-600',
    Moderate: 'bg-amber-100 text-amber-600',
    Difficult: 'bg-red-100 text-red-600',
    Expert: 'bg-violet-100 text-violet-600'
  };

  const handleCall = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`tel:${phone || '+919637476999'}`, '_self');
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE]"
    >
      <div onClick={() => navigate(`/trip/${id}`)} className="group block cursor-pointer">
      {/* ============ HERO IMAGE SECTION ============ */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <motion.img
          src={mainImage}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Type Badge */}
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
              tripType === 'international' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {tripType === 'international' ? '🌍 International' : '🇮🇳 Domestic'}
            </span>
            
            {/* Difficulty Badge */}
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-md ${difficultyColors[difficulty] || difficultyColors.Moderate}`}>
              <Mountain size={12} />
              {difficulty}
            </span>
          </div>

          {/* Featured Badge */}
          {featured && (
            <span className="bg-gradient-to-r from-[#F5B301] to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorited ? 'bg-red-500 text-white' : 'bg-white/80 text-[#111111] hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={18} className={isFavorited ? 'fill-current' : ''} />
        </button>

        {/* Bottom Info Pills */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-[#555555]">
              <MapPin size={12} className="text-[#F5B301]" />
              <span className="line-clamp-1">{location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-[#555555]">
              <Clock size={12} className="text-[#F5B301]" />
              {tripNights}N / {tripDays}D
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-[#555555]">
              <Star size={12} className="text-[#F5B301] fill-[#F5B301]" />
              {rating}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-[#555555]">
              <Users size={12} className="text-[#F5B301]" />
              Max {maxGroupSize}
            </span>
          </div>
        </div>
      </div>

      {/* ============ CONTENT SECTION ============ */}
      <div className="p-5">
        {/* Category & Title */}
        <div className="mb-3">
          <span className="text-xs text-[#F5B301] font-medium uppercase tracking-wider">
            {categoryName}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[#111111] mt-1 group-hover:text-[#F5B301] transition-colors line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Highlights Preview */}
        {highlights.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {highlights.slice(0, 2).map((highlight, i) => (
              <div key={i} className="flex items-start gap-2 text-[#555555] text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Row: Price & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
          <div>
            <span className="text-2xl font-bold text-[#111111]">₹{price?.toLocaleString()}</span>
            <span className="text-[#888888] text-sm">/person</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCall}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#F5B301]/10 text-[#F5B301] rounded-lg hover:bg-[#F5B301]/20 transition-all text-xs font-medium border border-[#F5B301]/20"
            >
              <Phone size={14} />
              <span className="hidden sm:inline">Call</span>
            </button>
            <Link
              to={`/trip/${id}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#F5B301] text-[#111111] rounded-lg hover:shadow-glow transition-all text-xs font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default TripCard;