import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageView } from '../../types';
import { CATEGORY_ASSETS, BLOG_ASSETS } from '../../utils/assets';
import { SafeImage } from '../common/SafeImage';

interface SummerGlowDealsProps {
  onNavigate: (page: PageView) => void;
}

export const SummerGlowDeals: React.FC<SummerGlowDealsProps> = ({ onNavigate }) => {
  // Live Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="summer-glow-deals" className="py-16 sm:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      {/* Decorative leaf watermarks */}
      <div className="max-w-7xl mx-auto">
        
        {/* 3-Column Layout: Model Photo | Center Content Card | Model Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Model Photo (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg border-2 border-white">
            <SafeImage
              src={CATEGORY_ASSETS.makeup}
              alt="Summer beauty model with glowing skin"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              fallbackType="avatar"
            />
          </div>

          {/* Center Card (6 cols): Headline, Countdown Timer, CTA */}
          <div className="lg:col-span-6 bg-[#F7F5F1] rounded-[28px] p-8 sm:p-12 text-center relative border border-[#1F3A26]/8 shadow-sm">
            
            {/* Palm Leaf Silhouette Background */}
            <div className="absolute top-0 right-0 w-36 h-36 text-[#4F7358]/10 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M0 0 C50 10 90 50 100 100 C60 90 10 50 0 0 Z" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF1E4] text-[#1F3A26] text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>Special Savings</span>
              </div>

              {/* Heading */}
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight mb-3">
                Summer <span className="text-[#C9A66B]">Glow</span> Deals
              </h2>

              <p className="text-[#6E6E6E] text-xs sm:text-sm max-w-md mx-auto mb-8">
                Enjoy up to 50% discount on pure botanical antioxidant serums, mineral SPF, and hydrating floral toners for sun-kissed radiance.
              </p>

              {/* Live Countdown Timer Grid */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-sm mx-auto mb-8">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Mins' },
                  { value: timeLeft.seconds, label: 'Secs' },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#1F3A26]/5 text-center"
                  >
                    <span className="font-heading font-bold text-2xl sm:text-3xl text-[#1F3A26] block leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-[#6E6E6E] uppercase tracking-wider mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Green Pill Button CTA */}
              <button
                onClick={() => onNavigate('shop')}
                className="px-8 py-3.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-sm font-semibold inline-flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
              </button>

            </div>

          </div>

          {/* Right Model Photo (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg border-2 border-white">
            <SafeImage
              src={BLOG_ASSETS.blog5}
              alt="Model with pure natural makeup glow"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              fallbackType="avatar"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
