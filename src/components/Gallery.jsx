import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Loader2, X } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const scrollAmount = window.innerWidth < 640 ? (window.innerWidth * 0.80) + 16 : 424; // 16px is for gap-4
        
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(img => img.url));
      setLoading(false);
    }, (err) => { console.error('Gallery error:', err); setLoading(false); });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-[#F8F9FB]">
        <div className="container-custom flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-[#F5B301] animate-spin" />
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  return (
    <>
      <section className="py-10 sm:py-12 md:py-14 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(245,179,1,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 100%, rgba(139,92,246,0.05) 0%, transparent 50%), linear-gradient(180deg, #FAFAFA 0%, #ffffff 100%)' }}>
        <div className="container-custom relative">
          <motion.div className="text-center mb-6 sm:mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-1.5 bg-[#F5B301]/10 border border-[#F5B301]/20 rounded-full px-3.5 py-1.5 mb-3 shadow-sm"><Image className="w-3.5 h-3.5 text-[#F5B301]" /><span className="text-[#F5B301] text-xs font-semibold tracking-wide uppercase">Gallery</span></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-2 tracking-tight">Captured <span className="text-[#F5B301]">Moments</span></h2>
            <p className="text-[#555555] max-w-2xl mx-auto text-xs sm:text-sm">
              Real adventures, real experiences. See what awaits you in the mountains.
            </p>
          </motion.div>

          <motion.div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 pt-2 px-2 -mx-2 sm:px-0 sm:-mx-0 snap-x snap-mandatory gap-3 sm:gap-5 md:gap-6 scroll-smooth" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              .scroll-smooth::-webkit-scrollbar { display: none; }
            `}} />
            {images.map((img, index) => (
              <motion.button
                key={img.id}
                variants={{ hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } }}
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
                className="relative group overflow-hidden rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl border border-black/5 transition-all duration-300 transform-gpu flex-none w-[78vw] sm:w-[280px] md:w-[360px] h-[240px] sm:h-[320px] md:h-[380px] snap-center"
              >
                <img
                  src={img.url}
                  alt={img.title || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-left">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{img.title || 'Adventure Moment'}</h3>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
           <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={24} />
            </button>
            {images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); }}
              >←</button>
            )}
            <motion.img
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.title}
              className="max-w-[calc(100vw-80px)] md:max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            {images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); }}
              >→</button>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="font-medium">{images[lightboxIndex]?.title}</p>
              <p className="text-sm text-white/60">{lightboxIndex + 1} / {images.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
