import React from 'react';
import { Instagram } from 'lucide-react';

const InstagramButton = () => {
  const instagramUrl = 'https://www.instagram.com/arya_holidays_?igsh=MTJkOTlzZjhsM2p2eA==';

  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow us on Instagram"
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center justify-center gap-2.5 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-[0_4px_20px_rgba(214,36,159,0.45)] hover:shadow-[0_6px_28px_rgba(214,36,159,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
      style={{
        background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
      }}
    >
      <div className="relative flex items-center justify-center">
        <Instagram className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-300 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-200 rounded-full" />
      </div>
      <span className="hidden sm:inline font-semibold text-sm font-poppins tracking-wide pr-1">
        Follow Us
      </span>
    </a>
  );
};

export default InstagramButton;
