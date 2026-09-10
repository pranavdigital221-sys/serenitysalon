import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { SafeImage } from './SafeImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddAllToCart: () => void;
  onNavigateToShop: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveWishlist,
  onAddToCart,
  onAddAllToCart,
  onNavigateToShop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 bg-[#F7F5F1] border-b border-[#1F3A26]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1F3A26] text-white flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#C9A66B] fill-current" />
              </div>
              <h2 className="font-heading font-bold text-lg text-[#1F3A26]">
                Saved Favorites ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F1] text-gray-400 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-[#C9A66B]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-sm text-[#6E6E6E] max-w-xs mb-6">
                  Save your favorite botanical serums, face oils, and clean makeup picks to shop anytime.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="px-6 py-3 rounded-full bg-[#1F3A26] text-white text-sm font-semibold hover:bg-[#4F7358] transition-colors cursor-pointer"
                >
                  Explore Best Sellers
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-[16px] bg-[#F7F5F1] border border-gray-100 items-center justify-between"
                >
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0"
                    fallbackType="product"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E6E] block">
                      {product.category}
                    </span>
                    <h4 className="font-heading text-xs sm:text-sm font-semibold text-[#1A1A1A] truncate">
                      {product.name}
                    </h4>
                    <span className="font-heading font-bold text-sm text-[#1F3A26] block mt-0.5">
                      {formatINR(product.price)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-3 py-1.5 rounded-full bg-[#1F3A26] text-white text-xs font-semibold hover:bg-[#4F7358] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C9A66B]" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="text-gray-400 hover:text-red-500 text-xs py-1 text-center flex items-center justify-center"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#1F3A26]/10">
              <button
                onClick={onAddAllToCart}
                className="w-full py-3.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Add All Items to Bag</span>
                <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
