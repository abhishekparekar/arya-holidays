import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

const ImageSlider = ({ images = [], autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goTo((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, goTo]);

  const prevSlide = useCallback(() => {
    goTo((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, goTo]);

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, images.length]);

  useEffect(() => {
    setImageErrors({});
    setCurrentIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <span className="text-gray-400 text-sm">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group overflow-hidden bg-black">
      {/* Slides */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {imageErrors[index] ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-400 text-sm">Image not available</span>
              </div>
            </div>
          ) : (
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              onError={() => handleImageError(index)}
              className="w-full h-full object-contain object-center"
            />
          )}
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 z-20 pointer-events-none" />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30
              w-9 h-9 sm:w-11 sm:h-11 rounded-full
              bg-black/40 hover:bg-[#F5B301] active:scale-95
              backdrop-blur-sm border border-white/20
              flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100
              transition-all duration-300"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30
              w-9 h-9 sm:w-11 sm:h-11 rounded-full
              bg-black/40 hover:bg-[#F5B301] active:scale-95
              backdrop-blur-sm border border-white/20
              flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100
              transition-all duration-300"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 h-2 bg-[#F5B301]'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-30 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
