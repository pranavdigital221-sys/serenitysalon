import React from 'react';
import { Clock, Sparkles, Check, Calendar, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { SalonService } from '../../types';

interface ServiceCardProps {
  service: SalonService;
  onBookNow: (service: SalonService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  return (
    <div className="group bg-white rounded-[20px] p-5 sm:p-6 border border-[#1F3A26]/8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">
      
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {service.badge ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-[#FDF1E4] text-[#1F3A26] px-2.5 py-0.5 rounded-full border border-[#C9A66B]/30">
            <Sparkles className="w-3 h-3 text-[#C9A66B]" />
            {service.badge}
          </span>
        ) : service.tag ? (
          <span className="text-[11px] font-semibold text-[#6E6E6E] bg-[#F7F5F1] px-2.5 py-0.5 rounded-full">
            {service.tag}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-[#6E6E6E] bg-[#F7F5F1] px-2.5 py-0.5 rounded-full">
            {service.category}
          </span>
        )}

        {service.duration && (
          <span className="inline-flex items-center gap-1 text-xs text-[#6E6E6E] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
            {service.duration}
          </span>
        )}
      </div>

      {/* Main Service Info */}
      <div>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1F3A26] mb-2 group-hover:text-[#4F7358] transition-colors leading-snug">
          {service.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#6E6E6E] leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Inclusions list */}
        {service.includes && service.includes.length > 0 && (
          <div className="mb-4 pt-3 border-t border-gray-100">
            <span className="text-[10px] uppercase font-bold text-[#1F3A26] tracking-wider block mb-2">
              Ritual Inclusions:
            </span>
            <ul className="space-y-1.5">
              {service.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-[#1A1A1A]">
                  <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Price & Action footer */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
        <div>
          <span className="text-[10px] text-gray-500 font-semibold uppercase block">Pricing</span>
          <span className="text-xs sm:text-sm font-bold text-[#1F3A26]">
            {service.priceText}
          </span>
        </div>

        <button
          onClick={() => onBookNow(service)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold transition-all shadow-xs cursor-pointer group-hover:shadow-md shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
          <span>Book Now</span>
          <ArrowRight className="w-3 h-3 text-[#C9A66B] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </div>
  );
};
