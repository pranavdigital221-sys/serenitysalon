import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Leaf, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { SafeImage } from './SafeImage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onBuyNow?: (product: Product, quantity: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const gallery = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : (product.secondaryImage ? [product.image, product.secondaryImage] : [product.image]);

  const activeImage = gallery[selectedImageIndex] || product.image;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    if (onBuyNow) {
      onBuyNow(product, quantity);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[24px] max-w-4xl w-full shadow-2xl overflow-hidden border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Image Gallery */}
            <div className="bg-[#F7F5F1] p-6 sm:p-8 flex flex-col items-center justify-between relative">
              {product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-[#C9A66B]/30 z-10">
                  {product.discountPercentage}% OFF
                </span>
              )}

              <div className="aspect-square w-full max-w-[320px] rounded-[20px] overflow-hidden bg-white shadow-md flex items-center justify-center p-2">
                <SafeImage
                  src={activeImage}
                  alt={product.name}
                  fallbackType="product"
                  objectFit="contain"
                  className="w-full h-full"
                />
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2.5 mt-4">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden bg-white border-2 transition-all p-1 cursor-pointer ${
                        selectedImageIndex === idx ? 'border-[#1F3A26] shadow-sm scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <SafeImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} fallbackType="product" objectFit="contain" className="w-full h-full" />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Guarantees */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-[#1F3A26]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A66B]" /> 100% Genuine
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" /> Salon Quality
                </span>
                {product.warranty ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#C9A66B]" /> {product.warranty}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-[#C9A66B]" /> Clean Formula
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Category, Brand & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E]">
                      {product.category} {product.subCategory && `• ${product.subCategory}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A1A]">
                    <Star className="w-3.5 h-3.5 fill-[#C9A66B] text-[#C9A66B]" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Brand */}
                {product.brand && (
                  <span className="text-xs font-semibold text-[#C9A66B] uppercase tracking-wider block mb-1">
                    {product.brand}
                  </span>
                )}

                {/* Title */}
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1F3A26] leading-snug mb-3">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-heading font-bold text-2xl sm:text-3xl text-[#1F3A26]">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-[#6E6E6E] line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-xs bg-[#FDF1E4] text-[#1F3A26] font-bold px-2.5 py-0.5 rounded-full border border-[#C9A66B]/30">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                  {product.volume && (
                    <span className="text-xs bg-[#F7F5F1] text-[#1F3A26] px-2.5 py-0.5 rounded-full font-medium ml-auto">
                      {product.volume}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-[#6E6E6E] leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-4 bg-[#F7F5F1]/70 p-3.5 rounded-2xl border border-[#1F3A26]/5">
                    <span className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider block mb-2">
                      Key Features:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#1A1A1A]">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Product Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider block mb-2">
                      Product Specifications:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="bg-[#F7F5F1] px-3 py-2 rounded-xl">
                          <span className="text-gray-500 text-[10px] uppercase font-semibold block">{key}</span>
                          <span className="text-[#1F3A26] font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Ingredients */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider block mb-1.5">
                      Botanical Actives:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, i) => (
                        <span key={i} className="text-[11px] bg-[#F7F5F1] text-[#1F3A26] px-2.5 py-1 rounded-full font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions: Quantity + Add to Cart + Buy Now + Wishlist */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 bg-[#F7F5F1]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-gray-600 hover:text-black px-1 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-[#1F3A26]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-gray-600 hover:text-black px-1 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAdd}
                    disabled={added}
                    className={`flex-1 py-3 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      added 
                        ? 'bg-[#4F7358] text-white' 
                        : 'bg-[#1F3A26] hover:bg-[#4F7358] text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-[#C9A66B]" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
                        <span>Add to Bag • {formatINR(product.price * quantity)}</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-5 rounded-full font-semibold text-xs sm:text-sm bg-[#C9A66B] hover:bg-[#b08e54] text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isWishlisted 
                        ? 'bg-[#1F3A26] text-[#C9A66B]' 
                        : 'bg-[#F7F5F1] text-gray-700 hover:bg-[#1F3A26] hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Free return guarantee */}
                <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
                  <RefreshCw className="w-3 h-3 text-[#C9A66B]" /> 100% Secure Checkout &amp; Fast Shipping across India
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

