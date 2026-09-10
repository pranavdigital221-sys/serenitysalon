import React from 'react';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { SafeImage } from '../common/SafeImage';

interface DealsOfTheDayProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const DealsOfTheDay: React.FC<DealsOfTheDayProps> = ({ onAddToCart, onQuickView }) => {
  const deals = PRODUCTS.filter((p) => p.isDealOfTheDay);

  return (
    <section id="deals-of-the-day" className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7F5F1]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
            Today's Offers
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            <span className="text-[#C9A66B]">Deals</span> of the Day
          </h2>
        </div>

        {/* 2 Wide Horizontal Cards Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {deals.map((product) => (
            <div
              key={product.id}
              onClick={() => onQuickView(product)}
              className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#1F3A26]/8 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center cursor-pointer group"
            >
              {/* Image Left (5 cols) */}
              <div className="sm:col-span-5 aspect-square rounded-[18px] overflow-hidden bg-[#F7F5F1] relative flex items-center justify-center">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackType="product"
                />
                {product.discountPercentage && (
                  <span className="absolute top-2.5 left-2.5 bg-[#FDF1E4] text-[#1F3A26] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-[#C9A66B]/30">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Info Right (7 cols) */}
              <div className="sm:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E6E]">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#1A1A1A]">
                      <Star className="w-3.5 h-3.5 fill-[#C9A66B] text-[#C9A66B]" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#1F3A26] transition-colors line-clamp-2 mb-2 leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#6E6E6E] line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-bold text-lg sm:text-xl text-[#1F3A26]">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#6E6E6E] line-through">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-4 py-2 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Shop Now</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
