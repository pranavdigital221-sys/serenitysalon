import React from 'react';
import { Sparkles, Leaf, ShieldCheck, Heart, Award, Users, ArrowRight } from 'lucide-react';
import { PageView } from '../../types';
import { TESTIMONIALS } from '../../data/mockData';
import { AVATAR_ASSETS, BANNER_ASSETS, CATEGORY_ASSETS } from '../../utils/assets';
import { SafeImage } from '../common/SafeImage';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const teamMembers = [
    {
      name: 'Aasha Gandal',
      role: 'Founder of Serenity Salon',
      image: AVATAR_ASSETS.avatar1,
      bio: 'Over 14 years of clinical aromatherapy and clean cosmetic formulation experience.'
    },
    {
      name: 'Dr. Clara Sterling',
      role: 'Head Botanical Formulator',
      image: AVATAR_ASSETS.avatar5,
      bio: 'PhD in Phytochemistry specializing in stabilized antioxidants and plant liposomes.'
    },
    {
      name: 'Marcus Hayes',
      role: 'Director of Ethical Sourcing',
      image: AVATAR_ASSETS.avatar6,
      bio: 'Partnering directly with women-led organic farming cooperatives across 8 countries.'
    }
  ];

  return (
    <div className="bg-[#F7F5F1] min-h-screen">
      
      {/* Hero Banner */}
      <section className="relative bg-[#1F3A26] text-white py-16 sm:py-24 px-4 sm:px-6 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-[#C9A66B]/30 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Botanical Heritage</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5">
            Your Journey to <span className="text-[#C9A66B]">Effortless Elegance</span>
          </h1>

          <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            We believe true radiance begins when pure earth botanicals harmonize with biocompatible cellular science.
          </p>
        </div>
      </section>

      {/* Expanded Story & Collage */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Collage (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-[20px] overflow-hidden aspect-[4/5] shadow-md">
              <SafeImage
                src={CATEGORY_ASSETS.skincare}
                alt="Botanical harvesting"
                className="w-full h-full object-cover"
                fallbackType="service"
              />
            </div>
            <div className="rounded-[20px] overflow-hidden aspect-[4/5] shadow-md mt-8">
              <SafeImage
                src={BANNER_ASSETS.hero}
                alt="Radiant skincare glow"
                className="w-full h-full object-cover"
                fallbackType="avatar"
              />
            </div>
          </div>

          {/* Right Copy (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block">
              The Genesis of Serenity Salon
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight">
              Rooted in Nature, <span className="text-[#C9A66B]">Refined by Science</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E6E] leading-relaxed">
              Founded by Aasha Gandal, Serenity Salon emerged from a personal quest to formulate truly effective clean cosmetics and deliver bespoke salon therapies that don't compromise skin health or the planet.
            </p>
            <p className="text-sm sm:text-base text-[#6E6E6E] leading-relaxed">
              Every formula is compounded in recyclable glass apothecary bottles, protecting active plant enzymes from photodecomposition without harsh synthetic preservatives or petrochemical fillers.
            </p>

            {/* Founder Signature */}
            <div className="pt-4 border-t border-gray-100">
              <span className="font-script text-3xl sm:text-4xl text-[#1F3A26] font-bold block">
                Aasha Gandal
              </span>
              <span className="text-xs font-semibold text-[#6E6E6E] uppercase tracking-wider">
                Aasha Gandal — Founder of Serenity Salon
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3-Stat Band */}
      <section className="py-12 bg-[#F7F5F1] px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-[#1F3A26] text-white rounded-[24px] p-8 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-2 sm:pt-0">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-[#C9A66B] block">24+</span>
              <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Curated Categories</span>
            </div>
            <div className="pt-4 sm:pt-0">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-[#C9A66B] block">2,500+</span>
              <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Botanical Formulations</span>
            </div>
            <div className="pt-4 sm:pt-0">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-[#C9A66B] block">99%</span>
              <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Satisfied Customer Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Core Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
              Our Commitments
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Pillars of <span className="text-[#C9A66B]">Clean Beauty</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-[20px] bg-[#F7F5F1] border border-[#1F3A26]/5 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-2">100% Wild-Harvested Flora</h3>
              <p className="text-xs sm:text-sm text-[#6E6E6E] leading-relaxed">
                Cold-pressed seed lipids, certified organic essential hydrosols, and biodynamic floral waxes.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#F7F5F1] border border-[#1F3A26]/5 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-2">Zero Toxic Additives</h3>
              <p className="text-xs sm:text-sm text-[#6E6E6E] leading-relaxed">
                Formulated strictly without parabens, sulfates, silicones, phthalates, synthetic fragrance, or microplastics.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#F7F5F1] border border-[#1F3A26]/5 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center mb-4">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-2">Cruelty-Free &amp; Sustainable</h3>
              <p className="text-xs sm:text-sm text-[#6E6E6E] leading-relaxed">
                Leaping Bunny certified, 100% vegan, encased in endlessly recyclable UV-protective miron glass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F7F5F1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
              The Creators
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Meet Our <span className="text-[#C9A66B]">Formulators</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-6 text-center shadow-sm border border-[#1F3A26]/8 flex flex-col items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-2 border-[#C9A66B]/40 shadow-md">
                  <SafeImage
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    fallbackType="avatar"
                  />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-1">{member.name}</h3>
                <span className="text-xs font-semibold text-[#C9A66B] uppercase tracking-wider mb-3 block">{member.role}</span>
                <p className="text-xs text-[#6E6E6E] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner Before Footer */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto bg-[#1F3A26] rounded-[28px] p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold mb-3">
            Experience the <span className="text-[#C9A66B]">Botanical Difference</span> Today
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto mb-6">
            Join over 25,000 women who have transformed their skin with our non-toxic cold-pressed apothecary rituals.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-[#C9A66B] text-[#1F3A26] hover:text-white font-bold text-sm inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Discover Our Products</span>
            <ArrowRight className="w-4 h-4 text-[#1F3A26]" />
          </button>
        </div>
      </section>

    </div>
  );
};
