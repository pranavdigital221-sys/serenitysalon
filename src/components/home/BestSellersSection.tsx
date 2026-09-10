import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';
import { Product, PageView } from '../../types';

interface BestSellersSectionProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onQuickView: (product: Product) => void;
  onNavigate: (page: PageView) => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filterTabs = [
    'All',
    'Skin Care',
    'Make Up',
    'Hair Care',
    'Fragrances',
    'Nail Care',
    'Body Care',
    'Accessories & Tools',
  ];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS.slice(0, 8);
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="best-sellers-section" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F7F5F1]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Row with View All Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
              Our Products
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Our <span className="text-[#C9A66B]">Best Sellers</span> Products
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
          </button>
        </div>

        {/* Filter Pill Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 sm:mb-10 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#1F3A26] text-white shadow-md'
                    : 'bg-white text-[#1A1A1A] hover:bg-gray-200 border border-gray-200/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 4-Column Responsive Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl p-8 border border-gray-200">
            <p className="text-gray-500 font-medium">No best sellers found in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.has(product.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
