import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(i => i.url));
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const open = (i) => { setLightboxIndex(i); setLightboxOpen(true); };
  const prev = (e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % images.length); };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center pt-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#F5B301]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#EEEEEE] pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-[#888888] mb-2">
            <Link to="/" className="hover:text-[#F5B301] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Gallery</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-1.5">Our <span className="text-[#F5B301]">Gallery</span></h1>
          <p className="text-[#555555] text-xs sm:text-sm">Real adventures, real experiences — captured in every frame</p>
        </div>
      </div>

      {/* Grid */}
      <div className="container-custom py-6 sm:py-8">
        {images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EEEEEE]">
            <Image className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-[#555555]">No gallery images yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => open(i)}
              >
                <img
                  src={img.url}
                  alt={img.title || 'Gallery'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3">
                  {img.title && (
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                      {img.title}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10" onClick={() => setLightboxOpen(false)}>
              <X size={20} />
            </button>
            {images.length > 1 && (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20" onClick={prev}>
                <ChevronLeft size={20} />
              </button>
            )}
            <motion.img
              key={lightboxIndex}
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.title}
              className="max-w-[calc(100vw-80px)] md:max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
            />
            {images.length > 1 && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20" onClick={next}>
                <ChevronRight size={20} />
              </button>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {images.length}
              {images[lightboxIndex]?.title && <span className="ml-2 text-white">{images[lightboxIndex].title}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
