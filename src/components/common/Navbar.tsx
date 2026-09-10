import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles, Code } from 'lucide-react';
import { PageView } from '../../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenElementorGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onOpenElementorGuide,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageView; isSpecial?: boolean }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Shop', page: 'shop' },
    { label: 'Skin Care', page: 'skincare' },
    { label: 'Makeup', page: 'makeup' },
    { label: 'Hair Care', page: 'haircare' },
    { label: 'About Us', page: 'about' },
    { label: 'Blogs', page: 'blogs' },
    { label: 'Admin Dashboard', page: 'admin', isSpecial: true },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md py-3' : 'py-4.5 border-b border-[#1F3A26]/8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
          aria-label="Serenity Salon Home"
        >
          <BrandLogo size="md" />
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map(({ label, page }) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => handleNavClick(page)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#1F3A26] text-white shadow-sm'
                    : 'text-[#1A1A1A] hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Catalog"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F5F1] hover:text-[#1F3A26] transition-colors cursor-pointer"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="View Wishlist"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F5F1] hover:text-[#1F3A26] transition-colors cursor-pointer"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A66B] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View Shopping Bag"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F5F1] hover:text-[#1F3A26] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1F3A26] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Profile Trigger */}
          <button
            onClick={onOpenAccount}
            aria-label="Account Login"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F5F1] hover:text-[#1F3A26] transition-colors cursor-pointer"
          >
            <User className="w-4.5 h-4.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F5F1] transition-colors cursor-pointer ml-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#1F3A26]/10 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1.5">
            {navItems.map(({ label, page }) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#1F3A26] text-white'
                      : 'text-[#1A1A1A] hover:bg-[#F7F5F1]'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && <Sparkles className="w-4 h-4 text-[#C9A66B]" />}
                </button>
              );
            })}
            
            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenElementorGuide();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FDF1E4] text-[#1F3A26] text-xs font-bold border border-[#C9A66B]/30"
              >
                <Code className="w-4 h-4 text-[#C9A66B]" />
                WordPress & Elementor Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
