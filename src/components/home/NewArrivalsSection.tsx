import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';
import { Product, PageView } from '../../types';
import { PRODUCT_ASSETS } from '../../utils/assets';

interface NewArrivalsSectionProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onQuickView: (product: Product) => void;
  onNavigate: (page: PageView) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onNavigate,
}) => {
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 6);

  return (
    <section id="new-arrivals-section" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F7F5F1]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Row with Right-aligned Intro Paragraph */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
              New Arrival
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              <span className="text-[#C9A66B]">New Arrival</span> Products
            </h2>
          </div>
          
          <p className="text-sm text-[#6E6E6E] max-w-md md:text-right">
            Discover the latest clean beauty breakthroughs formulated with stabilized botanical bio-actives and cold-pressed seed lipids.
          </p>
        </div>

        {/* Layout: 1 Large Tall Promo Image on Left (4 cols) + 2x3 Grid of 6 Product Cards on Right (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Large Tall Promo Card (4 cols) */}
          <div className="lg:col-span-4 relative rounded-[28px] overflow-hidden min-h-[420px] lg:min-h-full p-8 flex flex-col justify-between shadow-lg group">
            {/* Background Photo */}
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('${PRODUCT_ASSETS.prodVitC}')`
              }}
            />
            {/* Dark Forest Green Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A26]/95 via-[#1F3A26]/60 to-black/30" />

            {/* Top Pill Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md border border-[#C9A66B]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>50% Off New Collection</span>
              </span>
            </div>

            {/* Bottom Content & CTA */}
            <div className="relative z-10 text-white">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C9A66B] block mb-1">
                Seasonal Launch
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-snug mb-3 text-white">
                Botanical Vitamin C &amp; Kakadu Plum Elixir
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-6 line-clamp-3">
                Brighten dark spots and shield against blue light fatigue with wild-harvested superfruit bio-flavonoids.
              </p>
              
              <button
                onClick={() => onNavigate('shop')}
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#C9A66B] text-[#1F3A26] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Shop New Collection</span>
                <ArrowRight className="w-4 h-4 text-[#1F3A26]" />
              </button>
            </div>
          </div>

          {/* Right 2x3 Grid of 6 Product Cards (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {newArrivals.map((product) => (
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

        </div>

      </div>
    </section>
  );
};
