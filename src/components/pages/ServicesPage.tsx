import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Scissors,
  Heart,
  ShieldCheck,
  Leaf,
  Flower2,
  ChevronDown,
  Clock,
  Phone,
  CheckCircle2,
  Filter,
  Star,
  Zap,
} from 'lucide-react';
import { PageView, SalonService } from '../../types';
import {
  SERVICE_CATEGORIES,
  SALON_SERVICES,
  SERVICES_FAQS,
  WHY_CHOOSE_BENEFITS,
  SERVICE_HERO_DATA_URI,
} from '../../data/servicesData';
import { ServiceCard } from '../services/ServiceCard';
import { SafeImage } from '../common/SafeImage';
import { BANNER_ASSETS, CATEGORY_ASSETS } from '../../utils/assets';

interface ServicesPageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: (service?: SalonService, category?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-srv-1');
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  // SEO document title update
  useEffect(() => {
    document.title = 'Services | Serenity Salon — Luxury Beauty & Wellness Experiences';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Explore beauty, hair, skincare, makeup, nail and wellness services at Serenity Salon. Discover a personalized salon experience designed around you.'
      );
    }
  }, []);

  const scrollToCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryCardClick = (catName: string) => {
    setActiveCategoryTab(catName);
    const element = document.getElementById(catName.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hairServices = SALON_SERVICES.filter((s) => s.category === 'Hair Services');
  const skinServices = SALON_SERVICES.filter((s) => s.category === 'Skin & Facial');
  const makeupServices = SALON_SERVICES.filter((s) => s.category === 'Makeup & Beauty');
  const nailServices = SALON_SERVICES.filter((s) => s.category === 'Nail Care');
  const spaServices = SALON_SERVICES.filter((s) => s.category === 'Spa & Wellness');

  return (
    <div className="bg-[#F7F5F1] text-[#1A1A1A] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1F3A26] text-white py-16 sm:py-24">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4F7358]/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Text Block */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C9A66B]/30 text-xs font-semibold text-[#C9A66B] backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>Bespoke Salon &amp; Wellness Rituals</span>
              </div>

              {/* H1 Primary Heading */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Beauty &amp; <span className="text-[#C9A66B] italic font-serif">Wellness Services</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Personalized beauty, hair and wellness experiences designed to help you look and feel your best.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C9A66B] hover:bg-[#b08e54] text-[#1F3A26] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
                >
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={scrollToCategories}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Services</span>
                  <ChevronDown className="w-4 h-4 text-[#C9A66B]" />
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="font-heading font-bold text-xl sm:text-2xl text-[#C9A66B] block">25+</span>
                  <span className="text-[11px] text-gray-300">Curated Services</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="font-heading font-bold text-xl sm:text-2xl text-[#C9A66B] block">100%</span>
                  <span className="text-[11px] text-gray-300">Clean Botanical Actives</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="font-heading font-bold text-xl sm:text-2xl text-[#C9A66B] block">4.9 ★</span>
                  <span className="text-[11px] text-gray-300">Client Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-[28px] overflow-hidden border-2 border-[#C9A66B]/30 shadow-2xl bg-white/5 p-2">
                <SafeImage
                  src={SERVICE_HERO_DATA_URI || BANNER_ASSETS.hero}
                  alt="Serenity Salon luxury beauty sanctuary interior"
                  className="w-full h-full object-cover rounded-[22px]"
                  fallbackType="service"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-[#1F3A26]/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1F3A26] block">
                      Consultation Included
                    </span>
                    <span className="text-[11px] text-gray-600">
                      Tailored hair &amp; skin analysis with every visit
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES CATEGORIES CARDS */}
      <section ref={categoriesRef} className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] block mb-2">
            Service Spectrum
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1F3A26] tracking-tight mb-3">
            Explore by Category
          </h2>
          <p className="text-sm text-[#6E6E6E]">
            From precision haircutting and glowing facial therapies to relaxing aromatherapy rituals.
          </p>
        </div>

        {/* 5 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {SERVICE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryCardClick(category.name)}
              className="group bg-white rounded-[24px] overflow-hidden border border-[#1F3A26]/8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
            >
              {/* Category Image Header */}
              <div className="aspect-4/3 w-full overflow-hidden relative bg-[#F7F5F1]">
                <SafeImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  fallbackType="category"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#1F3A26] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {category.serviceCount} Services
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-1.5 group-hover:text-[#C9A66B] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#6E6E6E] line-clamp-2 leading-relaxed mb-4">
                    {category.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-full bg-[#F7F5F1] group-hover:bg-[#1F3A26] text-[#1F3A26] group-hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Services</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY FILTER TABS FOR QUICK BROWSING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F3A26] uppercase tracking-wider">
            <Filter className="w-4 h-4 text-[#C9A66B]" />
            <span>Filter Category View:</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {['All', 'Hair Services', 'Skin & Facial', 'Makeup & Beauty', 'Nail Care', 'Spa & Wellness'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategoryTab === tab
                    ? 'bg-[#1F3A26] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-[#FDF1E4] hover:text-[#1F3A26] border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DETAILED SERVICES SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 pt-6">
        
        {/* SECTION 1: HAIR SERVICES */}
        {(activeCategoryTab === 'All' || activeCategoryTab === 'Hair Services') && (
          <section id="hair-services" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1F3A26]/10">
              <div>
                <div className="flex items-center gap-2 text-[#C9A66B] mb-1">
                  <Scissors className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Hair Artistry &amp; Care</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A26]">
                  Hair Services
                </h2>
              </div>
              <button
                onClick={() => onOpenBooking(undefined, 'Hair Services')}
                className="mt-3 sm:mt-0 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Book Hair Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookNow={(s) => onOpenBooking(s, 'Hair Services')}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: SKIN & FACIAL */}
        {(activeCategoryTab === 'All' || activeCategoryTab === 'Skin & Facial') && (
          <section id="skin-&-facial" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1F3A26]/10">
              <div>
                <div className="flex items-center gap-2 text-[#C9A66B] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Radiance &amp; Glow</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A26]">
                  Skin &amp; Facial
                </h2>
              </div>
              <button
                onClick={() => onOpenBooking(undefined, 'Skin & Facial')}
                className="mt-3 sm:mt-0 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Book Skin Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skinServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookNow={(s) => onOpenBooking(s, 'Skin & Facial')}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: MAKEUP & BEAUTY */}
        {(activeCategoryTab === 'All' || activeCategoryTab === 'Makeup & Beauty') && (
          <section id="makeup-&-beauty" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1F3A26]/10">
              <div>
                <div className="flex items-center gap-2 text-[#C9A66B] mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Occasion &amp; Bridal Art</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A26]">
                  Makeup &amp; Beauty
                </h2>
              </div>
              <button
                onClick={() => onOpenBooking(undefined, 'Makeup & Beauty')}
                className="mt-3 sm:mt-0 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Book Bridal / Event Artist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {makeupServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookNow={(s) => onOpenBooking(s, 'Makeup & Beauty')}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: NAIL CARE */}
        {(activeCategoryTab === 'All' || activeCategoryTab === 'Nail Care') && (
          <section id="nail-care" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1F3A26]/10">
              <div>
                <div className="flex items-center gap-2 text-[#C9A66B] mb-1">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Hands &amp; Feet Rituals</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A26]">
                  Nail Care
                </h2>
              </div>
              <button
                onClick={() => onOpenBooking(undefined, 'Nail Care')}
                className="mt-3 sm:mt-0 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Book Nail Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nailServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookNow={(s) => onOpenBooking(s, 'Nail Care')}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: SPA & WELLNESS */}
        {(activeCategoryTab === 'All' || activeCategoryTab === 'Spa & Wellness') && (
          <section id="spa-&-wellness" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#1F3A26]/10">
              <div>
                <div className="flex items-center gap-2 text-[#C9A66B] mb-1">
                  <Flower2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Holistic Restoration</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A26]">
                  Spa &amp; Wellness
                </h2>
              </div>
              <button
                onClick={() => onOpenBooking(undefined, 'Spa & Wellness')}
                className="mt-3 sm:mt-0 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Book Spa Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookNow={(s) => onOpenBooking(s, 'Spa & Wellness')}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* 4. MID-PAGE BOOK APPOINTMENT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <div className="bg-[#1F3A26] text-white rounded-[28px] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl border border-[#C9A66B]/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A66B]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] block">
              Personalized Salon Concierge
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-snug">
              Ready for Your Next Beauty Experience?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Choose your service and let Serenity Salon create a personalized experience for you.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C9A66B] hover:bg-[#b08e54] text-[#1F3A26] font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>
              <a
                href="tel:+918108765851"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C9A66B]" />
                <span>Call +91 8108765851</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE SERENITY SALON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] block mb-2">
            The Serenity Standard
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1F3A26]">
            Why Choose Serenity Salon?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_BENEFITS.map((benefit, idx) => {
            const IconComponent =
              idx === 0
                ? Sparkles
                : idx === 1
                ? ShieldCheck
                : idx === 2
                ? Leaf
                : Flower2;

            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] p-6 border border-[#1F3A26]/8 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center mb-4 border border-[#C9A66B]/30 shadow-2xs">
                  <IconComponent className="w-6 h-6 text-[#C9A66B]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#6E6E6E] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] block mb-2">
            Client Assistance
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1F3A26]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {SERVICES_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#1F3A26]/8 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#1F3A26] hover:bg-[#F7F5F1] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C9A66B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#6E6E6E] leading-relaxed border-t border-gray-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION (Bottom of Page) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <div className="bg-[#FDF1E4] rounded-[28px] p-8 sm:p-14 text-center border border-[#C9A66B]/30 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F3A26] block">
              Serenity Salon &amp; Spa
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1F3A26] leading-tight">
              Your Beauty. Your Moment. Your Serenity.
            </h2>
            <p className="text-sm text-[#6E6E6E] leading-relaxed max-w-lg mx-auto">
              Treat yourself to a restorative beauty experience crafted exclusively around your needs.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-9 py-4 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2.5"
              >
                <Calendar className="w-4 h-4 text-[#C9A66B]" />
                <span>Book Your Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
