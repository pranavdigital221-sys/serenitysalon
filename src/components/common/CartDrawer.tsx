import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../../types';
import { formatINR, FREE_SHIPPING_THRESHOLD_INR, STANDARD_SHIPPING_FEE_INR } from '../../utils/currency';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (promoCode?: string) => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNavigateToShop,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD_INR;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = amountNeeded <= 0 ? 0 : STANDARD_SHIPPING_FEE_INR;

  const discountAmount = appliedDiscount ? subtotal * appliedDiscount : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GLOW20' || promoCode.trim().toUpperCase() === 'BEAUTY20') {
      setAppliedDiscount(0.20);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try code "GLOW20" for 20% off!');
    }
  };

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
                <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
              </div>
              <h2 className="font-heading font-bold text-lg text-[#1F3A26]">
                Your Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-[#FDF1E4] border-b border-[#C9A66B]/20 text-xs">
            <div className="flex items-center justify-between font-semibold text-[#1F3A26] mb-1.5">
              <span>
                {amountNeeded > 0 ? (
                  <>Add <span className="text-[#C9A66B] font-bold">{formatINR(amountNeeded)}</span> more for Free Express Shipping across India!</>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Unlocked: You qualify for FREE Express Shipping!
                  </span>
                )}
              </span>
              <span className="text-[11px] text-gray-500">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1F3A26] transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F1] text-gray-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#C9A66B]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-1">
                  Your bag is empty
                </h3>
                <p className="text-sm text-[#6E6E6E] max-w-xs mb-6">
                  Discover our organic botanical serums and clean cosmetics to begin your radiant ritual.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="px-6 py-3 rounded-full bg-[#1F3A26] text-white text-sm font-semibold hover:bg-[#4F7358] transition-colors cursor-pointer"
                >
                  Explore Clean Skincare
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-[16px] bg-[#F7F5F1] border border-gray-100"
                >
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white shrink-0"
                    fallbackType="product"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E6E]">
                          {product.category}
                        </span>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded-full bg-white px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="text-gray-500 hover:text-[#1F3A26] p-1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1F3A26]">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="text-gray-500 hover:text-[#1F3A26] p-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-heading font-bold text-sm text-[#1F3A26]">
                        {formatINR(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#1F3A26]/10 space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (try GLOW20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-full bg-[#F7F5F1] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F7F5F1] hover:bg-[#1F3A26] hover:text-white text-xs font-bold rounded-full transition-colors cursor-pointer border border-gray-300"
                >
                  Apply
                </button>
              </form>
              {appliedDiscount && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 20% discount coupon applied!
                </p>
              )}
              {promoError && <p className="text-xs text-red-500">{promoError}</p>}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-[#6E6E6E] pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatINR(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo Discount (20%)</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {amountNeeded <= 0 ? 'FREE' : formatINR(STANDARD_SHIPPING_FEE_INR)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F3A26] pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-base">{formatINR(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onCheckout(appliedDiscount ? promoCode : undefined);
                }}
                className="w-full py-3.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>UPI / Cards / NetBanking • 30-Day Money Back Guarantee</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
