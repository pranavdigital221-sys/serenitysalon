import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageView } from '../../types';
import { BANNER_ASSETS } from '../../utils/assets';

interface DualPromoBannersProps {
  onNavigate: (page: PageView) => void;
}

export const DualPromoBanners: React.FC<DualPromoBannersProps> = ({ onNavigate }) => {
  return (
    <section id="dual-promo-banners" className="py-8 sm:py-12 px-4 sm:px-6 bg-[#F7F5F1]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Card 1: Hair Care Deals */}
        <div className="relative rounded-[24px] overflow-hidden bg-cover bg-center min-h-[300px] sm:min-h-[340px] p-6 sm:p-10 flex flex-col justify-between shadow-md group">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ 
              backgroundImage: `url('${BANNER_ASSETS.summer}')` 
            }}
          />
          {/* Warm Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Top Discount Badge */}
          <div className="relative z-10">
            <span className="inline-block bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold px-3.5 py-1 rounded-full shadow-xs border border-[#C9A66B]/30 tracking-tight">
              Flat 25% Discount
            </span>
          </div>

          {/* Bottom Copy & CTA */}
          <div className="relative z-10 max-w-sm">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              Special <span className="text-[#C9A66B]">Hair Care</span> Deals
            </h3>
            <p className="text-white/80 text-xs sm:text-sm mb-5 line-clamp-2">
              Nourish damaged strands with pure rosemary leaf and meadowfoam cold-pressed oils.
            </p>
            <button
              onClick={() => onNavigate('haircare')}
              className="px-6 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
            </button>
          </div>
        </div>

        {/* Card 2: Skincare Deals */}
        <div className="relative rounded-[24px] overflow-hidden bg-cover bg-center min-h-[300px] sm:min-h-[340px] p-6 sm:p-10 flex flex-col justify-between shadow-md group">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ 
              backgroundImage: `url('${BANNER_ASSETS.weekly}')` 
            }}
          />
          {/* Dark Green Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A26]/90 via-[#1F3A26]/60 to-transparent" />

          {/* Top Discount Badge */}
          <div className="relative z-10">
            <span className="inline-block bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold px-3.5 py-1 rounded-full shadow-xs border border-[#C9A66B]/30 tracking-tight">
              Flat 20% Discount
            </span>
          </div>

          {/* Bottom Copy & CTA (Inverted White Button on Green background) */}
          <div className="relative z-10 max-w-sm">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              Save Big on <span className="text-[#C9A66B]">Skincare</span>
            </h3>
            <p className="text-white/85 text-xs sm:text-sm mb-5 line-clamp-2">
              Hydrate deep cellular layers with multi-molecular hyaluronic acid serums and botanicals.
            </p>
            <button
              onClick={() => onNavigate('skincare')}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#C9A66B] text-[#1F3A26] hover:text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1F3A26]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
