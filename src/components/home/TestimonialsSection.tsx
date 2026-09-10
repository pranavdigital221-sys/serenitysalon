import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../../data/mockData';
import { SafeImage } from '../common/SafeImage';

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials-section" className="py-16 sm:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Testimonials from <span className="text-[#C9A66B]">Our Loyal Customers</span>
          </h2>
        </div>

        {/* Row of Customer Avatars */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          {TESTIMONIALS.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`View review from ${item.name}`}
                className={`relative rounded-full transition-all duration-300 p-1 cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-[#C9A66B] ring-offset-2 scale-110'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <SafeImage
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-md"
                  fallbackType="avatar"
                />
              </button>
            );
          })}
        </div>

        {/* Centered Testimonial Quote Card Flanked by Prev / Next Buttons */}
        <div className="relative flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Prev Button (Gold Circle) */}
          <button
            onClick={handlePrev}
            aria-label="Previous Testimonial"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C9A66B] text-white flex items-center justify-center shadow-md hover:bg-[#1F3A26] transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Quote Card */}
          <div className="flex-1 bg-[#F7F5F1] rounded-[24px] p-6 sm:p-10 text-center border border-[#1F3A26]/8 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-white text-[#C9A66B] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Quote className="w-5 h-5 fill-current" />
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C9A66B] text-[#C9A66B]" />
              ))}
            </div>

            {/* Bold Quote Line */}
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1F3A26] mb-3 leading-snug">
              "{current.quoteTitle}"
            </h3>

            {/* Comment Body */}
            <p className="text-sm sm:text-base text-[#6E6E6E] leading-relaxed max-w-xl mx-auto mb-6">
              {current.comment}
            </p>

            {/* Customer Name & Badge */}
            <div>
              <span className="font-heading font-bold text-base text-[#1A1A1A] block">
                {current.name}
              </span>
              <span className="text-xs font-medium text-[#C9A66B] uppercase tracking-wider block mt-0.5">
                {current.role} • Verified Glow User
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">
                Used: {current.productUsed}
              </span>
            </div>
          </div>

          {/* Next Button (Green Circle) */}
          <button
            onClick={handleNext}
            aria-label="Next Testimonial"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1F3A26] text-white flex items-center justify-center shadow-md hover:bg-[#4F7358] transition-colors cursor-pointer shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </section>
  );
};
