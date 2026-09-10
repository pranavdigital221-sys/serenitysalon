import React from 'react';
import { Phone, ArrowRight, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenNewsletterModal?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenNewsletterModal }) => {
  return (
    <div id="topbar" className="bg-[#1F3A26] text-white text-xs sm:text-sm py-2.5 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Phone */}
        <div className="flex items-center gap-2 text-white/90 font-medium">
          <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
          <span>Call Us: <a href="tel:+918108765851" className="hover:text-[#C9A66B] transition-colors">+91 8108765851</a></span>
        </div>

        {/* Center: Promo Offer */}
        <div className="text-center font-medium flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-white/95">Sign up and GET <span className="text-[#C9A66B] font-bold">20% OFF</span> for your first order.</span>
          <button 
            onClick={onOpenNewsletterModal}
            className="underline underline-offset-4 decoration-[#C9A66B] text-[#C9A66B] hover:text-white font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            Sign up now
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Social Icons */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-white/70 text-xs mr-1">Follow Us:</span>
          {[
            { Icon: Facebook, href: '#', label: 'Facebook' },
            { Icon: Twitter, href: '#', label: 'Twitter' },
            { Icon: Instagram, href: '#', label: 'Instagram' },
            { Icon: Youtube, href: '#', label: 'YouTube' },
          ].map(({ Icon, href, label }, idx) => (
            <a
              key={idx}
              href={href}
              aria-label={label}
              className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-[#C9A66B] hover:text-[#1F3A26] hover:border-[#C9A66B] transition-all duration-200"
            >
              <Icon className="w-3 h-3" />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
};
