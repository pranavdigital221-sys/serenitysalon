import React from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Star } from 'lucide-react';
import { PageView } from '../../types';
import { BANNER_ASSETS } from '../../utils/assets';
import { SafeImage } from '../common/SafeImage';

interface HeroSectionProps {
  onNavigate: (page: PageView) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section id="hero-section" className="relative bg-[#F7F5F1] pt-8 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Soft botanical ambient glow */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#C9A66B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#1F3A26]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column (6 or 7 cols): Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          
          {/* Eyebrow Pill Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF1E4] border border-[#C9A66B]/30 text-[#1F3A26] text-xs sm:text-sm font-semibold tracking-wide mb-5 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span>Glow with Confidence, Shop with Trust</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[58px] font-bold text-[#1A1A1A] leading-[1.12] tracking-tight mb-5">
            Your Ultimate <span className="text-[#C9A66B]">Beauty</span> & Cosmetics Hub
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-[#6E6E6E] text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            Experience organic, clean skincare formulated with cold-pressed botanicals and biocompatible actives. Reveal your dewy, radiant skin with effortless confidence.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10">
            {/* Primary Solid Green Pill Button */}
            <button
              onClick={() => onNavigate('shop')}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-sm sm:text-base font-semibold flex items-center gap-2.5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
            </button>

            {/* Secondary Text Link */}
            <button
              onClick={() => onNavigate('shop')}
              className="font-heading font-semibold text-sm sm:text-base text-[#1A1A1A] hover:text-[#C9A66B] flex items-center gap-1.5 transition-colors cursor-pointer group underline underline-offset-4 decoration-[#C9A66B]/40 hover:decoration-[#C9A66B]"
            >
              <span>View All Products</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Trust Highlights Row */}
          <div className="pt-6 border-t border-[#1F3A26]/10 grid grid-cols-3 gap-4 w-full max-w-lg">
            <div>
              <span className="font-heading font-bold text-xl sm:text-2xl text-[#1F3A26] block">100%</span>
              <span className="text-xs text-[#6E6E6E]">Clean Botanical</span>
            </div>
            <div>
              <span className="font-heading font-bold text-xl sm:text-2xl text-[#1F3A26] block">4.9/5</span>
              <span className="text-xs text-[#6E6E6E] flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#C9A66B] text-[#C9A66B]" /> 15k+ Reviews
              </span>
            </div>
            <div>
              <span className="font-heading font-bold text-xl sm:text-2xl text-[#1F3A26] block">30-Day</span>
              <span className="text-xs text-[#6E6E6E]">Glow Guarantee</span>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Large Portrait Model Photo & Floating Badges */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* Decorative Leaf Sprig Background Layer */}
          <div className="absolute -top-6 -right-6 w-32 h-32 text-[#4F7358]/20 pointer-events-none transform rotate-12">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 C60 30 90 40 100 50 C70 60 60 90 50 100 C40 70 10 60 0 50 C30 40 40 10 50 0 Z" />
            </svg>
          </div>
          
          {/* Main Hero Photo Container with 24px rounded corners & arch aura */}
          <div className="relative w-full max-w-md aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
            <SafeImage
              src={BANNER_ASSETS.hero}
              alt="Glowing skin model with towel wrap"
              className="w-full h-full object-cover object-top"
              fallbackType="service"
            />
            
            {/* Subtle inner gradient shadow for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Gold Circular Stamp Badge */}
          <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1F3A26] border-2 border-[#C9A66B] text-white flex flex-col items-center justify-center p-2 shadow-xl animate-spin-slow">
            <div className="w-full h-full rounded-full border border-dashed border-[#C9A66B]/50 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#C9A66B]">100%</span>
              <span className="text-[8px] uppercase tracking-tight text-white font-semibold">ORGANIC</span>
              <Sparkles className="w-2.5 h-2.5 text-[#C9A66B] mt-0.5" />
            </div>
          </div>

          {/* Floating Info Chip 1: Fast Delivery */}
          <div className="absolute bottom-6 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 shadow-xl border border-[#1F3A26]/10 flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
            <div className="w-9 h-9 rounded-full bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-[#1F3A26] block">
                Fast Delivery
              </span>
              <span className="text-[11px] text-[#6E6E6E] block">
                Free on orders ₹999+
              </span>
            </div>
          </div>

          {/* Floating Info Chip 2: Secure Payment */}
          <div className="absolute top-1/2 -right-3 sm:-right-6 transform -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 shadow-xl border border-[#1F3A26]/10 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500">
            <div className="w-9 h-9 rounded-full bg-[#1F3A26] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-[#1F3A26] block">
                Secure Payment
              </span>
              <span className="text-[11px] text-[#6E6E6E] block">
                100% Protected
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
