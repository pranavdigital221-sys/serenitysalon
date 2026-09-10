import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, Star } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { SafeImage } from './SafeImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Skin Care', 'Make Up', 'Hair Care', 'Fragrances', 'Nail Care', 'Body Care'];

  const results = useMemo(() => {
    if (!query.trim() && selectedCategory === 'All') return PRODUCTS.slice(0, 4);
    
    return PRODUCTS.filter((p) => {
      const matchesQuery = !query.trim() || 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-start justify-center pt-16 sm:pt-24">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Search Box */}
      <div className="relative bg-white rounded-[24px] max-w-2xl w-full shadow-2xl overflow-hidden border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C9A66B] shrink-0 ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search botanical serums, face oils, lip tints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-black font-semibold px-2 py-1 bg-gray-100 rounded-full"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-3 bg-[#F7F5F1] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1F3A26] text-white shadow-xs'
                  : 'bg-white text-[#1A1A1A] hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="text-xs text-[#6E6E6E] font-semibold mb-2">
            {query.trim() ? `Found ${results.length} results` : 'Popular Clean Beauty Picks'}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500">No products found matching "{query}".</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for "serum", "oil", or "blush".</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#F7F5F1] transition-colors cursor-pointer group"
              >
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-[#F7F5F1] shrink-0"
                  fallbackType="product"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#6E6E6E]">
                    {product.category}
                  </span>
                  <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] group-hover:text-[#1F3A26] truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-heading font-bold text-xs text-[#1F3A26]">
                      {formatINR(product.price)}
                    </span>
                    <div className="flex items-center text-[10px] text-gray-500">
                      <Star className="w-3 h-3 fill-[#C9A66B] text-[#C9A66B] mr-0.5" />
                      {product.rating}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                    onClose();
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-[#1F3A26] text-white text-xs font-semibold hover:bg-[#4F7358] transition-colors flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3 text-[#C9A66B]" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
