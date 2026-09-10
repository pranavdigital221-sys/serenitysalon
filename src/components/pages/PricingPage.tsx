import React, { useState, useEffect } from 'react';
import { PageView, SalonService, Product } from '../../types';
import { SALON_SERVICES } from '../../data/servicesData';
import { SERVICE_BASE_PRICES, calculateAdvancePayment } from '../../utils/servicePricing';
import { PRODUCTS } from '../../data/mockData';
import { Tag, Sparkles, ShoppingBag, Calendar, Check, Search, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface PricingPageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking?: (service?: SalonService, category?: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenBooking,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');

  useEffect(() => {
    updatePageSEO(
      'Official Pricing & Product Details | Serenity Salon — Luxury Beauty & Spa',
      'Transparent pricing for Serenity Salon services and retail beauty products. View official service rates, 40% advance deposit details, product prices, and tax breakdown.',
      '/pricing'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const serviceCategories = ['All', 'Hair Services', 'Skin & Facial', 'Makeup & Beauty', 'Nail Care', 'Spa & Wellness'];
  const productCategories = ['All', 'Skin Care', 'Make Up', 'Hair Care', 'Fragrances', 'Nail Care', 'Body Care', 'Accessories & Tools'];

  const filteredServices = SALON_SERVICES.filter((svc) => {
    const matchesCategory = selectedServiceCategory === 'All' || svc.category === selectedServiceCategory;
    const matchesSearch = searchQuery === '' || svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesCategory = selectedProductCategory === 'All' || prod.category === selectedProductCategory;
    const matchesSearch = searchQuery === '' || prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#F7F5F1] min-h-screen pb-16">
      {/* Top Breadcrumb & Hero Header */}
      <section className="bg-[#1F3A26] text-white py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#C9A66B] mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </button>
            <span>/</span>
            <span className="text-white/70">Information</span>
            <span>/</span>
            <span className="text-white font-medium">Pricing &amp; Product Details</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Official Price List &amp; Rates</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Pricing &amp; Product Details
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-3xl leading-relaxed">
            Transparent, all-inclusive pricing for our complete salon treatment menu and handcrafted organic beauty boutique. All prices in Indian Rupees (₹) inclusive of applicable taxes.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        
        {/* Pricing Policy Highlights Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1F3A26]/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold text-[#1F3A26]">All-Inclusive Rates</strong>
              <p className="text-xs text-[#6E6E6E] mt-0.5 leading-relaxed">
                All prices quoted are in INR (₹) and include applicable GST. No hidden convenience fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold text-[#1F3A26]">40% Advance for Appointments</strong>
              <p className="text-xs text-[#6E6E6E] mt-0.5 leading-relaxed">
                Pay 40% online via Razorpay to lock your slot; remaining 60% balance payable at salon.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold text-[#1F3A26]">Product Delivery Terms</strong>
              <p className="text-xs text-[#6E6E6E] mt-0.5 leading-relaxed">
                Free domestic shipping on orders ₹999+; flat ₹99 fee for orders below ₹999.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex p-1 bg-white rounded-full border border-[#1F3A26]/10 shadow-sm self-start">
            <button
              onClick={() => {
                setActiveTab('services');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#1F3A26] text-white shadow-sm'
                  : 'text-[#6E6E6E] hover:text-[#1F3A26]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Salon Services Pricing ({SALON_SERVICES.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#1F3A26] text-white shadow-sm'
                  : 'text-[#6E6E6E] hover:text-[#1F3A26]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Retail Products Pricing ({PRODUCTS.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'services' ? 'services...' : 'products...'}`}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
            />
          </div>
        </div>

        {/* TAB 1: SALON SERVICES PRICING */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedServiceCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedServiceCategory === cat
                      ? 'bg-[#1F3A26] text-white'
                      : 'bg-white text-[#6E6E6E] border border-gray-200 hover:border-[#1F3A26]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Services Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1F3A26] text-white text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">Service Name</th>
                      <th className="py-4 px-4 font-semibold">Category</th>
                      <th className="py-4 px-4 font-semibold">Duration</th>
                      <th className="py-4 px-4 font-semibold">Estimated Base Price</th>
                      <th className="py-4 px-4 font-semibold text-emerald-300">40% Online Advance</th>
                      <th className="py-4 px-4 font-semibold">60% Due at Salon</th>
                      <th className="py-4 px-6 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#1A1A1A]">
                    {filteredServices.map((svc) => {
                      const basePrice = SERVICE_BASE_PRICES[svc.name] || 1000;
                      const { advanceAmount, remainingAmount } = calculateAdvancePayment(svc.name, 40);

                      return (
                        <tr key={svc.id} className="hover:bg-[#FBF9F5] transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#1F3A26]">{svc.name}</div>
                            <div className="text-xs text-[#6E6E6E] line-clamp-1 max-w-xs">{svc.description}</div>
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-[#4A4A4A]">
                            {svc.category}
                          </td>
                          <td className="py-4 px-4 text-xs text-[#6E6E6E]">
                            {svc.duration || '45–60 min'}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#1F3A26]">
                            ₹{basePrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-4 font-bold text-emerald-700">
                            ₹{advanceAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-4 font-medium text-[#6E6E6E]">
                            ₹{remainingAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => {
                                if (onOpenBooking) {
                                  onOpenBooking(svc, svc.category);
                                } else {
                                  onNavigate('services');
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F3A26] text-white text-xs font-semibold hover:bg-[#C9A66B] hover:text-[#1F3A26] transition-colors cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Book Slot</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RETAIL PRODUCTS PRICING */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProductCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedProductCategory === cat
                      ? 'bg-[#1F3A26] text-white'
                      : 'bg-white text-[#6E6E6E] border border-gray-200 hover:border-[#1F3A26]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1F3A26] text-white text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">Product Name</th>
                      <th className="py-4 px-4 font-semibold">Category</th>
                      <th className="py-4 px-4 font-semibold">SKU / Volume</th>
                      <th className="py-4 px-4 font-semibold">Selling Price</th>
                      <th className="py-4 px-4 font-semibold">Original MRP</th>
                      <th className="py-4 px-4 font-semibold">Availability</th>
                      <th className="py-4 px-6 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#1A1A1A]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FBF9F5] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#1F3A26]">{prod.name}</div>
                          {prod.brand && (
                            <div className="text-[11px] text-[#C9A66B] font-semibold">{prod.brand}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs font-medium text-[#4A4A4A]">
                          {prod.category}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#6E6E6E]">
                          {prod.volume || prod.sku || 'Standard Size'}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#1F3A26]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-400 line-through">
                          {prod.originalPrice ? `₹${prod.originalPrice.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" /> In Stock
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              if (onAddToCart) {
                                onAddToCart(prod, 1);
                              } else {
                                onNavigate('shop');
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F3A26] text-white text-xs font-semibold hover:bg-[#C9A66B] hover:text-[#1F3A26] transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
