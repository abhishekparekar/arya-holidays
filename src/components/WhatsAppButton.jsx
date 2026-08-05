import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '919637476999';
  const message = encodeURIComponent('Hello Arya Holidays, I want to enquire about your trips and travel packages.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center gap-2.5 bg-[#25D366] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full" />
      </div>
      <span className="hidden sm:inline font-semibold text-sm font-poppins tracking-wide pr-1">
        Chat with Us
      </span>
    </a>
  );
};

export default WhatsAppButton;
