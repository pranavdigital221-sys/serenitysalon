import React from 'react';
import { Sparkles } from 'lucide-react';

interface CategoryTickerProps {
  id?: string;
}

export const CategoryTicker: React.FC<CategoryTickerProps> = ({ id }) => {
  const items = [
    'Skin Care',
    'Makeup',
    'Hair Care',
    'Fragrances',
    'Nail Care',
    'Body Care',
    'Accessories & Tools',
    '100% Organic Certified',
    'Cruelty-Free Botanicals',
  ];

  return (
    <div 
      id={id || 'category-ticker'}
      className="bg-[#1F3A26] text-white py-3 sm:py-3.5 overflow-hidden border-y border-[#C9A66B]/30 select-none relative z-10"
    >
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {/* Double the list to ensure smooth infinite loop */}
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center mx-4 sm:mx-6">
            <span className="font-heading text-sm sm:text-base font-semibold tracking-wide uppercase text-white/95 hover:text-[#C9A66B] transition-colors">
              {text}
            </span>
            <span className="ml-4 sm:ml-6 text-[#C9A66B] inline-flex items-center">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
