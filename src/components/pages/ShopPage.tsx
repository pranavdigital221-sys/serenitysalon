import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, Sparkles, RefreshCw, X, ArrowRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';
import { Product, PageView } from '../../types';
import { formatINR } from '../../utils/currency';

interface ShopPageProps {
  initialCategory?: string;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onQuickView: (product: Product) => void;
  onNavigate: (page: PageView) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('bestseller');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const skinTypes = ['All', 'Sensitive', 'Dry', 'Combination', 'Oily', 'Normal', 'Aging'];
  const categoriesList = ['All', 'Skin Care', 'Make Up', 'Hair Care', 'Fragrances', 'Nail Care', 'Body Care', 'Accessories & Tools'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // Rating filter
      if (product.rating < minRating) {
        return false;
      }
      // Skin type filter
      if (selectedSkinType !== 'All') {
        if (!product.skinType || !product.skinType.some((st) => st.toLowerCase().includes(selectedSkinType.toLowerCase()) || st === 'All Skin Types' || st === 'All')) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [selectedCategory, maxPrice, selectedSkinType, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(5000);
    setSelectedSkinType('All');
    setMinRating(0);
    setSortBy('bestseller');
  };

  return (
    <div className="bg-[#F7F5F1] min-h-screen">
      
      {/* Page Header Banner */}
      <section className="relative bg-[#1F3A26] text-white py-14 sm:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C9A66B_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#C9A66B] uppercase tracking-wider mb-3">
            <button onClick={() => onNavigate('home')} className="hover:underline cursor-pointer">Home</button>
            <span>/</span>
            <span className="text-white">Shop Botanical Collection</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-3">
            All Natural <span className="text-[#C9A66B]">Skincare &amp; Cosmetics</span>
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            100% clean, vegan, and biocompatible plant formulations created to restore dewy radiance without synthetic compromise.
          </p>
        </div>
      </section>

      {/* Main Shop Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        
        {/* Mobile Filter Toggle & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#1F3A26]/8 shadow-xs">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 rounded-full bg-[#1F3A26] text-white text-xs font-semibold flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Filters</span>
            </button>

            <span className="text-xs font-semibold text-[#6E6E6E]">
              Showing <strong className="text-[#1F3A26]">{filteredProducts.length}</strong> clean formulas
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#6E6E6E] font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-full bg-[#F7F5F1] text-xs font-semibold text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] cursor-pointer"
            >
              <option value="bestseller">Featured / Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated (5★)</option>
              <option value="newest">Newest Formulations</option>
            </select>
          </div>

        </div>

        {/* Main Grid with Left Sidebar Filters + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filters (Desktop 3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            
            {/* Filter Card 1: Categories */}
            <div className="bg-white rounded-[20px] p-5 border border-[#1F3A26]/8 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-[#1F3A26] uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-[10px] text-gray-400 font-normal">Select</span>
              </h3>
              <div className="space-y-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#1F3A26] text-white'
                        : 'text-[#1A1A1A] hover:bg-[#F7F5F1]'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Card 2: Price Slider */}
            <div className="bg-white rounded-[20px] p-5 border border-[#1F3A26]/8 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-sm text-[#1F3A26] uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="font-heading font-bold text-sm text-[#1F3A26]">
                  {formatINR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1F3A26] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹400</span>
                <span>₹2,500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* Filter Card 3: Skin Concern */}
            <div className="bg-white rounded-[20px] p-5 border border-[#1F3A26]/8 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-[#1F3A26] uppercase tracking-wider mb-3">
                Skin Concern
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSkinType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      selectedSkinType === type
                        ? 'bg-[#1F3A26] text-white'
                        : 'bg-[#F7F5F1] text-[#1A1A1A] hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="w-full py-2.5 rounded-full bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold hover:bg-[#C9A66B] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#C9A66B]/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>

          </div>

          {/* Right Product Grid (Desktop 9 cols) */}
          <div className="lg:col-span-9">
            
            {/* Active Filter Tags */}
            {(selectedCategory !== 'All' || maxPrice < 5000 || selectedSkinType !== 'All') && (
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="text-xs text-gray-500 font-medium">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white text-[#1F3A26] px-3 py-1 rounded-full border border-gray-200 shadow-xs font-semibold">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {maxPrice < 5000 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white text-[#1F3A26] px-3 py-1 rounded-full border border-gray-200 shadow-xs font-semibold">
                    Max: {formatINR(maxPrice)}
                    <button onClick={() => setMaxPrice(5000)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedSkinType !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white text-[#1F3A26] px-3 py-1 rounded-full border border-gray-200 shadow-xs font-semibold">
                    Concern: {selectedSkinType}
                    <button onClick={() => setSelectedSkinType('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[24px] p-12 text-center border border-[#1F3A26]/8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F1] text-gray-400 mx-auto flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-[#C9A66B]" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-2">
                  No botanical products match your criteria
                </h3>
                <p className="text-sm text-[#6E6E6E] max-w-sm mx-auto mb-6">
                  Try adjusting your price range, clearing specific skin concerns, or resetting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#1F3A26] text-white text-xs font-semibold hover:bg-[#4F7358] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

            {/* Mid-Grid Horizontal Promo Banner (as requested in 6.1) */}
            <div className="mt-12 bg-[#1F3A26] text-white rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="max-w-md">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A66B] block mb-1">
                  Complimentary Gift
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">
                  Free Rosewater Hydrosol on Orders ₹1,499+
                </h3>
                <p className="text-xs text-white/80">
                  Automatically added to your cart at checkout. Non-toxic, soothing damask rose water.
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory('Skin Care')}
                className="shrink-0 px-6 py-3 rounded-full bg-white text-[#1F3A26] hover:bg-[#C9A66B] hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Shop Skincare
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-heading font-bold text-lg text-[#1F3A26]">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#1F3A26] uppercase mb-2">Category</h4>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedCategory === cat ? 'bg-[#1F3A26] text-white' : 'text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#1F3A26] uppercase mb-2">Max Price ({formatINR(maxPrice)})</h4>
                <input
                  type="range"
                  min="400"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1F3A26]"
                />
              </div>

              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-full bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold border border-[#C9A66B]/30"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
