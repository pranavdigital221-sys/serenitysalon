import React from 'react';
import { Heart, Eye, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-[20px] p-3.5 sm:p-4 border border-[#1F3A26]/8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-[#F7F5F1] mb-3.5">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackType="product"
          objectFit={product.subCategory || product.category === 'Accessories & Tools' ? 'contain' : 'cover'}
          className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
            product.subCategory || product.category === 'Accessories & Tools'
              ? 'p-2'
              : ''
          }`}
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage && (
            <span className="bg-[#FDF1E4] text-[#1F3A26] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-[#C9A66B]/30 tracking-tight">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.tag && !product.discountPercentage && (
            <span className="bg-[#1F3A26] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.tag}
            </span>
          )}
        </div>

        {/* Floating Actions on Hover */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-10">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
              isWishlisted
                ? 'bg-[#1F3A26] text-[#C9A66B]'
                : 'bg-white/90 backdrop-blur-xs text-[#1A1A1A] hover:bg-[#1F3A26] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            aria-label="Quick View Details"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#1A1A1A] flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-all duration-200 shadow-sm opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View overlay strip for mobile */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-0 inset-x-0 bg-[#1F3A26]/85 backdrop-blur-xs text-white text-xs font-semibold py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block cursor-pointer"
        >
          Quick Look
        </button>
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E6E]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[12px] text-[#1A1A1A] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#C9A66B] text-[#C9A66B]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={handleQuickView}
            className="font-heading font-semibold text-sm sm:text-base text-[#1A1A1A] hover:text-[#1F3A26] transition-colors line-clamp-2 min-h-[2.5rem] cursor-pointer mb-2 leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-[#1F3A26]/5 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-[#1F3A26]">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#6E6E6E] line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            {product.volume && (
              <span className="text-[10px] text-gray-400 font-medium">
                {product.volume}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={`px-3 sm:px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
              justAdded
                ? 'bg-[#4F7358] text-white'
                : 'bg-[#1F3A26] text-white hover:bg-[#4F7358] hover:shadow-md'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
