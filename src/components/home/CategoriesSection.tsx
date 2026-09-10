import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { PageView } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface CategoriesSectionProps {
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (page: PageView) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory, onNavigate }) => {
  // 5 main categories as specified in the prompt
  const mainCategories = CATEGORIES.slice(0, 5);

  const handleClick = (category: typeof CATEGORIES[0]) => {
    if (category.slug === 'skincare') onNavigate('skincare');
    else if (category.slug === 'makeup') onNavigate('makeup');
    else if (category.slug === 'haircare') onNavigate('haircare');
    else {
      onSelectCategory(category.name);
      onNavigate('shop');
    }
  };

  return (
    <section id="categories-section" className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
            Our Categories
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Shop By <span className="text-[#C9A66B]">Category</span>
          </h2>
        </div>

        {/* Row of 5 Circular Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 justify-center">
          {mainCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat)}
              className="flex flex-col items-center group cursor-pointer text-center"
            >
              {/* Circular Image Container with Hover Ring */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1.5 border-2 border-dashed border-[#1F3A26]/20 group-hover:border-[#C9A66B] transition-all duration-300 mb-4 bg-white">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#F7F5F1] shadow-md group-hover:scale-95 transition-transform duration-300">
                  <SafeImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                    fallbackType="category"
                  />
                </div>
              </div>

              {/* Label & Product Count */}
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#1F3A26] transition-colors mb-0.5">
                {cat.name}
              </h3>
              <span className="text-xs font-semibold text-[#6E6E6E]">
                {cat.itemCount}+ Products
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
