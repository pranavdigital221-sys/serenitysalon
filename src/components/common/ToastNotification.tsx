import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, X } from 'lucide-react';

interface ToastNotificationProps {
  toast: {
    message: string;
    type?: 'cart' | 'wishlist' | 'info';
  } | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1F3A26] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-[#C9A66B]/40 max-w-sm">
        {toast.type === 'wishlist' ? (
          <Heart className="w-4 h-4 text-[#C9A66B] fill-current shrink-0" />
        ) : toast.type === 'cart' ? (
          <ShoppingBag className="w-4 h-4 text-[#C9A66B] shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-[#C9A66B] shrink-0" />
        )}
        <span className="text-xs font-semibold">{toast.message}</span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white ml-2 p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
