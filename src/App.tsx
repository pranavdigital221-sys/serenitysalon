import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageView, Product, CartItem, BlogPost } from './types';
import { PRODUCTS } from './data/mockData';

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { CategoryTicker } from './components/common/CategoryTicker';
import { NewsletterSection } from './components/common/NewsletterSection';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';
import { AccountModal } from './components/common/AccountModal';
import { ContactModal } from './components/common/ContactModal';
import { ProductCheckoutModal } from './components/common/ProductCheckoutModal';
import { ToastNotification } from './components/common/ToastNotification';
import { ScrollToTop } from './components/common/ScrollToTop';
import { createNewOrder } from './utils/accountData';

// Home Page Sections (1 to 20 in exact specified order)
import { HeroSection } from './components/home/HeroSection';
import { CategoriesSection } from './components/home/CategoriesSection';
import { DualPromoBanners } from './components/home/DualPromoBanners';
import { AboutStorySection } from './components/home/AboutStorySection';
import { BestSellersSection } from './components/home/BestSellersSection';
import { SummerGlowDeals } from './components/home/SummerGlowDeals';
import { DealsOfTheDay } from './components/home/DealsOfTheDay';
import { WeeklyDealsBanner } from './components/home/WeeklyDealsBanner';
import { NewArrivalsSection } from './components/home/NewArrivalsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { NewsBlogsSection } from './components/home/NewsBlogsSection';
import { InstagramFeedSection } from './components/home/InstagramFeedSection';
import { FAQSection } from './components/home/FAQSection';

// Code Split & Lazy Loaded Pages / Heavy Modules
const ShopPage = lazy(() => import('./components/pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const BlogsPage = lazy(() => import('./components/pages/BlogsPage').then((m) => ({ default: m.BlogsPage })));
const ServicesPage = lazy(() => import('./components/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const AdminDashboard = lazy(() => import('./components/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const ElementorExportModal = lazy(() => import('./components/common/ElementorExportModal').then((m) => ({ default: m.ElementorExportModal })));
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsConditionsPage = lazy(() => import('./components/pages/TermsConditionsPage').then((m) => ({ default: m.TermsConditionsPage })));
const ShippingPolicyPage = lazy(() => import('./components/pages/ShippingPolicyPage').then((m) => ({ default: m.ShippingPolicyPage })));
const ContactUsPage = lazy(() => import('./components/pages/ContactUsPage').then((m) => ({ default: m.ContactUsPage })));
const CancellationRefundPolicyPage = lazy(() => import('./components/pages/CancellationRefundPolicyPage').then((m) => ({ default: m.CancellationRefundPolicyPage })));
const PricingPage = lazy(() => import('./components/pages/PricingPage').then((m) => ({ default: m.PricingPage })));

import { AdminAuthGate } from './components/common/AdminAuthGate';
import { AppointmentBookingModal } from './components/common/AppointmentBookingModal';
import { SalonService } from './types';
import { BarChart3, X, Eye, Loader2 } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('All');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  // Cart & Wishlist State (with localStorage persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('beauty_shop_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[1], quantity: 1 },
      ];
    } catch {
      return [{ product: PRODUCTS[0], quantity: 1 }];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('beauty_shop_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set([PRODUCTS[0].id, PRODUCTS[2].id]);
    } catch {
      return new Set([PRODUCTS[0].id]);
    }
  });

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<'orders' | 'loyalty' | 'referral' | 'profile'>('orders');
  const [isElementorGuideOpen, setIsElementorGuideOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<SalonService | null>(null);
  const [bookingCategory, setBookingCategory] = useState<string | undefined>(undefined);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isProductCheckoutOpen, setIsProductCheckoutOpen] = useState(false);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');
  const [checkoutSessionKey, setCheckoutSessionKey] = useState<number>(() => Date.now());

  const handleOpenAccount = (tab: 'orders' | 'loyalty' | 'referral' | 'profile' = 'orders') => {
    setAccountInitialTab(tab);
    setIsAccountOpen(true);
  };

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type?: 'cart' | 'wishlist' | 'info' } | null>(null);
  const [showAdminFloatingTrigger, setShowAdminFloatingTrigger] = useState(true);

  // Global URL routing and Keyboard shortcut listener (Ctrl+Shift+A or Alt+A) to access Admin Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentPage((prev) => (prev === 'admin' ? 'home' : 'admin'));
        showToast('Toggled Admin Dashboard (HotKey: Ctrl+Shift+A)', 'info');
      } else if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentPage((prev) => (prev === 'admin' ? 'home' : 'admin'));
        showToast('Toggled Admin Dashboard (HotKey: Alt+A)', 'info');
      }
    };

    const syncRouteFromLocation = () => {
      const hash = window.location.hash.toLowerCase();
      const rawPath = window.location.pathname.toLowerCase();
      const path = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
      
      if (path === '/privacy-policy' || path.endsWith('/privacy-policy') || hash === '#privacy' || hash === '#privacy-policy') {
        setCurrentPage('privacy-policy');
      } else if (path === '/terms-and-conditions' || path.endsWith('/terms-and-conditions') || hash === '#terms' || hash === '#terms-and-conditions') {
        setCurrentPage('terms-and-conditions');
      } else if (path === '/shipping-policy' || path.endsWith('/shipping-policy') || hash === '#shipping' || hash === '#shipping-policy') {
        setCurrentPage('shipping-policy');
      } else if (path === '/contact-us' || path.endsWith('/contact-us') || hash === '#contact' || hash === '#contact-us') {
        setCurrentPage('contact-us');
      } else if (path === '/cancellation-refund-policy' || path.endsWith('/cancellation-refund-policy') || hash === '#refund' || hash === '#cancellation-refund-policy') {
        setCurrentPage('cancellation-refund-policy');
      } else if (path === '/pricing' || path.endsWith('/pricing') || hash === '#pricing') {
        setCurrentPage('pricing');
      } else if (hash === '#services' || path.endsWith('/services') || path === '/services') {
        setCurrentPage('services');
      } else if (hash === '#admin' || path.endsWith('/admin') || path === '/admin') {
        setCurrentPage('admin');
      } else if (hash === '#shop' || path.endsWith('/shop') || path === '/shop') {
        setCurrentPage('shop');
      } else if (hash === '#about' || path.endsWith('/about') || path === '/about') {
        setCurrentPage('about');
      } else if (hash === '#blogs' || path.endsWith('/blogs') || path === '/blogs') {
        setCurrentPage('blogs');
      } else if (path === '/' || hash === '#home') {
        setCurrentPage('home');
      }
    };

    syncRouteFromLocation();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', syncRouteFromLocation);
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', syncRouteFromLocation);
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, []);

  const showToast = (message: string, type: 'cart' | 'wishlist' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('beauty_shop_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('beauty_shop_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your shopping bag!`, 'cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from your bag.', 'info');
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed "${product.name}" from favorites.`, 'wishlist');
      } else {
        next.add(product.id);
        showToast(`Saved "${product.name}" to your favorites!`, 'wishlist');
      }
      return next;
    });
  };

  const handleAddAllWishlistToCart = () => {
    const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.has(p.id));
    wishlistedProducts.forEach((p) => handleAddToCart(p, 1));
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast(`Added ${wishlistedProducts.length} favorites to your shopping bag!`, 'cart');
  };

  // Navigation Handler
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    try {
      const targetPath = page === 'home' ? '/' : `/${page}`;
      window.history.pushState({}, '', targetPath);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (service?: SalonService, category?: string) => {
    setBookingService(service || null);
    setBookingCategory(category);
    setIsBookingOpen(true);
  };

  const handleCategorySelectFromHome = (categoryName: string) => {
    setShopCategoryFilter(categoryName);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlogPost = (post: BlogPost | null) => {
    setSelectedBlogPost(post);
    if (post) {
      setCurrentPage('blogs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F1] text-[#1A1A1A]">
      
      {/* 4.1 Top Announcement Bar */}
      <AnnouncementBar onOpenNewsletterModal={() => handleOpenAccount('referral')} />

      {/* 4.2 Main Sticky Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => handleOpenAccount('orders')}
        onOpenElementorGuide={() => setIsElementorGuideOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-[#FBF9F5] py-20">
              <Loader2 className="w-8 h-8 text-[#1F3A26] animate-spin" />
              <p className="text-xs font-semibold text-[#1F3A26]/70 uppercase tracking-wider font-sans">
                Loading Experience...
              </p>
            </div>
          }
        >
          {/* PAGE 1: HOME PAGE (Sections 1 to 20 in exact order) */}
          {currentPage === 'home' && (
            <div>
              {/* 1. Hero Section */}
              <HeroSection onNavigate={handleNavigate} />

              {/* 2. Category Ticker */}
              <CategoryTicker id="ticker-1" />

              {/* 3. Shop By Category */}
              <CategoriesSection
                onSelectCategory={handleCategorySelectFromHome}
                onNavigate={handleNavigate}
              />

              {/* 4. Dual Promo Banner Row */}
              <DualPromoBanners onNavigate={handleNavigate} />

              {/* 5. About Us / Brand Story */}
              <AboutStorySection onNavigate={handleNavigate} />

              {/* 6. Our Best Sellers Products */}
              <BestSellersSection
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                onQuickView={(p) => setQuickViewProduct(p)}
                onNavigate={handleNavigate}
              />

              {/* 7. Summer Glow Deals (Countdown Banner) */}
              <SummerGlowDeals onNavigate={handleNavigate} />

              {/* 8. Category Ticker */}
              <CategoryTicker id="ticker-2" />

              {/* 9. Deals of the Day */}
              <DealsOfTheDay
                onAddToCart={handleAddToCart}
                onQuickView={(p) => setQuickViewProduct(p)}
              />

              {/* 10. Weekly Deals Banner */}
              <WeeklyDealsBanner onNavigate={handleNavigate} />

              {/* 11. Category Ticker */}
              <CategoryTicker id="ticker-3" />

              {/* 12. New Arrival Products */}
              <NewArrivalsSection
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                onQuickView={(p) => setQuickViewProduct(p)}
                onNavigate={handleNavigate}
              />

              {/* 13. Testimonials */}
              <TestimonialsSection />

              {/* 14. News & Blogs */}
              <NewsBlogsSection
                onSelectBlog={handleSelectBlogPost}
                onNavigate={handleNavigate}
              />

              {/* 15. Category Ticker */}
              <CategoryTicker id="ticker-4" />

              {/* 16. Follow Us on Instagram */}
              <InstagramFeedSection />

              {/* 17. Category Ticker */}
              <CategoryTicker id="ticker-5" />

              {/* 18. FAQ */}
              <FAQSection onOpenContactModal={() => setIsContactOpen(true)} />
            </div>
          )}

          {/* PAGE 2: SERVICES & TREATMENTS */}
          {currentPage === 'services' && (
            <ServicesPage
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenBooking}
            />
          )}

          {/* PAGE 3: SHOP / ALL PRODUCTS */}
          {currentPage === 'shop' && (
            <ShopPage
              initialCategory={shopCategoryFilter}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onQuickView={(p) => setQuickViewProduct(p)}
              onNavigate={handleNavigate}
            />
          )}

          {/* PAGE 3: SKIN CARE */}
          {currentPage === 'skincare' && (
            <ShopPage
              initialCategory="Skin Care"
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onQuickView={(p) => setQuickViewProduct(p)}
              onNavigate={handleNavigate}
            />
          )}

          {/* PAGE 4: MAKEUP */}
          {currentPage === 'makeup' && (
            <ShopPage
              initialCategory="Make Up"
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onQuickView={(p) => setQuickViewProduct(p)}
              onNavigate={handleNavigate}
            />
          )}

          {/* PAGE 5: HAIR CARE */}
          {currentPage === 'haircare' && (
            <ShopPage
              initialCategory="Hair Care"
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onQuickView={(p) => setQuickViewProduct(p)}
              onNavigate={handleNavigate}
            />
          )}

          {/* PAGE 6: ABOUT US */}
          {currentPage === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}

          {/* PAGE 7: BLOGS */}
          {currentPage === 'blogs' && (
            <BlogsPage
              selectedPost={selectedBlogPost}
              onSelectPost={setSelectedBlogPost}
              onNavigate={handleNavigate}
            />
          )}

          {/* PAGE 8: ADMIN DASHBOARD (PROTECTED WITH AUTH GATE) */}
          {currentPage === 'admin' && (
            <AdminAuthGate onNavigateHome={() => handleNavigate('home')}>
              <AdminDashboard
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onAddToCart={handleAddToCart}
                onNavigate={handleNavigate}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            </AdminAuthGate>
          )}

          {/* POLICY PAGE 1: PRIVACY POLICY */}
          {currentPage === 'privacy-policy' && (
            <PrivacyPolicyPage onNavigate={handleNavigate} />
          )}

          {/* POLICY PAGE 2: TERMS & CONDITIONS */}
          {currentPage === 'terms-and-conditions' && (
            <TermsConditionsPage onNavigate={handleNavigate} />
          )}

          {/* POLICY PAGE 3: SHIPPING POLICY */}
          {currentPage === 'shipping-policy' && (
            <ShippingPolicyPage onNavigate={handleNavigate} />
          )}

          {/* POLICY PAGE 4: CONTACT US */}
          {currentPage === 'contact-us' && (
            <ContactUsPage onNavigate={handleNavigate} />
          )}

          {/* POLICY PAGE 5: CANCELLATION & REFUND POLICY */}
          {currentPage === 'cancellation-refund-policy' && (
            <CancellationRefundPolicyPage onNavigate={handleNavigate} />
          )}

          {/* POLICY PAGE 6: PRICING & PRODUCT DETAILS */}
          {currentPage === 'pricing' && (
            <PricingPage
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenBooking}
              onAddToCart={handleAddToCart}
            />
          )}
        </Suspense>
      </main>

      {/* 19. Newsletter Signup Bar (hidden on admin view to keep analytics focused) */}
      {currentPage !== 'admin' && <NewsletterSection />}

      {/* 20. Main Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenElementorGuide={() => setIsElementorGuideOpen(true)}
        onOpenAdmin={() => handleNavigate('admin')}
        onOpenAccountModal={handleOpenAccount}
      />

      {/* Temporary Hidden Admin Trigger (Floating Discreet Access Pill) */}
      {showAdminFloatingTrigger && (
        <div className="fixed bottom-4 left-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#1F3A26] text-white px-3 py-2 rounded-2xl shadow-xl border border-[#C9A66B]/40 flex items-center gap-2 text-xs">
            <button
              onClick={() => handleNavigate(currentPage === 'admin' ? 'home' : 'admin')}
              className="flex items-center gap-1.5 font-bold hover:text-[#C9A66B] transition-colors cursor-pointer"
              title="Toggle Recharts Admin Dashboard (Shortcut: Ctrl+Shift+A or Alt+A)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{currentPage === 'admin' ? 'Exit Admin View' : 'Admin Dashboard (Recharts)'}</span>
            </button>
            <span className="text-white/30">|</span>
            <span className="text-[10px] text-gray-300 font-mono hidden sm:inline">Ctrl+Shift+A</span>
            <button
              onClick={() => setShowAdminFloatingTrigger(false)}
              className="w-4 h-4 rounded-full text-gray-400 hover:text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
              title="Hide floating trigger (still accessible in Footer & via Ctrl+Shift+A)"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-Over Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={(promoCode) => {
          if (!cartItems || cartItems.length === 0) {
            showToast('Your shopping bag is empty. Please add items before checking out.', 'info');
            return;
          }
          setIsCartOpen(false);
          setCheckoutPromoCode(promoCode || '');
          setCheckoutSessionKey(Date.now());
          setIsProductCheckoutOpen(true);
        }}
        onNavigateToShop={() => handleNavigate('shop')}
      />

      <ProductCheckoutModal
        key={`checkout-modal-${checkoutSessionKey}`}
        isOpen={isProductCheckoutOpen}
        onClose={() => {
          setIsProductCheckoutOpen(false);
          setCheckoutPromoCode('');
          setCheckoutSessionKey(Date.now());
        }}
        items={cartItems}
        appliedPromoCode={checkoutPromoCode}
        onOrderSuccess={(order) => {
          // Record order in local customer account and award loyalty tier points
          try {
            createNewOrder(
              cartItems,
              order.subtotal || 0,
              order.discount || 0,
              order.shippingFee || 0,
              order.grandTotal || 0,
              `Razorpay (${order.paymentMethod || 'Online'})`
            );
          } catch (e) {
            console.error('Failed to sync account order:', e);
          }

          // Empty active shopping cart after successful verified payment
          setCartItems([]);
          try {
            localStorage.removeItem('beauty_shop_cart');
            localStorage.setItem('beauty_shop_cart', JSON.stringify([]));
          } catch (e) {
            console.error(e);
          }
          setCheckoutPromoCode('');
          // CRITICAL: Do NOT reset checkoutSessionKey here!
          // Resetting session key here remounts the modal into Step 1 with empty cart
          // while the customer is viewing Step 3 Order Confirmation.
          showToast(`Order #${order.orderId || order.id} confirmed! Confirmation email sent to ${order.email}`, 'cart');
        }}
        onContinueShopping={() => {
          setIsProductCheckoutOpen(false);
          setCheckoutPromoCode('');
          setCheckoutSessionKey(Date.now());
          handleNavigate('shop');
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={PRODUCTS.filter((p) => wishlistIds.has(p.id))}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={(p) => {
          handleAddToCart(p);
          handleToggleWishlist(p);
        }}
        onAddAllToCart={handleAddAllWishlistToCart}
        onNavigateToShop={() => handleNavigate('shop')}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        onBuyNow={(p, q) => {
          handleAddToCart(p, q);
          setIsCartOpen(true);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        initialTab={accountInitialTab}
        onReorderItems={(items) => {
          items.forEach((item) => handleAddToCart(item.product, item.quantity));
          setIsCartOpen(true);
        }}
        onNavigateToShop={() => handleNavigate('shop')}
        onOpenBooking={() => setIsBookingOpen(true)}
        onShowToast={showToast}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <AppointmentBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={bookingService}
        initialCategory={bookingCategory}
        onBookingSuccess={(details) => {
          showToast(`Appointment reserved for ${details.service} on ${details.date} at ${details.time}!`, 'info');
        }}
      />

      <Suspense fallback={null}>
        {isElementorGuideOpen && (
          <ElementorExportModal
            isOpen={isElementorGuideOpen}
            onClose={() => setIsElementorGuideOpen(false)}
          />
        )}
      </Suspense>

      {/* Floating Scroll to Top Button (appears past hero section) */}
      <ScrollToTop />

      {/* Global Toast Feedback */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}
