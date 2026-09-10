import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, Truck, CreditCard, Headphones, Sparkles, ArrowRight } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/mockData';

interface FAQSectionProps {
  onOpenContactModal?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenContactModal }) => {
  // First item open by default with green highlight background
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs-section" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F7F5F1]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
            FAQs
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Question? <span className="text-[#C9A66B]">Look here.</span>
          </h2>
        </div>

        {/* Main Grid: Left Accordion (8 cols) + Right Contact Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Accordion List (8 cols) */}
          <div className="lg:col-span-8 space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id}
                  className={`rounded-[20px] transition-all duration-300 overflow-hidden border ${
                    isOpen
                      ? 'bg-[#1F3A26] text-white border-[#1F3A26] shadow-md'
                      : 'bg-white text-[#1A1A1A] border-gray-200/70 hover:border-[#1F3A26]/30'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`font-heading font-bold text-base sm:text-lg ${isOpen ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#C9A66B] text-[#1F3A26]'
                          : 'bg-[#F7F5F1] text-gray-700'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm leading-relaxed text-white/85 border-t border-white/10 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dark Green Contact Callout Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#1F3A26] rounded-[24px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            {/* Background circular accent */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#C9A66B]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#C9A66B] text-[#1F3A26] flex items-center justify-center mb-5 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2 text-white">
                You have different questions?
              </h3>
              
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                Our team of certified holistic skincare specialists and formulators is here to assist your routine every day.
              </p>

              <button
                onClick={onOpenContactModal}
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#C9A66B] text-[#1F3A26] hover:text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/70 space-y-1">
                <p><strong>Response time:</strong> Under 15 minutes</p>
                <p><strong>Available:</strong> Mon - Sat: 9AM – 8PM IST</p>
              </div>
            </div>
          </div>

        </div>

        {/* Below 3-Column Trust Icon Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#1F3A26]/10">
          
          {/* Trust 1: Free Shipping */}
          <div className="bg-white rounded-[20px] p-6 flex items-start gap-4 border border-[#1F3A26]/5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
                Free Express Shipping
              </h4>
              <p className="text-xs text-[#6E6E6E] leading-relaxed">
                Enjoy free expedited delivery across India on all orders over ₹999.
              </p>
            </div>
          </div>

          {/* Trust 2: Flexible Payment */}
          <div className="bg-white rounded-[20px] p-6 flex items-start gap-4 border border-[#1F3A26]/5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
                Flexible &amp; Secure Payment
              </h4>
              <p className="text-xs text-[#6E6E6E] leading-relaxed">
                Shop with complete peace of mind using UPI (GPay, PhonePe), Cards, NetBanking &amp; COD.
              </p>
            </div>
          </div>

          {/* Trust 3: 24x7 Support */}
          <div className="bg-white rounded-[20px] p-6 flex items-start gap-4 border border-[#1F3A26]/5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
                24×7 Expert Esthetician Support
              </h4>
              <p className="text-xs text-[#6E6E6E] leading-relaxed">
                Personalized skincare ritual consultations and order guidance whenever you need us.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
