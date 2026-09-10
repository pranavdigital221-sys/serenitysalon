import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageView } from '../../types';
import { BANNER_ASSETS } from '../../utils/assets';
import { SafeImage } from '../common/SafeImage';

interface WeeklyDealsBannerProps {
  onNavigate: (page: PageView) => void;
}

export const WeeklyDealsBanner: React.FC<WeeklyDealsBannerProps> = ({ onNavigate }) => {
  return (
    <section id="weekly-deals-banner" className="py-8 sm:py-12 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#1F3A26] overflow-hidden p-8 sm:p-14 text-white shadow-xl">
          
          {/* Decorative Gold Circular Auras */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/3 w-64 h-64 bg-[#4F7358]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              {/* Eyebrow in Gold */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-[#C9A66B]/30 text-[#C9A66B] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Weekly Deals</span>
              </div>

              {/* Heading with Weekly highlighted in Gold */}
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                Amazing Savings: <span className="text-[#C9A66B]">Weekly</span> Beauty Must-Haves
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                Refresh your vanity with our curated weekly edit of non-toxic mineral foundations, scalp elixirs, and restorative night balms with up to 40% off.
              </p>

              {/* White Pill Button with Dark Green Text */}
              <button
                onClick={() => onNavigate('shop')}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#C9A66B] text-[#1F3A26] hover:text-white text-sm font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Discover Weekly Must-Haves</span>
                <ArrowRight className="w-4 h-4 text-[#1F3A26]" />
              </button>

            </div>

            {/* Right Photo (5 cols): Women Beauty Photo with Arch Outline */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-[4/3] sm:aspect-[4/3] rounded-[24px] overflow-hidden border-2 border-white/20 shadow-2xl">
                <SafeImage
                  src={BANNER_ASSETS.story1}
                  alt="Women experiencing radiant clean beauty"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  fallbackType="service"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
