import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageView } from '../../types';
import { BANNER_ASSETS } from '../../utils/assets';
import { SafeImage } from '../common/SafeImage';

interface AboutStorySectionProps {
  onNavigate: (page: PageView) => void;
}

export const AboutStorySection: React.FC<AboutStorySectionProps> = ({ onNavigate }) => {
  return (
    <section id="about-story" className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (6 cols): 4-Photo Collage with Overlapping Gold Stamp */}
        <div className="lg:col-span-6 relative">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 relative max-w-lg mx-auto">
            
            {/* Photo 1 (Top Left) */}
            <div className="aspect-[4/5] rounded-[20px] overflow-hidden shadow-md">
              <SafeImage
                src={BANNER_ASSETS.story1}
                alt="Botanical esthetician crafting natural skincare"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                fallbackType="service"
              />
            </div>

            {/* Photo 2 (Top Right) */}
            <div className="aspect-[4/3] rounded-[20px] overflow-hidden shadow-md mt-6">
              <SafeImage
                src={BANNER_ASSETS.story2}
                alt="Glass dropper bottle on warm stone flatlay"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                fallbackType="product"
              />
            </div>

            {/* Photo 3 (Bottom Left) */}
            <div className="aspect-[4/3] rounded-[20px] overflow-hidden shadow-md -mt-6">
              <SafeImage
                src={BANNER_ASSETS.story3}
                alt="Green Aventurine facial stone roller"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                fallbackType="product"
              />
            </div>

            {/* Photo 4 (Bottom Right) */}
            <div className="aspect-[4/5] rounded-[20px] overflow-hidden shadow-md">
              <SafeImage
                src={BANNER_ASSETS.story4}
                alt="Radiant dewy woman smiling naturally"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                fallbackType="avatar"
              />
            </div>

            {/* Centered Overlapping Gold Circular Badge Stamp */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1F3A26] border-2 border-[#C9A66B] text-white flex flex-col items-center justify-center p-2 shadow-2xl z-20">
              <div className="w-full h-full rounded-full border border-dashed border-[#C9A66B]/60 flex flex-col items-center justify-center text-center">
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-[#C9A66B]">PURE</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-white tracking-wider">BEAUTY</span>
                <Sparkles className="w-3 h-3 text-[#C9A66B] mt-0.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (6 cols): Story Copy, 3-Stat Green Card, Aasha Gandal Signature */}
        <div className="lg:col-span-6 flex flex-col items-start">
          
          {/* Eyebrow */}
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
            About Us
          </span>

          {/* Heading */}
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[42px] font-bold text-[#1A1A1A] leading-tight mb-5">
            Your Journey to <span className="text-[#C9A66B]">Effortless Elegance</span>
          </h2>

          {/* Paragraph */}
          <p className="text-[#6E6E6E] text-sm sm:text-base leading-relaxed mb-6">
            Born from a deep reverence for botanical chemistry and bespoke wellness, Serenity Salon crafts clean, biocompatible formulas and luxurious salon care that honor your natural rhythm. We source sustainably harvested flora and cold-press potent plant seeds in small apothecary batches to safeguard every drop of active phytonutrients.
          </p>

          <p className="text-[#6E6E6E] text-sm sm:text-base leading-relaxed mb-8">
            No synthetic fillers. No harmful sulfates or microplastics. Just honest, earth-rooted beauty designed to give you a long-lasting, lit-from-within glow.
          </p>

          {/* Stat Row: 3 Stats inside Dark Green Rounded Card */}
          <div className="w-full bg-[#1F3A26] text-white rounded-[20px] p-6 sm:p-7 shadow-lg mb-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center divide-x divide-white/10">
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#C9A66B] block">
                  24+
                </span>
                <span className="text-xs text-white/80 font-medium">
                  Categories
                </span>
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#C9A66B] block">
                  2500+
                </span>
                <span className="text-xs text-white/80 font-medium">
                  Products
                </span>
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#C9A66B] block">
                  99%
                </span>
                <span className="text-xs text-white/80 font-medium">
                  Satisfied Customer
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Founder Note */}
          <div className="flex items-center justify-between w-full pt-2">
            <div className="flex flex-col">
              <span className="font-script text-3xl sm:text-4xl text-[#1F3A26] leading-none mb-1 font-bold">
                Aasha Gandal
              </span>
              <span className="text-xs font-semibold text-[#6E6E6E] uppercase tracking-wider">
                Aasha Gandal — Founder of Serenity Salon
              </span>
            </div>

            <button
              onClick={() => onNavigate('about')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] transition-colors cursor-pointer"
            >
              <span>Our Philosophy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
